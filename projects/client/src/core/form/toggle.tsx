import * as React from 'react';
import { AnimationDuration } from '../animation/animation';
import { GroupEntry, GroupEntryProps, GroupKeyLabel, GroupValue } from '../group/group';
import { Block } from '../theme/box';
import { styled } from '../theme/styled';

export interface GroupKeyValueToggleProps extends Omit<GroupEntryProps, 'hasArrowWhenClickable' | 'onClick'> {
	label: string;
	value: boolean;
	onToggle: (value: boolean) => void;
}

export const GroupKeyValueToggle: React.FC<GroupKeyValueToggleProps> = (props) => {
	const { label, title, isDisabled, icon, onToggle, value, children } = props;

	return (
		<GroupEntry
			title={title || label}
			hasArrowWhenClickable={false}
			icon={icon}
			isDisabled={isDisabled}
			onClick={undefined}
		>
			<GroupKeyLabel isDisabled={!!isDisabled} hasOnClick={false} isButton={false}>
				{label}
			</GroupKeyLabel>
			<Block.Elf24 />
			<GroupValue isDisabled={!!isDisabled} hasOnClick={false}>
				{children}
			</GroupValue>
			<Block.Bat08 />
			<Toggle isDisabled={!!isDisabled} value={value} onToggle={onToggle} />
		</GroupEntry>
	);
};

export interface ToggleProps {
	isDisabled: boolean;
	value: boolean;
	onToggle: (value: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = (props) => {
	const { isDisabled, value, onToggle } = props;

	function onClick() {
		if (!isDisabled) {
			onToggle(!value);
		}
	}

	return (
		<ToggleContainer isDisabled={isDisabled} value={value} onClick={onClick}>
			<ToggleIndicator isDisabled={isDisabled} value={value} />
		</ToggleContainer>
	);
};

const containerWidth = 2.5;
const containerHeight = 1.5; // 1.5rem is the line-height for key-value, body text, etc.
const onePxRem = .0625;
const circleMargin = onePxRem;
const circleSize = containerHeight - (onePxRem * 4);
const circleOnLeft = containerWidth - (2 * onePxRem) - circleSize - onePxRem;

const ToggleContainer = styled.div<{ isDisabled: boolean; value: boolean; }>`
	width: ${containerWidth}rem;
	height: ${containerHeight}rem;
	border-radius: 4rem;
	box-sizing: border-box;
	border: ${onePxRem}rem solid transparent;
	border-color: ${p => p.isDisabled ? p.theme.form.textDisabled : (p.value ? p.theme.common.status.success : p.theme.outlineSubtle)};
	background-color: ${p => p.isDisabled ? p.theme.form.disabled : (p.value ? p.theme.common.status.success : p.theme.form.background)};
	cursor: ${p => p.isDisabled ? 'not-allowed' : 'pointer'};
	position: relative;
	transition: border-color, background-color ${AnimationDuration.b_zip} ease;
`;

const ToggleIndicator = styled.div<{ isDisabled: boolean; value: boolean; }>`
	width: ${circleSize}rem;
	height: ${circleSize}rem;
	border-radius: 4rem;
	position: absolute;
	top: ${circleMargin}rem;
	left: ${p => p.value ? `${circleOnLeft}rem` : `${circleMargin}rem`};
	background-color: ${p => p.isDisabled ? p.theme.form.textDisabled : '#FFF'};
	box-shadow: ${p => p.isDisabled ? 'none' : p.theme.shadow.e_raised};
	transition: all ${AnimationDuration.b_zip} ease;
	transition-property: box-shadow, left, background-color;
`;