import * as React from 'react';
import styled from 'styled-components';
import { SizedIcon } from '@/index/core/icon/icon';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { icons } from '@wbtdevlocal/assets';

export interface LearnQuestionProps {
	children: React.ReactNode;
	onClick: () => void;
};

export const LearnQuestion: React.FC<LearnQuestionProps> = (props) => {
	const { onClick, children } = props;

	return (
		<Panel onClick={onClick}>
			<Container>
				<Text>
					{children}
				</Text>
				<SizedIcon size='medium' type={icons.coreArrowChevronRight} />
			</Container>
		</Panel>
	);
};

const Container = styled.div`
	display: flex;
	padding: ${SpacePanelEdge.value};
	padding-bottom: 1.5rem;
`;

const Text = styled.div`
	${fontStyles.lead.large};
	flex: 1;
`;