import * as React from 'react';
import { styled } from '@/core/style/styled';
import { Flex, FlexRow, FlexColumn } from '@/core/layout/flex';
import { Text, TextInline, subtitleHeight } from '@/core/symbol/text';
import { processDailyWeatherForDisplay } from '@/services/weather/weather-process';
import { Icon, iconTypes } from '@/core/symbol/icon';
import { useCurrentTheme } from '@/core/style/theme';
import { ForecastContextBlockProps } from './forecast';
import { edgePaddingValue } from '@/core/style/common';
import { useTideChart } from '@/core/tide/tide-chart';


interface ForecastEntryPrimaryProps extends ForecastContextBlockProps { }

const totalEntryHeight = 200;
const upperChartPadding = 50;
const lowerChartPadding = 60;


export const ForecastEntryPrimary: React.FC<ForecastEntryPrimaryProps> = (props) => {
	const theme = useCurrentTheme();
	const { day } = props;

	const tideChart = useTideChart({
		tideEventRange: day.tides,
		startTime: day.date.startOf('day'),
		endTime: day.date.endOf('day'),
		outputWidth: props.containerWidth,
		outputHeight: totalEntryHeight,
		outputPaddingTop: upperChartPadding,
		outputPaddingBottom: lowerChartPadding
	});

	const { minTempText, maxTempText, chanceRainText, icon } = processDailyWeatherForDisplay(day.weather);

	return (
		<CenterSpacing>
			{tideChart}
			<Margin>
				<FlexRow>
					<Flex>
						<Text>{maxTempText}&deg;/{minTempText}&deg;</Text>
					</Flex>
					<Flex>
						<Icon type={icon} fill={theme.color.weather} height={subtitleHeight} />
					</Flex>
					<Flex>
						<TextInline><Icon type={iconTypes.rain} fill={theme.color.weather} height={subtitleHeight} /> {chanceRainText}</TextInline>
					</Flex>
					<Flex>
						<Text>sunlight</Text>
					</Flex>
				</FlexRow>
			</Margin>
			<Flex />
			<Margin>
				<FlexRow>

					Lower
			</FlexRow>
			</Margin>
		</CenterSpacing>
	);
};

const Margin = styled.div`
	margin: ${edgePaddingValue};
`;

const CenterSpacing = styled(FlexColumn)`
	width: 100%;
	height: ${totalEntryHeight}px;
`;

interface ForecastEntrySecondaryProps extends ForecastContextBlockProps { }

export const ForecastEntrySecondary: React.FC<ForecastEntrySecondaryProps> = () => {

	return (
		<Margin>
			<Text>Hello!</Text>
		</Margin>
	);
};