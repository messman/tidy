import * as React from 'react';
import { Icon } from '@/core/icon/icon';
import { SpinnerIcon } from '@/core/icon/icon-spinner';
import { Block } from '@/core/theme/box';
import { styled } from '@/core/theme/styled';
import { PanelPadding } from './panel';

export const PanelLoader: React.FC = () => {
	return (
		<PanelPadding>
			<Block.Elf24 />
			<CenterContainer>
				<LargeSpinnerIcon type={SpinnerIcon} />
			</CenterContainer>
			<Block.Elf24 />
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