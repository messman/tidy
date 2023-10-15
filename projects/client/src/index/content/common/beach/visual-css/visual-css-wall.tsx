import * as React from 'react';
import styled from 'styled-components';
import { themeTokens } from '@/index/core/theme/theme-root';
import { visualCssConstant } from './visual-css-shared';

export const VisualCssWall: React.FC = () => {
	return (
		<>
			<VisualCssWallHeightSide />
			<VisualCssWidthSide>
			</VisualCssWidthSide>
			<VisualCssWallTop />
		</>
	);
};

const VisualCssWallHeightSide = styled.div`
	position: absolute;
	top: 0;
	left: 0;

	width: ${visualCssConstant.wallHeight}px;
	height: ${visualCssConstant.wallDepth}px;

	background-color: ${themeTokens.beachDiagram.wallSide};

	transform-origin: 0 0;
	transform: translateY(${visualCssConstant.roadDepth}px) rotateY(-90deg);
`;

const VisualCssWidthSide = styled.div`
	position: absolute;
	top: 0;
	left: 0;

	width: ${visualCssConstant.platformWidthBeachLength}px;
	height: ${visualCssConstant.wallHeight}px;

	background-color: ${themeTokens.beachDiagram.wall};

	transform-origin: 0 100%;
	transform: translateY(${visualCssConstant.roadDepth - (visualCssConstant.wallHeight - visualCssConstant.wallDepth)}px) rotateX(-90deg);
`;

// const WidthSideTextContainer = styled.div`
// 	margin: 0 auto;
// 	color: ${themeTokens.beachDiagram.wallText};
// 	${fontStyles.text.smallHeavy};
// 	user-select: none;
// 	text-align: center;
// `;

const VisualCssWallTop = styled.div`
	position: absolute;
	top: 0;
	left: 0;

	width: ${visualCssConstant.platformWidthBeachLength}px;
	height: ${visualCssConstant.wallDepth}px;

	background-color: ${themeTokens.beachDiagram.wallTop};

	transform-origin: 0 0;
	transform: translateY(${visualCssConstant.roadDepth}px) translateZ(${visualCssConstant.wallHeight}px);
`;