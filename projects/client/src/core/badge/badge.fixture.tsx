import { DateTime } from 'luxon';
import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import * as iso from '@wbtdevlocal/iso';
import { Block } from '../theme/box';
import { BadgeCollection, DaylightBadge, TideLevelBadge, WeatherBadge } from './badge';

export default CosmosFixture.create(() => {

	const height = 0;
	const time = DateTime.now();
	const computed = 0;
	const isComputed = false;
	const isAlternate = false;
	const entries: iso.Tide.MeasureStamp[] = [
		{ division: iso.Tide.Division.high, direction: iso.Tide.Direction.turning, height, time, computed, isComputed, isAlternate },
		{ division: iso.Tide.Division.high, direction: iso.Tide.Direction.falling, height, time, computed, isComputed, isAlternate },
		{ division: iso.Tide.Division.mid, direction: iso.Tide.Direction.falling, height, time, computed, isComputed, isAlternate },
		{ division: iso.Tide.Division.low, direction: iso.Tide.Direction.falling, height, time, computed, isComputed, isAlternate },
		{ division: iso.Tide.Division.low, direction: iso.Tide.Direction.turning, height, time, computed, isComputed, isAlternate },
		{ division: iso.Tide.Division.low, direction: iso.Tide.Direction.rising, height, time, computed, isComputed, isAlternate },
		{ division: iso.Tide.Division.mid, direction: iso.Tide.Direction.rising, height, time, computed, isComputed, isAlternate },
		{ division: iso.Tide.Division.high, direction: iso.Tide.Direction.rising, height, time, computed, isComputed, isAlternate },
		{ division: iso.Tide.Division.mid, direction: iso.Tide.Direction.turning, height, time, computed, isComputed, isAlternate },
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
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.unknown}>unknown</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.clear}>clear</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.clear_hot}>clear_hot</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.clear_cold}>clear_cold</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.clouds_few}>clouds_few</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.clouds_some}>clouds_some</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.clouds_most}>clouds_most</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.clouds_over}>clouds_over</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.rain_drizzle}>rain_drizzle</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.rain_light}>rain_light</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.rain_medium}>rain_medium</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.rain_heavy}>rain_heavy</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.rain_freeze}>rain_freeze</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.snow_light}>snow_light</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.snow_medium}>snow_medium</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.snow_heavy}>snow_heavy</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.snow_sleet}>snow_sleet</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.snow_rain}>snow_rain</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.thun_light}>thun_light</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.thun_medium}>thun_medium</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.thun_heavy}>thun_heavy</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.intense_storm}>intense_storm</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.intense_other}>intense_other</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.dust}>dust</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.smoke}>smoke</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.haze}>haze</WeatherBadge>
				<WeatherBadge isDay={true} status={iso.Weather.StatusType.fog}>fog</WeatherBadge>
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