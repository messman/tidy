import { DateTime } from 'luxon';

export interface TwelveHourTime {
	time: string // like '1:34'
	ampm: 'AM' | 'PM'
}

export function getTimeTwelveHour(date: DateTime): TwelveHourTime {
	let hours = date.hour;
	let minutes = date.minute;
	let ampm: 'PM' | 'AM' = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	const minutesString = minutes.toString().padStart(2, '0');
	return {
		time: `${hours}:${minutesString}`,
		ampm
	}
}

export function getDate(date: DateTime): string {
	return `${date.month}/${date.day}`;
}

export function getDateDayOfWeek(date: DateTime): string {
	return `${date.weekdayLong} ${getDate(date)}`;
}

export function getHumanTime(spanMilliseconds: number): string {
	let minutes = Math.ceil(spanMilliseconds / 1000 / 60);
	if (minutes > 0) {
		if (minutes <= 1)
			return 'right about now';
		if (minutes < 100)
			return `in ${minutes} min`;
		const hours = Math.round(minutes / 60);
		if (hours === 1)
			return 'in an hour';
		return `in ${hours} hours`;
	}
	else {
		minutes = Math.abs(minutes);
		if (minutes <= 1)
			return 'moments ago';
		if (minutes < 100)
			return `${minutes} min ago`;
		const hours = Math.round(minutes / 60);
		if (hours === 1)
			return 'about an hour ago';
		return `${hours} hours ago`;
	}
}


const _pixelsPerHour = 40;
export const pixelsPerDay = 24 * _pixelsPerHour;

export function timeToPixels(startDate: DateTime, endDate: DateTime): number {
	return timeToPixelsWithConstant(startDate, endDate, _pixelsPerHour);
}

function timeToPixelsWithConstant(startDate: DateTime, endDate: DateTime, pixelsPerHour: number): number {
	const hours = endDate.diff(startDate, 'millisecond').milliseconds / 1000 / 60 / 60;
	return hours * pixelsPerHour;
}