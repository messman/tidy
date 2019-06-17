import * as React from "react";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import { useAppDataContext } from "@/tree/appData";


const sharedMarkerStyles = css`
	position: absolute;
	border: 1px solid ${props => props.theme.color.bgDark};
`;

interface EventMarkerProps {
	positionLeft: number
}

export const WeatherEventMarker = styled.div<EventMarkerProps>`
	${sharedMarkerStyles}
	left: ${props => props.positionLeft - 3}px;
	background-color: ${props => props.theme.color.layerLight};

	top: 7px;
	width: 6px;
	height: 6px;
	z-index: 3;
`;

export const DayEventMarker = styled.div<EventMarkerProps>`
	${sharedMarkerStyles}
	left: ${props => props.positionLeft - 5}px;
	background-color: ${props => props.theme.color.layerLight};

	bottom: 2px;
	width: 10px;
	height: 10px;
	z-index: 3;
	border-radius: 50%;
`;

export const TideEventMarker = styled.div<EventMarkerProps>`
	${sharedMarkerStyles}
	left: ${props => props.positionLeft - 5}px;
	background-color: ${props => props.theme.color.emphasis};

	bottom: 2px;
	width: 10px;
	height: 10px;
	z-index: 4;
	border-radius: 50%;
`;


