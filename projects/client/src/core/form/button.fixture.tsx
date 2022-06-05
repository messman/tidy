import * as React from 'react';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureContainer } from '@/test/cosmos-fixture';
import { IconInputType } from '../icon/icon';
import { Paragraph } from '../text';
import { Block, Spacing } from '../theme/box';
import { styled } from '../theme/styled';
import { BaseButton, ButtonProps, StandardButton, WrapperButton } from './button';

const buttons: [React.FC<ButtonProps>, string, string][] = [
	[
		StandardButton,
		'Standard Button',
		`
			The standard button is used to communicate
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
		container: FixtureContainer.panelPadding
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
		container: FixtureContainer.panelPadding
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
			<Paragraph>Here are some examples of the '{children}' style.</Paragraph>
			<ButtonRow>
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
			</ButtonRow>
		</VerticalMargin>
	);
};

const VerticalMargin = styled.div`
	margin: ${Spacing.dog16} 0;
`;

const ButtonRow = styled.div`
	display: flex;
	align-items: center;
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
		</VerticalMarginStretch>
	);
};

const VerticalMarginStretch = styled.div`
	margin: ${Spacing.dog16} 0;
	${BaseButton} {
		width: 100%;
	}
`;