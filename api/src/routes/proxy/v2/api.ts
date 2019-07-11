import { RMessageInstance } from "../../../../../data/apiResponse";

export interface SingleAPIResponse<T> {
	result: T,
	warnings: RMessageInstance[],
	errors: RMessageInstance[]
}

export function message(user: string, dev: string): RMessageInstance {
	return {
		user,
		dev
	}
}
