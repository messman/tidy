import * as React from "react";
import { Flex } from "@/unit/components/flex";
import styled from "@/styles/styled";
import * as C from "@/styles/common";
import { TextPlaceholder } from "@/styles/placeholder";
import { createPrettyTimespan } from "@/services/time";
import { useAppDataContext } from "../appData";

interface CurrentConditionsProps {
}

export const CurrentConditions: React.FC<CurrentConditionsProps> = () => {

	const { isLoading, success } = useAppDataContext();

	let tempText = "";
	let weatherText = "";
	let sunText = "";
	let windText = "";
	if (!isLoading && success && success.data) {
		const { weather, sun } = success.data!.current;

		tempText = `${weather.temp} F`;
		weatherText = weather.status.toString();
		if (weatherText !== 'raining') {
			weatherText += `, ${weather.chanceRain.entity! * 100}% chance for rain`;
		}

		sunText = `${sun.next.isSunrise ? "Sunrise" : "Sunset"} ${createPrettyTimespan(sun.next.time.getTime() - success.info.referenceTime.getTime())}`

		windText = `${weather.wind} mph winds, ${weather.windDirection}`;
	}

	return (
		<>
			<Flex />
			<Padding>
				<C.Text>
					<TextPlaceholder show={isLoading} length={6}>
						{tempText}
					</TextPlaceholder>
				</C.Text>
				<C.Text>
					<TextPlaceholder show={isLoading} length={16}>
						{weatherText}
					</TextPlaceholder>
				</C.Text>
				<C.Text>
					<TextPlaceholder show={isLoading} length={10}>
						{sunText}
					</TextPlaceholder>
				</C.Text>
				<C.Text>
					<TextPlaceholder show={isLoading} length={11}>
						{windText}
					</TextPlaceholder>
				</C.Text>
			</Padding>
		</>
	);
}

const Padding = styled.div`
	padding: 1rem;
`;