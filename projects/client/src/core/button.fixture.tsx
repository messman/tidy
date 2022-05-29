import * as React from 'react';
import { FlexRow } from '@messman/react-common';
import {
	BaseButton, BaseButtonWrapper, baseButtonStyles, buttonShadowStyles, ButtonProps, colorStyles, BrandButtonA, StandardButton, WrapperButton
} from './button';
import { IconInputType } from './icon/icon';
import { Block, spacingShort } from './theme/box';
import { styled } from './theme/styled';
import { Cosmos, CosmosFixture } from '@/test';
import { ParagraphBodyText } from './text';

const ExampleCustomButton = styled(BaseButtonWrapper)`
	${baseButtonStyles}
	${buttonShadowStyles}
	${colorStyles.green}
`;

const buttons: [React.FC<ButtonProps>, string, string][] = [
	[
		BrandButtonA,
		'Brand Button',
		`
			This button is the most dominant button in the hierarchy.
		`
	],
	[
		ExampleCustomButton,
		'Example Button',
		`
			Here's an example of the Brand Button in another color.
			This is done by creating a new button with the base styles of the Brand Button.
			Using a different color with the Brand Button should be very rare.
		`
	],
	[
		StandardButton,
		'Standard Button',
		`
			The standard button is second-highest in hierarchy. It is used to communicate
			an action the user likely wants to take in line with the purpose of the page.
		`
	],
	[
		WrapperButton,
		'Wrapper Button',
		`
			This button is just used to give a button wrapping around text or other components.
		`
	],
];

export default {
	'Button': CosmosFixture.create(() => {

		const leftIcon = Cosmos.useControlSelectIcon('Left Icon');
		const rightIcon = Cosmos.useControlSelectIcon('Right Icon');
		const isLoading = Cosmos.useControlValue('Is Loading', false);

		const render = buttons.map((button) => {
			const [ButtonType, name] = button;

			return (
				<ButtonGroup
					key={name}
					leftIcon={leftIcon}
					rightIcon={rightIcon}
					isLoading={isLoading}
					ButtonType={ButtonType}
				>
					{name}
				</ButtonGroup>
			);
		});

		return (
			<>
				{render}
			</>
		);
	}, {
		hasMargin: true
	}),
	'Stretched Button': CosmosFixture.create(() => {

		const leftIcon = Cosmos.useControlSelectIcon('Left Icon');
		const rightIcon = Cosmos.useControlSelectIcon('Right Icon');
		const isLoading = Cosmos.useControlValue('Is Loading', false);

		const render = buttons.map((button) => {
			const [ButtonType, name] = button;

			return (
				<ButtonStretchGroup
					key={name}
					leftIcon={leftIcon}
					rightIcon={rightIcon}
					isLoading={isLoading}
					ButtonType={ButtonType}
				>
					{name}
				</ButtonStretchGroup>
			);
		});

		return (
			<>
				{render}
			</>
		);
	}, {
		hasMargin: true
	})
};

function noClick() { }

interface ButtonGroupProps {
	ButtonType: React.FC<ButtonProps>;
	leftIcon: IconInputType;
	rightIcon: IconInputType;
	isLoading: boolean;
}

const ButtonGroup: React.FC<ButtonGroupProps> = (props) => {
	const { ButtonType, leftIcon, rightIcon, isLoading, children } = props;
	return (
		<VerticalMargin>
			<p>
				<ParagraphBodyText>Here are some examples of the '{children}' style.</ParagraphBodyText>
			</p>
			<FlexRow alignItems='center'>
				<ButtonType isLoading={isLoading} leftIcon={leftIcon} rightIcon={rightIcon} onClick={noClick}>
					{children}
				</ButtonType>
				<Block.Dog16 />
				<ButtonType isDisabled isLoading={isLoading} leftIcon={leftIcon} rightIcon={rightIcon} onClick={noClick}>
					Disabled
				</ButtonType>
				<Block.Dog16 />
				<ButtonType size='small' isLoading={isLoading} leftIcon={leftIcon} rightIcon={rightIcon} onClick={noClick}>
					Small
				</ButtonType>
				<Block.Dog16 />
				<ButtonType size='tiny' isLoading={isLoading} leftIcon={leftIcon} rightIcon={rightIcon} onClick={noClick}>
					Tiny
				</ButtonType>
			</FlexRow>
		</VerticalMargin>
	);
};

const VerticalMargin = styled.div`
	margin: ${spacingShort.vertical.dog16};
`;

const ButtonStretchGroup: React.FC<ButtonGroupProps> = (props) => {
	const { ButtonType, leftIcon, rightIcon, children } = props;
	return (
		<VerticalMarginStretch>
			<ButtonType size='medium' leftIcon={leftIcon} rightIcon={rightIcon} justifyContent='space-between' onClick={noClick}>
				{children}
			</ButtonType>
			<Block.Dog16 />
			<ButtonType size='small' leftIcon={leftIcon} rightIcon={rightIcon} justifyContent='space-between' onClick={noClick}>
				Small
			</ButtonType>
			<Block.Dog16 />
			<ButtonType size='tiny' leftIcon={leftIcon} rightIcon={rightIcon} justifyContent='space-between' onClick={noClick}>
				Tiny
			</ButtonType>
		</VerticalMarginStretch>
	);
};

const VerticalMarginStretch = styled.div`
	margin: ${spacingShort.vertical.dog16};
	${BaseButton} {
		width: 100%;
	}
`;