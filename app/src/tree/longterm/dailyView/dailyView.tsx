import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";
import { WeatherEvent, TideEvent, DailyInfo } from "../../../../../data";
import { createPrettyTime, isSameDay, createPrettyDate, createPrettyDateDay } from "@/services/time";
import { DailyChart } from "./dailyChart";

export interface DailyViewProps {
	isToday: boolean,
	minHour: number,
	maxHour: number,
	minTideHeight: number,
	maxTideHeight: number,
	dailyEvent: DailyInfo
}

export const DailyView: React.FC<DailyViewProps> = (props) => {
	const daily = props.dailyEvent;

	const minHour = new Date(daily.date);
	minHour.setHours(props.minHour, 0, 0, 0);

	const maxHour = new Date(daily.date);
	maxHour.setHours(props.maxHour, 0, 0, 0);

	let qualifiedTideEvents = daily.tides
		.filter(function (tide) {
			// between 
			return isSameDay(tide.time, daily.date) && tide.time >= minHour && tide.time <= maxHour;
		});

	// Either 2 or 3 for the max/min value that we currently have.
	let tideEventsText: JSX.Element = null;
	if (qualifiedTideEvents.length === 2) {
		tideEventsText = (
			<>
				<NoShrinkFlex />
				<TwoPartTideText event={qualifiedTideEvents[0]} />
				<NoShrinkFlex />
				<TwoPartTideText event={qualifiedTideEvents[1]} />
				<NoShrinkFlex />
			</>
		);
	}
	else {
		tideEventsText = (
			<>
				<ThreePartTideText event={qualifiedTideEvents[0]}></ThreePartTideText>
				<ThreePartTideText event={qualifiedTideEvents[1]}></ThreePartTideText>
				<ThreePartTideText event={qualifiedTideEvents[2]}></ThreePartTideText>
			</>
		);
	}

	const dateText = props.isToday ? 'Today' : createPrettyDateDay(daily.date);

	return (
		<Center>

			<Container>
				<FlexRow>
					<Flex>
						<DateText>{dateText}</DateText>
					</Flex>
					<Flex>
						<WeatherText>{daily.weather.status}</WeatherText>
					</Flex>
					<Flex>
						<RainText>{daily.weather.chanceRain * 100}%</RainText>
					</Flex>
				</FlexRow>
				<DailyChart
					minHour={props.minHour}
					maxHour={props.maxHour}
					minTideHeight={props.minTideHeight}
					maxTideHeight={props.maxTideHeight}

					dailyEvent={daily}
				/>
				<FlexRow>
					{tideEventsText}
				</FlexRow>
			</Container>
		</Center>
	);
}

const Center = styled.div`
	margin: 0 auto;
	max-width: 600px;
	`;

const Container = styled.div`
	background-color: ${props => props.theme.color.bgDark};
	${C.shadowBelowStyle}
	margin: .5rem .5rem 0 .5rem;

	&:last-child {
		margin-bottom: .5rem;
	}
`;

const commonUpperText = css`
	padding: .3rem .6rem;
`;

const DateText = styled(C.SmallText)`
	${commonUpperText}
	text-align: left;
`;

const WeatherText = styled(C.SmallText)`
	${commonUpperText}
	text-align: center;
`;

const RainText = styled(C.SmallText)`
	${commonUpperText}
	text-align: right;
`;

interface TideTextProps {
	event: TideEvent
}

const NoShrinkFlex = styled(Flex)`
	width: 0;
`;

const TideText: React.FC<TideTextProps> = (props) => {
	return (
		<>
			<LongText>{props.event.isLow ? "Low" : "High"}</LongText>
			<LongText>{createPrettyTime(props.event.time)} {props.event.height}ft</LongText>
		</>
	);
}

const ThreePartTideText: React.FC<TideTextProps> = (props) => {
	return (
		<Flex>
			<TideTextContainer>
				<TideText {...props} />
			</TideTextContainer>
		</Flex>
	);
}

const TwoPartTideText: React.FC<TideTextProps> = (props) => {
	return (
		<NoShrinkFlex>
			<TideText {...props} />
		</NoShrinkFlex>
	);
}

const TideTextContainer = styled.div`
	${commonUpperText}
	padding-top: 0;
`;

const LongText = styled(C.SmallText)`
	white-space: nowrap;
`;