import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { PanelTitled, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { TideChart } from '../common/tide/tide-chart';
import { TideHeightTextUnit } from '../common/tide/tide-common';

const Statistic = styled.div`
	${fontStyles.stylized.statistic};
`;


export const NowTideLevels: React.FC = () => {
	const { tideExtrema, getTideExtremeById, now } = useBatchResponseSuccess();
	const { previousId, current, nextId } = now.tide;

	const extrema = [
		getTideExtremeById(previousId),
		getTideExtremeById(nextId),
	];

	return (
		<PanelTitled title="Water Level">
			<SpacePanelEdge.PadA>
				<Statistic><TideHeightTextUnit height={current.height} precision={1} /></Statistic>

			</SpacePanelEdge.PadA>
			<TideChart
				extrema={extrema}
				current={current}
				min={getTideExtremeById(tideExtrema.minId).height}
				max={getTideExtremeById(tideExtrema.maxId).height}
			/>
			<SpacePanelEdge.Block />
		</PanelTitled>
	);
};