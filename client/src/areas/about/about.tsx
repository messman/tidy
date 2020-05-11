import * as React from 'react';
import { css, ThemedCSS } from '@/core/style/styled';
import { Title, Subtitle, Text } from '@/core/symbol/common';

export const aboutBackgroundColor: ThemedCSS = css`
	background-image: linear-gradient(91deg, ${props => props.theme.color.background} 0%, ${props => props.theme.color.backgroundLighter} 99%);
`;

export const About: React.FC = () => {
	return (
		<>
			<Title>Quick Tides</Title>
			<Text>By Andrew Messier</Text>
			<Text>Dedicated to Mark &amp; Dawna</Text>
			<Text>Open Source on GitHub</Text>
			<Subtitle>Data Attributions</Subtitle>
			<Text>NOAA</Text>
			<Text>NWS</Text>
			<Subtitle>Design</Subtitle>
			<Text>FontAwesome</Text>
			<Text>IcoMoon</Text>
			<Subtitle>Technologies</Subtitle>
			<Text>React</Text>
			<Text>TypeScript</Text>
			<Text>Sketch</Text>
			<Subtitle>Version</Subtitle>
			<Text>[VERSION]</Text>
		</>
	);
}