import * as React from 'react';
import { Panel } from '@/index/core/layout/layout-panel';
import { AnswerParagraph, EntryContainer, QuestionText } from './learn-entry-shared';

export const LearnEntryMeasurement: React.FC = () => {
	return (
		<EntryContainer>
			<QuestionText>How are tides measured?</QuestionText>
			<Panel>
				<AnswerParagraph>
					NOAA (National Oceanic and Atmospheric Administration) is responsible for the recording and sharing of both weather and tidal data in the United States.
				</AnswerParagraph>
				<AnswerParagraph>
					NOAA uses data recording stations to collect measurements and send them to servers for processing. A NOAA data recording station is set up at the town pier.
				</AnswerParagraph>
				<AnswerParagraph>
					Many weather apps and services rely on the data NOAA provides.
				</AnswerParagraph>
			</Panel>
		</EntryContainer>
	);
};