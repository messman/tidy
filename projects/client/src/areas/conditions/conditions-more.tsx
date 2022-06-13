import * as React from 'react';
import { GroupContainer, GroupKeyValue } from '@/core/group/group';
import { IconInputType, SizedIcon } from '@/core/icon/icon';
import { styled } from '@/core/theme/styled';
import { useBatchResponse } from '@/services/data/data';
import { icons } from '@wbtdevlocal/assets';
import * as iso from '@wbtdevlocal/iso';

export const ConditionsMore: React.FC = () => {
	const { weather } = useBatchResponse().success!;
	const { wind, windDirection, pressure, visibility, cloudCover, humidity, uvi } = weather.current;

	let uviText = '';
	if (uvi >= 11) {
		uviText = 'extreme';
	}
	else if (uvi >= 8) {
		uviText = 'very high';
	}
	else if (uvi >= 6) {
		uviText = 'high';
	}
	else if (uvi >= 6) {
		uviText = 'moderate';
	}
	else {
		uviText = 'low';
	}

	return (
		<GroupContainer>
			<GroupKeyValue icon={makeSubtleIcon(icons.weatherWind)} label='Wind'>{wind} knots from {iso.keyForEnumValue(iso.Weather.WindDirection, windDirection)}</GroupKeyValue>
			<GroupKeyValue icon={makeSubtleIcon(icons.weatherSun)} label='UV Index'>{uvi} ({uviText})</GroupKeyValue>
			<GroupKeyValue icon={makeSubtleIcon(icons.weatherCloud)} label='Cloud Cover'>{Math.round(cloudCover * 100)}%</GroupKeyValue>
			<GroupKeyValue icon={makeSubtleIcon(icons.weatherFog)} label='Visibility'>{visibility ? visibility : '10+'} miles</GroupKeyValue>
			<GroupKeyValue icon={makeSubtleIcon(icons.weatherPressure)} label='Air Pressure'>{pressure} mHg</GroupKeyValue>
			<GroupKeyValue icon={makeSubtleIcon(icons.weatherWater)} label='Humidity'>{Math.round(humidity * 100)}%</GroupKeyValue>
		</GroupContainer>
	);
};

function makeSubtleIcon(icon: IconInputType): JSX.Element {
	return <SubtleIcon type={icon} size='medium' />;
}

const SubtleIcon = styled(SizedIcon)`
	color: ${p => p.theme.textSubtle};

	path {
		fill: ${p => p.theme.textSubtle};
	}
`;