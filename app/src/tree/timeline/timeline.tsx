import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";
import { useResponsiveLayoutContext } from "@/unit/hooks/useResponsiveLayout";
import { ResponsiveLayoutType, getLayoutRange } from "../responsiveLayout";

interface TimelineProps {
}

export const Timeline: React.FC<TimelineProps> = (props) => {

	const layout = useResponsiveLayoutContext();
	console.log(layout, ResponsiveLayoutType[layout], getLayoutRange(layout));

	return (
		<Border>
			<FlexRow flex={"none"}>
				<One>
					<div>{layout}</div>
					<div>{layout}</div>
				</One>
				<Other>
					<div>Hello</div>
				</Other>
			</FlexRow>
			<FlexRow>
				<One>Other</One>
				<Other>Hello</Other>
			</FlexRow>
		</Border>
		// <C.ShadowBox>
		// 	<FlexSpace></FlexSpace>
		// </C.ShadowBox>
	);
}

interface OptionalFlexRowProps {
	useFlex?: boolean
}

const OptionalFlexRow = styled.div<OptionalFlexRowProps>`
	font-size: 0;

	> * {
		font-size: initial;
	}

	flex: ${props => props.useFlex ? 1 : "none"};
`;


const Border = styled(FlexColumn)`
	background-color: ${props => props.theme.color.bgMed};
	overflow-y: auto;
	white-space: nowrap;
`;

const One = styled(Flex)`
	width: 100vw;
	max-width: ${ResponsiveLayoutType.regular}px;
	border: 1px solid yellow;
	flex: none;
	position: relative;
	display: block;
`;

const Other = styled(Flex)`
	border: 1px solid red;
	flex-shrink: 0;
	flex: 1;
	min-width: 500px;
`

const FlexSpace = styled(Flex)`
	background-image: linear-gradient(180deg, ${props => props.theme.color.layerDark} 0%, ${props => props.theme.color.bgMed} 100%);
`;
