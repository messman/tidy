import { DateTime } from 'luxon';

/** Weather data is a span of time - usually the time given plus a number of hours. */
export interface TimeSpan {
	begin: DateTime,
	end: DateTime;
}

/** An instance. */
export interface TimeIterator<B> {
	/** Iterates forward to the given Date. */
	next: (time: DateTime) => B | null,
	/** Resets the iterator. */
	reset: () => void;
}

/** The value and the time span. */
export interface IterableTimeData<T> {
	value: T,
	span: TimeSpan,
}

export function createTimeIterator<T>(data: IterableTimeData<T>[]): TimeIterator<T> {
	return createBaseTimeIterator(data, createOutput);
}

export interface CreateOutputFunc<A, B> {
	(previous: IterableTimeData<A> | null, next: IterableTimeData<A> | null): B | null;
}

function createBaseTimeIterator<A, B>(data: IterableTimeData<A>[], createOutput: CreateOutputFunc<A, B>): TimeIterator<B> {

	// Internally-stored instance data.
	let previous: IterableTimeData<A> | null;
	// Index through the initial data.
	let index: number;
	// Whether or not we've iterated completely.
	let isComplete: boolean;

	function reset(): void {
		previous = null;
		index = 0;
		isComplete = false;
	}
	reset();

	function next(newTime: DateTime): B | null {
		// Once complete, get out.
		if (isComplete) {
			return null;
		}

		// Here's the next by default.
		let next: IterableTimeData<A> = data[index];

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

		const output = createOutput(previous, next);

		// Store for next run.
		previous = next;

		return output;
	}

	return {
		next: next,
		reset: reset
	};
}

function createOutput<T>(_: IterableTimeData<T> | null, next: IterableTimeData<T> | null): T | null {
	if (!next) {
		return null;
	}
	return next.value;
}

function isInTimespan(timespan: TimeSpan, time: DateTime): boolean {
	const value = time.valueOf();
	return value >= timespan.begin.valueOf() && value < timespan.end.valueOf();
}