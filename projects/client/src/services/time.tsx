import { DateTime } from 'luxon';

export interface TwelveHourTime {
	hour: string;
	time: string; // like '1:34'
	ampm: 'AM' | 'PM';
}

export function getTimeTwelveHour(date: DateTime): TwelveHourTime {
	let hours = date.hour;
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

const _pixelsPerHour = 60;
export const pixelsPerDay = 24 * _pixelsPerHour;

export function timeToPixels(startDate: DateTime, endDate: DateTime): number {
	return timeToPixelsWithConstant(startDate, endDate, _pixelsPerHour);
}

export function timeToPixelsWithConstant(startDate: DateTime, endDate: DateTime, pixelsPerHour: number): number {
	return endDate.diff(startDate, 'hours').hours * pixelsPerHour;
}