import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { AstroLunarPhase } from '@wbtdevlocal/iso';
import { MoonPhaseIcon } from './moon-phase-icon';

export default CosmosFixture.create(() => {

	return (
		<>
			<MoonPhaseIcon phase={AstroLunarPhase.a_new} />
			<MoonPhaseIcon phase={AstroLunarPhase.b_waxingCrescent} />
			<MoonPhaseIcon phase={AstroLunarPhase.c_firstQuarter} />
			<MoonPhaseIcon phase={AstroLunarPhase.d_waxingGibbous} />
			<MoonPhaseIcon phase={AstroLunarPhase.e_full} />
			<MoonPhaseIcon phase={AstroLunarPhase.f_waningGibbous} />
			<MoonPhaseIcon phase={AstroLunarPhase.g_thirdQuarter} />
			<MoonPhaseIcon phase={AstroLunarPhase.h_waningCrescent} />
		</>
	);
}, {
	setup: FixtureSetup.root
});