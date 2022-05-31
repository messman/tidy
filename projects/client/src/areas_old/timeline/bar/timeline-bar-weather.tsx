// import { DateTime } from 'luxon';
// import * as React from 'react';
// import { TimeTextUnit } from '@/core/text-unit';
// import { hasAllResponseData, useAllResponse } from '@/services/data/data';
// import { timeToPixels } from '@/services/time';
// import { filterWeather } from '@/services/weather/weather-process';
// import { TimelineBarLine, TimelineBaseProps, TimelineDotEntry, weatherCutoffHoursFromReference } from './timeline-bar-common';

// export interface TimelineBarWeatherProps extends TimelineBaseProps { }

// export const TimelineBarWeather: React.FC<TimelineBarWeatherProps> = (props) => {

// 	const allResponseState = useAllResponse();
// 	const theme = useCurrentTheme();
// 	const color = theme.color.weather;
// 	if (!hasAllResponseData(allResponseState)) {
// 		return null;
// 	}
// 	const { timelineStartTime } = props;
// 	const { all, info } = allResponseState.data!;
// 	const { weather, cutoffDate } = all.predictions;

// 	const validWeatherStatuses = filterWeather(weather, info.referenceTime, weatherCutoffHoursFromReference, cutoffDate);

// 	const lastEvent = validWeatherStatuses[validWeatherStatuses.length - 1];
// 	// Add some time padding to make sure we include all necessary information.
// 	const lastEventTime = lastEvent.time.plus({ hours: 1 });
// 	const widthPixels = timeToPixels(timelineStartTime, lastEventTime);

// 	const smallDotTimes: DateTime[] = [];
// 	let previousTime = info.referenceTime;

// 	const weatherEntries = validWeatherStatuses.map((weatherStatus) => {

// 		const statusTime = weatherStatus.time;
// 		const hoursToPreviousTime = statusTime.diff(previousTime, 'hours').hours;
// 		if (hoursToPreviousTime > 1) {
// 			const hoursToAdd = Math.ceil(hoursToPreviousTime - 1);
// 			for (let i = 1; i <= hoursToAdd; i++) {
// 				smallDotTimes.push(statusTime.minus({ hours: i }));
// 			}
// 		}

// 		previousTime = statusTime;

// 		return (
// 			<TimelineDotEntry
// 				key={weatherStatus.time.valueOf()}
// 				startTime={timelineStartTime}
// 				dateTime={statusTime}
// 				dotColor={color}
// 				isSmall={false}
// 			>
// 				<TimeTextUnit dateTime={weatherStatus.time} isHourOnly={true} />
// 			</TimelineDotEntry>
// 		);
// 	});

// 	const betweenHours = smallDotTimes.map((time) => {
// 		return (
// 			<TimelineDotEntry
// 				key={time.valueOf()}
// 				startTime={timelineStartTime}
// 				dateTime={time}
// 				dotColor={color}
// 				isSmall={true}
// 			/>
// 		);
// 	});

// 	return (
// 		<TimelineBarLine lineWidth={widthPixels}>
// 			{weatherEntries}
// 			{betweenHours}
// 		</TimelineBarLine>
// 	);
// };