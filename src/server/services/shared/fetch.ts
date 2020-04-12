// TODO - make it fail when fetch is not imported. For some reason it doesn't warn.
import fetch from "node-fetch";

import { Issue, IssueLevel } from "../../data/apiResponse";

/** Used after we have processed the response. */
export interface SingleAPIResponse<T> {
	result: T,
	issues: Issue[]
}

/** Used before we have processed the response. */
export interface SingleUntypedAPIResponse {
	result: {},
	issues: Issue[]
}


/**
 * Gets the JSON at the URL. If failed, won't throw. Instead result will be null and the issues array
 * will have an entry.
 */
export async function getJSON(url: string, area: string): Promise<SingleUntypedAPIResponse> {
	// TODO - set up logging here
	//console.log(`Requesting ${url}`);

	function handleError(devMessage: string): SingleUntypedAPIResponse {
		area = area ? (area + ' ') : '';
		const userMessage = `There was a problem fetching some of the ${area}data.`;
		const data = { url: url };

		return {
			result: null,
			issues: [errorIssue(userMessage, devMessage, data)],
		}
	}

	try {
		const res = await fetch(url);
		if (res.ok) {
			const json = await res.json();
			return {
				result: json,
				issues: [],
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