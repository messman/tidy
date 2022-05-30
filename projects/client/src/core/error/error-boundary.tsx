import * as React from 'react';
import { LayoutBreakpointRem } from '@/services/layout/window-layout';
import { ButtonFullWidthContainer, StandardButton } from '../form/button';
import { fontStyleDeclarations } from '../text';
import { Block, Spacing } from '../theme/box';
import { styled } from '../theme/styled';

interface ErrorBoundaryState {
	error: Error | null;
}

/**
 * This is a class component so that it can act as our error boundary.
 * https://reactjs.org/docs/error-boundaries.html
 */
export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
	constructor(props: {}) {
		super(props);
		this.state = { error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { error };
	}

	componentDidCatch(error: Error, _: any): void {
		console.error('Error Boundary', error);
	}

	render() {
		return (
			<ErrorBoundaryCover error={this.state.error}>
				{this.props.children}
			</ErrorBoundaryCover>
		);
	}
}

export interface ErrorBoundaryCoverProps {
	error: Error | null;
}

export const ErrorBoundaryCover: React.FC<ErrorBoundaryCoverProps> = (props) => {
	const { error } = props;

	if (!error) {
		return <>{props.children}</>;
	}

	function onClickRefresh() {
		window.location.reload();
	}

	return (
		<Container>
			<ErrorText>
				Uh oh! Something went wrong. Please refresh and try again.
			</ErrorText>
			<Block.Dog16 />
			<ButtonFullWidthContainer>
				<StandardButton onClick={onClickRefresh}>Refresh</StandardButton>
			</ButtonFullWidthContainer>
		</Container>
	);
};

const Container = styled.div`
	flex: 1;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: ${Spacing.dog16};
`;

const ErrorText = styled.div`
	${fontStyleDeclarations.body};
	color: ${p => p.theme.textDistinct};
	max-width: ${LayoutBreakpointRem.c30}rem;
`;