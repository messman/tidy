import { DateTime } from 'luxon';
import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';
import { Block } from '../theme/box';
import { BadgeCollection, DaylightBadge, TideLevelBadge, WeatherBadge } from './badge';

export default CosmosFixture.create(() => {

	const height = 0;
	const time = DateTime.now();
	const entries: iso.Tide.Stamp[] = [
		{ division: iso.Tide.Division.high, direction: iso.Tide.Direction.turning, height, time },
		{ division: iso.Tide.Division.high, direction: iso.Tide.Direction.falling, height, time },
		{ division: iso.Tide.Division.mid, direction: iso.Tide.Direction.falling, height, time },
		{ division: iso.Tide.Division.low, direction: iso.Tide.Direction.falling, height, time },
		{ division: iso.Tide.Division.low, direction: iso.Tide.Direction.turning, height, time },
		{ division: iso.Tide.Division.low, direction: iso.Tide.Direction.rising, height, time },
		{ division: iso.Tide.Division.mid, direction: iso.Tide.Direction.rising, height, time },
		{ division: iso.Tide.Division.high, direction: iso.Tide.Direction.rising, height, time },
		{ division: iso.Tide.Division.mid, direction: iso.Tide.Direction.turning, height, time },
	];

	const entriesRender = entries.map((entry) => {
		return (
			<TideLevelBadge key={`${entry.division}-${entry.direction}`} tide={entry}>
				{iso.keyForEnumValue(iso.Tide.Division, entry.division)}, {iso.keyForEnumValue(iso.Tide.Direction, entry.direction)}
			</TideLevelBadge>
		);
	});

	return (
		<>
			<BadgeCollection>
				<WeatherBadge icon={icons.weatherCloud}>Cloud</WeatherBadge>
				<WeatherBadge icon={icons.weatherClouds}>Clouds</WeatherBadge>
				<WeatherBadge icon={icons.weatherCloudyMoon}>Cloudy Moon</WeatherBadge>
				<WeatherBadge icon={icons.weatherCloudySun}>Cloudy Sun</WeatherBadge>
				<WeatherBadge icon={icons.weatherCloudyWind}>Cloudy Wind</WeatherBadge>
				<WeatherBadge icon={icons.weatherFog}>Fog</WeatherBadge>
				<WeatherBadge icon={icons.weatherHail}>Hail</WeatherBadge>
				<WeatherBadge icon={icons.weatherLightningMoon}>Lightning Moon</WeatherBadge>
				<WeatherBadge icon={icons.weatherLightningSun}>Lightning Sun</WeatherBadge>
				<WeatherBadge icon={icons.weatherLightning}>Lightning</WeatherBadge>
				<WeatherBadge icon={icons.weatherMoon}>Moon</WeatherBadge>
				<WeatherBadge icon={icons.weatherRainMoon}>Rain Moon</WeatherBadge>
				<WeatherBadge icon={icons.weatherRainSun}>Rain Sun</WeatherBadge>
				<WeatherBadge icon={icons.weatherRain}>Rain</WeatherBadge>
				<WeatherBadge icon={icons.weatherSnowflake}>Snowflake</WeatherBadge>
				<WeatherBadge icon={icons.weatherSun}>Sun</WeatherBadge>
				<WeatherBadge icon={icons.weatherWind}>Wind</WeatherBadge>
			</BadgeCollection>
			<Block.Elf24 />
			<BadgeCollection>
				{entriesRender}
			</BadgeCollection>
			<Block.Elf24 />
			<BadgeCollection>
				<DaylightBadge isDaytime={true}>6 hours</DaylightBadge>
				<DaylightBadge isDaytime={false}>6 hours</DaylightBadge>
			</BadgeCollection>
		</>
	);
}, {
	container: FixtureContainer.panelPadding
});