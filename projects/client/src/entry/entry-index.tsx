import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
// import { InvalidCheck } from '@/areas/alert/invalid';
// import { Loading } from '@/areas/alert/loading';
// import { ComponentLayoutProvider } from '@/areas/layout/component-layout';
// import { ApplicationResponsiveLayout } from '@/areas/layout/layout';
// import { MenuBar } from '@/areas/menu-bar/menu-bar';
import { ThemeContextProvider } from '@/core/theme/theme';
import { BatchResponseProvider } from '@/services/data/data';
import { DataSeedProvider } from '@/services/data/data-seed';
import { lowerBreakpoints } from '@/services/layout/window-layout';
import { RequestFetchProvider } from '@/services/network/request-fetch-provider';
import { provider, ProviderComposer, ProviderWithProps } from '@/services/provider-utility';
import { DocumentVisibilityProvider, WindowDimensionsProvider, WindowMediaLayoutProvider } from '@messman/react-common';

const App: React.FC = () => {

	const providers: ProviderWithProps[] = [
		provider(DocumentVisibilityProvider, {}),
		provider(ThemeContextProvider, {}),
		provider(WindowDimensionsProvider, {}),
		provider(WindowMediaLayoutProvider, { lowerBreakpoints: lowerBreakpoints, breakpointUnit: 'rem' as 'rem' }),
		provider(RequestFetchProvider, {}),
		provider(DataSeedProvider, {}),
		provider(BatchResponseProvider, {}),
	];

	return (
		<ProviderComposer providers={providers}>
			<FlexRoot>
				{/* <InvalidCheck error={null}>
					<Loading>
						<MenuBar>
							<ApplicationResponsiveLayout />
						</MenuBar>
					</Loading>
				</InvalidCheck> */}
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
