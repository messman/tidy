import * as React from 'react';
import styled from 'styled-components';
import { useBackgroundSetting } from '@/index/app/background/background';
import { Toggle } from '@/index/core/form/toggle';
import { Panel, PanelPadding } from '@/index/core/layout/layout-panel';
import { Block } from '@/index/core/layout/layout-shared';
import { fontStyles, MediumBodyText } from '@/index/core/text/text-shared';
import { SectionContainer, SectionHeading } from './about-shared';

export const AboutSettings: React.FC = () => {

	const { hasAnimation, setHasAnimation } = useBackgroundSetting();

	return (
		<SectionContainer>
			<SectionHeading>Settings</SectionHeading>
			<Panel>
				<PanelPadding>
					<MediumBodyText>Changes to settings take effect immediately and are saved to your browser.</MediumBodyText>
					<Block.Dog16 />
					<EntriesContainer>
						<ToggleEntry
							value={hasAnimation}
							onValueChange={() => setHasAnimation(!hasAnimation)}
						>
							Background animations
						</ToggleEntry>
					</EntriesContainer>
				</PanelPadding>
			</Panel>
		</SectionContainer>
	);
};

const EntriesContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: .5rem;
`;

interface ToggleEntryProps {
	value: boolean;
	onValueChange: () => void;
	children: React.ReactNode;
};

const ToggleEntry: React.FC<ToggleEntryProps> = (props) => {
	const { value, onValueChange, children } = props;

	return (
		<ToggleEntry_Container>
			<ToggleEntry_Text>{children}</ToggleEntry_Text>
			<Toggle value={value} onToggle={onValueChange} />
		</ToggleEntry_Container>
	);
};

const ToggleEntry_Container = styled.label`
	display: flex;
	align-items: center;
	cursor: pointer;
`;

const ToggleEntry_Text = styled.div`
	flex: 1;
	${fontStyles.text.medium};
`;
