
import { DateTime } from 'luxon';
import { IconInputType } from '@/index/core/icon/icon';
import { getDurationDescription, getTimeTwelveHourRange, getTimeTwelveHourString } from '@/index/core/time/time';
import { icons } from '@wbtdevlocal/assets';
import { BeachContent, BeachTimeStatus } from '@wbtdevlocal/iso';

export enum BeachTimeContextualStatus {
	current,
	currentEndingSoon,
	nextSoon,
	nextLater,
	nextTomorrow,
	other
}

export function getBeachTimeStatus(beach: BeachContent, referenceTime: DateTime): BeachTimeContextualStatus {
	const { firstStopReason, next } = beach;

	if (firstStopReason) {
		if (firstStopReason.time.diff(referenceTime, 'minutes').minutes <= 60) {
			return BeachTimeContextualStatus.currentEndingSoon;
		}
		else {
			return BeachTimeContextualStatus.current;
		}
	}
	else if (next) {
		if (next.start.diff(referenceTime, 'minutes').minutes <= 60) {
			return BeachTimeContextualStatus.nextSoon;
		}
		else if (next.start.hasSame(referenceTime, 'day')) {
			return BeachTimeContextualStatus.nextLater;
		}
		else if (next.start.hasSame(referenceTime.plus({ days: 1 }), 'day')) {
			return BeachTimeContextualStatus.nextTomorrow;
		}
	}
	return BeachTimeContextualStatus.other;
}


export interface BeachTimeTextInfo {
	title: string;
	range: JSX.Element | string | null;
	description: string;
	expression: IconInputType;
}

export const beachTimeStatusTextInfoFunc: Record<keyof typeof BeachTimeContextualStatus, (beach: BeachContent, referenceTime: DateTime) => BeachTimeTextInfo> = {
	current: (beach) => {
		const isBest = beach.status === BeachTimeStatus.best;

		return {
			title: `It's beach time${isBest ? '!' : '.'}`,
			range: null,
			description: `Enjoy the beach until ${getTimeTwelveHourString(beach.firstStopReason!.time)}.`,
			expression: isBest ? icons.expressionHappy : icons.expressionStraight
		};
	},
	currentEndingSoon: (beach, referenceTime) => {
		const { firstStopReason, next } = beach;
		const isNextToday = next.start.hasSame(referenceTime, 'day');
		const isNextTomorrow = next.start.hasSame(referenceTime.plus({ days: 1 }), 'day');

		const description = (isNextToday || isNextTomorrow) ? (
			`Beach time ends soon. The next beach time starts at ${getTimeTwelveHourString(next.start)}${isNextTomorrow ? ' tomorrow' : ''}.`
		) : (
			`Beach time ends soon. The next beach time isn't for awhile.`
		);

		return {
			title: `It's beach time.`,
			range: `Ends ${getTimeTwelveHourString(firstStopReason!.time)}`,
			description: description,
			expression: beach.status === BeachTimeStatus.best ? icons.expressionHappy : icons.expressionStraight
		};
	},
	nextSoon: (beach, referenceTime) => {
		return {
			title: `It's not beach time yet.`,
			range: getTimeTwelveHourRange(beach.next.start, beach.next.stop),
			description: `Enjoy the beach starting in ${getDurationDescription(referenceTime, beach.next.start)}.`,
			expression: icons.expressionSad
		};
	},
	nextLater: (beach) => {
		return {
			title: `It's not beach time right now.`,
			range: null,
			description: `Beach time starts at ${getTimeTwelveHourString(beach.next.start)}.`,
			expression: icons.expressionSad
		};
	},
	nextTomorrow: (beach) => {

		return {
			title: `It's not beach time.`,
			range: null,
			description: `Enjoy the beach starting at ${getTimeTwelveHourString(beach.next.start)} tomorrow.`,
			expression: icons.expressionSad
		};

	},
	other: (beach) => {
		const { next } = beach;

		let description: string = null!;
		if (next) {
			description = `The next beach time starts ${getTimeTwelveHourString(next.start)} ${next.start.weekdayLong}.`;
		}

		return {
			title: `It's not beach time.`,
			range: null,
			description,
			expression: icons.expressionSad
		};
	},
};