import * as React from "react";

import "./tide.scss";

interface TideProps {
}

interface TideState {

}

export class Tide extends React.Component<TideProps, TideState> {

	constructor(props: TideProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<h1>TIDES</h1>
		);
	}
}