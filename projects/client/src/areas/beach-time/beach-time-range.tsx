import { DateTime } from 'luxon';
import * as React from 'react';
import { fontStyleDeclarations } from '@/core/text';
import { Spacing } from '@/core/theme/box';
import { css, styled } from '@/core/theme/styled';
import { getTimeTwelveHourRange, getTimeTwelveHourString } from '@/services/time';
import * as iso from '@wbtdevlocal/iso';

export interface BeachTimeRangeViewProps {
	day: iso.Batch.BeachTimeDay;
}


export const BeachTimeRangeView: React.FC<BeachTimeRangeViewProps> = (props) => {
	const { ranges, day } = props.day;

	const rangesRender = ranges.map((range) => {
		return <SubtleBodyText key={range.start.toMillis()}>{getTimeTwelveHourRange(range.start, range.stop)}</SubtleBodyText>;
	});

	const rangesVisualRender = ranges.map((range) => {
		const weatherBlockRenders = range.weather.map((block, i) => {
			const isStart = i === 0;
			const isStop = i === range.weather.length - 1;
			const blockStartPercent = percentFromStartOfDay(block.start, day);
			const blockStopPercent = percentFromStartOfDay(block.stop, day);
			const widthPercent = blockStopPercent - blockStartPercent;
			const Component = block.isBest ? VisualBest : VisualOkay;
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

	return (
		<>
			<VisualContainer>
				{rangesVisualRender}
			</VisualContainer>
			{rangesRender}
		</>
	);
};

const millisecondsPerDay = 1000 * 60 * 60 * 24;

function percentFromStartOfDay(event: DateTime, startOfDay: DateTime): number {
	return event.diff(startOfDay, 'milliseconds').milliseconds / millisecondsPerDay;
}

function asPercentString(percent: number): string {
	return (Math.round(percent * 100 * 10) / 10) + '%';
}

const SubtleBodyText = styled.div`
	${fontStyleDeclarations.body};
	color: ${p => p.theme.textSubtle};
	text-align: right;
`;

//#region Visual

const heightStyle = css`
	height: .5rem;
`;
const borderRadiusValue = '.5rem';
const borderStyle = css`
	border-radius: ${borderRadiusValue};
`;

const VisualContainer = styled.div`
	position: relative;
	overflow: hidden;
	margin: ${Spacing.bat08} 0;
	background-color: ${p => p.theme.visual.background};
	width: 100%;
	${heightStyle};
	${borderStyle};
`;

const VisualRangePart = styled.div<{ $left: string; $width: string; isLeftCap: boolean; isRightCap: boolean; }>`
	position: absolute;
	top: 0;
	left: ${p => p.$left};
	width: ${p => p.$width};
	border-top-left-radius: ${p => p.isLeftCap ? borderRadiusValue : '0'};
	border-bottom-left-radius: ${p => p.isLeftCap ? borderRadiusValue : '0'};
	border-top-right-radius: ${p => p.isRightCap ? borderRadiusValue : '0'};
	border-bottom-right-radius: ${p => p.isRightCap ? borderRadiusValue : '0'};
	${heightStyle};
`;

const VisualBest = styled(VisualRangePart)`
	background-color: ${p => p.theme.common.system.green.c_lighter};
`;

const VisualOkay = styled(VisualRangePart)`
	background-color: ${p => p.theme.common.system.yellow.a_main};
`;

//#endregion