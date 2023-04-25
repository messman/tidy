import * as React from 'react';
import styled, { StyledComponent } from 'styled-components';
import { AppNavigationProvider } from '@/areas/index/app-navigation';
import { ErrorBoundary } from '@/core/error/error-boundary';
import { SVGIconUrlLoadProvider } from '@/core/icon/icon-url';
import { ApplicationLayoutContainer, Space } from '@/core/layout/layout-shared';
import { ThemeContextProvider, themeTokens } from '@/core/theme/theme-root';
import { BatchResponseProvider } from '@/services/data/data';
import { DataSeedProvider, useDataSeed } from '@/services/data/data-seed';
import { lowerBreakpoints } from '@/services/layout/window-layout';
import { RequestFetchProvider } from '@/services/network/request-fetch-provider';
import { provider, ProviderComposer, ProviderWithProps } from '@/services/provider-utility';
import { DocumentVisibilityProvider, WindowMediaLayoutProvider } from '@messman/react-common';
import * as iso from '@wbtdevlocal/iso';
import { createControlSelectForEnum, useControlSelect } from './cosmos';

export enum FixtureContainer {
	flexRow,
	flexColumn,
	noPadding,
	padding
}

export enum FixtureBackground {
	waterGradient,
	oneBox,
	two,
	twoBox
}

export interface FixtureSetup {
	container: FixtureContainer;
	background: FixtureBackground;
}

export const fixtureDefault = {
	/** Default. No padding, no flex, overflow, main background. */
	docNoPad: { container: FixtureContainer.noPadding, background: FixtureBackground.two },
	/** Default. Padding, no flex, overflow, main background. */
	docPad: { container: FixtureContainer.padding, background: FixtureBackground.two },
	/** Flex Column and main background, like the application root. */
	root: { container: FixtureContainer.flexColumn, background: FixtureBackground.waterGradient },
	docTwoPad: { container: FixtureContainer.padding, background: FixtureBackground.two },
	docTwo: { container: FixtureContainer.noPadding, background: FixtureBackground.two }
} satisfies Record<string, FixtureSetup>;

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


const seedOb = createControlSelectForEnum(iso.Batch.Seed) as unknown as Record<(keyof typeof iso.Batch.Seed) | '_real_', iso.Batch.Seed | null>;
seedOb['_real_'] = null;

interface TestWrapperProps {
	setup?: FixtureSetup;
	children: React.ReactNode;
}

const TestWrapper: React.FC<TestWrapperProps> = (props) => {
	const { setup } = props;

	const [seed, setSeed] = useDataSeed();

	const setupWithDefault = setup || fixtureDefault.docNoPad;

	const selectedSeed = useControlSelect('Seed', seedOb, seed || '_real_');
	React.useEffect(() => {
		if (selectedSeed !== seed) {
			setSeed(selectedSeed);
		}
	}, [selectedSeed]);

	return (
		<Fixture_OuterContainer setupInfo={setupWithDefault}>
			<Fixture_InnerContainer setupInfo={setupWithDefault}>
				{props.children}
			</Fixture_InnerContainer>
		</Fixture_OuterContainer>
	);
};

const Fixture_OuterContainer = styled(ApplicationLayoutContainer).attrs((props: { setupInfo: FixtureSetup; }) => {
	const { background } = props.setupInfo;
	const style: Partial<CSSStyleDeclaration> = {};

	if (background === FixtureBackground.waterGradient || background === FixtureBackground.oneBox) {
		style.backgroundColor = themeTokens.background.waterGradient;
	}
	else if (background === FixtureBackground.two || background === FixtureBackground.twoBox) {
		style.backgroundColor = themeTokens.background.two;
	}
	return {
		style: style
	};
})`` as StyledComponent<'div', any, { setupInfo?: FixtureSetup; }, never>;

const Fixture_InnerContainer = styled(ApplicationLayoutContainer).attrs((props: { setupInfo: FixtureSetup; }) => {
	const { container, background } = props.setupInfo;

	const style: Partial<CSSStyleDeclaration> = {};

	// Starting from the baseline of ApplicationLayoutContainer, which is a flex column setup
	if (container === FixtureContainer.flexColumn) {
		// Nothing
	}
	else if (container === FixtureContainer.flexRow) {
		style.flexDirection = 'row';
	}
	else if (container === FixtureContainer.noPadding) {
		style.display = 'block';
		style.overflowY = 'auto';
	}
	else if (container === FixtureContainer.padding) {
		style.display = 'block';
		style.overflowY = 'auto';
		style.padding = Space.Edge.value;
	}

	if (background === FixtureBackground.oneBox) {
		style.backgroundColor = themeTokens.background.oneBox;
	}
	else if (background === FixtureBackground.twoBox) {
		style.backgroundColor = themeTokens.background.twoBox;
	}

	return {
		style: style
	};
})`` as StyledComponent<'div', any, { setupInfo?: FixtureSetup; }, never>;