import { DateTime } from 'luxon';
import * as React from 'react';
import { TideEvent } from 'tidy-shared';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { SmallText, subtitleHeight, TextInline, TextPara } from '@/core/symbol/text';
import { TimeDurationTextUnit, TimeTextUnit } from '@/core/symbol/text-unit';
import { useTideChart } from '@/core/tide/tide-chart';
import { TideHeightTextUnit } from '@/core/tide/tide-common';
import { SpacedIcon } from '@/core/weather/weather-common';
import { CONSTANT } from '@/services/constant';
import { timeToPixelsWithConstant } from '@/services/time';
import { Flex, FlexRow, minutes } from '@messman/react-common';
import { getMinMaxEvents } from '../../core/tide/tide-chart';
import { ForecastContextBlockProps } from './forecast';

interface ForecastEntryPrimaryProps extends ForecastContextBlockProps { }

// On these forecast entries, we have to set some height for our tide chart. 
// This will allow us to have consistent heights across all entries.
const pixelsPerFootHeight = 1.75;
const heightPaddingBottomFactor = .25;

// If a tide event is this many minutes before sunrise or after sunset, still report it.
const daylightTideLeniency = minutes(30);

/** Primary entry for a day's forecast. Shows the temperature info, daylight time, a center tide chart, and tide highs/lows. */
export const ForecastEntryPrimary: React.FC<ForecastEntryPrimaryProps> = (props) => {
	const { day, dailyWeatherDisplay, containerWidth, absoluteTideHeightRange, showFullDay } = props;

	let tides = day.tides;
	let timeRangeStart = day.date.startOf('day');
	let timeRangeEnd = day.date.endOf('day');
	if (!showFullDay) {
		// Daylight only
		const [sunrise, sunset] = day.sun;
		timeRangeStart = sunrise.time;
		timeRangeEnd = sunset.time;

		const daylightTideEvents = tides.events.filter((event) => {
			return event.time >= timeRangeStart && event.time <= timeRangeEnd;
		});
		const [min, max] = getMinMaxEvents(daylightTideEvents);

		tides = {
			events: daylightTideEvents,
			highest: max,
			lowest: min,
			outsideNext: [],
			outsidePrevious: []
		};
	}

	const startOfDay = day.date.startOf('day');

	const outputHeight = (absoluteTideHeightRange * pixelsPerFootHeight) / heightPaddingBottomFactor;
	const paddingBottomHeight = outputHeight * heightPaddingBottomFactor;

	const tideChart = useTideChart({
		tideEventRange: day.tides,
		includeOutsideRange: false,
		startTime: timeRangeStart,
		endTime: timeRangeEnd,
		// Use the width passed in from the parent. NOTE - this only works because the margins are the same. TODO - make this logic more straightforward, possible by using useElementSize differently.
		outputWidth: containerWidth,
		outputHeight: outputHeight,
		outputPaddingTop: 1,
		outputPaddingBottom: paddingBottomHeight
	});

	const { minTempText, maxTempText, icon, shortStatusText } = dailyWeatherDisplay;

	let sunBarRender: JSX.Element | null = null;
	if (showFullDay) {
		const [sunrise, sunset] = day.sun;
		const pixelsPerHour = props.containerWidth / 24;
		const left = timeToPixelsWithConstant(startOfDay, sunrise.time, pixelsPerHour);
		const width = timeToPixelsWithConstant(sunrise.time, sunset.time, pixelsPerHour);
		sunBarRender = (
			<>
				<Separator />

				<EmptySunBarLine>
					<SunBarLine leftOffset={left} width={width} />
				</EmptySunBarLine>
			</>
		);
	}
	else {
		sunBarRender = (
			<VerticalMargin>
				<Separator />
			</VerticalMargin>
		);
	}

	let tideExtremaToReport = tides.events;
	if (!showFullDay) {
		// Add leniency now that we have already rendered our chart
		timeRangeStart = timeRangeStart.minus({ milliseconds: daylightTideLeniency });
		timeRangeEnd = timeRangeEnd.plus({ milliseconds: daylightTideLeniency });
		tideExtremaToReport = day.tides.events.filter((event) => {
			return event.time >= timeRangeStart && event.time <= timeRangeEnd;
		});
	}

	const [extremaRender, justifyContent] = createPositionedExtremaInfo(tideExtremaToReport, timeRangeStart, timeRangeEnd);

	return (
		<div>
			<Margin>
				<FlexRow>
					<FlexRowMargin alignItems='center'>
						<TextInline>
							{maxTempText}&deg;/{minTempText}&deg;
						</TextInline>
					</FlexRowMargin>
					<FlexRowMargin alignItems='center' flex='none'>

						<SpacedIcon type={icon} height={subtitleHeight} spacing='default' />
						<TextInline>
							{shortStatusText}
						</TextInline>
					</FlexRowMargin>
				</FlexRow>
			</Margin>
			<Separator />
			<Margin>
				<FlexRowMargin justifyContent={justifyContent}>
					{extremaRender}
				</FlexRowMargin>
			</Margin>
			{sunBarRender}
			<TideChartContainer flex='none' height={outputHeight}>
				{tideChart}
			</TideChartContainer>
		</div>
	);
};

const FlexRowMargin = styled(FlexRow)`
	display: flex;
	margin: 0 ${edgePaddingValue};
`;

const Margin = styled.div`
	margin: ${edgePaddingValue};
`;
const VerticalMargin = styled.div`
	margin: ${edgePaddingValue} 0;
`;

const Center = styled.div`
	text-align: center;
`;

interface TideChartContainerProps {
	height: number;
}

const TideChartContainer = styled(Flex) <TideChartContainerProps>`
	height: ${p => p.height}px;
`;

const Separator = styled.div`
	height: 2px;
	background-color: ${p => p.theme.color.backgroundLightest};
`;

const barLineThickness = 4;

const EmptySunBarLine = styled.div`
	margin-bottom: ${edgePaddingValue};
	position: relative;
	width: 100%;
	height: ${barLineThickness}px;
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


function createPositionedExtremaInfo(events: TideEvent<DateTime>[], startTime: DateTime, endTime: DateTime): [JSX.Element[], 'space-around' | 'space-between'] {
	let tideExtrema = events.map((event) => {
		const key = `extreme_${event.time.valueOf()}`;
		return <TideExtreme key={key} event={event} isShown={true} />;
	});

	// Time between beginning and end
	const timeRange = endTime.diff(startTime, 'milliseconds').milliseconds;
	// Number of events we could possibly squeeze into this time range.
	const maximumTideEventsCount = Math.floor(timeRange / CONSTANT.tidalHalfPeriod) + 1;

	if (events.length === maximumTideEventsCount) {
		return [tideExtrema, 'space-between'];
	}
	return [tideExtrema, 'space-around'];
}

interface TideExtremeProps {
	event: TideEvent<DateTime>;
	isShown: boolean;
}

const TideExtreme: React.FC<TideExtremeProps> = (props) => {
	const { event, isShown } = props;

	return (
		<Opacity isShown={isShown}>
			<Center>
				<SmallText>{event.isLow ? 'LOW' : 'HIGH'}</SmallText>
				<div>
					<TimeTextUnit dateTime={event.time} />
				</div>
				<div>
					<TideHeightTextUnit height={event.height} />
				</div>
			</Center>
		</Opacity>
	);
};

interface OpacityProps {
	isShown: boolean;
}

const Opacity = styled.div<OpacityProps>`
	opacity: ${p => p.isShown ? 1 : 0};
`;

interface ForecastEntrySecondaryProps extends ForecastContextBlockProps { }

export const ForecastEntrySecondary: React.FC<ForecastEntrySecondaryProps> = (props) => {

	const { day, dailyWeatherDisplay } = props;

	const [sunriseEvent, sunsetEvent] = day.sun;

	const lowestTide = day.tides.lowest;
	const highestTide = day.tides.highest;

	const lowestRender = <>lowest tide of the day at <TimeTextUnit dateTime={lowestTide.time} /> (<TideHeightTextUnit height={lowestTide.height} />)</>;
	const highestRender = <>highest tide of the day at <TimeTextUnit dateTime={highestTide.time} /> (<TideHeightTextUnit height={highestTide.height} />)</>;

	const lowestIsBeforeHighest = lowestTide.time < highestTide.time;
	const firstRender = lowestIsBeforeHighest ? lowestRender : highestRender;
	const secondRender = lowestIsBeforeHighest ? highestRender : lowestRender;

	return (
		<Margin>
			<TextPara>
				Sunrise at <TimeTextUnit dateTime={sunriseEvent.time} /> and sunset at <TimeTextUnit dateTime={sunsetEvent.time} /> for a total of <TimeDurationTextUnit startTime={sunriseEvent.time} endTime={sunsetEvent.time} /> of daylight.
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