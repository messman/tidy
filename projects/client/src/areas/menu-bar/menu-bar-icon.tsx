import * as React from 'react';
import { styled } from '@/core/style/styled';
import { Icon, SVGIconType } from '@/core/symbol/icon';
import { edgePaddingValue } from '@/core/style/common';
import { useCurrentTheme } from '@/core/style/theme';
import { SubText } from '@/core/symbol/text';

export interface MenuBarIconProps {
	type: SVGIconType,
	title: string,
	isDisabled: boolean,
	onClick: () => void
}

export const MenuBarIcon: React.FC<MenuBarIconProps> = (props) => {

	const theme = useCurrentTheme();
	const fillColor = props.isDisabled ? theme.color.disabled : theme.color.textAndIcon;

	// TODO - configure this in the settings.
	const showTitle = false;
	let title: JSX.Element | null = null;
	if (showTitle) {
		title = (
			<SubTextPadding>
				<SubText>{props.title}</SubText>
			</SubTextPadding>
		);
	}

	return (
		<IconPadding>
			<Clickable onClick={props.onClick} title={props.title} disabled={props.isDisabled}>
				<Icon type={props.type} fill={fillColor} height='1.25rem' />
				{title}
			</Clickable>
		</IconPadding>
	);
};

const SubTextPadding = styled.div`
	padding-top: calc(${edgePaddingValue} / 3);
	min-width: 4rem;
`;

const Clickable = styled.button`
	border: 0;
	background-color: transparent;
	cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
	color: ${p => p.disabled ? p.theme.color.disabled : p.theme.color.textAndIcon};
`;

const IconPadding = styled.span`
	display: inline-block;
	padding: ${edgePaddingValue};
	text-align: center;
`;