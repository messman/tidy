import * as React from 'react';
import { useCurrentTheme } from '@/core/style/theme';
import { iconTypes, SVGIconType } from '@/core/symbol/icon';
import { subtitleHeight, SubtitleInline } from '@/core/symbol/text';
import { SpacedIcon } from '@/core/weather/weather-common';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { percentTimeBetween } from '@/services/time';

export const SummaryTitle: React.FC = () => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;
	const { tides } = all.current;

	// [0-100]
	const timePercent = percentTimeBetween(info.referenceTime, tides.previous.time, tides.next.time);

	const previousTideName = tides.previous.isLow ? 'low' : 'high';
	const nextTideName = tides.next.isLow ? 'low' : 'high';
	const nextTideIconType = tides.next.isLow ? iconTypes.arrowDown : iconTypes.arrowUp;

	let text = '';
	let iconType: SVGIconType | null = null;

	if (timePercent <= 10) {
		// [0-10]
		text = `It's ${previousTideName} tide.`;
	}
	else if (timePercent <= 80) {
		// (10-80]
		const tideActionName = tides.previous.isLow ? 'rising' : 'falling';
		text = `The tide is ${tideActionName}.`;
		iconType = nextTideIconType;
	}
	else if (timePercent <= 90) {
		// (80-90]
		text = `It's almost ${nextTideName} tide.`;
		iconType = nextTideIconType;
	}
	else {
		// (90-100]
		text = `It's ${nextTideName} tide.`;
	}

	const icon = iconType ? <SpacedIcon type={iconType} fill={theme.color.tide} height={subtitleHeight} spacing='far' /> : null;

	return (
		<>
			<SubtitleInline>
				{text}
				{icon}
			</SubtitleInline>
		</>
	);
};