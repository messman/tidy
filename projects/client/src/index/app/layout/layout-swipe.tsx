import * as React from 'react';
import styled, { css } from 'styled-components';
import { ClickWrapperButton } from '@/index/core/form/button';
import { SizedIcon } from '@/index/core/icon/icon';
import { SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { asPercentString } from '@/index/core/time/time';
import { icons } from '@wbtdevlocal/assets';

const headerHeight = '2.5rem';

export interface SwipeProps {
	title: string;
	isActive: boolean;
	onSetInactive: () => void;
	children: React.ReactNode;
}

/**
 * Provides a modal-like panel that animates in from the right. 
 * User can swipe it away, or it can be closed programmatically.
 * 
 * Must exist inside a flex container.
 */
export const Swipe: React.FC<SwipeProps> = (props) => {
	const { title, isActive, onSetInactive, children } = props;

	const refSwipeContainer = React.useRef<HTMLDivElement>(null!);
	const refOpacityContainer = React.useRef<HTMLDivElement>(null!);
	const refHeader = React.useRef<HTMLDivElement>(null!);
	const refWasActive = React.useRef(isActive);

	// Track whether we are becoming active, and scroll into view.
	React.useLayoutEffect(() => {
		const container = refSwipeContainer.current;
		if ((refWasActive.current === isActive) || !container) {
			return;
		}
		refWasActive.current = isActive;
		scrollToEnd(container, !isActive);
	}, [isActive]);

	// Track whether we have been fully scrolled away and hide.
	React.useLayoutEffect(() => {
		const swipeContainer = refSwipeContainer.current;
		const opacityContainer = refOpacityContainer.current;
		let isAtZero = true;
		function onScrollChange() {
			const scrollLeft = swipeContainer.scrollLeft;
			if (isAtZero && scrollLeft !== 0) {
				isAtZero = false;
				swipeContainer.style.zIndex = '1';
				opacityContainer.style.zIndex = '1';
			}
			else if (!isAtZero && scrollLeft === 0) {
				isAtZero = true;
				swipeContainer.style.zIndex = '-1';
				opacityContainer.style.zIndex = '-1';
				onSetInactive();
			}
		}
		swipeContainer.addEventListener('scroll', onScrollChange, { passive: true });
		return () => {
			swipeContainer.removeEventListener('scroll', onScrollChange);
		};
	}, []);

	// Track our scroll and use it to control opacity
	React.useLayoutEffect(() => {
		const container = refSwipeContainer.current;

		let previousScrolledFactor = 0;
		let animationQueue: number[] = [];

		function run() {
			const scrolledFactor = animationQueue.shift();
			if (scrolledFactor) {
				const opacityContainer = refOpacityContainer?.current || null;
				if (opacityContainer) {
					opacityContainer.style.opacity = scrolledFactor.toString();
				}
				const header = refHeader?.current || null;
				if (header) {
					const scrolledFactorToPercent = asPercentString(1 - scrolledFactor);
					const style = `translateY(-${scrolledFactorToPercent})`;
					header.style.transform = style;
				}
			}
			if (animationQueue.length) {
				requestAnimationFrame(run);
			}
		}

		function onScrollChange() {
			const scrollLeft = container.scrollLeft;
			const maximumScroll = container.scrollWidth / 2;
			const scrolledFactor = Math.min(1, Math.max(0, Math.round((scrollLeft / maximumScroll) * 100) / 100));

			if (scrolledFactor !== previousScrolledFactor) {
				previousScrolledFactor = scrolledFactor;
				const hasQueue = !!animationQueue.length;
				animationQueue.push(scrolledFactor);
				if (!hasQueue) {
					requestAnimationFrame(run);
				}
			}
		}

		container.addEventListener('scroll', onScrollChange, { passive: true });
		return () => {
			container.removeEventListener('scroll', onScrollChange);
		};
	}, []);

	return (
		<>
			<Swipe_Opacity ref={refOpacityContainer} />
			<SwipeHeader_Container ref={refHeader}>
				<ClickWrapperButton onClick={onSetInactive}>
					<SwipeHeader_InsideButtonContainer>
						<SizedIcon size='medium' type={icons.coreArrowLeft} />
						<SwipeHeader_Text>{title}</SwipeHeader_Text>
					</SwipeHeader_InsideButtonContainer>
				</ClickWrapperButton>
			</SwipeHeader_Container>
			<Swipe_Container ref={refSwipeContainer}>
				<Swipe_Passthrough />
				<Swipe_Front>
					<SwipeHeader_Space />
					{children}
				</Swipe_Front>
			</Swipe_Container>
		</>
	);
};


function scrollToEnd(element: HTMLElement, isLeft: boolean) {
	element.scrollTo({
		left: isLeft ? 0 : element.scrollWidth,
		behavior: 'smooth'
	});
}

const Swipe_Opacity = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100%;
	background: ${themeTokens.background.gradient};
	opacity: 0;
	z-index: -1;
	pointer-events: none;
`;

const Swipe_Container = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100%;
	display: flex;
	overflow-x: scroll;
	scroll-snap-type: x mandatory;
	z-index: -1;
	isolation: isolate;
`;

const swipeStyle = css`
	width: 100vw;
	height: 100%;
	scroll-snap-align: start;
	scroll-snap-stop: always;
	flex-shrink: 0;
`;

const Swipe_Passthrough = styled.div`
	${swipeStyle}
	background-color: transparent;
	position: relative;
	pointer-events: none;
`;

const Swipe_Front = styled.div`
	position: relative;
	z-index: 1;
	${swipeStyle}
	display: flex;
	flex-direction: column;
`;

const SwipeHeader_Space = styled.div`
	height: ${headerHeight};
`;

const SwipeHeader_Container = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: ${headerHeight};
	width: 100%;
	display: flex;
	align-items: center;
	background: ${themeTokens.background.tint.medium};
	transform: translateY(-100%);
	z-index: 2;
`;

const SwipeHeader_InsideButtonContainer = styled.div`
	display: inline-flex;
	align-items: center;
	gap: .5rem;
	padding: .5rem ${SpacePanelEdge.value};
`;

const SwipeHeader_Text = styled.div`
	${fontStyles.text.mediumHeavy};
`;