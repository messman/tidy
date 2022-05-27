import * as React from 'react';

export type Provider<T extends object = any> = React.FC<T> | React.ElementType<T>;
export type ProviderWithProps<T extends object = any> = [Provider<T>, T];

export function provider<T extends object = any>(Component: Provider<T>, props: T): ProviderWithProps<T> {
	return [Component, props];
}

export interface ProviderComposerProps {
	providers: ProviderWithProps[] | null;
}

/**
 * Allows providers to be passed in like
 * `[ProviderA, ProviderB, ProviderC]`
 * 
 * instead of like
 * ```
 * <ProviderA>
 *   <ProviderB>
 *     <ProviderC>
 *       {...}
 *     </ProviderC>
 *   </ProviderB>
 * </ProviderA>
 * ```
 */
export const ProviderComposer: React.FC<ProviderComposerProps> = (props) => {
	const { providers, children } = props;

	let composed = children;
	if (providers) {
		for (let i = providers.length - 1; i >= 0; i--) {
			const [Provider, props] = providers[i];
			composed = <Provider {...props}>{composed}</Provider>;
		}
	}
	return (
		<>{composed}</>
	);
};
