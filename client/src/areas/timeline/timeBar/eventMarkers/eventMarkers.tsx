import * as React from 'react';
import { styled, StyledFC } from '@/core/style/styled';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { timeToPixels, isSameDay } from '@/services/time';
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
		const key = `w_${ev.time.getTime()}`;
		markers.push(<WeatherEventMarker key={key} positionLeft={timeToPixels(startTime, ev.time)} />);
	});

	all.predictions.sun.forEach(function (ev) {
		const key = `d_${ev.time.getTime()}`;
		markers.push(<DayEventMarker key={key} positionLeft={timeToPixels(startTime, ev.time)} />);
		if (ev.isSunrise && isSameDay(startTime, ev.time)) {
			const startOfDay = new Date(ev.time);
			startOfDay.setHours(0, 0, 0, 0);
			const startKey = `d_${startOfDay.getTime()}`;
			markers.push(<DayEventMarker key={startKey} positionLeft={timeToPixels(startTime, startOfDay)} />);
		}
		if (!ev.isSunrise) {
			const endOfDay = new Date(ev.time);
			endOfDay.setHours(24, 0, 0, 0);
			const endKey = `d_${endOfDay.getTime()}`;
			markers.push(<DayEventMarker key={endKey} positionLeft={timeToPixels(startTime, endOfDay)} />);
		}
	});

	all.predictions.tides.events.forEach(function (ev) {
		const key = `t_${ev.time.getTime()}`;
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