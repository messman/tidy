import * as React from 'react';
import { Flex, FlexRow } from '@messman/react-common';
import { borderRadiusStyle, edgePaddingValue } from '../style/common';
import { styled } from '../style/styled';
import { SmallTextInline } from '../symbol/text';

export interface ToggleProps {
	selectedEntryIndex: number;
	entries: string[];
	onSelected: (selectedIndex: number) => void;
}

export const Toggle: React.FC<ToggleProps> = (props) => {

	const { selectedEntryIndex, entries, onSelected } = props;

	const options = entries.map((entry, index) => {
		function onClick() {
			onSelected(index);
		}
		return (
			<ToggleOption
				key={entry}
				name={entry}
				isSelected={index === selectedEntryIndex}
				onClick={onClick}
			/>
		);
	});

	return (
		<ToggleContainer>
			{options}
		</ToggleContainer>
	);
};

const ToggleContainer = styled(FlexRow)`
	background-color: ${p => p.theme.color.backgroundLighter};
	padding: ${edgePaddingValue};
	${borderRadiusStyle}
`;

interface ToggleOptionProps {
	name: string;
	isSelected: boolean;
	onClick: () => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = (props) => {
	const { name, isSelected, onClick } = props;

	return (
		<ToggleOptionBubble isSelected={isSelected} onClick={onClick}>
			<SmallTextInline>{name.toUpperCase()}</SmallTextInline>
		</ToggleOptionBubble>
	);
};

interface ToggleOptionBubbleProps {
	isSelected: boolean;
}

const ToggleOptionBubble = styled(Flex) <ToggleOptionBubbleProps>`
	display: inline-block;
	font-size: 0;

	min-width: 4rem;
	text-align: center;
	background-color: ${p => p.isSelected ? p.theme.color.context : 'transparent'};
	padding: calc(${edgePaddingValue} / 3) ${edgePaddingValue};
	${borderRadiusStyle}
	cursor: pointer;
`;