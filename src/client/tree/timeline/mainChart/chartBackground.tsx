import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import { useAppDataContext } from "@/tree/appData";
import { timeToPixels, isSameDay } from "@/services/time";

interface ChartBackgroundProps {
}

export const ChartBackground: StyledFC<ChartBackgroundProps> = (props) => {
	const { isLoading, success } = useAppDataContext();
	if (isLoading || !success) {
		return null;
	}

	let eventLines: JSX.Element[] = [];
	if (!isLoading && success && success.success) {
		const startTime = success.info.time;
		const sunEvents = success.success.predictions.sun;
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

	background-image: linear-gradient(180deg, ${props => props.theme.color.layerMed} 0%, ${props => props.theme.color.bgMed} 100%);
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
	border-left: 2px dashed ${props => props.theme.color.layerLight};
	opacity: .7;
`;

const MidnightEventLine = styled.div<LineOffsetProps>`
	position: absolute;
	top: 0;
	height: 100%;
	width: 4px;
	left: ${props => props.positionLeft - 2}px;
	background-color: ${props => props.theme.color.layerLight};
	opacity: .5;
`;