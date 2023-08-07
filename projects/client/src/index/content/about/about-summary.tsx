import * as React from 'react';
import styled from 'styled-components';
import { AppScreen, useAppNavigation } from '@/index/app/index-area/app-navigation';
import { Icon, SizedIcon } from '@/index/core/icon/icon';
import { Spacing } from '@/index/core/primitive/primitive-design';
import { fontStyles } from '@/index/core/text/text-shared';
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
	display: flex;
	align-items: center;
	column-gap: ${Spacing.bat08};
	padding: ${Spacing.ant04};
	border-radius: ${Spacing.elf24};
	cursor: pointer;
`;

const Title = styled.div`
	${fontStyles.lead.medium};
`;

const AboutIconContainer = styled.span`
	display: inline-block;
	border-radius: 50%;
	width: 2.5rem;
	height: 2.5rem;
`;