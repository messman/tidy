import * as React from 'react';
import { TextUnit } from '@/index/core/text/text-unit';

export interface TideHeightTextUnitProps {
	height: number;
	precision?: number;
	isEstimate?: boolean;
}

export const TideHeightTextUnit: React.FC<TideHeightTextUnitProps> = (props) => {
	const { height, precision = 1, isEstimate = false } = props;
	let text = height.toFixed(precision);
	if (isEstimate) {
		text = '~' + text;
	}
	return (
		<TextUnit text={text} unit='ft' space={2} />
	);
};