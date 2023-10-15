import * as React from 'react';
import styled from 'styled-components';
import { themeTokens } from '@/index/core/theme/theme-root';
import { visualCssConstant } from './visual-css-shared';

export const VisualCssRoad: React.FC = () => {
	return (
		<>
			<RoadSide />
			<RoadTop />
		</>
	);
};

const RoadTop = styled.div`
	position: absolute;
	top: 0;
	left: 0;

	width: ${visualCssConstant.platformWidthBeachLength}px;
	height: ${visualCssConstant.roadDepth}px;

	background-color: ${themeTokens.beachDiagram.roadTop};

	transform-origin: 0 0;
	transform: translateZ(${visualCssConstant.roadHeight}px);
`;

const RoadSide = styled.div`
	position: absolute;
	top: 0;
	left: 0;

	width: ${visualCssConstant.roadHeight}px;
	height: ${visualCssConstant.roadDepth}px;

	background-color: ${themeTokens.beachDiagram.roadSide};

	transform-origin: 0 0;
	transform: rotateY(-90deg);
`;