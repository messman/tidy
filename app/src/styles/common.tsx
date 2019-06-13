import styled from "./theme";
import { Flex } from "@/unit/components/flex";
import * as React from "react";

export const FlexPadding = styled(Flex)`
	padding: 1rem;
`;

export const Section = styled.div`
	margin: 0;
	margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
	font-size: 3rem;
	line-height: 3rem;
	margin: 0;
	margin-bottom: .5rem;
	font-weight: 400;
`;

export const SubTitle = styled.p`
	font-size: 1.5rem;
	font-weight: 400;
	margin: .2rem;
`;

export const Text = styled.p`
	font-size: 1.2rem;
	margin: .2rem;
`;

const ShadowTop = styled.div`
	position: relative;
	z-index: 1;
	box-shadow: 0 0 .5rem .2rem ${props => props.theme.color.bgDark};
`;

const ShadowBottom = styled.div`
	position: relative;
	z-index: 1;
	box-shadow: 0 0 .5rem .2rem ${props => props.theme.color.bgDark};
`;

export const ShadowBox: React.FC = (props) => {
	return (
		<>
			<ShadowTop />
			{props.children}
			<ShadowBottom />
		</>
	)
}