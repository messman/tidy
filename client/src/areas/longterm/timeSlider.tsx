import * as React from 'react';
import { Flex, FlexRow } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { SmallText } from '@/core/symbol/text';

interface TimeSliderProps {
	minHour: number,
	minHourText: string,
	maxHour: number,
	maxHourText: string
}

export const TimeSlider: React.FC<TimeSliderProps> = (props) => {
	return (
		<TimeRow>
			<Flex>
				<SmallText>{props.minHourText}</SmallText>
			</Flex>
			<FlexRight>
				<SmallText>{props.maxHourText}</SmallText>
			</FlexRight>
		</TimeRow>
	);
}

const FlexRight = styled(Flex)`
	text-align: right;
`;

const TimeRow = styled(FlexRow)`
	max-width: 600px;
	margin: 0 auto;
`;

