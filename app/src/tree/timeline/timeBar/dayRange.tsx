import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import { useAppDataContext } from "@/tree/appData";
import * as C from "@/styles/common";
import { pixelsPerDay, isSameDay, timeToPixels } from "@/services/time";

interface DayRangeProps {
	startTime: Date,
	sunrise: Date,
	sunset: Date
}


export const DayRange: StyledFC<DayRangeProps> = (props) => {

	const { startTime, sunrise, sunset } = props;

	let width = pixelsPerDay;
	let timeInDay: Date = null;
	if (isSameDay(startTime, sunrise)) {
		timeInDay = startTime;
		const nextDay = new Date(startTime.getTime());
		nextDay.setHours(24, 0, 0, 0);
		width = timeToPixels(startTime, nextDay);
	}

	console.log(sunrise, sunset);

	return (
		<DayRangeContainer total={width}>
			<FullDay
				timeInDay={timeInDay}
				sunrise={sunrise}
				sunset={sunset}
			/>
		</DayRangeContainer>
	);
}

const ShadowSmallText = styled(C.SmallText)`
	text-shadow: 1px 1px 1px #000, 3px 3px 5px #000;
`;

interface DayRangeContainerProps {
	total: number,

}

const DayRangeContainer = styled.div<DayRangeContainerProps>`
	position: relative;
	display: inline-block;
	height: 26px;
	line-height: 26px;

	width: ${props => props.total}px;
	overflow: hidden;
`;

interface FullDayProps {
	timeInDay: Date,
	sunrise: Date,
	sunset: Date
}

const FullDay: React.FC<FullDayProps> = (props) => {


	return <FullDayBackground sunrise={props.sunrise} sunset={props.sunset} />
}

interface FullDayBackgroundGradientProps {
	sunrise: number,
	mid1: number,
	mid2: number,
	sunset: number,
	total: number
}

const FullDayBackgroundGradient = styled.div<FullDayBackgroundGradientProps>`
	position: absolute;
	top: 0;
	right: 0;
	width: ${props => props.total}px;
	height: 100%;
	background-image: linear-gradient(90deg, ${props => props.theme.color.layerDark} 0px, ${props => props.theme.color.layerMed} ${props => props.sunrise}px, ${props => props.theme.color.layerLight} ${props => props.mid1}px, ${props => props.theme.color.layerLight} ${props => props.mid2}px, ${props => props.theme.color.layerMed} ${props => props.sunset}px, ${props => props.theme.color.layerDark} ${props => props.total}px);
`;

interface FullDayBackgroundProps {
	sunrise: Date,
	sunset: Date,
}

const FullDayBackground: StyledFC<FullDayBackgroundProps> = (props) => {
	const { sunrise, sunset } = props;
	const startOfDay = new Date(sunrise);
	startOfDay.setHours(0, 0, 0, 0);
	const endOfDay = new Date(sunrise);
	endOfDay.setHours(24, 0, 0, 0);

	const sunrisePx = timeToPixels(startOfDay, sunrise);
	const sunsetPx = timeToPixels(startOfDay, sunset);
	const mid1Px = sunrisePx + ((sunsetPx - sunrisePx) * (1 / 3));
	const mid2Px = sunrisePx + ((sunsetPx - sunrisePx) * (2 / 3));
	const total = pixelsPerDay;

	return (
		<FullDayBackgroundGradient
			className={props.className}
			sunrise={sunrisePx}
			mid1={mid1Px}
			mid2={mid2Px}
			sunset={sunsetPx}
			total={total}
		>
			{props.children}
		</FullDayBackgroundGradient>
	);
};

