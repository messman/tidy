
import { DateTime } from 'luxon';
import { IconInputType } from '@/core/icon/icon';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';
import { getDurationDescription, getTimeTwelveHourRange, getTimeTwelveHourString } from '../time';

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
		if (current.stop.diff(referenceTime, 'minutes').minutes <= 45) {
			return BeachTimeStatus.currentEndingSoon;
		}
		else {
			return BeachTimeStatus.current;
		}
	}
	else if (next) {
		if (next.start.diff(referenceTime, 'minutes').minutes <= 60) {
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


export interface BeachTimeTextInfo {
	title: string;
	range: JSX.Element | string | null;
	description: string;
	expression: IconInputType;
}

export const beachTimeStatusTextInfoFunc: Record<keyof typeof BeachTimeStatus, (beach: iso.Batch.BeachContent, referenceTime: DateTime) => BeachTimeTextInfo> = {
	current: (beach) => {
		return {
			title: `It's beach time!`,
			range: null,
			description: `Enjoy the beach until ${getTimeTwelveHourString(beach.current!.stop)}.`,
			expression: icons.expressionHappy
		};
	},
	currentEndingSoon: (beach, referenceTime) => {
		const { current, next } = beach;
		const isNextToday = next.start.hasSame(referenceTime, 'day');
		const isNextTomorrow = next.start.hasSame(referenceTime.plus({ days: 1 }), 'day');

		const description = (isNextToday || isNextTomorrow) ? (
			`The next beach time starts at ${getTimeTwelveHourString(next.start)}${isNextTomorrow ? ' tomorrow' : ''}.`
		) : (
			`The next beach time isn't for awhile.`
		);

		return {
			title: `Beach time ends soon.`,
			range: `Ends ${getTimeTwelveHourString(current!.stop)}`,
			description: description,
			expression: icons.expressionStraight
		};
	},
	nextSoon: (beach, referenceTime) => {
		return {
			title: `Beach time starts soon!`,
			range: getTimeTwelveHourRange(beach.next.start, beach.next.stop),
			description: `Enjoy the beach starting in ${getDurationDescription(referenceTime, beach.next.start)}.`,
			expression: icons.expressionStraight
		};
	},
	nextLater: (beach) => {
		return {
			title: `It's not beach time right now.`,
			range: null,
			description: `Beach time starts at ${getTimeTwelveHourString(beach.next.start)}.`,
			expression: icons.expressionStraight
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