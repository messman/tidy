import { DateTime } from 'luxon';
import * as React from 'react';
import { borderRadiusStyle, borderRadiusValue, Spacing } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import * as iso from '@wbtdevlocal/iso';

export interface BeachTimeRangeVisualProps {
	referenceTime: DateTime;
	day: iso.Batch.BeachTimeDay;
}

// const showOtherLines = false;

export const BeachTimeRangeVisual: React.FC<BeachTimeRangeVisualProps> = (props) => {
	const { referenceTime, day } = props;
	const { ranges, day: dateTime } = day;
	const isToday = dateTime.hasSame(referenceTime, 'day');

	const rangesVisualRender = ranges.map((range) => {
		const blockRenders = range.blocks.map((block, i) => {
			const isStart = i === 0;
			const isStop = i === range.blocks.length - 1;
			const blockStartPercent = percentFromStartOfDay(block.start, dateTime);
			const blockStopPercent = percentFromStartOfDay(block.stop, dateTime);
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
				{blockRenders}
			</React.Fragment>
		);
	});

	const nowLineRender = isToday ? (
		<VisualNowLine $left={asPercentString(percentFromStartOfDay(referenceTime, dateTime))} />
	) : null;

	return (
		<Container>
			<CenterContainer>
				{rangesVisualRender}
			</CenterContainer>
			{nowLineRender}
		</Container>
	);
};

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
