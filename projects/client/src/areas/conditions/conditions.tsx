import * as React from 'react';
import { Block, SubtleLine } from '@/core/layout';
import { PanelPadding } from '@/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/core/loader/batch-load-control';
import { DefaultErrorLoad } from '@/core/loader/loader';
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
			<SubtleLine />
			<ConditionsHourly />
			<SubtleLine />
			<ConditionsMore />
			<SubtleLine />
			<Block.Bat08 />
			<PanelPadding>
				<ConditionsAstro />
			</PanelPadding>
		</>
	);
};

export const Conditions = wrapForBatchLoad(DefaultErrorLoad, ConditionsSuccess);