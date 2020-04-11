import { APIResponse, getSuccessResponse, getErrorResponse } from "../../../data";


export function mockDataCall(timeout: number, pass: boolean): Promise<APIResponse> {
	return timeoutPromise(pass ? getSuccessResponse() : getErrorResponse(), pass, timeout);
}

function timeoutPromise<S>(val: S, pass: boolean, timeout: number): Promise<S> {
	return new Promise((res, rej) => {
		setTimeout(() => {
			if (pass)
				res(val);
			else
				rej(val);
		}, timeout);
	});
}