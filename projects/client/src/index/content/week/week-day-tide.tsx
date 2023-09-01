import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { getDateLong } from '@/index/core/time/time';
import { AstroLunarPhase, BeachTimeDay, mapNumberEnumValue } from '@wbtdevlocal/iso';
import { LunarPhaseIcon } from '../common/astro/lunar-phase-icon';
import { TideChart } from '../common/tide/tide-chart';

const PhaseContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: end;
	gap: .5rem;
	padding: 0 ${SpacePanelEdge.value};
`;

const PhaseText = styled.div`
	${fontStyles.text.medium};
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: .25rem;
	padding: ${SpacePanelEdge.value} 0;
`;

const phaseText: Record<keyof typeof AstroLunarPhase, string> = {
	a_new: 'New Moon',
	b_waxingCrescent: 'Waxing Crescent',
	c_firstQuarter: 'First Quarter',
	d_waxingGibbous: 'Waxing Gibbous',
	e_full: 'Full Moon',
	f_waningGibbous: 'Waning Gibbous',
	g_thirdQuarter: 'Third Quarter',
	h_waningCrescent: 'Waning Crescent'
};

export interface WeekDayTideProps {
	day: BeachTimeDay;
	isTop: boolean;
	isBottom: boolean;
};

export const WeekDayTide: React.FC<WeekDayTideProps> = (props) => {
	const { day, isTop, isBottom } = props;
	const { meta, now, getTideExtremeById, tideExtrema } = useBatchResponseSuccess();

	const current = day.day.hasSame(meta.referenceTime, 'day') ? now.tide.current : undefined;
	now.tide.current;

	const extrema = day.tides.extremaIds.map((id) => {
		return getTideExtremeById(id);
	});

	return (
		<Panel
			title={isTop ? getDateLong(day.day, meta.referenceTime) : undefined}
			croppedTop={!isTop}
			croppedBottom={!isBottom}
		>
			<Container>

				<PhaseContainer>
					<PhaseText>{mapNumberEnumValue(AstroLunarPhase, phaseText, day.astro.moon)}</PhaseText>
					<LunarPhaseIcon phase={day.astro.moon} />
				</PhaseContainer>
				<TideChart
					current={current}
					extrema={extrema}
					min={getTideExtremeById(tideExtrema.minId).height}
					max={getTideExtremeById(tideExtrema.maxId).height}
				/>
			</Container>
		</Panel>
	);
};