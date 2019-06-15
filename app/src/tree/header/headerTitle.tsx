import * as React from "react";
import * as C from "@/styles/common";
import { TextPlaceholder } from "@/styles/placeholder";
import { useAppDataContext } from "../appData";

interface HeaderTitleProps {
}

export const HeaderTitle: React.FC<HeaderTitleProps> = (props) => {

	const { isLoading, success } = useAppDataContext();

	let text = "";
	if (!isLoading && success && success.success) {
		const { percent, next } = success.success.current.tides;
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
			<TextPlaceholder show={isLoading} length={10}>
				{text}
			</TextPlaceholder>
		</C.Title>
	);
}