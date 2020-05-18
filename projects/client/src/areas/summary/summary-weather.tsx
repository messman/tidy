import * as React from 'react';
import { Text, subtitleHeight } from '@/core/symbol/text';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { ContextBlock } from './context-block';
import { FlexRow, Flex } from '@/core/layout/flex';
import { TextUnit } from '@/core/symbol/text-unit';
import { WindDirection, weatherStatusTypeDescription, WeatherStatusType } from 'tidy-shared';
import { useCurrentTheme } from '@/core/style/theme';
import { Icon, iconTypes, weatherStatusTypeIcon } from '@/core/symbol/icon';
import styled from 'styled-components';
import { edgePaddingValue } from '@/core/style/common';

export const SummaryWeather: React.FC = () => {
	return (
		<ContextBlock
			Primary={SummaryWeatherPrimary}
			Secondary={SummaryWeatherSecondary}
		/>
	);
};

const SummaryWeatherPrimary: React.FC = () => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();
	const iconColor = theme.color.weather;
	const iconHeight = subtitleHeight;

	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all } = allResponseState.data!;
	const { temp, status, wind, windDirection, chanceRain } = all.current.weather;

	const roundedWind = Math.round(wind.entity!).toString();
	const windDirectionUnit = `mph ${WindDirection[windDirection]}`;
	const weatherStatusKey = WeatherStatusType[status] as keyof typeof WeatherStatusType;
	const weatherStatusIcon = weatherStatusTypeIcon[weatherStatusKey];
	const weatherStatusIconForTime = all.current.sun.next.isSunrise ? weatherStatusIcon.night : weatherStatusIcon.day;
	const weatherStatus = weatherStatusTypeDescription[weatherStatusKey].short;

	const chanceRainPercent = Math.round(chanceRain.entity! * 100);
	const chanceRainPercentString = `${chanceRainPercent}%`;

	return (
		<FlexRow>
			<Flex>
				<Text>
					<PaddedFlexRow alignItems='center'>
						<SpacedIcon type={iconTypes.temperature} fill={iconColor} height={iconHeight} />
						{temp.entity!.toString()}&deg;
					</PaddedFlexRow>
				</Text>
				<PushedDownText>
					<PaddedFlexRow alignItems='center'>
						<SpacedIcon type={weatherStatusIconForTime} fill={iconColor} height={iconHeight} />
						{weatherStatus}
					</PaddedFlexRow>
				</PushedDownText>
			</Flex>
			<Flex>
				<Text>
					<FlexRow alignItems='center'>
						<SpacedIcon type={iconTypes.wind} fill={iconColor} height={iconHeight} />
						<TextUnit text={roundedWind} unit={windDirectionUnit} />
					</FlexRow>
				</Text>
				<PushedDownText>
					<FlexRow alignItems='center'>
						<SpacedIcon type={iconTypes.rain} fill={iconColor} height={iconHeight} />
						<TextUnit text={chanceRainPercentString} unit='chance' space={3} />
					</FlexRow>
				</PushedDownText>
			</Flex>
		</FlexRow>
	);
};

const PaddedFlexRow = styled(FlexRow)`
	padding-right: .8rem;
`;

const PushedDownText = styled(Text)`
	margin-top: ${edgePaddingValue};
`;

const SpacedIcon = styled(Icon)`
	margin-right: .3rem;
`;


const SummaryWeatherSecondary: React.FC = () => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	return (
		<Text>Hello</Text>
	);
};