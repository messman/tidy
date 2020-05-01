import { AllResponse } from "./all-response";

/*
	Problem: when JS dates are stringified, they become ISO-8601 date time strings. (2020-05-09T03:59:59.999Z)
	When parse, they stay that way. They don't become Date instances again.

	There's generally two ways to solve that problem:
	
	1. Serialize with a special serializer/deserializer function pair. The serializer adds a prefix that
		is checked by the deserializer to know when to parse as a date.
	2. Just have a special deserializer that looks for ISO 8601. 

	These are essentially the same tactic. Both are not ideal, but (1) is easier than (2), because (2)
	requires using a regex for ISO 8601 which might be unreliable.

	The only downside to (1) is that you might not always have control over the serialization.
	In that case, you might have to change the code around a bit or double-serialize.

	The downside to both is you might not have access to the deserializer.
	But it sure beats writing a custom parser function for each model.

	More info:
	https://stackoverflow.com/questions/1792865/how-to-use-json-parse-reviver-parameter-to-parse-date-string
	https://stackoverflow.com/questions/29881343/using-json-parse-with-date-fields

	Note: in Express, you can use middleware to add in the serialization replacer.
	https://itnext.io/how-json-stringify-killed-my-express-server-d8d0565a1a61

	MDN Parse & Stringify:
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
*/

export const defaultDateMark = '_$D_';

/**
 * Serializes the object. Must be deserialized with the deserializer function.
 * Specially serializes date objects so that they are still date objects when deserialized.
*/
export function serialize(response: AllResponse, dateMarkOverride?: string): string {
	return JSON.stringify(response, createReplacer(dateMarkOverride));
}

/**
 * Deserializes the object. Must be serialized with the serializer function.
 * Specially deserializes date objects so that they are still date objects instead of strings.
 */
export function deserialize(response: string, dateMarkOverride?: string): AllResponse {
	return JSON.parse(response, createReviver(dateMarkOverride));
}

export function createReplacer(dateMarkOverride?: string): (key: string, value: any) => any {
	const dateMark = dateMarkOverride || defaultDateMark;

	return function (this: any, key: string, value: any) {
		// Interestingly enough, the 'value' has already had its 'toJSON' method called before we get it here!
		// So the Date is already a string. We need to look on the 'this' value for the undisturbed Date object.
		// Also 'instanceof' is problematic, but we're okay with it here. See https://stackoverflow.com/a/643827
		if (this[key] instanceof Date) {
			return dateMark + value;
		}
		return value;
	}
}

export function createReviver(dateMarkOverride?: string): (key: string, value: any) => any {
	const dateMark = dateMarkOverride || defaultDateMark;

	return function (this: any, _key: string, value: any) {
		if (value && typeof value === 'string' && value.startsWith(dateMark)) {
			// Assume this is an ISO-8601 string. In reality, it could be anything, including something invalid. See https://stackoverflow.com/a/643827
			return new Date(value.substr(dateMark.length));
		}
		return value;
	}
}