import { DateTime } from "luxon";
import { getNOAAData } from "./api-noaa";
import { getNWSData, NWSResponse } from "./api-nws";
import { getSunData, SunResponse } from "./api-sun";

import { serialize, SerializedAPIResponse } from "./serialize";
import { APIResponse, RMessageInstance } from "../../../../../data/apiResponse";
export { SerializedAPIResponse } from "./serialize";

export interface RequestContext {
	now: DateTime,

	weatherHourGap: number,
	tidesPast: DateTime,

	shortTermCutoff: DateTime,
	longTermCutoff: DateTime,
}

const tidesPastDays = 1; // 1 day (to beginning of day)
const shortTermDays = 3; // 3 days (to end of day)
const longTermDays = 7; // 7 days (to end of day)


export async function getData(): Promise<SerializedAPIResponse> {
	// Get the current time in New York, which matches Wells, Maine, and includes DST offset.
	const now = DateTime.local().setZone("America/New_York");

	const context: RequestContext = {
		now: now,
		weatherHourGap: 3,
		tidesPast: now.minus({ days: tidesPastDays }).startOf("day"),

		// Use start of next day, instead of "23:59:99..."
		shortTermCutoff: now.plus({ days: shortTermDays + 1 }).startOf("day"),
		longTermCutoff: now.plus({ days: longTermDays + 1 }).startOf("day"),
	};

	let res: APIResponse<Date> = {
		info: {
			time: new Date()
		},
		success: null,
		error: null
	};
	try {
		const errors: RMessageInstance[] = [];

		// const noaaResponse = await getNOAAData();
		// if (noaaResponse.errors.length) {
		// 	errors.push(...noaaResponse.errors);
		// }
		// else {
		// 	return noaaResponse.result as any as SerializedAPIResponse
		// }

		const nwsResponse = await getNWSData(context);
		if (nwsResponse.errors.length) {
			errors.push(...nwsResponse.errors);
		}
		else {
			return nwsResponse.result as any as SerializedAPIResponse
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