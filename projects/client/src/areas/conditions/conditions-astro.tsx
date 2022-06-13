import * as React from 'react';
import { DaylightIcon } from '@/core/astro/daylight-icon';
import { IconInputType } from '@/core/icon/icon';
import { IconTitle } from '@/core/layout/layout';
import { Note } from '@/core/note';
import { Paragraph } from '@/core/text';
import { Block } from '@/core/theme/box';
import { BaseWeatherIcon } from '@/core/weather/weather-icon';
import { useBatchResponse } from '@/services/data/data';
import { getDurationDescription } from '@/services/time';
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
			if (percent < .15) {
				title = `The day is young`;
			}
			else if (percent < .85) {
				title = `Today is always the day`;
			}
			else {
				title = `The day is getting long`;
			}
			tense = 'has';
		}
		else {
			icon = icons.weatherMoon;
			if (percent < .15) {
				title = `Good evening`;
			}
			else if (percent < .85) {
				title = `Shoot for the stars`;
			}
			else {
				title = `The day approaches`;
			}
			tense = meta.referenceTime > today.rise ? 'had' : 'will have';
		}
		icon = <BaseWeatherIcon type={icon} />;
	}

	return (
		<>
			<IconTitle iconRender={icon}>{title}</IconTitle>
			<Block.Bat08 />
			<Paragraph>Today {tense} {getDurationDescription(today.rise, today.set)} of sunlight.</Paragraph>
			<Block.Bat08 />
			<Paragraph>{next.isRise ? 'Sunrise' : 'Sundown'} is in {getDurationDescription(meta.referenceTime, next.time)}.</Paragraph>
			<Block.Bat08 />
			<Note>
				Here, sunrise is when the sun breaks over the horizon, and sundown is when the sun fully disappears over the horizon.
			</Note>
		</>
	);
};