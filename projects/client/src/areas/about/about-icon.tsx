import * as React from 'react';
import { Icon } from '@/core/icon/icon';
import { Block } from '@/core/theme/box';
import { defaultLetterSpacing, FontWeight } from '@/core/theme/font';
import { styled } from '@/core/theme/styled';
import { icons } from '@wbtdevlocal/assets';

export const AboutIconLargeNamed: React.FC = () => {

	return (
		<LargeNamedContainer>

			<AboutIconContainer size='6.25rem'>
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

const AboutIconContainer = styled.span<{ size: string; }>`
	display: inline-block;
	background: linear-gradient(180deg, #3794EB 0%, #2572BA 100%);
	border-radius: 50%;
	width: ${p => p.size};
	height: ${p => p.size};
`;
