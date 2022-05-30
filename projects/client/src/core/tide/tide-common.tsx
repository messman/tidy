import * as React from 'react';
import { SVGPath } from '@/services/draw/bezier';
import { TextUnit } from '../text-unit';
import { css, styled } from '../theme/styled';

const svgStyle = css`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	overflow: unset;
`;

export const FillSVG = styled(SVGPath)`
	${svgStyle}

	width: ${p => p.destRect.right - p.destRect.left}px;
	fill: ${p => p.theme.badge.water};
	opacity: .2;
`;

export const StrokeSVG = styled(SVGPath)`
	${svgStyle}

	width: ${p => p.destRect.right - p.destRect.left}px;
	stroke: ${p => p.theme.badge.water};
	stroke-width: 6px;
	fill: transparent;
`;

export interface TideHeightTextUnitProps {
	height: number;
	precision: number;
	isEstimate?: boolean;
}

export const TideHeightTextUnit: React.FC<TideHeightTextUnitProps> = (props) => {
	let text = props.height.toFixed(props.precision);
	if (props.isEstimate) {
		text = '~' + text;
	}
	return (
		<TextUnit text={text} unit='ft' space={2} />
	);
};