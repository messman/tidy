import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";
import { useResponsiveLayoutContext } from "@/unit/hooks/useResponsiveLayout";
import { ResponsiveLayoutType, getLayoutRange } from "../responsiveLayout";
import { APIResponse } from "../../../../data";
import { CurrentConditions } from "./currentConditions";
import { Wave, WaveAnimationOptions } from "./wave/wave";
import { UpperTimeline } from "./upperTimeline";
import { useAppDataContext } from "../appData";

interface TimelineProps {
}

export const Timeline: React.FC<TimelineProps> = (props) => {
	const layout = useResponsiveLayoutContext();
	console.log(layout, ResponsiveLayoutType[layout], getLayoutRange(layout));

	const waveAnimationOptions: WaveAnimationOptions = {
		amplitude: 10,
		waveSeparation: 12,
		topBottomPadding: 0,
		period: 210,
		periodVariation: 5,
		periodSeconds: 4.5,
		periodSecondsVariation: 2,
		timeOffsetSecondsVariation: -3
	};

	return (
		<Border>
			<FlexRow flex={"none"}>
				<One>
					<CurrentConditions {...props} />
				</One>
				<Other>
					<UpperTimeline />
				</Other>
			</FlexRow>
			<FlexRow>
				<One>
					<Wave animationOptions={waveAnimationOptions} />
				</One>
				<Other>Hello</Other>
			</FlexRow>
		</Border>
	);
}

const Border = styled(FlexColumn)`
	overflow-y: auto;
	white-space: nowrap;
`;

const One = styled(FlexColumn)`
	width: 100vw;
	max-width: ${ResponsiveLayoutType.regular}px;
	flex: none;
	position: relative;
`;

const Other = styled(Flex)`
	flex-shrink: 0;
	flex: 1;
	min-width: 500px;
`