import * as React from 'react';
import styled from 'styled-components';
import { fontStyleDeclarations } from '@/core/text';
import { Spacing } from '@/core/theme/box';
import { FontWeight } from '@/core/theme/font';
import { WeatherStatusIcon } from '@/core/weather/weather-icon';
import { useBatchResponse } from '@/services/data/data';
import { getTimeTwelveHour } from '@/services/time';
import * as iso from '@wbtdevlocal/iso';

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
	weather: iso.Batch.WeatherContentHourly;
}

const HourlyWeather: React.FC<HourlyWeatherProps> = (props) => {
	const { time, temp, pop, status, isDaytime } = props.weather;
	const { hour, ampm } = getTimeTwelveHour(time);

	const roundedPop = Math.round(pop * 10) * 10;

	let weatherIcon: JSX.Element = <WeatherStatusIcon status={status} isDay={isDaytime} />;

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
	${fontStyleDeclarations.small};
	font-weight: ${FontWeight.medium};
	color: ${p => p.theme.textDistinct};
	margin-bottom: ${Spacing.bat08};
`;

const TempText = styled.div`
	${fontStyleDeclarations.body};
	font-weight: ${FontWeight.medium};
	color: ${p => p.theme.textSubtle};
	margin-top: ${Spacing.bat08};
`;

const RainIconContainer = styled.div`
	display: block;
	background-color: ${p => p.theme.common.content.backgroundDay};
	border-radius: 2rem;
	padding-bottom: .625rem;
`;

const RainIconText = styled.div`
	${fontStyleDeclarations.tiny};
	font-weight: ${FontWeight.medium};
	text-align: center;
	color: #FFF;
`;