import * as React from 'react';
import { Panel } from '@/index/core/layout/layout-panel';
import { AnswerParagraph, EntryContainer, QuestionText } from './learn-entry-shared';

export const learnCausesQuestion = 'What causes the tides?';

export const LearnEntryCauses: React.FC = () => {
	return (
		<EntryContainer>
			<QuestionText>{learnCausesQuestion}</QuestionText>
			<Panel>
				<AnswerParagraph>
					The primary source of the tides is the moon's gravitational pull. The power of this gravitational pull affects areas differently as the Earth rotates.
				</AnswerParagraph>
				<AnswerParagraph>
					As the moon and Earth move, the moon's gravitational pull causes Earth and its oceans to bulge out directly
					toward the moon and directly away from the moon. These two bulges are the high tides,
					and areas far from these bulges will be the low tides.
				</AnswerParagraph>
				<AnswerParagraph>
					The strength and timing of tides are also controlled by the sun's gravitational pull, the moon's orbit around Earth, Earth's tilt,
					weather, geography, and more. These many factors can make tidal predictions complicated.
				</AnswerParagraph>
			</Panel>
		</EntryContainer>
	);
};