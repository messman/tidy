import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS } from "@/styles/theme";
import * as C from "@/styles/common";
import { RSuccessCurrent, RError, APIResponse } from "../../../../data";
import { TextPlaceholder } from "@/styles/placeholder";

interface HeaderTitleProps {
	isLoading: boolean,
	apiResponse: APIResponse
}

export const HeaderTitle: React.FC<HeaderTitleProps> = (props) => {

	const { isLoading, apiResponse } = props;

	let text = "";
	if (!isLoading && apiResponse && apiResponse.success) {
		const { percent, next } = apiResponse.success.current.tides;
		if (percent > .90) {
			text = "The tide is high."
		}
		else if (percent < .10) {
			text = "The tide is low."
		}
		else {
			text = `The tide is ${next.isLow ? 'falling' : 'rising'}.`;
		}
	}

	return (
		<C.Title>
			<TextPlaceholder show={props.isLoading} length={10}>
				{text}
			</TextPlaceholder>
		</C.Title>
	);
}