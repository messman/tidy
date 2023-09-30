import * as React from 'react';
import styled from 'styled-components';
import { AnimationDuration } from '../animation/animation';
import { themeTokens } from '../theme/theme-root';

export interface ToggleProps {
	value: boolean;
	onToggle: () => void;
}

export const Toggle: React.FC<ToggleProps> = (props) => {
	const { value, onToggle } = props;

	return (
		<ToggleContainer $value={value} onClick={onToggle}>
			<ToggleIndicator $value={value} />
		</ToggleContainer>
	);
};

const containerWidth = 2.5;
const containerHeight = 1.5; // 1.5rem is the line-height for key-value, body text, etc.
const onePxRem = .0625;
const circleMargin = onePxRem;
const circleSize = containerHeight - (onePxRem * 4);
const circleOnLeft = containerWidth - (2 * onePxRem) - circleSize - onePxRem;

const ToggleContainer = styled.button<{ $value: boolean; }>`
	width: ${containerWidth}rem;
	height: ${containerHeight}rem;
	border-radius: 4rem;
	box-sizing: border-box;
	border: ${onePxRem}rem solid transparent;
	border-color: ${p => p.$value ? themeTokens.background.tint.darkest : themeTokens.background.tint.lightest};
	background-color: ${p => p.$value ? themeTokens.background.tint.darkest : themeTokens.background.tint.lightest};
	cursor: pointer;
	position: relative;
	transition: border-color, background-color ${AnimationDuration.c_quick} ease-in-out;
`;

const ToggleIndicator = styled.div<{ $value: boolean; }>`
	background-color: #FFF;
	width: ${circleSize}rem;
	height: ${circleSize}rem;
	border-radius: 4rem;
	position: absolute;
	top: ${circleMargin}rem;
	left: ${p => p.$value ? `${circleOnLeft}rem` : `${circleMargin}rem`};
	transition: all ${AnimationDuration.c_quick} ease-in-out;
	transition-property: box-shadow, left, background-color;
`;