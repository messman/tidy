import "./index.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Tabs, Tab } from "../components";

import { DEFINE } from "../services/define";

console.log(`${DEFINE.BUILD.IS_PRODUCTION ? "Production" : "Debug"} | ${DEFINE.BUILD.TIME}`);

interface AppProps {
}

interface AppState {
	selectedTab: number,
}

class App extends React.Component<AppProps, AppState> {

	constructor(props: AppProps) {
		super(props);

		// Set initial tab to 0 (TODO: add routing)
		this.state = {
			selectedTab: 0
		}
	}

	render() {
		const { selectedTab } = this.state;

		const view =
			<Tabs>
				<Tab title="Players">
					<h1>Hello, World!</h1>
				</Tab>
				<Tab title="Options">
					<h1>Hello, Worlddd!</h1>
				</Tab>
			</Tabs>

		return (
			<div className="full grid gL-column">
				<header>
					<h1>brack-it</h1>
				</header>
				<main className="gL-flexed grid grid-pad gL-column">
					{view}
				</main>
			</div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("react-root")
);