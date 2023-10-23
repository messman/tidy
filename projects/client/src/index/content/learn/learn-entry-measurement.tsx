import * as React from 'react';
import { Panel } from '@/index/core/layout/layout-panel';
import { OutLink } from '@/index/core/text/text-link';
import { AnswerParagraph, EntryContainer, QuestionText } from './learn-entry-shared';

export const learnMeasurementQuestion = 'How are tides measured?';

export const LearnEntryMeasurement: React.FC = () => {
	return (
		<EntryContainer>
			<QuestionText>{learnMeasurementQuestion}</QuestionText>
			<Panel>
				<AnswerParagraph>
					NOAA (National Oceanic and Atmospheric Administration) is responsible for the recording and sharing of both weather and tidal data in the United States.
				</AnswerParagraph>
				<AnswerParagraph>
					NOAA uses data recording stations to collect measurements and send them to servers for processing.
					A NOAA data recording station is set up at the Wells town pier, though at this time its data is not accessible.
					Instead, this app makes use of the <OutLink href='https://tidesandcurrents.noaa.gov/stationhome.html?id=8418150'>NOAA station in Portland, Maine</OutLink> to get
					measurements and scale them to what can be expected in Wells.
				</AnswerParagraph>
				<AnswerParagraph>
					NOAA also runs the <OutLink href='https://tidesandcurrents.noaa.gov/ofs/gomofs/gomofs.html'>Gulf of Maine Operational Forecast System</OutLink> (GoMOFS)
					to create advanced predictive models that can be more accurate than traditional tide charts.
					Traditional tide charts account only for the sun, the moon, and Earth's rotation;
					GoMOFS attempts to account for water level changes due to additional factors like wind, atmospheric pressure, and river flow.
				</AnswerParagraph>
				<AnswerParagraph>
					Many weather apps and services rely on the data NOAA provides, whether observational or predictive.
				</AnswerParagraph>
			</Panel>
		</EntryContainer>
	);
};