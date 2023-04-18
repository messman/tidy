import { DateTime } from 'luxon';

/*
	#REF_API_DATE_SERIALIZATION

	When JS Date objects are stringified, they become ISO-8601 date time strings. (2020-05-09T03:59:59.999...)
	When parsed, they stay as strings. They don't become Date instances again.

	If we can control the serialization and deserialization, we can abstract this problem away
	by adding a mark to the front of a date string to know that we should parse it as a Date.
	(We could also try to use a regex for ISO-8601, but that is non-trivial.)

	More info:
	https://stackoverflow.com/questions/1792865/how-to-use-json-parse-reviver-parameter-to-parse-date-string
	https://stackoverflow.com/questions/29881343/using-json-parse-with-date-fields

	Note: in Express, you can use middleware to add in the serialization replacer.
	https://itnext.io/how-json-stringify-killed-my-express-server-d8d0565a1a61

	MDN Parse & Stringify:
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
*/
export const dateSerializationMark = '_$D_';

/**
 * Serializes the object. Must be deserialized with the deserializer function.
 * Specially serializes date objects so that they are still date objects when deserialized.
*/
export function serialize(response: any): string {
	return JSON.stringify(response, createSerializationReplacer());
}

/** To be used to serialize DateTime values to strings on the server. */
export function createSerializationReplacer(): (key: string, value: any) => any {

	return function (this: any, key: string, value: any) {
		// Interestingly enough, the 'value' has already had its 'toJSON' method called before we get it here!
		// So the Date is already a string. We need to look on the 'this' value for the undisturbed Date object.
		// Also 'instanceof' is problematic, but we're okay with it here. See https://stackoverflow.com/a/643827
		if (DateTime.isDateTime(this[key])) {
			return dateSerializationMark + value;
		}
		return value;
	};
}

export function serializeDateTime(value: DateTime): string {
	return dateSerializationMark + value.toJSON();
}

/**
 * Deserializes the object. Must be serialized with the serializer function.
 * Specially deserializes date objects so that they are DateTime objects instead of strings.
 */
export function deserialize<T>(response: string): T {
	return JSON.parse(response, createSerializationReviver());
}

/** To be used to deserialize DateTime strings to DateTime instances. */
export function createSerializationReviver(): (key: string, value: any) => any {
	return function (this: any, _key: string, value: any) {
		if (isSerializedDateTimeString(value)) {
			// Assume this is an ISO-8601 string. In reality, it could be anything, including something invalid. See https://stackoverflow.com/a/643827
			// It could even be a user-provided string.
			// The DateTime.fromISO function is pretty strict, so we should be fine.
			return deserializeToDateTime(value);
		}
		return value;
	};
}

export function isSerializedDateTimeString(value: any): boolean {
	return value && typeof value === 'string' && value.startsWith(dateSerializationMark);
}

export function deserializeToDateTime(value: string): any {
	const dateStringValue = value.substring(dateSerializationMark.length);
	return DateTime.fromISO(dateStringValue, { setZone: true });
}

/** Serializes DateTime objects and booleans for travel as a string in a request path parameter or request query parameter. */
export function serializeForPathOrQuery(value: string | number | DateTime | boolean): string {
	if (value === true) {
		return '1';
	}
	if (value === false) {
		return '0';
	}
	if (DateTime.isDateTime(value)) {
		return serializeDateTime(value);
	}
	// Allow strings and numbers to continue as-is
	return value.toString();
}

/** Deserializes booleans from strings used in a request path parameter or request query parameter. */
export function deserializeBooleanFromPathOrQuery(value: any): any {
	if (value === '1') {
		return true;
	}
	if (value === '0') {
		return false;
	}
	return value;
}