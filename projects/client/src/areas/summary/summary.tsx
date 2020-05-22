import * as React from 'react';
import { RegularWidthFlexColumn } from '@/core/layout/common';
import { Flex, FlexRow } from '@/core/layout/flex';
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
			<RegularWidthFlexColumn>
				<SummaryTitleHorizontalContainer>

					<SummaryTide isDualMode={true} />
				</SummaryTitleHorizontalContainer>
			</RegularWidthFlexColumn>
			<SummaryHorizontalPadding />

			<RegularWidthFlexColumn>
				<SummaryTitleHorizontalContainer>

					<SummaryAstro isDualMode={true} />
				</SummaryTitleHorizontalContainer>
			</RegularWidthFlexColumn>
			<SummaryHorizontalPadding />
			<RegularWidthFlexColumn>
				<SummaryTitleHorizontalContainer>

					<SummaryWeather isDualMode={true} />
				</SummaryTitleHorizontalContainer>
			</RegularWidthFlexColumn>
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