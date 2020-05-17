import * as React from 'react';
import { styled, StyledFC } from '@/core/style/styled';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { timeToPixels } from '@/services/time';
import { WeatherEventMarker, DayEventMarker, TideEventMarker } from './eventMarker';
import { filterWeatherEvents } from '../../upperTimeline';

interface EventMarkersProps {
}

export const EventMarkers: StyledFC<EventMarkersProps> = () => {
	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;

	const markers: JSX.Element[] = [];
	const startTime = info.referenceTime;

	const weatherEvents = filterWeatherEvents(all.predictions.weather, all.predictions.cutoffDate);
	weatherEvents.forEach(function (ev) {
		const key = `w_${ev.time.valueOf()}`;
		markers.push(<WeatherEventMarker key={key} positionLeft={timeToPixels(startTime, ev.time)} />);
	});

	all.predictions.sun.forEach(function (ev) {
		const key = `d_${ev.time.valueOf()}`;
		markers.push(<DayEventMarker key={key} positionLeft={timeToPixels(startTime, ev.time)} />);
		if (ev.isSunrise && startTime.hasSame(ev.time, 'day')) {
			const startOfDay = ev.time.startOf('day');
			const startKey = `d_${startOfDay.valueOf()}`;
			markers.push(<DayEventMarker key={startKey} positionLeft={timeToPixels(startTime, startOfDay)} />);
		}
		if (!ev.isSunrise) {
			const endOfDay = ev.time.endOf('day');
			const endKey = `d_${endOfDay.valueOf()}`;
			markers.push(<DayEventMarker key={endKey} positionLeft={timeToPixels(startTime, endOfDay)} />);
		}
	});

	all.predictions.tides.events.forEach(function (ev) {
		const key = `t_${ev.time.valueOf()}`;
		markers.push(<TideEventMarker key={key} positionLeft={timeToPixels(startTime, ev.time)} />);
	});


	return (
		<EventMarkerContainer>
			{markers}
		</EventMarkerContainer>
	);
}

const EventMarkerContainer = styled.div`
	position: absolute;
	top: -10px;
	bottom: -10px;
	left: 0;
	right: 0;
	overflow: hidden;
`;