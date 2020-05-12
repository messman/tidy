import * as React from 'react';
import { Wrapper } from '@/entry/wrapper';
import { styled } from '@/core/style/styled';
import { ThemePicker } from '@/core/style/theme';
import { withKnobs } from "@storybook/addon-knobs";

export interface StoryComponent {
	(): JSX.Element,
	story?: {
		decorators?: any[]
	}
}

export function decorateWith(component: () => JSX.Element, decorators: any[]): StoryComponent {
	const storyComponent = component as StoryComponent;
	storyComponent.story = {
		decorators: [...decorators, withKnobs]
	};
	return storyComponent;
};

/** Uses some padding and shows the theme picker. */
const DefaultDecorator = (Story: React.FC) => {
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
	return decorateWith(component, [DefaultDecorator]);
};

/** Relies on global app styles, which also set a rule for #root (which is storybook's root) */
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
	return decorateWith(component, [FullScreenDecorator]);
};