import * as React from 'react';
import { Icon, SizedIconArrowChevronInline } from '@/core/icon/icon';
import { panelPaddingStyle } from '@/core/layout/panel/panel';
import { Spacing } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { icons } from '@wbtdevlocal/assets';

export const HomeSummarySpinnerIcon = styled(Icon)`
	color: ${p => p.theme.common.brand1.main};
	width: 2.5rem;
	height: 2.5rem;
`;

export interface HomeSummaryClickPaddingProps {
	onClick: () => void;
}

export const HomeSummaryClickPadding: React.FC<HomeSummaryClickPaddingProps> = (props) => {
	const { onClick, children } = props;
	return (
		<ClickContainer onClick={onClick}>
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

const ClickContainer = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	column-gap: ${Spacing.ant04};
	${panelPaddingStyle};
	padding-right: ${Spacing.bat08};
	cursor: pointer;
`;