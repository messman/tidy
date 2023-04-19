import * as React from 'react';
import styled from 'styled-components';
import { Icon } from '@/core/icon/icon';
import { Block } from '@/core/theme/box';
import { defaultLetterSpacing, FontWeight } from '@/core/theme/font';
import { icons } from '@wbtdevlocal/assets';

export const AboutIconLargeNamed: React.FC = () => {
	return (
		<LargeNamedContainer>

			<AboutIconContainer>
				<Icon type={icons.brandUmbrella} />
			</AboutIconContainer>
			<Block.Cat12 />
			<div>
				<AboutIconTitle>Wells</AboutIconTitle>
				<AboutIconTitle>Beach</AboutIconTitle>
				<AboutIconTitle>Time</AboutIconTitle>
			</div>
		</LargeNamedContainer>
	);
};

const LargeNamedContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const AboutIconTitle = styled.div`
	// Custom because it's almost like an SVG
	font-size: 30px;
	line-height: 32px;
	letter-spacing: ${defaultLetterSpacing};
	font-weight: ${FontWeight.bold};
`;


const AboutIconContainer = styled.span`
	display: inline-block;
	background: ${p => p.theme.common.umbrellaGradient};
	border-radius: 50%;
	width: 6.25rem;
	height: 6.25rem;
`;
