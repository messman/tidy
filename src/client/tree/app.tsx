import * as React from "react";
import { useState, useEffect } from "react";
import { usePromise } from "@/unit/hooks/usePromise";
import { useResponsiveLayoutContext } from "@/unit/hooks/useResponsiveLayout";
import { ResponsiveLayout, ResponsiveLayoutType } from "./responsiveLayout";
import { Footer } from "./footer/footer";
import { FooterToggleState } from "./footer/footerToggle";
import { BackgroundFill } from "./backgroundFill";
import { FlexColumn } from "@/unit/components/flex";
import styled from "@/styles/theme";
import { About, aboutBackgroundColor } from "./about/about";
import { LongTerm } from "./longterm/longterm";
import { mockDataCall } from "@/data/mock"
import { Header } from "./header/header";
import { Timeline } from "./timeline/timeline";
import { AppDataProvider } from "./appData";


interface AppProps {
}

interface DualToggleState {
	sidebar: FooterToggleState,
	overlay: FooterToggleState
}

function decideDualToggleState(sidebar: FooterToggleState, overlay: FooterToggleState, layout: ResponsiveLayoutType): DualToggleState {
	const state: DualToggleState = { sidebar, overlay };
	if (layout === ResponsiveLayoutType.wide) {
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

export const App: React.FC<AppProps> = (props) => {
	const layout = useResponsiveLayoutContext();

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
			<BackgroundFill
				fillWithSidebar={fillWithSidebar}
				sidebarCss={null}
				fillWithOverlay={fillWithOverlay}
				overlayCss={aboutBackgroundColor}
			>
				<ResponsiveLayout
					layout={layout}
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
			</BackgroundFill>
		</Root>
	);
}

const Root = styled(FlexColumn)`
	height: 100%;
	width: 100%;
`


