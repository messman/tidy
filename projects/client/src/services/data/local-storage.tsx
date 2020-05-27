import * as React from 'react';

/** Using a wrapper object allows us to store falsy values. */
interface Wrapper<T> {
	v: T;
}

/** Returns a function that will prefix the key to a namespace to avoid collisions. */
export function keyFactory(namespace: string): (key: string) => string {
	return function getKey(key: string) {
		return `${namespace}_${key}`;
	};
}

/**
 * Gets from LocalStorage. If no value exists, returns undefined.
 * Preserves falsy, empty string, and null.
 */
export function get<T>(key: string): T | undefined {
	try {
		const item = window.localStorage.getItem(key);
		if (item) {
			const wrapped = JSON.parse(item) as Wrapper<T>;
			return wrapped.v;
		}
	} catch (error) {
		console.log(error);
	}
	return undefined;
}

/** Sets to LocalStorage. */
export function set<T>(key: string, value: T): void {
	try {
		const wrapper: Wrapper<T> = {
			v: value
		};
		window.localStorage.setItem(key, JSON.stringify(wrapper));
	} catch (error) {
		console.log(error);
	}
}

/** Removes from LocalStorage. */
export function remove(key: string): void {
	window.localStorage.removeItem(key);
}

export type UseLocalStorageReturn<T> = [T, (value: T) => void];

/**
 * Creates a state variable that also saves to LocalStorage.
 * Breaks when undefined is used as the value.
*/
export function useLocalStorage<T>(key: string, initialValue: T | (() => T), isValid: (value: T) => boolean): UseLocalStorageReturn<T> {
	const [storedValue, setStoredValue] = React.useState(() => {
		let value: T = get<T>(key)!;
		if (value === undefined || (isValid && !isValid(value))) {
			value = initialValue instanceof Function ? initialValue() : initialValue;
			set(key, value);
		}
		return value;
	});

	function setValue(value: T): void {
		if (!Object.is(value, storedValue)) {
			setStoredValue(value);
			set(key, value);
		}
	};
	return [storedValue, setValue];
}