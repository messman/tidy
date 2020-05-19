import * as React from 'react';
import { styled, StyledFC } from '@/core/style/styled';

interface TimelineWeatherProps {
}

export const TimelineWeather: StyledFC<TimelineWeatherProps> = () => {

	return (
		<MockTimelineWeather>
			Weather
		</MockTimelineWeather>
	);

	// const allResponseState = useAllResponse();
	// if (!hasAllResponseData(allResponseState)) {
	// 	return null;
	// }
	// const { all, info } = allResponseState.data!;

	// let weatherEvents: JSX.Element | null = null;
	// const startTime = info.referenceTime;
	// const events = filterWeatherEvents(all.predictions.weather, all.predictions.cutoffDate);

	// weatherEvents = (
	// 	<>
	// 		{
	// 			events.map((event) => {
	// 				return <WeatherFlag key={event.time.valueOf()} startTime={startTime} event={event} />
	// 			})
	// 		}
	// 	</>
	// );

	// return (
	// 	<WeatherContainer>
	// 		{weatherEvents}
	// 	</WeatherContainer>
	// );
}

const MockTimelineWeather = styled.div`
	height: 10rem;
	min-width: 10rem;
	border: 1px solid red;
`;

// const WeatherContainer = styled.div`
// 	position: relative;
// 	height: calc(15vh + 15px);
// 	/* to provide space for the flag content */
// 	min-height: 135px;
// `;

// interface WeatherFlagProps {
// 	startTime: DateTime,
// 	event: WeatherStatus,
// }

// export const WeatherFlag: StyledFC<WeatherFlagProps> = (props) => {
// 	const { startTime, event } = props;

// 	const left = timeToPixels(startTime, event.time);

// 	const time = getTimeTwelveHour(event.time).time;
// 	const temp = `${event.temp} F`;
// 	const percentRain = `${event.chanceRain.entity! * 100}%`;

// 	const windText = `${event.wind} mph ${event.windDirection}`;

// 	return (
// 		<Flag left={left}>
// 			<SmallText>{time}</SmallText>
// 			<SmallText>{temp}</SmallText>
// 			<SmallText>{event.status}</SmallText>
// 			<SmallText>{percentRain}</SmallText>
// 			<SmallText>{windText}</SmallText>
// 		</Flag>
// 	);
// }

// interface FlagProps {
// 	left: number,
// }

// const _Flag: StyledFC<FlagProps> = (props) => {
// 	return <FlexColumn className={props.className}>{props.children}</FlexColumn>;
// };

// const Flag = styled(_Flag)`
// 	position: absolute;
// 	top: 0;
// 	bottom: 0;
// 	left: ${p => p.left - 1}px;
// 	padding-left: .3rem;

// 	border-left: 2px solid ${p => p.theme.color.background};
// `;
