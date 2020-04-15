import styled, { css } from "./theme";
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
	font-size: 2.5rem;
	line-height: 3rem;
	margin: 0;
	margin-bottom: .5rem;
	font-weight: 400;
`;

export const SubTitle = styled.p`
	font-size: 1.4rem;
	font-weight: 400;
	margin: .2rem;
`;

export const Text = styled.p`
	font-size: 1.2rem;
	margin: .2rem;
`;

export const SmallText = styled.p`
	font-size: 1rem;
	font-weight: 400;
	margin: 0;
`;

const shadowStyle = css`
	box-shadow: 0 0 .5rem .2rem ${props => props.theme.color.bgDark};
`

export const shadowBelowStyle = css`
	box-shadow: .1rem .1rem .4rem 0 ${props => props.theme.color.bgDark};
`

export const ShadowTop = styled.div`
	display: block;
	width: 100%;
	height: 1px;
	position: relative;
	z-index: 2;
	${shadowStyle}
	background-color: ${props => props.theme.color.bgDark};
`;

export const ShadowBottom = styled.div`
	display: block;
	width: 100%;
	height: 1px;
	position: relative;
	z-index: 2;
	${shadowStyle}
	background-color: ${props => props.theme.color.bgDark};
`;

export const TimelinePadding = styled.div`
	height: 5vh;
`;