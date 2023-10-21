import * as React from 'react';
import styled from 'styled-components';
import { Icon, IconInputType } from '@/index/core/icon/icon';
import { borderRadiusSmallerValue } from '@/index/core/primitive/primitive-design';
import { StyledFC } from '@/index/core/primitive/primitive-styled';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';
import { AstroLunarPhase, mapNumberEnumValue } from '@wbtdevlocal/iso';

export const lunarPhaseText = {
	a_new: 'New Moon',
	b_waxingCrescent: 'Waxing Crescent',
	c_firstQuarter: 'First Quarter',
	d_waxingGibbous: 'Waxing Gibbous',
	e_full: 'Full Moon',
	f_waningGibbous: 'Waning Gibbous',
	g_thirdQuarter: 'Third Quarter',
	h_waningCrescent: 'Waning Crescent'
} as const satisfies Record<keyof typeof AstroLunarPhase, string>;

const LunarPhaseIcon_Container = styled.span`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	background-color: ${themeTokens.lunar.background};
	border-radius: ${borderRadiusSmallerValue};
	width: 2rem;
	height: 2rem;
`;

const LunarPhaseIcon_Icon = styled(Icon)`
	width: 75%;
	height: 75%;
`;

const moonPhaseIcon: Record<keyof typeof AstroLunarPhase, IconInputType> = {
	a_new: icons.moonNew,
	b_waxingCrescent: icons.moonWaxingCrescent,
	c_firstQuarter: icons.moonFirstQuarter,
	d_waxingGibbous: icons.moonWaxingGibbous,
	e_full: icons.moonFull,
	f_waningGibbous: icons.moonWaningGibbous,
	g_thirdQuarter: icons.moonThirdQuarter,
	h_waningCrescent: icons.moonWaningCrescent,
};

export interface LunarPhaseIconProps {
	phase: AstroLunarPhase;
}

export const LunarPhaseIcon: StyledFC<LunarPhaseIconProps> = (props) => {
	const { phase, className } = props;

	const icon = mapNumberEnumValue(AstroLunarPhase, moonPhaseIcon, phase);

	return (
		<LunarPhaseIcon_Container className={className}>
			<LunarPhaseIcon_Icon type={icon} />
		</LunarPhaseIcon_Container>
	);
};

