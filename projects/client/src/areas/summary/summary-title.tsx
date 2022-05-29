import * as React from 'react';
import { useCurrentTheme } from '@/core/style/theme';
import { iconTypes, SVGIconType } from '@/core/symbol/icon';
import { subtitleHeight, SubtitleInline, Text } from '@/core/text';
import { TimeTextUnit } from '@/core/text-unit';
import { SpacedIcon } from '@/core/weather/weather-common';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { percentTimeBetween } from '@/services/time';

export interface SummaryTitleProps {
	showExpandedText: boolean;
}

export const SummaryTitle: React.FC<SummaryTitleProps> = (props) => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;
	const { tides } = all.current;
	const [previous, next] = tides.range.events;

	// [0-100]
	const timePercent = percentTimeBetween(info.referenceTime, previous.time, next.time);

	const previousTideName = previous.isLow ? 'low' : 'high';
	const nextTideName = next.isLow ? 'low' : 'high';
	const nextTideIconType = next.isLow ? iconTypes.arrowDown : iconTypes.arrowUp;

	let text = '';
	let iconType: SVGIconType | null = null;

	if (timePercent <= 10) {
		// [0-10]
		text = `It's ${previousTideName} tide.`;
	}
	else if (timePercent <= 80) {
		// (10-80]
		const tideActionName = previous.isLow ? 'rising' : 'falling';
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

	const icon = iconType ? <SpacedIcon type={iconType} fillColor={theme.color.tide} height={subtitleHeight} spacing='close' spaceDirection='left' /> : null;

	let expandedText: JSX.Element | null = null;
	if (props.showExpandedText) {


		expandedText = (
			<Text>
				Wells, Maine&nbsp;&nbsp;<TimeTextUnit dateTime={info.referenceTime} />
			</Text>
		);
	}

	return (
		<>
			<SubtitleInline>
				{text}
				{icon}
			</SubtitleInline>
			{expandedText}
		</>
	);
};