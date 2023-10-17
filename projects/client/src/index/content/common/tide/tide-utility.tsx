import { DateTime } from 'luxon';
import { percentTimeBetween } from '@/index/core/time/time';
import { TideLevelDirection, TidePointCurrent, TidePointExtreme } from '@wbtdevlocal/iso';

export function getTideTitle(referenceTime: DateTime, measured: TidePointCurrent, previous: TidePointExtreme, current: TidePointExtreme | null, next: TidePointExtreme): string {
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