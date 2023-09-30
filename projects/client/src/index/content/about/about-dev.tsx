import { DateTime } from 'luxon';
import * as React from 'react';
import { Panel } from '@/index/core/layout/layout-panel';
import { OutLink } from '@/index/core/text/text-link';
import { DEFINE } from '@/index/define';
import { PanelParagraph, SectionContainer, SectionHeading } from './about-shared';

export const AboutDev: React.FC = () => {
	return (
		<SectionContainer>
			<SectionHeading>App Info</SectionHeading>
			<Panel>
				<PanelParagraph>
					Copyright &copy; Andrew Messier.
				</PanelParagraph>
				<PanelParagraph>
					This is version {DEFINE.buildVersion} ({DateTime.fromMillis(DEFINE.buildTime).toLocaleString()})
				</PanelParagraph>
				<PanelParagraph>
					Thanks to NOAA (National Oceanic &amp; Atmospheric Administration) and OpenWeather for free use of their data.
				</PanelParagraph>
				<PanelParagraph>
					To report a bug, send thanks, request a feature, or see how this application works, <OutLink title='Wells Beach Time on GitHub' href="https://github.com/messman/tidy">visit the project on GitHub</OutLink>.
				</PanelParagraph>
			</Panel>
		</SectionContainer>
	);
};