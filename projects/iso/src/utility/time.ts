/** Returns seconds as milliseconds. */
export function secondsToMs(seconds: number): number {
	return seconds * 1000;
}

/** Returns minutes as milliseconds. */
export function minutesToMs(minutes: number): number {
	return secondsToMs(minutes * 60);
}

/** Returns hours as milliseconds. */
export function hoursToMs(minutes: number): number {
	return minutesToMs(minutes * 60);
}