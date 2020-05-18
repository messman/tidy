import * as React from 'react';
import { Text, SmallText } from '@/core/symbol/text';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { ContextBlock } from './context-block';
import { Flex } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { TimeTextUnit, TextUnit } from '@/core/symbol/text-unit';
import { flowPaddingValue, edgePaddingValue } from '@/core/style/common';
import { useElementSize } from '@/services/layout/element-size';
import { CONSTANT } from '@/services/constant';

export const SummaryAstro: React.FC = () => {
	return (
		<ContextBlock
			Primary={SummaryAstroPrimary}
			Secondary={SummaryAstroSecondary}
		/>
	);
};

const SummaryAstroPrimary: React.FC = () => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}
	const { all, info } = allResponseState.data!;
	const [sunrise, sunset] = all.daily.days[0].sun;

	const duration = sunset.time.diff(sunrise.time, ['hours', 'minutes']);
	const timePercent = Math.max(0, Math.min(100, Math.round((info.referenceTime.valueOf() - sunrise.time.valueOf()) / (sunset.time.valueOf() - sunrise.time.valueOf()) * 100)));

	return (
		<Flex>
			<SummaryAstroSunBar percent={timePercent} />
			<Left>
				<SmallText>SUNRISE</SmallText>
				<Text>
					<TimeTextUnit dateTime={sunrise.time} />
				</Text>
			</Left>
			<Center>
				<TextUnit text={duration.hours.toString()} unit='h' /> <TextUnit text={duration.minutes.toString()} unit='m' />
			</Center>
			<Right>
				<SmallText>SUNSET</SmallText>
				<Text>
					<TimeTextUnit dateTime={sunset.time} />
				</Text>
			</Right>
		</Flex>
	);
};

const Left = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	text-align: left;
`;

const Right = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	text-align: right;
`;

const Center = styled.div`
	position: absolute;
	bottom: 0;
	width: 100%;
	text-align: center;
`;

interface SummaryAstroSunBarProps {
	percent: number
}

const sunRadius = 8;
const sunPathThickness = 4;

const SummaryAstroSunBar: React.FC<SummaryAstroSunBarProps> = (props) => {

	const ref = React.useRef<HTMLDivElement>(null);
	const size = useElementSize(ref, CONSTANT.elementSizeSmallThrottleTimeout);

	let sunSVG: JSX.Element | null = null;
	if (!size.isSizing && size.width > 1 && size.height > 1) {

		// Add the sun path thickness to offset correctly for box-sizing (border-box).
		const width = size.width + sunPathThickness;
		const height = size.height;

		// Do some trig to figure out the radius of our circle. SOHCAHTOA!
		const opposite1 = width / 2;
		const adjacent1 = height;
		const thetaRad1 = Math.atan(opposite1 / adjacent1);

		const adjacent2 = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height, 2)) / 2;
		const hypotenuse2 = adjacent2 / Math.cos(thetaRad1);

		const circleRadius = hypotenuse2;

		// We can't use 180 degrees as our available rotational area. We need to compute the angles we have
		const hypotenuse3 = circleRadius;
		const adjacent3 = width / 2;
		const thetaRad3 = Math.acos(adjacent3 / hypotenuse3);
		const lostAngleOneSide = (thetaRad3 / Math.PI) * 180;
		const totalAngle = 180 - (lostAngleOneSide * 2);

		const top = 0;
		// Use actual size here.
		const left = (size.width / 2) - circleRadius;

		// Path border starts at 135 degree angle based on how CSS works for this solution.
		const pathRotationDegree = Math.round((props.percent / 100) * totalAngle) - 135 + lostAngleOneSide;
		// Sun is ::after, and starts at the very top.
		const sunRotationDegree = Math.round((props.percent / 100) * totalAngle) - 90 + lostAngleOneSide;
		sunSVG = (
			<>
				<AbsoluteMask>
					<SunPath top={top} left={left} circleRadius={circleRadius} rotationDegree={pathRotationDegree} />
				</AbsoluteMask>
				<HiddenSunPath top={top} left={left} circleRadius={circleRadius} rotationDegree={sunRotationDegree} />
			</>
		)
	}

	return (
		<SunBarContainer ref={ref}>
			{sunSVG}
			<SunBarStart />
			<SunBarEnd />
		</SunBarContainer>
	)
};

const SunBarContainer = styled.div`
	position: relative;
	margin: calc(${edgePaddingValue} / 2) calc(${flowPaddingValue} * 3);
	height: 4rem;
`;

const startEndCircleRadius = 10;

const SunBarStart = styled.div`
	position: absolute;
	bottom: -${startEndCircleRadius / 2}px;
	left: -${startEndCircleRadius / 2}px;
	width: ${startEndCircleRadius}px;
	height: ${startEndCircleRadius}px;
	background-color: ${p => p.theme.color.sun};
	border-radius: 50%;
`;

const SunBarEnd = styled.div`
	position: absolute;
	bottom: -${startEndCircleRadius / 2}px;
	right: -${startEndCircleRadius / 2}px;
	width: ${startEndCircleRadius}px;
	height: ${startEndCircleRadius}px;
	background-color: ${p => p.theme.color.backgroundLightest};
	border-radius: 50%;
`;

interface SunPathProps {
	top: number,
	left: number,
	circleRadius: number,
	rotationDegree: number
}

const AbsoluteMask = styled.div`
	position: absolute;
	overflow: hidden;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;

const SunPath = styled.div<SunPathProps>`
	position: absolute;
	top: ${p => p.top}px;
	left: ${p => p.left}px;
	width: ${p => p.circleRadius * 2}px;
	height: ${p => p.circleRadius * 2}px;
	border-width: ${sunPathThickness}px;
	border-style: solid;
	border-radius: 50%;
	transform: rotateZ(${p => p.rotationDegree}deg);

	border-top-color: ${p => p.theme.color.sun};
	border-left-color: ${p => p.theme.color.sun};
	border-right-color: ${p => p.theme.color.backgroundLightest};
	border-bottom-color: ${p => p.theme.color.backgroundLightest};
`;

const HiddenSunPath = styled.div<SunPathProps>`
	position: absolute;
	top: ${p => p.top}px;
	left: ${p => p.left}px;
	width: ${p => p.circleRadius * 2}px;
	height: ${p => p.circleRadius * 2}px;
	border-width: ${sunPathThickness}px;
	border-style: solid;
	border-radius: 50%;
	transform: rotateZ(${p => p.rotationDegree}deg);

	border-color: transparent;

	::after {
		content: '';
		display: block;
		position: absolute;
		top: ${0 - (sunRadius + sunPathThickness / 2)}px;
		left: ${p => (p.circleRadius - sunRadius - sunPathThickness)}px;
		width: ${sunRadius * 2}px;
		height: ${sunRadius * 2}px;
		background-color: ${p => p.theme.color.sun};
		border-radius: 50%;
	}
`;

const SummaryAstroSecondary: React.FC = () => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	return (
		<Text>Hello</Text>
	);
};