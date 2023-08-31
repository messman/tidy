import * as React from 'react';
import { NowTideLevels } from './now-tide-levels';
import { Section } from './section';

export const NowTide: React.FC = () => {
	return (
		<Section title="Tides">
			<NowTideLevels />
		</Section>
	);
};