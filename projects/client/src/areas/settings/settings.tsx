import * as React from 'react';
import { Title, Subtitle, Text } from '@/core/symbol/text';

export interface SettingsProps {

}

export const Settings: React.FC<SettingsProps> = () => {
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