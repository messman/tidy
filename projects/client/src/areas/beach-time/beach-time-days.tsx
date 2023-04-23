import { DateTime } from 'luxon';
import * as React from 'react';
import styled from 'styled-components';
import { MoonPhaseIcon } from '@/core/astro/moon-phase-icon';
import { Block, SubtleLine } from '@/core/layout';
import { FontWeight, Spacing } from '@/core/primitive/primitive-design';
import { fontStyles, MediumLabelText } from '@/core/text';
import { themeTokens } from '@/core/theme';
import { WeatherStatusIcon } from '@/core/weather/weather-icon';
import { useBatchResponse } from '@/services/data/data';
import { getRelativeDayText, getTimeTwelveHourString } from '@/services/time';
import * as iso from '@wbtdevlocal/iso';
import { BeachTimeRangeView } from './beach-time-range';

export const BeachTimeDays: React.FC = () => {
	const { success } = useBatchResponse();
	const referenceTime = success!.meta.referenceTime;
	const days = success!.beach.days;

	const daysRender = days.map((day, i) => {
		const lineRender = i !== 0 ? <SubtleLine /> : null;
		return (
			<React.Fragment key={day.day.toMillis()}>
				{lineRender}
				<BeachTimeDay day={day} referenceTime={referenceTime} />
			</React.Fragment>
		);
	});

	return (
		<>
			<SubtleLine />
			<PaddedListContainer>
				{daysRender}
			</PaddedListContainer>
			<SubtleLine />
		</>
	);
};

const PaddedListContainer = styled.div`
	padding-left: ${Spacing.dog16};
`;

interface BeachTimeDayProps {
	referenceTime: DateTime;
	day: iso.Batch.BeachTimeDay;
}

const BeachTimeDay: React.FC<BeachTimeDayProps> = (props) => {
	const { referenceTime } = props;
	const { day, astro, weather, tideLows } = props.day;

	let dayText = getRelativeDayText(day, referenceTime) || day.weekdayLong;

	let lowsText = 'No low tides';
	if (tideLows.length) {
		lowsText = tideLows.length > 1 ? 'Lows: ' : 'Low: ';
		const times = tideLows
			.map((low) => {
				return getTimeTwelveHourString(low.time);
			})
			.join(', ');
		lowsText += times;
	}

	return (
		<BeachTimeDayContainer>
			<BeachTimeDaySide>
				<div>
					<MediumLabelText>{dayText}</MediumLabelText>
				</div>
				<SubtleText>
					<SubtleTextLabel>{Math.round(weather.maxTemp)}&deg;</SubtleTextLabel>
					&nbsp;&middot;&nbsp;{Math.round(weather.minTemp)}&deg;
				</SubtleText>
				<Block.Ant04 />
				<IconsContainer>
					<WeatherStatusIcon status={weather.status} isDay={true} />
					<Block.Bat08 />
					<MoonPhaseIcon phase={astro.moon} />
				</IconsContainer>
			</BeachTimeDaySide>
			<BeachTimeDayRightSide>
				<BeachTimeRangeView day={props.day} referenceTime={referenceTime} />
				<Block.Bat08 />
				<LowTidesText>{lowsText}</LowTidesText>
			</BeachTimeDayRightSide>
		</BeachTimeDayContainer>
	);
};

const BeachTimeDayContainer = styled.div`
	display: flex;
	padding: ${Spacing.dog16};
	padding-left: 0;
	gap: ${Spacing.ant04};
`;

const BeachTimeDaySide = styled.div`
	flex: 1;
`;

const BeachTimeDayRightSide = styled(BeachTimeDaySide)`
	// Leave enough space for time on the right side
	min-width: 10.5rem;
	flex: 1.5;
`;

const SubtleText = styled.div`
	${fontStyles.text.small};
	color: ${themeTokens.text.subtle};
`;

const SubtleTextLabel = styled.span`
	font-weight: ${FontWeight.medium};
`;

const IconsContainer = styled.div`
	display: flex;
`;

const LowTidesText = styled.div`
	${fontStyles.text.small};
	color: ${themeTokens.text.subtle};
	text-align: right;
`;