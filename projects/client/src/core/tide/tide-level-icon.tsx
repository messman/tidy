import { DateTime } from 'luxon';
import * as React from 'react';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';
import { Icon } from '../icon/icon';
import { fontStyleDeclarations } from '../text';
import { styled, StyledFC } from '../theme/styled';

/** A tide status that should never happen with real data, but may be used for loading. */
export const unknownTide: iso.Tide.MeasureStamp = { time: DateTime.now(), height: 0, direction: iso.Tide.Direction.turning, division: iso.Tide.Division.mid, isComputed: false, isAlternate: false, computed: 0 };

export interface TideLevelIconProps {
	tide: iso.Tide.MeasureStamp;
}

export const TideLevelIcon: StyledFC<TideLevelIconProps> = (props) => {
	const { division, direction } = props.tide;

	let icon: JSX.Element | null = null;

	if (direction === iso.Tide.Direction.turning) {
		if (division === iso.Tide.Division.low) {
			icon = <ExtremeText>LO</ExtremeText>;
		}
		else if (division === iso.Tide.Division.high) {
			icon = <ExtremeText>HI</ExtremeText>;
		}
		else if (division === iso.Tide.Division.mid) {
			// Used for loading
		}
	}
	else if (direction === iso.Tide.Direction.rising) {
		if (division === iso.Tide.Division.mid) {
			icon = <ArrowIcon type={icons.tideUpLong} />;
		}
		else {
			// 2 scenarios
			icon = <ArrowIcon type={icons.tideUp} />;
		}
	}
	else if (direction === iso.Tide.Direction.falling) {
		if (division === iso.Tide.Division.mid) {
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

export interface TideExtremeIconProps {
	isLow: boolean;
}

export const TideExtremeIcon: StyledFC<TideExtremeIconProps> = (props) => {
	const { isLow } = props;
	return (
		<TideLevelIconContainer>
			<WaterIcon type={icons.tideWave} division={isLow ? iso.Tide.Division.low : iso.Tide.Division.high} />
			<CenteringContainer>
				<ExtremeText>{isLow ? 'LO' : 'HI'}</ExtremeText>
			</CenteringContainer>
		</TideLevelIconContainer>
	);
};

const TideLevelIconContainer = styled.span`
	display: inline-block;
	background-color: ${p => p.theme.common.content.backgroundDay};
	border-radius: 50%;

	position: relative;
	width: 2rem;
	height: 2rem;
	flex-shrink: 0;

	overflow: hidden;
`;

const waterOffsetPercent: Record<keyof typeof iso.Tide.Division, string> = {
	high: '6.25%',
	mid: '34.375%',
	low: '65.625%'
};

const WaterIcon = styled(Icon) <{ division: iso.Tide.Division; }>`
	position: absolute;
	top: ${p => iso.mapEnumValue(iso.Tide.Division, waterOffsetPercent, p.division)};
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