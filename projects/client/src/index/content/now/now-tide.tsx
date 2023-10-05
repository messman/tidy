import * as React from 'react';
import styled from 'styled-components';
import { SpacePanelGridGap } from '@/index/core/layout/layout-panel';
import { isDebug } from '@/index/utility/debug';
import { NowTideDebug } from './now-tide-debug';
import { NowTideLevels } from './now-tide-levels';
import { Section } from './section';

export const NowTide: React.FC = () => {
	return (
		<Section title="Tides">
			<Container>

				<NowTideLevels />
				{isDebug() && (
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