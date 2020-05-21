import * as React from 'react';
import { LayoutBreakpoint, useResponsiveLayout } from '@/services/layout/responsive-layout';

export interface ComponentLayout {
	/** Whether or not the application is viewing the forecast component while in the compact view. */
	isCompactForecastView: boolean,
	/** Whether or not the application is viewing the settings component while in the compact view. */
	isCompactSettingsView: boolean,
}

export type UseComponentLayoutReturnType = [ComponentLayout, React.Dispatch<React.SetStateAction<ComponentLayout>>];

const ComponentLayoutContext = React.createContext<UseComponentLayoutReturnType>(null!);
export const useComponentLayout = () => React.useContext(ComponentLayoutContext);

const defaultComponentLayout: ComponentLayout = {
	isCompactForecastView: false,
	isCompactSettingsView: false
};

export const ComponentLayoutProvider: React.FC = (props) => {
	const responsiveLayout = useResponsiveLayout();
	const layoutState = React.useState<ComponentLayout>(defaultComponentLayout);

	const [componentLayout, setComponentLayout] = layoutState;
	React.useEffect(() => {
		// Remember, effects are run on mount. So check each time to prevent unnecessary renders.
		if (responsiveLayout.widthBreakpoint !== LayoutBreakpoint.compact && (componentLayout.isCompactForecastView || componentLayout.isCompactSettingsView)) {
			setComponentLayout(defaultComponentLayout);
		}
	}, [responsiveLayout.widthBreakpoint === LayoutBreakpoint.compact]);

	return (
		<ComponentLayoutContext.Provider value={layoutState}>
			{props.children}
		</ComponentLayoutContext.Provider>
	);
};