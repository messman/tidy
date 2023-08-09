import * as React from 'react';
import { useBatchResponse } from '@/index/core/data/data';
import { IconInputType } from '@/index/core/icon/icon';
import { Block } from '@/index/core/layout/layout-shared';
import { MediumBodyText } from '@/index/core/text/text-shared';
import { getDurationDescription, getTimeTwelveHourString } from '@/index/core/time/time';
import { icons } from '@wbtdevlocal/assets';
import { WeatherIcon } from '../weather/weather-icon';
import { DaylightIcon } from './daylight-icon';

export const ConditionsAstro: React.FC = () => {
	const { meta, astro } = useBatchResponse().success!;
	const { previous, current, next } = astro.sun.relativity;
	const { today } = astro.sun;

	const isDaytime = !next.isRise;

	let icon: IconInputType = null!;
	let title: string = null!;
	let tense: string = null!;
	if (current) {
		if (current.isRise) {
			title = `The sun is rising`;
			tense = 'will have';
		}
		else {
			title = `The sun is setting`;
			tense = 'had';
		}
		icon = <DaylightIcon isDaytime={!current.isRise} />;
	}
	else {
		const previousMs = previous.time.toMillis();
		const nextMs = next.time.toMillis();
		const nowMs = meta.referenceTime.toMillis();

		const percent = (nowMs - previousMs) / (nextMs - previousMs);

		if (isDaytime) {
			icon = icons.weatherSun;
			if (percent >= .45 && percent <= .55) {
				title = `It's midday`;
			}
			if (percent < .15) {
				title = `The day is young`;
			}
			else if (percent < .85) {
				title = `Carpe diem`;
			}
			else {
				title = `The day is getting long`;
			}
			tense = 'has';
		}
		else {
			icon = icons.weatherMoon;
			if (percent < .15) {
				title = `The sun has set`;
			}
			else if (percent < .85) {
				title = `Carpe noctem`;
			}
			else {
				title = `Daytime is approaching`;
			}
			tense = meta.referenceTime > today.rise ? 'had' : 'will have';
		}
		icon = <WeatherIcon type={icon} rain={null} />;
	}

	return (
		<>
			{/* <IconTitle iconRender={icon}>
				</IconTitle> */}
			{title}
			<Block.Bat08 />
			<MediumBodyText>
				Today {tense} {getDurationDescription(today.rise, today.set)} of sunlight.
			</MediumBodyText>
			<Block.Bat08 />
			<MediumBodyText>{next.isRise ? 'Sunrise' : 'Sundown'} is at {getTimeTwelveHourString(next.time)}.</MediumBodyText>
			<Block.Bat08 />
		</>
	);
};