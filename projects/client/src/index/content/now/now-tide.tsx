import * as React from 'react';
import styled from 'styled-components';
import { SpacePanelGridGap } from '@/index/core/layout/layout-panel';
import { DEFINE } from '@/index/define';
import { NowTideDebug } from './now-tide-debug';
import { NowTideLevels } from './now-tide-levels';
import { Section } from './section';

const searchParams = new URLSearchParams(window.location.search);
const isProductionDebug = searchParams.get('debug') !== null;

export const NowTide: React.FC = () => {
	return (
		<Section title="Tides">
			<Container>

				<NowTideLevels />
				{(DEFINE.isDevelopment || isProductionDebug) && (
					<NowTideDebug />
				)}
			</Container>
		</Section>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${SpacePanelGridGap.value};
`;