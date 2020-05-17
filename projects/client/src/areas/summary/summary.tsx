import * as React from 'react';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { SummaryTitle } from './summary-title';
import { SummaryTide } from './summary-tide';
import { Flex } from '@/core/layout/flex';

export interface SummaryProps {
	isCompactVertical: boolean
}

export const Summary: React.FC<SummaryProps> = () => {
	return (
		<Flex>
			<SummaryPadding>
				<SummaryTitle />
			</SummaryPadding>
			<SummaryPadding>
				<SummaryTide />
			</SummaryPadding>
		</Flex>
	);
};

const SummaryPadding = styled.div`
	margin: ${edgePaddingValue};
`;