import * as React from "react";

import * as Noaa from "../../services/noaa";

import "./error.scss";

interface AppErrorProps {
	error: Error,
	jsonErrs: Noaa.JSONError[]
}

export class AppError extends React.Component<AppErrorProps> {

	constructor(props: AppErrorProps) {
		super(props);
	}

	render() {

		let errContent: JSX.Element = null;
		if (this.props.error) {
			errContent = <span>this.props.error.message</span>
		}
		else if (this.props.jsonErrs) {
			const errs = this.props.jsonErrs;
			errContent = (
				<>
					<div>{`${errs.length} ${errs.length > 1 ? "errors were" : "error was"} returned from the API in the following contexts:`}</div>
					<ul>
						{
							errs.map((err) => {
								return <li>{err.errContext}</li>
							})
						}
					</ul>
				</>
			);
		}
		else {
			errContent = <span>Error Unknown</span>
		}

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
						{errContent}
					</div>
				</div>
			</div>
		);
	}
}