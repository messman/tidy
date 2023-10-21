import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponse } from '@/index/core/data/data';
import { SizedIcon } from '@/index/core/icon/icon';
import { SpinnerIcon } from '@/index/core/icon/icon-spinner';
import { SpacePanelGridGap } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { getTimeTwelveHourString } from '@/index/core/time/time';
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

	const { success, isLoading } = useBatchResponse();

	return (
		<Section>
			<NowBeach_Container>
				<LabelContainer>
					<div>Wells, Maine</div>
					<LabelRightContainer>
						{isLoading && <WhiteSpinnerIcon size="medium" type={SpinnerIcon} />}
						<span>as of {getTimeTwelveHourString(success!.meta.referenceTime)}</span>
					</LabelRightContainer>
				</LabelContainer>
				<NowBeachVisual />
				<NowBeachAccess />
				<NowBeachAccessHighlights />
				<NowBeachUpcoming />
				{/* <NowBeachHow /> */}
			</NowBeach_Container>
		</Section>
	);
};

const LabelContainer = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	${fontStyles.text.mediumHeavy};
	color: ${themeTokens.text.onBackground};
`;

const LabelRightContainer = styled.div`
	display: flex;
	align-items: center;
	gap: .5rem;
`;

const WhiteSpinnerIcon = styled(SizedIcon)`
	color: white;
`;