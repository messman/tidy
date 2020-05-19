import * as React from 'react';
import { ForecastProps } from '@/areas/forecast/forecast';
import { SettingsProps } from '@/areas/settings/settings';
import { SummaryProps } from '@/areas/summary/summary';
import { TimelineProps } from '@/areas/timeline/timeline';
import { Text } from '@/core/symbol/text';
import { Flex } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';

export const MockSummary: React.FC<SummaryProps> = (props) => {

	if (props.isCompactVertical) {
		return (
			<Area color='red' >
				<Text>Summary Compact Vertical</Text>
			</Area>
		);
	}

	return (
		<Area color='red' maxHeight={250}>
			<Text>Summary Horizontal</Text>
		</Area>
	);
}

export const MockTimeline: React.FC<TimelineProps> = () => {
	return (
		<Area color='rebeccapurple'>
			<Text>Timeline</Text>
		</Area>
	);
}

export const MockForecast: React.FC<ForecastProps> = () => {
	return (
		<Area color='deepskyblue'>
			<Text>Forecast</Text>
		</Area>
	);
}

export const MockSettings: React.FC<SettingsProps> = () => {
	return (
		<Area color='orange'>
			<Text>Settings</Text>
		</Area>
	);
}

interface AreaProps {
	color: string
	minWidth?: number,
	maxWidth?: number,
	minHeight?: number,
	maxHeight?: number
}

const Area = styled(Flex) <AreaProps>`
	color: ${p => p.color};
	border: 1px solid ${p => p.color};
	padding: 1rem;

	min-width: ${p => makeCSSValue(p.minWidth)};
	max-width: ${p => makeCSSValue(p.maxWidth)};
	min-height: ${p => makeCSSValue(p.minHeight)};
	max-height: ${p => makeCSSValue(p.maxHeight)};
`;

function makeCSSValue(value: number | undefined): string {
	return value ? `${value}px` : 'unset';
}