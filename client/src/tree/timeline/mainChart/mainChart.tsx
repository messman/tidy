import * as React from "react";
import { FlexColumn } from "@/unit/components/flex";
import styled, { StyledFC } from "@/styles/styled";
import { useAppDataContext } from "@/tree/appData";
import { timeToPixels } from "@/services/time";
import * as C from "@/styles/common";
import { ChartBackground } from "./chartBackground";
import { ChartForeground } from "./chartForeground/chartForeground";

interface MainChartProps {
}

export const MainChart: StyledFC<MainChartProps> = () => {
	const { isLoading, success } = useAppDataContext();
	if (isLoading || !success) {
		return null;
	}

	const totalWidth = timeToPixels(success.info.referenceTime, success.data!.predictions.cutoffDate);
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
