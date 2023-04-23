import * as React from 'react';
import styled, { css } from 'styled-components';
import { Icon, SizedIconArrowChevronInline } from '@/core/icon/icon';
import { panelPaddingStyle } from '@/core/layout/panel/panel';
import { Spacing } from '@/core/primitive/primitive-design';
import { themeTokens } from '@/core/theme';
import { icons } from '@wbtdevlocal/assets';

export const HomeSummarySpinnerIcon = styled(Icon)`
	color: ${themeTokens.brand.red};
	width: 2.5rem;
	height: 2.5rem;
`;

export interface HomeSummaryClickPaddingProps {
	onClick: () => void;
	/** If true, shortens the padding-bottom to feel more connected to content directly below. */
	isConnectedBelow?: boolean;
	children: React.ReactNode;
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