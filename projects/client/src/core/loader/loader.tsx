import * as React from 'react';
import { Icon } from '@/core/icon/icon';
import { SpinnerIcon } from '@/core/icon/icon-spinner';
import { Block } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { useBatchResponse } from '@/services/data/data';
import { PanelPadding } from '../layout/panel/panel';
import { Paragraph } from '../text';

export const DefaultErrorLoad: React.FC = () => {
	const { error } = useBatchResponse();

	if (error) {
		return <Paragraph>Error!</Paragraph>;
	}

	return (
		<PanelPadding>
			<Block.Dog16 />
			<CenterContainer>
				<LargeSpinnerIcon type={SpinnerIcon} />
			</CenterContainer>
			<Block.Dog16 />
		</PanelPadding>
	);
};

const CenterContainer = styled.div`
	text-align: center;
`;

const LargeSpinnerIcon = styled(Icon)`
	color: ${p => p.theme.common.brand1.main};
	width: 2.5rem;
	height: 2.5rem;
`;