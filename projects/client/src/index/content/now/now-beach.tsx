import * as React from 'react';
import styled from 'styled-components';
import { SpacePanelGridGap } from '@/index/core/layout/layout-panel';
import { NowBeachAccess } from './now-beach-access';
import { NowBeachAccessHighlights } from './now-beach-highlights';
import { NowBeachUpcoming } from './now-beach-upcoming';
import { NowBeachVisual } from './now-beach-visual';
import { Section } from './section';

// const NowBeachHow_Title = styled.div`
// 	${fontStyles.stylized.capitalized};
// 	color: ${themeTokens.text.subtle};
// `;

// type NowBeachHowProps = {

// };

// const NowBeachHow: React.FC<NowBeachHowProps> = (props) => {
// 	const { } = props;

// 	return (
// 		<PanelPadded>
// 			<NowBeachHow_Title>How It Works &amp; Disclaimer</NowBeachHow_Title>
// 		</PanelPadded>
// 	);
// };

const NowBeach_Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${SpacePanelGridGap.value};
`;

export type NowBeachProps = {

};

/** */
export const NowBeach: React.FC<NowBeachProps> = (props) => {
	const { } = props;

	return (
		<Section>
			<NowBeach_Container>
				<NowBeachVisual />
				<NowBeachAccess />
				<NowBeachAccessHighlights />
				<NowBeachUpcoming />
				{/* <NowBeachHow /> */}
			</NowBeach_Container>
		</Section>
	);
};