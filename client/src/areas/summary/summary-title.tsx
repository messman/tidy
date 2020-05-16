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
	const { all } = allResponseState.data!;

	const { previous, next, height } = all.current.tides;

	const high = next.isLow ? previous : next;
	const low = next.isLow ? next : previous;
	const safeHeight = Math.max(height, low.height);

	const percent = (safeHeight - low.height) / (high.height - low.height);

	let text = '';
	let iconType: SVGIconType | null = null;

	if (percent > .9) {
		text = `It's high tide.`
	}
	else if (percent > .8) {
		text = `It's almost high tide.`;
		iconType = iconTypes.arrowUp;
	}
	else if (percent < .1) {
		text = `It's low tide.`
	}
	else if (percent < .2) {
		text = `It's almost low tide.`
		iconType = iconTypes.arrowDown;
	}
	else {
		text = `The tide is ${next.isLow ? 'falling' : 'rising'}.`;
		iconType = next.isLow ? iconTypes.arrowDown : iconTypes.arrowUp;
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