import * as React from 'react';
import { createContextConsumer } from '@messman/react-common';
import * as iso from '@wbtdevlocal/iso';

/*
	These definitions are set in the webpack config and resolved at build time.
 */

declare let __DEFINE__: { [key: string]: any; };

let localTestDataSerialized = __DEFINE__.localTestData as { [phrase: string]: string; } | null;
let localTestData: { [phrase: string]: iso.Batch.LatestAPI.Batch.Latest.Response; } | null = null;
if (localTestDataSerialized) {
	localTestData = {};
	Object.keys(localTestDataSerialized).forEach((key) => {
		localTestData![key] = iso.deserialize(localTestDataSerialized![key]);
	});
}

export const DEFINE = {
	buildVersion: __DEFINE__.buildVersion as string,
	buildTime: __DEFINE__.buildTime as number,
	isDevelopment: __DEFINE__.isDevelopment as boolean,
	localTestData: localTestData,
	apiRoot: __DEFINE__.apiRoot as string
};
type Define = typeof DEFINE;

// Make these public on the window for us to easily check
(window as any)['DEFINE'] = DEFINE;

export interface DefineProviderOutput extends Define {
}

const [DefineContextProvider, useDefineContext] = createContextConsumer<DefineProviderOutput>();

export const DefineProvider: React.FC<{ isDevelopment: boolean | null; }> = (props) => {
	const { isDevelopment: parentIsDevelopment } = props;

	const value = React.useMemo<DefineProviderOutput>(() => {
		return {
			...DEFINE,
			isDevelopment: parentIsDevelopment === null ? DEFINE.isDevelopment : parentIsDevelopment
		};
	}, [parentIsDevelopment]);

	return (
		<DefineContextProvider value={value}>
			{props.children}
		</DefineContextProvider>
	);
};

export const useDefine = useDefineContext;