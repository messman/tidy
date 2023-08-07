import * as React from 'react';
import { AppNavigationProvider } from '@/index/app/index-area/app-navigation';
import { BatchResponseProvider } from '@/index/core/data/data';
import { DataSeedProvider, useDataSeed } from '@/index/core/data/data-seed';
import { RequestFetchProvider } from '@/index/core/data/request-fetch-provider';
import { ErrorBoundary } from '@/index/core/error/error-boundary';
import { SVGIconUrlLoadProvider } from '@/index/core/icon/icon-url';
import { ApplicationLayoutContainer } from '@/index/core/layout/layout-shared';
import { lowerBreakpoints } from '@/index/core/layout/window-layout';
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
}

export function create(Component: React.FC, props: FixtureProps): React.FC {
	return () => {
		const { setup, providers: additionalProviders } = props;

		// #REF_PROVIDERS - update in all areas, if appropriate
		const providers: ProviderWithProps[] = [
			provider(DocumentVisibilityProvider, {}),
			provider(ThemeContextProvider, {}),
			provider(WindowMediaLayoutProvider, { lowerBreakpoints: lowerBreakpoints, breakpointUnit: 'rem' as const }),
			provider(RequestFetchProvider, {}),
			provider(DataSeedProvider, {}),
			provider(BatchResponseProvider, {}),
			provider(AppNavigationProvider, {}),
			provider(SVGIconUrlLoadProvider, {})
		];

		if (additionalProviders) {
			providers.push(...additionalProviders);
		}

		return (
			<ProviderComposer providers={providers}>
				<TestWrapper setup={setup} >
					<ErrorBoundary>
						<Component />
					</ErrorBoundary>
				</TestWrapper>
			</ProviderComposer>
		);
	};
}


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
				{children}
			</ApplicationLayoutContainer>
		);
	}
};