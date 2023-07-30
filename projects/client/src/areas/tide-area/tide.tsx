import * as React from 'react';
import { Block } from '@/core/layout';
import { PanelPadding } from '@/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/core/loader/batch-load-control';
import { DefaultErrorLoad } from '@/core/loader/loader';
import { TideChart } from './tide-chart';
import { TideHeader } from './tide-header';

const TideSuccess: React.FC = () => {
	return (
		<>
			<PanelPadding>
				<TideHeader />
			</PanelPadding>
			<Block.Dog16 />
			<TideChart />
			<Block.Dog16 />
		</>
	);
};

export const Tide = wrapForBatchLoad(DefaultErrorLoad, TideSuccess);