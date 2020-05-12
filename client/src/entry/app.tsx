import * as React from 'react';
import { useResponsiveLayout } from '@/services/layout/responsive-layout';
import { ResponsiveLayout } from '@/areas/layout/responsive-layout';
import { RootColumn } from '@/core/layout/flex';
import { About } from '@/areas/about/about';
import { LongTerm } from '@/areas/longterm/longterm';
import { Header } from '@/areas/header/header';
import { Timeline } from '@/areas/timeline/timeline';


interface AppProps {
}



export const App: React.FC<AppProps> = () => {
	const responsiveLayout = useResponsiveLayout();


	// function sidebarOnToggle(isOn: boolean) {
	// 	if (isOn)
	// 		setDualToggleState(decideDualToggleState(FooterToggleState.on, FooterToggleState.hidden, layout));
	// 	else
	// 		setDualToggleState(decideDualToggleState(FooterToggleState.visible, FooterToggleState.visible, layout));
	// }

	// function overlayOnToggle(isOn: boolean) {
	// 	if (isOn)
	// 		setDualToggleState(decideDualToggleState(FooterToggleState.hidden, FooterToggleState.on, layout));
	// 	else
	// 		setDualToggleState(decideDualToggleState(FooterToggleState.visible, FooterToggleState.visible, layout));
	// }


	return (
		<RootColumn>
			<ResponsiveLayout
				layout={responsiveLayout.widthBreakpoint}
				fillWithSidebar={null!}
				fillWithOverlay={null!}

				header={<Header />}
				timeline={<Timeline />}

				overlay={<About />}
				sidebar={<LongTerm />}

				footer={null!
				}
			/>
		</RootColumn>
	);
}