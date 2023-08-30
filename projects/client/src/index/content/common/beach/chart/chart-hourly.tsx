import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { borderRadiusSmallerValue } from '@/index/core/primitive/primitive-design';
import { themeTokens } from '@/index/core/theme/theme-root';
import { BeachTimeDay } from '@wbtdevlocal/iso';
import { ChartHourlyFill } from './chart-hourly-fill';
import { ChartHourlySolar } from './chart-hourly-solar';
import { ChartHourlySVG } from './chart-hourly-svg';
import { ChartHourlyTicks } from './chart-hourly-ticks';

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
	const { tideExtrema, getTideExtremeById } = useBatchResponseSuccess();

	const rangeFills = day.ranges.map((range) => {
		return <ChartHourlyFill key={range.start.valueOf()} range={range} />;
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

	const min = getTideExtremeById(tideExtrema.minId).height;
	const max = getTideExtremeById(tideExtrema.maxId).height;

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
			</SVGContainer>
			<ChartHourlyTicks />
		</div>
	);
};