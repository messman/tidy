import * as React from 'react';
import { SubtitleInline } from '@/core/symbol/text';
import { Icon, iconTypes } from '@/core/symbol/icon';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';

export const SummaryTitle: React.FC = () => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	let text = '';
	// const { previous, next, height } = success.data.current.tides;

	// const percent = .5;
	// if (percent > .90) {
	// 	text = 'The tide is high.'
	// }
	// else if (percent < .10) {
	// 	text = 'The tide is low.'
	// }
	// else {
	// 	text = `The tide is ${next.isLow ? 'falling' : 'rising'}.`;
	// }


	return (
		<>
			<SubtitleInline>The tide is falling. {text}</SubtitleInline>
			<Icon type={iconTypes.arrowDown} />
		</>
	);
};