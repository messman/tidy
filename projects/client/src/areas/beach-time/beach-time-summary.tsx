import * as React from 'react';
import { ErrorGeneric } from '@/core/error/error-generic';
import { Icon } from '@/core/icon/icon';
import { SpinnerIcon } from '@/core/icon/icon-spinner';
import { AppScreen, useAppNavigation } from '@/core/layout/app/app-navigation';
import { Panel } from '@/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/core/loader/batch-load-control';
import { fontStyleDeclarations, Paragraph } from '@/core/text';
import { styled } from '@/core/theme/styled';
import { BeachTimeStatus, beachTimeStatusTextInfoFunc, getBeachTimeStatus } from '@/services/content/beach-time-utility';
import { useBatchResponse } from '@/services/data/data';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';
import { HomeSummaryClickPadding, HomeSummarySpinnerIcon } from '../home/home-summary-shared';

const BeachTimeSummarySuccess: React.FC = () => {
	const { meta, beach } = useBatchResponse().success!;

	const beachTimeStatus = getBeachTimeStatus(beach, meta.referenceTime);
	const textInfoFunc = iso.mapEnumValue(BeachTimeStatus, beachTimeStatusTextInfoFunc, beachTimeStatus);
	const { title, description } = textInfoFunc(beach, meta.referenceTime);

	return (
		<RowContainer>
			<TextContainer>
				<Title>{title}</Title>
				<Paragraph>{description}</Paragraph>
			</TextContainer>
			<ExpressionIcon type={icons.expressionHappy} />
		</RowContainer>
	);
};

const ExpressionIcon = styled(Icon)`
	width: 3.5rem;
	height: 3.5rem;
`;

const BeachTimeSummaryErrorLoad: React.FC = () => {
	const { error } = useBatchResponse();

	if (error) {
		return (
			<TextContainer>
				<Title>Beach Time</Title>
				<ErrorGeneric />
			</TextContainer>
		);
	}

	return (
		<RowContainer>
			<TextContainer>
				<Title>Beach Time</Title>
				<Paragraph>Loading...</Paragraph>
			</TextContainer>
			<HomeSummarySpinnerIcon type={SpinnerIcon} />
		</RowContainer>
	);
};

const Wrapped = wrapForBatchLoad(BeachTimeSummaryErrorLoad, BeachTimeSummarySuccess);

export const BeachTimeSummary: React.FC = () => {
	const { setScreen } = useAppNavigation();

	function onClick() {
		setScreen(AppScreen.b_beachTime);
	}

	return (
		<Panel>
			<HomeSummaryClickPadding onClick={onClick}>
				<Wrapped />
			</HomeSummaryClickPadding>
		</Panel>
	);
};

const Title = styled.div`
	${fontStyleDeclarations.heading4};
`;

const RowContainer = styled.div`
	display: flex;
	align-items: center;
`;

const TextContainer = styled.div`
	flex: 1;
`;

