import * as React from 'react';

import { Wrapper } from "@/tree/wrapper";
import { DecoratorFn } from "@storybook/react"

export const Decorator: DecoratorFn = (storyFn) => {
	return (
		<Wrapper>
			<>
				<p>PARTY!</p>
				{storyFn()}
			</>
		</Wrapper>
	);
}

export interface StoryComponent {
	(): JSX.Element,
	story?: {
		decorators?: DecoratorFn[]
	}
}

export function decorate(component: () => JSX.Element): StoryComponent {
	const storyComponent = component as StoryComponent;
	storyComponent.story = {
		decorators: [Decorator]
	};
	return storyComponent;
};