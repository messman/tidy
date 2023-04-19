import { DateTime } from 'luxon';
import { constant } from '@wbtdevlocal/iso';

export function dateForZone(date: Date): DateTime {
	// https://moment.github.io/luxon/docs/manual/zones.html
	return DateTime.fromJSDate(date).setZone(constant.timeZoneLabel);
}