import * as React from 'react';
import styled from 'styled-components';
import { SpacePanelGridGap } from '@/index/core/layout/layout-panel';
import { NowAstroDaylight } from './now-astro-daylight';
import { NowAstroLunarPhase } from './now-astro-phase';
import { NowAstroSun } from './now-astro-sun';
import { Section } from './section';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${SpacePanelGridGap.value};
`;

export const NowAstro: React.FC = () => {
	return (
		<Section title="Sun & Moon">
			<Container>
				<NowAstroSun />
				<NowAstroDaylight />
				<NowAstroLunarPhase />
			</Container>
		</Section>
	);
};