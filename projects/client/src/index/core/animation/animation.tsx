import * as React from 'react';
import styled, { css } from 'styled-components';
import { createClassSelectors, createTransitionCallback, OnEndContext, SwitchTransition, SwitchTransitionProps, Transition, TransitionProps } from '@messman/react-common-transition';
import { AbsoluteToFlexContainer, FlexToParentOfAbsolute } from '../layout/layout-shared';
import { CssOutput } from '../primitive/primitive-styled';

export enum AnimationDuration {
	a_min = '.05s',
	b_zip = '.1s',
	c_quick = '.15s',
	d_basic = '.25s',
	e_slow = '.35s',
	f_fade = '.5s',
	g_max = '1.5s'
}

/*
	The default transition change listener in our Transition component will trigger if *any* transition or animation end is detected.
	This is prone to causing unexpected conditions, like:
		1. click a button to close a dialog
		2. dialog starts transitioning out
		3. button inside leaves the 'active' state, so a transition occurs to update the button shadow
		4. the shadow transition ends first
		5. Transition component detects that transition end event, and considers everything done
	To avoid this, we need to make a simple change to ensure the event target is the context element.
	And we can abstract all this behind a new component.

	This also gives us one point where we can debug more easily.
*/
const onTransitioning = createTransitionCallback({
	onAnimationEnd: (context) => { debugTransition(context); return context.element === context.event.target; },
	onTransitionEnd: (context) => { debugTransition(context); return context.element === context.event.target; },
});
function debugTransition(_context: OnEndContext<AnimationEvent | TransitionEvent>) {
	// console.log(context);
}

/** Like Transition, but only checks for transition/animation events on the direct child. Usually this is what you want. */
export const StrictTransition: React.FC<TransitionProps> = (props) => {
	return <Transition onTransitioning={onTransitioning} {...props} />;
};

/** Like Transition, but only checks for transition/animation events on the direct child. Usually this is what you want. */
export const StrictSwitchTransition: React.FC<SwitchTransitionProps> = (props) => {
	return <SwitchTransition inOnTransitioning={onTransitioning} outOnTransitioning={onTransitioning} {...props} />;
};

/**
 * Used to mark class names for the react-common-transition Transition component.
 * Includes the self-identifier and class prefix, like `&.prefix-enter`.
 * */
export const TransitionSelector = createClassSelectors({ useAmpersandPrefix: true });

/** Styles that can be dropped into styled-components definitions to create transitions. */
export const basicTransitionStyles = {
	/**
	 * Slides in from the right and out to the left.
	 * Meant to imitate the default iOS screen navigation transition.
	*/
	pageSlide: css`
		will-change: transform;

		${TransitionSelector.transitioning} {
			transition: transform ${AnimationDuration.d_basic} ease-in-out;
		}
		${TransitionSelector.active} {
			z-index: 1;
			transform: translateX(0);
		}
		${TransitionSelector.inactive} {
			z-index: 0;
			transform: translateX(-30%);
		}
		${TransitionSelector.enterStart} {
			z-index: 1;
			transform: translateX(100%);
		}
	`,
	/**
	 * A basic opacity transition.
	*/
	fade: css`
		will-change: transform;

		${TransitionSelector.transitioning} {
			transition: opacity ${AnimationDuration.d_basic} ease-in-out;
		}
		${TransitionSelector.active} {
			z-index: 1;
			opacity: 1;
		}
		${TransitionSelector.inactive} {
			z-index: 0;
			opacity: 0;
		}
	`,
	/**
	 * A fade that also scales up-on-in and down-on-out.
	*/
	fadeScale: css`
		will-change: transform;

		${TransitionSelector.transitioning} {
			transition: all ${AnimationDuration.d_basic} ease-in-out;
			transition-property: opacity, transform;
		}
		${TransitionSelector.active} {
			z-index: 1;
			opacity: 1;
			transform: scale(1);
		}
		${TransitionSelector.inactive} {
			z-index: 0;
			opacity: 0;
			transform: scale(.85);
		}
	`
};

function createFromStyle(style: CssOutput): React.FC<SwitchTransitionProps> {

	const TransitionEntry = styled(AbsoluteToFlexContainer)`
		${style}
	`;

	return (props) => {
		const { children, ...otherProps } = props;
		return (
			<FlexToParentOfAbsolute>
				<StrictSwitchTransition {...otherProps}>
					<TransitionEntry>
						{children}
					</TransitionEntry>
				</StrictSwitchTransition>
			</FlexToParentOfAbsolute>
		);
	};
}

/** 
 * A wrapper component that creates a structure like:
 * 
 * ```
 * - Flex child with position relative
 *   - SwitchTransition
 *     - Absolute child with a style from {@link basicTransitionStyles} that also is a flex container
 *       - [children]
 * ```
 * 
 * Useful for abstracting away all the extra setup required with switch transitions
 * that require absolute positioning.
 */
export const BasicFlexSwitchTransition = {
	PageSlide: createFromStyle(basicTransitionStyles.pageSlide),
	Fade: createFromStyle(basicTransitionStyles.fade),
	FadeScale: createFromStyle(basicTransitionStyles.fadeScale),
};