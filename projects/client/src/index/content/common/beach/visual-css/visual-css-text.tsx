import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponseSuccess } from '@/index/core/data/data';
import { Icon } from '@/index/core/icon/icon';
import { FontWeight } from '@/index/core/primitive/primitive-design';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';
import { TideLevelDirection } from '@wbtdevlocal/iso';
import { visualCssConstant, VisualCssDimensions } from './visual-css-shared';

const textHeight = 30;
const textFontSize = 22;
const textFloat = 1;

export interface VisualCssTextProps {
	dimensions: VisualCssDimensions;
}

export const VisualCssText: React.FC<VisualCssTextProps> = (props) => {
	const { dimensions } = props;
	const { waterSurfaceLength, waterHeight, beachDistanceToWaterWithAnimation } = dimensions;
	const { waterAnimationHeight, sandAngleDeg, sandHypotenuse } = visualCssConstant;

	const { now, getTideExtremeById } = useBatchResponseSuccess();
	const { current, currentId } = now.tide;
	const { direction } = current;
	const currentExtreme = currentId ? getTideExtremeById(currentId) : null;

	const icon = (() => {
		if (currentExtreme) {
			return null;
		}
		return <TextSizedIcon type={direction === TideLevelDirection.falling ? icons.coreArrowDown : icons.coreArrowUp} />;

	})();

	const statusText = (() => {
		if (currentExtreme) {
			return currentExtreme.isLow ? 'Low' : 'High';
		}
		return direction === TideLevelDirection.falling ? 'Falling' : 'Rising';
	})();

	const isShowingOnWater = textHeight < waterSurfaceLength;
	const transform = isShowingOnWater ?
		`translateZ(${waterHeight + waterAnimationHeight + textFloat}px)` :
		`translateY(-${sandHypotenuse - beachDistanceToWaterWithAnimation + 5}px) rotateX(-${sandAngleDeg}deg) translateZ(${waterHeight + waterAnimationHeight + textFloat}px)`;

	return (
		<TextContainer style={{ transform, color: isShowingOnWater ? themeTokens.beachDiagram.oceanText : themeTokens.beachDiagram.sandText }}>
			{icon}
			<Text>
				{statusText}
			</Text>
		</TextContainer>
	);
};

const TextContainer = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;

	user-select: none;

	display: flex;
	align-items: center;
	justify-content: center;

	width: ${visualCssConstant.platformWidthBeachLength}px;
	height: ${textHeight}px;

	transform-origin: 0 100%;
`;

const Text = styled.div`
	font-size: ${textFontSize}px;
	font-weight: ${FontWeight.medium};
`;

const TextSizedIcon = styled(Icon)`
	width: ${textFontSize}px;
	height: ${textFontSize}px;
`;