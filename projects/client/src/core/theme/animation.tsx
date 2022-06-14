import { createClassSelectors } from '@messman/react-common-transition';
import { css } from './styled';

export enum AnimationDuration {
	a_min = '.05s',
	b_zip = '.1s',
	c_quick = '.2s',
	d_basic = '.35s',
	e_slow = '.5s',
	f_fade = '1s',
	g_max = '2s'
}

/**
 * Used to mark class names for the react-common-transition Transition component.
 * Includes the self-identifier and class prefix, like `&.prefix-enter`.
 * */
export const TransitionSelector = createClassSelectors({ useAmpersandPrefix: true });

/**
 * A style for transitioning a "lower"/"old" container away to the left.
 * 
 * When used with a Transition component, the `isActive` property should be
 * `true` to indicate that the container is the visible container, and then set
 * to `false` to transition away. This is opposite of the typical pattern.
 * 
 * The Transition component may also need `isAlwaysMounted` set to `true`.
 */
export const slideTransitionLowerStyle = css`
	${TransitionSelector.enter} {
		transform: translateX(-30%);
	}
	${TransitionSelector.entering} {
		transform: translateX(0%);
		transition: transform ${AnimationDuration.d_basic} ease-in-out;
	}
	${TransitionSelector.exit} {
		transform: translateX(0%);
	}
	${TransitionSelector.exiting} {
		transform: translateX(-30%);
		transition: transform ${AnimationDuration.d_basic} ease-in-out;
	}
	${TransitionSelector.exiting} {
		transform: translateX(-30%);
	}
`;

/**
 * A style for transitioning an "upper"/"new" container in from the right.
 * 
 * When used with a Transition component, the `isActive` property should be
 * `true` to make the component transition in.
 */
export const slideTransitionUpperStyle = css`
	${TransitionSelector.enter} {
		transform: translateX(100%);
	}
	${TransitionSelector.entering} {
		transform: translateX(0%);
		transition: transform ${AnimationDuration.d_basic} ease-in-out;
	}
	${TransitionSelector.exit} {
		transform: translateX(0%);
	}
	${TransitionSelector.exiting} {
		transform: translateX(100%);
		transition: transform ${AnimationDuration.d_basic} ease-in-out;
	}
`;