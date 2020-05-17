import * as React from 'react';
import { styled, StyledFC } from '@/core/style/styled';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { timeToPixels } from '@/services/time';

interface ChartBackgroundProps {
}

export const ChartBackground: StyledFC<ChartBackgroundProps> = () => {
	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	let eventLines: JSX.Element[] = [];
	const startTime = allResponseState.data!.info.referenceTime;
	const sunEvents = allResponseState.data!.all.predictions.sun;
	sunEvents.forEach(function (ev) {
		const key = `d_${ev.time.valueOf()}`;
		eventLines.push(<SunEventLine key={key} positionLeft={timeToPixels(startTime, ev.time)} />);
		if (!ev.isSunrise) {
			const endOfDay = ev.time.endOf('day');
			const endKey = `d_${endOfDay.valueOf()}`;
			eventLines.push(<MidnightEventLine key={endKey} positionLeft={timeToPixels(startTime, endOfDay)} />);
		}
	});

	return (
		<>
			<Background />
			{eventLines}
		</>
	);
}

const Background = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	background-image: linear-gradient(180deg, ${p => p.theme.color.background} 0%, ${p => p.theme.color.background} 100%);
`;

interface LineOffsetProps {
	positionLeft: number
}

const SunEventLine = styled.div<LineOffsetProps>`
	position: absolute;
	top: 0;
	height: 100%;
	width: 2px;
	left: ${p => p.positionLeft - 1}px;
	border-left: 2px dashed ${p => p.theme.color.background};
	opacity: .7;
`;

const MidnightEventLine = styled.div<LineOffsetProps>`
	position: absolute;
	top: 0;
	height: 100%;
	width: 4px;
	left: ${p => p.positionLeft - 2}px;
	background-color: ${p => p.theme.color.background};
	opacity: .5;
`;