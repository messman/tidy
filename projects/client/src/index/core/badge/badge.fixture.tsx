import { DateTime } from 'luxon';
import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { keyForNumberEnumValue, TideLevelDirection, TideLevelDivision, TidePoint } from '@wbtdevlocal/iso';
import { Block } from '../layout/layout-shared';
import { BadgeCollection, DaylightBadge, TideLevelBadge } from './badge';

export default CosmosFixture.create(() => {

	const height = 0;
	const time = DateTime.now();
	const computed = 0;
	const isComputed = false;
	const isAlternate = false;
	const entries: TidePoint[] = [
		{ division: TideLevelDivision.high, direction: TideLevelDirection.turning, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.high, direction: TideLevelDirection.falling, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.mid, direction: TideLevelDirection.falling, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.low, direction: TideLevelDirection.falling, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.low, direction: TideLevelDirection.turning, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.low, direction: TideLevelDirection.rising, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.mid, direction: TideLevelDirection.rising, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.high, direction: TideLevelDirection.rising, height, time, computed, isComputed, isAlternate },
		{ division: TideLevelDivision.mid, direction: TideLevelDirection.turning, height, time, computed, isComputed, isAlternate },
	];

	const entriesRender = entries.map((entry) => {
		return (
			<TideLevelBadge key={`${entry.division}-${entry.direction}`} tide={entry}>
				{keyForNumberEnumValue(TideLevelDivision, entry.division)}, {keyForNumberEnumValue(TideLevelDirection, entry.direction)}
			</TideLevelBadge>
		);
	});


	return (
		<>
			<BadgeCollection>
				{/* <WeatherBadge isDay={true} status={WeatherStatusType.unknown}>unknown</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.clear}>clear</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.clear_hot}>clear_hot</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.clear_cold}>clear_cold</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.clouds_few}>clouds_few</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.clouds_some}>clouds_some</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.clouds_most}>clouds_most</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.clouds_over}>clouds_over</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.rain_drizzle}>rain_drizzle</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.rain_light}>rain_light</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.rain_medium}>rain_medium</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.rain_heavy}>rain_heavy</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.rain_freeze}>rain_freeze</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.snow_light}>snow_light</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.snow_medium}>snow_medium</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.snow_heavy}>snow_heavy</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.snow_sleet}>snow_sleet</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.snow_rain}>snow_rain</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.thun_light}>thun_light</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.thun_medium}>thun_medium</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.thun_heavy}>thun_heavy</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.intense_storm}>intense_storm</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.intense_other}>intense_other</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.dust}>dust</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.smoke}>smoke</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.haze}>haze</WeatherBadge>
				<WeatherBadge isDay={true} status={WeatherStatusType.fog}>fog</WeatherBadge> */}
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
	setup: FixtureSetup.glass
});