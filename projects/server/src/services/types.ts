/** Intermediate interface used when merging API data. Holds data for a specific day. */
export interface ForDay<T> {
	day: number;
	entity: T;
}