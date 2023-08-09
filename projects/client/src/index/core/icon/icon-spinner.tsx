import * as React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { icons } from '@wbtdevlocal/assets';
import { StyledFC } from '../primitive/primitive-styled';
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
		transform: rotate(1080deg);
	}
`;

const spinnerChildStyle = css`
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	animation-name: ${spinning};
	animation-duration: 3s;
	animation-iteration-count: infinite;
	`;

const SpinnerChild1 = styled(Icon)`
	${spinnerChildStyle}
	animation-timing-function: cubic-bezier(.15,.075,.7,.85);
`;

const SpinnerChild2 = styled(Icon)`
	${spinnerChildStyle}
	animation-timing-function: cubic-bezier(.3,.15,.7,.85);
	`;

const SpinnerChild3 = styled(Icon)`
	${spinnerChildStyle}
	animation-timing-function: cubic-bezier(.45,.225,.7,.85);
	`;

const SpinnerChild4 = styled(Icon)`
	${spinnerChildStyle}
	animation-timing-function: cubic-bezier(.6,.3,.7,.85);
`;