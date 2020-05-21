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

	if (props.isCompactVertical) {
		return (
			<Flex>
				<SummaryPadding>
					<SummaryTitle />
				</SummaryPadding>
				<SummaryPadding>
					<SummaryTide />
				</SummaryPadding>
				<SummaryPadding>
					<SummaryAstro />
				</SummaryPadding>
				<SummaryPadding>
					<SummaryWeather />
				</SummaryPadding>
			</Flex>
		);
	}

	return (
		<FlexRow flex='none'>
			<RegularWidthFlexColumn>
				<SummaryPadding>
					<SummaryTitle />
				</SummaryPadding>
				<SummaryPadding>
					<SummaryTide />
				</SummaryPadding>
			</RegularWidthFlexColumn>
			<RegularWidthFlexColumn>
				<SummaryPadding>
					<SummaryAstro />
				</SummaryPadding>
				<SummaryPadding>
					<SummaryWeather />
				</SummaryPadding>
			</RegularWidthFlexColumn>
		</FlexRow>
	);
};

const SummaryPadding = styled.div`
	margin: ${edgePaddingValue};
`;