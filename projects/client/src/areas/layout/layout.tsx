import * as React from 'react';
import { Forecast, ForecastProps } from '@/areas/forecast/forecast';
import { Settings, SettingsProps } from '@/areas/settings/settings';
import { Summary, SummaryProps } from '@/areas/summary/summary';
import { Timeline, TimelineProps } from '@/areas/timeline/timeline';
import { OverflowAutoFlexRow, RegularWidthFlexColumn, ScreenWidthFlexColumn } from '@/core/layout/common';
import { Overlay } from '@/core/layout/overlay';
import { DefaultLayoutBreakpoint, FlexColumn, FlexRow, useWindowMediaLayout } from '@messman/react-common';
import { useComponentLayout } from './component-layout';

export const ApplicationResponsiveLayout: React.FC = () => {
	return (
		<ResponsiveLayout
			Summary={Summary}
			Timeline={Timeline}
			Forecast={Forecast}
			Settings={Settings}
		/>
	);
};

// Each component is passed as a component instead of an element so it's rendered further down the tree.
interface ResponsiveLayoutProps {
	Summary: React.FC<SummaryProps>,
	Timeline: React.FC<TimelineProps>,
	Forecast: React.FC<ForecastProps>,
	Settings: React.FC<SettingsProps>,
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = (props) => {
	const { Summary, Timeline, Forecast, Settings } = props;

	const windowLayout = useWindowMediaLayout();
	const [componentLayout] = useComponentLayout();

	// TODO - When moving from compact to non-compact, React tree is destroyed.
	const isCompact = windowLayout.widthBreakpoint === DefaultLayoutBreakpoint.compact;
	if (isCompact) {

		/*
			Structure:
			- FlexRow at the top, just to create Flex for the children.
				- Two overlay components, which just attach absolute-positioned overlays.
				- OverflowAuto FlexRow to prevent the MenuBar from scrolling.
				- ScreenWidth FlexColumn to control the size of the summary view front-and-center.
		*/
		return (
			<FlexRow>
				<Overlay isActive={componentLayout.isCompactForecastView} component={<Forecast />} >
					<Overlay isActive={componentLayout.isCompactSettingsView} component={<Settings />}>
						<OverflowAutoFlexRow>
							<ScreenWidthFlexColumn flex='none'>
								<Summary isCompactVertical={true} />
							</ScreenWidthFlexColumn>
							<Timeline />
						</OverflowAutoFlexRow>
					</Overlay>
				</Overlay>
			</FlexRow>
		);
	}

	/*
		Structure:
		- OverflowAuto FlexRow to prevent the MenuBar from scrolling.
			- Individual pieces in a row.
	*/
	return (
		<OverflowAutoFlexRow>
			<FlexColumn flex='none'>
				<Summary isCompactVertical={false} />
				<Timeline />
			</FlexColumn>
			<RegularWidthFlexColumn flex='none'>
				<Forecast />
			</RegularWidthFlexColumn>
			<RegularWidthFlexColumn flex='none'>
				<Settings />
			</RegularWidthFlexColumn>
		</OverflowAutoFlexRow>
	);
};

