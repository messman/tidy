import * as React from 'react';
import { Flex, FlexColumn, FlexRow } from '@/core/layout/flex';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { Icon, iconTypes } from '@/core/symbol/icon';
import { subtitleHeight, Text, TextInline } from '@/core/symbol/text';
import { useTideChart } from '@/core/tide/tide-chart';
import { processDailyWeatherForDisplay } from '@/services/weather/weather-process';
import { ForecastContextBlockProps } from './forecast';

interface ForecastEntryPrimaryProps extends ForecastContextBlockProps { }

// Manually-defined height. We don't usually take this approach, but we're dealing with an absolute-positioned background that we want to keep viewable.
const totalEntryHeight = 200;
// Padding for the top, so that we have space for weather/sun components.
const upperChartPadding = 50;
// Padding for the bottom, to list tide data.
const lowerChartPadding = 60;

/** Primary entry for a day's forecast. Shows the temperature info, daylight time, a center tide chart, and tide highs/lows. */
export const ForecastEntryPrimary: React.FC<ForecastEntryPrimaryProps> = (props) => {
	const theme = useCurrentTheme();
	const { day } = props;

	const tideChart = useTideChart({
		tideEventRange: day.tides,
		// Use the start and end of this day.
		startTime: day.date.startOf('day'),
		endTime: day.date.endOf('day'),
		// Use the width passed in from the parent. NOTE - this only works because the margins are the same. TODO - make this logic more straightforward, possible by using useElementSize differently.
		outputWidth: props.containerWidth,
		outputHeight: totalEntryHeight,
		outputPaddingTop: upperChartPadding,
		outputPaddingBottom: lowerChartPadding
	});

	const { minTempText, maxTempText, chanceRainText, icon } = processDailyWeatherForDisplay(day.weather);

	/*
		Structure: basically create two layers.
		- Outer component is a FlexColumn so that content can be flexed.
			- Inner absolutely-positioned tide chart is in the background.
			- Inner margin content uses the FlexColumn to handle display of data.
	*/
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