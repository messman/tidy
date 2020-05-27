import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { Title, Subtitle, Text, TextInline, SmallText, SubText } from '@/core/symbol/text';
import { styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { borderRadiusStyle, edgePaddingValue } from '@/core/style/common';

export default { title: 'core/style' };

export const TestTheme = decorate(() => {

	const theme = useCurrentTheme();

	return (
		<>
			<div>
				<TextSizesColorBox backgroundColor={theme.color.background} />
				<TextSizesColorBox backgroundColor={theme.color.backgroundLighter} />
				<TextSizesColorBox backgroundColor={theme.color.backgroundLightest} />
			</div>
			<TextColorBox backgroundColor={theme.color.tide}>Tide</TextColorBox>
			<TextColorBox backgroundColor={theme.color.sun}>Sun</TextColorBox>
			<TextColorBox backgroundColor={theme.color.weather}>Weather</TextColorBox>
			<TextColorBox backgroundColor={theme.color.context}>Context</TextColorBox>
			<TextColorBox backgroundColor={theme.color.backgroundTimelineDay}>Timeline Day Background</TextColorBox>
		</>
	);
});

interface ColorBoxProps {
	backgroundColor: string,
}

const ColorBox = styled.div<ColorBoxProps>`
	display: inline-block;
	min-width: 3rem;
	min-height: 1rem;

	background-color: ${p => p.backgroundColor};
	${borderRadiusStyle};
	margin: ${edgePaddingValue};
	padding: ${edgePaddingValue};
`;

const TextSizesColorBox: React.FC<ColorBoxProps> = (props) => {
	return (
		<ColorBox backgroundColor={props.backgroundColor}>
			<Title>Title</Title>
			<Subtitle>Subtitle</Subtitle>
			<Text>Text</Text>
			<SmallText>Small Text</SmallText>
			<SubText>Sub Text</SubText>
		</ColorBox>
	);
};

const LongColorBox = styled.div<ColorBoxProps>`
	display: inline-block;
	min-width: 8rem;
	min-height: 1rem;

	background-color: ${p => p.backgroundColor};
	${borderRadiusStyle};
	margin-bottom: ${edgePaddingValue};
	margin-right: ${edgePaddingValue};
`;

const TextColorBox: React.FC<ColorBoxProps> = (props) => {
	return (
		<div>
			<LongColorBox backgroundColor={props.backgroundColor} />
			<TextInline>{props.children}</TextInline>
		</div>
	);
};