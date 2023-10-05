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
	wasTabSelectedByScroll: boolean;
	tabPath: Map<Tab, string>;
}

export interface NavOutput {
	selectedTab: Tab;
	wasTabSelectedByScroll: boolean;
	pathForTab: (tab: Tab) => string;
	selectTabWithPath: (tab: Tab, path: string) => void;
	/** If selected, clears its path */
	selectTab: (tab: Tab) => void;
	selectTabByScroll: (tab: Tab) => void;
}

const [NavContextProvider, useNavContext] = createContextConsumer<NavOutput>();

export const useNav = useNavContext;

export const NavProvider: React.FC<React.PropsWithChildren> = (props) => {
	const { children } = props;

	const [state, setState] = React.useState<NavState>(() => {
		return {
			selectedTab: tab.now,
			tabPath: new Map<Tab, string>(),
			wasTabSelectedByScroll: false,
		};
	});
	const { selectedTab, tabPath, wasTabSelectedByScroll } = state;

	const value = React.useMemo<NavOutput>(() => {
		return {
			selectedTab,
			wasTabSelectedByScroll,
			pathForTab: (tab) => {
				return tabPath.get(tab) || '';
			},
			selectTabWithPath: (tab, path) => {
				setState((prev) => {
					const newMap = new Map(prev.tabPath);
					newMap.set(tab, path);
					return {
						selectedTab: tab,
						tabPath: newMap,
						wasTabSelectedByScroll: false
					};
				});
			},
			selectTab: (tab) => {
				setState((prev) => {
					// If selected already, clear path
					if (tab === prev.selectedTab) {
						const newMap = new Map(prev.tabPath);
						newMap.set(tab, '');
						return {
							...prev,
							tabPath: newMap,
							wasTabSelectedByScroll: false
						};
					}
					// Else just select
					return {
						...prev,
						selectedTab: tab,
						wasTabSelectedByScroll: false
					};
				});
			},
			selectTabByScroll: (tab) => {
				setState((prev) => {
					// Else just select
					return {
						...prev,
						selectedTab: tab,
						wasTabSelectedByScroll: true
					};
				});
			}
		};
	}, [selectedTab, tabPath, wasTabSelectedByScroll]);

	return (
		<NavContextProvider value={value}>
			{children}
		</NavContextProvider>
	);
};