import { DateTime } from 'luxon';
import { percentTimeBetween } from '@/index/core/time/time';
import * as iso from '@wbtdevlocal/iso';

export function getTideTitle(referenceTime: DateTime, measured: iso.Tide.MeasureStamp, relativity: iso.Tide.Relativity): string {
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
			return `The tide is ${measured.direction === iso.Tide.Direction.falling ? 'falling' : (measured.direction === iso.Tide.Direction.rising ? 'rising' : 'turning')}.`;
		}
	}
}

export function getTideDescription(tide: iso.Tide.MeasureStamp): string {
	const { direction, division } = tide;

	if (direction === iso.Tide.Direction.turning) {
		if (division === iso.Tide.Division.low) {
			return 'Low';
		}
		else if (division === iso.Tide.Division.high) {
			return 'High';
		}
	}
	else if (direction === iso.Tide.Direction.rising) {
		return 'Rising';
	}
	else if (direction === iso.Tide.Direction.falling) {
		return 'Falling';
	}
	return 'Unknown';
}