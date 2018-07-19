import * as React from "react";

import "./settings.scss";

import { DEFINE } from "../../services/define";

interface SettingsProps {
}

interface SettingsState {

}

export class Settings extends React.Component<SettingsProps, SettingsState> {

	constructor(props: SettingsProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="settings">
				<div>
					<p>Build date: {DEFINE.BUILD.TIME}</p>
					<p>Build is production: {`${DEFINE.BUILD.IS_PRODUCTION}`}</p>
				</div>
			</div>
		);
	}
}