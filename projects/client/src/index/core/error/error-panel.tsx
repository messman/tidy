import * as React from 'react';
import styled from 'styled-components';
import { icons } from '@wbtdevlocal/assets';
import { Button, ButtonFullWidthContainer } from '../form/button';
import { Icon } from '../icon/icon';
import { Panel, SpacePanelGridPadding } from '../layout/layout-panel';
import { LayoutBreakpointRem } from '../layout/window-layout';
import { Spacing } from '../primitive/primitive-design';
import { fontStyles } from '../text/text-shared';
import { themeTokens } from '../theme/theme-root';

export interface ErrorPanelProps {
	title: string;
	description?: string;
	additional?: React.ReactNode;
}

export const ErrorPanel: React.FC<ErrorPanelProps> = (props) => {
	const { title, description = 'Try refreshing the app', additional } = props;

	function onClickRefresh() {
		window.location.reload();
	}

	return (
		<OuterContainer>
			<ContainerWidthConstraint>
				<Panel>
					<Container>
						<WarningIcon type={icons.informWarningSolid} />
						<TextContainer>
							<Title>
								{title}
							</Title>
							<Description>
								{description}
							</Description>
						</TextContainer>
						<ButtonFullWidthContainer>
							<Button onClick={onClickRefresh}>Refresh</Button>
						</ButtonFullWidthContainer>
						{additional}
					</Container>
				</Panel>
			</ContainerWidthConstraint>
		</OuterContainer>
	);
};

const WarningIcon = styled(Icon)`
	width: 4rem;
	color: ${themeTokens.inform.unsure};
`;

const OuterContainer = styled.div`
	flex: 1;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: ${Spacing.dog16};
`;

const ContainerWidthConstraint = styled.div`
	width: 100%;
	max-width: ${LayoutBreakpointRem.c30}rem;
`;

const Container = styled.div`
	padding: ${SpacePanelGridPadding.value};
	display: flex;
	flex-direction: column;
	gap: .5rem;
	align-items: center;
`;

const Title = styled.div`
	${fontStyles.lead.large};
`;

const Description = styled.div`
	${fontStyles.text.medium};
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: .125rem;
	align-items: center;
`;