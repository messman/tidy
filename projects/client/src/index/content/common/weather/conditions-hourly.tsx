import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponse } from '@/index/core/data/data';
import { FontWeight, Spacing } from '@/index/core/primitive/primitive-design';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { getTimeTwelveHour } from '@/index/core/time/time';
import { WeatherContentHourly } from '@wbtdevlocal/iso';
import { WeatherIconDayNight } from './weather-icon';

export const ConditionsHourly: React.FC = () => {
	const { meta, weather } = useBatchResponse().success!;

	const hourlyRender = weather.hourly.map((weather) => {
		if (weather.time < meta.referenceTime) {
			return null;
		}

		return <HourlyWeather key={weather.time.toMillis()} weather={weather} />;
	});


	return (
		<Container>
			{hourlyRender}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: stretch;
	padding: ${Spacing.bat08} ${Spacing.dog16};
	overflow-x: scroll;
`;

interface HourlyWeatherProps {
	weather: WeatherContentHourly;
}

const HourlyWeather: React.FC<HourlyWeatherProps> = (props) => {
	const { time, temp, pop, status, isDaytime } = props.weather;
	const { hour, ampm } = getTimeTwelveHour(time);

	const roundedPop = Math.round(pop * 10) * 10;

	let weatherIcon: JSX.Element = <WeatherIconDayNight status={status} isDay={isDaytime} />;

	// If greater than 10% chance, show it
	if (roundedPop > 10) {
		weatherIcon = (
			<RainIconContainer>
				{weatherIcon}
				<RainIconText>{roundedPop}%</RainIconText>
			</RainIconContainer>
		);
	}

	return (
		<HourlyContainer>
			<TimeText>{hour} {ampm}</TimeText>
			{weatherIcon}
			<TempText>{Math.round(temp)}&deg;</TempText>
		</HourlyContainer>
	);
};

const HourlyContainer = styled.div`
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;

	& + & {
		margin-left: ${Spacing.dog16};
	}
`;

const TimeText = styled.div`
	${fontStyles.text.small};
	font-weight: ${FontWeight.medium};
	color: ${themeTokens.text.distinct};
	margin-bottom: ${Spacing.bat08};
`;

const TempText = styled.div`
	${fontStyles.text.medium};
	font-weight: ${FontWeight.medium};
	color: ${themeTokens.text.subtle};
	margin-top: ${Spacing.bat08};
`;

const RainIconContainer = styled.div`
	display: block;
	border-radius: 2rem;
	padding-bottom: .625rem;
`;

const RainIconText = styled.div`
	${fontStyles.text.tiny};
	font-weight: ${FontWeight.medium};
	text-align: center;
	color: #FFF;
`;