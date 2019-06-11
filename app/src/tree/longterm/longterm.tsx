import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";

interface LongTermProps {
}

export const LongTerm: React.FC<LongTermProps> = (props) => {
	return (
		<ScrollFlex>

			<PaddingWithoutBottom>
				<C.Section>
					<C.Title>Long-term tides</C.Title>
				</C.Section>
				<FlexRow>
					<Flex>6am</Flex>
					<FlexRight>10pm</FlexRight>
				</FlexRow>
			</PaddingWithoutBottom>
			<FlexSpace></FlexSpace>
			<ShadowBottom></ShadowBottom>
		</ScrollFlex>
	);
}

const ScrollFlex = styled(FlexColumn)`
	overflow-y: auto;
`;

const PaddingWithoutBottom = styled.div`
	padding: 1rem;
	padding-bottom: 0;

	/* For the top shadow */
	position: relative;
	z-index: 1;
	box-shadow: 0 0 .5rem .2rem ${props => props.theme.color.bgDark};
`;

const ShadowBottom = styled.div`
	width: 100%;

	/* For the top shadow */
	position: relative;
	z-index: 1;
	box-shadow: 0 0 .5rem .2rem ${props => props.theme.color.bgDark};
`

const FlexRight = styled(Flex)`
	text-align: right;
`;

const FlexSpace = styled(Flex)`
	background-image: linear-gradient(180deg, ${props => props.theme.color.layerDark} 0%, ${props => props.theme.color.bgMed} 100%);
`;
