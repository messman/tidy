import * as React from 'react';
import { useCurrentTheme } from '@/core/style/theme';
import { TimeTextUnit } from '@/core/symbol/text-unit';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { timeToPixels } from '@/services/time';
import { filterWeather } from '@/services/weather/weather-process';
import { TimelineBarLine, TimelineBaseProps, TimelineDotEntry, weatherCutoffHoursFromReference } from './timeline-bar-common';

export interface TimelineBarWeatherProps extends TimelineBaseProps { }

export const TimelineBarWeather: React.FC<TimelineBarWeatherProps> = (props) => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();
	const color = theme.color.weather;
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { timelineStartTime } = props;
	const { all, info } = allResponseState.data!;
	const { weather, cutoffDate } = all.predictions;

	const validWeatherStatuses = filterWeather(weather, info.referenceTime, weatherCutoffHoursFromReference, cutoffDate);

	const lastEvent = validWeatherStatuses[validWeatherStatuses.length - 1];
	// Add some time padding to make sure we include all necessary information.
	const lastEventTime = lastEvent.time.plus({ hours: 1.5 });
	const widthPixels = timeToPixels(timelineStartTime, lastEventTime);

	const weatherEntries = validWeatherStatuses.map((weatherStatus) => {
		return (
			<TimelineDotEntry
				key={weatherStatus.time.valueOf()}
				startTime={timelineStartTime}
				dateTime={weatherStatus.time}
				dotColor={color}
			>
				<TimeTextUnit dateTime={weatherStatus.time} isHourOnly={true} />
			</TimelineDotEntry>
		);
	});

	return (
		<TimelineBarLine lineWidth={widthPixels}>
			{weatherEntries}
		</TimelineBarLine>
	);
};