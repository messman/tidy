import * as React from 'react';
import styled, { css } from 'styled-components';
import { About } from '@/index/content/about/about-area/about';
import { BeachTime } from '@/index/content/beach-time-area/beach-time';
import { Conditions } from '@/index/content/common/weather/conditions-ara/conditions';
import { Education } from '@/index/content/learn/education-area/education';
import { AnimationDuration, TransitionSelector } from '@/index/core/animation/animation';
import { overflowHiddenScrollStyle } from '@/index/core/layout/layout-shared';
import { Panel } from '@/index/core/layout/panel/panel';
import { Spacing } from '@/index/core/primitive/primitive-design';
import { Transition } from '@messman/react-common-transition';
import * as iso from '@wbtdevlocal/iso';
import { CompactAppHeader } from './app-layout-compact-header';
import { appCompactNavHeight, AppLayoutCompactNav } from './app-layout-compact-nav';
import { AppScreen, useAppNavigation } from './app-navigation';

interface AppNavigationState {
	current: AppScreen;
	previous: AppScreen;
}

export const CompactApplicationLayout: React.FC<React.PropsWithChildren> = () => {

	const { screen: next } = useAppNavigation();
	const [state, setState] = React.useState<AppNavigationState>(() => {
		return { current: next, previous: next };
	});
	const { current, previous } = state;

	function onExited() {
		setState((p) => {
			return {
				current: next,
				previous: p.current
			};
		});
	}

	let TransitionComponent = SlideRightTransitionContainer;
	let AppScreenComponent = iso.mapNumberEnumValue(AppScreen, appScreenComponent, current);
	let screenRender = <AppScreenComponent />;

	screenRender = current === AppScreen.b_beachTime ? (
		<HomeScroller>
			{screenRender}
		</HomeScroller>
	) : (
		<PanelScroller>
			<Panel>
				{screenRender}
			</Panel>
		</PanelScroller>
	);

	const isExit = next !== current;
	const inScreen = isExit ? next : current;
	const outScreen = isExit ? current : previous;

	if (inScreen === AppScreen.b_beachTime || outScreen === AppScreen.b_beachTime) {
		TransitionComponent = FadePopTransitionContainer;
	}
	else if ((isExit && next > current) || (!isExit && current < previous)) {
		TransitionComponent = SlideLeftTransitionContainer;
	}

	return (
		<>
			<CompactAppHeader />
			<Transition isActive={current === next} onExited={onExited}>
				<TransitionComponent>
					{screenRender}
				</TransitionComponent>
			</Transition>
			<Transition isActive={next !== AppScreen.b_beachTime}>
				<NavigationTransitionContainer>
					<AppLayoutCompactNav />
				</NavigationTransitionContainer>
			</Transition>
		</>
	);
};

const appScreenComponent = {
	b_beachTime: BeachTime,
	d_conditions: Conditions,
	e_education: Education,
	f_about: About
};

const HomeScroller = styled.div`
	flex: 1;
	position: relative;
	display: flex;
	flex-direction: column;
	padding: ${Spacing.cat12};
	padding-top: 0;
	overflow: auto;
`;

const PanelScroller = styled.div`
	flex: 1;
	padding: ${Spacing.cat12};
	padding-top: 0;
	overflow: auto;
`;

const NavigationTransitionContainer = styled.div`
	height: ${appCompactNavHeight};

	${TransitionSelector.transitioning} {
		transition: height ${AnimationDuration.b_zip} ease-in;
	}
	${TransitionSelector.active} {
		height: ${appCompactNavHeight};
	}
	${TransitionSelector.inactive} {
		height: 0;
	}
`;

const transitionContainerStyles = css`
	flex: 1;
	position: relative;
	display: flex;
	flex-direction: column;
	${overflowHiddenScrollStyle};
`;

const FadePopTransitionContainer = styled.div`
	${transitionContainerStyles};

	${TransitionSelector.transitioning} {
		opacity: 0;
		transition: opacity ${AnimationDuration.b_zip} ease-out, transform ${AnimationDuration.b_zip} ease-out;
	}
	${TransitionSelector.enterStart} {
		transform: scale(0.95);
	}
	${TransitionSelector.active} {
		opacity: 1;
		transform: translateX(0);
	}
	${TransitionSelector.inactive} {
		opacity: 0;
		transform: scale(0.95);
	}
`;

const SlideLeftTransitionContainer = styled.div`
	${transitionContainerStyles};

	${TransitionSelector.transitioning} {
		transition: transform ${AnimationDuration.b_zip} ease-out;
	}
	${TransitionSelector.active} {
		transform: translateX(0%);
	}
	${TransitionSelector.inactive} {
		transform: translateX(-100%);
	}
`;

const SlideRightTransitionContainer = styled.div`
	${transitionContainerStyles};

	${TransitionSelector.transitioning} {
		transition: transform ${AnimationDuration.b_zip} ease-in;
	}
	${TransitionSelector.active} {
		transform: translateX(0%);
	}
	${TransitionSelector.inactive} {
		transform: translateX(100%);
	}
`;