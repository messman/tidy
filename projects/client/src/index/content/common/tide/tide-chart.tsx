import { DateTime } from 'luxon';
import * as React from 'react';
import styled from 'styled-components';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { getTimeTwelveHourString } from '@/index/core/time/time';
import { TideLevelDirection, TideLevelDivision, TidePointCurrent, TidePointExtreme } from '@wbtdevlocal/iso';
import { TideChartIndicator } from './tide-chart-indicator';
import { TideHeightTextUnit } from './tide-common';
import { TideLevelIcon } from './tide-level-icon';

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, max-content) 1fr;
	align-items: center;
	column-gap: .75rem;
`;

const GridRowCurrent = styled.div`
	background-color: ${themeTokens.background.tint.lightest};
	grid-column: 1 / span 4;
	place-self: stretch stretch;
`;

const GridItem = styled.div`
	padding: .25rem;
	z-index: 1;
`;
const GridItemLeft = styled(GridItem)`
	padding-left: .75rem;
`;
const GridItemRight = styled(GridItem)`
	padding-right: .75rem;
`;

const TextNormal = styled.div`
	${fontStyles.text.smallHeavy};
	text-align: right;
`;
const TextPast = styled(TextNormal)`
	color: ${themeTokens.text.subtle};
`;

interface TideRowEntry {
	time: DateTime;
	division: TideLevelDivision;
	direction: TideLevelDirection;
	height: number;
	isCurrent: boolean;
}

export interface TideChartProps {
	extrema: TidePointExtreme[];
	current?: TidePointCurrent;
	currentTime?: DateTime;
	min?: number;
	max?: number;
};

export const TideChart: React.FC<TideChartProps> = (props) => {
	const { extrema, current, currentTime, min = Infinity, max = -Infinity } = props;

	/*
		Note - the measured time may be significantly behind the reference time.
		This has implications for our charts - we want to show the "current" tide level,
		but if we put it at the measured time it may come before an extreme.
		For the purposes of these charts, let's always just say the measured water level is 
		from the reference time.
	*/
	const rowEntries = extrema.map<TideRowEntry>((extreme) => {
		return {
			time: extreme.time,
			direction: TideLevelDirection.turning,
			division: extreme.isLow ? TideLevelDivision.low : TideLevelDivision.high,
			height: extreme.height,
			isCurrent: false
		};
	});
	let currentIndex = -1;
	if (current && currentTime) {
		const currentRowEntry: TideRowEntry = {
			time: currentTime,
			direction: current.direction,
			division: current.division,
			height: current.height,
			isCurrent: true
		};
		const index = rowEntries.findIndex((extreme) => {
			return extreme.time > currentTime;
		});
		if (index === -1) {
			rowEntries.push(currentRowEntry);
			currentIndex = rowEntries.length - 1;
		}
		else {
			rowEntries.splice(index, 0, currentRowEntry);
			currentIndex = index;
		}
	}

	let safeMin = min;
	let safeMax = max;
	// Ensure max and min are accurate.
	rowEntries.forEach((entry) => {
		safeMin = Math.min(safeMin, entry.height);
		safeMax = Math.max(safeMax, entry.height);
	});

	const rowRenders = rowEntries.map((entry, i) => {

		const visualPercent = (entry.height - safeMin) / (safeMax - safeMin);
		const TextComponent = (current && !entry.isCurrent && currentIndex > i) ? TextPast : TextNormal;

		return (
			<React.Fragment key={`${entry.time.toMillis()}-${entry.isCurrent.toString()}`}>
				<GridItemLeft style={{ gridRow: i + 1, gridColumn: 1 }}>
					<TextComponent>{entry.isCurrent ? "Now" : getTimeTwelveHourString(entry.time)}</TextComponent>
				</GridItemLeft>
				<GridItem style={{ gridRow: i + 1, gridColumn: 2 }}>
					<TideLevelIcon tide={{ direction: entry.direction, division: entry.division }} />
				</GridItem>
				<GridItem style={{ gridRow: i + 1, gridColumn: 3 }}>
					<TextComponent><TideHeightTextUnit height={entry.height} precision={1} /></TextComponent>
				</GridItem>
				<GridItemRight style={{ gridRow: i + 1, gridColumn: 4 }}>
					<TideChartIndicator percent={visualPercent} isCurrent={entry.isCurrent} />
				</GridItemRight>
			</React.Fragment>
		);
	});

	return (
		<Grid>
			{currentIndex !== -1 && <GridRowCurrent style={{ gridRow: `${currentIndex + 1} / span 1` }} />}
			{rowRenders}
		</Grid>
	);
};