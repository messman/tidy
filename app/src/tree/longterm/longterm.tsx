import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";
import { useAppDataContext } from "../appData";
import { DailyView, DailyViewProps } from "./dailyView/dailyView";
import { createPrettyHour } from "@/services/time";

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

export const LongTerm: React.FC<LongTermProps> = (props) => {
	return (
		<FlexColumn>
			<PaddingWithoutBottom>
				<C.Section>
					<C.Title>Long-term tides</C.Title>
				</C.Section>
				<FlexRow>
					<Flex>{minHourText}</Flex>
					<FlexRight>{maxHourText}</FlexRight>
				</FlexRow>
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
	background-image: linear-gradient(180deg, ${props => props.theme.color.layerDark} 0%, ${props => props.theme.color.bgMed} 100%);
`;

const PaddingWithoutBottom = styled.div`
	padding: 1rem;
	padding-bottom: 0;
`;

const FlexRight = styled(Flex)`
	text-align: right;
`;

const FlexSpace = styled(Flex)`
`;

interface LongTermDailyViewListProps {
}

export const LongTermDailyViewList: React.FC<LongTermDailyViewListProps> = (props) => {
	const { isLoading, success } = useAppDataContext();

	if (isLoading || !success) {
		return null;
	}

	const daily = success.success.daily;
	const all = [daily.today, ...daily.future];
	const { minHeight, maxHeight } = success.success.daily.tides;

	const list = all.map(function (day, index) {
		return <DailyView
			key={day.date.getTime()}
			dailyEvent={day}
			isToday={index === 0}
			minHour={minHour}
			maxHour={maxHour}
			minTideHeight={minHeight}
			maxTideHeight={maxHeight}
		/>
	});

	return (
		<>{list}</>
	);
}