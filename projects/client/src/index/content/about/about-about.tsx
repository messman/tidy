import * as React from 'react';
import { Panel } from '@/index/core/layout/layout-panel';
import { constant } from '@wbtdevlocal/iso';
import { TideHeightTextUnit } from '../common/tide/tide-common';
import { PanelParagraph, SectionContainer, SectionHeading } from './about-shared';

export const AboutAbout: React.FC = () => {
	return (
		<SectionContainer>
			<SectionHeading>Why Does This App Exist?</SectionHeading>
			<Panel>
				<PanelParagraph>
					Parts of the Wells Beach area are inaccessible at a certain tidal height
					(<TideHeightTextUnit height={constant.beachAccess.bestGuessBeachHeight} /> for this app).
					As locals, my family and I have witnessed many a tourist make a long walk from their rental to the beach, with chairs and games in tow,
					just to see that they'll have to wait quite awhile before they can spread out on the sand.
				</PanelParagraph>
				<PanelParagraph>
					This app is for use by residents and visitors to Wells, Maine to inform beachgoers about the right time
					to go out onto the beaches of Wells.
				</PanelParagraph>
				<PanelParagraph>
					This app is a labor of love and is dedicated to residents Mark & Dawna Messier.
					This app — and its developer — would not exist without them.
				</PanelParagraph>
				<PanelParagraph>
					Please do your part to keep Wells a clean and beautiful place.
					Properly dispose of all waste and ensure trash cannot be blown or washed into the marsh or ocean.
					Do not litter, and do not pollute.
					Drive slowly and carefully, keeping an eye out for children and wild animals.
					Do not walk on the marsh or otherwise disturb the ecosystem. Thank you!
				</PanelParagraph>
			</Panel>
		</SectionContainer>
	);
};