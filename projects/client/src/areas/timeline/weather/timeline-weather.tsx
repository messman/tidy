import * as React from 'react';
import { styled, StyledFC } from '@/core/style/styled';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { useCurrentTheme } from '@/core/style/theme';
import { cutoffHoursFromReference, TimelineEntryProps, TimelineEntry } from '../bar/timeline-bar-common';
import { Flex, FlexRow, FlexColumn } from '@/core/layout/flex';
import { WeatherStatus, SunEvent } from 'tidy-shared';
import { Icon, iconTypes } from '@/core/symbol/icon';
import { subtitleHeight, Text, titleHeight } from '@/core/symbol/text';
import { processWeatherForDisplay } from '@/services/weather/weather-process';
import { TextUnit } from '@/core/symbol/text-unit';


interface TimelineWeatherProps {
}

export const TimelineWeather: StyledFC<TimelineWeatherProps> = () => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();
	const color = theme.color.weather;
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;
	const { weather, cutoffDate, sun } = all.predictions;

	// Filter out status if it's too close to our reference time or after our cutoff.
	const referenceTimePlusCutoff = info.referenceTime.plus({ hours: cutoffHoursFromReference });
	const validWeatherStatuses = weather.filter((weatherStatus) => {
		return (weatherStatus.time > referenceTimePlusCutoff) && (weatherStatus.time < cutoffDate);
	});

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
				referenceTime={info.referenceTime}
				dateTime={weatherStatus.time}
				weatherStatus={weatherStatus}
				iconColor={color}
				useDayIcon={useDayIcon}
			/>
		)
	});

	return (
		<TimelineWeatherContainer flex='none'>
			{weatherEntries}
		</TimelineWeatherContainer>
	);
}

const weatherContainerHeight = '9rem';
const weatherEntriesHeight = '8rem'

const TimelineWeatherContainer = styled(Flex)`
	height: ${weatherContainerHeight};
`;

interface TimelineWeatherEntryProps extends Omit<TimelineEntryProps, 'top'> {
	weatherStatus: WeatherStatus
	iconColor: string,
	useDayIcon: boolean
}

const TimelineWeatherEntry: React.FC<TimelineWeatherEntryProps> = (props) => {

	const iconHeight = subtitleHeight;
	const { iconColor, useDayIcon } = props;
	const { tempText, windText, icon, chanceRainText } = processWeatherForDisplay(props.weatherStatus, useDayIcon);

	return (
		<TimelineEntry referenceTime={props.referenceTime} dateTime={props.dateTime} top={weatherEntriesHeight}>
			<FlexColumn>

				<NonBreakingPadding>
					<Center>
						<SpacedIcon type={icon} fill={iconColor} height={titleHeight} />
					</Center>
				</NonBreakingPadding>
				<NonBreakingPadding>
					<Text>
						<FlexRow alignItems='center'>
							<SpacedIcon type={iconTypes.temperature} fill={props.iconColor} height={iconHeight} />
							{tempText}&deg;
				</FlexRow>
					</Text>
				</NonBreakingPadding>
				<NonBreakingPadding>
					<Text>
						<FlexRow alignItems='center'>
							<SpacedIcon type={iconTypes.rain} fill={iconColor} height={iconHeight} />
							{chanceRainText}
						</FlexRow>
					</Text>
				</NonBreakingPadding>
				<NonBreakingPadding>
					<Text>
						<FlexRow alignItems='center'>
							<SpacedIcon type={iconTypes.wind} fill={iconColor} height={iconHeight} />
							<TextUnit text={windText} unit='mph' />
						</FlexRow>
					</Text>
				</NonBreakingPadding>
			</FlexColumn>
		</TimelineEntry>
	);
}

const Center = styled.div`
	text-align: center;
`;

const SpacedIcon = styled(Icon)`
	margin-right: .4rem;
`;

const NonBreakingPadding = styled(Flex)`
	white-space: nowrap;
`;
