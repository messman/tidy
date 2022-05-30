import * as React from 'react';
import { CosmosFixture } from '@/test';
import { containers } from './container';
import { Paragraph } from './text';
import { borderRadiusStyle, Spacing } from './theme/box';
import { styled, ThemedCSS } from './theme/styled';

export default CosmosFixture.create(() => {

	return (
		<>
			<StyleTest containerStyle={containers.inset}>Inset</StyleTest>
			<StyleTest containerStyle={containers.background}>Background</StyleTest>
			<StyleTest containerStyle={containers.card}>Card</StyleTest>
			<StyleTest containerStyle={containers.button}>Button</StyleTest>
			<StyleTest containerStyle={containers.navigation}>Navigation</StyleTest>
			<StyleTest containerStyle={containers.raised}>Raised</StyleTest>
			<StyleTest containerStyle={containers.picker}>Picker</StyleTest>
			<StyleTest containerStyle={containers.overlay}>Overlay</StyleTest>
		</>
	);
}, {

});

interface StyleTestProps {
	containerStyle: ThemedCSS;
}

const StyleTest: React.FC<StyleTestProps> = (props) => {
	const { containerStyle, children } = props;

	return (
		<Container containerStyle={containerStyle}>
			<Paragraph>
				This is the '{children}' container.
			</Paragraph>
		</Container>
	);
};

const Container = styled.div<StyleTestProps>`
	${p => p.containerStyle}
	margin: ${Spacing.dog16} 0;
	padding: ${Spacing.dog16};
	${borderRadiusStyle}

	:hover {
		${containers.raised}
	}
`;