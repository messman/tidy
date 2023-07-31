import * as React from 'react';
import styled from 'styled-components';
import { Cosmos, CosmosFixture } from '@/test';
import { FixtureSetup } from '@/test/cosmos-fixture';
import { IconInputType } from '../icon/icon';
import { Block } from '../layout/layout-shared';
import { minTouchSize, Spacing } from '../primitive/primitive-design';
import { MediumBodyText } from '../text/text-shared';
import { BaseButton, ButtonFillBrandBlue, ButtonFillBrandRed, ButtonProps, ButtonSimpleLink, ClickWrapperButton } from './button';

const buttons: [React.FC<ButtonProps>, string][] = [
	[
		ButtonFillBrandRed,
		'Primary - Red',
	],
	[
		ButtonFillBrandBlue,
		'Primary - Blue',
	],
	[
		ButtonSimpleLink,
		'Simple Link',
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
		setup: FixtureSetup.root
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
		setup: FixtureSetup.root
	}),
	'Click Wrapper Button': CosmosFixture.create(() => {

		const isDisabled = Cosmos.useControlValue('Is Disabled', false);

		function onClick() {
			if (!isDisabled) {
				alert('Click!');
			}
		}

		return (
			<>
				<div>
					<MediumBodyText>This is some clickable text.</MediumBodyText>
					<ClickWrapperButton disabled={isDisabled} onClick={onClick}>
						<ClickWrapperButton_Box>
							<MediumBodyText>Text</MediumBodyText>
						</ClickWrapperButton_Box>
					</ClickWrapperButton>
				</div>
				<div>
					<MediumBodyText>This is some clickable text with padding.</MediumBodyText>
					<ClickWrapperButton_Special disabled={isDisabled} onClick={onClick}>
						<ClickWrapperButton_Box>
							<MediumBodyText>Text</MediumBodyText>
						</ClickWrapperButton_Box>
					</ClickWrapperButton_Special>
				</div>
			</>
		);
	}, {
		setup: FixtureSetup.root
	})
};

function noClick() { }

interface ButtonGroupProps {
	ButtonType: React.FC<ButtonProps>;
	leftIcon: IconInputType;
	rightIcon: IconInputType;
	isLoading: boolean;
	children?: React.ReactNode;
}

const ButtonGroup: React.FC<ButtonGroupProps> = (props) => {
	const { ButtonType, leftIcon, rightIcon, isLoading, children } = props;
	return (
		<VerticalMargin>
			<MediumBodyText>Here are some examples of the '{children}' style.</MediumBodyText>
			<ButtonGroup_ButtonContainer>
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
			</ButtonGroup_ButtonContainer>
		</VerticalMargin>
	);
};

const ButtonGroup_ButtonContainer = styled.div`
	display: flex;
	align-items: center;
`;

const VerticalMargin = styled.div`
	margin: ${Spacing.dog16} 0;
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
		</VerticalMarginStretch>
	);
};

const VerticalMarginStretch = styled.div`
	margin: ${Spacing.dog16} 0;
	${BaseButton} {
		width: 100%;
	}
`;

const ClickWrapperButton_Special = styled(ClickWrapperButton)`
	min-height: ${minTouchSize};
	padding: ${Spacing.bat08};
	display: inline-flex;
	align-items: center;
`;

const ClickWrapperButton_Box = styled.div`
`;