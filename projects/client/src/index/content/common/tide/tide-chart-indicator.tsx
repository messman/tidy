import * as React from 'react';
import styled from 'styled-components';
import { themeTokens } from '@/index/core/theme/theme-root';
import { asPercentString } from '@/index/core/time/time';

const dotSize = '.5rem';
const borderRadius = '.125rem';

const IndicatorContainer = styled.div`
	position: relative;
	height: ${dotSize};
	border-radius: ${borderRadius};
	background: ${themeTokens.background.tint.medium};
	overflow: hidden;
	padding-right: ${dotSize}; // Used to ensure that as we offset from the left we don't get cut off
`;

const IndicatorOffsetContainer = styled.div`
	position: relative;
	height: ${dotSize};
	width: 100%;
`;

const IndicatorTrail = styled.div`
	position: absolute;
	background-color: ${themeTokens.tideBar.line};
	height: ${dotSize};
	top: 0;
	left: 0;
	border-top-right-radius: ${borderRadius};
	border-bottom-right-radius: ${borderRadius};
`;

const IndicatorTrailCurrent = styled(IndicatorTrail)`
	background-color: ${themeTokens.tideBar.lineNow};
`;

const IndicatorDot = styled.div`
	position: absolute;
	background-color: ${themeTokens.tideBar.lineTip};
	width: ${dotSize};
	height: ${dotSize};
	border-radius: ${borderRadius};
	top: 0;
`;

const IndicatorDotCurrent = styled(IndicatorDot)`
	background-color: ${themeTokens.tideBar.lineTipNow};
`;

export interface TideChartIndicatorProps {
	percent: number;
	isCurrent?: boolean;
};

export const TideChartIndicator: React.FC<TideChartIndicatorProps> = (props) => {
	const { percent, isCurrent = false } = props;

	const Trail = isCurrent ? IndicatorTrailCurrent : IndicatorTrail;
	const Dot = isCurrent ? IndicatorDotCurrent : IndicatorDot;

	return (
		<IndicatorContainer>
			<IndicatorOffsetContainer>

				<Trail
					style={{ width: `calc(${asPercentString(percent)} + ${dotSize})` }}
				/>
				<Dot
					style={{ left: asPercentString(percent) }}
				/>
			</IndicatorOffsetContainer>
		</IndicatorContainer>
	);
};