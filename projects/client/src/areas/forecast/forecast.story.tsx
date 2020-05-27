import * as React from 'react';
import { ResponsiveLayout } from '@/areas/layout/layout';
import { MockSettings, MockSummary, MockTimeline } from '@/areas/layout/layout-mock';
import { MenuBar } from '@/areas/menu-bar/menu-bar';
import { decorate } from '@/test/storybook/decorate';
import { Forecast } from './forecast';

export default { title: 'areas/forecast' };

export const TestForecast = decorate(() => {

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