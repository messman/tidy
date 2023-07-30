import * as React from 'react';
import styled from 'styled-components';
import { createContextConsumer } from '@messman/react-common';
import { SVGIcon, SVGIconUrl } from '@wbtdevlocal/assets';
import { AnimationDuration, StrictTransition, TransitionSelector } from '../animation/animation';
import { StyledFC } from '../primitive/primitive-styled';

/*
	Icon loading by URL - #REF_ASSETS_ICONS_URL

	The point is to include lots of SVG Icons on the webpage without worrying so much about huge bundle
	sizes. To do this, we have exported our icons as both individual files that can be loaded from a static
	file server and as React components. The React components, if not referenced, are not included in the 
	bundle output (thanks to Webpack tree-shaking).

	When we pass the URL to an icon instead of the icon component, it will trigger a request to the static 
	file server. The response could be already cached, which would be great. But if not, it may take a half second
	or so to load. This will be noticeable because the request doesn't start until the React tree renders
	and gets to the icon component and sees that a request needs to be made. 

	We also are limited by the number of concurrent connections that can be made through the browser.
	On HTTP/1.1, it's something like 6 per domain at one time. To ensure icon loading doesn't take up all
	the time, we purposefully have a code-enforced limit in the logic to only load two icons by URL at one time.
	The rest are queued.

	There's other optimization logic in the below code as well: if a bundled icon already is in the application, we use
	that instead of loading by URL because it's redundant. We also cache the most recent X loaded URLs in-memory
	so that if there's an icon constantly added/removed from the DOM it only ever fetches one time.

	Hopefully all this will support a huge number of icons without bloating bundles.
*/


interface UrlIconState {
	isError: boolean;
	rawSVG: string | null;
}

export interface UrlIconProps {
	iconName: string;
}

/**
 * Not for external use. Use 'Icon' instead.
 * 
 * Loads an icon by URL. Only meant to be used with our special icons and not with any random URL.
 */
export const UrlIcon: StyledFC<UrlIconProps> = (props) => {
	const { iconName, className } = props;

	// This will not cause re-renders.
	const cache = useSVGIconUrlCache();

	const [state, setState] = React.useState<UrlIconState>(() => {
		// Optimization: check first if this icon has already been loaded by URL.
		let isError = false;
		let rawSVG: string | null = null;
		const entry = cache.getEntry(iconName);
		if (entry) {
			// We have it, either the error status or the raw SVG file contents.
			isError = entry.isErrorFetchingRawSVG;
			rawSVG = entry.rawSVG;
			//console.log('Fetching from cache');
		}
		return { isError, rawSVG };
	});
	const { isError, rawSVG } = state;

	function onFetchFinished() {
		// Now check the cache again.
		const entry = cache.getEntry(iconName);
		setState({
			isError: !entry || entry.isErrorFetchingRawSVG,
			rawSVG: entry && entry.rawSVG
		});
	}

	// Trick to stop listening to the loading context after it's loaded - use a child component.
	const loadListenerRender = (!isError && !rawSVG) ? (
		<UrlIconLoadListener iconName={iconName} onFetchFinished={onFetchFinished} />
	) : null;

	return (
		<>
			{loadListenerRender}
			<UrlIcon_Container className={className}>
				<StrictTransition isActive={!!rawSVG} renderWhileExited={true}>
					<UrlIcon_RawSpan dangerouslySetInnerHTML={{ __html: rawSVG || '' }} />
				</StrictTransition>
			</UrlIcon_Container>
		</>
	);
};

/** Meant to work just like an SVG by just being a wrapper over it. */
const UrlIcon_Container = styled.span`
	display: inline-block;
	position: relative;
`;

/** Holds the SVG within and does a subtle animation when the SVG loads. */
const UrlIcon_RawSpan = styled.span`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;

	will-change: transform;

	${TransitionSelector.transitioning} {
		transition: all ${AnimationDuration.b_zip} ease-in-out;
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
		transform: scale(.6);
	}

	svg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
`;

interface UrlIconLoadListenerProps {
	iconName: string;
	onFetchFinished: () => void;
}

/**
 * A "dead-end" listener component. Necessary because it uses a hook that will cause the component
 * to render many times.
 */
const UrlIconLoadListener: React.FC<UrlIconLoadListenerProps> = (props) => {
	const { iconName } = props;

	// This will not cause re-renders.
	const cache = useSVGIconUrlCache();
	const entry = cache.getEntry(iconName);
	const isFetching = !!entry?.isFetchingRawSVG;
	// This will cause many re-renders, because it fires whenever the queue changes.
	const { enqueue, isFinished } = useSVGIconUrlLoaderContext();
	const isFetchFinished = isFinished(iconName);

	React.useEffect(() => {
		// If finished, tell our parent (so we can be unmounted); else, if not fetching, queue ourselves.
		if (isFetchFinished) {
			props.onFetchFinished();
		}
		else if (!isFetching) {
			enqueue(iconName);
		}
	}, [isFetching, iconName, enqueue, isFetchFinished, props.onFetchFinished]);

	return null;
};

interface IconCacheEntry {
	/** These are components we bundled in. This is ideal - no URL loading needed (but at the cost of bundle size.) */
	SVGIconComponent: SVGIcon | null;
	/** The raw file contents. */
	rawSVG: string | null;
	isErrorFetchingRawSVG: boolean;
	isFetchingRawSVG: boolean;
}

const defaultCacheEntry: IconCacheEntry = { SVGIconComponent: null, isFetchingRawSVG: false, isErrorFetchingRawSVG: false, rawSVG: null };

/**
 * Pretty arbitrary.
 * Only applies to entries raw SVG strings.
 * */
const entriesToKeepInCache = 40;
/** Also arbitrary. Supposedly a browser can only do 6 max and we want space for other requests to work. */
const urlsToFetchAtOnce = 2;

export type SvgIconUrlLoadCache = Record<string, IconCacheEntry>;

/** Houses multiple SVG load providers in the right order. */
export const SVGIconUrlLoadProvider: React.FC<React.PropsWithChildren> = (props) => {
	return (
		<SVGIconUrlLoadCacheProvider>
			<SVGIconUrlLoaderProvider>
				{props.children}
			</SVGIconUrlLoaderProvider>
		</SVGIconUrlLoadCacheProvider>
	);
};


export interface SVGIconUrlLoadCacheProviderOutput {
	/** Adds a bundles component. We do this so we can avoid loading those same icons by URL. */
	addSVGIconComponent: (component: SVGIcon) => void;
	/** Gets an entry to check if it's cached. */
	getEntry: (name: string) => IconCacheEntry | null;
	/** Marks that an icon is about to be loaded by URL so that the same fetch isn't queued multiple times. */
	markFetchStart: (name: string) => void;
	/** Adds the loaded raw SVG contents. If null, error. */
	addLoadedRawSVG: (name: string, rawSVG: string | null) => void;
}

const [SVGIconUrlLoadCacheContextProvider, useSVGIconUrlLoadCacheContext] = createContextConsumer<SVGIconUrlLoadCacheProviderOutput>();

/**
 * Provides a cache that is held by ref and not state, so all components that 
 * hook into its context will not re-render. This is by design, as we typically only need to 
 * check when first rendering a component, and not all the time.
 * 
 * This could have been a cache outside of React, but making it a provider helps with testability 
 * in our test platforms.
 */
const SVGIconUrlLoadCacheProvider: React.FC<React.PropsWithChildren> = (props) => {

	// Create our caches as refs.
	const cache = React.useRef<SvgIconUrlLoadCache>(null!);
	const cacheRecency = React.useRef<string[]>(null!);
	if (cache.current === null) {
		cache.current = {}!;
		cacheRecency.current = [];
	}

	const output = React.useMemo(() => {
		return {
			addSVGIconComponent: (component) => {
				const entry = cache.current[component.iconName] || { ...defaultCacheEntry };
				if (!entry.SVGIconComponent) {
					entry.SVGIconComponent = component;
					//console.log('Add component to icon cache', { name: component.iconName });
				}
				cache.current[component.iconName] = entry;
			},
			getEntry: (name) => {
				return cache.current[name] || null;
			},
			markFetchStart: (name) => {
				const entry = cache.current[name] || { ...defaultCacheEntry };
				if (!entry.isFetchingRawSVG) {
					entry.isFetchingRawSVG = true;
					//console.log('Start fetching for icon cache', { name });
				}
				cache.current[name] = entry;
			},
			addLoadedRawSVG: (name, rawSVG) => {
				const entry = cache.current[name] || { ...defaultCacheEntry };
				entry.isFetchingRawSVG = false;
				entry.rawSVG = rawSVG;
				cache.current[name] = entry;

				/*
					Now, prune to make space.
					We don't scan the array as we add, so the recency array contains duplicates.
					That's not a problem, because we can just check the time property.
					Scenarios:
					- If we have an SVGIcon that was bundled, we don't need the raw SVG anymore.
					- Keep X number of raw SVG entries otherwise.
					- Discard errors only if they are outside the X limit.
				*/
				const recencyList = cacheRecency.current;
				recencyList.push(name);
				const namesInRecencyList = new Set<string>();

				const newRecency: string[] = [];
				for (let i = recencyList.length - 1; i >= 0; i--) {
					const name = recencyList[i];
					const entry = cache.current[name] || null;
					if (!entry) {
						continue;
					}
					if (entry.SVGIconComponent) {
						if (entry.rawSVG) {
							entry.rawSVG = null;
							entry.isErrorFetchingRawSVG = false;
							//console.log('Pruned icon cache entry due because component exists', { name });
						}
						continue;
					}
					if (entry.rawSVG) {
						if (newRecency.length < entriesToKeepInCache) {
							if (!namesInRecencyList.has(name)) {
								namesInRecencyList.add(name);
								newRecency.push(name);
							}
							continue;
						}
						else {
							// Clear additional
							entry.rawSVG = null;
							entry.isErrorFetchingRawSVG = false;
						}
					}
				}
				// Reverse in-place because we went through in opposite order
				newRecency.reverse();
				cacheRecency.current = newRecency;
				//console.log('Pruned icon cache entries', { cacheLength: newRecency.length });
			}
		} satisfies SVGIconUrlLoadCacheProviderOutput;
	}, []);

	return (
		<SVGIconUrlLoadCacheContextProvider value={output}>
			{props.children}
		</SVGIconUrlLoadCacheContextProvider>
	);
};

export interface SVGIconUrlLoaderProviderOutput {
	enqueue: (name: string) => void;
	isFinished: (name: string) => boolean;
}

const [SVGIconUrlLoaderContextProvider, useSVGIconUrlLoaderContext] = createContextConsumer<SVGIconUrlLoaderProviderOutput>();

/**
 * This provider helps actually load the icon URLs. Components that hook to this context may re-render many 
 * times over if there are many icons to load (like on page load).
 */
const SVGIconUrlLoaderProvider: React.FC<React.PropsWithChildren> = (props) => {

	// Track the queue of icons to load by URL.
	const [queue, setQueue] = React.useState<string[]>([]);
	// Track the number in progress.
	const [inProgress, setInProgress] = React.useState<number>(0);

	// Stable to use in effects.
	const cache = useSVGIconUrlLoadCacheContext();

	const isUnmounted = React.useRef(false);
	React.useEffect(() => {
		return () => {
			isUnmounted.current = true;
		};
	}, []);

	React.useEffect(() => {
		if (inProgress >= urlsToFetchAtOnce || queue.length < 1) {
			//console.log('Nothing to fetch', { inProgress, urlsToFetchAtOnce, queue: queue.length });
			return;
		}

		async function doFetch(name: string) {
			const url = SVGIconUrl[name as keyof typeof SVGIconUrl];
			//console.log('Fetching URL for cache', { name, url });
			/*
				Need to test?
				1. Enable CORS on static file server
				2. Add url prefix if necessary
				3. Add setTimeout
			*/
			try {
				const response = await fetch(url);
				const text = await response.text();

				if (!isUnmounted.current) {
					if (text.startsWith('<svg')) {
						cache.addLoadedRawSVG(name, text);
					}
					else {
						cache.addLoadedRawSVG(name, null);
					}
				}
			}
			catch (e) {
				console.error(e, value);
				if (!isUnmounted.current) {
					cache.addLoadedRawSVG(name, null);
				}
			}
			if (!isUnmounted.current) {
				setInProgress(p => p - 1);
			}
		}

		setInProgress(p => p + 1);
		setQueue((p) => {
			const [name, ...rest] = p;
			// No awaiting
			doFetch(name);
			return rest;
		});
	}, [queue, inProgress]);

	const value = React.useMemo(() => {
		return {
			enqueue: (name) => {
				setQueue((p) => {
					// Check the cache and don't queue if we're already queued / in progress.
					const entry = cache.getEntry(name);
					if (entry && entry.isFetchingRawSVG) {
						return p;
					}
					cache.markFetchStart(name);
					return [...p, name];
				});
			},
			isFinished: (name) => {
				const entry = cache.getEntry(name);
				return !!entry && (!!entry.rawSVG || entry.isErrorFetchingRawSVG);
			}
		} satisfies SVGIconUrlLoaderProviderOutput;
	}, [queue, inProgress, cache]);

	return (
		<SVGIconUrlLoaderContextProvider value={value}>
			{props.children}
		</SVGIconUrlLoaderContextProvider>
	);
};

/** Does not cause re-renders when data changes. Meant for a one-time check on mount. */
export function useSVGIconUrlCache(): Pick<SVGIconUrlLoadCacheProviderOutput, 'addSVGIconComponent' | 'getEntry'> {
	const { addSVGIconComponent, getEntry } = useSVGIconUrlLoadCacheContext();
	return { addSVGIconComponent, getEntry };
}
