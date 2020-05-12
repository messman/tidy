import * as React from 'react';
import { FlexColumn, FlexRow } from '@/core/layout/flex';
import { styled, StyledFC, css } from '@/core/style/styled';
import { LayoutBreakpoint, LayoutMode, useResponsiveLayout } from '@/services/layout/responsive-layout';
import { Icon, SVGIconType, iconTypes } from '@/core/symbol/icon';
import { flowPaddingValue } from '@/core/style/common';
import { useCurrentTheme } from '@/core/style/theme';

export interface MenuBarProps {
	forecastOnClick: () => void,

	clipboardIsDisabledSuccess: boolean,
	clipboardIsDisabledFailure: boolean,
	clipboardOnClick: () => void,

	settingsOnClick: () => void
}

const wrapperStyles = css`
	background-color: ${p => p.theme.color.backgroundLighter};
`;
const MenuBarBottomWrapper = styled(FlexRow)`
	${wrapperStyles};
`;
const MenuBarLeftWrapper = styled(FlexColumn)`
	${wrapperStyles};
`;

export const MenuBar: React.FC<MenuBarProps> = (props) => {

	const layout = useResponsiveLayout();
	const isBottomMenuBar = layout.widthBreakpoint === LayoutBreakpoint.compact || layout.mode === LayoutMode.portrait;

	const bar = <MenuBarInner {...props} />

	const isFullEvenSpacing = layout.widthBreakpoint === LayoutBreakpoint.compact;
	const justifyContent = isFullEvenSpacing ? 'space-evenly' : 'center';

	if (isBottomMenuBar) {
		return (
			<FlexColumn>
				{props.children}
				<MenuBarBottomWrapper flex={0} justifyContent={justifyContent}>
					{bar}
				</MenuBarBottomWrapper>
			</FlexColumn>
		);
	}
	else {
		return (
			<FlexRow>
				<MenuBarLeftWrapper flex={0} justifyContent={justifyContent}>
					{bar}
				</MenuBarLeftWrapper>
				{props.children}
			</FlexRow>
		);
	}
}

const MenuBarInner: React.FC<MenuBarProps> = (props) => {

	const clipboardIconType = props.clipboardIsDisabledSuccess ? iconTypes.clipboardCheck : iconTypes.clipboard;
	const clipboardTitle = props.clipboardIsDisabledSuccess ? 'Copied to clipboard' : 'Copy to clipboard';
	const isClipboardDisabled = props.clipboardIsDisabledSuccess || props.clipboardIsDisabledFailure;


	return (
		<>
			<MenuBarIcon
				type={iconTypes.calendar}
				title='Forecast'
				isDisabled={false}
				onClick={props.forecastOnClick}
			/>
			<MenuBarIcon
				type={clipboardIconType}
				title={clipboardTitle}
				isDisabled={isClipboardDisabled}
				onClick={props.clipboardOnClick}
			/>
			<MenuBarIcon
				type={iconTypes.gear}
				title='Settings'
				isDisabled={false}
				onClick={props.settingsOnClick}
			/>
		</>
	);
}

interface MenuBarIconProps {
	type: SVGIconType,
	title: string,
	isDisabled: boolean,
	onClick: () => void
}

export const MenuBarIcon: StyledFC<MenuBarIconProps> = (props) => {

	const theme = useCurrentTheme();
	const fillColor = props.isDisabled ? theme.color.disabled : theme.color.textAndIcon;

	return (
		<IconPadding>
			<Clickable onClick={props.onClick} title={props.title} disabled={props.isDisabled}>
				<Icon type={props.type} fill={fillColor} />
			</Clickable>
		</IconPadding>
	);
};

const Clickable = styled.button`
	border: 0;
	background-color: transparent;
	cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
`;

const IconPadding = styled.span`
	display: inline-block;
	padding: ${flowPaddingValue};
`;