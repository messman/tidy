import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";
import { RSuccessCurrent, RError, APIResponse } from "../../../../data";
import { TextPlaceholder } from "@/styles/placeholder";
import { createPrettyTimespan } from "@/services/time";

interface CurrentConditionsProps {
	isLoading: boolean,
	apiResponse: APIResponse
}

export const CurrentConditions: React.FC<CurrentConditionsProps> = (props) => {

	const { isLoading, apiResponse } = props;

	let tempText = "";
	let weatherText = "";
	let sunText = "";
	let windText = "";
	if (!isLoading && apiResponse && apiResponse.success) {
		const { weather, sun } = apiResponse.success.current;

		tempText = `${weather.temp} ${weather.tempUnit}`;
		weatherText = weather.status;
		if (weather.status !== 'raining') {
			weatherText += `, ${weather.chanceRain * 100}% chance for rain`;
		}

		sunText = `${sun.nextEvent.isSunrise ? "Sunrise" : "Sunset"} ${createPrettyTimespan(sun.nextEvent.time.getTime() - apiResponse.info.time.getTime())}`

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