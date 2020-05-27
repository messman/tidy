import * as React from 'react';
import { SmallText, Subtitle, Text, TextInline } from '@/core/symbol/text';
import { decorate } from '@/test/storybook/decorate';
import { styled } from '../style/styled';
import { Flex, FlexColumn, FlexRoot, FlexRow } from './flex';

export default { title: 'core/layout' };

const FlexBorder = styled(Flex)`
	border: 2px solid ${p => p.theme.color.textAndIcon};
`;

// 'Root' components use 100% width/height with flex

export const TestFlexColumn = decorate(() => {
	return (
		<FlexColumn>
			<FlexBorder flex={2}>
				<Text>Flex Column - 2</Text>
			</FlexBorder>
			<FlexBorder>
				<Text>Flex Column - 1</Text>
			</FlexBorder>
			<FlexBorder flex={0}>
				<Text>Flex Column - 0</Text>
			</FlexBorder>
		</FlexColumn>
	);
});

export const TestFlexRow = decorate(() => {
	return (
		<FlexRow>
			<FlexBorder flex={2}>
				<Text>Flex Row - 2</Text>
			</FlexBorder>
			<FlexBorder>
				<Text>Flex Row - 1</Text>
			</FlexBorder>
			<FlexBorder flex={0}>
				<Text>Flex Row - 0</Text>
			</FlexBorder>
		</FlexRow>
	);
});

let testWidthOrHeight = 0;
const testText = 'This is some longer text to see if the content will keep going';

export const TestFlexRowBasis = decorate(() => {
	testWidthOrHeight = 180;

	return (
		<>
			<TestMargin>
				<Text>
					'none' will set it to the width.
				</Text>
				<Text>
					'0' will set it to the content.
				</Text>
			</TestMargin>

			<Test title='Unspecified, Width' pass={false} control={true}>
				<FlexRow>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecialWidth width={testWidthOrHeight}>

					</TestFlexSpecialWidth>
				</FlexRow>
			</Test>
			<Test title='Unspecified, Width, Text' pass={false} control={true}>
				<FlexRow>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecialWidth width={testWidthOrHeight}>
						<TextInline>{testText}</TextInline>
					</TestFlexSpecialWidth>
				</FlexRow>
			</Test>

			<Test title='None, No Width' pass={true} control={true}>
				<FlexRow>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecial flex='none'>

					</TestFlexSpecial>
				</FlexRow>
			</Test>
			<Test title='None, No Width, Text' pass={true} control={true}>
				<FlexRow>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecial flex='none'>
						<TextInline>{testText}</TextInline>
					</TestFlexSpecial>
				</FlexRow>
			</Test>
			<Test title='None, Width' pass={true} control={false}>
				<FlexRow>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecialWidth flex='none' width={testWidthOrHeight}>

					</TestFlexSpecialWidth>
				</FlexRow>
			</Test>
			<Test title='None, Width, Text' pass={true} control={false}>
				<FlexRow>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecialWidth flex='none' width={testWidthOrHeight}>
						<TextInline>{testText}</TextInline>
					</TestFlexSpecialWidth>
				</FlexRow>
			</Test>

			<Test title='0, No Width' pass={true} control={true}>
				<FlexRow>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecial flex={0}>

					</TestFlexSpecial>
				</FlexRow>
			</Test>
			<Test title='0, No Width, Text' pass={true} control={true}>
				<FlexRow>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecial flex={0}>
						<TextInline>{testText}</TextInline>
					</TestFlexSpecial>
				</FlexRow>
			</Test>
			<Test title='0, Width' pass={false} control={false}>
				<FlexRow>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecialWidth flex={0} width={testWidthOrHeight}>

					</TestFlexSpecialWidth>
				</FlexRow>
			</Test>
			<Test title='0, Width, Text' pass={false} control={false}>
				<FlexRow>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecialWidth flex={0} width={testWidthOrHeight}>
						<TextInline>{testText}</TextInline>
					</TestFlexSpecialWidth>
				</FlexRow>
			</Test>
		</>

	);
});

export const TestFlexColumnBasis = decorate(() => {
	testWidthOrHeight = 100;

	return (
		<>
			<TestMargin>
				<Text>
					'none' will set it to the height.
				</Text>
				<Text>
					'0' will set it to the content.
				</Text>
			</TestMargin>


			<Test title='Unspecified, Height' pass={false} control={true}>
				<FlexColumn>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecialHeight height={testWidthOrHeight}>

					</TestFlexSpecialHeight>
				</FlexColumn>
			</Test>
			<Test title='Unspecified, Height, Text' pass={false} control={true}>
				<FlexColumn>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecialHeight height={testWidthOrHeight}>
						<TextInline>{testText}</TextInline>
					</TestFlexSpecialHeight>
				</FlexColumn>
			</Test>

			<Test title='None, No Height' pass={true} control={true}>
				<FlexColumn>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecial flex='none'>

					</TestFlexSpecial>
				</FlexColumn>
			</Test>
			<Test title='None, No Height, Text' pass={true} control={true}>
				<FlexColumn>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecial flex='none'>
						<TextInline>{testText}</TextInline>
					</TestFlexSpecial>
				</FlexColumn>
			</Test>
			<Test title='None, Height' pass={true} control={false}>
				<FlexColumn>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecialHeight flex='none' height={testWidthOrHeight}>

					</TestFlexSpecialHeight>
				</FlexColumn>
			</Test>
			<Test title='None, Height, Text' pass={true} control={false}>
				<FlexColumn>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecialHeight flex='none' height={testWidthOrHeight}>
						<TextInline>{testText}</TextInline>
					</TestFlexSpecialHeight>
				</FlexColumn>
			</Test>

			<Test title='0, No Height' pass={true} control={true}>
				<FlexColumn>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecial flex={0}>

					</TestFlexSpecial>
				</FlexColumn>
			</Test>
			<Test title='0, No Height, Text' pass={true} control={true}>
				<FlexColumn>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecial flex={0}>
						<TextInline>{testText}</TextInline>
					</TestFlexSpecial>
				</FlexColumn>
			</Test>
			<Test title='0, Height' pass={false} control={false}>
				<FlexColumn>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecialHeight flex={0} height={testWidthOrHeight}>

					</TestFlexSpecialHeight>
				</FlexColumn>
			</Test>
			<Test title='0, Height, Text' pass={false} control={false}>
				<FlexColumn>
					<TestFlex />
					<TestFlex />
					<TestFlexSpecialHeight flex={0} height={testWidthOrHeight}>
						<TextInline>{testText}</TextInline>
					</TestFlexSpecialHeight>
				</FlexColumn>
			</Test>
		</>

	);
});

interface TestProps {
	title: string;
	pass: boolean;
	control: boolean;
}

const Test: React.FC<TestProps> = (props) => {
	return (
		<TestMargin>
			<Subtitle>
				{props.title}
			</Subtitle>
			<SmallText>{props.pass ? 'Good' : 'Bad'}</SmallText>
			<TestContainer pass={props.pass} control={props.control}>
				<FlexRoot>


					{props.children}
				</FlexRoot>
			</TestContainer>
		</TestMargin>
	);
};

const TestMargin = styled.div`
	margin: 1rem 0;
`;

interface TestContainerProps {
	pass: boolean;
	control: boolean;
}

const TestContainer = styled.div<TestContainerProps>`
	margin: 2px;
	border: 2px solid ${p => p.control ? 'orange' : (p.pass ? 'green' : 'red')};
	padding: 2px;
	width: 350px;
	height: 200px;
`;

const TestFlex = styled(Flex)`
	border: 2px solid ${p => p.theme.color.backgroundLightest};
	padding: .25rem;
`;

const TestFlexSpecial = styled(TestFlex)`
	border: 2px solid deepskyblue;
	padding: .25rem;
`;

interface TestFlexSpecialWidthProps {
	width: number;
}

const TestFlexSpecialWidth = styled(Flex) <TestFlexSpecialWidthProps>`
	border: 2px solid deepskyblue;
	width: ${p => p.width}px;
`;

interface TestFlexSpecialHeightProps {
	height: number;
}

const TestFlexSpecialHeight = styled(Flex) <TestFlexSpecialHeightProps>`
	border: 2px solid deepskyblue;
	height: ${p => p.height}px;
`;
