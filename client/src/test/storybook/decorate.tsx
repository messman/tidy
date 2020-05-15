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

export function decorateWith(Component: React.FC, decorators: any[]) {

	/*
		Some funky stuff is required here.
		Never forget, you spent like 4 hours on this.

		See the issues below - it all comes down to how stories are exported with decorators.
		The first made me believe that I should use <Story /> in decorators. That would solve the issue where
		decorators (which supply the contexts) were not being applied.
		But that ends up causing the stories to unmount themselves every time a Knob is clicked, which broke the async promise story testing.
		Solution: wrap each story in another component to create that 'indirect' scenario. Move on with life.

		https://github.com/storybookjs/storybook/issues/10296
		https://github.com/storybookjs/storybook/issues/4059
	*/
	const story: React.FC = () => {
		return (
			<Component />
		);
	};

	const storyComponent = story as StoryComponent;
	storyComponent.story = {
		decorators: [...decorators, withKnobs]
	};
	return storyComponent;
};

/** Uses some padding and shows the theme picker. */
const DefaultDecorator = (story: () => JSX.Element) => {
	return (
		<Wrapper>
			<StoryPadding>
				<PickerPadding>
					<ThemePicker />
				</PickerPadding>
				{story()}
			</StoryPadding>
		</Wrapper>
	);
}

const StoryPadding = styled.div`
	padding: 1rem;
	width: 100%;
`;

const PickerPadding = styled.div`
	margin-bottom: 1rem;
`;

export function decorate(Component: React.FC) {
	return decorateWith(Component, [DefaultDecorator]);
};

/** Relies on global app styles, which also set a rule for #root (which is storybook's root) */
const FullScreenDecorator = (story: () => JSX.Element) => {
	return (
		<Wrapper>
			{story()}
		</Wrapper>
	);
}

export function decorateFullScreen(Component: React.FC) {
	return decorateWith(Component, [FullScreenDecorator]);
};