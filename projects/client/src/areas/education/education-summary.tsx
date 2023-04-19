import * as React from 'react';
import styled from 'styled-components';
import { AppScreen, useAppNavigation } from '@/core/layout/app/app-navigation';
import { Panel } from '@/core/layout/panel/panel';
import { fontStyleDeclarations, Paragraph } from '@/core/text';
import { Block } from '@/core/theme/box';
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
				<Paragraph>
					Learn more about the processes that create the tides you experience.
				</Paragraph>
			</HomeSummaryClickPadding>
		</Panel>
	);
};

const TitleText = styled.div`
	${fontStyleDeclarations.heading5};
`;

