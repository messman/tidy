import * as React from 'react';
import styled from 'styled-components';
import { LayoutBreakpointRem } from '@/services/layout/window-layout';
import { ElementIntersect, useElementIntersect, useWindowMediaLayout } from '@messman/react-common';
import { icons } from '@wbtdevlocal/assets';
import { NavTabBarLower, NavTabBarUpper, NavTabLower, NavTabUpper } from '../nav';

const tabs = {
	now: 'now',
	week: 'week',
	learn: 'learn',
	about: 'about'
} as const;

export const AppLayout: React.FC = () => {

	const [active, setActive] = React.useState<string>(tabs.now);

	const { widthBreakpoint } = useWindowMediaLayout();

	const isUpperNav = widthBreakpoint >= LayoutBreakpointRem.d40;

	const TabBarComponent = isUpperNav ? NavTabBarUpper : NavTabBarLower;
	const TabComponent = isUpperNav ? NavTabUpper : NavTabLower;

	const rootRef = React.useRef<HTMLDivElement>(null!);
	const threshold = .75;
	function createOnIntersect(tab: string) {
		return (intersect: ElementIntersect) => {
			if (intersect.intersectionRatio > threshold) {
				setActive(tab);
			}
		};
	}

	const refViewNow = useElementIntersect({ rootRef, threshold }, createOnIntersect(tabs.now));
	const refViewWeek = useElementIntersect({ rootRef, threshold }, createOnIntersect(tabs.week));
	const refViewLearn = useElementIntersect({ rootRef, threshold }, createOnIntersect(tabs.learn));
	const refViewAbout = useElementIntersect({ rootRef, threshold }, createOnIntersect(tabs.about));

	function createOnClickFor(ref: React.RefObject<HTMLDivElement>) {
		return () => {
			if (ref.current) {
				ref.current.scrollIntoView({
					behavior: 'auto', // 'smooth',
					inline: 'start'
				});
			}
		};
	}

	const tabRender = (
		<TabBarComponent>
			<TabComponent icon={icons.actionAdd} isActive={active === tabs.now} onClick={createOnClickFor(refViewNow)}>Now</TabComponent>
			<TabComponent icon={icons.actionAdd} isActive={active === tabs.week} onClick={createOnClickFor(refViewWeek)}>Week</TabComponent>
			<TabComponent icon={icons.actionAdd} isActive={active === tabs.learn} onClick={createOnClickFor(refViewLearn)}>Learn</TabComponent>
			<TabComponent icon={icons.actionAdd} isActive={active === tabs.about} onClick={createOnClickFor(refViewAbout)}>About</TabComponent>
		</TabBarComponent>
	);

	const [upperTabRender, lowerTabRender] = isUpperNav ? [tabRender, null] : [null, tabRender];

	return (
		<LayoutRoot>
			{upperTabRender}
			<ViewMargin>
				<ViewRoot ref={rootRef}>
					<View ref={refViewNow}>Now</View>
					<View ref={refViewWeek}>Week</View>
					<View ref={refViewLearn}>Learn</View>
					<View ref={refViewAbout}>About</View>
				</ViewRoot>
			</ViewMargin>
			{lowerTabRender}
		</LayoutRoot>
	);
};

const LayoutRoot = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
`;

const ViewMargin = styled.div`
	flex: 1;
	width: 100%;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	`;

const ViewRoot = styled.div`
	flex: 1;
	display: flex;
	overflow-x: scroll;
	scroll-snap-type: x mandatory;
	width: 100%;
	max-width: ${LayoutBreakpointRem.d40}rem;
`;

const View = styled.div`
	width: 100%;
	height: 100%;
	scroll-snap-align: start;
	scroll-snap-stop: always;
	flex-shrink: 0;
`;
