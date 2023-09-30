import * as React from 'react';
import styled from 'styled-components';
import { SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { Block } from '@/index/core/layout/layout-shared';
import { AboutAbout } from './about-about';
import { AboutDataWarning } from './about-data-warning';
import { AboutDev } from './about-dev';
import { AboutIcon } from './about-icon';
import { AboutSettings } from './about-settings';
import { AboutShare } from './about-share';

export const About: React.FC = () => {
	return (
		<ScrollContainer>
			<AboutIcon />
			<Block.Elf24 />
			<WideContainer>
				<WideColumn>
					<AboutShare />
					<AboutAbout />
				</WideColumn>
				<WideColumn>
					<AboutSettings />
					<AboutDataWarning />
					<AboutDev />
				</WideColumn>
			</WideContainer>
		</ScrollContainer>
	);
};

const ScrollContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
`;

const WideContainer = styled.div`
	display: flex;
	justify-content: center;
	gap: 3rem;
	padding: ${SpacePanelGridPadding.value};
`;

const WideColumn = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 3rem;
	max-width: 22rem;
`;
