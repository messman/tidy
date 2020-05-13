import * as React from 'react';
import { LayoutBreakpoint, useResponsiveLayout } from '@/services/layout/responsive-layout';

export interface ComponentLayout {
	isCompactForecastView: boolean,
	isCompactSettingsView: boolean,
}

export type UseComponentLayoutReturnType = [ComponentLayout, React.Dispatch<React.SetStateAction<ComponentLayout>>];

const ComponentLayoutContext = React.createContext<UseComponentLayoutReturnType>(null!);
export const useComponentLayout = () => React.useContext(ComponentLayoutContext);

function getDefaultComponentLayout(): ComponentLayout {
	return {
		isCompactForecastView: false,
		isCompactSettingsView: false
	};
}

export const ComponentLayoutProvider: React.FC = (props) => {

	const responsiveLayout = useResponsiveLayout();

	const layoutState = React.useState<ComponentLayout>(getDefaultComponentLayout);

	const [componentLayout, setComponentLayout] = layoutState;
	React.useEffect(() => {
		if (responsiveLayout.widthBreakpoint !== LayoutBreakpoint.compact && (componentLayout.isCompactForecastView || componentLayout.isCompactSettingsView)) {
			setComponentLayout(getDefaultComponentLayout);
		}
	}, [responsiveLayout.widthBreakpoint === LayoutBreakpoint.compact]);

	return (
		<ComponentLayoutContext.Provider value={layoutState}>
			{props.children}
		</ComponentLayoutContext.Provider>
	)
}