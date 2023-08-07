import * as React from 'react';
import styled from 'styled-components';
import { defaultIconSvgStyle, Icon, IconInputType } from '@/index/core/icon/icon';
import { StyledFC } from '@/index/core/primitive/primitive-styled';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';
import { AstroLunarPhase, mapNumberEnumValue } from '@wbtdevlocal/iso';

export interface MoonPhaseIconProps {
	phase: AstroLunarPhase;
}

export const MoonPhaseIcon: StyledFC<MoonPhaseIconProps> = (props) => {
	const { phase } = props;

	const icon = mapNumberEnumValue(AstroLunarPhase, moonPhaseIcon, phase);

	return (
		<MoonPhaseIconContainer>
			<Icon type={icon} />
		</MoonPhaseIconContainer>
	);
};

const MoonPhaseIconContainer = styled.span`
	${defaultIconSvgStyle}
	display: inline-flex;
	justify-content: center;
	align-items: center;
	background-color: ${themeTokens.lunar.background};
	border-radius: 50%;
	width: 2rem;
	height: 2rem;
	flex-shrink: 0;
	// Slightly smaller in comparison to weather icons; because moon takes up all space as a circle
	padding: .25rem;
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