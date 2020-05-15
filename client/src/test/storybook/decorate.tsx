import * as React from 'react';
import { Wrapper } from '@/entry/wrapper';
import { useLocalStorageTheme, themes } from '@/core/style/theme';
import { select, withKnobs } from "@storybook/addon-knobs";

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

/** Relies on global app styles, which also set a rule for #root (which is storybook's root) */
const DefaultDecorator = (story: () => JSX.Element) => {
	return (
		<Wrapper>
			<CommonKnobsWrapper>
				{story()}
			</CommonKnobsWrapper>
		</Wrapper>
	);
}

export function decorate(Component: React.FC) {
	return decorateWith(Component, [DefaultDecorator]);
};

const CommonKnobsWrapper: React.FC = (props) => {

	const themeOptions: { [key: string]: number } = {};
	themes.forEach((theme, index) => {
		themeOptions[theme.name] = index;
	});

	const [themeIndex, setThemeIndex] = useLocalStorageTheme();

	const selectedThemeIndex = select('Theme', themeOptions, themeIndex);

	React.useEffect(() => {
		setThemeIndex(selectedThemeIndex);
	}, [selectedThemeIndex]);

	return (
		<>
			{props.children}
		</>
	);
};