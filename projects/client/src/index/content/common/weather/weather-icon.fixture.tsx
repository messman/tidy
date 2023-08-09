import * as React from 'react';
import styled from 'styled-components';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { icons } from '@wbtdevlocal/assets';
import { WeatherIcon } from './weather-icon';

const IconContainer = styled.div`
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
	margin: 1rem;
`;


export default CosmosFixture.create(() => {

	const rain = Cosmos.useControlValue("Rain", 0);

	const weatherIcons = [
		icons.weatherCloud,
		icons.weatherClouds,
		icons.weatherCloudyMoon,
		icons.weatherCloudySun,
		icons.weatherCloudyWind,
		icons.weatherFog,
		icons.weatherHail,
		icons.weatherLightningMoon,
		icons.weatherLightningSun,
		icons.weatherLightning,
		icons.weatherMoon,
		icons.weatherPressure,
		icons.weatherQuestion,
		icons.weatherRainMoon,
		icons.weatherRainSun,
		icons.weatherRain,
		icons.weatherSnowflake,
		icons.weatherSun,
		icons.weatherTemperatureCold,
		icons.weatherTemperatureHot,
		icons.weatherTemperature,
		icons.weatherWind,
	];

	return (
		<>
			<IconContainer>
				{weatherIcons.map((icon) => {
					return (
						<WeatherIcon key={icon.iconName} type={icon} rain={rain} />
					);
				})}
			</IconContainer>
			<IconContainer>
				{weatherIcons.map((icon) => {
					return (
						<WeatherIcon key={icon.iconName} type={icon} rain={null} />
					);
				})}
			</IconContainer>
		</>
	);
}, {
	setup: FixtureSetup.root
});