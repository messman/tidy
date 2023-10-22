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
					This is version {DEFINE.buildVersion} (from {DateTime.fromMillis(DEFINE.buildTime).toLocaleString()}).
				</PanelParagraph>
				<PanelParagraph>
					Thanks to NOAA (National Oceanic &amp; Atmospheric Administration) and OpenWeather for free use of their data.
					Live water level observations come
					from <OutLink href='https://tidesandcurrents.noaa.gov/stationhome.html?id=8418150'>NOAA station 8418150 in Portland, Maine</OutLink>;
					water level predictions come from NOAA's astronomical tide charts and from the Gulf of Maine Observational Forecast System.
				</PanelParagraph>
				<PanelParagraph>
					To report a bug, send thanks, request a feature, or see how this application works, <OutLink title='Wells Beach Time on GitHub' href="https://github.com/messman/tidy">visit the project on GitHub</OutLink>.
				</PanelParagraph>
			</Panel>
		</SectionContainer>
	);
};