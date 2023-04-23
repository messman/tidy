import * as React from 'react';
import styled from 'styled-components';
import { Block } from '@/core/layout';
import { AppScreen, useAppNavigation } from '@/core/layout/app/app-navigation';
import { Panel } from '@/core/layout/panel/panel';
import { fontStyles, MediumBodyText } from '@/core/text';
import { HomeSummaryClickPadding } from '../home/home-summary-shared';

export const EducationSummary: React.FC = () => {
	const { setScreen } = useAppNavigation();

	function onClick() {
		setScreen(AppScreen.e_education);
	}

	return (
		<Panel>
			<HomeSummaryClickPadding onClick={onClick}>
				<TitleText>
					How do tides work?
				</TitleText>
				<Block.Bat08 />
				<MediumBodyText>
					Learn more about the processes that create the tides you experience.
				</MediumBodyText>
			</HomeSummaryClickPadding>
		</Panel>
	);
};

const TitleText = styled.div`
	${fontStyles.headings.h4};
`;

