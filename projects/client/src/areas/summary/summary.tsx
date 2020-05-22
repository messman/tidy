import * as React from 'react';
import { Flex, FlexColumn, FlexRow } from '@/core/layout/flex';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { SummaryAstro } from './summary-astro';
import { SummaryTide } from './summary-tide';
import { SummaryTitle } from './summary-title';
import { SummaryWeather } from './summary-weather';

export interface SummaryProps {
	isCompactVertical: boolean;
}

export const Summary: React.FC<SummaryProps> = (props) => {
	const { isCompactVertical } = props;

	if (isCompactVertical) {
		return (
			<Flex>
				<SummaryPadding>
					<SummaryTitle />
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
			<SummaryTitleHorizontalContainer flex='none' alignItems='center'>
				<SummaryTitle />
			</SummaryTitleHorizontalContainer>
			<SummaryHorizontalPadding />
			<ExplicitWidthFlexColumn>
				<SummaryTitleHorizontalContainer>
					<SummaryTide isDualMode={true} />
				</SummaryTitleHorizontalContainer>
			</ExplicitWidthFlexColumn>
			<SummaryHorizontalPadding />
			<ExplicitWidthFlexColumn>
				<SummaryTitleHorizontalContainer>
					<SummaryAstro isDualMode={true} />
				</SummaryTitleHorizontalContainer>
			</ExplicitWidthFlexColumn>
			<SummaryHorizontalPadding />
			<ExplicitWidthFlexColumn>
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
`;

const SummaryPadding = styled.div`
	margin: ${edgePaddingValue};
`;

const SummaryTitleHorizontalContainer = styled(FlexRow)`
	margin: ${edgePaddingValue} 0;
`;

export const ExplicitWidthFlexColumn = styled(FlexColumn)`
	/* Close to optimal width used for designs. */
	width: 430px;
`;