import * as React from 'react';
import { ResponsiveLayout } from '@/areas/layout/layout';
import { MockForecast, MockSettings, MockSummary } from '@/areas/layout/layout-mock';
import { MenuBar } from '@/areas/menu-bar/menu-bar';
import { decorate } from '@/test/storybook/decorate';
import { Timeline } from './timeline';

export default { title: 'areas/timeline' };

export const Timelines = decorate(() => {

	return (
		<MenuBar>
			<ResponsiveLayout
				Summary={MockSummary}
				Timeline={Timeline}
				Forecast={MockForecast}
				Settings={MockSettings}
			/>
		</MenuBar>
	);
});