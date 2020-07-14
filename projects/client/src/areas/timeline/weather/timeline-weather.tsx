import { DateTime } from 'luxon';
import * as React from 'react';
import { SunEvent, WeatherStatus } from 'tidy-shared';
import { Flex, FlexColumn, FlexRow } from '@/core/layout/flex';
import { edgePaddingValue } from '@/core/style/common';
import { styled, StyledFC } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { Icon, iconTypes } from '@/core/symbol/icon';
import { subtitleHeight, Text, titleHeight } from '@/core/symbol/text';
import { TextUnit } from '@/core/symbol/text-unit';
import { SpacedIcon } from '@/core/weather/weather-common';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { timeToPixels } from '@/services/time';
import { filterWeather, processWeatherForDisplay } from '@/services/weather/weather-process';
import { TimelineBaseProps, TimelineEntryContainer, weatherCutoffHoursFromReference } from '../bar/timeline-bar-common';

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
		<FlexRow alignItems='center' flex='1 0 auto'>
			<TimelineWeatherContainer>
				{weatherEntries}
			</TimelineWeatherContainer>
		</FlexRow>
	);
};

const weatherContainerHeight = '8rem';
const weatherEntriesHeight = '1rem';

const TimelineWeatherContainer = styled(Flex)`
	height: ${weatherContainerHeight};
`;

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

	const { tempText, windText, windDirectionUnit, pressureText, icon } = processWeatherForDisplay(weatherStatus, useDayIcon);
	const iconHeight = subtitleHeight;

	return (
		<TimelineEntryContainer alignItems='center' left={left} top={weatherEntriesHeight}>
			<FlexColumn>
				<NonBreakingPadding>
					<Center>
						<Icon type={icon} fill={iconColor} height={titleHeight} />
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
					<Text>
						<FlexRow alignItems='center'>
							<SpacedIcon type={iconTypes.wind} fill={iconColor} height={iconHeight} />
							<TextUnit text={windText} unit={windDirectionUnit} />
						</FlexRow>
					</Text>
					<Text>
						<FlexRow alignItems='center'>
							<SpacedIcon type={iconTypes.pressure} fill={iconColor} height={iconHeight} />
							<TextUnit text={pressureText} unit='mb' />
						</FlexRow>
					</Text>
				</NonBreakingPadding>
			</FlexColumn>
		</TimelineEntryContainer>
	);
};

const Center = styled.div`
	text-align: center;
`;

const NonBreakingPadding = styled(Flex)`
	white-space: nowrap;
	margin: calc(${edgePaddingValue} / 6) 0;
`;
