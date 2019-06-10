import * as React from "react";
import { Flex, FlexRow } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";

export const aboutBackgroundColor: ThemedCSS = css`
	background-image: linear-gradient(91deg, ${props => props.theme.color.bgDark} 0%, ${props => props.theme.color.layerMed} 99%);
`;

interface AboutProps {
}

export const About: React.FC<AboutProps> = (props) => {
	return (
		<Flex>
			<h1>Quick Tides</h1>
		</Flex>
	);
}