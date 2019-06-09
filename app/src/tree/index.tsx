import * as React from "react";
import { useState } from "react";

import * as Noaa from "../services/noaa";

function usePromise<T>(promiseFunc: () => Promise<T>) {
	const [success, setSuccess] = useState<T>(null);
	const [error, setError] = useState<Error>(null);
	const [isLoading, setIsLoading] = useState(false);

	if (!success && !error && !isLoading) {
		setIsLoading(true);
		promiseFunc()
			.then((resp) => {
				setSuccess(resp);
				setIsLoading(false);
			})
			.catch((err: Error) => {
				setError(err);
				setIsLoading(false);
			});
	}
	return [success, error, isLoading];
}

interface AppProps {
}

export const App: React.FunctionComponent<AppProps> = (props) => {

	const [success, error, isLoading] = usePromise(() => Noaa.getNoaaData(650));

	return <h1>Hello! {success ? 't' : 'f'} {error ? 't' : 'f'} {isLoading ? 't' : 'f'}</h1>;
}



