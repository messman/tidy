import * as React from 'react';
import { DaylightIcon } from '@/core/astro/daylight-icon';
import { IconInputType } from '@/core/icon/icon';
import { Block } from '@/core/layout';
import { MediumBodyText } from '@/core/text';
import { Note } from '@/core/text/note';
import { BaseWeatherIcon } from '@/core/weather/weather-icon';
import { useBatchResponse } from '@/services/data/data';
import { getDurationDescription, getTimeTwelveHourString } from '@/services/time';
import { icons } from '@wbtdevlocal/assets';

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
		icon = <BaseWeatherIcon type={icon} />;
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
			<Note>
				Here, sunrise is when the sun breaks over the horizon, and sundown is when the sun fully disappears over the horizon.
			</Note>
		</>
	);
};