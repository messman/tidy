import * as React from 'react';
import styled from 'styled-components';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { AstroLunarPhase } from '@wbtdevlocal/iso';
import { LunarPhaseIcon } from './lunar-phase-icon';

const IconContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	margin: 1rem;
`;

export default CosmosFixture.create(() => {

	return (
		<IconContainer>
			<LunarPhaseIcon phase={AstroLunarPhase.a_new} />
			<LunarPhaseIcon phase={AstroLunarPhase.b_waxingCrescent} />
			<LunarPhaseIcon phase={AstroLunarPhase.c_firstQuarter} />
			<LunarPhaseIcon phase={AstroLunarPhase.d_waxingGibbous} />
			<LunarPhaseIcon phase={AstroLunarPhase.e_full} />
			<LunarPhaseIcon phase={AstroLunarPhase.f_waningGibbous} />
			<LunarPhaseIcon phase={AstroLunarPhase.g_thirdQuarter} />
			<LunarPhaseIcon phase={AstroLunarPhase.h_waningCrescent} />
		</IconContainer>
	);
}, {
	setup: FixtureSetup.root
});