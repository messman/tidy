import * as React from "react";
import { Title } from "@/styles/common";
import { TextPlaceholder } from "@/styles/placeholder";
import { useAppDataContext } from "../appData";

interface HeaderTitleProps {
}

export const HeaderTitle: React.FC<HeaderTitleProps> = () => {

	const { isLoading, success } = useAppDataContext();

	let text = "";
	if (!isLoading && success && success.data) {
		const { next } = success.data.current.tides;
		const percent = .5;
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
		<Title>
			<TextPlaceholder show={isLoading} length={10}>
				{text}
			</TextPlaceholder>
		</Title>
	);
}