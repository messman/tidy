import * as React from "react";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import * as C from "@/styles/common";
import { pixelsPerDay, isSameDay, timeToPixels, createPrettyTime } from "@/services/time";

interface FullDayProps {
	timeInDay: Date,
	sunrise: Date,
	sunset: Date
}

export const FullDay: React.FC<FullDayProps> = (props) => {
	const { timeInDay, sunrise, sunset } = props;

	const startOfDay = new Date(sunrise);
	startOfDay.setHours(0, 0, 0, 0);

	const sunrisePx = timeToPixels(startOfDay, sunrise);
	const sunsetPx = timeToPixels(startOfDay, sunset);

	const startBar = !!timeInDay ? null : <FullDayStartBar />;
	const endBar = <FullDayEndBar />;
	const dayName = `${sunrise.getMonth() + 1}/${sunrise.getDate()}`;
	const startDayName = !!timeInDay ? null : <DayNameStartText>{dayName}</DayNameStartText>;
	const endDayName = <DayNameEndText>{dayName}</DayNameEndText>;

	let sunriseTime: JSX.Element = null;
	if (!timeInDay || timeToPixels(timeInDay, sunrise) > 100) {
		sunriseTime = <SunEventText leftOffset={sunrisePx}>Sunrise {createPrettyTime(sunrise)}</SunEventText>
	}

	let sunsetTime: JSX.Element = null;
	if (!timeInDay || timeToPixels(timeInDay, sunset) > 100) {
		sunsetTime = <SunEventText leftOffset={sunsetPx}>Sunset {createPrettyTime(sunset)}</SunEventText>
	}

	return (
		<AbsoluteContainer total={pixelsPerDay}>
			<AbsoluteToRelative>
				<FullDayBackground sunrisePx={sunrisePx} sunsetPx={sunsetPx} />
				{startBar}
				{endBar}
				{startDayName}
				{endDayName}
				{sunriseTime}
				{sunsetTime}
			</AbsoluteToRelative>
		</AbsoluteContainer>
	);
}

const ShadowSmallTextStyle = styled(C.SmallText)`
	text-shadow: 0px 0px 5px ${props => props.theme.color.bgDark};
`;

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

interface AbsoluteContainerProps {
	total: number
}

const AbsoluteContainer = styled.div<AbsoluteContainerProps>`
	position: absolute;
	top: 0;
	right: 0;
	width: ${props => props.total}px;
	height: 100%;
	display: flex;
`;

const AbsoluteToRelative = styled.div`
	position: relative;
	flex: 1;
`;

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

const FullDayStartEndStyle = css`
	position: absolute;
	height: 100%;
	width: 2px;
	background-color: ${props => props.theme.color.layerLight};
	opacity: .5;
`;

const FullDayEndBar = styled.div`
	${FullDayStartEndStyle}
	right: 0;
`;

const FullDayStartBar = styled.div`
	${FullDayStartEndStyle}
	left: 0;
`;

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

const FullDayTextStyle = css`
	position: absolute;
	top: 0;
	height: inherit;
	line-height: inherit;
`;

const DayNameEndText = styled(ShadowSmallTextStyle)`
	${FullDayTextStyle}
	right: .5rem;
`;

const DayNameStartText = styled(ShadowSmallTextStyle)`
	${FullDayTextStyle}
	left: .5rem;
`;

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

interface SunEventTextProps {
	leftOffset: number
}

const _SunEventText: StyledFC<SunEventTextProps> = (props) => {
	return <ShadowSmallTextStyle className={props.className}>{props.children}</ShadowSmallTextStyle>;
}

const SunEventText = styled(_SunEventText)`
	${FullDayTextStyle}
	left: ${props => props.leftOffset - 100}px;
	width: 200px;
	text-align: center;
`;

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

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
	sunrisePx: number,
	sunsetPx: number,
}

const FullDayBackground: StyledFC<FullDayBackgroundProps> = (props) => {
	const { sunrisePx, sunsetPx } = props;

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

