import * as React from "react";
import { Flex, FlexRow } from "@/unit/components/flex";
import styled from "@/styles/styled";
import * as C from "@/styles/common";

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
				<C.SmallText>{props.minHourText}</C.SmallText>
			</Flex>
			<FlexRight>
				<C.SmallText>{props.maxHourText}</C.SmallText>
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

