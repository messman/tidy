import * as React from 'react';
import styled from 'styled-components';
import { BeachTimeDay } from '@wbtdevlocal/iso';
import { WeekDayBeach } from './week-day-beach';
import { WeekDayTide } from './week-day-tide';
import { WeekDayWeather } from './week-day-weather';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: .125rem;
`;

export interface WeekDayProps {
	day: BeachTimeDay;
	isShowingWeather: boolean;
	isShowingBeach: boolean;
	isShowingTide: boolean;
};

export const WeekDay: React.FC<WeekDayProps> = (props) => {
	const { day, isShowingWeather, isShowingBeach, isShowingTide } = props;

	return (
		<Container>
			{isShowingWeather && (
				<WeekDayWeather
					day={day}
					isTop={true}
					isBottom={!isShowingBeach && !isShowingTide}
				/>
			)}
			{isShowingBeach && (
				<WeekDayBeach
					day={day}
					isTop={!isShowingWeather}
					isBottom={!isShowingTide}
				/>
			)}
			{isShowingTide && (
				<WeekDayTide
					day={day}
					isTop={!isShowingWeather && !isShowingBeach}
					isBottom={true}
				/>
			)}
		</Container>
	);
};