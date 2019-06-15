import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";
import { TextPlaceholder } from "@/styles/placeholder";
import { createPrettyTimespan } from "@/services/time";
import { useAppDataContext } from "../appData";

interface CurrentConditionsProps {
}

export const CurrentConditions: React.FC<CurrentConditionsProps> = (props) => {

	const { isLoading, success } = useAppDataContext();

	let tempText = "";
	let weatherText = "";
	let sunText = "";
	let windText = "";
	if (!isLoading && success && success.success) {
		const { weather, sun } = success.success.current;

		tempText = `${weather.temp} ${weather.tempUnit}`;
		weatherText = weather.status;
		if (weather.status !== 'raining') {
			weatherText += `, ${weather.chanceRain * 100}% chance for rain`;
		}

		sunText = `${sun.next.isSunrise ? "Sunrise" : "Sunset"} ${createPrettyTimespan(sun.next.time.getTime() - success.info.time.getTime())}`

		windText = `${weather.wind} ${weather.windUnit} winds, ${weather.windDirection}`;
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