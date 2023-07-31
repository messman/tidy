import * as React from 'react';
import { PanelPadding } from '@/index/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/index/core/loader/batch-load-control';
import { DefaultErrorLoad } from '@/index/core/loader/loader';
import { ConditionsAstro } from './conditions-astro';
import { ConditionsBasics } from './conditions-basics';
import { ConditionsHeader } from './conditions-header';
import { ConditionsHourly } from './conditions-hourly';

const ConditionsSuccess: React.FC = () => {
	return (
		<>
			<PanelPadding>
				<ConditionsHeader />
				<ConditionsBasics />
			</PanelPadding>
			<ConditionsHourly />
			<PanelPadding>
				<ConditionsAstro />
			</PanelPadding>
		</>
	);
};

export const Conditions = wrapForBatchLoad(DefaultErrorLoad, ConditionsSuccess);