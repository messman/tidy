/*
	Enums:
	Database-compliant enums must be a specific pattern:
	- Define values explicitly
	- Start values at 100
	- Don't do any sorting logic based off those values
	- If sorted, prefix with a_, b_, etc
	- Have a comment saying it's for the DB

	Other enums must still:
	- Define the first value as 1
	- If sorted, prefix with a_, b_, etc

	TypeScript Enums: https://www.typescriptlang.org/docs/handbook/enums.html
	Note: numeric enums have reverse mapping; string enums do not!
*/

/** 
 * Gets the keys of an enum as a string array.
 * Useful for looping to validate values or set values.
*/
export function enumKeys<T>(enumObject: T): (keyof T)[] {
	// Note: there are two isNaNs in this world. 
	return Object.keys(enumObject).filter(k => isNaN(Number(k))) as (keyof T)[];
}

/**
 * Returns `true` if the value is in the enum.
 * 
 * **NOTE: Only works on reverse-mapped enums!**
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
export function isInEnum<T>(enumObject: T, enumValue: any): enumValue is T[keyof T] {
	return (enumObject as any)[enumValue] !== undefined;
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
export function keyForEnumValue<T>(enumObject: T, enumValue: T[keyof T]): keyof T {
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
export function mapEnumValue<TEnum, TMap extends Record<keyof TEnum, any>>(enumObject: TEnum, map: TMap, enumValue: TEnum[keyof TEnum]): TMap extends Record<keyof TEnum, infer U> ? U : never {
	return map[keyForEnumValue(enumObject, enumValue)];
}

/**
 * Forces a value as an enum type to avoid code like:
 * ```
 * const status: Status = anyVal as unknown as Status;
 * ```
 * 
 * and instead use:
 * 
 * ```
 * const status = asEnum(Status, anyVal);
 * ```
*/
export function asEnum<T>(_enumObject: T, value: any): T[keyof T] {
	return value as unknown as T[keyof T];
}