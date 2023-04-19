import * as React from 'react';
import styled from 'styled-components';
import { Icon } from '@/core/icon/icon';
import { IconTitle } from '@/core/layout/layout';
import { fontStyleDeclarations, Paragraph } from '@/core/text';
import { Block } from '@/core/theme/box';
import { FontWeight } from '@/core/theme/font';
import { BaseWeatherIcon } from '@/core/weather/weather-icon';
import { useBatchResponse } from '@/services/data/data';
import { icons } from '@wbtdevlocal/assets';

const tempGradientBottom = -25;
const tempGradientTop = 120;

export const ConditionsBasics: React.FC = () => {
	const { weather, beach } = useBatchResponse().success!;

	const { temp, tempFeelsLike, dewPoint } = weather.current;
	const { minTemp, maxTemp } = beach.days[0].weather;

	const roundedTemp = Math.round(temp);
	const roundedTempFeelsLike = Math.round(tempFeelsLike);


	let dewPointIndicating: string = null!;
	/*
		Sources:
		- https://www.weather.gov/arx/heat_index
		- https://weatherworksinc.com/news/humidity-vs-dewpoint
	*/
	if (dewPoint < 55) {
		dewPointIndicating = 'dry conditions.';
	}
	else if (dewPoint < 65) {
		dewPointIndicating = 'somewhat muggy conditions.';
	}
	else {
		dewPointIndicating = 'muggy conditions.';
	}

	const feelsLike = roundedTemp !== roundedTempFeelsLike ? (
		<>It feels like {roundedTempFeelsLike}&deg;. </>
	) : null;

	const tempForGradient = Math.max(tempGradientBottom, Math.min(tempGradientTop, temp));
	const minTempForGradient = Math.max(tempGradientBottom, Math.min(tempGradientTop, minTemp));
	const maxTempForGradient = Math.max(tempGradientBottom, Math.min(tempGradientTop, maxTemp));
	const tempPercent = ((tempForGradient - minTempForGradient) / (maxTempForGradient - minTempForGradient)) * 100;
	/*
		We show a visualization of the temperature going from min to max.
		We have a pre-made gradient that goes from (some super low value) to (some super high value).
		We need to stretch the gradient out so that only the min-max temp for today is visible.
	*/
	const stretchFactor = ((tempGradientTop - tempGradientBottom) / (maxTempForGradient - minTempForGradient));
	const leftGradientPercent = 0 - ((((minTempForGradient - tempGradientBottom) / (tempGradientTop - tempGradientBottom)) * 100) * stretchFactor);
	const widthGradientPercent = stretchFactor * 100;

	return (
		<>
			<IconTitle iconRender={
				<BaseWeatherIcon type={<TemperatureIcon type={icons.weatherTemperature} />} />
			}>
				{roundedTemp}&deg;
			</IconTitle>
			<Block.Bat08 />
			<Paragraph>
				{feelsLike}
				The dew point is {Math.round(dewPoint)}&deg;, indicating {dewPointIndicating}
			</Paragraph>
			<Block.Bat08 />
			<RangeContainer>
				<SmallLabel>{Math.round(minTemp)}&deg;</SmallLabel>
				<Block.Bat08 />
				<VisualContainer>
					<VisualBackground leftPercent={leftGradientPercent} widthPercent={widthGradientPercent} />
					<VisualAdjust>
						<VisualCircle percent={tempPercent} />
					</VisualAdjust>
				</VisualContainer>
				<Block.Bat08 />
				<SmallLabel>{Math.round(maxTemp)}&deg;</SmallLabel>
			</RangeContainer>
		</>
	);
};

const TemperatureIcon = styled(Icon)`
	color: #FFF;
`;

const SmallLabel = styled.div`
	${fontStyleDeclarations.small};
	font-weight: ${FontWeight.medium};
	color: ${p => p.theme.textSubtle};
`;

const RangeContainer = styled.div`
	display: flex;
	align-items: center;
`;

//#region Visual

const visualSize = '.5rem';
const visualBorder = '.25rem';

/**
 * The top-level background that the user sees.
*/
const VisualContainer = styled.div`
	position: relative;
	height: ${visualSize};
	width: 100%;
	border-radius: ${visualBorder};
	overflow: hidden;
`;

const VisualBackground = styled.div<{ leftPercent: number; widthPercent: number; }>`
	position: absolute;
	height: ${visualSize};
	background: ${p => p.theme.visual.temperatureGradient};
	top: 0;
	left: ${p => p.leftPercent}%;
	width: ${p => p.widthPercent}%;
`;

/**
 * An invisible layer in-between that allows us to use absolute position percentages correctly for the circle.
*/
const VisualAdjust = styled.div`
	// subtract the width of the circle so that 100% still shows the full circle.
	width: calc(100% - ${visualSize});
	position: relative;
	height: ${visualSize};
`;

/** It would have been great to use outline for this circle, but unfortunately Safari won't render border-radius with outline. */
const VisualCircle = styled.div<{ percent: number; }>`
	position: absolute;
	box-sizing: content-box;
    border: 0.25rem solid #FFF;
	width: ${visualSize};
	height: ${visualSize};
	border-radius: .5rem; // Different with content-box
	top: -0.25rem; // Different with content-box
	left: ${p => p.percent}%;
`;
//#endregion