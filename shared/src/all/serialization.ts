import { AllResponse } from "./allResponse";

export function serialize(response: AllResponse): string {
	return JSON.stringify(response);
}

export function deserialize(response: string): AllResponse {
	return JSON.parse(response);
}