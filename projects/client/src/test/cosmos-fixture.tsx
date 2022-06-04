import * as React from 'react';
import { ErrorBoundary } from '@/core/error/error-boundary';
import { ApplicationLayoutContainer } from '@/core/layout/layout';
import { Panel, PanelPadding } from '@/core/layout/panel/panel';
import { Spacing } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { ThemeContextProvider, themes, useThemeIndex } from '@/core/theme/theme';
import { lowerBreakpoints } from '@/services/layout/window-layout';
import { MockApiProvider, useMockApi } from '@/services/network/request-fetch-provider.test';
import { provider, ProviderComposer, ProviderWithProps } from '@/services/provider-utility';
import { DocumentVisibilityProvider, WindowMediaLayoutProvider } from '@messman/react-common';
import * as iso from '@wbtdevlocal/iso';
import { useControlSelect } from './cosmos';
import { createTestServerError } from './data/test-data-utility';

export enum FixtureContainer {
	/** App background, no spacing, flex. Basically no special container. */
	none,
	/** Basically just like the default "none", but the background is the cover background and flex-direction is row. */
	panelFullscreenFlex,
	/** Probably what you want. A panel set against the app background, no spacing, no flex. For quick tests. */
	panel,
	/** Panel, but with padding already applied. For quick tests. */
	panelPadding,
}

export interface FixtureProps {
	container: FixtureContainer;
	providers?: ProviderWithProps[];
}

export function create(Component: React.FC, props: FixtureProps): React.FC {
	return () => {
		const { container, providers: additionalProviders } = props;

		const providers: ProviderWithProps[] = [
			provider(DocumentVisibilityProvider, {}),
			provider(ThemeContextProvider, {}),
			provider(WindowMediaLayoutProvider, { lowerBreakpoints: lowerBreakpoints, breakpointUnit: 'rem' as const }),
			provider(MockApiProvider, {}),
		];

		if (additionalProviders) {
			providers.push(...additionalProviders);
		}

		return (
			<ProviderComposer providers={providers}>
				<TestWrapper container={container} >
					<ErrorBoundary>
						<Component />
					</ErrorBoundary>
				</TestWrapper>
			</ProviderComposer>
		);
	};
}

interface TestWrapperProps {
	container: FixtureContainer;
}

const TestWrapper: React.FC<TestWrapperProps> = (props) => {
	const { container } = props;

	const mockApi = useMockApi();

	const [themeIndex, setThemeIndex] = useThemeIndex();
	const selectedThemeIndex = useControlSelect('Global - Theme', themeOptions, themes[themeIndex].themeInfo.name);
	React.useEffect(() => {
		if (themeIndex !== selectedThemeIndex) {
			setThemeIndex(selectedThemeIndex);
		}
	}, [selectedThemeIndex]);

	const timeout = useControlSelect('Global - Network Speed', networkSpeeds, 'Instant (0)');

	const responseOverride = useControlSelect('Global - Override Response', globalResponses, 'No Override');

	React.useEffect(() => {
		if (mockApi) {
			mockApi.setOverrides({
				timeout: timeout,
				response: responseOverride
			});
		}
	}, [timeout, responseOverride]);

	let render = <>{props.children}</>;
	if (container !== FixtureContainer.none) {

		if (container === FixtureContainer.panelFullscreenFlex) {
			render = <PanelFullscreenFlexLayoutContainer>{render}</PanelFullscreenFlexLayoutContainer>;
		}
		else if (container === FixtureContainer.panel) {
			render = (
				<PanelContainer>
					<Panel>
						{render}
					</Panel>
				</PanelContainer>
			);
		}
		else if (container === FixtureContainer.panelPadding) {
			render = (
				<PanelContainer>
					<Panel>
						<PanelPadding>
							{render}
						</PanelPadding>
					</Panel>
				</PanelContainer>
			);
		}
	}

	return (
		<ApplicationLayoutContainer>
			{render}
		</ApplicationLayoutContainer>
	);
};

const PanelFullscreenFlexLayoutContainer = styled(ApplicationLayoutContainer)`
	background-color: ${p => p.theme.gradient.cover};
	flex-direction: row;
`;

const PanelContainer = styled.div`
	padding: ${Spacing.cat12};
	overflow-y: auto;
`;

const themeOptions: { [key: string]: number; } = {};
themes.forEach((theme, index) => {
	themeOptions[theme.themeInfo.name] = index;
});

const networkSpeeds = iso.strict<number | null>()({
	'Default': null,
	'Instant (0)': 0,
	'Quick (.1s)': 100,
	'Medium (.5s)': 500,
	'Slow (1s)': 1_000,
	'Struggling (3s)': 3_000,
	'Timeout': 60_000
});

const globalResponses = iso.strict<iso.ServerError | false | null>()({
	'No Override': null,
	'Client Error': false,
	'Server Error': createTestServerError(),
});