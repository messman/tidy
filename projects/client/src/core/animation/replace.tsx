import * as React from 'react';
import { Transition } from '@messman/react-common-transition';
import { css, styled } from '../theme/styled';
import { slideTransitionLowerStyle, slideTransitionUpperStyle } from './animation';

/*
	Inspiration:
		- React Route Native Stack https://github.com/Traviskn/react-router-native-stack
		- Route listen https://github.com/remix-run/history/blob/dev/docs/getting-started.md#listening
*/

export enum SlideDirection {
	forward,
	backward
}

export interface SlideReplaceProps {
	activeId: string;
}

interface SlideReplaceState {
	activeId: string;
	lastActiveId: string;
}

export const SlideReplace: React.FC<SlideReplaceProps> = (props) => {
	const { activeId: nextActiveId } = props;

	const [state, setState] = React.useState<SlideReplaceState>(() => {
		return {
			activeId: nextActiveId,
			lastActiveId: nextActiveId
		};
	});
	const { activeId, lastActiveId } = state;

	React.useEffect(() => {
		if (nextActiveId !== activeId) {
			setState({
				activeId: nextActiveId,
				lastActiveId: activeId
			});
		}
	}, [nextActiveId, activeId]);

	const onFinishedTransition = React.useCallback(() => {
		setState((p) => {
			if (p.activeId === p.lastActiveId) {
				return p;
			}
			return {
				activeId: p.activeId,
				lastActiveId: p.activeId
			};
		});
	}, []);

	/*
		Now, from the three values of next, current, and last,
		we need to worry about just the two that will be rendered.
	*/
	/**
	 * If `true`, this is that "first" (possibly multiple) render that occurs when the props have changed but the
	 * effect has not run to set the new state yet.
	 * 
	 * Instead of disregarding it, we *need* to use it to set up for the transition.
	 */
	const isCauseBeforeTransition = nextActiveId !== activeId;
	const isTransitioning = activeId !== lastActiveId;

	const [newId, oldId] = isCauseBeforeTransition ? [nextActiveId, activeId] : [activeId, lastActiveId];

	let newRenderIndex: number = -1;
	let newRender: JSX.Element | null = null;
	let oldRenderIndex: number = -1;
	let oldRender: JSX.Element | null = null;

	React.Children.toArray(props.children).forEach((child, i) => {
		if (React.isValidElement(child) && child.type === SlideReplaceChild) {
			const props = child.props as SlideChildProps;
			if (props.id === newId) {
				newRenderIndex = i;
				newRender = child;
			}
			if (props.id === oldId) {
				oldRenderIndex = i;
				oldRender = child;
			}
		}
	});

	// Must always have something.
	if (!newRender || !oldRender) {
		return null;
	}

	const direction = newRenderIndex < oldRenderIndex ? SlideDirection.backward : SlideDirection.forward;

	/*
		Phases:
		- Stable: new and old are the same; one of them is the stable render, and nothing else is rendered.
		- Changing: new and old become the in and out

		When transition completes, phase goes from Changing back to Stable
	*/

	// Default case: active and last active are the same, no transition is occurring.
	let stableKey: string = newId;
	let stableRender: JSX.Element | null = newRender;

	let lowerKey: string = '_out_none_';
	let lowerRender: JSX.Element | null = null;
	let isLowerTransitionActive = false;
	let isLowerSkipEntering = true;
	let isLowerSkipExiting = true;

	let upperKey: string = '_in_none_';
	let upperRender: JSX.Element | null = null;
	let isUpperTransitionActive = false;
	let isUpperSkipEntering = true;
	let isUpperSkipExiting = true;

	if (isCauseBeforeTransition || isTransitioning) {

		stableKey = '_stable_none_';
		stableRender = null;

		if (direction === SlideDirection.forward) {
			/*
				When sliding forward:
				- lower transition is going from active to not active (exiting).
				- upper transition is going from not active to active (entering).
			*/
			lowerKey = oldId;
			lowerRender = oldRender;
			isLowerTransitionActive = isCauseBeforeTransition;
			isLowerSkipExiting = false;

			upperKey = newId;
			upperRender = newRender;
			isUpperTransitionActive = isTransitioning && !isCauseBeforeTransition;
			isUpperSkipEntering = false;
		}
		else {
			/*
				When sliding backward:
				- lower transition is going from not active to active (entering).
				- upper transition is going from active to not active (exiting).
			*/

			lowerKey = newId;
			lowerRender = newRender;
			isLowerTransitionActive = isTransitioning && !isCauseBeforeTransition;
			isLowerSkipEntering = false;

			upperKey = oldId;
			upperRender = oldRender;
			isUpperTransitionActive = isCauseBeforeTransition;
			isUpperSkipExiting = false;
		}
	}

	// console.log({ nextActiveId, activeId, lastActiveId, isCauseBeforeTransition, isTransitioning });
	// console.log({ newId, oldId });
	// console.log({ stableKey, lowerKey, upperKey });

	// When sliding backward, the lower animation
	const transitionFunc = (isCauseBeforeTransition || isTransitioning) ? onFinishedTransition : undefined;

	/*
		!!!! WARNING !!!!
		
		The slide works by transitioning elements and then swapping them in the DOM so that the active component is in a relative container.

		As you likely know, this could cause issues due to the "reparenting" problem: You can't really move React Components around in the DOM without forcing them to unmount and remount.
		The unmount and remount, theoretically, should be fine; but in the case where we are moving around entire pages, we will have local state (like API calls) that will get cleared
		in the moment between the end of the transition and the element "settling in" to the relative position in the DOM.

		To fix this, we use the key attribute to hint to React that this is the same component between renders. But, there are caveats:
		- When moving a key to a different component (like we do below with the Transitions), the component must be a sibling.
		- You must have the same exact components all the way down to the component you wish to move.
			- That's why we have a Transition for the relative component even though we don't need to transition.
			- That's why we had to create the same "Container" component and pass a boolean prop instead of creating, say, a "RelativeContainer" and "AbsoluteContainer".

		Per React's documentation, this key trick is not a guarantee - so we may end up seeing bugs from this in the future. If you think you're experiencing such a bug,
		you can test by adding a parent component to whatever children you're rendering in this Slide and have it log inside a setState initializer function.

		See https://reactjs.org/docs/reconciliation.html
	*/
	return (
		<SlideContainer>
			<Transition
				key={stableKey}
				isActive={true}
				skipEntering={true}
				skipExiting={true}
				onEntered={undefined}
				onExited={undefined}
			>
				<Container isRelative={true} isUpper={false}>
					{stableRender}
				</Container>
			</Transition>
			<Transition
				key={lowerKey}
				isActive={isLowerTransitionActive}
				skipEntering={isLowerSkipEntering}
				skipExiting={isLowerSkipExiting}
				onEntered={transitionFunc}
				onExited={transitionFunc}
			>
				<Container isRelative={false} isUpper={false}>
					{lowerRender}
				</Container>
			</Transition>
			<Transition
				key={upperKey}
				isActive={isUpperTransitionActive}
				skipEntering={isUpperSkipEntering}
				skipExiting={isUpperSkipExiting}
				onEntered={transitionFunc}
				onExited={transitionFunc}
			>
				<Container isRelative={false} isUpper={true}>
					{upperRender}
				</Container>
			</Transition>
		</SlideContainer>
	);
};

export interface SlideChildProps {
	id: string;
}

export const SlideReplaceChild: React.FC<SlideChildProps> = (props) => {
	return (
		<>{props.children}</>
	);
};

const SlideContainer = styled.div`
	flex: 1;
	position: relative;

	display: flex;
	flex-direction: row;
	align-items: stretch;
`;

const relativeContainerStyles = css`	
	flex: 1;
	display: flex;
	flex-direction: row;
	align-items: stretch;
`;


const absoluteContainerStyles = css`
	position: absolute;
	display: flex;
	flex-direction: column;
	flex: 0;
	
	box-shadow: ${p => p.theme.shadow.d_navigation};
	
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	z-index: 10;
	overflow: hidden;
	will-change: transform;
`;

const Container = styled.div<{ isRelative: boolean; isUpper: boolean; }>`
	${p => p.isRelative ? relativeContainerStyles : absoluteContainerStyles};
	${p => p.isRelative ? null : (p.isUpper ? slideTransitionUpperStyle : slideTransitionLowerStyle)};
`;