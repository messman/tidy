import * as React from 'react';
import { ContextBlock } from '@/core/layout/context-block';
import { Paragraph } from '@/core/text';
import { TimeDurationTextUnit, TimeTextUnit } from '@/core/text-unit';
import { Spacing } from '@/core/theme/box';
import { css, styled } from '@/core/theme/styled';
import { CONSTANT } from '@/services/constant';
import { useBatchLatestResponse } from '@/services/data/data';
import { getDurationDescription, percentTimeBetween } from '@/services/time';
import { useControlledElementSize } from '@messman/react-common';

export interface SummaryAstroProps {
	isDualMode: boolean;
}

export const SummaryAstro: React.FC<SummaryAstroProps> = (props) => {
	return (
		<ContextBlock
			primary={<SummaryAstroPrimary />}
			secondary={<SummaryAstroSecondary />}
			isDualMode={props.isDualMode}
		/>
	);
};

const SummaryAstroPrimary: React.FC = () => {

	const { success } = useBatchLatestResponse();
	if (!success) {
		return null;
	}
	const { daily, meta } = success;
	// Instead of using the current info, which is relative to the reference time, use the current day.
	const [sunrise, sunset] = daily.days[0].sun;

	const timePercent = percentTimeBetween(meta.referenceTime, sunrise.time, sunset.time);

	return (
		<>
			<SummaryAstroSunBar percent={timePercent} />
			<Left>
				<Paragraph>SUNRISE</Paragraph>
				<Paragraph>
					<TimeTextUnit dateTime={sunrise.time} />
				</Paragraph>
			</Left>
			<Center>
				<TimeDurationTextUnit startTime={sunrise.time} endTime={sunset.time} />
			</Center>
			<Right>
				<Paragraph>SUNSET</Paragraph>
				<Paragraph>
					<TimeTextUnit dateTime={sunset.time} />
				</Paragraph>
			</Right>
		</>
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
	percent: number;
}

const sunRadius = 9;
const sunPathThickness = 6;

const SummaryAstroSunBar: React.FC<SummaryAstroSunBarProps> = (props) => {

	const [ref, size] = useControlledElementSize(CONSTANT.elementSizeSmallThrottleTimeout);

	let sunSVG: JSX.Element | null = null;
	if (size.width > 1 && size.height > 1) {

		// Add the sun path thickness to offset correctly for box-sizing (border-box).
		const width = size.width + sunPathThickness;
		const height = size.height;

		/*
			Below code is all about recreating the curve of the sun overhead. Basically, an arc in the sky with a sun that follows it.
			Our inputs are 3 points: the lower-left edge of our bounds, the lower-right edge of our bounds, and the top center of the bounds.
			These 3 points act as points in an overall circle that represents the path of the sun.
			All 3 points are equidistant from the center of the circle. Our goal is to find that radius by using the distance and angles between these points.
		*/

		// Do some trig to figure out the radius of our circle. SOHCAHTOA!
		const opposite1 = width / 2;
		const adjacent1 = height;
		const thetaRad1 = Math.atan(opposite1 / adjacent1);

		const adjacent2 = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height, 2)) / 2;
		const hypotenuse2 = adjacent2 / Math.cos(thetaRad1);

		const circleRadius = hypotenuse2;

		// We can't use 180 degrees as our available rotational area. We need to compute the angles we have.
		const hypotenuse3 = circleRadius;
		const adjacent3 = width / 2;
		const thetaRad3 = Math.acos(adjacent3 / hypotenuse3);
		const lostAngleOneSide = (thetaRad3 / Math.PI) * 180;
		const totalAngle = 180 - (lostAngleOneSide * 2);

		const top = 0;
		// Use actual size here because we are offsetting relative to the bounds box, not the width of a circle.
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
		);
	}

	/*
		Structure:
		- Top container is an everyday div with margin to bring it off the edges. Explicit height.
			- Inside, show the start and end dots that go outside of the top container.
			- Layer the SVG over that, with a masking box.
	*/
	return (
		<SunBarContainer ref={ref}>
			<SunBarStart />
			<SunBarEnd />
			{sunSVG}
		</SunBarContainer>
	);
};

const SunBarContainer = styled.div`
	position: relative;
	/* Brings the content inside away from the edge of the context block. */
	margin: ${Spacing.dog16};
	/* This is just what looked good. */
	height: 4rem;
`;

const startEndCircleRadius = 7;
// Position in the bottom corners of our bounds as circles.
const sunBarStartEndStyle = css`
	position: absolute;
	bottom: -${startEndCircleRadius}px;
	width: ${startEndCircleRadius * 2}px;
	height: ${startEndCircleRadius * 2}px;
	border-radius: 50%;
`;

const SunBarStart = styled.div`
	${sunBarStartEndStyle}
	left: -${startEndCircleRadius}px;
	background-color: ${p => p.theme.common.content.sun};
`;

const SunBarEnd = styled.div`
	${sunBarStartEndStyle}
	right: -${startEndCircleRadius}px;
	background-color: #FFF;
`;

interface SunPathProps {
	top: number,
	left: number,
	circleRadius: number,
	rotationDegree: number;
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

	border-top-color: ${p => p.theme.common.content.sun};
	border-left-color: ${p => p.theme.common.content.sun};
	border-right-color: #FFF;
	border-bottom-color: #FFF;
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
		/* This is the actual sun circle inside. */
		content: '';
		display: block;
		position: absolute;
		top: ${0 - (sunRadius + sunPathThickness / 2)}px;
		left: ${p => (p.circleRadius - sunRadius - sunPathThickness)}px;
		width: ${sunRadius * 2}px;
		height: ${sunRadius * 2}px;
		background-color: ${p => p.theme.common.content.sun};
		border-radius: 50%;
	}
`;

const SummaryAstroSecondary: React.FC = () => {
	const { success } = useBatchLatestResponse();
	if (!success) {
		return null;
	}

	const { meta, current, daily } = success;
	const sun = current.sun;

	const [sunrise, sunset] = daily.days[0].sun;
	const peak = sunrise.time.plus({ seconds: sunset.time.diff(sunrise.time, 'seconds').seconds / 2 });
	const peakDurationText = getDurationDescription(meta.referenceTime, peak);
	const peakPhrase = meta.referenceTime > peak ? `The sun was at its peak ${peakDurationText} ago` : `The sun will peak in ${peakDurationText}`;

	const nextSunText = sun.next.isSunrise ? 'rise' : 'set';
	const nextSunDurationText = getDurationDescription(meta.referenceTime, sun.next.time);

	return (
		<Paragraph>
			{peakPhrase} at <TimeTextUnit dateTime={peak} />. The sun will {nextSunText} in {nextSunDurationText}.
		</Paragraph>
	);
};