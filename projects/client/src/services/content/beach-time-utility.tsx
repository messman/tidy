import { DateTime } from 'luxon';
import * as iso from '@wbtdevlocal/iso';

export enum BeachTimeStatus {
	current,
	currentEndingSoon,
	nextSoon,
	nextLater,
	nextTomorrow,
	other
}

export function getBeachTimeStatus(beach: iso.Batch.BeachContent, referenceTime: DateTime): BeachTimeStatus {
	const { current, next } = beach;

	if (current) {
		if (current.stop.diff(referenceTime, 'minutes').minutes <= 30) {
			return BeachTimeStatus.currentEndingSoon;
		}
		else {
			return BeachTimeStatus.current;
		}
	}
	else if (next) {
		if (next.start.diff(referenceTime, 'minutes').minutes <= 45) {
			return BeachTimeStatus.nextSoon;
		}
		else if (next.start.hasSame(referenceTime, 'day')) {
			return BeachTimeStatus.nextLater;
		}
		else if (next.start.hasSame(referenceTime.plus({ days: 1 }), 'day')) {
			return BeachTimeStatus.nextTomorrow;
		}
	}
	return BeachTimeStatus.other;
}

export const beachTimeStatusTitle: Record<keyof typeof BeachTimeStatus, string> = {
	current: `It's beach time!`,
	currentEndingSoon: `Beach time ends soon.`,
	nextSoon: `Beach time starts soon.`,
	nextLater: `Beach time is back later.`,
	nextTomorrow: `Beach time is back tomorrow.`,
	other: `It's not beach time.`,
};



