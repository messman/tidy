import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { borderRadiusSmallerValue } from '@/index/core/primitive/primitive-design';
import { themeTokens } from '@/index/core/theme/theme-root';
import { asPercentString, percentFromStartOfDay } from '@/index/core/time/time';
import { BeachTimeDay } from '@wbtdevlocal/iso';
import { ChartHourlyFill, ChartHourlyFillProps } from './chart-hourly-fill';
import { ChartHourlySolar } from './chart-hourly-solar';
import { ChartHourlySVG } from './chart-hourly-svg';
import { ChartHourlyTicks } from './chart-hourly-ticks';

const CurrentTimeContainer = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	width: 0;
	display: flex;
	justify-content: center;
`;

const CurrentTimeIndicator = styled.div`
	width: 2px;
	border-radius: 1px;
	background-color: ${themeTokens.rawColor.orange.distinct};
	flex-shrink: 0;
`;

const SVGContainer = styled.div`
	position: relative;
	height: 2rem;
	width: 100%;
	overflow: hidden;
	border-radius: ${borderRadiusSmallerValue};

	background-color: ${themeTokens.background.tint.medium};
`;

/** Padding on top and bottom of the chart */
const verticalPaddingFactor = .15;

export interface ChartHourlyProps {
	day: BeachTimeDay;
};

export const ChartHourly: React.FC<ChartHourlyProps> = (props) => {
	const { day } = props;
	const { meta, getTideExtremeById, week } = useBatchResponseSuccess();
	const { referenceTime } = meta;

	const rangesWithSplitDay: ChartHourlyFillProps[] = [];
	day.ranges.forEach((range) => {
		const isBetween = referenceTime > range.start && referenceTime < range.stop;
		if (isBetween) {
			rangesWithSplitDay.push(
				{
					referenceTime,
					start: range.start,
					stop: referenceTime,
					weather: range.weather,
					isCroppedRight: true,
				},
				{
					referenceTime,
					start: referenceTime,
					stop: range.stop,
					weather: range.weather,
					isCroppedLeft: true
				}
			);
		}
		else {
			rangesWithSplitDay.push({
				referenceTime,
				start: range.start,
				stop: range.stop,
				weather: range.weather
			});
		}
	});

	const rangeFills = rangesWithSplitDay.map((props) => {
		return (
			<ChartHourlyFill
				key={props.start.valueOf()}
				{...props}
			/>
		);
	});

	const extrema = React.useMemo(() => {
		return [
			getTideExtremeById(day.tides.previousId),
			...day.tides.extremaIds.map((id) => {
				return getTideExtremeById(id);
			}),
			getTideExtremeById(day.tides.nextId),
		];
	}, [day, getTideExtremeById]);

	const { min, max } = week.tideRange;

	let currentTimeRender: React.ReactNode = null;
	const isToday = referenceTime >= day.day.startOf('day') && referenceTime <= day.day.endOf('day');
	if (isToday) {
		const startOfDay = day.day.startOf('day');
		const leftPercent = Math.max(0, Math.min(100, percentFromStartOfDay(referenceTime, startOfDay)));
		currentTimeRender = (
			<CurrentTimeContainer
				style={{
					left: asPercentString(leftPercent)
				}}
			>
				<CurrentTimeIndicator />
			</CurrentTimeContainer>
		);
	}

	return (
		<div>
			<ChartHourlySolar day={day} />
			<SVGContainer>
				{rangeFills}
				<ChartHourlySVG
					day={day.day}
					extrema={extrema}
					allExtremaMin={min}
					allExtremaMax={max}
					verticalPaddingFactor={verticalPaddingFactor}
				/>
				{currentTimeRender}
			</SVGContainer>
			<ChartHourlyTicks />
		</div>
	);
};