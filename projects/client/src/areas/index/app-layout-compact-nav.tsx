import * as React from 'react';
import { WrapperButton } from '@/core/form/button';
import { SizedIcon } from '@/core/icon/icon';
import { AppScreen, canScreenCarouselMoveLeft, canScreenCarouselMoveRight, getScreenCarouselMove, useAppNavigation } from '@/core/layout/app/app-navigation';
import { Block, Spacing } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { icons } from '@wbtdevlocal/assets';

export const appCompactNavHeight = '2.5rem';

export const AppLayoutCompactNav: React.FC = () => {

	const { screen, setScreen } = useAppNavigation();

	function onClickClose() {
		setScreen(AppScreen.a_home);
	}
	function onClickLeft() {
		setScreen(getScreenCarouselMove(screen, false));
	}
	function onClickRight() {
		setScreen(getScreenCarouselMove(screen, true));
	}

	const canMoveLeft = canScreenCarouselMoveLeft(screen);
	const canMoveRight = canScreenCarouselMoveRight(screen);

	return (
		<Container>
			<WrapperButton onClick={onClickClose}>
				<NavSizedIcon size='medium' type={icons.actionClose} isVisible={true} />
			</WrapperButton>
			<ContainerRight>
				<WrapperButton onClick={onClickLeft} isDisabled={!canMoveLeft}>
					<NavSizedIcon size='medium' type={icons.arrowLeft} isVisible={canMoveLeft} />
				</WrapperButton>
				<Block.Dog16 />
				<WrapperButton onClick={onClickRight} isDisabled={!canMoveRight}>
					<NavSizedIcon size='medium' type={icons.arrowRight} isVisible={canMoveRight} />
				</WrapperButton>
			</ContainerRight>
		</Container>
	);
};

const Container = styled.div`
	position: relative;
	height: ${appCompactNavHeight};
	background-color: ${p => p.theme.gradient.light};
	box-shadow: ${p => p.theme.shadow.d_navigationBottom};
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 ${Spacing.dog16};
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