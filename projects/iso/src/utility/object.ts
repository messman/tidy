import { KeysOf } from './types';

/**
 * Modifies the object to delete any undefined keys.
 * Returns a new object.
 * Used in the database calls, where pg (in node) treats undefined as null.
*/
export function stripUndefined<T extends object>(value: T): T {
	const keys = Object.keys(value);
	const output = {} as T;
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i] as keyof typeof value;
		if (value[key] !== undefined) {
			(output as any)[key] = value[key];
		}
	}
	return output;
}

/**
 * Returns `true` if the param exists and is a JS object literal and not a number, string, Date, String, Number, etc.
 * 
 * Note, this is different than extending `Object` or being `typeof` "Object". 
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

/** If added to the constraint model, we don't check the children of this property. */
const constrainAllowAll = 'all';

export type NonUndefinedKeys<T> = Exclude<{ [P in keyof T]: Exclude<T[P], undefined> extends never ? never : P; }[keyof T], undefined>;
/** If the type extends object (even if it also extends null or undefined), require a parser. Else, require `1`. */
export type ConstraintModel<T extends object> = { [P in NonUndefinedKeys<T>]: P extends keyof T ? (NonNullable<T[P]> extends object ? (ConstraintModel<NonNullable<T[P]>> | typeof constrainAllowAll) : 1) : never };

/** Constrains an object to the provided model, stripping out properties that may exist on the object that don't match the object's type. */
export function constrainObject<T extends object>(input: T, model: ConstraintModel<T>): T {
	const keys = Object.keys(model) as KeysOf<T>;
	const obj = {} as T;
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const modelValue = model[key as keyof typeof model];
		const inputValue = input[key];
		if (inputValue === undefined) {
			// Skip if there's no value to copy anyway
			continue;
		}
		if (isObjectLiteral(inputValue)) {
			if (isObjectLiteral(modelValue)) {
				// Assume it's deeper levels... get recursive
				obj[key] = constrainObject(inputValue as any, modelValue as ConstraintModel<{}>);
			}
			else if (modelValue === constrainAllowAll) {
				obj[key] = inputValue;
			}
		}
		else if (modelValue === 1) {
			obj[key] = inputValue;
		}
	}
	return obj;
}