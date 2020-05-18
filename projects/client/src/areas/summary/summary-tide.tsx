import * as React from 'react';
import { Text, SmallText } from '@/core/symbol/text';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { ContextBlock } from './context-block';
import { FlexRow, Flex } from '@/core/layout/flex';
import { styled, css } from '@/core/style/styled';
import { TimeTextUnit, TextUnit } from '@/core/symbol/text-unit';
import { flowPaddingValue } from '@/core/style/common';

export const SummaryTide: React.FC = () => {
	return (
		<ContextBlock
			Primary={SummaryTidePrimary}
			Secondary={SummaryTideSecondary}
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

	const timePercent = Math.round((info.referenceTime.valueOf() - tides.previous.time.valueOf()) / (tides.next.time.valueOf() - tides.previous.time.valueOf()) * 100);
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
					<TextUnit text={tides.previous.height.toFixed(info.tideHeightPrecision)} unit='ft' />
				</FlexCenter>
				<FlexCenter flex={2}>
					<Text>
						{timePercentString}% (<TextUnit text={tides.height.toFixed(info.tideHeightPrecision)} unit='ft' />)
					</Text>
				</FlexCenter>
				<FlexCenter>
					<TextUnit text={tides.next.height.toFixed(info.tideHeightPrecision)} unit='ft' />
				</FlexCenter>
			</FlexRow>
		</Flex>
	);
};

const FlexCenter = styled(Flex)`
	text-align: center;
`;

interface SummaryTideBarProps {
	percent: number
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
}

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