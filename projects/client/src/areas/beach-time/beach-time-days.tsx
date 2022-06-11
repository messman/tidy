import { DateTime } from 'luxon';
import * as React from 'react';
import { MoonPhaseIcon } from '@/core/astro/moon-phase-icon';
import { LabelText } from '@/core/label';
import { fontStyleDeclarations } from '@/core/text';
import { Block, Spacing } from '@/core/theme/box';
import { FontWeight } from '@/core/theme/font';
import { styled } from '@/core/theme/styled';
import { WeatherStatusIcon } from '@/core/weather/weather-icon';
import { useBatchResponse } from '@/services/data/data';
import { getRelativeDayText } from '@/services/time';
import * as iso from '@wbtdevlocal/iso';

export const BeachTimeDays: React.FC = () => {
	const { success } = useBatchResponse();
	const reference = success!.meta.referenceTime;
	const days = success!.beach.days;

	const daysRender = days.map((day) => {
		return <BeachTimeDay key={day.day.toMillis()} day={day} reference={reference} />;
	});

	return (
		<>
			{daysRender}
		</>
	);
};

interface BeachTimeDayProps {
	reference: DateTime;
	day: iso.Batch.BeachTimeDay;
}

const BeachTimeDay: React.FC<BeachTimeDayProps> = (props) => {
	const { reference } = props;
	const { day, astro, weather, ranges } = props.day;

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
				<IconsContainer>
					<WeatherStatusIcon status={weather.status} isDay={true} />
					<Block.Ant04 />
					<MoonPhaseIcon phase={astro.moon} />
				</IconsContainer>
			</BeachTimeDaySide>
			<BeachTimeDaySide>

			</BeachTimeDaySide>
		</BeachTimeDayContainer>
	);
};

const BeachTimeDayContainer = styled.div`
	display: flex;
	padding: ${Spacing.dog16};
	padding-right: 0;
`;

const BeachTimeDaySide = styled.div`
	flex: 1;
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
