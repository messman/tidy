import { CosmosFixture } from '@/test';
import * as React from 'react';
import { containers } from './container';
import { ParagraphBodyText } from './text';
import { borderRadiusStyle, Spacing, spacingShort } from './theme/box';
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
			<ParagraphBodyText>
				This is the '{children}' container.
			</ParagraphBodyText>
		</Container>
	);
};

const Container = styled.div<StyleTestProps>`
	${p => p.containerStyle}
	margin: ${spacingShort.vertical.dog16};
	padding: ${Spacing.dog16};
	${borderRadiusStyle}

	:hover {
		${containers.raised}
	}
`;