import * as React from 'react';
import { ResponsiveLayout } from '@/areas/layout/layout';
import { MockForecast, MockSummary, MockTimeline } from '@/areas/layout/layout-mock';
import { MenuBar } from '@/areas/menu-bar/menu-bar';
import { decorate } from '@/test/storybook/decorate';
import { Settings } from './settings';

export default { title: 'areas/settings' };

export const TestSettings = decorate(() => {

	return (
		<MenuBar>
			<ResponsiveLayout
				Summary={MockSummary}
				Timeline={MockTimeline}
				Forecast={MockForecast}
				Settings={Settings}
			/>
		</MenuBar>
	);
});