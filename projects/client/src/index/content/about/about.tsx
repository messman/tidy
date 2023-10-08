import * as React from 'react';
import styled from 'styled-components';
import { Swipe } from '@/index/app/layout/layout-swipe';
import { SpacePanelGridGap, SpacePanelGridListPadding, SpacePanelGridPadding } from '@/index/core/layout/layout-panel';
import { Block } from '@/index/core/layout/layout-shared';
import { getLayoutFromWidth, LayoutBreakpointRem } from '@/index/core/layout/window-layout';
import { useWindowMediaLayout } from '@messman/react-common';
import { mapNumberEnumValue } from '@wbtdevlocal/iso';
import { AboutAbout } from './about-about';
import { AboutDataWarning } from './about-data-warning';
import { AboutDev } from './about-dev';
import { AboutIcon } from './about-icon';
import { AboutSectionButton } from './about-section-button';
import { AboutSettings } from './about-settings';
import { AboutShare } from './about-share';

enum SectionKey {
	share,
	settings,
	about,
	dataWarning,
	dev
}

const sectionKeyContent = {
	share: AboutShare,
	settings: AboutSettings,
	about: AboutAbout,
	dataWarning: AboutDataWarning,
	dev: AboutDev
} as const satisfies Record<keyof typeof SectionKey, React.FC>;

export const About: React.FC = () => {

	const { widthBreakpoint } = useWindowMediaLayout();
	const { isCompact, isWide } = getLayoutFromWidth(widthBreakpoint);

	const refCompactMain = React.useRef<HTMLDivElement>(null!);

	const [isCompactSwipeActive, setIsCompactSwipeActive] = React.useState(false);
	const [sectionKey, setSectionKey] = React.useState<SectionKey>(SectionKey.share);

	function selectSection(key: SectionKey): void {
		setSectionKey(key);
		setIsCompactSwipeActive(true);
	}

	if (isWide) {
		return (
			<CenteringContainer>
				<WideContainer>
					<AboutIcon />
					<Block.Fan32 />
					<WideColumnsContainer>
						<WideColumn>
							<AboutShare />
							<AboutAbout />
						</WideColumn>
						<WideColumn>
							<AboutSettings />
							<AboutDataWarning />
							<AboutDev />
						</WideColumn>
					</WideColumnsContainer>
				</WideContainer>
			</CenteringContainer>
		);
	}

	if (!isCompact) {
		return (
			<CenteringContainer>
				<RegularContainer>
					<AboutIcon />
					<AboutShare />
					<AboutSettings />
					<AboutAbout />
					<AboutDataWarning />
					<AboutDev />
				</RegularContainer>
			</CenteringContainer>
		);
	}

	const SectionComponent = mapNumberEnumValue(SectionKey, sectionKeyContent, sectionKey);

	return (
		<CompactContainer>
			<CompactMain ref={refCompactMain}>
				<AboutIcon />
				<CompactGrid>

					<AboutSectionButton
						onClick={() => selectSection(SectionKey.share)}
					>
						Share &amp; Save
					</AboutSectionButton>
					<AboutSectionButton
						onClick={() => selectSection(SectionKey.settings)}
					>
						Settings
					</AboutSectionButton>
					<AboutSectionButton
						onClick={() => selectSection(SectionKey.about)}
					>
						About
					</AboutSectionButton>
					<AboutSectionButton
						onClick={() => selectSection(SectionKey.dataWarning)}
					>
						Data &amp; Warnings
					</AboutSectionButton>
					<AboutSectionButton
						onClick={() => selectSection(SectionKey.dev)}
					>
						App Info
					</AboutSectionButton>
				</CompactGrid>
			</CompactMain>
			<Swipe
				title='About'
				isActive={isCompactSwipeActive}
				onSetInactive={() => { setIsCompactSwipeActive(false); }}
			>
				<CompactContent>
					<SectionComponent key={sectionKey} />
				</CompactContent>
			</Swipe>
		</CompactContainer>
	);
};

const CenteringContainer = styled.div`
	width: 100%;
	height: fit-content;
	display: flex;
	justify-content: center;
	overflow-y: auto;
`;

const WideContainer = styled.div`
	height: fit-content;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: ${SpacePanelGridPadding.value};
	width: 100%;
	max-width: ${LayoutBreakpointRem.f60}rem;
`;

const WideColumnsContainer = styled.div`
	display: flex;
	justify-content: center;
	gap: 3rem;
`;

const WideColumn = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 3rem;
	max-width: 22rem;
`;

const RegularContainer = styled.div`
	height: fit-content;
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: ${LayoutBreakpointRem.c30}rem;
	padding: ${SpacePanelGridPadding.value};
	gap: 3rem;
`;

const CompactContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
`;

const CompactMain = styled.div`
	overflow-y: auto;
	padding: ${SpacePanelGridPadding.value} ${SpacePanelGridListPadding.value};
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;
`;

const CompactGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	place-items: stretch stretch;
	gap: ${SpacePanelGridGap.value};
`;

const CompactContent = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: ${SpacePanelGridPadding.value};
`;