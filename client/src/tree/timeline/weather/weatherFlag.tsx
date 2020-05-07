import * as React from "react";
import { FlexColumn } from "@/unit/components/flex";
import { styled, StyledFC } from "@/styles/styled";
import { SmallText } from "@/styles/common";
import { timeToPixels, createPrettyHour } from "@/services/time";
import { WeatherStatus } from "tidy-shared";

interface WeatherFlagProps {
	startTime: Date,
	event: WeatherStatus,
}

export const WeatherFlag: StyledFC<WeatherFlagProps> = (props) => {
	const { startTime, event } = props;

	const left = timeToPixels(startTime, event.time);

	const time = createPrettyHour(event.time);
	const temp = `${event.temp} F`;
	const percentRain = `${event.chanceRain.entity! * 100}%`;

	const windText = `${event.wind} mph ${event.windDirection}`;

	return (
		<Flag left={left}>
			<SmallText>{time}</SmallText>
			<SmallText>{temp}</SmallText>
			<SmallText>{event.status}</SmallText>
			<SmallText>{percentRain}</SmallText>
			<SmallText>{windText}</SmallText>
		</Flag>
	);
}

interface FlagProps {
	left: number,
}

const _Flag: StyledFC<FlagProps> = (props) => {
	return <FlexColumn className={props.className}>{props.children}</FlexColumn>;
};

const Flag = styled(_Flag)`
	position: absolute;
	top: 0;
	bottom: 0;
	left: ${props => props.left - 1}px;
	padding-left: .3rem;

	border-left: 2px solid ${props => props.theme.color.background};
`;


