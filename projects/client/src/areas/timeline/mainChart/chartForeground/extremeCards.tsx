import * as React from 'react';
import { styled, StyledFC } from '@/core/style/styled';
import { SmallText } from '@/core/symbol/text';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { timeToPixels, getTimeTwelveHour } from '@/services/time';
import { TideEvent } from 'tidy-shared';

interface ExtremeCardsProps {
	heightInPixels: number;
}

export const ExtremeCards: StyledFC<ExtremeCardsProps> = (props) => {
	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState) || props.heightInPixels < 1) {
		return null;
	}

	const startTime = allResponseState.data!.info.referenceTime;
	const tides = allResponseState.data!.all.predictions.tides;
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
					key={tideEvent.time.valueOf()}
					tideEvent={tideEvent}
					left={left}
					bottom={percent}
				/>
			);
		}
		else {
			return (
				<TopExtremeCard
					key={tideEvent.time.valueOf()}
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
	const lowHighText = props.tideEvent.isLow ? 'Low' : 'High';
	const timeText = getTimeTwelveHour(props.tideEvent.time).time;
	const heightText = `${props.tideEvent.height} ft`;

	const inner = (
		<>
			<SmallText>{lowHighText}</SmallText>
			<SmallText>{timeText}</SmallText>
			<SmallText>{heightText}</SmallText>
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
	left: ${p => p.left}px;
	
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const TopExtremeCard = styled(ExtremeCard)`
	top: ${p => p.top}%;
`;

const BottomExtremeCard = styled(ExtremeCard)`
	bottom: ${p => p.bottom}%;
	justify-content: flex-end;
`;

const CardBackground = styled.div`
	background-color: ${p => p.theme.color.background};
	padding: .2rem .6rem;
	text-align: left;
	border-color: ${p => p.theme.color.background};
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
	background-color: ${p => p.theme.color.background};
	flex-shrink: 0;
`;