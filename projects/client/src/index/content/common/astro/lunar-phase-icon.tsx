import * as React from 'react';
import styled from 'styled-components';
import { Icon, IconInputType } from '@/index/core/icon/icon';
import { borderRadiusSmallerValue } from '@/index/core/primitive/primitive-design';
import { StyledFC } from '@/index/core/primitive/primitive-styled';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';
import { AstroLunarPhase, mapNumberEnumValue } from '@wbtdevlocal/iso';

const LunarPhaseIcon_Container = styled.span`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	background-color: ${themeTokens.lunar.background};
	border-radius: ${borderRadiusSmallerValue};
	width: 2.25rem;
	height: 2.25rem;	
`;

const LunarPhaseIcon_Icon = styled(Icon)`
	width: 2rem;
	height: 2rem;
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
	const { phase } = props;

	const icon = mapNumberEnumValue(AstroLunarPhase, moonPhaseIcon, phase);

	return (
		<LunarPhaseIcon_Container>
			<LunarPhaseIcon_Icon type={icon} />
		</LunarPhaseIcon_Container>
	);
};

