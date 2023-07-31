import * as React from 'react';
import styled from 'styled-components';
import { ErrorGeneric } from '@/index/core/error/error-generic';
import { Icon } from '@/index/core/icon/icon';
import { Panel } from '@/index/core/layout/panel/panel';
import { wrapForBatchLoad } from '@/index/core/loader/batch-load-control';
import { fontStyles, MediumBodyText } from '@/index/core/text/text-shared';
import { BeachTimeStatus, beachTimeStatusTextInfoFunc, getBeachTimeStatus } from '@/services/content/beach-time-utility';
import { useBatchResponse } from '@/services/data/data';
import * as iso from '@wbtdevlocal/iso';

const BeachTimeSummarySuccess: React.FC = () => {
	const { meta, beach } = useBatchResponse().success!;

	const beachTimeStatus = getBeachTimeStatus(beach, meta.referenceTime);
	const textInfoFunc = iso.mapNumberEnumValue(BeachTimeStatus, beachTimeStatusTextInfoFunc, beachTimeStatus);
	const { title, description, expression } = textInfoFunc(beach, meta.referenceTime);

	return (
		<RowContainer>
			<TextContainer>
				<Title>{title}</Title>
				<MediumBodyText>{description}</MediumBodyText>
			</TextContainer>
			<ExpressionIcon type={expression} />
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
				<MediumBodyText>Loading...</MediumBodyText>
			</TextContainer>
		</RowContainer>
	);
};

const Wrapped = wrapForBatchLoad(BeachTimeSummaryErrorLoad, BeachTimeSummarySuccess);

export const BeachTimeSummary: React.FC = () => {

	return (
		<Panel>
			<Wrapped />
		</Panel>
	);
};

const Title = styled.div`
	${fontStyles.headings.h4};
`;

const RowContainer = styled.div`
	display: flex;
	align-items: center;
`;

const TextContainer = styled.div`
	flex: 1;
`;

