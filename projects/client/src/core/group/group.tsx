import * as React from 'react';
import { icons } from '@wbtdevlocal/assets';
import { IconInputType, SizedIcon, SizedIconArrowChevronInline } from '../icon/icon';
import { ellipsisStyle, fontStyleDeclarations } from '../text';
import { Block, borderRadiusStyle, Spacing } from '../theme/box';
import { Theme } from '../theme/color';
import { FontWeight } from '../theme/font';
import { css, styled } from '../theme/styled';

export interface GroupEntryProps {
	/** Hover title - should be provided when content may cause ellipses. */
	title?: string;
	/** If disabled, the item cannot be clicked and will have a muted look. */
	isDisabled?: boolean;
	onClick?: () => void | null;
	/** If true, arrow is shown when not disabled and has onClick set. */
	hasArrowWhenClickable?: boolean;
	/** An icon that may appear to the left. */
	icon?: IconInputType;
}

/** Meant to be extended and not used directly. Missing the 'label' that goes on the left side. */
export const GroupEntry: React.FC<GroupEntryProps> = (props) => {
	const { title, isDisabled, onClick, hasArrowWhenClickable, icon, children } = props;

	const iconRender = icon !== undefined ? (
		<>
			<SizedIcon size='medium' type={icon} />
			<Block.Bat08 />
		</>
	) : null;

	// A special inline chevron will be shown for some buttons and clickable key-values. 
	const clickChevronRender = (hasArrowWhenClickable && !isDisabled && !!onClick) ? (
		<>
			<Block.Bat08 />
			<GroupSizedInlineArrow isDisabled={!!isDisabled} hasOnClick={!!onClick} size='medium' type={icons.arrowChevronRightInline} />
		</>
	) : null;

	function onKeyValueClick() {
		if (!isDisabled && onClick) {
			onClick();
		}
	}

	// Reminder: The HorizontalSubtleLine is display: none for the last item.

	return (
		<GroupKeyValueFlexRow title={title} isDisabled={!!isDisabled} hasOnClick={!!onClick} onClick={onKeyValueClick}>
			<Block.Dog16 />
			{iconRender}
			<GroupFlexAroundKeyValue>
				<PaddedFlexRowForGroup>
					{children}
					{clickChevronRender}
				</PaddedFlexRowForGroup>
				<HorizontalSubtleLine />
			</GroupFlexAroundKeyValue>
		</GroupKeyValueFlexRow>
	);
};

export interface GroupKeyValueProps extends Omit<GroupEntryProps, 'hasArrowWhenClickable'> {
	label: string;
}

/** A basic key-value pairing that can be used in a group or extended. */
export const GroupKeyValue: React.FC<GroupKeyValueProps> = (props) => {
	const { label, title, isDisabled, onClick, icon, children } = props;

	return (
		<GroupEntry
			title={title || label}
			hasArrowWhenClickable={true}
			icon={icon}
			isDisabled={isDisabled}
			onClick={onClick}
		>
			<GroupKeyLabel isDisabled={!!isDisabled} hasOnClick={!!onClick} isButton={false}>
				{label}
			</GroupKeyLabel>
			<Block.Elf24 />
			<GroupValue isDisabled={!!isDisabled} hasOnClick={!!onClick}>
				{children}
			</GroupValue>
		</GroupEntry>
	);
};

export interface GroupButtonProps extends Omit<GroupEntryProps, 'hasArrowWhenClickable'> {
	label: string;
	/** If true, an arrow is added. Useful for single-group entries. */
	hasArrow?: boolean;
	isDanger?: boolean;
}

export const GroupButton: React.FC<GroupButtonProps> = (props) => {
	const { label, hasArrow, title, isDisabled, onClick, icon, isDanger } = props;

	return (
		<GroupEntry
			title={title}
			hasArrowWhenClickable={hasArrow}
			icon={icon}
			isDisabled={isDisabled}
			onClick={onClick}
		>
			<GroupKeyLabel isDisabled={!!isDisabled} hasOnClick={!!onClick} isButton={true} isDangerButton={isDanger}>
				{label}
			</GroupKeyLabel>
		</GroupEntry>
	);
};

interface GroupKeyValueFlexRowProps {
	isDisabled: boolean;
	hasOnClick: boolean;
}

const flexRowClickableStyle = css`
	&:hover {
		background-color: ${p => p.theme.form.hover};
	}

	&:active {
		background-color: ${p => p.theme.form.active};
	}
`;

const GroupKeyValueFlexRow = styled.div<GroupKeyValueFlexRowProps>`
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;

	cursor: ${p => p.isDisabled ? 'not-allowed' : (p.hasOnClick ? 'pointer' : 'auto')};
	${p => (p.hasOnClick && !p.isDisabled) && flexRowClickableStyle};
`;

const PaddedFlexRowForGroup = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	padding: ${Spacing.bat08} ${Spacing.dog16} ${Spacing.bat08} 0;
`;

// Need to set min-width: 0 to support ellipses (https://stackoverflow.com/a/63557515)
const GroupFlexAroundKeyValue = styled.div`
	flex: 1;
	min-width: 0;
`;

/**
 * Used to create a line between entries.
 * Special styling causes the line to be hidden for the last item.
 */
const HorizontalSubtleLine = styled.div`
	width: 100%;
	height: 1px;
	background-color: ${p => p.theme.outlineDistinct};
`;

/*
	Use a transparent background-color instead of a display: none.
	Otherwise, the icon will shift slightly when an entry is no longer the last entry.
	You could possibly remedy this with different HTML structure.
*/
const keyValueContainerLineStyle = css`
	${GroupKeyValueFlexRow}:last-of-type {
		${HorizontalSubtleLine} {
			background-color: transparent;
		}
	}
`;

const groupContainerStyle = css`
	${borderRadiusStyle}
	/* background-color: ${p => p.theme.form.background}; */
	box-shadow: ${p => p.theme.shadow.a_background};
	overflow: hidden;
`;

/**
 * Container around the group contents. This is what is typically used.
 * If all the entries are buttons, consider the raised style.
 */
export const GroupContainer = styled.div`
	${groupContainerStyle};
	${keyValueContainerLineStyle};
`;

/**
 * Container around the group contents. 
 * Has no container style.
 */
export const GroupWrapper = styled.div`
	${keyValueContainerLineStyle};
`;

/**
 * Container around the group contents. 
 * This is only to be used when there are only buttons in the group.
 */
export const GroupRaisedContainer = styled.div`
	${groupContainerStyle};
	${keyValueContainerLineStyle};
`;

export interface GroupTextProps {
	isDisabled: boolean;
	hasOnClick: boolean;
	isButton?: boolean;
	isDangerButton?: boolean;
}

function getColor(theme: Theme, isDisabled: boolean, isButton: boolean, isDangerButton: boolean): string {
	return isDisabled ? theme.form.textDisabled : (isButton ? (isDangerButton ? theme.common.status.error : theme.common.brand1.main) : theme.textDistinct);
}

/** The label (left text) piece of a KeyValue. */
export const GroupKeyLabel = styled.span<GroupTextProps>`
	flex: 1;
	${fontStyleDeclarations.body};
	font-weight: ${FontWeight.medium};
	color: ${p => getColor(p.theme, p.isDisabled, !!p.isButton, !!p.isDangerButton)};
	white-space: nowrap;
`;

const GroupSizedInlineArrow = styled(SizedIconArrowChevronInline) <GroupTextProps>`
	color: ${p => p.isDisabled ? p.theme.form.textDisabled : p.theme.textSubtle};
	flex-shrink: 0;
`;

/** The right text piece of a KeyValue. */
export const GroupValue = styled.div<GroupTextProps>`
	${fontStyleDeclarations.body};
	color: ${p => p.isDisabled ? p.theme.form.textDisabled : p.theme.textSubtle};
	font-weight: ${p => (p.hasOnClick && !p.isDisabled) ? FontWeight.medium : FontWeight.regular};
	${ellipsisStyle}
`;