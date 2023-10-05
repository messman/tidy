import * as React from 'react';
import { ErrorPanel } from './error-panel';

interface ErrorBoundaryState {
	error: Error | null;
}

/**
 * This is a class component so that it can act as our error boundary.
 * 
 * NOTE - error boundaries do *NOT* catch errors from *event handlers*, only from *rendering*.
 * 
 * Also - React Cosmos uses `react-error-overlay`, which comes from the Facebook/CRA team. This overlay
 * cannot be removed. It always shows (eye roll). So you will see this error boundary get covered up
 * until you dismiss that error overlay.
 * 
 * https://reactjs.org/docs/error-boundaries.html
 */
export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
	constructor(props: {}) {
		super(props);
		this.state = { error: null };
	}

	componentDidCatch(error: Error, _: any): void {
		console.error('Error Boundary', error);
		this.setState({ error });
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

	return (
		<ErrorPanel
			title='Uh-oh! Something went wrong.'
		/>
	);
};