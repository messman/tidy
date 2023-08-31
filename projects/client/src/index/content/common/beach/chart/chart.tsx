import * as React from 'react';
import styled from 'styled-components';
import { BeachTimeDay } from '@wbtdevlocal/iso';
import { ChartHourly } from './chart-hourly';
import { BeachChartTimes } from './chart-times';

const BeachChartContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: .5rem;
`;

export interface BeachChartProps {
	day: BeachTimeDay;
};

export const BeachChart: React.FC<BeachChartProps> = (props) => {
	const { day } = props;
	return (
		<BeachChartContainer>
			<ChartHourly day={day} />
			<BeachChartTimes day={day} />
		</BeachChartContainer>
	);
};