/*
	Enums:

	TypeScript Enums: https://www.typescriptlang.org/docs/handbook/enums.html
	Note: numeric enums have reverse mapping; string enums do not!
*/

/** 
 * Gets the keys of an enum as a string array.
 * Useful for looping to validate values or set values.
*/
export function enumKeys<T extends object>(enumObject: T): (keyof T)[] {
	// Note: there are two isNaNs in this world. 
	return Object.keys(enumObject).filter(k => isNaN(Number(k))) as (keyof T)[];
}

/** Returns true if the key is in the enum (value is not undefined). Works on all types of enums. */
export function isKeyOfEnum<T extends object>(enumObject: T, enumKey: any): enumKey is keyof T {
	return enumObject[enumKey as keyof T] !== undefined;
}

/**
 * Returns `true` if the value is in the enum.
 * 
 * **NOTE: Only works on two-way enums (number enums)!**
 * Checks by looking up the key and then looking up the value by that key to prove the two-way mapping.
 * 
 * ```
 * // Works
 * enum Enum {
 *   one, // = 0
 *   two, // 1
 * }
 * 
 * // Works
 * enum Enum {
 *  one = 'one',
 *  two = 'two',
 * }
 * 
 * // Does Not Work!
 * enum Enum {
 *   one = 'One',
 *   two = 'Two',
 * }
 * ```
 */
export function isInNumberEnum<T extends object>(enumObject: T, enumValue: any): enumValue is T[keyof T] {
	// Check that we can get the key, and then check that looking up by key returns the value.
	// This helps stop us from making the mistake of providing a one-way enum and a key.
	const key = enumObject[enumValue as keyof T] as keyof T;
	return key !== undefined && enumObject[key] === enumValue;
}

/**
 * Iterates through the enum to see if the value is in the enum.
 * O(n) complexity.
 * If a number enum, use the specific number enum check instead, as that's O(1).
 */
export function isInStringEnum<T extends object>(enumObject: T, enumValue: any): enumValue is T[keyof T] {
	const keys = Object.keys(enumObject) as (keyof T)[];
	for (let i = 0; i < keys.length; i++) {
		if (enumObject[keys[i]] === enumValue) {
			return true;
		}
	}
	return false;
}

/**
 * Returns the key for an enum based on the (numeric) value.
 * For an enum defined like so:
 * ```
 * enum Status {
 *   active,
 *   inactive
 * }
 * ```
 * 
 * This function can be used like:
 * ```
 * const status = Status.active; // 0
 * const statusKey = keyForEnumValue(Status, status) // 'active' <==
 * ```
 */
export function keyForNumberEnumValue<T>(enumObject: T, enumValue: T[keyof T]): keyof T {
	return enumObject[enumValue as unknown as keyof T] as any;
}

/**
 * Returns a value for a map of enum keys to other values.
 * Basically, turns the otherwise-unimportant value of an enum into a business logic value.
 * 
 * 
 * ```
 * enum Test {
 *   one,
 *   two
 * }
 * const map: Record<keyof typeof Test, string> = {
 *   one: 'value1',
 *   two: 'value2'
 * }
 * const mappedValue = enumMapValue(Test, map, Test.one)!; // 'value1'
 * ```
 * 
 */
export function mapNumberEnumValue<TEnum, TMap extends Record<keyof TEnum, any>>(enumObject: TEnum, map: TMap, enumValue: TEnum[keyof TEnum]): TMap extends Record<keyof TEnum, infer U> ? U : never {
	return map[keyForNumberEnumValue(enumObject, enumValue)];
}