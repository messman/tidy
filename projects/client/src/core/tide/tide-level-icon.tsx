import * as React from 'react';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';
import { Icon } from '../icon/icon';
import { fontStyleDeclarations } from '../text';
import { styled, StyledFC } from '../theme/styled';

export interface TideLevelIconProps {
	level: iso.Tide.CurrentTide;
}

export const TideLevelIcon: StyledFC<TideLevelIconProps> = (props) => {
	const { division, direction } = props.level;

	let icon: JSX.Element | null = null;

	if (direction === iso.Tide.TideDirection.stable) {
		if (division === iso.Tide.TideDivision.low) {
			icon = <ExtremeText>LO</ExtremeText>;
		}
		else if (division === iso.Tide.TideDivision.high) {
			icon = <ExtremeText>HI</ExtremeText>;
		}
		else if (division === iso.Tide.TideDivision.mid) {
			// Should never happen
		}
	}
	else if (direction === iso.Tide.TideDirection.rising) {
		if (division === iso.Tide.TideDivision.mid) {
			icon = <ArrowIcon type={icons.tideUpLong} />;
		}
		else {
			// 2 scenarios
			icon = <ArrowIcon type={icons.tideUp} />;
		}
	}
	else if (direction === iso.Tide.TideDirection.falling) {
		if (division === iso.Tide.TideDivision.mid) {
			icon = <ArrowIcon type={icons.tideDownLong} />;
		}
		else {
			// 2 scenarios
			icon = <ArrowIcon type={icons.tideDown} />;
		}
	}

	if (icon) {
		icon = <CenteringContainer>{icon}</CenteringContainer>;
	}

	return (
		<TideLevelIconContainer>
			<WaterIcon type={icons.tideWave} division={division} />
			{icon}
		</TideLevelIconContainer>
	);
};

const TideLevelIconContainer = styled.span`
	display: inline-block;
	background-color: ${p => p.theme.common.content.background};
	border-radius: 50%;

	position: relative;
	width: 2rem;
	height: 2rem;

	overflow: hidden;
`;

const waterOffsetPercent: Record<keyof typeof iso.Tide.TideDivision, string> = {
	high: '6.25%',
	mid: '34.375%',
	low: '65.625%'
};

const WaterIcon = styled(Icon) <{ division: iso.Tide.TideDivision; }>`
	position: absolute;
	top: ${p => iso.mapEnumValue(iso.Tide.TideDivision, waterOffsetPercent, p.division)};
	color: ${p => p.theme.badge.water};
	width: 2rem;
	height: 2rem;
`;

const CenteringContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ExtremeText = styled.span`
	${fontStyleDeclarations.leadSmall};
	color: #FFF;
`;

const ArrowIcon = styled(Icon)`
	color: #FFF;
	width: 1.5rem;
	height: 1.5rem;
`;