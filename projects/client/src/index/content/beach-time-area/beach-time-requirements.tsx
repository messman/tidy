import * as React from 'react';
import styled from 'styled-components';
import { IconInputType, SizedIcon } from '@/index/core/icon/icon';
import { Block } from '@/index/core/layout/layout-shared';
import { Spacing } from '@/index/core/primitive/primitive-design';
import { MediumLabelText } from '@/index/core/text/text-label';
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
	const { beach } = useBatchResponse().success!;
	const { tide, sun, weather } = beach;

	let tideText: string = null!;
	let tideIcon: IconInputType = null!;
	if (tide.beachTimeStatus === iso.Batch.BeachTimeStatus.best) {
		tideText = `The tide is low enough`;
		tideIcon = icons.expressionHappy;
	}
	else if (tide.beachTimeStatus === iso.Batch.BeachTimeStatus.okay) {
		if (tide.tideMarkStatus === iso.Batch.BeachTimeTideMarkStatus.earlyFall) {
			tideText = `The tide is falling, but still high`;
			tideIcon = icons.expressionStraight;
		}
		else if (tide.tideMarkStatus === iso.Batch.BeachTimeTideMarkStatus.earlyRise) {
			tideText = `The tide is quickly covering the beach`;
			tideIcon = icons.expressionStraight;
		}
	}
	else {
		tideText = `The tide has covered the beach`;
		tideIcon = icons.expressionSad;
	}

	let weatherText: string = null!;
	let weatherIcon: IconInputType = null!;
	if (weather.beachTimeStatus === iso.Batch.BeachTimeStatus.best) {
		weatherText = `The weather is looking good`;
		weatherIcon = icons.expressionHappy;
	}
	else if (weather.beachTimeStatus === iso.Batch.BeachTimeStatus.okay) {
		weatherText = `The weather could be better`;
		weatherIcon = icons.expressionStraight;
	}
	else {
		weatherText = `The weather is poor`;
		weatherIcon = icons.expressionSad;
	}

	let sunText: string = null!;
	let sunIcon: IconInputType = null!;
	if (sun.beachTimeStatus === iso.Batch.BeachTimeStatus.best) {
		sunText = `It's daytime`;
		sunIcon = icons.expressionHappy;
	}
	else if (sun.beachTimeStatus === iso.Batch.BeachTimeStatus.okay) {
		if (sun.sunMarkStatus === iso.Batch.BeachTimeSunMarkStatus.predawn) {
			sunText = `The sun hasn't risen yet, but there is decent light`;
			sunIcon = icons.expressionStraight;
		}
		else if (sun.sunMarkStatus === iso.Batch.BeachTimeSunMarkStatus.sunset) {
			sunText = `The sun has set, but there's still enough light`;
			sunIcon = icons.expressionStraight;
		}
	}
	else {
		sunText = `There's not enough light`;
		sunIcon = icons.expressionSad;
	}

	return (
		<>
			<Container>
				<Requirement icon={tideIcon}>{tideText}</Requirement>
				<Requirement icon={weatherIcon}>{weatherText}</Requirement>
				<Requirement icon={sunIcon}>{sunText}</Requirement>
			</Container>
		</>
	);
};

const Container = styled.div`
	padding: ${Spacing.bat08};
	padding-top: 0;
`;

interface RequirementProps {
	icon: IconInputType;
	children: React.ReactNode;
}

const Requirement: React.FC<RequirementProps> = (props) => {
	const { icon, children } = props;

	return (
		<RequirementContainer>
			<SizedIcon type={icon} size='medium' />
			<Block.Ant04 />
			<MediumLabelText>{children}</MediumLabelText>
		</RequirementContainer>
	);
};

const RequirementContainer = styled.div`
	display: flex;
	padding: ${Spacing.ant04};
`;

