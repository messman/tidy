import * as React from 'react';
import { Subtitle } from '@/core/symbol/text';
import { createPrettyTimespan } from '@/services/time';
import { useAllResponse, hasAllResponseData } from '@/services/data/data';

interface HeaderSubTitleProps {
}

export const HeaderSubTitle: React.FC<HeaderSubTitleProps> = () => {

	const allResponseState = useAllResponse();
	if (!hasAllResponseData(allResponseState)) {
		return null;
	}

	let nextText = '';
	let previousText = '';

	const { next, previous } = allResponseState.data!.all.current.tides;
	const info = allResponseState.data!.info;

	nextText = `${next.isLow ? 'Low' : 'High'} tide is ${createPrettyTimespan(next.time.getTime() - info.referenceTime.getTime())}`;

	const percent = .5;
	if (percent >= .1 || percent <= .9) {
		nextText += ',';
		previousText = `and ${previous.isLow ? 'low' : 'high'} tide was ${createPrettyTimespan(previous.time.getTime() - info.referenceTime.getTime())}.`;
	}
	else {
		nextText += '.';
	}

	return (
		<>
			<Subtitle>
				{nextText}
			</Subtitle>
			<Subtitle>
				{previousText}
			</Subtitle>
		</>
	);
}