import * as React from 'react';
import { ResponsiveLayout } from '@/areas/layout/layout';
import { MockForecast, MockSummary, MockTimeline } from '@/areas/layout/layout-mock';
import { MenuBar } from '@/areas/menu-bar/menu-bar';
import { CosmosFixture } from '@/test';
import { Settings } from './settings';

export default CosmosFixture.create(() => {
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
}, {
	hasMargin: true
});