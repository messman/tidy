import * as React from 'react';
import styled from 'styled-components';
import { About } from '@/index/content/about/about';
import { BeachTime } from '@/index/content/common/beach/beach-time';
import { Conditions } from '@/index/content/common/weather/conditions';
import { Education } from '@/index/content/learn/learn';
import { useBatchResponse } from '@/index/core/data/data';
import { SizedIcon } from '@/index/core/icon/icon';
import { SpinnerIcon } from '@/index/core/icon/icon-spinner';
import { PanelPadded } from '@/index/core/layout/layout-panel';
import { Block, overflowHiddenScrollStyle } from '@/index/core/layout/layout-shared';
import { Spacing } from '@/index/core/primitive/primitive-design';
import { AppInfo } from './app-info';
import { appHeaderHeight } from './app-layout-shared';

export const WideApplicationLayout: React.FC<React.PropsWithChildren> = () => {

	const { isLoading } = useBatchResponse();

	/*
		We show a spinner icon while loading and the time when we have data.
		When we have both, we show both. (For example, during a timer refresh.)
	*/
	const spinnerRender = isLoading ? (
		<>
			<Block.Ant04 />
			<AppHeaderSizedIcon size='small' type={SpinnerIcon} />
		</>
	) : null;

	return (
		<AppContainer>
			<AppHeaderContainer>
				<AppInfo />
				{spinnerRender}
			</AppHeaderContainer>
			<WideContainer>
				<PanelScroller>
					<PanelPadded>
						<BeachTime />
					</PanelPadded>
				</PanelScroller>
				<PanelScroller>
					<PanelPadded>
					</PanelPadded>
				</PanelScroller>
				<PanelScroller>
					<PanelPadded>
						<Conditions />
					</PanelPadded>
				</PanelScroller>
				<PanelScroller>
					<PanelPadded>
						<Education />
					</PanelPadded>
				</PanelScroller>
				<PanelScroller>
					<PanelPadded>
						<About />
					</PanelPadded>
				</PanelScroller>
			</WideContainer>
		</AppContainer>
	);
};



const AppHeaderSizedIcon = styled(SizedIcon)`
	color: white;
`;

const AppHeaderContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: ${appHeaderHeight};
	display: flex;
	align-items: center;
	padding-left: ${Spacing.cat12};
`;

const AppContainer = styled.div`
	flex: 1;
	position: relative;
	${overflowHiddenScrollStyle};
`;


const WideContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	gap: ${Spacing.cat12};
	padding: 0 ${Spacing.cat12}; // Only on the sides - other padding is handled with the scroller

	overflow-x: scroll;
`;

const PanelScroller = styled.div`
	flex-shrink: 0;
	overflow-y: scroll;
	width: 28rem; // What looks best, subjectively
	padding-top: ${appHeaderHeight}; // Exactly the height of content + padding for AppHeader component
	padding-bottom: ${Spacing.cat12}; // Match the sides of the container
`;