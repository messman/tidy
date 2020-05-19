import * as React from 'react';
import { TimelineBarWeather } from './timeline-bar-weather';
import { styled } from '@/core/style/styled';
import { TimelineBarAstro } from './timeline-bar-astro';
import { TimelineBarTide } from './timeline-bar-tide';
import { FlexColumn } from '@/core/layout/flex';

export const TimelineBar: React.FC = () => {

	// Use flex 1 0 0, meaning, "I can take up more space (vertically), but I won't shrink".
	// And when growing, center the content within.
	return (
		<FlexColumn flex='1 0 0' justifyContent='center'>

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