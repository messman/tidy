import * as React from "react";
import { usePromise } from "@/unit/hooks/usePromise";
import { useResponsiveLayoutContext, ResponsiveLayoutProvider } from "@/unit/hooks/useResponsiveLayout";
import * as Noaa from "../services/noaa";
import { ResponsiveLayout } from "./responsiveLayout";
import { Footer } from "./footer/footer";
import { SVGToggleState } from "./footer/svgToggle";


interface AppProps {
}

export const App: React.FC<AppProps> = (props) => {

	//const { success, error, isLoading } = usePromise(() => Noaa.getNoaaData(650));
	const layout = useResponsiveLayoutContext();
	console.log(layout);

	const longTermToggleState = SVGToggleState.visible;
	const aboutToggleState = SVGToggleState.on;

	return (
		<ResponsiveLayout
			layout={layout}
			footer={<Footer longTermToggleState={longTermToggleState} aboutToggleState={aboutToggleState} />}
		/>
	);
}



