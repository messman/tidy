import * as React from 'react';
import { useComponentLayout } from '@/areas/layout/component-layout';
import { styled } from '@/core/style/styled';
import { iconTypes } from '@/core/symbol/icon';
import { DefaultLayoutBreakpoint, FlexColumn, FlexParent, FlexRow, LayoutOrientation, useWindowMediaLayout } from '@messman/react-common';
import { AllResponseClipboardIcon } from './clipboard';
import { MenuBarIcon } from './menu-bar-icon';

const MenuBarContent = styled(FlexParent)`
	background-color: ${p => p.theme.color.backgroundLighter};
`;

const MenuBarBottomContainer = styled(FlexColumn)`
	width: 100vw;
	/* Used to prevent MenuBar scrolling. */
	overflow: hidden;
`;
const MenuBarLeftContainer = styled(FlexRow)`
	height: 100vh;
	/* Used to prevent MenuBar scrolling. */
	overflow: hidden;
`;

/** MenuBar that wraps the other components of the application. */
export const MenuBar: React.FC = (props) => {

	const windowLayout = useWindowMediaLayout();

	// If in the compact view, spread out the icons to take up all the horizontal space.
	// Otherwise, concentrate the icons together. (Code not currently used because only one icon is visible.)
	const isCompact = windowLayout.widthBreakpoint === DefaultLayoutBreakpoint.compact;
	const justifyContent = isCompact ? 'space-evenly' : 'center';

	const bar = <MenuBarInner {...props} />;

	const isBottomMenuBar = isCompact || windowLayout.orientation === LayoutOrientation.portrait;
	if (isBottomMenuBar) {
		return (
			<MenuBarBottomContainer>
				{props.children}
				<MenuBarContent flexDirection='row' flex='none' justifyContent={justifyContent}>
					{bar}
				</MenuBarContent>
			</MenuBarBottomContainer>
		);
	}
	else {
		return (
			<MenuBarLeftContainer>
				<MenuBarContent flexDirection='column' flex='none' justifyContent={justifyContent}>
					{bar}
				</MenuBarContent>
				{props.children}
			</MenuBarLeftContainer>
		);
	}
};

const MenuBarInner: React.FC = () => {

	const windowLayout = useWindowMediaLayout();
	const [componentLayout, setComponentLayout] = useComponentLayout();

	const isCompact = windowLayout.widthBreakpoint === DefaultLayoutBreakpoint.compact;

	if (isCompact && componentLayout.isCompactForecastView || componentLayout.isCompactSettingsView) {

		function onBackClick(): void {
			setComponentLayout({
				isCompactForecastView: false,
				isCompactSettingsView: false
			});
		}

		return (
			<MenuBarIcon
				type={iconTypes.chevronLeft}
				title='Back'
				isDisabled={false}
				onClick={onBackClick}
			/>
		);
	}

	if (!isCompact) {
		return <AllResponseClipboardIcon />;
	}

	function onForecastClick(): void {
		setComponentLayout({
			isCompactForecastView: true,
			isCompactSettingsView: false
		});
	}

	function onSettingsClick(): void {
		setComponentLayout({
			isCompactForecastView: false,
			isCompactSettingsView: true
		});
	}

	return (
		<>
			<AllResponseClipboardIcon />
			<MenuBarIcon
				type={iconTypes.calendar}
				title='Forecast'
				isDisabled={false}
				onClick={onForecastClick}
			/>
			<MenuBarIcon
				type={iconTypes.gear}
				title='Settings'
				isDisabled={false}
				onClick={onSettingsClick}
			/>
		</>
	);
};