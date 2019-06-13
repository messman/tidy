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
			{layout}
		</Border>
		// <C.ShadowBox>
		// 	<FlexSpace></FlexSpace>
		// </C.ShadowBox>
	);
}

const Border = styled(FlexColumn)`
	border: 1px solid red;

	font-size: 0;
	> * {
		font-size: initial;
	}
`;

const One = styled.div`
	width: 100vw;
`;

const FlexSpace = styled(Flex)`
	background-image: linear-gradient(180deg, ${props => props.theme.color.layerDark} 0%, ${props => props.theme.color.bgMed} 100%);
`;
