import { DateTime } from 'luxon';
import { percentTimeBetween } from '@/index/core/time/time';
import { TideLevelDirection, TideLevelDivision, TidePoint, TideRelativity } from '@wbtdevlocal/iso';

export function getTideTitle(referenceTime: DateTime, measured: TidePoint, relativity: TideRelativity): string {
	const { previous, current, next } = relativity;

	if (current) {
		return `It's ${current.isLow ? 'low' : 'high'} tide.`;
	}
	else {
		// [0-100]
		const timePercent = percentTimeBetween(referenceTime, previous.time, next.time);
		if (timePercent >= 80) {
			return `It's almost ${next.isLow ? 'low' : 'high'} tide.`;
		}
		else {
			return `The tide is ${measured.direction === TideLevelDirection.falling ? 'falling' : (measured.direction === TideLevelDirection.rising ? 'rising' : 'turning')}.`;
		}
	}
}

export function getTideDescription(tide: TidePoint): string {
	const { direction, division } = tide;

	if (direction === TideLevelDirection.turning) {
		if (division === TideLevelDivision.low) {
			return 'Low';
		}
		else if (division === TideLevelDivision.high) {
			return 'High';
		}
	}
	else if (direction === TideLevelDirection.rising) {
		return 'Rising';
	}
	else if (direction === TideLevelDirection.falling) {
		return 'Falling';
	}
	return 'Unknown';
}