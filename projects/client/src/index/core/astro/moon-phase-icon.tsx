import * as React from 'react';
import styled from 'styled-components';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';
import { defaultIconSvgStyle, Icon, IconInputType } from '../icon/icon';
import { StyledFC } from '../primitive/primitive-styled';
import { themeTokens } from '../theme';

export interface MoonPhaseIconProps {
	phase: iso.Astro.MoonPhase;
}

export const MoonPhaseIcon: StyledFC<MoonPhaseIconProps> = (props) => {
	const { phase } = props;

	const icon = iso.mapNumberEnumValue(iso.Astro.MoonPhase, moonPhaseIcon, phase);

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
	background-color: ${themeTokens.content.backgroundDay};
	border-radius: 50%;
	width: 2rem;
	height: 2rem;
	flex-shrink: 0;
	// Slightly smaller in comparison to weather icons; because moon takes up all space as a circle
	padding: .25rem;
`;

const moonPhaseIcon: Record<keyof typeof iso.Astro.MoonPhase, IconInputType> = {
	a_new: icons.moonNew,
	b_waxingCrescent: icons.moonWaxingCrescent,
	c_firstQuarter: icons.moonFirstQuarter,
	d_waxingGibbous: icons.moonWaxingGibbous,
	e_full: icons.moonFull,
	f_waningGibbous: icons.moonWaningGibbous,
	g_thirdQuarter: icons.moonThirdQuarter,
	h_waningCrescent: icons.moonWaningCrescent,
};