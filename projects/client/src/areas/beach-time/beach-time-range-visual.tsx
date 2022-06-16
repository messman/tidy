import { DateTime } from 'luxon';
import * as React from 'react';
import { borderRadiusStyle, borderRadiusValue, Spacing } from '@/core/theme/box';
import { css, styled } from '@/core/theme/styled';
import * as iso from '@wbtdevlocal/iso';

export interface BeachTimeRangeVisualProps {
	referenceTime: DateTime;
	day: iso.Batch.BeachTimeDay;
}

const showOtherLines = false;

export const BeachTimeRangeVisual: React.FC<BeachTimeRangeVisualProps> = (props) => {
	const { referenceTime, day } = props;
	const { ranges, day: dateTime, tideMarks, astro } = day;
	const isToday = dateTime.hasSame(referenceTime, 'day');

	const tideBlocks: Block[] = [];
	let currentTideBlock: Block | null = null!;
	tideMarks.forEach((tideMark) => {
		if (isToday && tideMark.time < referenceTime) {
			return;
		}

		if (tideMark.isRising) {
			if (currentTideBlock) {
				currentTideBlock.stop = tideMark.time;
				currentTideBlock = null;
			}
			else {
				// First one
				const start = isToday ? referenceTime : tideMark.time.startOf('day');
				tideBlocks.push({
					start,
					stop: tideMark.time
				});
			}
		}
		else {
			currentTideBlock = {
				start: tideMark.time,
				stop: null!
			};
			tideBlocks.push(currentTideBlock);
		}
	});
	// Handle case where we didn't get the last one because the day ended
	const lastTideBlock = currentTideBlock as (Block | null);
	if (lastTideBlock) {
		lastTideBlock.stop = lastTideBlock.start.endOf('day');
	}

	const tidesVisualRender = tideBlocks.map((block) => {
		const blockStartPercent = percentFromStartOfDay(block.start, dateTime);
		const blockStopPercent = percentFromStartOfDay(block.stop, dateTime);
		const widthPercent = blockStopPercent - blockStartPercent;

		if (!showOtherLines) {
			return null;
		}

		return (
			<VisualTide
				key={block.start.toMillis()}
				$left={asPercentString(blockStartPercent)}
				$width={asPercentString(widthPercent)}
				isLeftCap={false}
				isRightCap={false}
			/>
		);
	});

	let sunRender: JSX.Element | null = null;
	if (showOtherLines && (!isToday || referenceTime < astro.sun.set)) {
		const sunStartPercent = percentFromStartOfDay(isToday ? referenceTime : astro.sun.rise, dateTime);
		const sunStopPercent = percentFromStartOfDay(astro.sun.set, dateTime);
		const sunWidthPercent = sunStopPercent - sunStartPercent;
		sunRender = (
			<VisualSun
				$left={asPercentString(sunStartPercent)}
				$width={asPercentString(sunWidthPercent)}
				isLeftCap={false}
				isRightCap={false}
			/>
		);
	}

	const rangesVisualRender = ranges.map((range) => {
		const weatherBlockRenders = range.weather.map((block, i) => {
			const isStart = i === 0;
			const isStop = i === range.weather.length - 1;
			const blockStartPercent = percentFromStartOfDay(block.start, dateTime);
			const blockStopPercent = percentFromStartOfDay(block.stop, dateTime);
			const widthPercent = blockStopPercent - blockStartPercent;

			const Component = block.indicator === iso.Weather.Indicator.best ? VisualBest : VisualOkay;
			return (
				<Component
					key={block.start.toMillis()}
					$left={asPercentString(blockStartPercent)}
					$width={asPercentString(widthPercent)}
					isLeftCap={isStart}
					isRightCap={isStop}
				/>
			);
		});
		return (
			<React.Fragment key={range.start.toMillis()}>
				{weatherBlockRenders}
			</React.Fragment>
		);
	});

	const nowLineRender = isToday ? (
		<VisualNowLine $left={asPercentString(percentFromStartOfDay(referenceTime, dateTime))} />
	) : null;

	return (
		<Container>
			<TopAbsolute>
				<AbsoluteToRelative>
					{sunRender}
				</AbsoluteToRelative>
			</TopAbsolute>
			<CenterContainer>
				{rangesVisualRender}
			</CenterContainer>
			<BottomAbsolute>
				<AbsoluteToRelative>
					{tidesVisualRender}
				</AbsoluteToRelative>
			</BottomAbsolute>
			{nowLineRender}
		</Container>
	);
};

interface Block {
	start: DateTime;
	stop: DateTime;
}

const millisecondsPerDay = 1000 * 60 * 60 * 24;

function percentFromStartOfDay(event: DateTime, startOfDay: DateTime): number {
	return event.diff(startOfDay, 'milliseconds').milliseconds / millisecondsPerDay;
}

function asPercentString(percent: number): string {
	return (Math.round(percent * 100 * 100) / 100) + '%';
}

const Container = styled.div`
	position: relative;
	overflow: hidden;
	margin: ${Spacing.ant04} 0;
	width: 100%;
	height: 1rem;
	${borderRadiusStyle};
	display: flex;
	align-items: center;
`;

const absoluteCommonStyles = css`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: .25rem;
	display: flex;
	align-items: stretch;
	/* background-color: ${p => p.theme.visual.background}; */
`;

const TopAbsolute = styled.div`
	${absoluteCommonStyles};
	top: .125rem;
`;

const BottomAbsolute = styled.div`
	${absoluteCommonStyles};
	top: .625rem;
`;

const AbsoluteToRelative = styled.div`
	flex: 1;
	position: relative;
	overflow: hidden;
	opacity: .8;
`;

const CenterContainer = styled.div`
	z-index: 2;
	flex: 1;
	position: relative;
	overflow: hidden;
	margin: ${Spacing.bat08} 0;
	background-color: ${p => p.theme.visual.background};
	width: 100%;
	height: .5rem;
	${borderRadiusStyle};
`;

const VisualNowLine = styled.div<{ $left: string; }>`
	z-index: 3;
	position: absolute;
	top: 0;
	left: ${p => p.$left};
	width: 1px;
	height: 100%;
	background-color: ${p => p.theme.common.system.green.a_main};
`;

const VisualRangePart = styled.div<{ $left: string; $width: string; isLeftCap: boolean; isRightCap: boolean; }>`
	position: absolute;
	top: 0;
	left: ${p => p.$left};
	width: ${p => p.$width};
	/* border-top-left-radius: ${p => p.isLeftCap ? borderRadiusValue : '0'};
	border-bottom-left-radius: ${p => p.isLeftCap ? borderRadiusValue : '0'};
	border-top-right-radius: ${p => p.isRightCap ? borderRadiusValue : '0'};
	border-bottom-right-radius: ${p => p.isRightCap ? borderRadiusValue : '0'}; */
	height: .5rem;
`;

const VisualBest = styled(VisualRangePart)`
	background-color: ${p => p.theme.common.system.green.c_lighter};
`;

const VisualOkay = styled(VisualRangePart)`
	background-color: ${p => p.theme.common.system.yellow.a_main};
`;

const VisualTide = styled(VisualRangePart)`
	background-color: ${p => p.theme.visual.tideCoverage};
`;

const VisualSun = styled(VisualRangePart)`
	background-color: ${p => p.theme.common.content.sun};
`;
