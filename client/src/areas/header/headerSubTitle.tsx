import * as React from 'react';
import { Subtitle } from '@/core/symbol/text';
import { TextPlaceholder } from '@/core/loading/placeholder';
import { createPrettyTimespan } from '@/services/time';
import { useAppDataContext } from '@/services/data/appData';

interface HeaderSubTitleProps {
}

export const HeaderSubTitle: React.FC<HeaderSubTitleProps> = () => {

	const { isLoading, success } = useAppDataContext();

	let nextText = '';
	let previousText = '';
	if (!isLoading && success && success.data) {
		const { next, previous } = success.data.current.tides;

		nextText = `${next.isLow ? 'Low' : 'High'} tide is ${createPrettyTimespan(next.time.getTime() - success.info.referenceTime.getTime())}`;

		const percent = .5;
		if (percent >= .1 || percent <= .9) {
			nextText += ',';
			previousText = `and ${previous.isLow ? 'low' : 'high'} tide was ${createPrettyTimespan(previous.time.getTime() - success.info.referenceTime.getTime())}.`;
		}
		else {
			nextText += '.';
		}
	}

	return (
		<>
			<Subtitle>
				<TextPlaceholder show={isLoading} length={11}>
					{nextText}
				</TextPlaceholder>
			</Subtitle>
			<Subtitle>
				<TextPlaceholder show={isLoading} length={16}>
					{previousText}
				</TextPlaceholder>
			</Subtitle>
		</>
	);
}