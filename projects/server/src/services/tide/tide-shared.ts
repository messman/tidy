import { DateTime } from 'luxon';
import {
	constant, isServerError, TideLevelBeachStatus, TideLevelDirection, TideLevelDivision, TidePointBeachChange, TidePointCurrent, TidePointCurrentSource, TidePointExtreme, TidePointExtremeComp,
	TidePointExtremeDay, TidePointFromExtremes
} from '@wbtdevlocal/iso';
import { ServerPromise } from '../../api/error';
import { BaseConfig } from '../config';
import { LogContext } from '../logging/pino';
import { fetchTidesNOAA } from './tide-fetch';
import { fetchTidesGoMOFS } from './tide-fetch-gomofs';

export function createTidePointExtremeId(time: DateTime, source: string): string {
	return `tide-${source}-${time.toMillis()}`;
}

export interface TideFetched {
	waterTemp: number;
	current: number;
	source: TidePointCurrentSource;
	extrema: TidePointExtremeComp[];
}

export async function fetchTides(ctx: LogContext, config: BaseConfig): ServerPromise<TideFetched> {
	const fetchedTideGoMOFS = await fetchTidesGoMOFS(ctx, config);
	if (isServerError(fetchedTideGoMOFS)) {
		return fetchedTideGoMOFS;
	}

	const fetchedTideNOAA = await fetchTidesNOAA(ctx, config);
	if (isServerError(fetchedTideNOAA)) {
		return fetchedTideNOAA;
	}

	/*
		The data we have:
		- (Likely) current water level from Portland, plus time
			- Not the same height system basis as Wells
			- May be time-delayed more than our other data
		- Astronomical tide extremes from NOAA for Portland
			- Doesn't take weather into account
		- Astronomical tide extremes from NOAA for Wells
			- Doesn't take weather into account
		- GoMOFS water level, plus time
			- Taken from forecasts, <=6 minutes behind
		- GoMOFS extremes
			- Taken from forecasts, slightly inaccurate
		
		**None of this data is exactly correct**. Don't strive for perfection.
		From research, it seems like:
		- Astro tide extremes are typically too low on their highs, but accurate on lows
		- GoMOFS forecasts make up for the above, but can be a little *too* high;
			actually slightly more inaccurate than the Astro tide extremes at highs.

		So the plan is to return this data structure:
		- "extrema"
			a combination of astro tide extremes and their GoMOFS equivalents
		- "current"
			a combination of 
			1. The Portland value, compensated for Wells
			2. The GoMOFS current water level
			3. The computed value from the extrema above
		- "source"
			All the extra data for us to use to review the effectiveness of this
	*/

	const { approxStationOffset, extrema: ofsExtrema, forecastEntryTimeUtc, retries, station, waterLevel: ofsWaterLevel, waterLevelTime: ofsWaterLevelTime, waterTemp } = fetchedTideGoMOFS;
	const { portlandCurrent, portlandExtrema, wellsExtrema } = fetchedTideNOAA;

	/*
		We've got to somehow match up the OFS and astronomical extreme data. They likely have slightly different times.
		Also, we don't have an OFS extreme for every astronomical extreme.
	*/
	const extremaComp: TidePointExtremeComp[] = [];

	// Offset each extreme so we always know the order is ofs->astro.
	const offsetOfsExtrema = ofsExtrema.map((point) => {
		return {
			...point,
			offsetTime: point.time.minus({ hour: 1 })
		};
	});
	let ofsExtremaIndex = 0;
	wellsExtrema.forEach((wellsAstroExtreme) => {
		const ofs = offsetOfsExtrema[ofsExtremaIndex];
		if (!ofs || ofs.offsetTime > wellsAstroExtreme.time) {
			// No OFS extreme to use
			extremaComp.push({
				...wellsAstroExtreme,
				astro: {
					height: wellsAstroExtreme.height,
					time: wellsAstroExtreme.time
				},
				ofs: null
			});
			return;
		}

		// We have two extremes to merge
		// Set up for next
		ofsExtremaIndex++;

		// Let's just do an average of these values.
		const compTime = DateTime.fromMillis((wellsAstroExtreme.time.toMillis() + ofs.time.toMillis()) / 2, { zone: wellsAstroExtreme.time.zone });
		const compHeight = (wellsAstroExtreme.height + ofs.height) / 2;

		extremaComp.push({
			id: createTidePointExtremeId(compTime, 'comp'),
			time: compTime,
			height: compHeight,
			isLow: wellsAstroExtreme.isLow,
			astro: {
				height: wellsAstroExtreme.height,
				time: wellsAstroExtreme.time
			},
			ofs: {
				height: ofs.height,
				time: ofs.time
			}
		});
	});

	const computedCurrent = getComputedBetweenPredictions(config, extremaComp);
	const wellsAstroComputed = getComputedBetweenPredictions(config, wellsExtrema);
	// Let this be our height if we can't scale by portland at all.
	let current = computedCurrent.height;

	let portlandAdjusted: number | null = null;
	let portlandComputed: TidePointFromExtremes | null = null;
	if (portlandCurrent) {
		/*
			What's the goal of using Portland? Well, it's close by, and it's the only real measurement we have.
			So if we can adjust it to Wells somehow, we can maybe get more accurate information.
			The main way we can see this helping is after storms when water levels have increased in multiple areas - if we 
			can detect that in Portland, we can adjust for it in Wells also.

			For our users, it might make even more confusion, because not only does it seems like we're not using the regular
			hi/lo charts, but if the Portland value changes the value we say is the "current water level", then it would seem like
			those adjusted hi/lo that we use are still not fully accurate. But oh well.

			For compensation:

			Portland value is (1) a different height system and (2) a little later than the computed values.
			That we know for sure. But we don't really know about *to what extent* those are factors.

			For the height:
			According to the bottom of https://tidesandcurrents.noaa.gov/datum_options.html, it's nearly impossible to
			accurately compare one station's values to another. There are so many potential variation points.
			
			Then there's the difference of it being slightly more "in the bay", though this seems somewhat negligible:
			https://tidesandcurrents.noaa.gov/ofs/ofs_mapplots.html?ofsregion=gom&subdomain=0&model_type=wl_nowcast

		*/
		portlandComputed = getComputedBetweenPredictions(config, portlandExtrema);
		const { nextExtreme, height } = portlandComputed;

		/*
			For the time: let's just do something simple and rough. Pull our Portland value toward the next extreme (linearly) based on the time diff.
			This will mean that when the Portland value is at the extremes and is outside the range (like it's reporting 12 feet but the high is only supposed to be 10)
			the portland value will become a bit more muted, but just by the amount of the time difference.
		*/
		const secondsBetweenMeasuredAndReferenceTime = config.referenceTime.diff(portlandCurrent.time, 'seconds').seconds;
		const secondsBetweenMeasuredAndNextExtremeTime = nextExtreme.time.diff(portlandCurrent.time, 'seconds').seconds;
		const percentDiff = secondsBetweenMeasuredAndReferenceTime / secondsBetweenMeasuredAndNextExtremeTime;
		const range = Math.abs(nextExtreme.height - portlandCurrent.value);
		const offsetAmount = (nextExtreme.isLow ? -1 : 1) * range * percentDiff;
		const portlandAdjustedForTime = portlandCurrent.value + offsetAmount;

		/*
			So we have adjusted for time, and potentially slightly muted the portland value (as in, brought it closer to the astronomical value).
			Now compare it to that astronomical value, and get some sort of factor of "how portland's measured value is differing from astronomical expectation".
			We can take that factor and apply it to the Wells astronomical expectation to get some value like "how Wells water level is likely differing from 
			astronomical expectation", and we can modify our computed current value accordingly.

			Now compare this to the computed (astronomical) height, and use that to push up/down our understanding of Wells.

		*/
		const portlandAdjustedToAstroFactor = portlandAdjustedForTime / height;
		portlandAdjusted = wellsAstroComputed.height * portlandAdjustedToAstroFactor;

		const oldCurrent = current;
		// At this point we don't have a ton of logic guiding us.... it's just a "this should hopefully be close enough" thing.
		// We're saying it's half "astro/OFS data" and half "what portland is telling us it should be in Wells".
		current = (oldCurrent + portlandAdjusted) / 2;
		current = Math.round(current * 100) / 100;
	}

	return {
		waterTemp,
		current,
		extrema: extremaComp,
		source: {
			computed: computedCurrent,
			ofsComputed: getComputedBetweenPredictions(config, ofsExtrema),
			astroComputed: wellsAstroComputed,
			portland: portlandCurrent ? { height: portlandCurrent.value, time: portlandCurrent.time } : null,
			portlandAdjustment: portlandCurrent ? portlandAdjusted : null,
			portlandComputed: portlandComputed,
			ofsInterval: {
				height: ofsWaterLevel,
				time: ofsWaterLevelTime
			},
			ofsEntryTimeUtc: forecastEntryTimeUtc,
			ofsRetries: retries,
			ofsStation: station,
			ofsOffset: approxStationOffset,
		}
	} satisfies TideFetched;
}


/**
 * Based on the reference time, get what we think the height is.
 * This logic is based off the same logic used for beach access height time.
 */
export function getComputedBetweenPredictions(config: BaseConfig, extrema: TidePointExtreme[]): TidePointFromExtremes {
	const { referenceTime } = config;

	// get previous and next
	let previous: TidePointExtreme = null!;
	let next: TidePointExtreme = null!;

	for (let i = 0; i < extrema.length; i++) {
		if (extrema[i].time >= referenceTime) {
			previous = extrema[i - 1];
			next = extrema[i];
			break;
		}
	}

	return {
		previousExtreme: previous,
		nextExtreme: next,
		time: referenceTime,
		height: computeHeightAtTimeBetweenPredictions(previous, next, referenceTime)
	};
}

/**
 * Uses the cosine function to compute/guess the height at a time between two tide extremes. Used for testing and for computation.
*/
function computeHeightAtTimeBetweenPredictions(previousExtreme: TidePointExtreme, nextExtreme: TidePointExtreme, referenceTime: DateTime): number {
	/*
		Use cosine function, where our domain is [0, pi] for high -> low or [pi, 2pi] for low -> high
		and our range is [-1, 1].
		(See https://www.math.net/cosine)

		So figure out which direction we're headed, restrict
		to our domain and range, and compute.
	*/
	const a: TidePointExtreme = previousExtreme;
	const b: TidePointExtreme = nextExtreme;

	const totalSeconds = b.time.diff(a.time, 'seconds').seconds;
	const timeAsPercent = referenceTime.diff(a.time, 'seconds').seconds / totalSeconds; // [0, 1]

	let radian = timeAsPercent * Math.PI; // [0, pi]
	if (a.isLow) {
		radian += Math.PI; // [pi, 2pi]
	}

	const cosine = Math.cos(radian); // [-1, 1]
	const adjusted = (cosine + 1) / 2; // [0, 1]

	let [high, low] = [a.height, b.height];
	if (a.isLow) {
		[low, high] = [high, low];
	}
	const height = ((high - low) * adjusted) + low;
	const heightWithPrecision = parseFloat(height.toFixed(1));
	return heightWithPrecision;
}



function computeTimeForTideHeight(heightPercent: number, fromTime: DateTime, toTime: DateTime): DateTime {
	// Clamp
	heightPercent = Math.min(1, Math.max(0, heightPercent));

	// Number starts as [0, 1]
	const beachAccessHeightInDomain = (heightPercent * 2) - 1; // Get to [-1, 1]
	const radian = Math.acos(beachAccessHeightInDomain);
	const radianAsPercent = radian / Math.PI; // Get to [0, 1]
	const secondsRange = toTime.diff(fromTime, 'seconds').seconds;
	const secondsFrom = radianAsPercent * secondsRange;
	const time = fromTime.plus({ seconds: secondsFrom });
	return time;
}

function getTidePointBeachSwapsBetween(a: TidePointExtreme, b: TidePointExtreme): TidePointBeachChange[] {
	/*
		Use arccosine function, where our domain is [-1, 1] and range is [0, pi]
		So translate our beach height into that domain, and then map the result back out to the time between.
		(See https://www.math.net/arccos)
	*/

	let [low, high] = [a.height, b.height];
	const isStartLow = a.isLow;
	if (!isStartLow) {
		[low, high] = [high, low];
	}

	const { covered, uncovered } = constant.beachAccess;
	const heightRange = (high - low);

	// Use percents to get to [0, 1].
	let firstHeightPercent = (covered - low) / heightRange;
	let firstStatus = TideLevelBeachStatus.between;
	let secondHeightPercent = (uncovered - low) / heightRange;
	let secondStatus = TideLevelBeachStatus.uncovered;

	if (isStartLow) {
		// If we started low, we need to flip at some point. Do it here while we understand our domain.
		firstHeightPercent = (uncovered - low) / heightRange;
		firstHeightPercent = 1 - firstHeightPercent;
		firstStatus = TideLevelBeachStatus.between;
		secondHeightPercent = (covered - low) / heightRange;
		secondHeightPercent = 1 - secondHeightPercent;
		secondStatus = TideLevelBeachStatus.covered;
	}

	const changes: TidePointBeachChange[] = [];

	// Check to ensure our constants aren't bringing us outside of the extremes (could happen with test data)
	// Will be less than zero if too low, and above one if too high.
	if (firstHeightPercent >= 0 && firstHeightPercent <= 1) {
		changes.push({
			time: computeTimeForTideHeight(firstHeightPercent, a.time, b.time),
			toStatus: firstStatus
		});
	}

	if (secondHeightPercent >= 0 && secondHeightPercent <= 1) {
		changes.push({
			time: computeTimeForTideHeight(secondHeightPercent, a.time, b.time),
			toStatus: secondStatus
		});
	}

	return changes;
}

/** Return all the points in time where we cross our beach access height. */
function getTidePointBeachChanges(extrema: TidePointExtreme[]): TidePointBeachChange[] {
	/*
		We know we will hit this point in time at most one time between each extrema, because we will be assuming
		that we'll never go outside the predicted tide extremes.
	*/
	let changes: TidePointBeachChange[] = [];
	for (let i = 0; i < extrema.length; i++) {
		if (i === extrema.length - 1) {
			break;
		}
		const changesBetween = getTidePointBeachSwapsBetween(extrema[i], extrema[i + 1]);
		changes.push(...changesBetween);
	}

	// Filter out any repeated items
	changes.filter((change, i) => {
		return i === 0 || (change.toStatus !== changes[i - 1].toStatus);
	});
	return changes;
}

/** If within this time (on either side), say we're at the extreme. */
const currentExtremeBoundMinutes = 10;

function getTidePreviousNext(extrema: TidePointExtreme[], measuredOrComputedHeight: number, referenceTime: DateTime): [TidePointExtreme, TidePointExtreme | null, TidePointExtreme] {
	let current: TidePointExtreme | null = null;
	let previous: TidePointExtreme = null!;
	let next: TidePointExtreme = null!;

	/*
		These are predictions we're working off of, and in earlier steps we made sure we got tides
		from the start of the day before, so we should have no issues with range.

			b  C  u             b   C   u
		L           H              L            H          L
		-------------------------------------------------------
	*/
	const referenceTimeCurrentLowerBound = referenceTime.minus({ minutes: currentExtremeBoundMinutes });
	const referenceTimeCurrentUpperBound = referenceTime.plus({ minutes: currentExtremeBoundMinutes });

	for (let i = 0; i < extrema.length; i++) {
		const extreme = extrema[i];

		// Be fuzzy on the time - accept that we're at an extreme within a certain time range of the current time.
		if (extreme.time >= referenceTimeCurrentLowerBound && extreme.time <= referenceTimeCurrentUpperBound) {
			// We're currently in an extreme
			current = extreme;
			previous = extrema[i - 1];
			next = extrema[i + 1];
			break;
		}
		// Else just check if the current is in-between two extremes.
		else if (extreme.time > referenceTime) {
			previous = extrema[i - 1];
			next = extreme;

			// Also set the current if our current height is lower than the low or higher than the high.
			if ((previous.isLow && measuredOrComputedHeight <= previous.height) || (!previous.isLow && measuredOrComputedHeight >= previous.height)) {
				current = previous;
				previous = extrema[i - 2];
			}
			else if ((next.isLow && measuredOrComputedHeight <= next.height) || (!next.isLow && measuredOrComputedHeight >= next.height)) {
				current = next;
				next = extrema[i + 1];
			}
			break;
		}
		// Else keep searching
	}

	// /*
	// 	Three possibilities:
	// 	- previous is really current
	// 	- next is really current
	// 	- there is no current
	// */
	// if (previous.time >= referenceTimeCurrentLowerBound || (previous.isLow && currentHeight <= previous.height) || (!previous.isLow && currentHeight >= previous.height)) {
	// 	currentExtreme = previous;
	// 	previous = twoPrevious;
	// }
	// else if (next.time <= referenceTimeCurrentUpperBound || (next.isLow && currentHeight <= next.height) || (!next.isLow && currentHeight >= next.height)) {
	// 	currentExtreme = next;
	// 	next = twoNext;
	// }
	// else {
	// 	// There is no current extreme.
	// }

	return [previous, current, next];
}

function getTideExtremeDays(extrema: TidePointExtreme[], referenceTime: DateTime): TidePointExtremeDay[] {

	// First just split them up by day.
	let tideDay: TidePointExtreme[] = [];
	const tideDays: TidePointExtreme[][] = [tideDay];
	extrema.forEach((extreme, i) => {
		if (i === 0) {
			tideDay.push(extreme);
			return;
		}

		const previous = extrema[i - 1]!;
		const isNewDay = !previous.time.hasSame(extreme.time, 'day');
		if (isNewDay) {
			tideDay = [];
			tideDays.push(tideDay);
		}
		tideDay.push(extreme);
	});

	// Now add the last of the previous day and the first of the next day.
	let extremeDays = tideDays.map<TidePointExtremeDay>((tideDay, i) => {
		const lastOfPrevious = i === 0 ? null : tideDays[i - 1].at(-1);
		const firstOfNext = (i === tideDays.length - 1) ? null : tideDays[i + 1].at(0);

		return {
			time: tideDay[0].time.startOf('day'),
			previousId: lastOfPrevious?.id || null!,
			extremaIds: tideDay.map((extreme) => extreme.id),
			nextId: firstOfNext?.id || null!
		};
	});

	// Filter to ensure we have all the information we need, and that we start with the reference day.
	const startOfReferenceDay = referenceTime.startOf('day');
	extremeDays = extremeDays.filter((extremeDays) => {
		return !!extremeDays.previousId && !!extremeDays.nextId && !!extremeDays.extremaIds.length && extremeDays.time >= startOfReferenceDay;
	});

	return extremeDays;
}

export interface TideAdditionalContext {
	current: TidePointCurrent;
	previousId: string;
	currentId: string | null;
	nextId: string;
	beachChanges: TidePointBeachChange[];
	extremeDays: TidePointExtremeDay[];
	extremaMap: Map<string, TidePointExtreme>;
}

export function getTideAdditionalContext(config: BaseConfig, fetchedTide: TideFetched): TideAdditionalContext {
	const { current: currentHeight, extrema } = fetchedTide;
	const { referenceTime } = config;

	/*
		Important information to figure out:
		- The previous/next extremes
		- Whether it's currently an extreme right now (which would affect previous/next)
		- Whether the beach is covered, uncovered, or in-between
		- The next time the tide will be covering/uncovering the beach
	*/

	const [previous, current, next] = getTidePreviousNext(extrema, currentHeight, referenceTime);
	const changes = getTidePointBeachChanges(extrema);

	// Figure out our current beach status and the next significant one. 
	let previousBeachStatus: TideLevelBeachStatus = null!;
	let currentBeachStatus: TideLevelBeachStatus = null!;
	let beachCycleNextBetween: DateTime | null = null;
	for (let i = 0; i < changes.length; i++) {
		const beachSwap = changes[i];
		if (beachSwap.time < referenceTime) {
			continue;
		}
		// Once we get to the first status past our reference time, grab the status of the one before.
		if (currentBeachStatus === null) {
			currentBeachStatus = changes[i - 1].toStatus;
			previousBeachStatus = changes[i - 2].toStatus;
		}
		/*
			#REF_BEACH_CYCLE_NEXT_BETWEEN

			We're looking for the next return to the "between" status without moving back to the "previous" status.
			As in, as long as we aren't in one of these scenarios:
			- uncovered -> between -> uncovered
			- covered -> between -> covered
			Then we are fine. In these scenarios above, it's hard to tell the user about when they can go on the beach / leave the beach.

			These are the all possibilities (prev -> current -> next):
			- uncovered to between (rising)
				- to covered (next one after this)
				- to uncovered again (null case)
			- between to covered (rising)
				- to between (what we want)
			- between to uncovered (falling)
				- to between (what we want)
			- covered to between (falling)
				- to uncovered (next one after this)
				- to covered again (null case)

			(Note: *Beach time* cares only about uncovered to between and between to uncovered.)
		*/
		if (
			currentBeachStatus !== null
			&& previousBeachStatus !== null
		) {
			if (currentBeachStatus === TideLevelBeachStatus.between && beachSwap.toStatus === previousBeachStatus) {
				// We got back to our old status without finding what we were looking for. This is a null case as defined above.
				break;
			}
			else if (beachSwap.toStatus === TideLevelBeachStatus.between) {
				// This is what we are looking for - first time we get back to the between status, we must be coming from the opposite direction
				beachCycleNextBetween = beachSwap.time;
				break;
			}
			// Keep searching (should just be one more max)
		}
	}

	/*
		Calculate the direction and division based on what we now know.
		For division: top 25% is upper; middle 50% is mid; lower 25% is lower.
	*/
	const currentDirection = current ? TideLevelDirection.turning : (next.isLow ? TideLevelDirection.falling : TideLevelDirection.rising);
	let currentDivision: TideLevelDivision = null!;
	if (current) {
		currentDivision = current.isLow ? TideLevelDivision.low : TideLevelDivision.high;
	}
	else {
		// Get the height as a percent in the range of low to high. 
		const low = previous.isLow ? previous.height : next.height;
		const high = previous.isLow ? next.height : previous.height;
		const divisionAsPercent = (currentHeight - low) / (high - low);
		currentDivision = divisionAsPercent >= .75 ? TideLevelDivision.high : (divisionAsPercent > .25 ? TideLevelDivision.mid : TideLevelDivision.low);
	}

	const extremeDays = getTideExtremeDays(extrema, referenceTime);

	const extremaMap = new Map<string, TidePointExtreme>(extrema.map((extreme) => {
		return [extreme.id, extreme];
	}));

	return {
		current: {
			height: currentHeight,
			direction: currentDirection,
			division: currentDivision,
			beachStatus: currentBeachStatus,
			beachCycleNextBetween
		},
		beachChanges: changes,
		previousId: previous.id,
		currentId: current?.id || null,
		nextId: next.id,
		extremeDays,
		extremaMap
	};
}



