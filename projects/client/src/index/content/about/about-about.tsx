import * as React from 'react';
import { Panel } from '@/index/core/layout/layout-panel';
import { PanelParagraph, SectionContainer, SectionHeading } from './about-shared';

export const AboutAbout: React.FC = () => {
	return (
		<SectionContainer>
			<SectionHeading>Why Does This App Exist?</SectionHeading>
			<Panel>
				<PanelParagraph>
					This app is for use by residents and visitors to Wells, Maine.
					Its primary goal is to inform beachgoers about the right time to go out onto the beaches of Wells that are often covered during part of the tidal cycle.
					As locals, my family and I have witnessed many a traveler make a long journey to the beach just to see that they'll have to wait quite awhile before they can enjoy the sand.
				</PanelParagraph>
				<PanelParagraph>
					This project is a labor of love and is dedicated to residents Mark & Dawna Messier.
					This project — and its developer — would not exist without them.
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