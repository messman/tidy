import * as React from 'react';
import { Panel } from '@/core/layout/panel/panel';
import { fontStyleDeclarations, Paragraph } from '@/core/text';
import { Block } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { HomeSummaryClickPadding } from '../home/home-summary-shared';

export const EducationSummary: React.FC = () => {
	return (
		<Panel>
			<HomeSummaryClickPadding onClick={() => { }}>
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

