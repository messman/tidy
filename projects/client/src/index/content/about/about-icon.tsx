import * as React from 'react';
import styled from 'styled-components';
import { Icon } from '@/index/core/icon/icon';
import { FontWeight } from '@/index/core/primitive/primitive-design';
import { defaultLetterSpacing } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';

export const AboutIcon: React.FC = () => {
	return (
		<Container>
			<BrandIcon type={icons.brandUmbrellaUnclipped} />
			<TitleContainer>
				<TitleText>Wells</TitleText>
				<TitleText>Beach</TitleText>
				<TitleText>Time</TitleText>
			</TitleContainer>
		</Container>
	);
};

const Container = styled.div`
	position: relative;
	display: inline-block;
	margin-top: 2rem;
`;

const BrandIcon = styled(Icon)`
	top: 0;
	left: 0;
	position: absolute;
	height: 12.5rem;
`;

const TitleContainer = styled.div`
	top: 0;
	margin-left: 8.5rem;
	margin-right: 1.5rem;
`;

const TitleText = styled.div`
	// Custom because it's almost like an SVG
	font-size: 34px;
	line-height: 34px;
	letter-spacing: ${defaultLetterSpacing};
	font-weight: ${FontWeight.bold};
	color: ${themeTokens.text.dark};
`;