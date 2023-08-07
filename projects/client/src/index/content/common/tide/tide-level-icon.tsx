import { DateTime } from 'luxon';
import * as React from 'react';
import styled from 'styled-components';
import { Icon } from '@/index/core/icon/icon';
import { StyledFC } from '@/index/core/primitive/primitive-styled';
import { fontStyles } from '@/index/core/text/text-shared';
import { icons } from '@wbtdevlocal/assets';
import { mapNumberEnumValue, TideLevelDirection, TideLevelDivision, TidePoint } from '@wbtdevlocal/iso';

/** A tide status that should never happen with real data, but may be used for loading. */
export const unknownTide: TidePoint = { time: DateTime.now(), height: 0, direction: TideLevelDirection.turning, division: TideLevelDivision.mid, isComputed: false, isAlternate: false, computed: 0 };

export interface TideLevelIconProps {
	tide: TidePoint;
}

export const TideLevelIcon: StyledFC<TideLevelIconProps> = (props) => {
	const { division, direction } = props.tide;

	let icon: JSX.Element | null = null;

	if (direction === TideLevelDirection.turning) {
		if (division === TideLevelDivision.low) {
			icon = <ExtremeText>LO</ExtremeText>;
		}
		else if (division === TideLevelDivision.high) {
			icon = <ExtremeText>HI</ExtremeText>;
		}
		else if (division === TideLevelDivision.mid) {
			// Used for loading
		}
	}
	else if (direction === TideLevelDirection.rising) {
		if (division === TideLevelDivision.mid) {
			icon = <ArrowIcon type={icons.tideUpLong} />;
		}
		else {
			// 2 scenarios
			icon = <ArrowIcon type={icons.tideUp} />;
		}
	}
	else if (direction === TideLevelDirection.falling) {
		if (division === TideLevelDivision.mid) {
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
			<WaterIcon type={icons.tideWave} division={isLow ? TideLevelDivision.low : TideLevelDivision.high} />
			<CenteringContainer>
				<ExtremeText>{isLow ? 'LO' : 'HI'}</ExtremeText>
			</CenteringContainer>
		</TideLevelIconContainer>
	);
};

const TideLevelIconContainer = styled.span`
	display: inline-block;
	border-radius: 50%;

	position: relative;
	width: 2rem;
	height: 2rem;
	flex-shrink: 0;

	overflow: hidden;
`;

const waterOffsetPercent: Record<keyof typeof TideLevelDivision, string> = {
	high: '6.25%',
	mid: '34.375%',
	low: '65.625%'
};

const WaterIcon = styled(Icon) <{ division: TideLevelDivision; }>`
	position: absolute;
	top: ${p => mapNumberEnumValue(TideLevelDivision, waterOffsetPercent, p.division)};
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
	${fontStyles.lead.small};
	color: #FFF;
`;

const ArrowIcon = styled(Icon)`
	color: #FFF;
	width: 1.5rem;
	height: 1.5rem;
`;