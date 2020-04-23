import { Change, Measurement } from "tidy-shared";

/** Weather data is a span of time - usually the time given plus a number of hours. */
export interface TimeSpan {
	begin: Date,
	end: Date
}

/** An instance. */
export interface TimeIterator<B> {
	/** Iterates forward to the given Date. */
	next: (time: Date) => B | null,
	/** Resets the iterator. */
	reset: () => void
}

/** The value and the time span. */
export interface IterableTimeData<T> {
	value: T,
	span: TimeSpan,
}

export function createTimeChangeIterator(data: IterableTimeData<number>[]): TimeIterator<Measurement> {
	return createBaseTimeIterator(data, createMeasurementOutput);
}

export function createTimeIterator<T>(data: IterableTimeData<T>[]): TimeIterator<T> {
	return createBaseTimeIterator(data, createOutput);
}

export interface CreateOutputFunc<A, B> {
	(previous: IterableTimeData<A> | null, next: IterableTimeData<A> | null): B | null
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

	function next(newTime: Date): B | null {
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
	}
}


function createMeasurementOutput(previous: IterableTimeData<number> | null, next: IterableTimeData<number> | null): Measurement {
	if (!next) {
		return {
			entity: null,
			change: Change.unknown
		};
	}
	if (!previous) {
		return {
			entity: next.value,
			change: Change.unknown
		};
	}

	return {
		entity: next.value,
		change: (next.value > previous.value ? Change.higher : (next.value === previous.value ? Change.same : Change.lower))
	};
}

function createOutput<T>(_: IterableTimeData<T> | null, next: IterableTimeData<T> | null): T | null {
	if (!next) {
		return null;
	}
	return next.value;
}

function isInTimespan(timespan: TimeSpan, time: Date): boolean {
	const value = time.valueOf();
	return value >= timespan.begin.valueOf() && value < timespan.end.valueOf();
}