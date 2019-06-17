import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import { useAppDataContext } from "@/tree/appData";
import { timeToPixels, isSameDay } from "@/services/time";
import { ChartBackground } from "./chartBackground";
import { ChartForeground } from "./chartForeground/chartForeground";

interface MainChartProps {
}

export const MainChart: StyledFC<MainChartProps> = (props) => {
	const { isLoading, success } = useAppDataContext();
	if (isLoading || !success) {
		return null;
	}

	const tideEvents = success.success.predictions.tides.events;
	const lastEvent = tideEvents[tideEvents.length - 1];
	const totalWidth = timeToPixels(success.info.time, lastEvent.time);
	return (
		<MainChartContainer totalWidth={totalWidth}>
			<ChartBackground />
			<ChartForeground />
		</MainChartContainer>
	);
}

interface MainChartContainerProps {
	totalWidth: number
}

const MainChartContainer = styled.div<MainChartContainerProps>`
	position: relative;
	height: 100%;
	width: ${props => props.totalWidth}px;
	overflow: hidden;
`;