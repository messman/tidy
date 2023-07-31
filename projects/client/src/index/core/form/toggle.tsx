import * as React from 'react';
import styled from 'styled-components';
import { AnimationDuration } from '../animation/animation';
import { themeTokens } from '../theme/theme-root';

export interface ToggleProps {
	isDisabled: boolean;
	value: boolean;
	onToggle: (value: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = (props) => {
	const { isDisabled, value, onToggle } = props;

	function onClick() {
		if (!isDisabled) {
			onToggle(!value);
		}
	}

	return (
		<ToggleContainer value={value} onClick={onClick}>
			<ToggleIndicator value={value} />
		</ToggleContainer>
	);
};

const containerWidth = 2.5;
const containerHeight = 1.5; // 1.5rem is the line-height for key-value, body text, etc.
const onePxRem = .0625;
const circleMargin = onePxRem;
const circleSize = containerHeight - (onePxRem * 4);
const circleOnLeft = containerWidth - (2 * onePxRem) - circleSize - onePxRem;

const ToggleContainer = styled.div<{ value: boolean; }>`
	width: ${containerWidth}rem;
	height: ${containerHeight}rem;
	border-radius: 4rem;
	box-sizing: border-box;
	border: ${onePxRem}rem solid transparent;
	border-color: ${p => p.value ? themeTokens.inform.positive : null};
	background-color: ${p => p.value ? themeTokens.inform.positive : null};
	cursor: "pointer";
	position: relative;
	transition: border-color, background-color ${AnimationDuration.b_zip} ease;
`;

const ToggleIndicator = styled.div<{ value: boolean; }>`
	width: ${circleSize}rem;
	height: ${circleSize}rem;
	border-radius: 4rem;
	position: absolute;
	top: ${circleMargin}rem;
	left: ${p => p.value ? `${circleOnLeft}rem` : `${circleMargin}rem`};
	background-color: '#FFF';
	transition: all ${AnimationDuration.b_zip} ease;
	transition-property: box-shadow, left, background-color;
`;