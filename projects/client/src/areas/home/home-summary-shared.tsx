import * as React from 'react';
import { Icon, SizedIconArrowChevronInline } from '@/core/icon/icon';
import { panelPaddingStyle } from '@/core/layout/panel/panel';
import { Spacing } from '@/core/theme/box';
import { css, styled } from '@/core/theme/styled';
import { icons } from '@wbtdevlocal/assets';

export const HomeSummarySpinnerIcon = styled(Icon)`
	color: ${p => p.theme.common.brand1.main};
	width: 2.5rem;
	height: 2.5rem;
`;

export interface HomeSummaryClickPaddingProps {
	onClick: () => void;
	/** If true, shortens the padding-bottom to feel more connected to content directly below. */
	isConnectedBelow?: boolean;
}

export const HomeSummaryClickPadding: React.FC<HomeSummaryClickPaddingProps> = (props) => {
	const { onClick, isConnectedBelow, children } = props;
	return (
		<ClickContainer onClick={onClick} isConnectedBelow={isConnectedBelow}>
			<ChildContainer>
				{children}
			</ChildContainer>
			<SizedIconArrowChevronInline size='medium' type={icons.arrowChevronRightInline} />
		</ClickContainer>
	);
};

const ChildContainer = styled.div`
	flex: 1;
`;

const connectedBelowStyles = css`
	padding-bottom: ${Spacing.bat08};
`;

const ClickContainer = styled.div<{ isConnectedBelow?: boolean; }>`
	width: 100%;
	display: flex;
	align-items: center;
	column-gap: ${Spacing.ant04};
	${panelPaddingStyle};
	padding-right: ${Spacing.bat08};
	${p => p.isConnectedBelow && connectedBelowStyles};
	cursor: pointer;
`;