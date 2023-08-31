import * as React from 'react';
import styled, { css } from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { fontStyles, MediumBodyText } from '@/index/core/text/text-shared';
import { TimeTextUnit } from '@/index/core/text/text-unit';
import { themeTokens } from '@/index/core/theme/theme-root';
import { getTimeTwelveHourRange, roundFiveMinutes } from '@/index/core/time/time';
import { BeachTimeDay, WeatherIndicator } from '@wbtdevlocal/iso';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: .125rem;
`;

const TimeLeftContainer = styled.div`
	display: flex;
	align-items: center;
	gap: .5rem;
`;

const TimeContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: .5rem;
`;

const weatherIndicatorStyles = css`
	width: .5rem;
	height: .5rem;
	border-radius: 50%;
`;

const WeatherIndicatorPast = styled.div`
	${weatherIndicatorStyles}
	background-color: ${themeTokens.inform.base};
`;
const WeatherIndicatorBest = styled.div`
	${weatherIndicatorStyles}
	background-color: ${themeTokens.inform.positive};
`;
const WeatherIndicatorOkay = styled.div`
	${weatherIndicatorStyles}
	background-color: ${themeTokens.inform.unsure};
`;

const LowText = styled.div`
	${fontStyles.text.small}
	color: ${themeTokens.text.subtle};
`;

export type BeachChartTimesProps = {
	day: BeachTimeDay;
};

export const BeachChartTimes: React.FC<BeachChartTimesProps> = (props) => {
	const { day } = props;
	const { meta, getTideExtremeById } = useBatchResponseSuccess();
	const { referenceTime } = meta;

	const timesRender = day.ranges.map((range) => {

		const isInPast = referenceTime > range.stop;
		const tideLow = getTideExtremeById(range.tideLowId);
		const Indicator = isInPast ? WeatherIndicatorPast : (range.weather === WeatherIndicator.best ? WeatherIndicatorBest : WeatherIndicatorOkay);

		return (
			<TimeContainer key={range.start.toMillis()}>
				<TimeLeftContainer>
					<Indicator />
					<MediumBodyText>{getTimeTwelveHourRange(roundFiveMinutes(range.start), roundFiveMinutes(range.stop))}</MediumBodyText>
				</TimeLeftContainer>
				<LowText>Low <TimeTextUnit dateTime={tideLow.time} /></LowText>
			</TimeContainer>
		);
	});

	return (
		<Container>
			{timesRender}
		</Container>
	);
};