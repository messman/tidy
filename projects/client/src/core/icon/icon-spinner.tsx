import * as React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { icons } from '@wbtdevlocal/assets';
import { StyledFC } from '../theme/styled';
import { Icon } from './icon';

export const SpinnerIcon: StyledFC = (props) => {
	return (
		<SpinnerContainer {...props}>
			<SpinnerChild1 type={icons.loaderQuarterTurn} />
			<SpinnerChild2 type={icons.loaderQuarterTurn} />
			<SpinnerChild3 type={icons.loaderQuarterTurn} />
			<SpinnerChild4 type={icons.loaderQuarterTurn} />
		</SpinnerContainer>
	);
};

const SpinnerContainer = styled.span`
	display: inline-block;
	position: relative;
`;

const spinning = keyframes`
	${'0%'} {
		transform: rotate(0deg);
	}
	${'100%'} {
		transform: rotate(360deg);
	}
`;

const spinnerChildStyle = css`
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	animation: ${spinning} 1.6s cubic-bezier(0.5, 0, 0.5, 1) infinite;
`;

const SpinnerChild1 = styled(Icon)`
	${spinnerChildStyle}
	animation-delay: -0.6s;
`;

const SpinnerChild2 = styled(Icon)`
	${spinnerChildStyle}
	animation-delay: -0.4s;
`;

const SpinnerChild3 = styled(Icon)`
	${spinnerChildStyle}
	animation-delay: -0.2s;
`;

const SpinnerChild4 = styled(Icon)`
	${spinnerChildStyle}
`;