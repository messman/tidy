import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import * as C from "@/styles/common";
import { useRef } from "react";
import { useElementSize } from "@/unit/hooks/useElementSize";
import { useAppDataContext } from "@/tree/appData";
import * as Bezier from "@/services/bezier";

interface PercentViewProps {
	visualHeightPercent: number,
	eventHeightPercent: number,
	height: number,
}

export const PercentView: React.FC<PercentViewProps> = (props) => {

	let { visualHeightPercent, eventHeightPercent, height } = props;
	visualHeightPercent = .1;

	let topPercent = -1;
	if (visualHeightPercent < .5) {
		topPercent = (1 - visualHeightPercent) * .5
	}
	else {
		topPercent = (visualHeightPercent * .5) + (1 - visualHeightPercent)
	}
	topPercent *= 100;

	const heightPercentText = `${Math.round(eventHeightPercent * 100)}% height`;


	return (
		<CenterPoint topPercent={topPercent}>
			{heightPercentText}
		</CenterPoint>
	);
}


/*
	TODO
	the height for the wave is for between previous and next... but we need to show min and max of the whole tides. But then text still needs to work the other way.

*/

interface CenterPointProps {
	topPercent: number
}

const CenterPoint = styled.div<CenterPointProps>`
	position: absolute;
	width: 1px;
	height: 1px;
	top: ${props => props.topPercent}%;
	left: 50%;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;
