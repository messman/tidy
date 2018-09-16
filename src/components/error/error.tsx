import * as React from "react";

import "./error.scss";

interface AppErrorProps {
	error: Error
}

export class AppError extends React.Component<AppErrorProps> {

	constructor(props: AppErrorProps) {
		super(props);
	}

	render() {

		const errText = this.props.error.message;

		return (
			<div className="react-error tab-view-bg">
				<header>
					<h1>Uh-oh!</h1>
					<h3>Something's gone wrong.</h3>
				</header>
				<hr />
				<p>
					It looks like the application isn't working correctly.
					If the problem persists, please reach out to the developer
					on GitHub by going to the <strong>Info</strong> tab.
				</p>
				<hr />
				<div className="detailed">
					<div className="detailed-header">
						Detailed error information:
					</div>
					<div className="detailed-content">
						{errText}
					</div>
				</div>
			</div>
		);
	}
}