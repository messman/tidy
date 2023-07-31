import * as React from 'react';
import { Block } from '@/index/core/layout/layout-shared';
import { PanelPadding } from '@/index/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/index/core/loader/batch-load-control';
import { DefaultErrorLoad } from '@/index/core/loader/loader';
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