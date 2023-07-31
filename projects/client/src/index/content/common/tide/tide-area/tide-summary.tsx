import * as React from 'react';
import styled from 'styled-components';
import { ErrorGeneric } from '@/index/core/error/error-generic';
import { Block } from '@/index/core/layout/layout-shared';
import { Panel } from '@/index/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/index/core/loader/batch-load-control';
import { Spacing } from '@/index/core/primitive/primitive-design';
import { MediumLabelText } from '@/index/core/text/text-label';
import { fontStyles, MediumBodyText } from '@/index/core/text/text-shared';
import { TimeTextUnit } from '@/index/core/text/text-unit';
import { themeTokens } from '@/index/core/theme/theme-root';
import { useBatchResponse } from '@/services/data/data';
import { getDurationDescription } from '@/services/time';
import { TideHeightTextUnit } from '../tide-common';

const TideSummarySuccess: React.FC = () => {
	const { meta, tide } = useBatchResponse().success!;
	const { measured, relativity } = tide;
	const { next } = relativity;

	// const title = getTideTitle(meta.referenceTime, measured, relativity);

	return (
		<>
			<Block.Bat08 />
			<MediumBodyText>
				{next.isLow ? 'Low' : 'High'} tide is in {getDurationDescription(meta.referenceTime, next.time)}.
			</MediumBodyText>
			<InfoRowContainer>
				<MediumLabelText>Current height</MediumLabelText>
				<RowValue><TideHeightTextUnit height={measured.height} precision={1} /></RowValue>
			</InfoRowContainer>
			<InfoRowContainer>
				<MediumLabelText>Next tide</MediumLabelText>
				<RowValue><TimeTextUnit dateTime={next.time} /></RowValue>
				<RowValue><TideHeightTextUnit height={next.height} precision={1} /></RowValue>
			</InfoRowContainer>
		</>
	);
};

const InfoRowContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: ${Spacing.bat08} ${Spacing.dog16};
`;

const RowValue = styled.div`
	${fontStyles.text.small};
	color: ${themeTokens.text.subtle};
`;


const TideSummaryErrorLoad: React.FC = () => {
	const { error } = useBatchResponse();


	const title = (
		// <IconTitle
		// 	iconRender={<TideLevelIcon tide={unknownTide} />}
		// >
		// 	Tides
		// </IconTitle>
		null
	);

	function wrap(render: JSX.Element) {
		return (
			<>{render}</>
		);
	}

	if (error) {
		return wrap(
			<TextContainer>
				{title}
				<Block.Bat08 />
				<ErrorGeneric />
			</TextContainer>
		);
	}

	return wrap(
		<RowContainer>
			<TextContainer>
				{title}
				<Block.Bat08 />
				<MediumBodyText>Loading...</MediumBodyText>
			</TextContainer>
		</RowContainer>
	);
};

const Wrapped = wrapForBatchLoad(TideSummaryErrorLoad, TideSummarySuccess);

export const TideSummary: React.FC = () => {
	return (
		<Panel>
			<Wrapped />
		</Panel>
	);
};

const RowContainer = styled.div`
	display: flex;
	align-items: center;
`;

const TextContainer = styled.div`
	flex: 1;
`;



// export interface IconTitleProps {
// 	iconRender: JSX.Element;
// 	children: React.ReactNode;
// }

// export const IconTitle: React.FC<IconTitleProps> = (props) => {
// 	const { iconRender, children } = props;
// 	return (
// 		<TitleContainer>
// 			{iconRender}
// 			<Block.Bat08 />
// 			<TitleText>
// 				{children}
// 			</TitleText>
// 		</TitleContainer>
// 	);
// };

// const TitleContainer = styled.div`
// 	display: flex;
// 	align-items: center;
// `;

// const TitleText = styled.div`
// 	${fontStyles.heading5};
// `;