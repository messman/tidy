import * as React from 'react';
import { useState, useEffect } from 'react';
import { useResponsiveLayout, LayoutBreakpoint, Layout } from '@/services/layout/responsive-layout';
import { ResponsiveLayout } from '@/areas/layout/responsive-layout';
import { Footer } from '@/areas/footer/footer';
import { FooterToggleState } from '@/areas/footer/footerToggle';
import { FlexColumn } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { About, aboutBackgroundColor } from '@/areas/about/about';
import { LongTerm } from '@/areas/longterm/longterm';
import { Header } from '@/areas/header/header';
import { Timeline } from '@/areas/timeline/timeline';


interface AppProps {
}

interface DualToggleState {
	sidebar: FooterToggleState,
	overlay: FooterToggleState
}

function decideDualToggleState(sidebar: FooterToggleState, overlay: FooterToggleState, layout: Layout): DualToggleState {
	const state: DualToggleState = { sidebar, overlay };
	if (layout.widthBreakpoint === LayoutBreakpoint.wide) {
		state.sidebar = FooterToggleState.hidden;
		if (state.overlay === FooterToggleState.hidden) {
			state.overlay = FooterToggleState.visible;
		}
	}
	else if (state.sidebar === FooterToggleState.hidden && state.overlay !== FooterToggleState.on) {
		state.sidebar = FooterToggleState.visible;
	}
	return state;
}

export const App: React.FC<AppProps> = () => {
	const layout = useResponsiveLayout();

	const [dualToggleState, setDualToggleState] = useState<DualToggleState>(decideDualToggleState(FooterToggleState.visible, FooterToggleState.visible, layout));

	useEffect(() => {
		setDualToggleState((prev) => {
			return decideDualToggleState(prev.sidebar, prev.overlay, layout);
		});
	}, [layout]);

	function sidebarOnToggle(isOn: boolean) {
		if (isOn)
			setDualToggleState(decideDualToggleState(FooterToggleState.on, FooterToggleState.hidden, layout));
		else
			setDualToggleState(decideDualToggleState(FooterToggleState.visible, FooterToggleState.visible, layout));
	}

	function overlayOnToggle(isOn: boolean) {
		if (isOn)
			setDualToggleState(decideDualToggleState(FooterToggleState.hidden, FooterToggleState.on, layout));
		else
			setDualToggleState(decideDualToggleState(FooterToggleState.visible, FooterToggleState.visible, layout));
	}

	const fillWithSidebar = dualToggleState.sidebar === FooterToggleState.on;
	const fillWithOverlay = dualToggleState.overlay === FooterToggleState.on;

	return (
		<Root>
			<ResponsiveLayout
				layout={layout.widthBreakpoint}
				fillWithSidebar={fillWithSidebar}
				fillWithOverlay={fillWithOverlay}

				header={<Header />}
				timeline={<Timeline />}

				overlay={<About />}
				sidebar={<LongTerm />}

				footer={
					<Footer
						longTermToggleState={dualToggleState.sidebar}
						longTermOnToggle={sidebarOnToggle}
						aboutToggleState={dualToggleState.overlay}
						aboutOnToggle={overlayOnToggle}
					/>
				}
			/>
		</Root>
	);
}

const Root = styled(FlexColumn)`
	height: 100%;
	width: 100%;
`



