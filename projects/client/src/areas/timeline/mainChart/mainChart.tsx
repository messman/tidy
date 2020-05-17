import * as React from 'react';
import { FlexColumn } from '@/core/layout/flex';
import { styled, StyledFC } from '@/core/style/styled';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { timeToPixels } from '@/services/time';
import { ChartBackground } from './chartBackground';
import { ChartForeground } from './chartForeground/chartForeground';

interface MainChartProps {
}

export const MainChart: StyledFC<MainChartProps> = () => {
	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	const totalWidth = timeToPixels(allResponseState.data!.info.referenceTime, allResponseState.data!.all.predictions.cutoffDate);
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


const MainChartContainer = styled(FlexColumn) <MainChartContainerProps>`
	width: ${p => p.totalWidth}px;
	overflow: hidden;
`;
