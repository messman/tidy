import * as React from 'react';
import { Forecast, ForecastProps } from '@/areas/forecast/forecast';
import { Settings, SettingsProps } from '@/areas/settings/settings';
import { Summary, SummaryProps } from '@/areas/summary/summary';
import { Timeline, TimelineProps } from '@/areas/timeline/timeline';
import { FlexRow, FlexColumn } from '@/core/layout/flex';
import { Overlay } from '@/core/layout/overlay';
import { useResponsiveLayout, LayoutBreakpoint } from '@/services/layout/responsive-layout';
import { useComponentLayout } from './component-layout';
import { OverflowAutoFlexRow, ScreenWidthFlexColumn } from '@/core/layout/common';

export const ApplicationResponsiveLayout: React.FC = () => {
	return (
		<ResponsiveLayout
			Summary={Summary}
			Timeline={Timeline}
			Forecast={Forecast}
			Settings={Settings}
		/>
	);
}

interface ResponsiveLayoutProps {
	Summary: React.FC<SummaryProps>,
	Timeline: React.FC<TimelineProps>,
	Forecast: React.FC<ForecastProps>,
	Settings: React.FC<SettingsProps>,
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = (props) => {
	const { Summary, Timeline, Forecast, Settings } = props;

	const responsiveLayout = useResponsiveLayout();
	const [componentLayout] = useComponentLayout();

	// TODO - When moving from compact to non-compact, React tree is destroyed.
	const isCompact = responsiveLayout.widthBreakpoint === LayoutBreakpoint.compact;
	if (isCompact) {
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

	return (
		<OverflowAutoFlexRow>
			<FlexColumn>
				<Summary isCompactVertical={false} />
				<Timeline />
			</FlexColumn>
			<Forecast />
			<Settings />
		</OverflowAutoFlexRow>
	);
}

