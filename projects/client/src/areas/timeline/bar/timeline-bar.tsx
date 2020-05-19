import * as React from 'react';
import { TimelineBarWeather } from './timeline-bar-weather';
import { styled } from '@/core/style/styled';
import { TimelineBarAstro } from './timeline-bar-astro';
import { TimelineBarTide } from './timeline-bar-tide';
import { FlexColumn } from '@/core/layout/flex';

export const TimelineBar: React.FC = () => {

	return (
		<FlexColumn flex='none'>

			<BarPadding>
				<TimelineBarWeather />
			</BarPadding>
			<BarPadding>
				<TimelineBarAstro />
			</BarPadding>
			<BarPadding>
				<TimelineBarTide />
			</BarPadding>
		</FlexColumn>
	)
};

const BarPadding = styled.div`
	margin-top: 2.5rem;
	margin-bottom: rem;
`;