// Wraps common code for interfacing with LocalStorage.

/** Using a wrapper object allows us to store falsy values. */
interface Wrapper<T> {
	v: T
}

/** Returns a function that will prefix the key to a namespace to avoid collisions. */
export function keyFactory(namespace: string): (key: string) => string {
	return function getKey(key: string) {
		return `${namespace}_${key}`;
	}
}

/** Gets from LocalStorage. */
export function get<T>(key: string): T | null {
	try {
		const item = window.localStorage.getItem(key);
		if (item) {
			const wrapped = JSON.parse(item) as Wrapper<T>;
			return wrapped.v;
		}
	} catch (error) {
		console.log(error);
	}
	return null;
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