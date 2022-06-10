import { DateTime } from 'luxon';
import * as iso from '@wbtdevlocal/iso';
import { BaseConfig } from '../config';

export interface FetchedTide {
	currentTime: DateTime;
	currentHeight: number;
	extrema: iso.Tide.ExtremeStamp[];
}

export function getStartOfDayBefore(day: DateTime): DateTime {
	return day.minus({ days: 1 }).startOf('day');
}

/** If within this time (on either side), say we're at the extreme. */
const currentExtremeBoundMinutes = 10;


export interface TideMeasuredAndRelativity {
	measured: iso.Tide.Stamp;
	relativity: iso.Tide.Relativity;
}

export function getTideMeasuredAndRelativity(config: BaseConfig, fetchedTide: FetchedTide): TideMeasuredAndRelativity {
	const { currentHeight, currentTime, extrema } = fetchedTide;

	const { referenceTime } = config;

	/*
		Find the previous and next - plus more on either side, in case.
	*/
	let twoPrevious: iso.Tide.ExtremeStamp = null!;
	let previous: iso.Tide.ExtremeStamp = null!;
	let next: iso.Tide.ExtremeStamp = null!;
	let twoNext: iso.Tide.ExtremeStamp = null!;

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

	let current: iso.Tide.ExtremeStamp | null = null;

	/*
		Three possibilities:
		- previous is really current
		- next is really current
		- there is no current
	*/
	if (previous.time >= referenceTimeCurrentLowerBound || (previous.isLow && currentHeight <= previous.height) || (!previous.isLow && currentHeight >= previous.height)) {
		current = previous;
		previous = twoPrevious;
	}
	else if (next.time <= referenceTimeCurrentUpperBound || (next.isLow && currentHeight <= next.height) || (!next.isLow && currentHeight >= next.height)) {
		current = next;
		next = twoNext;
	}
	else {
		// There is no current extreme.
	}

	/*
		Calculate the direction and division based on what we now know.
		For division: top 25% is upper; middle 50% is mid; lower 25% is lower.
	*/
	const currentDirection = current ? iso.Tide.Direction.turning : (next.isLow ? iso.Tide.Direction.falling : iso.Tide.Direction.rising);
	let low = 0;
	let high = 0;
	if (current) {
		// Use the average of previous and next as part of our range.
		const previousNextAverage = (previous.height + next.height) / 2;
		if (current.isLow) {
			low = current.height;
			high = previousNextAverage;
		}
		else {
			high = current.height;
			low = previousNextAverage;
		}
	}
	else {
		low = previous.isLow ? previous.height : next.height;
		high = previous.isLow ? next.height : previous.height;
	}
	// Get the height as a percent in the range of low to high. 
	const divisionAsPercent = (currentHeight - low) / (high - low);
	const currentDivision = divisionAsPercent >= .75 ? iso.Tide.Division.high : (divisionAsPercent > .25 ? iso.Tide.Division.mid : iso.Tide.Division.low);

	return {
		measured: {
			time: currentTime,
			height: currentHeight,
			direction: currentDirection,
			division: currentDivision,
		},
		relativity: {
			previous,
			current,
			next
		}
	};
}

/** Gets minimum and maximum extrema from an array as [min, max]. */
export function getTideMinMax(events: iso.Tide.ExtremeStamp[]): [iso.Tide.ExtremeStamp, iso.Tide.ExtremeStamp] {
	if (!events || !events.length) {
		throw new Error('Cannot get min and max of empty array');
	}
	let minHeight: number = Infinity;
	let maxHeight: number = -Infinity;

	let minEvent: iso.Tide.ExtremeStamp = null!;
	let maxEvent: iso.Tide.ExtremeStamp = null!;

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