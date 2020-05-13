import * as React from 'react';
import { ForecastProps } from '@/areas/forecast/forecast';
import { SettingsProps } from '@/areas/settings/settings';
import { SummaryProps } from '@/areas/summary/summary';
import { TimelineProps } from '@/areas/timeline/timeline';
import { decorateFullScreen } from '@/test/storybook/decorate';
import { ResponsiveLayout } from './layout';
import { Text } from '@/core/symbol/text';
import { MenuBar } from '../menu-bar/menu-bar';
import { Flex } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';

export default { title: 'areas/layout' };

export const Layout = decorateFullScreen(() => {

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

const MockSummary: React.FC<SummaryProps> = (props) => {
	return (
		<Area color='red'>
			<Text>Summary {props.isCompactVertical ? 'Vertical' : 'Horizontal'}</Text>
		</Area>
	);
}

const MockTimeline: React.FC<TimelineProps> = () => {
	return (
		<Area color='rebeccapurple'>
			<Text>Timeline</Text>
		</Area>
	);
}

const MockForecast: React.FC<ForecastProps> = () => {
	return (
		<Area color='deepskyblue'>
			<Text>Forecast</Text>
		</Area>
	);
}

const MockSettings: React.FC<SettingsProps> = () => {
	return (
		<Area color='orange'>
			<Text>Settings</Text>
		</Area>
	);
}

interface AreaProps {
	color: string
}

const Area = styled(Flex) <AreaProps>`
	color: ${p => p.color};
	border: 1px solid ${p => p.color};
	padding: 1rem;
`;
