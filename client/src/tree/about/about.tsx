import * as React from "react";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";

export const aboutBackgroundColor: ThemedCSS = css`
	background-image: linear-gradient(91deg, ${props => props.theme.color.bgDark} 0%, ${props => props.theme.color.layerMed} 99%);
`;

export const About: React.FC = () => {
	return (
		<ScrollPadding>
			<C.Section>
				<C.Title>Quick Tides</C.Title>
				<C.Text>By Andrew Messier</C.Text>
				<C.Text>Dedicated to Mark &amp; Dawna</C.Text>
				<C.Text>Open Source on GitHub</C.Text>
			</C.Section>
			<C.Section>
				<C.SubTitle>Data Attributions</C.SubTitle>
				<C.Text>NOAA</C.Text>
				<C.Text>NWS</C.Text>
			</C.Section>
			<C.Section>
				<C.SubTitle>Design</C.SubTitle>
				<C.Text>FontAwesome</C.Text>
				<C.Text>IcoMoon</C.Text>
			</C.Section>
			<C.Section>
				<C.SubTitle>Technologies</C.SubTitle>
				<C.Text>React</C.Text>
				<C.Text>TypeScript</C.Text>
				<C.Text>Sketch</C.Text>
			</C.Section>
			<C.Section>
				<C.SubTitle>Version</C.SubTitle>
				<C.Text>[VERSION]</C.Text>
			</C.Section>
		</ScrollPadding>
	);
}


const ScrollPadding = styled(C.FlexPadding)`
	overflow-y: auto;
`;