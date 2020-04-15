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
import { MainChart } from "./mainChart/mainChart";

interface TimelineProps {
}

export const Timeline: React.FC<TimelineProps> = (props) => {
	const layout = useResponsiveLayoutContext();

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
		<Container>
			<Upper flex={"none"}>
				<One>
					<CurrentConditions {...props} />
				</One>
				<Border />
				<Other>
					<UpperTimeline />
				</Other>
			</Upper>
			<FlexRow>
				<One>
					<Wave animationOptions={waveAnimationOptions} />
				</One>
				<Border />
				<Other>
					<MainChart />
				</Other>
			</FlexRow>
		</Container>
	);
}

// So that timeline markers show over the chart lines
const Upper = styled(FlexRow)`
	z-index: 5;
`;

const Container = styled(FlexColumn)`
	overflow-y: auto;
	white-space: nowrap;
`;

const One = styled(FlexColumn)`
	width: 100vw;
	max-width: ${ResponsiveLayoutType.regular}px;
	flex: none;
	position: relative;
`;

const Border = styled.div`
	position: relative;
	z-index: 1000;
	height: 100%;
	width: 2px;
	background-color: ${props => props.theme.color.bgDark};
	flex-shrink: 0;
`;

const Other = styled(FlexColumn)`
	flex-shrink: 0;
	flex: 1;
`;