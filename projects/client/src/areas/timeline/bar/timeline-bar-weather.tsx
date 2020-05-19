import * as React from 'react';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { timeToPixels } from '@/services/time';
import { TimelineBarLine, TimelineDotEntry, cutoffHoursFromReference } from './timeline-bar-common';
import { useCurrentTheme } from '@/core/style/theme';

export const TimelineBarWeather: React.FC = () => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();
	const color = theme.color.weather;
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;
	const { weather, cutoffDate } = all.predictions;

	// Filter out status if it's too close to our reference time or after our cutoff.
	const referenceTimePlusCutoff = info.referenceTime.plus({ hours: cutoffHoursFromReference });
	const validWeatherStatuses = weather.filter((weatherStatus) => {
		return (weatherStatus.time > referenceTimePlusCutoff) && (weatherStatus.time < cutoffDate);
	});

	const lastEvent = validWeatherStatuses[validWeatherStatuses.length - 1];
	// Add some time padding to make sure we include all necessary information.
	const lastEventTime = lastEvent.time.plus({ hours: 2 });
	const widthPixels = timeToPixels(info.referenceTime, lastEventTime);

	const weatherEntries = validWeatherStatuses.map((weatherStatus) => {
		return (
			<TimelineDotEntry
				key={weatherStatus.time.valueOf()}
				referenceTime={info.referenceTime}
				dateTime={weatherStatus.time}
				backgroundColor={color}
			/>
		)
	});

	return (
		<TimelineBarLine lineWidth={widthPixels}>
			{weatherEntries}
		</TimelineBarLine>
	);
};