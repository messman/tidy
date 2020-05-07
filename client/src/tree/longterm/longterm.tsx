import * as React from "react";
import { Flex, FlexColumn } from "@/unit/components/flex";
import styled from "@/styles/styled";
import * as C from "@/styles/common";
import { useAppDataContext } from "../appData";
import { DailyView } from "./dailyView/dailyView";
import { createPrettyHour } from "@/services/time";
import { TimeSlider } from "./timeSlider";

interface LongTermProps {
}

const minHour = 6;
const maxHour = 22;

const minHourDate = new Date();
minHourDate.setHours(minHour);
const minHourText = createPrettyHour(minHourDate);
const maxHourDate = new Date();
maxHourDate.setHours(maxHour);
const maxHourText = createPrettyHour(maxHourDate);

export const LongTerm: React.FC<LongTermProps> = () => {
	return (
		<FlexColumn>
			<PaddingWithoutBottom>
				<C.Section>
					<C.Title>Long-term tides</C.Title>
				</C.Section>
				<TimeSlider
					minHour={minHour}
					minHourText={minHourText}
					maxHour={maxHour}
					maxHourText={maxHourText}
				/>
			</PaddingWithoutBottom>
			<C.ShadowTop />
			<ScrollFlex>
				<LongTermDailyViewList />
			</ScrollFlex>
			<C.ShadowBottom />
		</FlexColumn>
	);
}

const ScrollFlex = styled(Flex)`
	overflow-y: auto;
	flex-basis: 0;
	z-index: 0;
	background-image: linear-gradient(180deg, ${props => props.theme.color.backgroundLighter} 0%, ${props => props.theme.color.background} 100%);
`;

const PaddingWithoutBottom = styled.div`
	padding: 1rem;
	padding-bottom: 0;
	z-index: 3;
`;

interface LongTermDailyViewListProps {
}

export const LongTermDailyViewList: React.FC<LongTermDailyViewListProps> = () => {
	const { isLoading, success } = useAppDataContext();

	if (isLoading || !success) {
		return null;
	}

	const daily = success.data!.daily;

	const list = daily.days.map(function (day, index) {
		return <DailyView
			key={day.date.getTime()}
			dailyEvent={day}
			isToday={index === 0}
			minHour={minHour}
			maxHour={maxHour}
			minTideHeight={day.tides.lowest.height}
			maxTideHeight={day.tides.highest.height}
		/>
	});

	return (
		<>{list}</>
	);
}