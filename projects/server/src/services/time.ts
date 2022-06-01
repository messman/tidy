import { DateTime } from 'luxon';

export function dateForZone(date: Date, zone: string): DateTime {
	// https://moment.github.io/luxon/docs/manual/zones.html
	return DateTime.fromJSDate(date).setZone(zone);
}