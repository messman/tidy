import { APIResponse } from "../../../data/apiResponse";

export interface SerializedDate {
	d: string,
	_d_: number
}
export type SerializedAPIResponse = APIResponse<SerializedDate>;

export function serialize(apiResponse: APIResponse<Date>): SerializedAPIResponse {
	return apiResponse as any as SerializedAPIResponse;
}

export function deserialize(apiResponse: SerializedAPIResponse): APIResponse<Date> {
	return null;
}