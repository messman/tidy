import * as React from 'react';
import styled from 'styled-components';
import { useBatchResponse } from '@/index/core/data/data';
import { ClickWrapperButton } from '@/index/core/form/button';
import { SizedIcon } from '@/index/core/icon/icon';
import { SpinnerIcon } from '@/index/core/icon/icon-spinner';
import { Block } from '@/index/core/layout/layout-shared';
import { Spacing } from '@/index/core/primitive/primitive-design';
import { icons } from '@wbtdevlocal/assets';
import { AppInfo } from './app-info';
import { appHeaderHeight } from './app-layout-shared';
import { AppScreen, useAppNavigation } from './app-navigation';

export const CompactAppHeader: React.FC = () => {
	const { isLoading } = useBatchResponse();
	const { screen, setScreen } = useAppNavigation();
	const isHome = screen === AppScreen.b_beachTime;
	function onClickBack() {
		setScreen(AppScreen.b_beachTime);
	}

	const backRender = !isHome ? (
		<CompactLeftContainer>
			<ClickWrapperButton onClick={onClickBack}>
				<CompactLeftContainerInner>
					<AppHeaderSizedIcon size='medium' type={icons.coreClose} />
				</CompactLeftContainerInner>
			</ClickWrapperButton>
		</CompactLeftContainer>
	) : null;

	const spinnerRender = isLoading ? (
		<>
			<AppHeaderSizedIcon size='small' type={SpinnerIcon} />
			<Block.Ant04 />
		</>
	) : null;

	return (
		<CompactContainer>
			{backRender}
			<CompactRightContainer>
				{spinnerRender}
				<AppInfo />
			</CompactRightContainer>
		</CompactContainer>
	);
};

const CompactContainer = styled.div`
	display: flex;
	align-items: stretch;
	justify-content: space-between;
	height: ${appHeaderHeight};
	padding: 0 ${Spacing.cat12};
`;

const CompactLeftContainer = styled.div`
	display: flex;
	align-items: stretch;
`;

const CompactLeftContainerInner = styled.div`
	padding-right: ${Spacing.dog16};
`;

const CompactRightContainer = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

const AppHeaderSizedIcon = styled(SizedIcon)`
	color: white;
`;