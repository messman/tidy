import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";
import { useResponsiveLayoutContext } from "@/unit/hooks/useResponsiveLayout";
import { ResponsiveLayoutType, getLayoutRange } from "../responsiveLayout";
import { APIResponse } from "../../../../data";
import { CurrentConditions } from "./currentConditions";

interface TimelineProps {
	isLoading: boolean,
	apiResponse: APIResponse
}

export const Timeline: React.FC<TimelineProps> = (props) => {

	const layout = useResponsiveLayoutContext();
	console.log(layout, ResponsiveLayoutType[layout], getLayoutRange(layout));

	return (
		<Border>
			<FlexRow flex={"none"}>
				<One>
					<CurrentConditions {...props} />
				</One>
				<Other>
					<h1>Hello</h1>
					<h1>Hello</h1>
					<h1>Hello</h1>
				</Other>
			</FlexRow>
			<FlexRow>
				<One>
					<C.ShadowBox>
						<FlexSpace />
					</C.ShadowBox>
				</One>
				<Other>Hello</Other>
			</FlexRow>
		</Border>
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
	overflow-y: auto;
	white-space: nowrap;
`;

const One = styled(FlexColumn)`
	width: 100vw;
	max-width: ${ResponsiveLayoutType.regular}px;
	flex: none;
	position: relative;
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
