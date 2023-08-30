import { DateTime } from 'luxon';
import * as React from 'react';
import styled, { css } from 'styled-components';
import { themeTokens } from '@/index/core/theme/theme-root';
import { asPercentString, percentFromStartOfDay } from '@/index/core/time/time';
import { WeatherIndicator } from '@wbtdevlocal/iso';

const radius = '.125rem';

const fillContainerStyles = css<{ $isCroppedLeft: boolean; $isCroppedRight: boolean; }>`
	position: absolute;
	top: 0;
	height: 100%;
	border-top-left-radius: ${p => p.$isCroppedLeft ? 0 : radius};
	border-bottom-left-radius: ${p => p.$isCroppedLeft ? 0 : radius};
	border-top-right-radius: ${p => p.$isCroppedRight ? 0 : radius};
	border-bottom-right-radius: ${p => p.$isCroppedRight ? 0 : radius};
`;

const FillContainerPast = styled.div`
	${fillContainerStyles}
	background-color: ${themeTokens.inform.base};
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
	referenceTime: DateTime;
	start: DateTime;
	stop: DateTime;
	weather: WeatherIndicator;
	isCroppedLeft?: boolean;
	isCroppedRight?: boolean;
};

export const ChartHourlyFill: React.FC<ChartHourlyFillProps> = (props) => {
	const { referenceTime, start, stop, weather, isCroppedLeft = false, isCroppedRight = false } = props;

	const isAfterEnd = referenceTime >= stop;

	const startOfDay = start.startOf('day');
	const startPercent = percentFromStartOfDay(start, startOfDay);
	const stopPercent = percentFromStartOfDay(stop, startOfDay);
	const widthPercent = stopPercent - startPercent;

	const Container = isAfterEnd ? FillContainerPast : (weather === WeatherIndicator.best ? FillContainerBest : FillContainerOkay);

	return (
		<Container
			$isCroppedLeft={isCroppedLeft}
			$isCroppedRight={isCroppedRight}
			style={{
				left: asPercentString(startPercent),
				width: asPercentString(widthPercent)
			}}
		/>
	);
};