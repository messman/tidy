import * as React from 'react';
import { ErrorBoundary } from '@/core/error/error-boundary';
import { ApplicationLayoutContainer } from '@/core/layout/layout';
import { ViewLoadingBarStatusProvider } from '@/core/layout/view-loader/view-loading-bar';
import { OverlayControlProvider } from '@/core/overlay/control/overlay-controller';
import { OverlayPortalRootProvider } from '@/core/overlay/control/overlay-portal';
import { Spacing } from '@/core/theme/box';
import { css, styled } from '@/core/theme/styled';
import { ThemeContextProvider, themes, useThemeIndex } from '@/core/theme/theme';
import { CosmosDefineProvider } from '@/services/define.fixture-shared';
import { lowerBreakpoints } from '@/services/layout/window-layout';
import { MockApiProvider, useMockApi } from '@/services/network/request-fetch-provider.test';
import { provider, ProviderComposer, ProviderWithProps } from '@/services/provider-utility';
import { DocumentVisibilityProvider, WindowMediaLayoutProvider } from '@messman/react-common';
import * as iso from '@wbtdevlocal/iso';
import { useControlSelect, useControlValue } from './cosmos';
import { createTestServerError } from './data/test-data-utility';

export interface FixtureProps {
	hasMargin?: true;
	providers?: ProviderWithProps[];
}

export function create(Component: React.FC, props: FixtureProps): React.FC {
	return () => {
		const { overlay, hasMargin, providers: additionalProviders } = props;

		const providers: ProviderWithProps[] = [
			provider(CosmosDefineProvider, {}),
			provider(DocumentVisibilityProvider, {}),
			provider(ThemeContextProvider, {}),
			provider(OverlayControlProvider, {}),
			provider(OverlayPortalRootProvider, {}),
			provider(WindowMediaLayoutProvider, { lowerBreakpoints: lowerBreakpoints, breakpointUnit: 'rem' as const }),
			provider(ViewLoadingBarStatusProvider, {}),
			provider(MockApiProvider, {}),
		];

		if (additionalProviders) {
			providers.push(...additionalProviders);
		}

		return (
			<ProviderComposer providers={providers}>
				<TestWrapper hasMargin={!!hasMargin} >
					<ErrorBoundary>
						<Component />
					</ErrorBoundary>
				</TestWrapper>
			</ProviderComposer>
		);
	};
}

interface TestWrapperProps {
	hasMargin: boolean;
}

const TestWrapper: React.FC<TestWrapperProps> = (props) => {
	const { hasMargin } = props;

	const mockApi = useMockApi();

	const isElevatedBackground = useControlValue('Global - Elevated Background', false);

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
	if (hasMargin) {
		render = <Margin>{render}</Margin>;
	};
	render = <Background isElevatedBackground={isElevatedBackground}>{render}</Background>;

	return (
		<>
			{render}
		</>
	);
};

const elevatedBackgroundStyle = css`
	background-color: ${p => p.theme.subtleFill.g_overlay};
`;

const Background = styled(ApplicationLayoutContainer) <{ isElevatedBackground: boolean; }>`
	${p => p.isElevatedBackground ? elevatedBackgroundStyle : null}
`;

const Margin = styled.div`
	margin: ${Spacing.elf24};
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