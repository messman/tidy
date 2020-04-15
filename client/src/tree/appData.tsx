import * as React from "react";
import { usePromise, PromiseState } from "@/unit/hooks/usePromise";
import { createContext, useContext } from "react";
import { mockDataCall } from "@/data/mock";
import { APIResponse } from "../../../data";

const AppDataContext = createContext<PromiseState<APIResponse>>(null);

export const AppDataProvider: React.FC = (props) => {
	const promiseState = usePromise(() => mockDataCall(650, true));

	return (
		<AppDataContext.Provider value={promiseState}>
			{props.children}
		</AppDataContext.Provider>
	);
}

export const useAppDataContext = () => useContext(AppDataContext);