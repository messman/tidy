import * as React from "react";
import { usePromise } from "@/unit/hooks/usePromise";
import { useResponsiveLayoutContext, ResponsiveLayoutProvider } from "@/unit/hooks/useResponsiveLayout";
import * as Noaa from "../services/noaa";
import { ResponsiveLayout } from "./responsiveLayout";


interface AppProps {
}

export const App: React.FC<AppProps> = (props) => {

	//const { success, error, isLoading } = usePromise(() => Noaa.getNoaaData(650));
	const layout = useResponsiveLayoutContext();
	console.log(layout);

	return (
		<ResponsiveLayout
			layout={layout}

		/>
	);
}



