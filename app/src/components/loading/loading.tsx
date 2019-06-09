import * as React from "react";

import * as Noaa from "../../services/noaa";

import "./loading.scss";

interface LoadingProps {
}

export class Loading extends React.Component<LoadingProps> {

	constructor(props: LoadingProps) {
		super(props);
	}

	render() {
		return (
			<div className="react-loading">
				<h1>Loading</h1>
			</div>
		);
	}
}