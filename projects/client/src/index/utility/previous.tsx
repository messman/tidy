import * as React from 'react';

/**
 * Returns the previous value, or undefined if no previous value is stored.
 * Pass undefined to avoid saving a new value.
 * 
 * Does not retain undefined if that value is passed.
 * Does not return the current value.
 * 
 * Safe across multiple re-renders.
 * Not the same as returning the value from the previous **render**.
 * 
 */
export function usePreviousNotUndefined<T>(value: T | undefined): T | undefined {

	// Keep up to date with the value.
	const previousValueRef = React.useRef<T | undefined>(undefined);
	// Keep up to date with the previous value.
	const valueRef = React.useRef<T | undefined>(undefined);

	React.useEffect(() => {
		if (value !== undefined && value !== valueRef.current) {
			previousValueRef.current = valueRef.current;
			valueRef.current = value;
		}
	}, [value]);

	// If value hasn't changed, use the previous ref. If value has changed, use the more current ref.
	return value === valueRef.current ? previousValueRef.current : valueRef.current;
}