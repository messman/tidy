import * as React from 'react';
import styled from 'styled-components';
import { ErrorGeneric } from '@/core/error/error-generic';
import { SpinnerIcon } from '@/core/icon/icon-spinner';
import { Block, DistinctLine } from '@/core/layout';
import { AppScreen, useAppNavigation } from '@/core/layout/app/app-navigation';
import { Panel } from '@/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/core/loader/batch-load-control';
import { Spacing } from '@/core/primitive/primitive-design';
import { fontStyles, MediumBodyText, MediumLabelText, TimeTextUnit } from '@/core/text';
import { themeTokens } from '@/core/theme';
import { TideHeightTextUnit } from '@/core/tide/tide-common';
import { useBatchResponse } from '@/services/data/data';
import { getDurationDescription } from '@/services/time';
import { HomeSummaryClickPadding, HomeSummarySpinnerIcon } from '../home/home-summary-shared';

const TideSummarySuccess: React.FC = () => {
	const { meta, tide } = useBatchResponse().success!;
	const { setScreen } = useAppNavigation();

	function onClick() {
		setScreen(AppScreen.c_tide);
	}
	const { measured, relativity } = tide;
	const { next } = relativity;

	// const title = getTideTitle(meta.referenceTime, measured, relativity);

	return (
		<>
			<HomeSummaryClickPadding onClick={onClick} isConnectedBelow={true}>
				<Block.Bat08 />
				<MediumBodyText>
					{next.isLow ? 'Low' : 'High'} tide is in {getDurationDescription(meta.referenceTime, next.time)}.
				</MediumBodyText>
			</HomeSummaryClickPadding>
			<DistinctLine />
			<InfoRowContainer>
				<MediumLabelText>Current height</MediumLabelText>
				<RowValue><TideHeightTextUnit height={measured.height} precision={1} /></RowValue>
			</InfoRowContainer>
			<DistinctLine />
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
	const { setScreen } = useAppNavigation();

	function onClick() {
		setScreen(AppScreen.c_tide);
	}

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
			<HomeSummaryClickPadding onClick={onClick}>
				{render}
			</HomeSummaryClickPadding>
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
			<HomeSummarySpinnerIcon type={SpinnerIcon} />
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