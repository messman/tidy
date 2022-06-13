import * as React from 'react';
import { PanelPadding } from '@/core/layout/panel/panel';
import { PanelLoader } from '@/core/layout/panel/panel-loader';
import { Block } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { useBatchResponse } from '@/services/data/data';
import { ConditionsAstro } from './conditions-astro';
import { ConditionsBasics } from './conditions-basics';
import { ConditionsHeader } from './conditions-header';
import { ConditionsHourly } from './conditions-hourly';
import { ConditionsMore } from './conditions-more';

export const Conditions: React.FC = () => {
	const { success } = useBatchResponse();

	if (!success) {
		return <PanelLoader />;
	}

	return (
		<>
			<PanelPadding>
				<ConditionsHeader />
				<Block.Elf24 />
				<ConditionsBasics />
			</PanelPadding>
			<Block.Bat08 />
			<Line />
			<ConditionsHourly />
			<Line />
			<ConditionsMore />
			<Line />
			<Block.Bat08 />
			<PanelPadding>
				<ConditionsAstro />
			</PanelPadding>
		</>
	);
};

const Line = styled.div`
	width: 100%;
	height: 1px;
	background-color: ${p => p.theme.outlineDistinct};
`;