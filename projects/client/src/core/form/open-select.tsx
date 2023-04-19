import * as React from 'react';
import styled from 'styled-components';
import { createContextConsumer } from '@messman/react-common';
import { icons } from '@wbtdevlocal/assets';
import { GroupContainer, GroupEntry, GroupEntryProps, GroupKeyLabel } from '../group/group';
import { SizedIcon } from '../icon/icon';
import { Block } from '../theme/box';

export interface SelectedDataKeyOutput {
	selectedDataKey: string | number | null;
	onSelectDataKey: (newKey: string | number) => void;
}

const [SelectedDataKeyProvider, useSelectedDataKeyState] = createContextConsumer<SelectedDataKeyOutput>();

export interface OpenSelectContainerProps extends SelectedDataKeyOutput {
	children: React.ReactNode;
}

export const OpenSelectContainer: React.FC<OpenSelectContainerProps> = (props) => {
	const { selectedDataKey, onSelectDataKey, children } = props;

	return (
		<GroupContainer>
			<SelectedDataKeyProvider value={{ selectedDataKey, onSelectDataKey }}>
				{children}
			</SelectedDataKeyProvider>
		</GroupContainer>
	);
};


export interface OpenSelectValueProps extends Omit<GroupEntryProps, 'hasArrowWhenClickable' | 'onClick' | 'children'> {
	dataKey: string | number;
	label: string;
}

export const OpenSelectValue: React.FC<OpenSelectValueProps> = (props) => {
	const { dataKey, label, title, isDisabled, icon } = props;

	const { selectedDataKey, onSelectDataKey } = useSelectedDataKeyState();
	const isSelected = selectedDataKey === dataKey;

	function onClick() {
		if (!isSelected) {
			onSelectDataKey(dataKey);
		}
	}

	const selectedCheckRender = isSelected ? (
		<>
			<Block.Elf24 />
			<PrimarySizedCheckIcon size='medium' type={icons.actionCheckBold} />
		</>
	) : null;

	return (
		<GroupEntry
			title={title}
			hasArrowWhenClickable={false}
			icon={icon}
			isDisabled={isDisabled}
			onClick={onClick}
		>
			<GroupKeyLabel isDisabled={!!isDisabled} hasOnClick={!!onClick} isButton={false}>
				{label}
			</GroupKeyLabel>
			{selectedCheckRender}
		</GroupEntry>
	);
};

const PrimarySizedCheckIcon = styled(SizedIcon)`
	color: ${p => p.theme.common.brand1.main};
`;