import * as React from 'react';
import { fontStyleDeclarations, Paragraph } from '@/core/text';
import { Block } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';

export const BeachTimeDescription: React.FC = () => {
	return (
		<>
			<TimeRange>3:00 PM - 5:22 PM</TimeRange>
			<Block.Bat08 />
			<Paragraph>
				Beach time should last for the next 15 minutes.
			</Paragraph>
		</>
	);
};

const TimeRange = styled.div`
	${fontStyleDeclarations.lead};
`;