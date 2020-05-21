import * as React from 'react';
import { ContextBlock } from '@/core/layout/context-block';
import { Flex, FlexRow } from '@/core/layout/flex';
import { flowPaddingValue } from '@/core/style/common';
import { css, styled } from '@/core/style/styled';
import { SmallText, Text } from '@/core/symbol/text';
import { TimeTextUnit, WaterLevelTextUnit } from '@/core/symbol/text-unit';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { percentTimeBetween } from '@/services/time';

export const SummaryTide: React.FC = () => {
	return (
		<ContextBlock
			primary={<SummaryTidePrimary />}
			secondary={<SummaryTideSecondary />}
			isPadded={true}
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
					<WaterLevelTextUnit height={tides.previous.height} />
				</FlexCenter>
				<FlexCenter flex={2}>
					<Text>
						{timePercentString}% (<WaterLevelTextUnit height={tides.height} />)
					</Text>
				</FlexCenter>
				<FlexCenter>
					<WaterLevelTextUnit height={tides.next.height} />
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
			<CenterLine percent={percent} />
			<CurrentDot percent={percent} />
			<PreviousCircle />
			<NextCircle />
		</>
	);
};

const CenterLinePadding = styled.div`
	display: block;
	position: relative;
	width: 100%;
	margin: ${flowPaddingValue} 0;
	background-color: ${p => p.theme.color.backgroundLightest};
`;


const centerLineHeight = 4;
const circleRadius = centerLineHeight * 5;
const circleTopOffset = (centerLineHeight / 2) - (circleRadius / 2);
const dotRadius = centerLineHeight * 2;
const dotTopOffset = (centerLineHeight / 2) - (dotRadius / 2);

const CenterLine = styled.div<SummaryTideBarProps>`
	display: block;
	position: relative;
	margin: ${flowPaddingValue} 0;
	background-color: ${p => p.theme.color.tide};
	height: ${centerLineHeight}px;
	width: ${p => p.percent}%;
`;

const circleStyles = css`
	position: absolute;
	top: ${circleTopOffset}px;
	background-color: ${p => p.theme.color.backgroundLighter};
	width: ${circleRadius}px;
	height: ${circleRadius}px;
	border-radius: 50%;
`;

const PreviousCircle = styled.div`
	${circleStyles}
	left: -${circleRadius / 2}px;
	border: ${centerLineHeight}px solid ${p => p.theme.color.tide};
`;

const CurrentDot = styled.div<SummaryTideBarProps>`
	position: absolute;
	top: ${dotTopOffset}px;
	left: calc(${p => p.percent}% - ${dotRadius / 2}px);
	width: ${dotRadius}px;
	height: ${dotRadius}px;
	background-color: ${p => p.theme.color.tide};
	border-radius: 50%;
`;

const NextCircle = styled.div`
	${circleStyles}
	right: -${circleRadius / 2}px;
	border: ${centerLineHeight}px solid ${p => p.theme.color.backgroundLightest};
`;

const SummaryTideSecondary: React.FC = () => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	return (
		<Text>Hello</Text>
	);
};