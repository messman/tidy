import * as React from 'react';
import styled from 'styled-components';
import { tab, useNav } from '@/index/app/nav/nav-context';
import { SizedIcon } from '@/index/core/icon/icon';
import { Panel, PanelPadding } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';
import { keyForNumberEnumValue } from '@wbtdevlocal/iso';
import { SectionKey } from '../about/about';

export const NowBeachHow: React.FC = () => {

	const { selectTabWithPath } = useNav();

	function onClick(): void {
		selectTabWithPath(tab.about, keyForNumberEnumValue(SectionKey, SectionKey.dataWarning));
	}

	return (
		<Panel onClick={onClick}>
			<PanelPadding>
				<Container>
					<span>How It Works &amp; Disclaimers</span>
					<SizedIcon size='small' type={icons.coreArrowChevronRight} />
				</Container>
			</PanelPadding>
		</Panel>
	);
};

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: .5rem;
	${fontStyles.stylized.capitalized};
	color: ${themeTokens.text.subtle};
`;