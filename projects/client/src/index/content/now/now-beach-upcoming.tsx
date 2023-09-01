import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Panel, SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { getRelativeDayText } from '@/index/core/time/time';
import { BeachTimeDay } from '@wbtdevlocal/iso';
import { BeachChart } from '../common/beach/chart/chart';

const DayContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: .25rem;
`;

const DayTitle = styled.div`
	${fontStyles.stylized.emphasis}
`;

interface BeachTimeDayProps {
	day: BeachTimeDay;
};

const BeachTimeDay: React.FC<BeachTimeDayProps> = (props) => {
	const { day } = props;
	const { meta } = useBatchResponseSuccess();

	const relativeDayText = getRelativeDayText(day.day, meta.referenceTime);
	const titleText = relativeDayText || day.day.weekdayLong;

	return (
		<DayContainer>
			<DayTitle>{titleText}</DayTitle>
			<BeachChart day={day} />
		</DayContainer>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: ${SpacePanelEdge.value};
`;

export type NowBeachUpcomingProps = {

};

export const NowBeachUpcoming: React.FC<NowBeachUpcomingProps> = (props) => {
	const { } = props;
	const { week } = useBatchResponseSuccess();

	const [today, tomorrow] = week.days;

	return (
		<Panel title="Upcoming Beach Times">
			<Container>
				<BeachTimeDay day={today} />
				<BeachTimeDay day={tomorrow} />
			</Container>
		</Panel>
	);
};