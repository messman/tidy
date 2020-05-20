import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { MenuBar } from '@/areas/menu-bar/menu-bar';
import { ResponsiveLayout } from '@/areas/layout/layout';
import { MockSettings, MockSummary, MockTimeline } from '@/areas/layout/layout-mock';
import { Forecast } from './forecast';

export default { title: 'areas/forecast' };

export const Forecasts = decorate(() => {

	return (
		<MenuBar>
			<ResponsiveLayout
				Summary={MockSummary}
				Timeline={MockTimeline}
				Forecast={Forecast}
				Settings={MockSettings}
			/>
		</MenuBar>
	);
});