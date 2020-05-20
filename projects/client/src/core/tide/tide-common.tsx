import { css, styled } from '../style/styled';
import { SVGPath } from '@/services/draw/bezier';

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
	stroke-width: 4px;
	fill: transparent;
`;