import * as React from 'react';
import { Text, subtitleHeight } from '@/core/symbol/text';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { ContextBlock } from './context-block';
import { FlexRow, Flex } from '@/core/layout/flex';
import { TextUnit } from '@/core/symbol/text-unit';
import { useCurrentTheme } from '@/core/style/theme';
import { Icon, iconTypes } from '@/core/symbol/icon';
import styled from 'styled-components';
import { edgePaddingValue } from '@/core/style/common';
import { processWeatherForDisplay } from '@/services/weather/weather-process';

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