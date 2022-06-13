import * as React from 'react';
import { MoonPhaseIcon } from '@/core/astro/moon-phase-icon';
import { fontStyleDeclarations } from '@/core/text';
import { Block, Spacing } from '@/core/theme/box';
import { FontWeight } from '@/core/theme/font';
import { styled } from '@/core/theme/styled';
import { TideHeightTextUnit } from '@/core/tide/tide-common';
import { TideExtremeIcon, TideLevelIcon } from '@/core/tide/tide-level-icon';
import { useBatchResponse } from '@/services/data/data';
import { getDateDayOfWeek, getRelativeDayText, getTimeTwelveHourString } from '@/services/time';
import * as iso from '@wbtdevlocal/iso';

export const TideChart: React.FC = () => {
	const { tide } = useBatchResponse().success!;
	const { measured, dailyMin, dailyMax, daily } = tide;

	const daysRender = daily.map((day) => {
		return (
			<TideChartDay
				key={day.extremes[0].time.toMillis()}
				day={day}
				minHeight={dailyMin.height}
				maxHeight={dailyMax.height}
				measured={measured}
			/>
		);
	});

	return (
		<>
			{daysRender}
		</>
	);
};

interface TideChartDayProps {
	minHeight: number;
	maxHeight: number;
	measured: iso.Tide.Stamp;
	day: iso.Batch.TideContentDay;
}

const TideChartDay: React.FC<TideChartDayProps> = (props) => {
	const { minHeight, maxHeight, day, measured } = props;
	const range = maxHeight - minHeight;

	const date = day.extremes[0].time;
	const relativeDayText = getRelativeDayText(date, measured.time);
	const dateText = getDateDayOfWeek(date);
	const titleText = (relativeDayText ? (relativeDayText + ', ') : '') + dateText;

	let all: (iso.Tide.ExtremeStamp | iso.Tide.Stamp)[] = [...day.extremes];
	if (measured.time.hasSame(date, 'day')) {
		const index = all.findIndex((extreme) => {
			return extreme.time > measured.time;
		});
		if (index === -1) {
			all.push(measured);
		}
		else {
			all.splice(index, 0, measured);
		}
	}

	const rowRender = all.map((stamp) => {
		const isMeasured = stamp === measured;
		const key = `${stamp.time.toMillis()}-${isMeasured ? 'measured' : 'extreme'}`;

		const heightRender = <RowHeight><TideHeightTextUnit height={stamp.height} precision={1} /></RowHeight>;

		const visualPercent = ((stamp.height - minHeight) / range) * 100;
		const visualRender = (
			<RowVisual>
				<RowVisualAdjust>
					<VisualCircleTrail percent={visualPercent} isMeasured={isMeasured} />
					<VisualCircle percent={visualPercent} isMeasured={isMeasured} />
				</RowVisualAdjust>
			</RowVisual>
		);

		if (isMeasured) {
			return (
				<RowContainer key={key} isHighlighted={true}>
					<RowTime>Now</RowTime>
					<RowIcon>
						<TideLevelIcon tide={measured} />
					</RowIcon>
					{heightRender}
					{visualRender}
				</RowContainer>
			);
		}
		else {
			const extremeStamp = stamp as iso.Tide.ExtremeStamp;
			return (
				<RowContainer key={key} isHighlighted={false}>
					<RowTime>{getTimeTwelveHourString(stamp.time)}</RowTime>
					<RowIcon>
						<TideExtremeIcon isLow={extremeStamp.isLow} />
					</RowIcon>
					{heightRender}
					{visualRender}
				</RowContainer>
			);
		}
	});

	return (
		<DayContainer>
			<DayHeader>
				<DayTitle>{titleText}</DayTitle>
				<MoonPhaseIcon phase={day.moonPhase} />
			</DayHeader>
			<Block.Bat08 />
			{rowRender}
		</DayContainer>
	);
};

const DayContainer = styled.div`
	& + & {
		margin-top: ${Spacing.elf24};
	}
`;

const DayTitle = styled.div`
	${fontStyleDeclarations.lead};
`;

const DayHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 ${Spacing.dog16};
`;

const RowContainer = styled.div<{ isHighlighted: boolean; }>`
	display: flex;
	align-items: center;
	background-color: ${p => p.isHighlighted ? p.theme.rowHighlight : 'transparent'};
	padding: ${Spacing.bat08} ${Spacing.dog16};
`;

const RowTime = styled.div`
	flex: 2;
	min-width: 5.5rem;
	${fontStyleDeclarations.body};
	font-weight: ${FontWeight.medium};
	text-align: center;
`;

const RowIcon = styled.div`
	flex: 1;
	padding: 0 ${Spacing.ant04};
	display: flex;
	justify-content: center;
	${fontStyleDeclarations.body};
	font-weight: ${FontWeight.medium};
`;

const RowHeight = styled.div`
	flex: 2;
	min-width: 4.5rem;
	${fontStyleDeclarations.body};
	font-weight: ${FontWeight.medium};
	text-align: center;
`;

//#region Visual

const visualSize = '.5rem';
const halfVisualSize = '.25rem';
const visualBorder = '.25rem';

/**
 * The top-level background that the user sees.
*/
const RowVisual = styled.div`
	flex: 5;
	position: relative;
	height: ${visualSize};
	border-radius: ${visualBorder};
	background: ${p => p.theme.visual.background};
	overflow: hidden;
`;

/**
 * An invisible layer in-between that allows us to use absolute position percentages correctly for the circle.
*/
const RowVisualAdjust = styled.div`
	// subtract the width of the circle so that 100% still shows the full circle.
	width: calc(100% - ${visualSize});
	position: relative;
	height: ${visualSize};
`;

const VisualCircleTrail = styled.div<{ percent: number; isMeasured: boolean; }>`
	position: absolute;
	background-color: ${p => p.isMeasured ? p.theme.common.system.green.d_lightest : p.theme.visual.tideCoverage};
	width: calc(${p => p.percent}% + ${halfVisualSize});
	height: ${visualSize};
	top: 0;
	left: 0;
`;

const VisualCircle = styled.div<{ percent: number; isMeasured: boolean; }>`
	position: absolute;
	background-color: ${p => p.isMeasured ? p.theme.common.system.green.a_main : p.theme.common.brand1.main};
	width: ${visualSize};
	height: ${visualSize};
	border-radius: ${visualBorder};
	top: 0;
	left: ${p => p.percent}%;
`;
//#endregion