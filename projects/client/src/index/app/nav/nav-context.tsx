import * as React from 'react';
import { createContextConsumer } from '@messman/react-common';

export const tab = {
	now: 'now',
	week: 'week',
	learn: 'learn',
	about: 'about'
} as const;

export type Tab = typeof tab[keyof typeof tab];

export interface NavState {
	selectedTab: Tab;
	tabPath: Map<Tab, string>;
}

export interface NavOutput {
	selectedTab: Tab;
	pathForTab: (tab: Tab) => string;
	selectTabWithPath: (tab: Tab, path: string) => void;
	/** If selected, clears its path */
	selectTab: (tab: Tab) => void;
}

const [NavContextProvider, useNavContext] = createContextConsumer<NavOutput>();

export const useNav = useNavContext;

export const NavProvider: React.FC<React.PropsWithChildren> = (props) => {
	const { children } = props;

	const [state, setState] = React.useState<NavState>(() => {
		return {
			selectedTab: tab.now,
			tabPath: new Map<Tab, string>()
		};
	});
	const { selectedTab, tabPath } = state;

	const value = React.useMemo<NavOutput>(() => {
		return {
			selectedTab,
			pathForTab: (tab) => {
				return tabPath.get(tab) || '';
			},
			selectTabWithPath: (tab, path) => {
				setState((prev) => {
					const newMap = new Map(prev.tabPath);
					newMap.set(tab, path);
					return {
						selectedTab: tab,
						tabPath: newMap
					};
				});
			},
			selectTab: (tab) => {
				setState((prev) => {
					console.log({ prev, tab });
					// If selected already, clear path
					if (tab === prev.selectedTab) {
						const newMap = new Map(prev.tabPath);
						newMap.set(tab, '');
						return {
							...prev,
							tabPath: newMap
						};
					}
					// Else just select
					return {
						...prev,
						selectedTab: tab,
					};
				});
			}
		};
	}, [selectedTab, tabPath]);

	return (
		<NavContextProvider value={value}>
			{children}
		</NavContextProvider>
	);
};