import { DateTime } from 'luxon';
import { Tide } from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';

export interface FetchedTide {
	current: Tide.MeasureStampBase;
	extrema: Tide.ExtremeStamp[];
}

export function getStartOfDayBefore(day: DateTime): DateTime {
	return day.minus({ days: 1 }).startOf('day');
}

/** If within this time (on either side), say we're at the extreme. */
const currentExtremeBoundMinutes = 10;


export interface TideMeasuredAndRelativity {
	measured: Tide.MeasureStamp;
	relativity: Tide.Relativity;
}

export function getTideMeasuredAndRelativity(config: BaseConfig, fetchedTide: FetchedTide): TideMeasuredAndRelativity {
	const { current, extrema } = fetchedTide;
	const { height: currentHeight } = current;

	const { referenceTime } = config;

	/*
		Find the previous and next - plus more on either side, in case.
	*/
	let twoPrevious: Tide.ExtremeStamp = null!;
	let previous: Tide.ExtremeStamp = null!;
	let next: Tide.ExtremeStamp = null!;
	let twoNext: Tide.ExtremeStamp = null!;

	for (let i = 0; i < extrema.length; i++) {
		if (extrema[i].time > referenceTime) {
			twoPrevious = extrema[i - 2];
			previous = extrema[i - 1];
			next = extrema[i];
			twoNext = extrema[i + 1];
			break;
		}
	}

	const referenceTimeCurrentLowerBound = referenceTime.minus({ minutes: currentExtremeBoundMinutes });
	const referenceTimeCurrentUpperBound = referenceTime.plus({ minutes: currentExtremeBoundMinutes });

	let currentExtreme: Tide.ExtremeStamp | null = null;

	/*
		Three possibilities:
		- previous is really current
		- next is really current
		- there is no current
	*/
	if (previous.time >= referenceTimeCurrentLowerBound || (previous.isLow && currentHeight <= previous.height) || (!previous.isLow && currentHeight >= previous.height)) {
		currentExtreme = previous;
		previous = twoPrevious;
	}
	else if (next.time <= referenceTimeCurrentUpperBound || (next.isLow && currentHeight <= next.height) || (!next.isLow && currentHeight >= next.height)) {
		currentExtreme = next;
		next = twoNext;
	}
	else {
		// There is no current extreme.
	}

	/*
		Calculate the direction and division based on what we now know.
		For division: top 25% is upper; middle 50% is mid; lower 25% is lower.
	*/
	const currentDirection = currentExtreme ? Tide.Direction.turning : (next.isLow ? Tide.Direction.falling : Tide.Direction.rising);
	let currentDivision: Tide.Division = null!;
	if (currentExtreme) {
		currentDivision = currentExtreme.isLow ? Tide.Division.low : Tide.Division.high;
	}
	else {
		// Get the height as a percent in the range of low to high. 
		const low = previous.isLow ? previous.height : next.height;
		const high = previous.isLow ? next.height : previous.height;
		const divisionAsPercent = (currentHeight - low) / (high - low);
		currentDivision = divisionAsPercent >= .75 ? Tide.Division.high : (divisionAsPercent > .25 ? Tide.Division.mid : Tide.Division.low);
	}

	return {
		measured: {
			...current,
			direction: currentDirection,
			division: currentDivision,
		},
		relativity: {
			previous,
			current: currentExtreme,
			next
		}
	};
}

/** Gets minimum and maximum extrema from an array as [min, max]. */
export function getTideMinMax(events: Tide.ExtremeStamp[]): [Tide.ExtremeStamp, Tide.ExtremeStamp] {
	if (!events || !events.length) {
		throw new Error('Cannot get min and max of empty array');
	}
	let minHeight: number = Infinity;
	let maxHeight: number = -Infinity;

	let minEvent: Tide.ExtremeStamp = null!;
	let maxEvent: Tide.ExtremeStamp = null!;

	events.forEach(function (t) {
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


/**
 * Uses the cosine function to compute/guess the height at a time between two tide extremes.
*/
export function computeHeightAtTimeBetweenPredictions(previousExtreme: Tide.ExtremeStamp, nextExtreme: Tide.ExtremeStamp, referenceTime: DateTime): number {
	/*
		Use cosine function, where our domain is [0, pi] for high -> low or [pi, 2pi] for low -> high
		and our range is [-1, 1].
		(See https://www.math.net/cosine)

		So figure out which direction we're headed, restrict
		to our domain and range, and compute.
	*/
	const a: Tide.ExtremeStamp = previousExtreme;
	const b: Tide.ExtremeStamp = nextExtreme;

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