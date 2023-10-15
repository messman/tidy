import * as React from 'react';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { VisualCss } from '../common/beach/visual-css/visual-css';

export const NowBeachVisual: React.FC = () => {
	const { now } = useBatchResponseSuccess();

	const height = now.tide.current.height;

	return (
		<VisualCss waterLevelHeight={height} />
	);
};