import * as React from 'react';
import { FlexColumn } from '@/core/layout/flex';
import { styled, StyledFC } from '@/core/style/styled';
import { useAppDataContext } from '@/services/data/appData';
import { timeToPixels } from '@/services/time';
import { ChartBackground } from './chartBackground';
import { ChartForeground } from './chartForeground/chartForeground';

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
			<MainChartContainer totalWidth={totalWidth}>
				<ChartBackground />
				<ChartForeground />
			</MainChartContainer>
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
