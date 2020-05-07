import * as React from "react";
import { get, set } from '@/services/localStorage';

export type UseLocalStorageReturn<T> = [T, (value: T) => void];

/** Creates a state variable that also saves to LocalStorage. */
export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
	const [storedValue, setStoredValue] = React.useState(() => {
		const value = get<T>(key);
		if (value !== undefined && value !== null) {
			return value;
		}
		return initialValue;
	});

	function setValue(value: T): void {
		setStoredValue(value);
		set(key, value);
	};
	return [storedValue, setValue];
}