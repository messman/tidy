import * as React from 'react';
import styled from 'styled-components';
import { NavProvider, Tab } from '@/index/app/nav/nav-context';
import { BatchResponseProvider, useBatchResponse } from '@/index/core/data/data';
import { DataSeedProvider, useDataSeed } from '@/index/core/data/data-seed';
import { DefaultErrorLoad } from '@/index/core/data/loader';
import { RequestFetchProvider } from '@/index/core/data/request-fetch-provider';
import { ErrorBoundary } from '@/index/core/error/error-boundary';
import { SVGIconUrlLoadProvider } from '@/index/core/icon/icon-url';
import { Panel, PanelPadding } from '@/index/core/layout/layout-panel';
import { ApplicationLayoutContainer } from '@/index/core/layout/layout-shared';
import { LayoutBreakpointRem, lowerBreakpoints } from '@/index/core/layout/window-layout';
import { Spacing } from '@/index/core/primitive/primitive-design';
import { ThemeContextProvider } from '@/index/core/theme/theme-root';
import { provider, ProviderComposer, ProviderWithProps } from '@/index/utility/provider-utility';
import { DocumentVisibilityProvider, WindowMediaLayoutProvider } from '@messman/react-common';
import { Seed } from '@wbtdevlocal/iso';
import { createControlSelectForEnum, useControlSelect } from './cosmos';

export enum FixtureSetup {
	/** Flex container and the main background, just like the app root. */
	root,
	/** A padded glass card. */
	glass
}

export interface FixtureProps {
	/** Container and background for the fixture. */
	setup?: FixtureSetup;
	providers?: ProviderWithProps[];
	/** If true, wraps the test in a loader so as to not show loading or error states for the main request. */
	isSuccessOnly?: boolean;
	tab?: Tab;
}

export function create(Component: React.FC, props: FixtureProps): React.FC {
	return () => {
		const { setup, providers: additionalProviders, isSuccessOnly, tab } = props;

		// #REF_PROVIDERS - update in all areas, if appropriate
		const providers: ProviderWithProps[] = [
			provider(DocumentVisibilityProvider, {}),
			provider(ThemeContextProvider, {}),
			provider(WindowMediaLayoutProvider, { lowerBreakpoints: lowerBreakpoints, breakpointUnit: 'rem' as const }),
			provider(RequestFetchProvider, {}),
			provider(DataSeedProvider, {}),
			provider(BatchResponseProvider, {}),
			provider(SVGIconUrlLoadProvider, {}),
			provider(NavProvider, { initialSelectedTab: tab })
		];

		if (additionalProviders) {
			providers.push(...additionalProviders);
		}

		return (
			<ProviderComposer providers={providers}>
				<TestWrapper setup={setup} >
					<ErrorBoundary>
						<LoaderBlocker isSuccessOnly={!!isSuccessOnly}>
							<Component />
						</LoaderBlocker>
					</ErrorBoundary>
				</TestWrapper>
			</ProviderComposer>
		);
	};
}

interface LoaderBlockerProps {
	isSuccessOnly: boolean;
	children: React.ReactNode;
}

const LoaderBlocker: React.FC<LoaderBlockerProps> = (props) => {
	const { isSuccessOnly, children } = props;

	const { success } = useBatchResponse();

	if (!isSuccessOnly) {
		return <>{children}</>;
	}
	if (!success) {
		return <DefaultErrorLoad />;
	}
	return <>{children}</>;
};


const seedOb = createControlSelectForEnum(Seed) as unknown as Record<(keyof typeof Seed) | '_real_', Seed | null>;
seedOb['_real_'] = null;

interface TestWrapperProps {
	setup?: FixtureSetup;
	children: React.ReactNode;
}

const TestWrapper: React.FC<TestWrapperProps> = (props) => {
	const { setup, children } = props;

	const [seed, setSeed] = useDataSeed();

	const setupWithDefault = setup || FixtureSetup.root;

	const selectedSeed = useControlSelect('Seed', seedOb, seed || '_real_');
	React.useEffect(() => {
		if (selectedSeed !== seed) {
			setSeed(selectedSeed);
		}
	}, [selectedSeed]);

	if (setupWithDefault === FixtureSetup.root) {
		return (
			<ApplicationLayoutContainer>
				{children}
			</ApplicationLayoutContainer>
		);
	}
	else {
		return (
			<ApplicationLayoutContainer>
				<LayoutWidthContainer>
					<LayoutPanelContainerPadding>
						<Panel>
							<PanelPadding>
								{children}
							</PanelPadding>
						</Panel>
					</LayoutPanelContainerPadding>
				</LayoutWidthContainer>
			</ApplicationLayoutContainer>
		);
	}
};

const LayoutWidthContainer = styled.div`
	flex: 1;
	overflow: auto;
`;

const LayoutPanelContainerPadding = styled.div`
	max-width: ${LayoutBreakpointRem.f60}rem;
	margin: 0 auto;
	padding: ${Spacing.dog16};
`;
