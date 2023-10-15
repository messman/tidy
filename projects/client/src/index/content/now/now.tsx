import * as React from 'react';
import styled from 'styled-components';
import { wrapForBatchLoad } from '@/index/core/data/batch-load-control';
import { DefaultErrorLoad } from '@/index/core/data/loader';
import { SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { LayoutBreakpointRem } from '@/index/core/layout/window-layout';
import { NowAstro } from './now-astro';
import { NowBeach } from './now-beach';
import { NowTide } from './now-tide';
import { NowWeather } from './now-weather';

export const Now: React.FC = wrapForBatchLoad(DefaultErrorLoad, () => {
	return (
		<CenteringContainer>
			<Container>
				<NowBeach />
				<NowTide />
				<NowWeather />
				<NowAstro />
			</Container>
		</CenteringContainer>
	);
});

const CenteringContainer = styled.div`
	width: 100%;
	height: fit-content;
	display: flex;
	justify-content: center;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding: ${SpacePanelGridPadding.value};
	max-width: ${LayoutBreakpointRem.c30}rem;
`;