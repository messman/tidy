import * as React from 'react';
import { WeatherStatusType, weatherStatusTypeDescription, WindDirection } from 'tidy-shared';
import { ContextBlock } from '@/core/layout/context-block';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { iconTypes } from '@/core/symbol/icon';
import { Text, TextInline, titleHeight } from '@/core/symbol/text';
import { TextUnit } from '@/core/symbol/text-unit';
import { SpacedIcon } from '@/core/weather/weather-common';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { processWeatherForDisplay } from '@/services/weather/weather-process';
import { Flex, FlexRow } from '@messman/react-common';

export interface SummaryWeatherProps {
	isDualMode: boolean;
}

export const SummaryWeather: React.FC<SummaryWeatherProps> = (props) => {
	return (
		<ContextBlock
			primary={<SummaryWeatherPrimary />}
			secondary={<SummaryWeatherSecondary />}
			isDualMode={props.isDualMode}
		/>
	);
};

const SummaryWeatherPrimary: React.FC = () => {

	const allResponseState = useAllResponse();
	const theme = useCurrentTheme();

	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all } = allResponseState.data!;
	const iconColor = theme.color.weather;
	const iconHeight = titleHeight;

	const useDayIcon = !all.current.sun.next.isSunrise;
	const { tempText, windText, windDirectionUnit, icon, pressureText } = processWeatherForDisplay(all.current.weather, useDayIcon);

	// NOTE - have to use flex='0' here, even though we don't rely on it anywhere else. 
	return (
		<FlexRow justifyContent='space-around'>
			<Flex flex='0'>
				<TextInline>
					<PaddedFlexRow alignItems='center'>
						<SpacedIcon type={iconTypes.temperature} fill={iconColor} height={iconHeight} />
						{tempText}&deg;
					</PaddedFlexRow>
				</TextInline>
				<PushedDownTextInline>
					<PaddedFlexRow alignItems='center'>
						<SpacedIcon type={icon} fill={iconColor} height={iconHeight} />
						{'Few Clouds'}
					</PaddedFlexRow>
				</PushedDownTextInline>
			</Flex>
			<Flex flex='0'>
				<TextInline>
					<FlexRow alignItems='center'>
						<SpacedIcon type={iconTypes.wind} fill={iconColor} height={iconHeight} />
						<TextUnit text={windText} unit={`mph ${windDirectionUnit}`} />
					</FlexRow>
				</TextInline>
				<PushedDownTextInline>
					<FlexRow alignItems='center'>
						<SpacedIcon type={iconTypes.pressure} fill={iconColor} height={iconHeight} />
						<TextUnit text={pressureText} unit='mb' space={3} />
					</FlexRow>
				</PushedDownTextInline>
			</Flex>
		</FlexRow>
	);
};

const PaddedFlexRow = styled(FlexRow)`
	padding-right: .8rem;
	/* Prevent multi-word short statuses from wrapping. */
	white-space: nowrap;
`;

const PushedDownTextInline = styled(TextInline)`
	margin-top: ${edgePaddingValue};
`;

const SummaryWeatherSecondary: React.FC = () => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	const { all } = allResponseState.data!;

	const { temp, tempFeelsLike, windDirection, cloudCover, status, visibility } = all.current.weather;

	// status long description, cloud cover, Feels like, wind direction, visibility

	// Get the key, like 'unknown'.
	const weatherStatusKey = WeatherStatusType[status] as keyof typeof WeatherStatusType;
	// Use that key to get the icons (day and night).
	const weatherStatusDescription = weatherStatusTypeDescription[weatherStatusKey].long;

	const cloudCoverText = Math.round(cloudCover.entity! * 100);

	const tempRounded = Math.round(temp.entity!);
	let tempFeelsLikeComponent: JSX.Element | null = null;
	if (tempFeelsLike.entity) {
		const tempFeelsLikeRounded = Math.round(tempFeelsLike.entity);
		if (tempRounded !== tempFeelsLikeRounded) {
			tempFeelsLikeComponent = <TextInline>Feels like {tempFeelsLikeRounded}&deg;.&nbsp;</TextInline>;
		}
	}

	const windOriginationText = WindDirection[windDirection];

	let visibilityText: JSX.Element | null = null;
	const visibilityEntity = visibility.entity;
	if (visibilityEntity) {
		visibilityText = <> Visibility is {visibilityEntity.toFixed(1)} miles.</>;
	}

	return (
		<Text>
			{weatherStatusDescription}.
			Cloud cover at {cloudCoverText}%. {tempFeelsLikeComponent}Wind from the {windOriginationText}.
			{visibilityText}
		</Text>
	);
};