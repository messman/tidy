import * as React from 'react';
import { Panel } from '@/index/core/layout/layout-panel';
import { PanelParagraph, SectionContainer, SectionHeading } from './about-shared';

export const AboutDataWarning: React.FC = () => {
	return (
		<SectionContainer>
			<SectionHeading>Data & Warnings</SectionHeading>
			<Panel>
				<PanelParagraph>
					This app uses publicly-available data from NOAA (National Oceanic and Atmospheric Administration)
					to present the best time(s) of day to go out on the beach, or "beach time".
					More specifically, this app checks traditional astronomical tide charts, newer observational forecast systems, and water
					level measurements from Portland, Maine, and interprets that data into a (hopefully) accurate water level
					for Wells. This water level is compared against a value for the height of the beach itself to learn how much
					beach is available/accessible.
				</PanelParagraph>
				<PanelParagraph>
					This app also calculates and presents the times for dusk and dawn.
					It can only be beach time if there is enough of both beach space and daylight.
				</PanelParagraph>
				<PanelParagraph>
					Weather conditions (from OpenWeather) are presented alongside the beach times, but "beach time" in this app
					does not explicitly account for weather.
				</PanelParagraph>
				<PanelParagraph>
					This data is unfortunately not guaranteed to be accurate; measuring and predicting water levels and daylight is hard.
					Much of the presented data is a prediction/forecast and not a fully-accurate recorded measurement.
				</PanelParagraph>
				<PanelParagraph>
					There are many other factors, such as air quality, storm advisories, states of emergency, etc.,
					that affect whether you should actually go on the beach.
					Do not rely solely on this app for activities that require accurate data for safety.
					Use this app and its data at your own risk;
					this app and its developer are not liable for your choices.
				</PanelParagraph>
				<PanelParagraph>
					Comply with all local laws, regulations, and advisories. Keep Wells clean.
				</PanelParagraph>
			</Panel>
		</SectionContainer>
	);
};