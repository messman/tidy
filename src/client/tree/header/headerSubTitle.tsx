import * as React from "react";
import * as C from "@/styles/common";
import { TextPlaceholder } from "@/styles/placeholder";
import { createPrettyTimespan } from "@/services/time";
import { useAppDataContext } from "../appData";

interface HeaderSubTitleProps {
}

export const HeaderSubTitle: React.FC<HeaderSubTitleProps> = (props) => {

	const { isLoading, success } = useAppDataContext();

	let nextText = "";
	let previousText = "";
	if (!isLoading && success && success.success) {
		const { percentBetweenPrevNext: percent, next, previous } = success.success.current.tides;

		nextText = `${next.isLow ? 'Low' : 'High'} tide is ${createPrettyTimespan(next.time.getTime() - success.info.time.getTime())}`;

		if (percent >= .1 || percent <= .9) {
			nextText += ",";
			previousText = `and ${previous.isLow ? 'low' : 'high'} tide was ${createPrettyTimespan(previous.time.getTime() - success.info.time.getTime())}.`;
		}
		else {
			nextText += ".";
		}
	}

	return (
		<>
			<C.SubTitle>
				<TextPlaceholder show={isLoading} length={11}>
					{nextText}
				</TextPlaceholder>
			</C.SubTitle>
			<C.SubTitle>
				<TextPlaceholder show={isLoading} length={16}>
					{previousText}
				</TextPlaceholder>
			</C.SubTitle>
		</>
	);
}