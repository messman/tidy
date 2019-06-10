import * as React from "react";
import { useState, useEffect } from "react";
import { usePromise } from "@/unit/hooks/usePromise";
import { useResponsiveLayoutContext, ResponsiveLayoutType } from "@/unit/hooks/useResponsiveLayout";
import * as Noaa from "../services/noaa";
import { ResponsiveLayout } from "./responsiveLayout";
import { Footer } from "./footer/footer";
import { SVGToggleState, SVGToggle } from "./footer/svgToggle";


interface AppProps {
}

function pickLongTermToggleState(previous: SVGToggleState, layout: ResponsiveLayoutType): SVGToggleState {
	if (layout === ResponsiveLayoutType.wide)
		return SVGToggleState.hidden;
	else if (previous === SVGToggleState.hidden)
		return SVGToggleState.visible;
	return previous;
}

export const App: React.FC<AppProps> = (props) => {
	//const { success, error, isLoading } = usePromise(() => Noaa.getNoaaData(650));
	const layout = useResponsiveLayoutContext();
	console.log(layout);


	const [longTermToggleState, setLongTermToggleState] = useState<SVGToggleState>(pickLongTermToggleState(SVGToggleState.visible, layout));
	const [aboutToggleState, setAboutToggleState] = useState<SVGToggleState>(SVGToggleState.visible);

	useEffect(() => {
		setLongTermToggleState((prev) => {
			return pickLongTermToggleState(prev, layout);
		});
	}, [layout]);

	function longTermOnToggle(isOn: boolean) {
		setLongTermToggleState(isOn ? SVGToggleState.on : SVGToggleState.visible);
		setAboutToggleState(SVGToggleState.visible);
	}

	function aboutOnToggle(isOn: boolean) {
		setAboutToggleState(isOn ? SVGToggleState.on : SVGToggleState.visible);
		setLongTermToggleState(pickLongTermToggleState(SVGToggleState.visible, layout));
	}

	return (
		<ResponsiveLayout
			layout={layout}
			fillWithLongTerm={longTermToggleState === SVGToggleState.on}
			fillWithAbout={aboutToggleState === SVGToggleState.on}

			footer={
				<Footer
					longTermToggleState={longTermToggleState}
					longTermOnToggle={longTermOnToggle}
					aboutToggleState={aboutToggleState}
					aboutOnToggle={aboutOnToggle}
				/>
			}
		/>
	);
}



