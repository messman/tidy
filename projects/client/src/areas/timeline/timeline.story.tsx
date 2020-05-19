import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { MenuBar } from '@/areas/menu-bar/menu-bar';
import { ResponsiveLayout } from '@/areas/layout/layout';
import { MockForecast, MockSettings, MockSummary } from '@/areas/layout/layout-mock';
import { Timeline } from './timeline';

export default { title: 'areas/timeline' };

export const Summaries = decorate(() => {

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