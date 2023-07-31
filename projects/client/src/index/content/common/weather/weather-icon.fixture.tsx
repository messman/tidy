import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { icons } from '@wbtdevlocal/assets';
import { BaseWeatherIcon } from './weather-icon';

export default CosmosFixture.create(() => {

	return (
		<>
			<BaseWeatherIcon type={icons.weatherCloud} />
			<BaseWeatherIcon type={icons.weatherClouds} />
			<BaseWeatherIcon type={icons.weatherCloudyMoon} />
			<BaseWeatherIcon type={icons.weatherCloudySun} />
			<BaseWeatherIcon type={icons.weatherCloudyWind} />
			<BaseWeatherIcon type={icons.weatherFog} />
			<BaseWeatherIcon type={icons.weatherHail} />
			<BaseWeatherIcon type={icons.weatherLightningMoon} />
			<BaseWeatherIcon type={icons.weatherLightningSun} />
			<BaseWeatherIcon type={icons.weatherLightning} />
			<BaseWeatherIcon type={icons.weatherMoon} />
			<BaseWeatherIcon type={icons.weatherPressure} />
			<BaseWeatherIcon type={icons.weatherQuestion} />
			<BaseWeatherIcon type={icons.weatherRainMoon} />
			<BaseWeatherIcon type={icons.weatherRainSun} />
			<BaseWeatherIcon type={icons.weatherRain} />
			<BaseWeatherIcon type={icons.weatherSnowflake} />
			<BaseWeatherIcon type={icons.weatherSun} />
			<BaseWeatherIcon type={icons.weatherTemperatureCold} />
			<BaseWeatherIcon type={icons.weatherTemperatureHot} />
			<BaseWeatherIcon type={icons.weatherTemperature} />
			<BaseWeatherIcon type={icons.weatherWind} />
		</>
	);
}, {
	setup: FixtureSetup.root
});