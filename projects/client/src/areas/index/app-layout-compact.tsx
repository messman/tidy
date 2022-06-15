import * as React from 'react';
import { BeachTime } from '@/areas/beach-time/beach-time';
import { AnimationDuration, TransitionSelector } from '@/core/animation/animation';
import { AppScreen, useAppNavigation } from '@/core/layout/app/app-navigation';
import { overflowHiddenScrollStyle } from '@/core/layout/layout';
import { Panel } from '@/core/layout/panel/panel';
import { Spacing } from '@/core/theme/box';
import { css, styled } from '@/core/theme/styled';
import { Transition } from '@messman/react-common-transition';
import * as iso from '@wbtdevlocal/iso';
import { About } from '../about/about';
import { Conditions } from '../conditions/conditions';
import { Education } from '../education/education';
import { Home } from '../home/home';
import { Tide } from '../tide/tide';
import { CompactAppHeader } from './app-layout-compact-header';
import { appCompactNavHeight, AppLayoutCompactNav } from './app-layout-compact-nav';

interface AppNavigationState {
	current: AppScreen;
	previous: AppScreen;
}

export const CompactApplicationLayout: React.FC = () => {

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
	let AppScreenComponent = iso.mapEnumValue(AppScreen, appScreenComponent, current);
	let screenRender = <AppScreenComponent />;

	screenRender = current === AppScreen.a_home ? (
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

	if (inScreen === AppScreen.a_home || outScreen === AppScreen.a_home) {
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
			<Transition isActive={next !== AppScreen.a_home}>
				<NavigationTransitionContainer>
					<AppLayoutCompactNav />
				</NavigationTransitionContainer>
			</Transition>
		</>
	);
};

const appScreenComponent: Record<keyof typeof AppScreen, React.FC> = {
	a_home: Home,
	b_beachTime: BeachTime,
	c_tide: Tide,
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

	${TransitionSelector.enter} {
		height: 0;
	}
	${TransitionSelector.exit} {
		height: ${appCompactNavHeight};
	}
	${TransitionSelector.entering} {
		height: ${appCompactNavHeight};
		transition: height ${AnimationDuration.b_zip} ease-in;
	}
	${TransitionSelector.exiting} {
		height: 0;
		transition: height ${AnimationDuration.b_zip} ease-in;
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

	${TransitionSelector.enter} {
		opacity: 0;
		transform: scale(0.95);
	}
	${TransitionSelector.exit} {
		opacity: 1;
	}
	${TransitionSelector.entering} {
		opacity: 1;
		transform: translateX(0);
		transition: opacity ${AnimationDuration.b_zip} ease-out, transform ${AnimationDuration.b_zip} ease-out;
	}
	${TransitionSelector.exiting} {
		opacity: 0;
		transform: scale(0.95);
		transition: opacity ${AnimationDuration.b_zip} ease-in, transform ${AnimationDuration.b_zip} ease-in;
	}
`;


const SlideLeftTransitionContainer = styled.div`
	${transitionContainerStyles};

	${TransitionSelector.enter} {
		transform: translateX(-100%);
	}
	${TransitionSelector.entering} {
		transform: translateX(0%);
		transition: transform ${AnimationDuration.b_zip} ease-out;
	}
	${TransitionSelector.exit} {
		transform: translateX(0%);
	}
	${TransitionSelector.exiting} {
		transform: translateX(-100%);
		transition: transform ${AnimationDuration.b_zip} ease-in;
	}
	${TransitionSelector.exiting} {
		transform: translateX(-100%);
	}
`;

const SlideRightTransitionContainer = styled.div`
	${transitionContainerStyles};

	${TransitionSelector.enter} {
		transform: translateX(100%);
	}
	${TransitionSelector.entering} {
		transform: translateX(0%);
		transition: transform ${AnimationDuration.b_zip} ease-out;
	}
	${TransitionSelector.exit} {
		transform: translateX(0%);
	}
	${TransitionSelector.exiting} {
		transform: translateX(100%);
		transition: transform ${AnimationDuration.b_zip} ease-in;
	}
`;