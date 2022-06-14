import * as React from 'react';
import { ErrorGeneric } from '@/core/error/error-generic';
import { SpinnerIcon } from '@/core/icon/icon-spinner';
import { LabelText } from '@/core/label';
import { AppScreen, useAppNavigation } from '@/core/layout/app/app-navigation';
import { IconTitle, Line } from '@/core/layout/layout';
import { Panel } from '@/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/core/loader/batch-load-control';
import { fontStyleDeclarations, Paragraph } from '@/core/text';
import { TimeTextUnit } from '@/core/text-unit';
import { Block, Spacing } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { TideHeightTextUnit } from '@/core/tide/tide-common';
import { TideLevelIcon, unknownTide } from '@/core/tide/tide-level-icon';
import { getTideTitle } from '@/services/content/tide-utility';
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

	const title = getTideTitle(meta.referenceTime, measured, relativity);

	return (
		<>
			<HomeSummaryClickPadding onClick={onClick} isConnectedBelow={true}>
				<IconTitle
					iconRender={<TideLevelIcon tide={tide.measured} />}
				>
					{title}
				</IconTitle>
				<Block.Bat08 />
				<Paragraph>
					{next.isLow ? 'Low' : 'High'} tide is in {getDurationDescription(meta.referenceTime, next.time)}.
				</Paragraph>
			</HomeSummaryClickPadding>
			<Line />
			<InfoRowContainer>
				<LabelText size='medium'>Current height</LabelText>
				<RowValue><TideHeightTextUnit height={measured.height} precision={1} /></RowValue>
			</InfoRowContainer>
			<Line />
			<InfoRowContainer>
				<LabelText size='medium'>Next tide</LabelText>
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
	${fontStyleDeclarations.small};
	color: ${p => p.theme.textSubtle};
`;


const TideSummaryErrorLoad: React.FC = () => {
	const { error } = useBatchResponse();
	const { setScreen } = useAppNavigation();

	function onClick() {
		setScreen(AppScreen.c_tide);
	}

	const title = (
		<IconTitle
			iconRender={<TideLevelIcon tide={unknownTide} />}
		>
			Tides
		</IconTitle>
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
				<Paragraph>Loading...</Paragraph>
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

