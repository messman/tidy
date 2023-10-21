import { DateTime } from 'luxon';
import * as React from 'react';
import styled, { css } from 'styled-components';
import { createChartLine, makeRect, Point, SVGPath } from '@/index/core/draw/bezier';
import { themeTokens } from '@/index/core/theme/theme-root';
import { TidePointExtreme } from '@wbtdevlocal/iso';

const svgStyle = css`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	overflow: unset;
`;

export const FillSVG = styled(SVGPath)`
	${svgStyle}

	height: 100%;
	width: 100%;
	fill: ${themeTokens.background.tint.medium};
	

	opacity: .75;
`;

// export const StrokeSVG = styled(SVGPath)`
// 	${svgStyle}

// 	width: ${p => p.destRect.right - p.destRect.left}px;
// 	stroke: ${themeTokens.background.tint.medium};
// 	stroke-width: 6px;
// 	fill: transparent;
// `;

export interface ChartHourlySVGProps {
	day: DateTime;
	extrema: TidePointExtreme[];
	allExtremaMin: number;
	allExtremaMax: number;
	verticalPaddingFactor: number;
};

export const ChartHourlySVG: React.FC<ChartHourlySVGProps> = React.memo((props) => {
	const { day, extrema, allExtremaMin, allExtremaMax, verticalPaddingFactor } = props;

	const minX = day.startOf('day').valueOf();

	// Convert tide data into point data.
	const points = extrema.map<Point>((extreme) => {
		return {
			x: extreme.time.valueOf() - minX,
			y: extreme.height
		};
	});

	const viewBox = makeRect(0, allExtremaMin, day.endOf('day').valueOf() - minX, allExtremaMax);
	const output = createChartLine(points, viewBox, verticalPaddingFactor);

	return (
		<>
			<FillSVG path={output.fillPath} viewBox={viewBox} />
			{/* <StrokeSVG path={output.strokePath} destRect={destRect} /> */}
		</>
	);
});