import { DateTime } from 'luxon';
import * as React from 'react';
import { MoonPhaseIcon } from '@/core/astro/moon-phase-icon';
import { LabelText } from '@/core/label';
import { Line } from '@/core/layout/layout';
import { fontStyleDeclarations } from '@/core/text';
import { Block, Spacing } from '@/core/theme/box';
import { FontWeight } from '@/core/theme/font';
import { styled } from '@/core/theme/styled';
import { WeatherStatusIcon } from '@/core/weather/weather-icon';
import { useBatchResponse } from '@/services/data/data';
import { getRelativeDayText } from '@/services/time';
import * as iso from '@wbtdevlocal/iso';
import { BeachTimeRangeView } from './beach-time-range';

export const BeachTimeDays: React.FC = () => {
	const { success } = useBatchResponse();
	const reference = success!.meta.referenceTime;
	const days = success!.beach.days;

	const filteredDays = days.filter((day, i) => {
		// If today has no ranges, ignore it because it just takes up space.
		// Also, it could be basically the end of the day.
		if (i === 0 && !day.ranges.length) {
			return false;
		}
		return true;
	});

	const daysRender = filteredDays.map((day, i) => {
		const lineRender = i !== 0 ? <Line /> : null;
		return (
			<React.Fragment key={day.day.toMillis()}>
				{lineRender}
				<BeachTimeDay day={day} reference={reference} />
			</React.Fragment>
		);
	});

	return (
		<>
			<Line />
			<PaddedListContainer>
				{daysRender}
			</PaddedListContainer>
			<Line />
		</>
	);
};

const PaddedListContainer = styled.div`
	padding-left: ${Spacing.dog16};
`;

interface BeachTimeDayProps {
	reference: DateTime;
	day: iso.Batch.BeachTimeDay;
}

const BeachTimeDay: React.FC<BeachTimeDayProps> = (props) => {
	const { reference } = props;
	const { day, astro, weather } = props.day;

	let dayText = getRelativeDayText(day, reference) || day.weekdayLong;

	return (
		<BeachTimeDayContainer>
			<BeachTimeDaySide>
				<div>
					<LabelText size='medium'>{dayText}</LabelText>
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
				<BeachTimeRangeView day={props.day} />
			</BeachTimeDayRightSide>
		</BeachTimeDayContainer>
	);
};

const BeachTimeDayContainer = styled.div`
	display: flex;
	padding: ${Spacing.dog16};
	padding-left: 0;
`;

const BeachTimeDaySide = styled.div`
	flex: 1;
`;

const BeachTimeDayRightSide = styled(BeachTimeDaySide)`
	// Leave enough space for time on the right side
	min-width: 9.5rem;
`;

const SubtleText = styled.div`
	${fontStyleDeclarations.bodySmall};
	color: ${p => p.theme.textSubtle};
`;

const SubtleTextLabel = styled.span`
	font-weight: ${FontWeight.medium};
`;

const IconsContainer = styled.div`
	display: flex;
`;