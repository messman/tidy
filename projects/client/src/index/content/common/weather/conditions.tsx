import * as React from 'react';
import { wrapForBatchLoad } from '@/index/core/data/batch-load-control';
import { DefaultErrorLoad } from '@/index/core/data/loader';
import { PanelPadding } from '@/index/core/layout/panel';
import { ConditionsAstro } from '../astro/conditions-astro';
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