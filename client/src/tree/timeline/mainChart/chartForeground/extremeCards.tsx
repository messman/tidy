import * as React from "react";
import styled, { StyledFC } from "@/styles/theme";
import * as C from "@/styles/common";
import { useAppDataContext } from "@/tree/appData";
import { timeToPixels, createPrettyTime } from "@/services/time";
import { TideEvent } from "tidy-shared";

interface ExtremeCardsProps {
	heightInPixels: number;
}

export const ExtremeCards: StyledFC<ExtremeCardsProps> = (props) => {
	const { isLoading, success } = useAppDataContext();

	if (isLoading || !success || props.heightInPixels < 1) {
		return null;
	}

	const startTime = success.info.referenceTime;
	const tides = success.data!.predictions.tides;
	const tideEvents = tides.events;
	const maxHeight = tides.highest.height;
	const minHeight = tides.lowest.height;

	const cards = tideEvents.map(function (tideEvent, index) {
		if (index === tideEvents.length - 1) {
			return null;
		}

		const left = timeToPixels(startTime, tideEvent.time);
		if (left < 50) {
			return null;
		}

		const percent = ((tideEvent.height - minHeight) / (maxHeight - minHeight)) * 100;

		if (tideEvent.isLow) {
			return (
				<BottomExtremeCard
					key={tideEvent.time.getTime()}
					tideEvent={tideEvent}
					left={left}
					bottom={percent}
				/>
			);
		}
		else {
			return (
				<TopExtremeCard
					key={tideEvent.time.getTime()}
					tideEvent={tideEvent}
					left={left}
					top={(100 - percent)}
				/>
			);
		}
	});
	return <>{cards}</>
}

interface ExtremeCardProps {
	tideEvent: TideEvent;
	left: number;
	top?: number;
	bottom?: number;
}

const _ExtremeCard: StyledFC<ExtremeCardProps> = (props) => {
	const lowHighText = props.tideEvent.isLow ? "Low" : "High";
	const timeText = createPrettyTime(props.tideEvent.time);
	const heightText = `${props.tideEvent.height} ft`;

	const inner = (
		<>
			<C.SmallText>{lowHighText}</C.SmallText>
			<C.SmallText>{timeText}</C.SmallText>
			<C.SmallText>{heightText}</C.SmallText>
		</>
	);

	let content: JSX.Element | null = null;
	if (!props.tideEvent.isLow) {
		content = (
			<>
				<Line />
				<TopCardBackground>
					{inner}
				</TopCardBackground>
			</>
		);
	}
	else {
		content = (
			<>
				<BottomCardBackground>
					{inner}
				</BottomCardBackground>
				<Line />
			</>
		);
	}

	return (
		<div className={props.className}>
			{content}
		</div>
	);
}

const ExtremeCard = styled(_ExtremeCard)`
	position: absolute;
	width: 1px;
	height: 1px;
	left: ${props => props.left}px;
	
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const TopExtremeCard = styled(ExtremeCard)`
	top: ${props => props.top}%;
`;

const BottomExtremeCard = styled(ExtremeCard)`
	bottom: ${props => props.bottom}%;
	justify-content: flex-end;
`;

const CardBackground = styled.div`
	background-color: ${props => props.theme.color.bgMed};
	padding: .2rem .6rem;
	text-align: left;
	border-color: ${props => props.theme.color.layerLight};
	border-style: solid;
	border-width: 0;
`;

const TopCardBackground = styled(CardBackground)`
	border-top-width: 1px;
`;

const BottomCardBackground = styled(CardBackground)`
	border-bottom-width: 1px;
`;

const Line = styled.div`
	height: 5vh;
	width: 1px;
	background-color: ${props => props.theme.color.layerLight};
	flex-shrink: 0;
`;