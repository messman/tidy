import { DateTime } from 'luxon';
import { KeysOf } from './types';

/**
 * Modifies the object to delete any undefined keys.
 * Returns the same object.
*/
export function strip<T extends object>(value: T): T {
	const keys = Object.keys(value);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i] as keyof typeof value;
		if (value[key] === undefined) {
			delete value[key];
		}
	}
	return value;
}

export function inline<T>(value: T): T { return value; }

/**
 * A helper function that provides defined types for values but keeps key names.
 * Often in dictionaries the keys of the dictionary are lost as 'string' - here they are retained.
 * 
 * Example:
 * ```
 * const x = strictValues<number | null>()({
 *   key1: null,
 *   key2: 77
 * });
 * 
 * // TypeScript will know x has two keys, key1 and key2
 * // TypeScript will type-check the null and 77
 * ```
*/
export function strict<Value>() {
	return function <O>(obj: { [Key in keyof O]: Value }) {
		return obj;
	};
}

/**
 * Returns `true` if the param is an object and not a number, string, etc.
*/
export function isObjectLiteral<T>(val: T): boolean {
	return !!val && Object.getPrototypeOf(val) === Object.prototype;
}

/**
 * Returns `true` if the param is an object with no not-undefined values.
 * ```
 * isEmptyObject({ a: undefined }); // true
 * ```
 */
export function isEmptyObject(val: any): boolean {
	if (!val || !isObjectLiteral(val)) {
		return false;
	}
	const keys = Object.keys(val);
	for (let i = 0; i < keys.length; i++) {
		if (keys[i] !== undefined) {
			return false;
		}
	}
	return true;
}

/** Returns `true` is param is neither null nor undefined. */
export function isNotNullOrUndefined<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined;
}

/**
 * Returns `true` if a is equal to b. Equivalent to `===`, but:
 * - `DateTime` objects are also compared, since they are immutable.
*/
export function isEqualValue<T>(a: T, b: T): boolean {
	if (DateTime.isDateTime(a) && DateTime.isDateTime(b)) {
		return a.equals(b);
	}
	return a === b;
}

const delayParse = 'DELAY_PARSE';
/** Parses request bodies. */
export type Parser<T> = (value: any) => T;
/** Returns the keys that have some type to them other than `undefined`. So `number` and `number | undefined` are returned; `undefined` is not. */
export type NonUndefinedKeys<T> = Exclude<{ [P in keyof T]: Exclude<T[P], undefined> extends never ? never : P; }[keyof T], undefined>;
/** If the type extends object (even if it also extends null or undefined), require a parser. Else, require `1`. */
export type ParserKeyMap<T> = { [P in NonUndefinedKeys<T>]: P extends keyof T ? (NonNullable<T[P]> extends object ? (Parser<NonNullable<T[P]>> | typeof delayParse) : 1) : never };

/**
 * Creates a 'Parser' that can be called to copy an object out of a request body on the server.
 * This is done to ensure there are no extraneous properties that could find their way into server logic or the DB
 * when working with JSON storage.
*/
export function createParser<T>(keyMap: ParserKeyMap<T>): Parser<T> {
	const keys = Object.keys(keyMap) as KeysOf<T>;
	return function (value) {
		const obj = {} as T;
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const propParser = keyMap[key as keyof typeof keyMap];
			const propValue = value[key];
			if (propValue === undefined) {
				continue;
			}
			if (propValue !== null && typeof propParser === 'function') {
				obj[key] = propParser(propValue) as any;
			}
			else {
				// Safety: if we didn't add a Parser, remove the object unless we said "delay".
				obj[key] = isObjectLiteral(propValue) ? (propValue === delayParse ? propValue : {}) : propValue;
			}
		}
		return obj;
	};
}