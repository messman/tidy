import * as React from 'react';
import { IconInputType, SizedIcon } from '@/core/icon/icon';
import { LabelText } from '@/core/label';
import { Block, Spacing } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';

/*
	Spacing is a little weird in this component just because we start with icons on the left side
	and they have some spacing baked-in.
*/

export const BeachTimeRequirements: React.FC = () => {

	return (
		<Container>
			<Requirement satisfaction={RequirementSatisfaction.good}>Tide is falling</Requirement>
			<Requirement satisfaction={RequirementSatisfaction.good}>Weather is nice</Requirement>
			<Requirement satisfaction={RequirementSatisfaction.good}>6 hours of sunlight remaining</Requirement>
		</Container>
	);
};

const Container = styled.div`
	padding: ${Spacing.bat08};
	padding-top: 0;
`;

enum RequirementSatisfaction {
	good,
	neutral,
	poor
}

const satisfactionIconMap: Record<keyof typeof RequirementSatisfaction, IconInputType> = {
	good: icons.expressionHappy,
	neutral: icons.expressionStraight,
	poor: icons.expressionSad,
};

interface RequirementProps {
	satisfaction: RequirementSatisfaction;
}

const Requirement: React.FC<RequirementProps> = (props) => {
	const { satisfaction, children } = props;

	const icon = iso.mapEnumValue(RequirementSatisfaction, satisfactionIconMap, satisfaction);

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

