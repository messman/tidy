import * as React from 'react';
import { Flex, FlexColumn } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { Title } from '@/core/symbol/text';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';
import { DailyView } from './dailyView/dailyView';
import { TimeSlider } from './timeSlider';

interface LongTermProps {
}

const minHour = 6;
const maxHour = 22;

const minHourDate = new Date();
minHourDate.setHours(minHour);
const minHourText = '';
const maxHourDate = new Date();
maxHourDate.setHours(maxHour);
const maxHourText = '';

export const LongTerm: React.FC<LongTermProps> = () => {
	return (
		<FlexColumn>
			<PaddingWithoutBottom>
				<Title>Long-term tides</Title>
				<TimeSlider
					minHour={minHour}
					minHourText={minHourText}
					maxHour={maxHour}
					maxHourText={maxHourText}
				/>
			</PaddingWithoutBottom>
			<ScrollFlex>
				<LongTermDailyViewList />
			</ScrollFlex>
		</FlexColumn>
	);
}

const ScrollFlex = styled(Flex)`
	overflow-y: auto;
	flex-basis: 0;
	z-index: 0;
	background-image: linear-gradient(180deg, ${p => p.theme.color.backgroundLighter} 0%, ${p => p.theme.color.background} 100%);
`;

const PaddingWithoutBottom = styled.div`
	padding: 1rem;
	padding-bottom: 0;
	z-index: 3;
`;

interface LongTermDailyViewListProps {
}

export const LongTermDailyViewList: React.FC<LongTermDailyViewListProps> = () => {
	const allResponsePromise = useAllResponse();
	if (!hasAllResponseData(allResponsePromise)) {
		return null;
	}

	const daily = allResponsePromise.data!.all!.daily;

	const list = daily.days.map(function (day, index) {
		return <DailyView
			key={day.date.valueOf()}
			dailyEvent={day}
			isToday={index === 0}
			minHour={minHour}
			maxHour={maxHour}
			minTideHeight={day.tides.lowest.height}
			maxTideHeight={day.tides.highest.height}
		/>
	});

	return (
		<>{list}</>
	);
}