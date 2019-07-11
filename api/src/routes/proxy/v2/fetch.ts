import { getNOAAData } from "./api-noaa";
import { getNWSData, NWSResponse } from "./api-nws";
import { getSunData, SunResponse } from "./api-sun";

import { serialize, SerializedAPIResponse } from "./serialize";
import { APIResponse, RMessageInstance } from "../../../../../data/apiResponse";
export { SerializedAPIResponse } from "./serialize";


export async function getData(): Promise<SerializedAPIResponse> {

	let res: APIResponse<Date> = {
		info: {
			time: new Date()
		},
		success: null,
		error: null
	};
	try {
		const errors: RMessageInstance[] = [];

		const noaaResponse = await getNOAAData();
		if (noaaResponse.errors.length) {
			errors.push(...noaaResponse.errors);
		}
		else {
			return noaaResponse.result as any as SerializedAPIResponse
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
	return serialize(res);
}