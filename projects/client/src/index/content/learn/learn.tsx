import * as React from 'react';
import styled from 'styled-components';
import { Swipe } from '@/index/app/layout/layout-swipe';
import { Panel, PanelPadding, SpacePanelGridGap, SpacePanelGridListPadding, SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { getLayoutFromWidth, LayoutBreakpointRem } from '@/index/core/layout/window-layout';
import { OutLink } from '@/index/core/text/text-link';
import { useWindowMediaLayout } from '@messman/react-common';
import { mapNumberEnumValue } from '@wbtdevlocal/iso';
import { learnCausesQuestion, LearnEntryCauses } from './learn-entry-causes';
import { learnConsistencyQuestion, LearnEntryConsistency } from './learn-entry-consistency';
import { LearnEntryFrequency, learnFrequencyQuestion } from './learn-entry-frequency';
import { LearnEntryMeasurement, learnMeasurementQuestion } from './learn-entry-measurement';
import { LearnQuestion } from './learn-question';

enum QuestionKey {
	cause,
	consistency,
	frequency,
	measurement
}

const questionKeyAnswers = {
	cause: LearnEntryCauses,
	consistency: LearnEntryConsistency,
	frequency: LearnEntryFrequency,
	measurement: LearnEntryMeasurement
} as const satisfies Record<keyof typeof QuestionKey, React.FC>;

export const Learn: React.FC = () => {

	const { widthBreakpoint } = useWindowMediaLayout();
	const { isCompact, isWide } = getLayoutFromWidth(widthBreakpoint);

	const refCompactList = React.useRef<HTMLDivElement>(null!);

	const [isCompactSwipeActive, setIsCompactSwipeActive] = React.useState(false);
	const [questionKey, setQuestionKey] = React.useState<QuestionKey>(QuestionKey.cause);

	function selectQuestion(key: QuestionKey): void {
		setQuestionKey(key);
		setIsCompactSwipeActive(true);
	}

	if (isWide) {
		return (
			<CenteringContainer>
				<WideContainer>
					<LearnMore />
					<WideColumnsContainer>
						<WideColumn>
							<LearnEntryCauses />
							<LearnEntryConsistency />
						</WideColumn>
						<WideColumn>
							<LearnEntryFrequency />
							<LearnEntryMeasurement />
						</WideColumn>
					</WideColumnsContainer>
				</WideContainer>
			</CenteringContainer>
		);
	}

	if (!isCompact) {
		return (
			<CenteringContainer>
				<RegularContainer>
					<LearnMore />
					<LearnEntryCauses />
					<LearnEntryFrequency />
					<LearnEntryConsistency />
					<LearnEntryMeasurement />
				</RegularContainer>
			</CenteringContainer>
		);
	}

	const AnswerComponent = mapNumberEnumValue(QuestionKey, questionKeyAnswers, questionKey);

	return (
		<CompactContainer>
			<CompactList ref={refCompactList}>
				<LearnQuestion
					onClick={() => selectQuestion(QuestionKey.cause)}
				>
					{learnCausesQuestion}
				</LearnQuestion>
				<LearnQuestion
					onClick={() => selectQuestion(QuestionKey.frequency)}
				>
					{learnFrequencyQuestion}
				</LearnQuestion>
				<LearnQuestion
					onClick={() => selectQuestion(QuestionKey.consistency)}
				>
					{learnConsistencyQuestion}
				</LearnQuestion>
				<LearnQuestion
					onClick={() => selectQuestion(QuestionKey.measurement)}
				>
					{learnMeasurementQuestion}
				</LearnQuestion>
				<LearnMore />
			</CompactList>
			<Swipe
				title='Learn'
				isActive={isCompactSwipeActive}
				onSetInactive={() => { setIsCompactSwipeActive(false); }}
			>
				<CompactContent>
					<AnswerComponent key={questionKey} />
				</CompactContent>
			</Swipe>
		</CompactContainer>
	);
};

const LearnMore: React.FC = () => {
	return (
		<Panel>
			<PanelPadding>
				Check
				out <OutLink title='NOAA Tides Education' href="https://oceanservice.noaa.gov/education/tutorial_tides/welcome.html">NOAA's resources on how tides work</OutLink> or
				the <OutLink title='Gulf of Maine Operational Forecast System' href='https://tidesandcurrents.noaa.gov/ofs/gomofs/gomofs.html'>Gulf of Maine Operational Forecast System</OutLink> to
				learn more.
			</PanelPadding>
		</Panel>
	);
};

const CenteringContainer = styled.div`
	width: 100%;
	height: fit-content;
	display: flex;
	justify-content: center;
	overflow-y: auto;;
`;

const WideContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: fit-content;
	max-width: ${LayoutBreakpointRem.e50}rem;
	padding: ${SpacePanelGridPadding.value};
	gap: 3rem;
`;

const WideColumnsContainer = styled.div`
	display: flex;
	justify-content: center;
	gap: 3rem;
`;

const WideColumn = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 3rem;
`;

const RegularContainer = styled.div`
	height: fit-content;
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: ${LayoutBreakpointRem.c30}rem;
	padding: ${SpacePanelGridPadding.value};
	gap: 3rem;
`;

const CompactContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
`;

const CompactList = styled.div`
	overflow-y: auto;
	padding: ${SpacePanelGridPadding.value} ${SpacePanelGridListPadding.value};
	display: flex;
	flex-direction: column;
	gap: ${SpacePanelGridGap.value};
`;

const CompactContent = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: ${SpacePanelGridPadding.value};
`;