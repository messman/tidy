import * as React from 'react';
import { styled } from '@/core/theme/styled';
import { AboutSummary } from '../about/about-summary';
import { BeachTimeSummary } from '../beach-time/beach-time-summary';

export const Home: React.FC = () => {
	return (
		<HomeContainer>
			<BeachTimeSummary />
			<AboutSummary />
		</HomeContainer>
	);
};

const HomeContainer = styled.div`
	position: relative;
	flex: 1;
`;