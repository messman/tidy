import * as React from 'react';
import styled, { css } from 'styled-components';
import { SVGPath } from '@/index/core/draw/bezier';
import { TextUnit } from '@/index/core/text/text-unit';
import { themeTokens } from '@/index/core/theme/theme-root';

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
	fill: ${themeTokens.background.tint.medium};
	opacity: .2;
`;

export const StrokeSVG = styled(SVGPath)`
	${svgStyle}

	width: ${p => p.destRect.right - p.destRect.left}px;
	stroke: ${themeTokens.background.tint.medium};
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