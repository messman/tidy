import * as React from 'react';
import { decorateFullScreen } from '@/test/storybook/decorate';
import { MenuBar } from '@/areas/menu-bar/menu-bar';
import { ResponsiveLayout } from '@/areas/layout/layout';
import { MockForecast, MockSettings, MockTimeline } from '@/areas/layout/layout-mock';
import { Summary } from './summary';

export default { title: 'areas/summary' };

export const Summaries = decorateFullScreen(() => {

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