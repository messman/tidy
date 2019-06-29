import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import { useAppDataContext } from "@/tree/appData";
import { timeToPixels, isSameDay } from "@/services/time";
import * as C from "@/styles/common";
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
		<FlexColumn>
			<C.ShadowTop />
			<MainChartContainer totalWidth={totalWidth}>
				<ChartBackground />
				<ChartForeground />
			</MainChartContainer>
			<C.ShadowBottom />
		</FlexColumn>
	);
}

interface MainChartContainerProps {
	totalWidth: number
}

const _MainChartContainer: StyledFC<MainChartContainerProps> = (props) => {
	return <FlexColumn className={props.className}>{props.children}</FlexColumn>
}

const MainChartContainer = styled(_MainChartContainer)`
	width: ${props => props.totalWidth}px;
	overflow: hidden;
`;
