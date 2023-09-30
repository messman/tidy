import * as React from 'react';
import { Panel } from '@/index/core/layout/layout-panel';
import { PanelParagraph, SectionContainer, SectionHeading } from './about-shared';

export const AboutDataWarning: React.FC = () => {
	return (
		<SectionContainer>
			<SectionHeading>Data & Warnings</SectionHeading>
			<Panel>
				<PanelParagraph>
					This app attempts to tell you the best time to go on the beach by accounting for tides, sunlight, and some weather conditions.
					There may be more factors, such as air quality, storm advisories, etc., that would make it a bad idea to actually go on the beach.
					Use this app at your own risk. Comply with all local laws, regulations, and advisories. Keep Wells clean.
				</PanelParagraph>
				<PanelParagraph>
					This data is not guaranteed to be accurate. Much of the presented data is a prediction/forecast and not a fully-accurate recorded measurement.
					Do not rely on this data for any activities that require accurate data for safety.
				</PanelParagraph>
				<PanelParagraph>
					This app uses publicly-available data from NOAA (National Oceanic and Atmospheric Administration) and OpenWeather.
					Live observations are recorded from NOAA station 8419317 located on the Wells Town Dock on Harbor Road.
					Live water level observations may sometimes come from NOAA station 8418150 in Portland.
				</PanelParagraph>
				<PanelParagraph>
					Apparent sunrise and apparent sunset are calculated based on formulas from NOAA.
					Sunrise is defined here as the minute when the sun will appear to first break over the horizon.
					Sunset is defined here as the minute when the sun will no longer appear on the horizon.
					This app makes considerations for the amount of light that may exist before sunrise or after sunset.
				</PanelParagraph>
			</Panel>
		</SectionContainer>
	);
};