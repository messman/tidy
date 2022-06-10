import { DateTime } from 'luxon';
import * as React from 'react';
import { BadgeCollection, DaylightBadge, TideLevelBadge, WeatherBadge } from '@/core/badge/badge';
import { Spacing } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';

export const BeachTimeDays: React.FC = () => {



	return (
		
	);
};

interface BeachTimeDayProps {
	day: DateTime;

}

const BeachTimeDay: React.FC<BeachTimeDayProps> = (props) => {
	const { } = props;

	return (
		<BeachTimeDayContainer>
			<BeachTimeDaySide>

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