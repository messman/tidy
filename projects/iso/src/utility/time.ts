/** Returns seconds as milliseconds. */
export function seconds(seconds: number): number {
	return seconds * 1000;
}

/** Returns minutes as milliseconds. */
export function minutes(minutes: number): number {
	return seconds(minutes * 60);
}