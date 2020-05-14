import * as React from 'react';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { SummaryTitle } from './summary-title';

export interface SummaryProps {
	isCompactVertical: boolean
}

export const Summary: React.FC<SummaryProps> = () => {
	return (
		<>
			<SummaryPadding>
				<SummaryTitle />
			</SummaryPadding>
		</>
	);
};

const SummaryPadding = styled.div`
	margin: ${edgePaddingValue};
`;