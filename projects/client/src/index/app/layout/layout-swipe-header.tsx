import * as React from 'react';
import styled from 'styled-components';
import { ClickWrapperButton } from '@/index/core/form/button';
import { SizedIcon } from '@/index/core/icon/icon';
import { SpacePanelEdge } from '@/index/core/layout/layout-panel';
import { fontStyles } from '@/index/core/text/text-shared';
import { themeTokens } from '@/index/core/theme/theme-root';
import { icons } from '@wbtdevlocal/assets';

export interface SwipeHeaderProps {
	backToSectionText: string;
	onSetInactive: () => void;
};

export const SwipeHeader: React.FC<SwipeHeaderProps> = (props) => {
	const { onSetInactive, backToSectionText } = props;

	return (
		<Container>
			<ClickWrapperButton onClick={onSetInactive}>
				<InsideButtonContainer>

					<SizedIcon size='medium' type={icons.coreArrowLeft} />
					<Text>{backToSectionText}</Text>
				</InsideButtonContainer>
			</ClickWrapperButton>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	background: ${themeTokens.background.tint.medium};
`;

const InsideButtonContainer = styled.div`
	display: inline-flex;
	align-items: center;
	gap: .5rem;
	padding: .5rem ${SpacePanelEdge.value};
`;

const Text = styled.div`
	${fontStyles.text.mediumHeavy};
`;