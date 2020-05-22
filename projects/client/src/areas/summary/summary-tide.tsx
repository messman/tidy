import * as React from 'react';
import { ContextBlock } from '@/core/layout/context-block';
import { Flex, FlexRow } from '@/core/layout/flex';
import { flowPaddingValue } from '@/core/style/common';
import { css, styled } from '@/core/style/styled';
import { SmallText, Text } from '@/core/symbol/text';
import { TimeTextUnit } from '@/core/symbol/text-unit';
import { TideHeightTextUnit } from '@/core/tide/tide-common';
import { CONSTANT } from '@/services/constant';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { getDurationDescription, percentTimeBetween } from '@/services/time';

export interface SummaryTideProps {
	isDualMode: boolean;
}

export const SummaryTide: React.FC<SummaryTideProps> = (props) => {
	return (
		<ContextBlock
			primary={<SummaryTidePrimary />}
			secondary={<SummaryTideSecondary />}
			isPadded={true}
			isDualMode={props.isDualMode}
		/>
	);
};

const SummaryTidePrimary: React.FC = () => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;
	const tides = all.current.tides;

	const timePercent = percentTimeBetween(info.referenceTime, tides.previous.time, tides.next.time);
	const timePercentString = timePercent.toString();

	return (
		<Flex>
			<FlexRow alignItems='center'>
				<FlexCenter>
					<SmallText>{tides.previous.isLow ? 'LOW' : 'HIGH'}</SmallText>
					<Text>
						<TimeTextUnit dateTime={tides.previous.time} />
					</Text>
				</FlexCenter>
				<FlexCenter flex={2}>
					<Text>
						<TimeTextUnit dateTime={info.referenceTime} />
					</Text>
				</FlexCenter>
				<FlexCenter>
					<SmallText>{tides.next.isLow ? 'LOW' : 'HIGH'}</SmallText>
					<Text>
						<TimeTextUnit dateTime={tides.next.time} />
					</Text>
				</FlexCenter>
			</FlexRow>
			<FlexRow>
				<Flex flex={1} />
				<Flex flex={6}>
					<CenterLinePadding>
						<SummaryTideBar percent={timePercent} />
					</CenterLinePadding>
				</Flex>
				<Flex flex={1} />
			</FlexRow>
			<FlexRow>
				<FlexCenter>
					<TideHeightTextUnit height={tides.previous.height} />
				</FlexCenter>
				<FlexCenter flex={2}>
					<Text>
						{timePercentString}% (<TideHeightTextUnit height={tides.height} />)
					</Text>
				</FlexCenter>
				<FlexCenter>
					<TideHeightTextUnit height={tides.next.height} />
				</FlexCenter>
			</FlexRow>
		</Flex>
	);
};

const FlexCenter = styled(Flex)`
	text-align: center;
`;

interface SummaryTideBarProps {
	percent: number;
}

const SummaryTideBar: React.FC<SummaryTideBarProps> = (props) => {
	const { percent } = props;

	return (
		<>
			<PreviousCircle />
			<NextCircle />
			<CenterLine percent={percent} />
			<CurrentDot percent={percent} />
		</>
	);
};

const centerLineHeight = 4;
const circleRadius = centerLineHeight * 2.6;
const circleTopOffset = (centerLineHeight / 2) - (circleRadius);
const dotRadius = centerLineHeight * 2.2;
const dotTopOffset = (centerLineHeight / 2) - (dotRadius / 2);

const CenterLinePadding = styled.div`
	display: block;
	position: relative;
	width: 100%;
	height: ${centerLineHeight}px;
	margin: ${flowPaddingValue} 0;
	background-color: ${p => p.theme.color.backgroundLightest};
`;


const CenterLine = styled.div<SummaryTideBarProps>`
	display: block;
	position: absolute;
	left: ${circleRadius}px;
	top: 0;
	width: calc(${p => p.percent}% - ${circleRadius * 2}px);
	height: 100%;
	background-color: ${p => p.theme.color.tide};
`;

const circleStyles = css`
	position: absolute;
	top: ${circleTopOffset}px;
	background-color: ${p => p.theme.color.backgroundLighter};
	width: ${circleRadius * 2}px;
	height: ${circleRadius * 2}px;
	border-radius: 50%;
`;

const PreviousCircle = styled.div`
	${circleStyles}
	left: -${circleRadius}px;
	border: ${centerLineHeight}px solid ${p => p.theme.color.tide};
`;

const CurrentDot = styled.div<SummaryTideBarProps>`
	position: absolute;
	top: ${dotTopOffset}px;
	left: calc(${p => p.percent}% - ${(circleRadius * 2) - (dotRadius / 2)}px);
	width: ${dotRadius}px;
	height: ${dotRadius}px;
	background-color: ${p => p.theme.color.tide};
	border-radius: 50%;
`;

const NextCircle = styled.div`
	${circleStyles}
	right: -${circleRadius}px;
	border: ${centerLineHeight}px solid ${p => p.theme.color.backgroundLightest};
`;

const SummaryTideSecondary: React.FC = () => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	const { all, info } = allResponseState.data!;
	const tides = all.current.tides;
	const currentTideHeightText = tides.height.toFixed(CONSTANT.tideHeightPrecision);
	const nextTideHeightText = tides.next.height.toFixed(CONSTANT.tideHeightPrecision);
	const nextTideText = tides.next.isLow ? 'low' : 'high';
	const nextTideDurationText = getDurationDescription(info.referenceTime, tides.next.time);

	return (
		<Text>
			The tide is at {currentTideHeightText} feet now.
			The tide will be at a {nextTideText} of {nextTideHeightText} feet in {nextTideDurationText}.
		</Text>
	);
};