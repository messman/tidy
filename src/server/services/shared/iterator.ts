import { DateTime, Duration } from "luxon";

/** Weather data is a span of time - usally the time given plus a number of hours. */
export interface TimeSpan {
	begin: DateTime,
	end: DateTime
}

/** The change that occurred from the rpevious data point to this one. */
export enum Change {
	/** This is the first available piece of data. */
	start,
	/** This is 'lower' than the previous data. */
	lower,
	/** This is the same as the previous data. */
	same,
	/** This is 'higher' than the previous data. */
	higher
}

/** An interface instance. */
export interface Iterator<T> {
	/** Iterates forward to the given DateTime. */
	next(time: DateTime): Measurement<T>
}

/** The value and the timespan its associated with from the API data. */
export interface IterableData<T> {
	value: T,
	span: TimeSpan,
}

/** The result data from the iterator call. */
export interface Measurement<T> {
	time: DateTime,
	data: IterableData<T>,
	change: Change,
}

export interface IteratorOptions<T> {
	computeChange: (previous: T, next: T) => Change
}

export function defaultComputeChange<T>(getValue: (data: T) => number): (previous: T, next: T) => Change {
	return function (previous: T, next: T) {
		if (!previous) {
			return Change.start;
		}

		const prevVal = getValue(previous);
		const nextVal = getValue(next);
		return (nextVal > prevVal ? Change.higher : (nextVal === prevVal ? Change.same : Change.lower));
	}
}

function isInTimespan(timespan: TimeSpan, time: DateTime): boolean {
	const value = time.valueOf();
	return value >= timespan.begin.valueOf() && value < timespan.end.valueOf();
}



export function create<T>(data: IterableData<T>[], options: IteratorOptions<T>): Iterator<T> {

	// Internally-stored instance data.
	let previous: IterableData<T> = null;
	// Index through the initial data.
	let index = 0;
	// Whether or not we've iterated completely.
	let isComplete = false;

	function next(newTime: DateTime): Measurement<T> {
		// Once complete, get out.
		if (isComplete) {
			return null;
		}

		// Here's the next by default.
		let next: IterableData<T> = data[index];

		// Now, look ahead to find the next entry that actually matches the time we're asking for.
		let advancedIndex = index;
		let advancedNext = data[advancedIndex];
		while (!isInTimespan(advancedNext.span, newTime)) {
			advancedIndex++;
			advancedNext = data[advancedIndex];
			if (!advancedNext) {
				isComplete = true;
				return null;
			}
			if (advancedIndex !== index) {
				next = advancedNext;
				index = advancedIndex;
			}
		}

		const output: Measurement<T> = {
			time: newTime,
			data: next,
			change: options.computeChange(previous ? previous.value : null, next.value)
		};

		// Store for next run.
		previous = next;

		return output;
	}

	return {
		next
	}
}