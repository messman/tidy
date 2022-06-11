import { DateTime } from 'luxon';

/** Gets text like 'Today' or 'Tomorrow' from the date provided, relative to the reference date. */
export function getRelativeDayText(date: DateTime, reference: DateTime): string | null {
	if (date.hasSame(reference, 'day')) {
		return 'Today';
	}
	if (date.hasSame(reference.plus({ days: 1 }), 'day')) {
		return 'Tomorrow';
	}
	return null;
}

export interface TwelveHourTime {
	hour: string;
	time: string; // like '1:34'
	ampm: 'AM' | 'PM';
}

export function getTimeTwelveHour(date: DateTime): TwelveHourTime {
	let hours = date.hour as number;
	let minutes = date.minute;
	let ampm: 'PM' | 'AM' = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	const minutesString = minutes.toString().padStart(2, '0');
	return {
		hour: hours.toString(),
		time: `${hours}:${minutesString}`,
		ampm
	};
}

export function getTimeTwelveHourString(date: DateTime): string {
	const { time, ampm } = getTimeTwelveHour(date);
	return `${time} ${ampm}`;
}

export function getDate(date: DateTime): string {
	return `${date.month}/${date.day}`;
}

export function getDateDayOfWeek(date: DateTime): string {
	return `${date.weekdayLong} ${getDate(date)}`;
}

/** Returns a value [0-100] */
export function percentTimeBetween(referenceTime: DateTime, startTime: DateTime, endTime: DateTime): number {
	const startTimeValue = startTime.valueOf();
	const percent = ((referenceTime.valueOf() - startTimeValue) / (endTime.valueOf() - startTimeValue)) * 100;
	return Math.min(100, Math.max(0, Math.round(percent)));
}

/**
 * Returns a description of a duration, like "about an hour".
 * 
 * Future durations should fit form "in _____" or "is _____ away".
 * Past durations should fit form "_____ ago".
 * Callee must know whether duration is used for past or future.
 * 
 * Only works for 12 hours or less in absolute duration.
 */
export function getDurationDescription(from: DateTime, to: DateTime): string {
	const duration = to.diff(from, ['minutes']);

	const minutes = Math.abs(duration.minutes);

	if (minutes < 1) {
		return 'moments';
	}
	if (minutes < 5) {
		return 'a few minutes';
	}
	if (minutes < 9) {
		return 'less than 10 minutes';
	}
	if (minutes < 12) {
		return 'about 10 minutes';
	}
	if (minutes < 15) {
		return '10 to 15 minutes';
	}
	if (minutes < 18) {
		return 'about 15 minutes';
	}
	if (minutes < 24) {
		return 'about 20 minutes';
	}
	if (minutes < 38) {
		return 'about half an hour';
	}
	if (minutes < 51) {
		return 'about 45 minutes';
	}
	if (minutes < 75) {
		return 'about an hour';
	}
	if (minutes < 105) {
		return 'about an hour and a half';
	}
	if (minutes < 120) {
		return 'about 2 hours';
	}

	let hours = Math.floor(minutes / 60);
	const minutesAfterHour = Math.floor(minutes) % 60;
	let minutesAppend = '';
	if (minutesAfterHour < 15) {
		// Just use the hour.
		minutesAppend = '';
	}
	else if (minutesAfterHour < 45) {
		minutesAppend = ' and a half';
	}
	else {
		// Use the next hour.
		minutesAppend = '';
		hours++;
	}
	return `about ${hours}${minutesAppend} hours`;
}

// const _pixelsPerHour = 85;
// export const pixelsPerDay = 24 * _pixelsPerHour;

// export function timeToPixels(startDate: DateTime, endDate: DateTime): number {
// 	return timeToPixelsWithConstant(startDate, endDate, _pixelsPerHour);
// }

// export function pixelsToTime(dateTime: DateTime, pixelsOffset: number): DateTime {
// 	return dateTime.plus({ hours: pixelsOffset / _pixelsPerHour });
// }

// export function timeToPixelsWithConstant(startDate: DateTime, endDate: DateTime, pixelsPerHour: number): number {
// 	return endDate.diff(startDate, 'hours').hours * pixelsPerHour;
// }