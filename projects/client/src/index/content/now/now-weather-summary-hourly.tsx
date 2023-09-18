import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Icon } from '@/index/core/icon/icon';
import { fontStyles } from '@/index/core/text/text-shared';
import { TimeTextUnit } from '@/index/core/text/text-unit';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';
import { AstroSunRiseSet } from '@wbtdevlocal/iso';
import { WeatherIcon, WeatherIconDayNight } from '../common/weather/weather-icon';

const Container = styled.div`
	display: flex;
	gap: 1.25rem;
	padding: .75rem;
	overflow-x: auto;
	width: 100%;
	background-color: ${themeTokens.background.tint.medium};
`;

const EntryContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: .25rem;
	align-items: center;
`;

const TimeText = styled.div`
	${fontStyles.text.smallHeavy}
`;

const ValueText = styled.div`
	${fontStyles.text.medium}
`;

const SunIcon = styled(Icon)`
	color: ${themeTokens.content.sun};

`;

function isAstroSunRiseSet(value: unknown): value is AstroSunRiseSet {
	return !!value && (value as AstroSunRiseSet).isSunrise !== undefined;
}

/** Expects [0, 100] */
function roundRain(value: number): number {
	return Math.round(value / 5) * 5;
}

export const NowWeatherSummaryHourly: React.FC = () => {

	const { now } = useBatchResponseSuccess();

	const hourlyRender = now.weather.hourly.map((hourlyOrSun) => {
		let render: React.ReactNode = null;
		if (isAstroSunRiseSet(hourlyOrSun)) {
			const { time, isSunrise } = hourlyOrSun;
			render = (
				<>
					<TimeText>
						<TimeTextUnit dateTime={time} />
					</TimeText>
					<WeatherIcon
						rain={null}
						type={<SunIcon type={isSunrise ? icons.astroSunrise : icons.astroSundown} />}
						isTransparent={true}
					/>
					<ValueText>{isSunrise ? 'Sunrise' : 'Sunset'}</ValueText>
				</>
			);
		}
		else {
			render = (
				<>
					<TimeText>
						<TimeTextUnit dateTime={hourlyOrSun.time} isHourOnly={true} />
					</TimeText>
					<WeatherIconDayNight
						isDay={hourlyOrSun.isDaytime}
						rain={roundRain(hourlyOrSun.pop * 100)}
						status={hourlyOrSun.status}
						isTransparent={true}
					/>
					<ValueText>{Math.round(hourlyOrSun.temp)}&deg;</ValueText>
				</>
			);
		}
		return (
			<EntryContainer key={hourlyOrSun.id}>
				{render}
			</EntryContainer>
		);
	});


	return (
		<Container>
			{hourlyRender}
		</Container>
	);
};