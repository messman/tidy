import * as React from 'react';
import { styled, StyledFC } from '@/core/style/styled';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { WeatherFlag } from './weatherFlag';
import { filterWeatherEvents } from '../upperTimeline';

interface WeatherProps {
}

export const Weather: StyledFC<WeatherProps> = () => {
	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;

	let weatherEvents: JSX.Element | null = null;
	const startTime = info.referenceTime;
	const events = filterWeatherEvents(all.predictions.weather, all.predictions.cutoffDate);

	weatherEvents = (
		<>
			{
				events.map((event) => {
					return <WeatherFlag key={event.time.getTime()} startTime={startTime} event={event} />
				})
			}
		</>
	);

	return (
		<WeatherContainer>
			{weatherEvents}
		</WeatherContainer>
	);
}

const WeatherContainer = styled.div`
	position: relative;
	height: calc(15vh + 15px);
	/* to provide space for the flag content */
	min-height: 135px;
`;