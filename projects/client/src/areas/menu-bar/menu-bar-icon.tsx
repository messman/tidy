import * as React from 'react';
import { edgePaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { Icon, SVGIconType } from '@/core/symbol/icon';
import { SubText, subtitleHeight } from '@/core/symbol/text';

export interface MenuBarIconProps extends React.HTMLAttributes<HTMLButtonElement> {
	/** Icon type to use. */
	type: SVGIconType,
	/** Title to show on hover or under the icon. */
	title: string,
	isDisabled: boolean,
}

/** Single icon to be added to the Menu Bar. */
export const MenuBarIcon: React.FC<MenuBarIconProps> = (props) => {
	const theme = useCurrentTheme();
	const fillColor = props.isDisabled ? theme.color.disabled : theme.color.textAndIcon;

	// TODO - configure whether or not we show the title underneath the icon in the settings.
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
				<Icon type={props.type} fill={fillColor} height={subtitleHeight} />
				{title}
			</Clickable>
		</IconPadding>
	);
};

const SubTextPadding = styled.div`
	padding-top: calc(${edgePaddingValue} / 3);

	/* Used for future visible-title rendering. */
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