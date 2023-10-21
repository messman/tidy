import * as React from 'react';
import styled from 'styled-components';
import { StyledFC } from '@/index/core/primitive/primitive-styled';
import { themeTokens } from '@/index/core/theme/theme-root';
import { asPercentString } from '@/index/core/time/time';

const gradientMin = -25;
const gradientMax = 120;

const dotSize = '.5rem';
const borderRadius = '.125rem';

const ColorContainer = styled.div`
	position: relative;
	height: ${dotSize};
	border-radius: ${borderRadius};
	overflow: hidden;
	background-color: ${themeTokens.background.tint.medium};
`;

const ColorBackground = styled.div`
	position: absolute;
	height: ${dotSize};
	background: ${themeTokens.content.temperatureGradient};
	top: 0;
`;

const DotOffsetContainer = styled.div`
	position: relative;
	height: ${dotSize};
	width: calc(100% - ${dotSize}); // Used to ensure that as we offset from the left we don't get cut off;
`;

const Dot = styled.div`
	position: absolute;
	background-color: ${themeTokens.text.distinct};
	width: ${dotSize};
	height: ${dotSize};
	border-radius: ${borderRadius};
	top: 0;
`;

interface WeatherTempBarColorProps {
	low: number;
	high: number;
	value?: number;
};

const WeatherTempBarColor: React.FC<WeatherTempBarColorProps> = (props) => {
	const { low, high, value } = props;

	/*
		We show a visualization of the temperature going from min to max.
		We have a pre-made gradient that goes from (some super low value) to (some super high value).
		We need to stretch the gradient out so that only the min-max temp for today is visible.
	*/
	const stretchFactor = ((gradientMax - gradientMin) / (high - low));
	const leftGradientPercent = 0 - (((low - gradientMin) / (gradientMax - gradientMin)) * stretchFactor);
	const widthGradientPercent = stretchFactor;

	let valueDotRender: React.ReactNode = null;
	if (value !== undefined) {
		const dotPercent = (value - low) / (high - low);
		valueDotRender = (
			<DotOffsetContainer>
				<Dot style={{ left: asPercentString(dotPercent) }} />
			</DotOffsetContainer>
		);
	}

	return (
		<ColorContainer>
			<ColorBackground style={{ left: asPercentString(leftGradientPercent), width: asPercentString(widthGradientPercent) }} />
			{valueDotRender}
		</ColorContainer>
	);
};

const Container = styled.div`
	position: relative;
	height: ${dotSize};
	border-radius: ${borderRadius};
	overflow: hidden;
	background-color: ${themeTokens.background.tint.medium};
`;

const OffsetContainer = styled.div`
	position: absolute;
	height: ${dotSize};
	border-radius: ${borderRadius};
	overflow: hidden;
`;

export interface WeatherTempBarProps {
	low: number;
	high: number;
	value?: number;
	min?: number;
	max?: number;
};

export const WeatherTempBar: StyledFC<WeatherTempBarProps> = (props) => {
	const { className, low, high, value, min = Infinity, max = -Infinity } = props;

	const safeLow = Math.max(gradientMin, value !== undefined ? Math.min(low, value) : low);
	const safeHigh = Math.min(gradientMax, value !== undefined ? Math.max(high, value) : high);
	const safeMin = Math.min(min, safeLow);
	const safeMax = Math.max(max, safeHigh);

	const left = (safeLow - safeMin) / (safeMax - safeMin);
	const right = (safeHigh - safeMin) / (safeMax - safeMin);

	return (
		<Container className={className}>
			<OffsetContainer style={{ left: asPercentString(left), width: asPercentString(right - left) }}>
				<WeatherTempBarColor high={safeHigh} low={safeLow} value={value} />
			</OffsetContainer>
		</Container>
	);
};