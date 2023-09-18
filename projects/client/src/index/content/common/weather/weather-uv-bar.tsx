import * as React from 'react';
import styled from 'styled-components';
import { themeTokens } from '@/index/core/theme/theme-root';
import { asPercentString } from '@/index/core/time/time';

const borderRadius = '.125rem';
const barSize = '.5rem';

const ColorContainer = styled.div`
	flex: none;
	position: relative;
	height: 3.5rem;
	width: ${barSize};
	border-radius: ${borderRadius};
	background: ${themeTokens.background.tint.medium};
	overflow: hidden;
`;

const ColorBackground = styled.div`
	position: absolute;
	width: 100%;
	bottom: 0;
	left: 0;
	border-radius: ${borderRadius};
`;

// https://www.epa.gov/sunsafety/uv-index-scale-0
const valuesToColors = {
	0: themeTokens.uvBar.white,
	1: themeTokens.uvBar.green,
	2: themeTokens.uvBar.green,
	3: themeTokens.uvBar.yellow,
	4: themeTokens.uvBar.yellow,
	5: themeTokens.uvBar.yellow,
	6: themeTokens.uvBar.orange,
	7: themeTokens.uvBar.orange,
	8: themeTokens.uvBar.red,
	9: themeTokens.uvBar.red,
	10: themeTokens.uvBar.red,
	11: themeTokens.uvBar.purple,
};

export interface WeatherUVBarProps {
	/** Expects [0, 11] as an integer. */
	value: number;
};

export const WeatherUVBar: React.FC<WeatherUVBarProps> = (props) => {
	const { value } = props;

	const normValue = Math.max(0, Math.min(11, Math.round(value)));
	const color = valuesToColors[normValue as keyof typeof valuesToColors];

	// Although we take [0, 11], visually show 0 as 1.
	const heightPercent = Math.max(normValue, 1) / 11;

	return (
		<ColorContainer>
			<ColorBackground
				style={{
					height: asPercentString(heightPercent),
					backgroundColor: color
				}}
			/>
		</ColorContainer>
	);
};