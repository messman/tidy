import * as React from 'react';
import styled from 'styled-components';
import { ButtonFillBrandBlue, ButtonFullWidthContainer } from '../form/button';
import { Block } from '../layout/layout-shared';
import { LayoutBreakpointRem } from '../layout/window-layout';
import { Spacing } from '../primitive/primitive-design';
import { fontStyles } from '../text/text-shared';
import { themeTokens } from '../theme/theme-root';

interface ErrorBoundaryState {
	error: Error | null;
}

/**
 * This is a class component so that it can act as our error boundary.
 * https://reactjs.org/docs/error-boundaries.html
 */
export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
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
	children: React.ReactNode;
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
				<ButtonFillBrandBlue onClick={onClickRefresh}>Refresh</ButtonFillBrandBlue>
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
	${fontStyles.text.medium};
	color: ${themeTokens.text.distinct};
	max-width: ${LayoutBreakpointRem.c30}rem;
`;