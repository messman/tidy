import * as React from 'react';
import { Flex, FlexColumn, FlexRow } from '@/core/layout/flex';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { hasAllResponseData, useAllResponse } from '@/services/data/data';
import { SummaryAstro } from './summary-astro';
import { SummaryTide } from './summary-tide';
import { SummaryTitle } from './summary-title';
import { SummaryWeather } from './summary-weather';

export interface SummaryProps {
	isCompactVertical: boolean;
}

export const Summary: React.FC<SummaryProps> = (props) => {
	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return <Flex />;
	}

	const { isCompactVertical } = props;

	if (isCompactVertical) {
		return (
			<Flex>
				<SummaryPadding>
					<SummaryTitle showExpandedText={false} />
				</SummaryPadding>
				<SummaryPadding>
					<SummaryTide isDualMode={false} />
				</SummaryPadding>
				<SummaryPadding>
					<SummaryAstro isDualMode={false} />
				</SummaryPadding>
				<SummaryPadding>
					<SummaryWeather isDualMode={false} />
				</SummaryPadding>
			</Flex>
		);
	}

	return (
		<FlexRow flex='none'>
			<SummaryHorizontalPadding />
			<SummaryHorizontalPadding />
			<SummaryTitleHorizontalContainer flex='none' alignItems='center' justifyContent='center'>
				<SummaryTitle showExpandedText={true} />
			</SummaryTitleHorizontalContainer>
			<SummaryHorizontalPadding />
			<SummaryHorizontalPadding />
			<ExplicitWidthFlexColumn flex='none'>
				<SummaryTitleHorizontalContainer>
					<SummaryTide isDualMode={true} />
				</SummaryTitleHorizontalContainer>
			</ExplicitWidthFlexColumn>
			<SummaryHorizontalPadding />
			<ExplicitWidthFlexColumn flex='none'>
				<SummaryTitleHorizontalContainer>
					<SummaryAstro isDualMode={true} />
				</SummaryTitleHorizontalContainer>
			</ExplicitWidthFlexColumn>
			<SummaryHorizontalPadding />
			<ExplicitWidthFlexColumn flex='none'>
				<SummaryTitleHorizontalContainer>
					<SummaryWeather isDualMode={true} />
				</SummaryTitleHorizontalContainer>
			</ExplicitWidthFlexColumn>
			<SummaryHorizontalPadding />

		</FlexRow >
	);
};

const SummaryHorizontalPadding = styled.div`
	width: ${edgePaddingValue};
	height: 1rem;
`;

const SummaryPadding = styled.div`
	margin: ${edgePaddingValue};
`;

const SummaryTitleHorizontalContainer = styled(FlexColumn)`
	margin: ${edgePaddingValue} 0;
`;

export const ExplicitWidthFlexColumn = styled(FlexColumn)`
	/* Close to optimal width used for designs. */
	width: 430px;
`;