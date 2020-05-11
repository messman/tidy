import { AllResponse, deserialize } from 'tidy-shared';
import { DEFINE } from '@/services/define';

export async function getData(minTimeMs: number): Promise<AllResponse> {

	const localTestData = DEFINE.localTestData;
	if (localTestData) {
		return localTestData;
	}
	const url = DEFINE.fetchUrl;

	return wrapPromise(fetch(url)
		.then((res) => {
			if (res.ok) {
				return res.text()
					.then((text: string) => {
						return deserialize(text);
					})
					.then((json: AllResponse) => {
						return json;
					})
					.catch((err: Error) => {
						console.error(err);
						throw new Error('There was a problem deserializing the API response');
					});
			}
			else {
				if (res.status === 404) {
					throw new Error('The application could not connect to the API (404)');
				}
				throw new Error(`The API experienced an error (${res.status})`);
			}
		})
		.catch((err) => {
			if (!(err instanceof Error)) {
				err = new Error(err);
			}
			console.error(url, err);
			throw err;
		}), minTimeMs);
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

// Delays a promise, including its error.
function wrapPromise<T>(promise: Promise<T>, time: number): Promise<T> {
	const now = Date.now();
	return promise
		.then((val) => {
			const diff = Date.now() - now;
			if (diff < time)
				return timeoutPromise(val, true, time - diff);
			else
				return val;
		})
		.catch((err) => {
			const diff = Date.now() - now;
			if (diff < time)
				return timeoutPromise(err, false, time - diff);
			else
				return err;
		});
}



