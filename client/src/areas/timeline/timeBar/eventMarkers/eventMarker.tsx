import { styled, css } from '@/core/style/styled';

const sharedMarkerStyles = css`
	position: absolute;
	border: 1px solid ${props => props.theme.color.background};
`;

interface EventMarkerProps {
	positionLeft: number
}

export const WeatherEventMarker = styled.div<EventMarkerProps>`
	${sharedMarkerStyles}
	left: ${props => props.positionLeft - 4}px;
	background-color: ${props => props.theme.color.background};

	top: 6px;
	width: 8px;
	height: 8px;
	z-index: 3;
`;

export const DayEventMarker = styled.div<EventMarkerProps>`
	${sharedMarkerStyles}
	left: ${props => props.positionLeft - 6}px;
	background-color: ${props => props.theme.color.background};

	bottom: 1px;
	width: 12px;
	height: 12px;
	z-index: 3;
	border-radius: 50%;
`;

export const TideEventMarker = styled.div<EventMarkerProps>`
	${sharedMarkerStyles}
	left: ${props => props.positionLeft - 6}px;
	background-color: ${props => props.theme.color.background};

	bottom: 1px;
	width: 12px;
	height: 12px;
	z-index: 4;
	border-radius: 50%;
`;


