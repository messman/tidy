import * as React from 'react';
import { Flex, FlexRow } from '@/core/layout/flex';
import { styled, css } from '@/core/style/styled';
import { SmallText } from '@/core/symbol/text';
import { TideEvent, AllDailyDay } from 'tidy-shared';
import { getTimeTwelveHour, getDateDayOfWeek } from '@/services/time';
import { DailyChart } from './dailyChart';

export interface DailyViewProps {
	isToday: boolean,
	minHour: number,
	maxHour: number,
	minTideHeight: number,
	maxTideHeight: number,
	dailyEvent: AllDailyDay
}

export const DailyView: React.FC<DailyViewProps> = (props) => {
	const daily = props.dailyEvent;

	const minHour = daily.date.set({ hour: props.minHour });
	const maxHour = daily.date.set({ hour: props.maxHour });

	let qualifiedTideEvents = daily.tides.events
		.filter(function (tide) {
			// between 
			return tide.time.hasSame(daily.date, 'day') && tide.time >= minHour && tide.time <= maxHour;
		});

	// Either 2 or 3 for the max/min value that we currently have.
	let tideEventsText: JSX.Element | null = null;
	if (qualifiedTideEvents.length === 2) {
		tideEventsText = (
			<>
				<NoShrinkFlex />
				<TideText event={qualifiedTideEvents[0]} />
				<NoShrinkFlex />
				<TideText event={qualifiedTideEvents[1]} />
				<NoShrinkFlex />
			</>
		);
	}
	else {
		tideEventsText = (
			<>
				<NoShrinkFlex />
				<TideText event={qualifiedTideEvents[0]}></TideText>
				<NoShrinkFlex />
				<TideText event={qualifiedTideEvents[1]}></TideText>
				<NoShrinkFlex />
				<TideText event={qualifiedTideEvents[2]}></TideText>
				<NoShrinkFlex />
			</>
		);
	}

	const dateText = props.isToday ? 'Today' : getDateDayOfWeek(daily.date);

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
						<RainText>{daily.weather.maxChanceRain * 100}%</RainText>
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
	background-color: ${p => p.theme.color.backgroundLighter};
	margin: .5rem .5rem 0 .5rem;

	&:last-child {
		margin-bottom: .5rem;
	}
`;

const commonUpperText = css`
	padding: .3rem .6rem;
`;

const DateText = styled(SmallText)`
	${commonUpperText}
	text-align: left;
`;

const WeatherText = styled(SmallText)`
	${commonUpperText}
	text-align: center;
`;

const RainText = styled(SmallText)`
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
		<NoShrinkFlex>
			<LongText>{props.event.isLow ? 'Low' : 'High'}</LongText>
			<LongText>{getTimeTwelveHour(props.event.time).time} {props.event.height}ft</LongText>
		</NoShrinkFlex>
	);
}

const LongText = styled(SmallText)`
	white-space: nowrap;
`;