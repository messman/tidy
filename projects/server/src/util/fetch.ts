// TODO - make it fail when fetch is not imported. For some reason it doesn't warn.
import * as fetch from "node-fetch";
import { Issue, errorIssue } from "tidy-shared";

export interface FetchResponse<T> {
	result: T | null,
	issues: Issue[] | null
}

/**
 * Gets the JSON at the URL. If failed, won't throw. Instead result will be null and the issues array
 * will have an entry.
 */
export async function getJSON<T>(url: string, name: string, headers: {} | null): Promise<FetchResponse<T>> {

	function handleError(devMessage: string): FetchResponse<T> {
		const userMessage = `error while fetching data for ${name}`;
		const data = { url: url };

		return {
			result: null,
			issues: [errorIssue(userMessage, devMessage, data)],
		}
	}

	try {
		const res = await fetch.default(url, {
			headers: headers ? new fetch.Headers(headers) : undefined
		});
		if (res.ok) {
			const json = await res.json();
			return {
				result: json,
				issues: null,
			};
		}
		else {
			return handleError(`fetch status error (${res.status}): ${res.statusText}`);
		}
	} catch (e) {
		const error = e as Error;
		return handleError(`fetch exception caught: ${error.message}`);
	}
}