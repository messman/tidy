import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { icons } from '@wbtdevlocal/assets';
import { DaylightIcon, WeatherIcon } from './weather-icon';

export default CosmosFixture.create(() => {

	return (
		<>
			<WeatherIcon type={icons.weatherCloud} />
			<WeatherIcon type={icons.weatherClouds} />
			<WeatherIcon type={icons.weatherCloudyMoon} />
			<WeatherIcon type={icons.weatherCloudySun} />
			<WeatherIcon type={icons.weatherCloudyWind} />
			<WeatherIcon type={icons.weatherFog} />
			<WeatherIcon type={icons.weatherHail} />
			<WeatherIcon type={icons.weatherLightningMoon} />
			<WeatherIcon type={icons.weatherLightningSun} />
			<WeatherIcon type={icons.weatherLightning} />
			<WeatherIcon type={icons.weatherMoon} />
			<WeatherIcon type={icons.weatherPressure} />
			<WeatherIcon type={icons.weatherQuestion} />
			<WeatherIcon type={icons.weatherRainMoon} />
			<WeatherIcon type={icons.weatherRainSun} />
			<WeatherIcon type={icons.weatherRain} />
			<WeatherIcon type={icons.weatherSnowflake} />
			<WeatherIcon type={icons.weatherSun} />
			<WeatherIcon type={icons.weatherTemperatureCold} />
			<WeatherIcon type={icons.weatherTemperatureHot} />
			<WeatherIcon type={icons.weatherTemperature} />
			<WeatherIcon type={icons.weatherWind} />

			<DaylightIcon isDaytime={true} />
			<DaylightIcon isDaytime={false} />
		</>
	);
}, {
	container: FixtureContainer.panelPadding
});