import { Duration } from 'luxon';
import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { TimeDurationTextUnit, TimeTextUnit } from '@/index/core/text/text-unit';

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: .5rem;
	padding: ${SpacePanelEdge.value};
	justify-content: space-between;
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const StatisticText = styled.div`
	${fontStyles.stylized.statistic}
`;

const UnitText = styled.div`
	${fontStyles.text.medium}
`;

const DescriptionText = styled.div`
	${fontStyles.text.small}
`;

const FlexPanel = styled(Panel)`
	display: flex;
	flex-direction: column;
`;

export const NowAstroDaylight: React.FC = () => {

	const { meta, now, getSolarEventById } = useBatchResponseSuccess();
	const { referenceTime } = meta;
	const { yesterday, today } = now.astro.sun;


	const rise = getSolarEventById(today.riseId);
	const set = getSolarEventById(today.setId);

	const midday = getSolarEventById(today.middayId);

	const yesterdayRise = getSolarEventById(yesterday.riseId);
	const yesterdaySet = getSolarEventById(yesterday.setId);

	const timeDiffSeconds = set.time.diff(rise.time, 'seconds').seconds - yesterdaySet.time.diff(yesterdayRise.time, 'seconds').seconds;

	const timeDiffDuration = Duration.fromObject({ seconds: Math.abs(Math.round(timeDiffSeconds)) }).shiftTo('minutes', 'seconds');
	const { minutes, seconds } = timeDiffDuration;
	const timeDiffDurationText =
		[
			minutes > 0 && `${minutes} minute${minutes > 1 ? 's' : ''}`,
			seconds > 0 && `${seconds} second${seconds > 1 ? 's' : ''}`
		]
			.filter(x => !!x)
			.join(' ');

	const timeDiffText = timeDiffSeconds === 0 ? '' : `About ${timeDiffDurationText} ${timeDiffSeconds > 0 ? 'longer' : 'shorter'} than yesterday. `;


	return (
		<FlexPanel title="Daylight">
			<Container>
				<TextContainer>
					<StatisticText><TimeDurationTextUnit startTime={rise.time} stopTime={set.time} /></StatisticText>
					<UnitText>total daylight</UnitText>
				</TextContainer>
				{<DescriptionText>{timeDiffText}Midday {referenceTime > midday.time ? 'was' : 'is'} at <TimeTextUnit dateTime={midday.time} />.</DescriptionText>}
			</Container>
		</FlexPanel>
	);
};