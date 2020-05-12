import * as React from 'react';
import { FlexColumn, FlexRow } from '@/core/layout/flex';
import { styled, css } from '@/core/style/styled';
import { LayoutBreakpoint, LayoutMode, useResponsiveLayout } from '@/services/layout/responsive-layout';
import { iconTypes } from '@/core/symbol/icon';
import { useComponentLayout } from '../layout/responsive-layout';
import { MenuBarIcon } from './menu-bar-icon';
import { AllResponseClipboardIcon } from './clipboard';

const wrapperStyles = css`
	background-color: ${p => p.theme.color.backgroundLighter};
`;
const MenuBarBottomWrapper = styled(FlexRow)`
	${wrapperStyles};
`;
const MenuBarLeftWrapper = styled(FlexColumn)`
	${wrapperStyles};
`;

export const MenuBar: React.FC = (props) => {

	const responsiveLayout = useResponsiveLayout();

	const isCompact = responsiveLayout.widthBreakpoint === LayoutBreakpoint.compact;
	const justifyContent = isCompact ? 'space-evenly' : 'center';

	const bar = <MenuBarInner {...props} />

	const isBottomMenuBar = isCompact || responsiveLayout.mode === LayoutMode.portrait;
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