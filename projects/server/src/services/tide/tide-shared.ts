import { DateTime } from 'luxon';
import { constant, Range, TideLevelBeachStatus, TideLevelDirection, TideLevelDivision, TidePointCurrent, TidePointCurrentContextual, TidePointExtreme, TidePointExtremeDay } from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';

export function createTidePointExtremeId(time: DateTime): string {
	return `tide-${time.toMillis()}`;
}

export interface TideFetched {
	current: TidePointCurrent;
	extrema: TidePointExtreme[];
}

/**
 * Uses the cosine function to compute/guess the height at a time between two tide extremes. Used for testing and for computation.
*/
export function computeHeightAtTimeBetweenPredictions(previousExtreme: TidePointExtreme, nextExtreme: TidePointExtreme, referenceTime: DateTime): number {
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

export interface TidePointBeachChange {
	time: DateTime;
	/** This is the exact point where we move from the previous status TO this one. */
	toStatus: TideLevelBeachStatus;
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

	const { coveringStart, coveringStop, uncoveringStart, uncoveringStop } = constant.beachAccess;
	const heightRange = (high - low);

	// Use percents to get to [0, 1].
	let firstHeightPercent = (uncoveringStart - low) / heightRange;
	let firstStatus = TideLevelBeachStatus.uncovering;
	let secondHeightPercent = (uncoveringStop - low) / heightRange;
	let secondStatus = TideLevelBeachStatus.uncovered;

	if (isStartLow) {
		// If we started low, we need to flip at some point. Do it here while we understand our domain.
		firstHeightPercent = (coveringStart - low) / heightRange;
		firstHeightPercent = 1 - firstHeightPercent;
		firstStatus = TideLevelBeachStatus.covering;
		secondHeightPercent = (coveringStop - low) / heightRange;
		secondHeightPercent = 1 - secondHeightPercent;
		secondStatus = TideLevelBeachStatus.covered;
	}

	const changes: TidePointBeachChange[] = [];

	// Check to ensure our constants aren't bringing us outside of the extremes (could happen with test data)
	// Will be less than zero if too low, and above one if too high.
	if (firstHeightPercent > 0 && firstHeightPercent < 1) {
		changes.push({
			time: computeTimeForTideHeight(firstHeightPercent, a.time, b.time),
			toStatus: firstStatus
		});
	}

	if (secondHeightPercent > 0 && secondHeightPercent < 1) {
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
	const changes: TidePointBeachChange[] = [];
	for (let i = 0; i < extrema.length; i++) {
		if (i === extrema.length - 1) {
			break;
		}
		const changesBetween = getTidePointBeachSwapsBetween(extrema[i], extrema[i + 1]);
		changes.push(...changesBetween);
	}
	return changes;
}


/** Gets minimum and maximum extrema from an array as [min, max]. */
function getTideMinMax(extrema: TidePointExtreme[]): [TidePointExtreme, TidePointExtreme] {
	if (!extrema || !extrema.length) {
		throw new Error('Cannot get min and max of empty array');
	}
	let minHeight: number = Infinity;
	let maxHeight: number = -Infinity;

	let minEvent: TidePointExtreme = null!;
	let maxEvent: TidePointExtreme = null!;

	extrema.forEach(function (t) {
		if (t.height < minHeight) {
			minHeight = t.height;
			minEvent = t;
		}
		if (t.height > maxHeight) {
			maxHeight = t.height;
			maxEvent = t;
		}
	});

	return [minEvent, maxEvent];
};

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
	currentPoint: TidePointCurrentContextual;
	previousId: string;
	currentId: string | null;
	nextId: string;
	range: Range<TidePointExtreme>;
	beachChanges: TidePointBeachChange[];
	extremeDays: TidePointExtremeDay[];
}

export function getTideAdditionalContext(config: BaseConfig, fetchedTide: TideFetched): TideAdditionalContext {
	const { current: currentPoint, extrema } = fetchedTide;
	const { referenceTime } = config;

	/*
		Important information to figure out:
		- The previous/next extremes
		- Whether it's currently an extreme right now (which would affect previous/next)
		- Whether the beach is covered, uncovered, or in-between
		- The next time the tide will be covering/uncovering the beach
	*/
	const currentPointHeight = currentPoint.height;

	const [previous, current, next] = getTidePreviousNext(extrema, currentPointHeight, referenceTime);
	const changes = getTidePointBeachChanges(extrema);

	// Figure out our current beach status and the next one. 
	// For the next one, have it be the first for an actual swap.
	let currentBeachStatus: TideLevelBeachStatus = null!;
	let nextMajorBeachChange: TidePointBeachChange = null!;
	for (let i = 0; i < changes.length; i++) {
		const beachSwap = changes[i];
		if (beachSwap.time < referenceTime) {
			continue;
		}
		// Once we get to the first status past our reference time, grab the status of the one before.
		if (currentBeachStatus === null) {
			currentBeachStatus = changes[i - 1].toStatus;
		}
		// Then look for the next major change. Could come in the same run of this loop, or in a later run of the the loop.
		if (currentBeachStatus !== null) {
			const isCurrentCovering = currentBeachStatus === TideLevelBeachStatus.covered || currentBeachStatus === TideLevelBeachStatus.covering;
			const isThisCovering = beachSwap.toStatus === TideLevelBeachStatus.covered || beachSwap.toStatus === TideLevelBeachStatus.covering;
			if (isCurrentCovering !== isThisCovering) {
				nextMajorBeachChange = beachSwap;
				break;
			}
		}
	}

	// if (current) {
	// 	currentBeachStatus = current.isLow ? TideLevelBeachStatus.uncovered : TideLevelBeachStatus.covered;
	// }
	// else if (previous.isLow) {
	// 	currentBeachStatus = TideLevelBeachStatus.uncovered;
	// 	if (currentPointHeight > coveredActual) {
	// 		currentBeachStatus = TideLevelBeachStatus.covered;
	// 	}
	// 	else if (currentPointHeight > covering) {
	// 		currentBeachStatus = TideLevelBeachStatus.covering;
	// 	}
	// }
	// else {
	// 	currentBeachStatus = TideLevelBeachStatus.covered;
	// 	if (currentPointHeight < uncovered) {
	// 		currentBeachStatus = TideLevelBeachStatus.uncovered;
	// 	}
	// 	else if (currentPointHeight < uncovering) {
	// 		currentBeachStatus = TideLevelBeachStatus.uncovering;
	// 	}
	// }

	// Now find when it will next change (just for 

	const [min, max] = getTideMinMax(extrema);

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
		const divisionAsPercent = (currentPointHeight - low) / (high - low);
		currentDivision = divisionAsPercent >= .75 ? TideLevelDivision.high : (divisionAsPercent > .25 ? TideLevelDivision.mid : TideLevelDivision.low);
	}

	const extremeDays = getTideExtremeDays(extrema, referenceTime);

	return {
		currentPoint: {
			...currentPoint,
			direction: currentDirection,
			division: currentDivision,
			beachStatus: currentBeachStatus,
			beachChange: nextMajorBeachChange.time
		},
		beachChanges: changes,
		range: {
			min,
			max
		},
		previousId: previous.id,
		currentId: current?.id || null,
		nextId: next.id,
		extremeDays
	};
}



