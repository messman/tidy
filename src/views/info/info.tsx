import * as React from "react";

import "./info.scss";

import { DEFINE } from "../../services/define";

interface InfoProps {
}

interface InfoState {

}

export class Info extends React.Component<InfoProps, InfoState> {

	constructor(props: InfoProps) {
		super(props);
		this.state = {};
	}

	render() {

		const date = new Date(DEFINE.BUILD.TIME);
		const dateStr = date.toISOString()

		return (
			<div className="info tab-view-bg">
				<section className="info-header">
					<div>
						<span className="key">Authored by</span><span className="value">Andrew Messier</span>
					</div>
					<div>
						<span className="key">Version</span><span className="value">{DEFINE.BUILD.VERSION} ({DEFINE.BUILD.IS_PRODUCTION ? "Production" : "Debug"})</span>
					</div>
					<div>
						<span className="key">Updated</span><span className="value">{dateStr}</span>
					</div>
				</section>
				<section className="info-gh">
					<a href="https://github.com/messman/quick-tides" rel="noopener noreferrer">
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="30" viewBox="0 0 32 30">
							<path d="M10.738 24.136c0 0.124-0.149 0.223-0.337 0.223-0.214 0.019-0.362-0.081-0.362-0.223 0-0.124 0.149-0.223 0.337-0.223 0.194-0.019 0.362 0.081 0.362 0.223zM8.725 23.857c-0.045 0.124 0.084 0.267 0.278 0.304 0.168 0.062 0.362 0 0.401-0.124s-0.084-0.267-0.278-0.322c-0.168-0.043-0.356 0.019-0.401 0.143zM11.586 23.752c-0.188 0.043-0.317 0.161-0.298 0.304 0.019 0.124 0.188 0.205 0.382 0.161 0.188-0.043 0.317-0.161 0.298-0.285-0.019-0.118-0.194-0.198-0.382-0.18zM15.845 0c-8.978 0-15.845 6.527-15.845 15.124 0 6.874 4.518 12.756 10.971 14.826 0.829 0.143 1.12-0.347 1.12-0.75 0-0.384-0.019-2.504-0.019-3.806 0 0-4.531 0.93-5.482-1.847 0 0-0.738-1.804-1.799-2.269 0 0-1.482-0.973 0.104-0.955 0 0 1.612 0.124 2.498 1.599 1.418 2.393 3.793 1.705 4.719 1.295 0.149-0.992 0.57-1.68 1.036-2.089-3.618-0.384-7.269-0.886-7.269-6.849 0-1.705 0.492-2.56 1.528-3.651-0.168-0.403-0.718-2.064 0.168-4.209 1.353-0.403 4.466 1.674 4.466 1.674 1.295-0.347 2.686-0.527 4.065-0.527s2.77 0.18 4.065 0.527c0 0 3.113-2.083 4.466-1.674 0.887 2.151 0.337 3.806 0.168 4.209 1.036 1.097 1.67 1.952 1.67 3.651 0 5.981-3.812 6.459-7.431 6.849 0.595 0.49 1.1 1.419 1.1 2.876 0 2.089-0.019 4.674-0.019 5.182 0 0.403 0.298 0.893 1.12 0.75 6.473-2.058 10.861-7.94 10.861-14.814 0-8.597-7.282-15.124-16.259-15.124zM6.291 21.378c-0.084 0.062-0.065 0.205 0.045 0.322 0.104 0.099 0.252 0.143 0.337 0.062 0.084-0.062 0.065-0.205-0.045-0.322-0.104-0.099-0.252-0.143-0.337-0.062zM5.592 20.876c-0.045 0.081 0.019 0.18 0.149 0.242 0.104 0.062 0.233 0.043 0.278-0.043 0.045-0.081-0.019-0.18-0.149-0.242-0.129-0.037-0.233-0.019-0.278 0.043zM7.69 23.083c-0.104 0.081-0.065 0.267 0.084 0.384 0.149 0.143 0.337 0.161 0.421 0.062 0.084-0.081 0.045-0.267-0.084-0.384-0.142-0.143-0.337-0.161-0.421-0.062zM6.952 22.171c-0.104 0.062-0.104 0.223 0 0.366s0.278 0.205 0.362 0.143c0.104-0.081 0.104-0.242 0-0.384-0.091-0.143-0.259-0.205-0.362-0.124z"></path>
						</svg>
						<div className="split-right">
							<p>open-source on GitHub</p>
							<p>at messman/quick-tides</p>
						</div>
					</a>
				</section>
				<section className="info-thanks">
					<div>
						Dedicated to Mark &amp; Dawna Messier.
					</div>
					<div>
						Many thanks to the U.S. National Oceanic and Atmospheric Administration (NOAA)
						for their <a href="https://tidesandcurrents.noaa.gov/api/">Data Retrieval API</a>.
					</div>
					<div>
						Technical acknowledgments:
						<ul>
							<li>IcoMoon and FontAwesome for icons</li>
							<li>Sketch &amp; VSCode for being so wonderful</li>
						</ul>
					</div>
				</section>
			</div>
		);
	}
}