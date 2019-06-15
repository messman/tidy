import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import * as C from "@/styles/common";
import { APIResponse, WeatherEvent } from "../../../../../data";
import { useRef } from "react";
import { useElementSize } from "@/unit/hooks/useElementSize";
import { timeToPixels, createPrettyHour } from "@/services/time";

interface WeatherFlagProps {
	startTime: Date,
	event: WeatherEvent,
}

export const WeatherFlag: StyledFC<WeatherFlagProps> = (props) => {
	const { startTime, event } = props;

	const left = timeToPixels(startTime, event.time);

	const time = createPrettyHour(event.time);
	const temp = `${event.temp} ${event.tempUnit}`;
	const percentRain = `${event.chanceRain * 100}%`;

	const windText = `${event.wind} ${event.windUnit} ${event.windDirection}`;

	return (
		<Flag left={left}>
			<C.Text>{time}</C.Text>
			<C.Text>{temp}</C.Text>
			<C.Text>{event.status}</C.Text>
			<C.Text>{percentRain}</C.Text>
			<C.Text>{windText}</C.Text>
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
	left: ${props => props.left}px;
	padding-left: .3rem;

	border-left: 1px solid ${props => props.theme.color.layerLight};
`;


