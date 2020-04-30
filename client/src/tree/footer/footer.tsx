import * as React from "react";
import { Flex, FlexRow } from "@/unit/components/flex";
import { FooterToggleState, FooterToggle } from "./footerToggle";
import * as C from "@/styles/common";
import styled from "@/styles/theme";

interface FooterProps {
	longTermToggleState: FooterToggleState,
	longTermOnToggle: (isOn: boolean) => void,
	aboutToggleState: FooterToggleState,
	aboutOnToggle: (isOn: boolean) => void,
}

export const Footer: React.FC<FooterProps> = (props) => {

	const longTermSvg = <p>Long Term</p>;
	const aboutSvg = <p>About</p>;

	let title: JSX.Element | null = null;
	if (props.longTermToggleState !== FooterToggleState.on && props.aboutToggleState !== FooterToggleState.on) {
		title = (
			<Flex>
				<FooterLocationTitle>Wells, ME</FooterLocationTitle>
			</Flex>
		)
	}

	return (
		<FlexRow flex={0} alignItems="center">
			<Flex>
				<FooterToggle
					svg={longTermSvg}
					title="See Tides Schedule"
					state={props.longTermToggleState}
					onToggle={props.longTermOnToggle}
				/>
			</Flex>
			{title}
			<Flex>
				<RightSVGToggle
					svg={aboutSvg}
					title="About"
					state={props.aboutToggleState}
					onToggle={props.aboutOnToggle}
				/>
			</Flex>
		</FlexRow>
	);
}

const RightSVGToggle = styled(FooterToggle)`
	display: block;
	margin-left: auto;
`;

const FooterLocationTitle = styled(C.SubTitle)`
	flex: 1;
	display: block;
	text-align: center;
	margin: 0;
`;