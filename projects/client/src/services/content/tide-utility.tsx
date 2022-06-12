import * as iso from '@wbtdevlocal/iso';

export function getTideDescription(tide: iso.Tide.Stamp): string {
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