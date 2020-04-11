import { DateTime } from "luxon";
import { getNWSData, NWSResponse } from "../../../services/nws/nws";

import { serialize, SerializedAPIResponse } from "./serialize";
import { APIResponse, Issue } from "../../../data/apiResponse";
import { createContext } from "../../../services/context";
export { SerializedAPIResponse } from "./serialize";

export async function getData(): Promise<SerializedAPIResponse> {

	const cc = createContext(null);

	let res: APIResponse<DateTime> = {
		info: {
			time: cc.context.timeOfRequest
		},
		success: null,
		error: null
	};
	try {
		const errors: Issue[] = [];

		// const noaaResponse = await getNOAAData();
		// if (noaaResponse.errors.length) {
		// 	errors.push(...noaaResponse.errors);
		// }
		// else {
		// 	return noaaResponse.result as any as SerializedAPIResponse
		// }

		const nwsResponse = await getNWSData(cc);
		if (nwsResponse.issues.length) {
			errors.push(...nwsResponse.issues);
		}
		else {
			res.success = nwsResponse.result as any;
		}

		if (errors.length) {
			res.error = {
				errors
			};
			res.success = null;
		}
	}
	catch (e) {
		console.error(e);
	}

	// TODO - serialize
	return res as any as SerializedAPIResponse;
	//return serialize(res);
}