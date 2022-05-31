// import * as React from 'react';
// import { CosmosFixture } from '@/test';
// import { MenuBar } from '../menu-bar/menu-bar';
// import { Summary } from '../summary/summary';
// import { Timeline } from '../timeline/timeline';
// import { ResponsiveLayout } from './layout';
// import { MockForecast, MockSettings, MockSummary, MockTimeline } from './layout-mock';

// export default {
// 	'Layout': CosmosFixture.create(() => {
// 		return (
// 			<MenuBar>
// 				<ResponsiveLayout
// 					Summary={MockSummary}
// 					Timeline={MockTimeline}
// 					Forecast={MockForecast}
// 					Settings={MockSettings}
// 				/>
// 			</MenuBar>
// 		);
// 	}, {}),

// 	'Summary Timeline': CosmosFixture.create(() => {
// 		return (
// 			<MenuBar>
// 				<ResponsiveLayout
// 					Summary={Summary}
// 					Timeline={Timeline}
// 					Forecast={MockForecast}
// 					Settings={MockSettings}
// 				/>
// 			</MenuBar>
// 		);
// 	}, {}),
// };