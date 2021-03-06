import * as React from 'react';
import { CONSTANT } from '@/services/constant';
import { SVGPath } from '@/services/draw/bezier';
import { css, styled } from '../style/styled';
import { TextUnit } from '../symbol/text-unit';

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
	fill: ${p => p.theme.color.tide};
	opacity: .2;
`;

export const StrokeSVG = styled(SVGPath)`
	${svgStyle}

	width: ${p => p.destRect.right - p.destRect.left}px;
	stroke: ${p => p.theme.color.tide};
	stroke-width: 6px;
	fill: transparent;
`;

export interface TideHeightTextUnitProps {
	height: number;
	isEstimate?: boolean;
}

export const TideHeightTextUnit: React.FC<TideHeightTextUnitProps> = (props) => {
	let text = props.height.toFixed(CONSTANT.tideHeightPrecision);
	if (props.isEstimate) {
		text = '~' + text;
	}
	return (
		<TextUnit text={text} unit='ft' space={2} />
	);
};