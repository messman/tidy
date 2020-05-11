import * as React from "react";
import { styled, StyledFC } from "@/styles/styled";
import { useAppDataContext } from "@/tree/appData";
import { timeToPixels, isSameDay } from "@/services/time";
import { WeatherEventMarker, DayEventMarker, TideEventMarker } from "./eventMarker";
import { filterWeatherEvents } from "../../upperTimeline";

interface EventMarkersProps {
}

export const EventMarkers: StyledFC<EventMarkersProps> = () => {
	const { isLoading, success } = useAppDataContext();
	if (isLoading || !success) {
		return null;
	}

	const markers: JSX.Element[] = [];
	const startTime = success.info.referenceTime;

	const weatherEvents = filterWeatherEvents(success.data!.predictions.weather, success.data!.predictions.cutoffDate);
	weatherEvents.forEach(function (ev) {
		const key = `w_${ev.time.getTime()}`;
		markers.push(<WeatherEventMarker key={key} positionLeft={timeToPixels(startTime, ev.time)} />);
	});

	success.data!.predictions.sun.forEach(function (ev) {
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

	success.data!.predictions.tides.events.forEach(function (ev) {
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