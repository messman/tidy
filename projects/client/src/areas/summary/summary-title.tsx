import * as React from 'react';
import { SubtitleInline, subtitleHeight } from '@/core/symbol/text';
import { Icon, iconTypes, SVGIconType } from '@/core/symbol/icon';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { useCurrentTheme } from '@/core/style/theme';
import { styled } from '@/core/style/styled';
import { edgePaddingValue } from '@/core/style/common';

export const SummaryTitle: React.FC = () => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;
	const { tides } = all.current;

	// Value is like 0, 10, 20, 30, etc; 
	const timePercent = Math.round((info.referenceTime.valueOf() - tides.previous.time.valueOf()) / (tides.next.time.valueOf() - tides.previous.time.valueOf()) * 100);

	const previousTideName = tides.previous.isLow ? 'low' : 'high';
	const nextTideName = tides.next.isLow ? 'low' : 'high';
	const nextTideIconType = tides.next.isLow ? iconTypes.arrowDown : iconTypes.arrowUp;

	let text = '';
	let iconType: SVGIconType | null = null;

	if (timePercent <= 10) {
		text = `It's ${previousTideName} tide.`;
	}
	else if (timePercent <= 80) {
		const tideActionName = tides.previous.isLow ? 'rising' : 'falling';
		text = `The tide is ${tideActionName}.`
		iconType = nextTideIconType;
	}
	else if (timePercent <= 90) {
		text = `It's almost ${nextTideName} tide.`;
		iconType = nextTideIconType;
	}
	else {
		text = `It's ${nextTideName} tide.`;
	}

	const icon = iconType ? <SpacedIcon type={iconType} fill={theme.color.tide} height={subtitleHeight} /> : null;

	return (
		<>
			<SubtitleInline>
				{text}
				{icon}
			</SubtitleInline>
		</>
	);
};

const SpacedIcon = styled(Icon)`
	margin-left: ${edgePaddingValue};
`;