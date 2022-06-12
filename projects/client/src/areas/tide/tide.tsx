import * as React from 'react';
import { PanelPadding } from '@/core/layout/panel/panel';
import { PanelLoader } from '@/core/layout/panel/panel-loader';
import { Block } from '@/core/theme/box';
import { useBatchResponse } from '@/services/data/data';
import { TideChart } from './tide-chart';
import { TideHeader } from './tide-header';

export const Tide: React.FC = () => {
	const { success } = useBatchResponse();

	if (!success) {
		return <PanelLoader />;
	}

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