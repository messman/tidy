import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";
import { RSuccessCurrent, RError, APIResponse } from "../../../../data";
import { TextPlaceholder } from "@/styles/placeholder";
import { createPrettyTimespan } from "@/services/time";

interface HeaderSubTitleProps {
	isLoading: boolean,
	apiResponse: APIResponse
}

export const HeaderSubTitle: React.FC<HeaderSubTitleProps> = (props) => {

	const { isLoading, apiResponse } = props;

	let nextText = "";
	let previousText = "";
	if (!isLoading && apiResponse && apiResponse.success) {
		const { percent, next, previous } = apiResponse.success.current.tides;

		nextText = `${next.isLow ? 'Low' : 'High'} tide is ${createPrettyTimespan(next.time.getTime() - apiResponse.info.time.getTime())}`;

		if (percent >= .1 || percent <= .9) {
			nextText += ",";
			previousText = `and ${previous.isLow ? 'low' : 'high'} tide was ${createPrettyTimespan(previous.time.getTime() - apiResponse.info.time.getTime())}.`;
		}
		else {
			nextText += ".";
		}
	}

	return (
		<>
			<C.SubTitle>
				<TextPlaceholder show={props.isLoading} length={11}>
					{nextText}
				</TextPlaceholder>
			</C.SubTitle>
			<C.SubTitle>
				<TextPlaceholder show={props.isLoading} length={16}>
					{previousText}
				</TextPlaceholder>
			</C.SubTitle>
		</>
	);
}