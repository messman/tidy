import * as React from "react";
import { usePromise, PromiseState } from "@/unit/hooks/promise";
import { createContext, useContext } from "react";
import { getData } from "@/services/data";
import { AllResponse } from "tidy-shared";

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