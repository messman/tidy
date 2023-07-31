import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { ErrorBoundary } from '@/index/core/error/error-boundary';
import { SVGIconUrlLoadProvider } from '@/index/core/icon/icon-url';
import { BatchResponseProvider } from '@/services/data/data';
import { DataSeedProvider } from '@/services/data/data-seed';
import { lowerBreakpoints } from '@/services/layout/window-layout';
import { RequestFetchProvider } from '@/services/network/request-fetch-provider';
import { provider, ProviderComposer, ProviderWithProps } from '@/services/provider-utility';
import { DocumentVisibilityProvider, WindowDimensionsProvider, WindowMediaLayoutProvider } from '@messman/react-common';
import { AppNavigationProvider } from './app/index-area/app-navigation';
import { AppLayout } from './app/layout';
import { ThemeContextProvider } from './core/theme/theme-root';

const App: React.FC = () => {

	const providers: ProviderWithProps[] = [
		provider(DocumentVisibilityProvider, {}),
		provider(ThemeContextProvider, {}),
		provider(WindowDimensionsProvider, {}),
		provider(WindowMediaLayoutProvider, { lowerBreakpoints: lowerBreakpoints, breakpointUnit: 'rem' as 'rem' }),
		provider(RequestFetchProvider, {}),
		provider(DataSeedProvider, {}),
		provider(BatchResponseProvider, {}),
		provider(AppNavigationProvider, {}),
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
