import * as React from 'react';
import { Flex, FlexColumn, FlexRow } from '@/core/layout/flex';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { SmallText, Text, textHeight, TextInline } from '@/core/symbol/text';
import { TimeTextUnit } from '@/core/symbol/text-unit';
import { useTideChart } from '@/core/tide/tide-chart';
import { SpacedIcon } from '@/core/weather/weather-common';
import { timeToPixelsWithConstant } from '@/services/time';
import { processDailyWeatherForDisplay } from '@/services/weather/weather-process';
import { ForecastContextBlockProps } from './forecast';

interface ForecastEntryPrimaryProps extends ForecastContextBlockProps { }

// On these forecast entries, we have to set some height for our tide chart. 
// This will allow us to have consistent heights across all entries.
const pixelsPerFootHeight = 2;
const heightPaddingBottomFactor = .2;

/** Primary entry for a day's forecast. Shows the temperature info, daylight time, a center tide chart, and tide highs/lows. */
export const ForecastEntryPrimary: React.FC<ForecastEntryPrimaryProps> = (props) => {
	const theme = useCurrentTheme();
	const { day, containerWidth, absoluteTideHeightRange } = props;
	const startOfDay = day.date.startOf('day');

	const outputHeight = (absoluteTideHeightRange * pixelsPerFootHeight) / heightPaddingBottomFactor;
	const paddingBottomHeight = outputHeight * heightPaddingBottomFactor;

	const tideChart = useTideChart({
		tideEventRange: day.tides,
		// Use the start and end of this day.
		startTime: startOfDay,
		endTime: day.date.endOf('day'),
		// Use the width passed in from the parent. NOTE - this only works because the margins are the same. TODO - make this logic more straightforward, possible by using useElementSize differently.
		outputWidth: containerWidth,
		outputHeight: outputHeight,
		outputPaddingTop: 1,
		outputPaddingBottom: paddingBottomHeight
	});

	const { minTempText, maxTempText, icon, shortStatusText } = processDailyWeatherForDisplay(day.weather);

	const [sunrise, sunset] = day.sun;
	const pixelsPerHour = props.containerWidth / 24;
	const left = timeToPixelsWithConstant(startOfDay, sunrise.time, pixelsPerHour);
	const width = timeToPixelsWithConstant(sunrise.time, sunset.time, pixelsPerHour);


	const tideExtrema = day.tides.events.map((tideStatus) => {
		const key = `extreme_${tideStatus.time.valueOf()}`;
		return (
			<InlineCenter key={key}>
				<SmallText>{tideStatus.isLow ? 'LOW' : 'HIGH'}</SmallText>
				<TimeTextUnit dateTime={tideStatus.time} />
			</InlineCenter>
		);
	});

	return (
		<FlexColumn>
			<Margin>

				<FlexRow>
					<FlexRowInline alignItems='center'>
						<TextInline>
							{maxTempText}&deg;/{minTempText}&deg;
						</TextInline>
					</FlexRowInline>
					<FlexRowInline alignItems='center' flex='none'>

						<SpacedIcon type={icon} fill={theme.color.weather} height={textHeight} spacing='close' />
						<TextInline>
							{shortStatusText}
						</TextInline>
					</FlexRowInline>
				</FlexRow>
			</Margin>
			<EmptySunBarLine>
				<SunBarLine leftOffset={left} width={width} />
			</EmptySunBarLine>
			<Margin>
				<FlexRow justifyContent='space-around'>
					{tideExtrema}
				</FlexRow>
			</Margin>
			<TideChartContainer flex='none' height={outputHeight}>
				{tideChart}
			</TideChartContainer>
		</FlexColumn>
	);
};

const FlexRowInline = styled(FlexRow)`
	display: inline-flex;
`;

const Margin = styled.div`
	margin: ${edgePaddingValue};
`;

const InlineCenter = styled.div`
	display: inline-block;
	text-align: center;
`;

interface TideChartContainerProps {
	height: number;
}

const TideChartContainer = styled(Flex) <TideChartContainerProps>`
	height: ${p => p.height}px;
`;

const barLineThickness = 4;

const EmptySunBarLine = styled.div`
	position: relative;
	width: 100%;
	height: ${barLineThickness}px;
	background-color: ${p => p.theme.color.backgroundLightest};
`;

interface SunBarLineProps {
	leftOffset: number,
	width: number;
}

const SunBarLine = styled.div<SunBarLineProps>`
	position: absolute;
	top: 0;
	left: ${p => p.leftOffset}px;
	width: ${p => p.width}px;
	height: 100%;
	background-color: ${p => p.theme.color.sun};
	border-radius: ${barLineThickness / 2}px;
`;

interface ForecastEntrySecondaryProps extends ForecastContextBlockProps { }

export const ForecastEntrySecondary: React.FC<ForecastEntrySecondaryProps> = () => {

	return (
		<Margin>
			<Text>In the future, this area will have a summary of the day's forecast information.</Text>
		</Margin>
	);
};