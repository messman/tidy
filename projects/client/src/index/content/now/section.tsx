import * as React from 'react';
import styled from 'styled-components';
import { SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: .75rem;
	padding: ${SpacePanelGridPadding.value};
`;

const SectionTitle = styled.div`
	${fontStyles.lead.large}
	color: ${themeTokens.text.onBackground};
`;

export interface SectionProps {
	title?: string;
	children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = (props) => {
	const { title, children } = props;

	return (
		<Container>
			{title && <SectionTitle>{title}</SectionTitle>}
			<div>
				{children}
			</div>
		</Container>
	);
};
