import * as React from 'react';
import { IconInputType, SizedIcon } from '@/core/icon/icon';
import { LabelText } from '@/core/label';
import { fontStyleDeclarations } from '@/core/text';
import { Block, Spacing } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { BeachTimeStatus, getBeachTimeStatus } from '@/services/content/beach-time-utility';
import { useBatchResponse } from '@/services/data/data';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';

/*
	Spacing is a little weird in this component just because we start with icons on the left side
	and they have some spacing baked-in.
*/


/*
	Tide
		- is currently over/under height
		- if not, when it will be
		- if yes, when it won't be

	Beach time
		tide: show measurement, show if falling or low
		weather: show status, okay if still yellow
		sun: show hours of sunlight remaining
	Ending Soon
		Show the above, unless this is the "reason"
		Use yellows
		tide: rising above tide
		weather: changing to 
		sun: setting
	Starting Soon
		show the above, but if it's the start "reason"
		Use reds
		tide: measurement and soon falling below
		weather currently, but soon becomes
		sun: has not rising, but coming up
	Not started
		Use reds
		
*/

export const BeachTimeRequirements: React.FC = () => {
	const { meta, beach, tide, astro, weather } = useBatchResponse().success!;
	const { referenceTime } = meta;
	const { current, firstCurrentStopReason, upcomingNextStartReasons } = beach;

	const status = getBeachTimeStatus(beach, referenceTime);
	const isEndingSoon = status === BeachTimeStatus.currentEndingSoon;
	const isStartingSoon = status === BeachTimeStatus.nextSoon;

	let tideStartReason: iso.Batch.BeachTimeTideMark | null = null;
	let sunStartReason: iso.Astro.BodyEvent | null = null;
	let weatherStartReason: iso.Weather.Hourly | iso.Weather.Day | null = null;
	upcomingNextStartReasons.forEach((reason) => {
		if (iso.Batch.isBeachTimeTideMark(reason)) {
			tideStartReason = reason;
		}
		else if (iso.Batch.isSunEvent(reason)) {
			sunStartReason = reason;
		}
		else if (iso.Batch.isWeatherEntry(reason)) {
			weatherStartReason = reason;
		}
	});


	let tideText: string = null!;
	let tideIcon: IconInputType = null!;
	if (tide.measured.height <= iso.constant.beachAccessHeight) {
		tideText = `Water level is low enough`;
		tideIcon = icons.expressionHappy;

		if (isEndingSoon && iso.Batch.isBeachTimeTideMark(firstCurrentStopReason)) {
			tideText += `, but not for much longer`;
			tideIcon = icons.expressionStraight;
		}
	}
	else {
		tideText = `Water level is too high`;
		tideIcon = icons.expressionSad;

		if (isStartingSoon && tideStartReason && tide.measured.direction !== iso.Tide.Direction.rising) {
			tideText += `, but is on its way down`;
		}
	}

	let weatherText: string = null!;
	let weatherIcon: IconInputType = null!;
	if (weather.current.indicator !== iso.Weather.Indicator.bad) {
		weatherText = `Weather is ${weather.current.indicator === iso.Weather.Indicator.best ? 'good' : 'okay'}`;
		weatherIcon = icons.expressionHappy;
		if (isEndingSoon && iso.Batch.isWeatherEntry(firstCurrentStopReason)) {
			weatherText += `, but not for much longer`;
			weatherIcon = icons.expressionStraight;
		}
	}
	else {
		weatherText = `Weather is bad`;
		weatherIcon = icons.expressionSad;
		if (isStartingSoon && weatherStartReason) {
			weatherText += `, but it's turning around soon`;
		}
	}

	let sunText: string = null!;
	let sunIcon: IconInputType = null!;
	if (!astro.sun.relativity.next.isRise) {
		sunText = `It's daytime`;
		sunIcon = icons.expressionHappy;
		if (isEndingSoon && iso.Batch.isSunEvent(firstCurrentStopReason)) {
			sunText += `, but not for much longer`;
			sunIcon = icons.expressionStraight;
		}
	}
	else {
		sunText = `Sun has gone down`;
		sunIcon = icons.expressionSad;
		if (isStartingSoon && sunStartReason) {
			sunText += `, but is rising soon`;
		}
	}


	const rightNowText = !current ? (
		<RightNowText>Right now:</RightNowText>
	) : null;

	return (
		<>
			<Container>
				{rightNowText}
				<Requirement icon={tideIcon}>{tideText}</Requirement>
				<Requirement icon={weatherIcon}>{weatherText}</Requirement>
				<Requirement icon={sunIcon}>{sunText}</Requirement>
			</Container>
		</>
	);
};

const RightNowText = styled.div`
	${fontStyleDeclarations.body};
	color: ${p => p.theme.textSubtle};
	padding-left: ${Spacing.bat08};
`;


const Container = styled.div`
	padding: ${Spacing.bat08};
	padding-top: 0;
`;

interface RequirementProps {
	icon: IconInputType;
}

const Requirement: React.FC<RequirementProps> = (props) => {
	const { icon, children } = props;

	return (
		<RequirementContainer>
			<SizedIcon type={icon} size='medium' />
			<Block.Ant04 />
			<LabelText size='medium'>{children}</LabelText>
		</RequirementContainer>
	);
};

const RequirementContainer = styled.div`
	display: flex;
	padding: ${Spacing.ant04};
`;

