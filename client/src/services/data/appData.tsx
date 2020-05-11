import * as React from 'react';
import { createContext, useContext } from 'react';
import { usePromise, PromiseState } from '@/services/promise';
import { getData } from '@/services/data/data';
import { AllResponse } from 'tidy-shared';

const AppDataContext = createContext<PromiseState<AllResponse>>(null!);

export const AppDataProvider: React.FC = (props) => {
	const promiseState = usePromise(() => getData(650));

	return (
		<AppDataContext.Provider value={promiseState}>
			{props.children}
		</AppDataContext.Provider>
	);
}

export const useAppDataContext = () => useContext(AppDataContext);