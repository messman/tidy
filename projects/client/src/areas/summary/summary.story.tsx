import * as React from 'react';
import { ResponsiveLayout } from '@/areas/layout/layout';
import { MockForecast, MockSettings, MockTimeline } from '@/areas/layout/layout-mock';
import { MenuBar } from '@/areas/menu-bar/menu-bar';
import { decorate } from '@/test/storybook/decorate';
import { Summary } from './summary';

export default { title: 'areas/summary' };

export const TestSummary = decorate(() => {

	return (
		<MenuBar>
			<ResponsiveLayout
				Summary={Summary}
				Timeline={MockTimeline}
				Forecast={MockForecast}
				Settings={MockSettings}
			/>
		</MenuBar>
	);
});