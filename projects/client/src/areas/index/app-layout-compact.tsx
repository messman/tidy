import * as React from 'react';
import { BeachTime } from '@/areas/beach-time/beach-time';
import { AppScreen, useAppNavigation } from '@/core/layout/app/app-navigation';
import { overflowHiddenScrollStyle } from '@/core/layout/layout';
import { Panel } from '@/core/layout/panel/panel';
import { AnimationDuration, TransitionSelector } from '@/core/theme/animation';
import { Spacing } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { Transition } from '@messman/react-common-transition';
import * as iso from '@wbtdevlocal/iso';
import { About } from '../about/about';
import { Conditions } from '../conditions/conditions';
import { Education } from '../education/education';
import { Home } from '../home/home';
import { Tide } from '../tide/tide';
import { CompactAppHeader } from './app-layout-compact-header';
import { appCompactNavHeight, AppLayoutCompactNav } from './app-layout-compact-nav';

export const CompactApplicationLayout: React.FC = () => {

	const [screen, setScreen] = React.useState(AppScreen.a_home);
	const { screen: contextScreen } = useAppNavigation();

	function onExited() {
		setScreen(contextScreen);
	}

	let TransitionComponent = OpacityTransitionContainer;
	let AppScreenComponent = iso.mapEnumValue(AppScreen, appScreenComponent, screen);
	let screenRender = <AppScreenComponent />;

	screenRender = screen === AppScreen.a_home ? (
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


	return (
		<>
			<CompactAppHeader />
			<Transition isActive={screen === contextScreen} onExited={onExited}>
				<TransitionComponent>
					{screenRender}
				</TransitionComponent>
			</Transition>
			<Transition isActive={contextScreen !== AppScreen.a_home}>
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

const OpacityTransitionContainer = styled.div`
	flex: 1;
	position: relative;
	display: flex;
	flex-direction: column;
	${overflowHiddenScrollStyle};

	${TransitionSelector.enter} {
		opacity: 0;
	}
	${TransitionSelector.exit} {
		opacity: 1;
	}
	${TransitionSelector.entering} {
		opacity: 1;
		transition: opacity ${AnimationDuration.b_zip} ease-in;
	}
	${TransitionSelector.exiting} {
		opacity: 0;
		transition: opacity ${AnimationDuration.b_zip} ease-in;
	}
`;