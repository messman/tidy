import * as React from "react";
import { Flex, FlexRow } from "@/unit/components/flex";
import { SVGToggleState, SVGToggle } from "./svgToggle";
import styled from "@/styles/theme";


interface FooterProps {
	longTermToggleState: SVGToggleState,
	aboutToggleState: SVGToggleState,
}

export const Footer: React.FC<FooterProps> = (props) => {

	const longTermSvg = <p>Long Term</p>;
	const aboutSvg = <p>About</p>;

	return (
		<FlexRow flex={0} alignItems="center">
			<SVGToggle
				svg={longTermSvg}
				title="See Tides Schedule"
				state={props.longTermToggleState}
				onToggle={() => alert('click!')}
			/>
			<Flex>
				<FooterLocationTitle>Wells, Maine</FooterLocationTitle>
			</Flex>
			<SVGToggle
				svg={aboutSvg}
				title="About"
				state={props.aboutToggleState}
				onToggle={() => alert('click!')}
			/>
		</FlexRow>
	);
}

const FooterLocationTitle = styled.h2`
	flex: 1;
	display: block;
	text-align: center;
`;