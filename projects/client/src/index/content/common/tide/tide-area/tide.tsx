import * as React from 'react';
import { wrapForBatchLoad } from '@/index/core/data/batch-load-control';
import { DefaultErrorLoad } from '@/index/core/data/loader';
import { Block } from '@/index/core/layout/layout-shared';
import { PanelPadding } from '@/index/core/layout/panel';
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