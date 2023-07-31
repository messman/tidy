import * as React from 'react';
import styled from 'styled-components';
import { Icon } from '@/index/core/icon/icon';
import { SpinnerIcon } from '@/index/core/icon/icon-spinner';
import { useBatchResponse } from '@/services/data/data';
import { Block } from '../layout/layout-shared';
import { PanelPadding } from '../layout/panel/panel';
import { MediumBodyText } from '../text/text-shared';
import { themeTokens } from '../theme/theme-root';

export const DefaultErrorLoad: React.FC = () => {
	const { error } = useBatchResponse();

	if (error) {
		return <MediumBodyText>Error!</MediumBodyText>;
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
	color: ${themeTokens.inform.unsure};
	width: 2.5rem;
	height: 2.5rem;
`;