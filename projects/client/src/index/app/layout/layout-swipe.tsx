import * as React from 'react';
import styled, { css } from 'styled-components';

export interface SwipeProps {
	/** The "behind" content. Should be an absolutely-positioned sibling. */
	contentRef: React.RefObject<HTMLElement | null | undefined>;
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
	const { isActive, onSetInactive, contentRef, children } = props;

	const refContainer = React.useRef<HTMLDivElement>(null!);
	const refWasActive = React.useRef(isActive);

	React.useLayoutEffect(() => {
		const container = refContainer.current;
		if ((refWasActive.current === isActive) || !container) {
			return;
		}
		refWasActive.current = isActive;
		scrollToEnd(container, !isActive);
		// if (contentRef && contentRef.current) {
		// 	contentRef.current.style.transition = '.3s transform ease';
		// 	contentRef.current.style.transform = `translateX(${isActive ? -50 : 0}%)`;
		// }
	}, [isActive]);

	React.useLayoutEffect(() => {
		const container = refContainer.current;
		let isAtZero = true;
		function onScrollChange() {
			const scrollLeft = container.scrollLeft;
			if (isAtZero && scrollLeft !== 0) {
				isAtZero = false;
				container.style.zIndex = '1';
			}
			else if (!isAtZero && scrollLeft === 0) {
				isAtZero = true;
				container.style.zIndex = '-1';
				onSetInactive();
			}
		}
		container.addEventListener('scroll', onScrollChange, { passive: true });
		return () => {
			container.removeEventListener('scroll', onScrollChange);
		};
	}, []);

	React.useLayoutEffect(() => {
		// if (!isActive) {
		// 	return;
		// }

		const container = refContainer.current;

		let previousBackLeft = 0;
		let animationQueue: number[] = [];

		function run() {
			const value = animationQueue.shift();
			if (value) {
				const content = contentRef?.current || null;
				if (content) {
					content.style.opacity = value.toString();
				}
			}
			if (animationQueue.length) {
				requestAnimationFrame(run);
			}
		}

		function onScrollChange() {
			const scrollLeft = container.scrollLeft;
			const maximumScroll = container.scrollWidth / 2;
			const value = Math.max(0, 1 - (Math.round((scrollLeft / maximumScroll) * 100) / 100));
			console.log(value);

			if (value !== previousBackLeft) {
				previousBackLeft = value;
				const hasQueue = !!animationQueue.length;
				animationQueue.push(value);
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
		<Swipe_Container ref={refContainer}>
			<Swipe_Passthrough />
			<Swipe_Front>
				{children}
			</Swipe_Front>
		</Swipe_Container>
	);
};


function scrollToEnd(element: HTMLElement, isLeft: boolean) {
	element.scrollTo({
		left: isLeft ? 0 : element.scrollWidth,
		behavior: 'smooth'
	});
}


const Swipe_Container = styled.div`
	flex: 1;
	display: flex;
	overflow-x: scroll;
	scroll-snap-type: x mandatory;
	z-index: -1;
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
	z-index: 2;
	${swipeStyle}
	display: flex;
	flex-direction: column;
`;