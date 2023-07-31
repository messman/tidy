import * as React from 'react';
import { CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import * as iso from '@wbtdevlocal/iso';
import { MoonPhaseIcon } from './moon-phase-icon';

export default CosmosFixture.create(() => {

	return (
		<>
			<MoonPhaseIcon phase={iso.Astro.MoonPhase.a_new} />
			<MoonPhaseIcon phase={iso.Astro.MoonPhase.b_waxingCrescent} />
			<MoonPhaseIcon phase={iso.Astro.MoonPhase.c_firstQuarter} />
			<MoonPhaseIcon phase={iso.Astro.MoonPhase.d_waxingGibbous} />
			<MoonPhaseIcon phase={iso.Astro.MoonPhase.e_full} />
			<MoonPhaseIcon phase={iso.Astro.MoonPhase.f_waningGibbous} />
			<MoonPhaseIcon phase={iso.Astro.MoonPhase.g_thirdQuarter} />
			<MoonPhaseIcon phase={iso.Astro.MoonPhase.h_waningCrescent} />
		</>
	);
}, {
	setup: FixtureSetup.root
});