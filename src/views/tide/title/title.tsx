import * as React from "react";

import "./title.scss";
import { WaterLevel } from "../../../services/noaa";
import * as Time from "../../../services/time";

interface TitleProps {
	waterLevel: WaterLevel

}

interface TitleState {

}

export class Title extends React.Component<TitleProps, TitleState> {

	private static svgTideRising =
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
			<path d="M0.469 15c0-8.027 6.504-14.531 14.531-14.531s14.531 6.504 14.531 14.531-6.504 14.531-14.531 14.531-14.531-6.504-14.531-14.531zM17.578 21.797v-6.797h4.154c0.627 0 0.943-0.762 0.498-1.201l-6.732-6.697c-0.275-0.275-0.715-0.275-0.99 0l-6.738 6.697c-0.445 0.445-0.129 1.201 0.498 1.201h4.154v6.797c0 0.387 0.316 0.703 0.703 0.703h3.75c0.387 0 0.703-0.316 0.703-0.703z"></path>
		</svg>

	private static svgTideFalling =
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
			<path d="M29.531 15c0 8.027-6.504 14.531-14.531 14.531s-14.531-6.504-14.531-14.531 6.504-14.531 14.531-14.531 14.531 6.504 14.531 14.531zM12.422 8.203v6.797h-4.154c-0.627 0-0.943 0.762-0.498 1.201l6.732 6.697c0.275 0.275 0.715 0.275 0.99 0l6.732-6.697c0.445-0.445 0.129-1.201-0.498-1.201h-4.148v-6.797c0-0.387-0.316-0.703-0.703-0.703h-3.75c-0.387 0-0.703 0.316-0.703 0.703z"></path>
		</svg>

	render() {

		const data = this.props.waterLevel;

		let title = "Cannot load data";
		let message = "Please try again."
		let svg = null;
		let lastNext = null;

		if (data) {
			if (data.errors) {


			}
			else {
				title = `The tide is ${data.currentIsRising ? "rising" : "falling"}.`;
				const timeUntilNext = Math.abs(data.next.time.getTime() - data.current.time.getTime());
				const currentPrettyTime = Time.createPrettyTime(data.current.time);
				message = `As of ${currentPrettyTime.time} ${currentPrettyTime.ampm}, ${data.currentIsRising ? "high" : "low"} tide is ${Time.createPrettyTimespan(timeUntilNext)}.`;

				if (data.currentIsRising)
					svg = Title.svgTideRising;
				else
					svg = Title.svgTideFalling;

				lastNext = (
					<div className="lastnext">
						<LastNext name="left" title={`Last ${data.previous.isHigh ? "High" : "Low"}`} prettyTime={Time.createPrettyTime(data.previous.time)} />
						<LastNext name="center" title={`Next ${data.next.isHigh ? "High" : "Low"}`} prettyTime={Time.createPrettyTime(data.next.time)} />
						<LastNext name="right" title={`Next ${data.predictionsAfterCurrent[1].isHigh ? "High" : "Low"}`} prettyTime={Time.createPrettyTime(data.predictionsAfterCurrent[1].time)} />
					</div >
				)
			}
		}


		return (
			<>
				<header>
					<div className="top">
						<span className="left">Wells, Maine</span>
						<span className="right">8419317</span>
					</div>
					<div className="title">
						<div className="head">
							{svg}
							<h2>{title}</h2>
						</div>
						<h2>{message}</h2>
					</div>
				</header>
				{lastNext}
			</>
		);
	}
}

interface LastNextProps {
	name: string;
	title: string;
	prettyTime: Time.PrettyTime
}

interface LastNextState {

}

export class LastNext extends React.Component<LastNextProps, LastNextState> {

	render() {
		return (
			<div className={`lastnext-item ${this.props.name}`}>
				<span className="lastnext-item-inner">
					<div className="lastnext-title">{this.props.title}</div>
					<div className="lastnext-time">
						<span className="lastnext-time-num">{this.props.prettyTime.time}</span>
						<span className="lastnext-time-ampm">{this.props.prettyTime.ampm}</span>
					</div>
				</span>
			</div>
		);
	}
}
