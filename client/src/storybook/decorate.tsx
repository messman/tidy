import * as React from 'react';

import { Wrapper } from "@/tree/wrapper";
import { styled } from '@/styles/styled';
import { ThemePicker } from '@/styles/theme';

const Decorator = (Story: React.FC) => {
	return (
		<Wrapper>
			<StoryPadding>
				<PickerPadding>
					<ThemePicker />
				</PickerPadding>
				<Story />
			</StoryPadding>
		</Wrapper>
	);
}

const StoryPadding = styled.div`
	padding: 1rem;
`;

const PickerPadding = styled.div`
	margin-bottom: 1rem;
`;

export interface StoryComponent {
	(): JSX.Element,
	story?: {
		decorators?: any[]
	}
}

export function decorate(component: () => JSX.Element): StoryComponent {
	const storyComponent = component as StoryComponent;
	storyComponent.story = {
		decorators: [Decorator]
	};
	return storyComponent;
};