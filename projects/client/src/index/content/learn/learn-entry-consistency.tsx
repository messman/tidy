import * as React from 'react';
import { Panel } from '@/index/core/layout/layout-panel';
import { AnswerParagraph, EntryContainer, QuestionText } from './learn-entry-shared';

export const learnConsistencyQuestion = 'Why do high/low tide levels vary?';

export const LearnEntryConsistency: React.FC = () => {
	return (
		<EntryContainer>
			<QuestionText>{learnConsistencyQuestion}</QuestionText>
			<Panel>
				<AnswerParagraph>
					The relationship between the moon's position, the sun's position, and a location on Earth plays a huge role in how the height of a high tide or low tide changes over time.
					The sun affects the tides just like the moon, but only with about half the power.
				</AnswerParagraph>
				<AnswerParagraph>
					When the sun and moon align relative to Earth (at a full moon or new moon), their tidal bulges will add together.
					This added power will create higher high tides and lower low tides. When the sun and moon do not align with Earth, tidal effects are more muted.
				</AnswerParagraph>
				<AnswerParagraph>
					Even the elliptic shape of Earth's orbit around the sun and the moon's orbit around Earth can cause tidal differences.
					In January, the Earth is physically closer to the sun (perihelion) and experiences more of the sun's gravitational power;
					similarly, once a month, the moon is closer to the Earth than it is any other time (perigee).
					A "king tide" (not a scientific term) can occur when the Earth is physically closer to both the sun and the moon
					at the same time and also experiencing a full or new moon. These king tides typically cause the largest tidal range of the year.
				</AnswerParagraph>
				<AnswerParagraph>
					Of course, weather can modify the final effect of these astronomical events.
				</AnswerParagraph>
			</Panel>
		</EntryContainer>
	);
};
