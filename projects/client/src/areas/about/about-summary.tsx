import * as React from 'react';
import styled from 'styled-components';
import { Icon, SizedIcon } from '@/core/icon/icon';
import { AppScreen, useAppNavigation } from '@/core/layout/app/app-navigation';
import { fontStyleDeclarations } from '@/core/text';
import { Spacing } from '@/core/theme/box';
import { icons } from '@wbtdevlocal/assets';

export const AboutSummary: React.FC = () => {
	const { setScreen } = useAppNavigation();

	function onClick() {
		setScreen(AppScreen.f_about);
	}

	return (
		<Container onClick={onClick}>
			<AboutIconContainer>
				<Icon type={icons.brandUmbrella} />
			</AboutIconContainer>
			<Title>About</Title>
			<SizedIcon size='medium' type={icons.arrowChevronRightInline} />
		</Container>
	);
};

const Container = styled.div`
	position: fixed;
	bottom: ${Spacing.cat12};
	right: ${Spacing.cat12};
	background-color: #FFF;
	box-shadow: ${p => p.theme.shadow.g_overlay};
	display: flex;
	align-items: center;
	column-gap: ${Spacing.bat08};
	padding: ${Spacing.ant04};
	border-radius: ${Spacing.elf24};
	cursor: pointer;
`;

const Title = styled.div`
	${fontStyleDeclarations.lead};
`;

const AboutIconContainer = styled.span`
	display: inline-block;
	background: ${p => p.theme.common.umbrellaGradient};
	border-radius: 50%;
	width: 2.5rem;
	height: 2.5rem;
`;