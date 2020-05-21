import * as React from 'react';
import { ContextBlock } from '@/core/layout/context-block';
import { Flex, FlexRow } from '@/core/layout/flex';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { iconTypes } from '@/core/symbol/icon';
import { subtitleHeight, Text } from '@/core/symbol/text';
import { TextUnit } from '@/core/symbol/text-unit';
import { SpacedIcon } from '@/core/weather/weather-common';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { processWeatherForDisplay } from '@/services/weather/weather-process';

export const SummaryWeather: React.FC = () => {
	return (
		<ContextBlock
			primary={<SummaryWeatherPrimary />}
			secondary={<SummaryWeatherSecondary />}
			isPadded={true}
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
	const iconHeight = subtitleHeight;

	const useDayIcon = !all.current.sun.next.isSunrise;
	const { tempText, windText, windDirectionUnit, icon, shortStatusText, chanceRainText } = processWeatherForDisplay(all.current.weather, useDayIcon);

	return (
		<FlexRow>
			<Flex>
				<Text>
					<PaddedFlexRow alignItems='center'>
						<SpacedIcon type={iconTypes.temperature} fill={iconColor} height={iconHeight} />
						{tempText}&deg;
					</PaddedFlexRow>
				</Text>
				<PushedDownText>
					<PaddedFlexRow alignItems='center'>
						<SpacedIcon type={icon} fill={iconColor} height={iconHeight} />
						{shortStatusText}
					</PaddedFlexRow>
				</PushedDownText>
			</Flex>
			<Flex>
				<Text>
					<FlexRow alignItems='center'>
						<SpacedIcon type={iconTypes.wind} fill={iconColor} height={iconHeight} />
						<TextUnit text={windText} unit={windDirectionUnit} />
					</FlexRow>
				</Text>
				<PushedDownText>
					<FlexRow alignItems='center'>
						<SpacedIcon type={iconTypes.rain} fill={iconColor} height={iconHeight} />
						<TextUnit text={chanceRainText} unit='chance' space={3} />
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

const SummaryWeatherSecondary: React.FC = () => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	return (
		<Text>Hello</Text>
	);
};