import { DateTime } from 'luxon';
import { constant } from '@wbtdevlocal/iso';

/**
 * Takes a date (like now, server time) and makes it (now, app time).
 * So, keeps the underlying time the same, but changes the zone to use for maths.
 */
export function dateForZone(date: Date): DateTime {
	// https://moment.github.io/luxon/docs/manual/zones.html
	return DateTime.fromJSDate(date).setZone(constant.timeZoneLabel);
}

export function getStartOfDayBefore(day: DateTime): DateTime {
	return day.minus({ days: 1 }).startOf('day');
}