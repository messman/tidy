import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { ResponsiveLayout } from './layout';
import { MenuBar } from '../menu-bar/menu-bar';
import { MockSummary, MockTimeline, MockForecast, MockSettings } from './layout-mock';

export default { title: 'areas/layout' };

export const Layout = decorate(() => {

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