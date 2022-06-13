import * as React from 'react';
import { PanelPadding } from '@/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/core/loader/batch-load-control';
import { DefaultErrorLoad } from '@/core/loader/loader';
import { Block } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { ConditionsAstro } from './conditions-astro';
import { ConditionsBasics } from './conditions-basics';
import { ConditionsHeader } from './conditions-header';
import { ConditionsHourly } from './conditions-hourly';
import { ConditionsMore } from './conditions-more';

const ConditionsSuccess: React.FC = () => {
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

export const Conditions = wrapForBatchLoad(DefaultErrorLoad, ConditionsSuccess);

const Line = styled.div`
	width: 100%;
	height: 1px;
	background-color: ${p => p.theme.outlineDistinct};
`;