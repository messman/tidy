import * as React from "react";

import * as Noaa from "../services/noaa";
import styled from "@/styles/theme";

interface AppErrorProps {
	error: Error,
	jsonErrs: Noaa.JSONError[]
}

const Window = styled.div`
	color: rgb(255, 202, 202);
	padding: 1rem;
	background-color: rgb(218, 81, 81);
`;

const Title = styled.h1`
	margin: 0;
	text-align: left;
`

const SubTitle = styled.h3`
	margin: 0;
	text-align: left;
`

const Line = styled.hr`
	border: none;
	border-bottom: 2px solid rgb(177, 33, 33);
	margin: 1rem 0;
`


export class AppError extends React.Component<AppErrorProps> {

	constructor(props: AppErrorProps) {
		super(props);
	}

	render() {

		let errContent: JSX.Element = null;
		if (this.props.error) {
			errContent = <span>{this.props.error.message}</span>
		}
		else if (this.props.jsonErrs) {
			const errs = this.props.jsonErrs;
			console.error(errs);
			errContent = (
				<>
					<div>{`${errs.length} ${errs.length > 1 ? "errors were" : "error was"} returned from the API in the following contexts:`}</div>
					<ul>
						{
							errs.map((err, i) => {
								return <li key={i}>{err.errContext}</li>
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
			<Window>
				<header>
					<Title>Uh-oh!</Title>
					<SubTitle>Something's gone wrong.</SubTitle>
				</header>
				<Line />
				<p>
					It looks like the application isn't working correctly.
					If the problem persists, please reach out to the developer
					on GitHub by going to the <strong>Info</strong> tab.
				</p>
				<Line />
				<div>
					<div>
						Detailed error information:
					</div>
					<div>
						{errContent}
					</div>
				</div>
			</Window>
		);
	}
}