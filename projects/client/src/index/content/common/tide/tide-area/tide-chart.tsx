import { DateTime } from 'luxon';
import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponse } from '@/index/core/data/data';
import { Block } from '@/index/core/layout/layout-shared';
import { FontWeight, Spacing } from '@/index/core/primitive/primitive-design';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { getDateDayOfWeek, getRelativeDayText, getTimeTwelveHourString } from '@/index/core/time/time';
import { TideContentDay, TidePoint, TidePointExtreme } from '@wbtdevlocal/iso';
import { MoonPhaseIcon } from '../../astro/moon-phase-icon';
import { TideHeightTextUnit } from '../tide-common';
import { TideExtremeIcon, TideLevelIcon } from '../tide-level-icon';

export const TideChart: React.FC = () => {
	const { tide, meta } = useBatchResponse().success!;
	const { referenceTime } = meta;
	const { measured, dailyMin, dailyMax, daily } = tide;

	// Handle the case where the measured tide is above even the highest or lowest tide value.
	const absoluteMax = Math.max(measured.height, dailyMax.height);
	const absoluteMin = Math.min(measured.height, dailyMin.height);

	const daysRender = daily.map((day) => {
		return (
			<TideChartDay
				key={day.extremes[0].time.toMillis()}
				day={day}
				maxHeight={absoluteMax}
				minHeight={absoluteMin}
				referenceTime={referenceTime}
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
	measured: TidePoint;
	referenceTime: DateTime;
	day: TideContentDay;
}

const TideChartDay: React.FC<TideChartDayProps> = (props) => {
	const { minHeight, maxHeight, day, referenceTime, measured } = props;
	const range = maxHeight - minHeight;

	/*
		Note - the measured time may be significantly behind the reference time.
		This has implications for our charts - we want to show the "current" tide level,
		but if we put it at the measured time it may come before an extreme.
		For the purposes of these charts, let's always just say the measured water level is 
		from the reference time.
	*/
	const date = day.extremes[0].time;
	const relativeDayText = getRelativeDayText(date, referenceTime);
	const dateText = getDateDayOfWeek(date);
	const titleText = (relativeDayText ? (relativeDayText + ', ') : '') + dateText;

	let all: (TidePointExtreme | TidePoint)[] = [...day.extremes];
	if (referenceTime.hasSame(date, 'day')) {
		// Inefficient but there's only a few for one day.
		const index = all.findIndex((extreme) => {
			return extreme.time > referenceTime;
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
			const extremeStamp = stamp as TidePointExtreme;
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
	${fontStyles.lead.medium};
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
	padding: ${Spacing.bat08} ${Spacing.dog16};
`;

const RowTime = styled.div`
	flex: 2;
	min-width: 5.5rem;
	${fontStyles.text.medium};
	font-weight: ${FontWeight.medium};
	text-align: center;
`;

const RowIcon = styled.div`
	flex: 1;
	padding: 0 ${Spacing.ant04};
	display: flex;
	justify-content: center;
	${fontStyles.text.medium};
	font-weight: ${FontWeight.medium};
`;

const RowHeight = styled.div`
	flex: 2;
	min-width: 4.5rem;
	${fontStyles.text.medium};
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
	background: ${themeTokens.background.tint.medium};
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
	background-color: ${p => p.isMeasured ? themeTokens.rawColor.green.distinct : themeTokens.background.tint.medium};
	width: calc(${p => p.percent}% + ${halfVisualSize});
	height: ${visualSize};
	top: 0;
	left: 0;
`;

const VisualCircle = styled.div<{ percent: number; isMeasured: boolean; }>`
	position: absolute;
	background-color: ${p => p.isMeasured ? themeTokens.rawColor.green.subtle : themeTokens.background.tint.medium};
	width: ${visualSize};
	height: ${visualSize};
	border-radius: ${visualBorder};
	top: 0;
	left: ${p => p.percent}%;
`;
//#endregion