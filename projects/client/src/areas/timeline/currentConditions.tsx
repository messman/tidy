import * as React from 'react';
import { Flex } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { Text } from '@/core/symbol/text';
import { getHumanTime } from '@/services/time';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';

interface CurrentConditionsProps {
}

export const CurrentConditions: React.FC<CurrentConditionsProps> = () => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	let tempText = '';
	let weatherText = '';
	let sunText = '';
	let windText = '';
	const { weather, sun } = allResponseState.data!.all.current;

	tempText = `${weather.temp} F`;
	weatherText = weather.status.toString();
	if (weatherText !== 'raining') {
		weatherText += `, ${weather.chanceRain.entity! * 100}% chance for rain`;
	}

	sunText = `${sun.next.isSunrise ? 'Sunrise' : 'Sunset'} ${getHumanTime(sun.next.time.diff(allResponseState.data!.info.referenceTime, 'millisecond').milliseconds)}`

	windText = `${weather.wind} mph winds, ${weather.windDirection}`;

	return (
		<>
			<Flex />
			<Padding>
				<Text>
					{tempText}
				</Text>
				<Text>
					{weatherText}
				</Text>
				<Text>
					{sunText}
				</Text>
				<Text>
					{windText}
				</Text>
			</Padding>
		</>
	);
}

const Padding = styled.div`
	padding: 1rem;
`;