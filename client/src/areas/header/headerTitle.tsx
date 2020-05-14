import * as React from 'react';
import { Title } from '@/core/symbol/text';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';

interface HeaderTitleProps {
}

export const HeaderTitle: React.FC<HeaderTitleProps> = () => {
	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	let text = '';
	const { next } = allResponseState.data!.all.current.tides;
	const percent = .5;
	if (percent > .90) {
		text = 'The tide is high.'
	}
	else if (percent < .10) {
		text = 'The tide is low.'
	}
	else {
		text = `The tide is ${next.isLow ? 'falling' : 'rising'}.`;
	}

	return (
		<Title>
			{text}
		</Title>
	);
}