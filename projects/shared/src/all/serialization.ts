import { DateTime } from 'luxon';
import { AllResponse } from './all-response';

/*
	Problem: when JS dates are stringified, they become ISO-8601 date time strings. (2020-05-09T03:59:59.999...)
	When parsed, they stay as strings. They don't become Date instances again.

	There's generally a few ways to solve that problem:
	
	1. Just deal with it - keep them as strings and parse them as needed in applications.
	2. Serialize with a special serializer/deserializer function pair. The serializer adds a prefix that
		is checked by the deserializer to know when to parse as a date.
	3. Just have a special deserializer that looks for ISO 8601. 

	2 and 3 are essentially the same tactic. Both are not ideal, but 2 is easier than 3, because 3 alone
	requires using a regex for ISO 8601 which might be unreliable.

	The only downside to 2 is that you might not always have control over the serialization.
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

export function createReplacer(dateMarkOverride?: string): (key: string, value: any) => any {
	const dateMark = dateMarkOverride || defaultDateMark;

	return function (this: any, key: string, value: any) {
		// Interestingly enough, the 'value' has already had its 'toJSON' method called before we get it here!
		// So the Date is already a string. We need to look on the 'this' value for the undisturbed Date object.
		// Also 'instanceof' is problematic, but we're okay with it here. See https://stackoverflow.com/a/643827
		if (DateTime.isDateTime(this[key])) {
			return dateMark + value;
		}
		return value;
	};
}

/**
 * Deserializes the object. Must be serialized with the serializer function.
 * Specially deserializes date objects so that they are DateTime objects instead of strings.
 */
export function deserialize(response: string, dateMarkOverride?: string): AllResponse {
	return JSON.parse(response, createReviver(true, dateMarkOverride));
}

/**
 * Deserializes the object. Must be serialized with the serializer function.
 * Specially deserializes date objects to strings if they came from a serialized entity with a date mark.
 */
export function deserializeToString(response: string, dateMarkOverride?: string): AllResponse<string> {
	return JSON.parse(response, createReviver(false, dateMarkOverride));
}


export function createReviver(parseToDateTime: boolean, dateMarkOverride?: string): (key: string, value: any) => any {
	const dateMark = dateMarkOverride || defaultDateMark;

	return function (this: any, _key: string, value: any) {
		if (value && typeof value === 'string' && value.startsWith(dateMark)) {
			// Assume this is an ISO-8601 string. In reality, it could be anything, including something invalid. See https://stackoverflow.com/a/643827
			const dateStringValue = value.substr(dateMark.length);
			return parseToDateTime ? DateTime.fromISO(dateStringValue, { setZone: true }) : dateStringValue;
		}
		return value;
	};
}