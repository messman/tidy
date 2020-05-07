import * as React from 'react';

import { Wrapper } from "@/tree/wrapper";
import { DecoratorFn } from "@storybook/react"
import { styled } from '@/styles/styled';

export const Decorator: DecoratorFn = (storyFn) => {
	return (
		<Wrapper>
			<StoryPadding>
				{storyFn()}
			</StoryPadding>
		</Wrapper>
	);
}

const StoryPadding = styled.div`
	padding: 2rem;
`;

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