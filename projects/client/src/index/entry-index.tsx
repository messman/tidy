import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { ErrorBoundary } from '@/index/core/error/error-boundary';
import { SVGIconUrlLoadProvider } from '@/index/core/icon/icon-url';
import { DocumentVisibilityProvider, WindowDimensionsProvider, WindowMediaLayoutProvider } from '@messman/react-common';
import { AppLayout } from './app/layout/layout-app';
import { BatchResponseProvider } from './core/data/data';
import { DataSeedProvider } from './core/data/data-seed';
import { RequestFetchProvider } from './core/data/request-fetch-provider';
import { lowerBreakpoints } from './core/layout/window-layout';
import { ThemeContextProvider } from './core/theme/theme-root';
import { provider, ProviderComposer, ProviderWithProps } from './utility/provider-utility';

const App: React.FC = () => {

	const providers: ProviderWithProps[] = [
		provider(DocumentVisibilityProvider, {}),
		provider(ThemeContextProvider, {}),
		provider(WindowDimensionsProvider, {}),
		provider(WindowMediaLayoutProvider, { lowerBreakpoints: lowerBreakpoints, breakpointUnit: 'rem' as 'rem' }),
		provider(RequestFetchProvider, {}),
		provider(DataSeedProvider, {}),
		provider(BatchResponseProvider, {}),
		provider(SVGIconUrlLoadProvider, {}),
	];

	return (
		<ProviderComposer providers={providers}>
			<FlexRoot>
				<ErrorBoundary>
					<AppLayout />
				</ErrorBoundary>
			</FlexRoot>
		</ProviderComposer>
	);
};

const FlexRoot = styled.div`
	position: relative;
	width: 100%;
	height: 100%;

	display: flex;
	flex-direction: column;
`;

ReactDOM.render(<App />, document.getElementById('react-root'));
