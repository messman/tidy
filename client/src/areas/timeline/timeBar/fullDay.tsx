import * as React from 'react';
import { styled, css, StyledFC } from '@/core/style/styled';
import { SmallText } from '@/core/symbol/text';
import { pixelsPerDay, timeToPixels, getTimeTwelveHour, getDateDayOfWeek } from '@/services/time';
import { DateTime } from 'luxon';

interface FullDayProps {
	timeInDay: DateTime,
	sunrise: DateTime,
	sunset: DateTime
}

export const FullDay: React.FC<FullDayProps> = (props) => {
	const { timeInDay, sunrise, sunset } = props;

	const startOfDay = sunrise.startOf('day');

	const sunrisePx = timeToPixels(startOfDay, sunrise);
	const sunsetPx = timeToPixels(startOfDay, sunset);

	const startBar = !!timeInDay ? null : <FullDayStartBar />;
	const endBar = <FullDayEndBar />;
	const dayName = getDateDayOfWeek(sunrise);
	const startDayName = !!timeInDay ? null : <DayNameStartText>{dayName}</DayNameStartText>;
	const endDayName = <DayNameEndText>{dayName}</DayNameEndText>;

	let sunriseTime: JSX.Element | null = null;
	if (!timeInDay || timeToPixels(timeInDay, sunrise) > 100) {
		sunriseTime = <SunEventText leftOffset={sunrisePx}>Sunrise {getTimeTwelveHour(sunrise).time}</SunEventText>
	}

	let sunsetTime: JSX.Element | null = null;
	if (!timeInDay || timeToPixels(timeInDay, sunset) > 100) {
		sunsetTime = <SunEventText leftOffset={sunsetPx}>Sunset {getTimeTwelveHour(sunset).time}</SunEventText>
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

const ShadowSmallTextStyle = styled(SmallText)`
	text-shadow: 0px 0px 3px ${p => p.theme.color.background}, 0px 0px 7px ${p => p.theme.color.background};
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
	width: ${p => p.total}px;
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
	background-color: ${p => p.theme.color.background};
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
	left: ${p => p.leftOffset - 100}px;
	width: 200px;
	text-align: center;
`;

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

interface FullDayBackgroundGradientProps {
	lower: number,
	sunrise: number,
	mid1: number,
	mid2: number,
	sunset: number
	upper: number,
	total: number
}

const FullDayBackgroundGradient = styled.div<FullDayBackgroundGradientProps>`
	position: absolute;
	top: 0;
	right: 0;
	width: ${p => p.total}px;
	height: 100%;
	background-image: linear-gradient(90deg,
		${p => p.theme.color.background} 0px,
		${p => p.theme.color.background} ${p => p.lower}px,
		${p => p.theme.color.background} ${p => p.sunrise}px,
		${p => p.theme.color.background} ${p => p.mid1}px,
		${p => p.theme.color.background} ${p => p.mid2}px,
		${p => p.theme.color.background} ${p => p.sunset}px,
		${p => p.theme.color.background} ${p => p.upper}px,
		${p => p.theme.color.background} ${p => p.total}px
	);
`;

interface FullDayBackgroundProps {
	sunrisePx: number,
	sunsetPx: number,
}

const FullDayBackground: StyledFC<FullDayBackgroundProps> = (props) => {
	const { sunrisePx, sunsetPx } = props;


	const lower1Px = sunrisePx * (3 / 5);
	const mid1Px = sunrisePx + ((sunsetPx - sunrisePx) * (1 / 5));
	const mid2Px = sunrisePx + ((sunsetPx - sunrisePx) * (4 / 5));
	const upper1Px = sunsetPx + ((pixelsPerDay - sunsetPx) * (2 / 5))
	const total = pixelsPerDay;

	return (
		<FullDayBackgroundGradient
			className={props.className}

			lower={lower1Px}
			sunrise={sunrisePx}
			mid1={mid1Px}
			mid2={mid2Px}
			sunset={sunsetPx}
			upper={upper1Px}
			total={total}
		>
			{props.children}
		</FullDayBackgroundGradient>
	);
};

