import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { AstroLunarPhase, mapNumberEnumValue } from '@wbtdevlocal/iso';
import { LunarPhaseIcon, lunarPhaseText } from '../common/astro/lunar-phase-icon';

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: .75rem;
	padding: ${SpacePanelEdge.value};
	justify-content: space-between;
`;

const RowContainer = styled.div`
	display: flex;
	gap: .5rem;
`;

const BarTextContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const StatisticText = styled.div`
	${fontStyles.stylized.statistic}
`;

const DescriptionText = styled.div`
	${fontStyles.text.small};
`;

const FlexPanel = styled(Panel)`
	display: flex;
	flex-direction: column;
`;

const LargeLunarPhaseIcon = styled(LunarPhaseIcon)`
	width: 3.5rem;
	height: 3.5rem;
`;

export const NowAstroLunarPhase: React.FC = () => {

	const { now, meta } = useBatchResponseSuccess();
	const { phase, isIncreasedEffect, future } = now.astro.moon;

	const futureDays = Math.round(future.time.endOf('day').diff(meta.referenceTime.startOf('day'), 'days').days);
	const futureDaysText = futureDays === 1 ? 'tomorrow' : `in ${futureDays.toString()} ${futureDays > 1 ? 'days' : 'day'}.`;

	return (
		<FlexPanel title="Lunar Phase">
			<Container>
				<RowContainer>
					<LargeLunarPhaseIcon phase={phase} />
					<BarTextContainer>
						<StatisticText>{mapNumberEnumValue(AstroLunarPhase, lunarPhaseText, phase)}</StatisticText>
					</BarTextContainer>
				</RowContainer>
				<DescriptionText>
					{isIncreasedEffect && 'The moon will have an increased effect on the tides. '}
					{mapNumberEnumValue(AstroLunarPhase, lunarPhaseText, future.phase)} {future.isStart ? 'begins' : 'ends'} {futureDaysText}
				</DescriptionText>
			</Container>
		</FlexPanel>
	);
};