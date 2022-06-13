import * as React from 'react';
import { Block } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { AboutSummary } from '../about/about-summary';
import { BeachTimeSummary } from '../beach-time/beach-time-summary';
import { ConditionsSummary } from '../conditions/conditions-summary';
import { EducationSummary } from '../education/education-summary';
import { TideSummary } from '../tide/tide-summary';

export const Home: React.FC = () => {
	return (
		<HomeContainer>
			<BeachTimeSummary />
			<Block.Cat12 />
			<TideSummary />
			<Block.Cat12 />
			<ConditionsSummary />
			<Block.Cat12 />
			<EducationSummary />

			<AboutSummary />
		</HomeContainer>
	);
};

const HomeContainer = styled.div`
	position: relative;
	flex: 1;
`;