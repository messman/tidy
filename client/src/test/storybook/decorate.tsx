import * as React from 'react';

import { Wrapper } from '@/entry/wrapper';
import { styled } from '@/core/style/styled';
import { ThemePicker } from '@/core/style/theme';

export interface StoryComponent {
	(): JSX.Element,
	story?: {
		decorators?: any[]
	}
}

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

export function decorate(component: () => JSX.Element): StoryComponent {
	const storyComponent = component as StoryComponent;
	storyComponent.story = {
		decorators: [Decorator]
	};
	return storyComponent;
};

// Relies on global app styles, which also set a rule for #root (which is storybook's root)
const FullScreenDecorator = (Story: React.FC) => {
	return (
		<Wrapper>
			<div id='react-root'>
				<Story />
			</div>
		</Wrapper>
	);
}

export function decorateFullScreen(component: () => JSX.Element): StoryComponent {
	const storyComponent = component as StoryComponent;
	storyComponent.story = {
		decorators: [FullScreenDecorator]
	};
	return storyComponent;
};