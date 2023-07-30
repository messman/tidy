import * as React from 'react';
import styled from 'styled-components';
import { ClickWrapperButton } from '@/core/form/button';
import { SizedIcon } from '@/core/icon/icon';
import { Block } from '@/core/layout';
import { Spacing } from '@/core/primitive/primitive-design';
import { themeTokens } from '@/core/theme';
import { icons } from '@wbtdevlocal/assets';
import { AppScreen, canScreenCarouselMoveLeft, canScreenCarouselMoveRight, getScreenCarouselMove, useAppNavigation } from './app-navigation';

export const appCompactNavHeight = '2.5rem';

export const AppLayoutCompactNav: React.FC = () => {

	const { screen, setScreen } = useAppNavigation();

	const canMoveLeft = canScreenCarouselMoveLeft(screen) && screen !== AppScreen.a_home;
	const canMoveRight = canScreenCarouselMoveRight(screen) && screen !== AppScreen.a_home;

	function onClickClose() {
		setScreen(AppScreen.a_home);
	}
	function onClickLeft() {
		if (canMoveLeft) {
			setScreen(getScreenCarouselMove(screen, false));
		}
	}
	function onClickRight() {
		if (canMoveRight) {
			setScreen(getScreenCarouselMove(screen, true));
		}
	}


	return (
		<Container>
			<ClickWrapperButton onClick={onClickClose}>
				<NavSizedIcon size='medium' type={icons.actionClose} isVisible={true} />
			</ClickWrapperButton>
			<ContainerRight>
				<ClickWrapperButton onClick={onClickLeft}>
					<NavSizedIcon size='medium' type={icons.arrowLeft} isVisible={canMoveLeft} />
				</ClickWrapperButton>
				<Block.Elf24 />
				<ClickWrapperButton onClick={onClickRight}>
					<NavSizedIcon size='medium' type={icons.arrowRight} isVisible={canMoveRight} />
				</ClickWrapperButton>
			</ContainerRight>
		</Container>
	);
};

const Container = styled.div`
	position: relative;
	height: ${appCompactNavHeight};
	background-color: ${themeTokens.background.waterLight};
	box-shadow: ${themeTokens.shadow.d_navigationBottom};
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 ${Spacing.elf24};
`;

const ContainerRight = styled.div`
	display: flex;
	align-items: center;
`;

const NavSizedIcon = styled(SizedIcon) <{ isVisible: boolean; }>`
	margin: ${Spacing.bat08};
	color: #FFF;
	visibility: ${p => p.isVisible ? 'visible' : 'hidden'};
`;