import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { MenuBar } from '../menu-bar/menu-bar';
import { Summary } from '../summary/summary';
import { Timeline } from '../timeline/timeline';
import { ResponsiveLayout } from './layout';
import { MockForecast, MockSettings, MockSummary, MockTimeline } from './layout-mock';

export default { title: 'areas/layout' };

export const TestLayout = decorate(() => {

	return (
		<MenuBar>
			<ResponsiveLayout
				Summary={MockSummary}
				Timeline={MockTimeline}
				Forecast={MockForecast}
				Settings={MockSettings}
			/>
		</MenuBar>
	);
});



export const TestSummaryTimeline = decorate(() => {

	return (
		<MenuBar>
			<ResponsiveLayout
				Summary={Summary}
				Timeline={Timeline}
				Forecast={MockForecast}
				Settings={MockSettings}
			/>
		</MenuBar>
	);
});
