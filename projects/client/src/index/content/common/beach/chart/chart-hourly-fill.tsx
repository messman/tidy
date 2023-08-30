import * as React from 'react';
import styled, { css } from 'styled-components';
import { themeTokens } from '@/index/core/theme/theme-root';
import { asPercentString, percentFromStartOfDay } from '@/index/core/time/time';
import { BeachTimeRange, WeatherIndicator } from '@wbtdevlocal/iso';

const fillContainerStyles = css`
	position: absolute;
	top: 0;
	height: 100%;
	border-radius: .125rem;
`;

const FillContainerBest = styled.div`
	${fillContainerStyles}
	background-color: ${themeTokens.inform.positive};
`;

const FillContainerOkay = styled.div`
	${fillContainerStyles}
	background-color: ${themeTokens.inform.unsure};
`;

export interface ChartHourlyFillProps {
	range: BeachTimeRange;
};

export const ChartHourlyFill: React.FC<ChartHourlyFillProps> = (props) => {
	const { range } = props;

	const startOfDay = range.start.startOf('day');
	const startPercent = percentFromStartOfDay(range.start, startOfDay);
	const stopPercent = percentFromStartOfDay(range.stop, startOfDay);
	const widthPercent = stopPercent - startPercent;

	const Container = range.weather === WeatherIndicator.best ? FillContainerBest : FillContainerOkay;

	return (
		<Container
			style={{
				left: asPercentString(startPercent),
				width: asPercentString(widthPercent)
			}}
		/>
	);
};