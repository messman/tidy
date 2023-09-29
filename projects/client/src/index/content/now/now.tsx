import * as React from 'react';
import styled from 'styled-components';
import { NowAstro } from './now-astro';
import { NowBeach } from './now-beach';
import { NowTide } from './now-tide';
import { NowWeather } from './now-weather';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
`;

export const Now: React.FC = (props) => {
	const { } = props;

	return (
		<Container>
			<NowBeach />
			<NowTide />
			<NowWeather />
			<NowAstro />
		</Container>
	);
};