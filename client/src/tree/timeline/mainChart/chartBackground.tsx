import * as React from "react";
import { styled, StyledFC } from "@/styles/styled";
import { useAppDataContext } from "@/tree/appData";
import { timeToPixels } from "@/services/time";

interface ChartBackgroundProps {
}

export const ChartBackground: StyledFC<ChartBackgroundProps> = () => {
	const { isLoading, success } = useAppDataContext();
	if (isLoading || !success) {
		return null;
	}

	let eventLines: JSX.Element[] = [];
	if (!isLoading && success && success.data) {
		const startTime = success.info.referenceTime;
		const sunEvents = success.data!.predictions.sun;
		sunEvents.forEach(function (ev) {
			const key = `d_${ev.time.getTime()}`;
			eventLines.push(<SunEventLine key={key} positionLeft={timeToPixels(startTime, ev.time)} />);
			if (!ev.isSunrise) {
				const endOfDay = new Date(ev.time);
				endOfDay.setHours(24, 0, 0, 0);
				const endKey = `d_${endOfDay.getTime()}`;
				eventLines.push(<MidnightEventLine key={endKey} positionLeft={timeToPixels(startTime, endOfDay)} />);
			}
		});
	}

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

	background-image: linear-gradient(180deg, ${props => props.theme.color.background} 0%, ${props => props.theme.color.background} 100%);
`;

interface LineOffsetProps {
	positionLeft: number
}

const SunEventLine = styled.div<LineOffsetProps>`
	position: absolute;
	top: 0;
	height: 100%;
	width: 2px;
	left: ${props => props.positionLeft - 1}px;
	border-left: 2px dashed ${props => props.theme.color.background};
	opacity: .7;
`;

const MidnightEventLine = styled.div<LineOffsetProps>`
	position: absolute;
	top: 0;
	height: 100%;
	width: 4px;
	left: ${props => props.positionLeft - 2}px;
	background-color: ${props => props.theme.color.background};
	opacity: .5;
`;