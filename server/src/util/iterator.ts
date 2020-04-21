import { DateTime } from "luxon";
import { Change, Measurement } from "tidy-shared";

/** Weather data is a span of time - usually the time given plus a number of hours. */
export interface TimeSpan {
	begin: DateTime,
	end: DateTime
}

/** An instance. */
export interface ChangeIterator<B> {
	/** Iterates forward to the given DateTime. */
	next: (time: DateTime) => B | null,
	/** Resets the iterator. */
	reset: () => void
}

/** The value and the time span. */
export interface IterableData<T> {
	value: T,
	span: TimeSpan,
}

export function createChangeIterator(data: IterableData<number>[]): ChangeIterator<Measurement> {
	return createIterator(data, createMeasurementOutput);
}

export function createStringIterator(data: IterableData<string>[]): ChangeIterator<string> {
	return createIterator(data, createStringOutput);
}

export interface CreateOutputFunc<A, B> {
	(previous: IterableData<A> | null, next: IterableData<A> | null): B | null
}

function createIterator<A, B>(data: IterableData<A>[], createOutput: CreateOutputFunc<A, B>): ChangeIterator<B> {

	// Internally-stored instance data.
	let previous: IterableData<A> | null;
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
		let next: IterableData<A> = data[index];

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

function createMeasurementOutput(previous: IterableData<number> | null, next: IterableData<number> | null): Measurement {
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

function createStringOutput(_: IterableData<string> | null, next: IterableData<string> | null): string | null {
	if (!next) {
		return null;
	}
	return next.value;
}

function isInTimespan(timespan: TimeSpan, time: DateTime): boolean {
	const value = time.valueOf();
	return value >= timespan.begin.valueOf() && value < timespan.end.valueOf();
}