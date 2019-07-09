import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";
import { useAppDataContext } from "../appData";
import { DailyView, DailyViewProps } from "./dailyView/dailyView";
import { createPrettyHour } from "@/services/time";

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

