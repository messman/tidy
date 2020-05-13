import * as React from 'react';
import { FlexParent, FlexColumn, FlexRow } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { LayoutBreakpoint, LayoutMode, useResponsiveLayout } from '@/services/layout/responsive-layout';
import { iconTypes } from '@/core/symbol/icon';
import { useComponentLayout } from '@/areas/layout/component-layout';
import { MenuBarIcon } from './menu-bar-icon';
import { AllResponseClipboardIcon } from './clipboard';

const MenuBarContent = styled(FlexParent)`
	background-color: ${p => p.theme.color.backgroundLighter};
`;

const MenuBarBottomContainer = styled(FlexColumn)`
	width: 100vw;
`;
const MenuBarLeftContainer = styled(FlexRow)`
	height: 100vh;
`;

export const MenuBar: React.FC = (props) => {

	const responsiveLayout = useResponsiveLayout();

	const isCompact = responsiveLayout.widthBreakpoint === LayoutBreakpoint.compact;
	const justifyContent = isCompact ? 'space-evenly' : 'center';

	const bar = <MenuBarInner {...props} />

	const isBottomMenuBar = isCompact || responsiveLayout.mode === LayoutMode.portrait;
	if (isBottomMenuBar) {
		return (
			<MenuBarBottomContainer>
				{props.children}
				<MenuBarContent flexDirection='row' flex={0} justifyContent={justifyContent}>
					{bar}
				</MenuBarContent>
			</MenuBarBottomContainer>
		);
	}
	else {
		return (
			<MenuBarLeftContainer>
				<MenuBarContent flexDirection='column' flex={0} justifyContent={justifyContent}>
					{bar}
				</MenuBarContent>
				{props.children}
			</MenuBarLeftContainer>
		);
	}
}

const MenuBarInner: React.FC = () => {

	const responsiveLayout = useResponsiveLayout();
	const [componentLayout, setComponentLayout] = useComponentLayout();

	const isCompact = responsiveLayout.widthBreakpoint === LayoutBreakpoint.compact;

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
}