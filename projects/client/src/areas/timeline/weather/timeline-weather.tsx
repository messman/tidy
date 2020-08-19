import { DateTime } from 'luxon';
import * as React from 'react';
import { SunEvent, WeatherStatus } from 'tidy-shared';
import { edgePaddingValue, flowPaddingValue } from '@/core/style/common';
import { styled, StyledFC } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { Icon } from '@/core/symbol/icon';
import { SmallText, Text, titleHeight } from '@/core/symbol/text';
import { TextUnit } from '@/core/symbol/text-unit';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { timeToPixels } from '@/services/time';
import { filterWeather, processWeatherForDisplay } from '@/services/weather/weather-process';
import { Flex, FlexColumn } from '@messman/react-common';
import { TimelineBaseProps, weatherCutoffHoursFromReference } from '../bar/timeline-bar-common';

interface TimelineWeatherProps extends TimelineBaseProps { }

export const TimelineWeather: StyledFC<TimelineWeatherProps> = (props) => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();
	const color = theme.color.weather;
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { timelineStartTime } = props;
	const { all, info } = allResponseState.data!;
	const { weather, cutoffDate, sun } = all.predictions;

	const validWeatherStatuses = filterWeather(weather, info.referenceTime, weatherCutoffHoursFromReference, cutoffDate);

	// We need to know when the sunrise and sunset is for each of the weather statuses!
	// Since everything is in order already, we will iterate as we map the weather statuses.
	let sunEventIndex = 0;

	const weatherEntries = validWeatherStatuses.map((weatherStatus) => {

		let nextSunEvent: SunEvent = sun[sunEventIndex];
		// Get the next sun event after this weather status
		while (nextSunEvent && nextSunEvent.time < weatherStatus.time) {
			sunEventIndex++;
			nextSunEvent = sun[sunEventIndex];
		}

		// By default, don't use the day icon (to cover our end case - where there are no more sun events but there are still weather statuses).
		let useDayIcon = !!nextSunEvent ? !nextSunEvent.isSunrise : false;

		return (
			<TimelineWeatherEntry
				key={weatherStatus.time.valueOf()}
				startTime={timelineStartTime}
				dateTime={weatherStatus.time}
				weatherStatus={weatherStatus}
				iconColor={color}
				useDayIcon={useDayIcon}
			/>
		);
	});

	return (
		<FlexColumn flex='1 0 auto' justifyContent='center'>
			<Flex flex='.7 0 7.5rem'>
				{weatherEntries}
			</Flex>
		</FlexColumn>
	);
};

interface TimelineWeatherEntryProps {
	startTime: DateTime;
	dateTime: DateTime;
	weatherStatus: WeatherStatus;
	iconColor: string,
	useDayIcon: boolean;
}

const TimelineWeatherEntry: React.FC<TimelineWeatherEntryProps> = (props) => {

	const { startTime, dateTime, iconColor, useDayIcon, weatherStatus } = props;
	const left = timeToPixels(startTime, dateTime);

	const { tempText, windText, windDirectionUnit, icon } = processWeatherForDisplay(weatherStatus, useDayIcon);


	return (
		<WeatherTimelineEntryContainer justifyContent='space-around' alignItems='center' left={left} >
			<NonBreakingPadding>
				<Center>
					<Icon type={icon} defaultColor={iconColor} height={titleHeight} />
				</Center>
			</NonBreakingPadding>
			<NonBreakingPadding>
				<Center>
					<Text>
						{tempText}&deg;
					</Text>
				</Center>
			</NonBreakingPadding>
			<NonBreakingPadding>
				<Center>
					<Text>
						<TextUnit text={windText} unit='mph' />
					</Text>
					<SmallText>
						{windDirectionUnit}
					</SmallText>
				</Center>
			</NonBreakingPadding>
		</WeatherTimelineEntryContainer>
	);
};

export interface WeatherTimelineEntryContainer {
	left: number,
}

export const WeatherTimelineEntryContainer = styled(FlexColumn) <WeatherTimelineEntryContainer>`
	position: absolute;
	top: 0;
	left: ${p => p.left}px;
	width: 0;
	height: 100%;
	padding: ${flowPaddingValue} 0;
`;

const Center = styled.div`
	text-align: center;
`;

const NonBreakingPadding = styled.div`
	white-space: nowrap;
	margin: calc(${edgePaddingValue} / 3) 0;
`;
