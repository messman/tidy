import * as React from 'react';
import styled from 'styled-components';
import { About } from '@/index/content/about/about';
import { Learn } from '@/index/content/learn/learn';
import { Now } from '@/index/content/now/now';
import { Week } from '@/index/content/week/week';
import { LayoutBreakpointRem } from '@/index/core/layout/window-layout';
import { ElementIntersect, useElementIntersect, useLatestForEffect, useWindowMediaLayout } from '@messman/react-common';
import { Nav } from '../nav/nav';
import { Tab, tab, useNav } from '../nav/nav-context';

export const AppLayout: React.FC = () => {

	const { selectedTab, selectTabByScroll, wasTabSelectedByScroll } = useNav();

	const { widthBreakpoint } = useWindowMediaLayout();

	const isUpperNav = widthBreakpoint >= LayoutBreakpointRem.d40;

	const rootRef = React.useRef<HTMLDivElement>(null!);
	const threshold = .75;
	function createOnIntersect(tab: Tab) {
		return (intersect: ElementIntersect) => {
			if (intersect.intersectionRatio > threshold) {
				selectTabByScroll(tab);
			}
		};
	}

	const refViewNow = useElementIntersect({ rootRef, threshold }, createOnIntersect(tab.now));
	const refViewWeek = useElementIntersect({ rootRef, threshold }, createOnIntersect(tab.week));
	const refViewLearn = useElementIntersect({ rootRef, threshold }, createOnIntersect(tab.learn));
	const refViewAbout = useElementIntersect({ rootRef, threshold }, createOnIntersect(tab.about));

	const refCallback = useLatestForEffect(() => {
		console.log({ selectedTab, wasTabSelectedByScroll });
		if (wasTabSelectedByScroll) {
			return;
		}

		const ref = (() => {
			if (selectedTab === tab.now) {
				return refViewNow;
			}
			if (selectedTab === tab.week) {
				return refViewWeek;
			}
			return selectedTab === tab.learn ? refViewLearn : refViewAbout;
		})();

		if (ref.current) {
			ref.current.scrollIntoView({
				behavior: 'auto', // 'smooth',
				inline: 'start'
			});
		}
	});

	React.useEffect(() => {
		refCallback.current();
	}, [selectedTab]);

	return (
		<LayoutRoot>
			{isUpperNav && <Nav isLower={false} />}
			<ViewRoot ref={rootRef}>
				<View ref={refViewNow}>
					<Now />
				</View>
				<View ref={refViewWeek}>
					<Week />
				</View>
				<View ref={refViewLearn}>
					<Learn />
				</View>
				<View ref={refViewAbout}>
					<About />
				</View>
			</ViewRoot>
			{!isUpperNav && <Nav isLower={true} />}
		</LayoutRoot>
	);
};

const LayoutRoot = styled.div`
	flex: 1;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
`;

const ViewRoot = styled.div`
	flex: 1;
	display: flex;
	overflow-x: scroll;
	overflow-y: hidden;
	scroll-snap-type: x mandatory;
	width: 100vw;
`;

const View = styled.div`
	width: 100%;
	height: 100%;
	scroll-snap-align: start;
	scroll-snap-stop: always;
	flex-shrink: 0;
	display: flex;
	overflow-y: auto;
	position: relative;
`;