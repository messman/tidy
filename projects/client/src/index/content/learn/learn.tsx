import * as React from 'react';
import styled from 'styled-components';
import { Panel, PanelPadding, SpacePanelGridListPadding } from '@/index/core/layout/layout-panel';
import { OutLink } from '@/index/core/text/text-link';
import { LearnEntryCauses } from './learn-entry-causes';
import { LearnEntryConsistency } from './learn-entry-consistency';
import { LearnEntryFrequency } from './learn-entry-frequency';
import { LearnEntryMeasurement } from './learn-entry-measurement';

export const Learn: React.FC = () => {
	return (
		<>
			<WideContainer>
				<WideColumn>
					<LearnEntryCauses />
					<LearnEntryConsistency />
				</WideColumn>
				<WideColumn>
					<LearnEntryFrequency />
					<LearnEntryMeasurement />
				</WideColumn>
			</WideContainer>
			<Panel>
				<PanelPadding>
					To learn more, check
					out <OutLink title='NOAA Tides Education' href="https://oceanservice.noaa.gov/education/tutorial_tides/welcome.html">NOAA's excellent resources on how tides work</OutLink> or
					the <OutLink title='Gulf of Maine Operational Forecast System' href='https://tidesandcurrents.noaa.gov/ofs/gomofs/gomofs.html'>Gulf of Maine Operational Forecast System</OutLink>.
				</PanelPadding>
			</Panel>
		</>
	);
};

const WideContainer = styled.div`
	display: flex;
	justify-content: center;
	gap: 3rem;
	padding: ${SpacePanelGridListPadding.value};
	overflow: auto;
`;

const WideColumn = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 3rem;
	max-width: 22rem;
`;