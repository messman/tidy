import * as React from 'react';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { SmallText, subtitleHeight, TextInline, TextPara } from '@/core/symbol/text';
import { TimeDurationTextUnit, TimeTextUnit } from '@/core/symbol/text-unit';
import { useTideChart } from '@/core/tide/tide-chart';
import { TideHeightTextUnit } from '@/core/tide/tide-common';
import { SpacedIcon } from '@/core/weather/weather-common';
import { timeToPixelsWithConstant } from '@/services/time';
import { Flex, FlexColumn, FlexRow } from '@messman/react-common';
import { ForecastContextBlockProps } from './forecast';

interface ForecastEntryPrimaryProps extends ForecastContextBlockProps { }

// On these forecast entries, we have to set some height for our tide chart. 
// This will allow us to have consistent heights across all entries.
const pixelsPerFootHeight = 1.75;
const heightPaddingBottomFactor = .25;

/** Primary entry for a day's forecast. Shows the temperature info, daylight time, a center tide chart, and tide highs/lows. */
export const ForecastEntryPrimary: React.FC<ForecastEntryPrimaryProps> = (props) => {
	const theme = useCurrentTheme();
	const { day, dailyWeatherDisplay, containerWidth, absoluteTideHeightRange } = props;
	const startOfDay = day.date.startOf('day');

	const outputHeight = (absoluteTideHeightRange * pixelsPerFootHeight) / heightPaddingBottomFactor;
	const paddingBottomHeight = outputHeight * heightPaddingBottomFactor;

	const tideChart = useTideChart({
		tideEventRange: day.tides,
		includeOutsideRange: false,
		// Use the start and end of this day.
		startTime: startOfDay,
		endTime: day.date.endOf('day'),
		// Use the width passed in from the parent. NOTE - this only works because the margins are the same. TODO - make this logic more straightforward, possible by using useElementSize differently.
		outputWidth: containerWidth,
		outputHeight: outputHeight,
		outputPaddingTop: 1,
		outputPaddingBottom: paddingBottomHeight
	});

	const { minTempText, maxTempText, icon, shortStatusText } = dailyWeatherDisplay;

	const [sunrise, sunset] = day.sun;
	const pixelsPerHour = props.containerWidth / 24;
	const left = timeToPixelsWithConstant(startOfDay, sunrise.time, pixelsPerHour);
	const width = timeToPixelsWithConstant(sunrise.time, sunset.time, pixelsPerHour);


	const tideExtrema = day.tides.events.map((tideStatus) => {
		const key = `extreme_${tideStatus.time.valueOf()}`;
		return (
			<InlineCenter key={key}>
				<SmallText>{tideStatus.isLow ? 'LOW' : 'HIGH'}</SmallText>
				<div>
					<TimeTextUnit dateTime={tideStatus.time} />
				</div>
				<TideHeightTextUnit height={tideStatus.height} />
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

						<SpacedIcon type={icon} fill={theme.color.weather} height={subtitleHeight} spacing='default' />
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
	margin: 0 ${edgePaddingValue};
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

export const ForecastEntrySecondary: React.FC<ForecastEntrySecondaryProps> = (props) => {

	const { day, dailyWeatherDisplay } = props;

	const [sunriseEvent, sunsetEvent] = day.sun;

	const lowestTide = day.tides.lowest;
	const highestTide = day.tides.highest;

	const lowestRender = <>lowest of <TideHeightTextUnit height={lowestTide.height} /> at <TimeTextUnit dateTime={lowestTide.time} /></>;
	const highestRender = <>highest of <TideHeightTextUnit height={highestTide.height} /> at <TimeTextUnit dateTime={highestTide.time} /></>;

	const lowestIsBeforeHighest = lowestTide.time < highestTide.time;
	const firstRender = lowestIsBeforeHighest ? lowestRender : highestRender;
	const secondRender = lowestIsBeforeHighest ? highestRender : lowestRender;

	return (
		<Margin>
			<TextPara>
				Sunrise at <TimeTextUnit dateTime={sunriseEvent.time} /> and sunset at <TimeTextUnit dateTime={sunsetEvent.time} /> for a total of <TimeDurationTextUnit startTime={sunriseEvent.time} endTime={sunsetEvent.time} /> of sun.
			</TextPara>
			<TextPara>
				Predicted {firstRender} and {secondRender}.
			</TextPara>
			<TextPara>
				{dailyWeatherDisplay.longStatusText}.
			</TextPara>
		</Margin>
	);
};