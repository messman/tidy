export interface ResponseCacheInput {
	expiration: number;
}

export interface ResponseCache<T> {
	cacheItem: ResponseCacheCacheItem<T> | null;
	cacheExpiration: number;
	stats: ResponseCacheStats;
	setCacheItemValue: (item: T | null) => void;
	getCacheTimeRemaining: () => number;
	registerHit: () => ResponseCacheHit<T>;
}

export interface ResponseCacheHit<T> {
	cacheItemValue: T | null;
	timeRemainingInCache: number;
}

export interface ResponseCacheCacheItem<T> {
	value: T;
	cachedAt: number;
}

export interface ResponseCacheStats {
	totalCacheBreaks: number;
	recentCacheHits: number;
	totalCacheHits: number;
	totalHits: number;
}

export function createResponseCache<T>(input: ResponseCacheInput): ResponseCache<T> {

	const state: ResponseCache<T> = {
		cacheItem: null,
		cacheExpiration: input.expiration,
		stats: {
			totalCacheBreaks: 0,
			recentCacheHits: 0,
			totalCacheHits: 0,
			totalHits: 0
		},
		setCacheItemValue: setCacheItemValue,
		getCacheTimeRemaining: getCacheTimeRemaining,
		registerHit: registerHit
	};

	function setCacheItemValue(newItem: T | null): void {
		if (newItem) {
			state.cacheItem = {
				value: newItem!,
				cachedAt: Date.now()
			};
		}
		else {
			state.cacheItem = null;
		}
	}

	function getCacheItem(): ResponseCacheCacheItem<T> | null {
		if (!state.cacheItem) {
			return null;
		}
		if (getCacheTimeRemaining() === 0) {
			state.cacheItem = null;
		}
		return state.cacheItem;
	}

	function getCacheTimeRemaining() {
		if (!state.cacheItem) {
			return 0;
		}
		return Math.max(0, (state.cacheItem.cachedAt + state.cacheExpiration) - Date.now());
	}

	function registerHit(): ResponseCacheHit<T> {
		const { stats } = state;

		let cacheItemValue: T | null = null;

		stats.totalHits++;

		// Check in cache.
		const cacheItem = getCacheItem();
		if (cacheItem) {
			cacheItemValue = cacheItem.value;
			stats.recentCacheHits++;
			stats.totalCacheHits++;
		}
		else {
			stats.totalCacheBreaks++;
			stats.recentCacheHits = 0;
		}

		return {
			cacheItemValue: cacheItemValue,
			timeRemainingInCache: getCacheTimeRemaining()
		};
	}

	return state;
}