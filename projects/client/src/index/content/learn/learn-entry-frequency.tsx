import * as React from 'react';
import { Panel } from '@/index/core/layout/layout-panel';
import { AnswerParagraph, EntryContainer, QuestionText } from './learn-entry-shared';

export const LearnEntryFrequency: React.FC = () => {
	return (
		<EntryContainer>
			<QuestionText>How often do tides occur?</QuestionText>
			<Panel>
				<AnswerParagraph>
					Since the moon's position and pull is largely responsible for the tides, the time the moon takes to move through the sky is important to know in predicting tides.
					It takes about 24 hours and 50 minutes for the moon to return to the same meridian (longitude line) in the sky as Earth rotates (also known as the moon's "apparent orbit" from Earth).
				</AnswerParagraph>
				<AnswerParagraph>
					During this "tidal day", many coastal locations on earth such as Wells will experience two high tides and two low tides &mdash;
					two times where the ocean around Wells bulges toward or away from the moon, and two times where water flows away.
					The time between two high tides and the time between two low tides should be half a tidal day: roughly 12 hours and 25 minutes.
				</AnswerParagraph>
				<AnswerParagraph>
					This timing, however, is not exact. As discussed before, many other factors can influence the tides. These factors can change both the height and timing of high and low tides.
				</AnswerParagraph>
				<AnswerParagraph>
					Earth's geography can even cause some coastal locations to regularly experience fewer than two tides a day or to experience irregular high and low tide times.
				</AnswerParagraph>
			</Panel>
		</EntryContainer>
	);
};