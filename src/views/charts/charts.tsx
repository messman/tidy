import * as React from "react";

import * as Noaa from "../../services/noaa";
import * as Time from "../../services/time";

import "./charts.scss";

interface ChartsProps {
	noaa: {
		data: Noaa.Response,
		isRequesting: boolean,
		onRequestBegin: () => void,
		onRequestEnd: (response: Noaa.Response) => void
	}
}

interface ChartsState {

}

export class Charts extends React.Component<ChartsProps, ChartsState> {

	constructor(props: ChartsProps) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		const { noaa } = this.props;
		if (!noaa.data && !noaa.isRequesting) {
			Noaa.getNoaaData()
				.then((data) => {
					noaa.onRequestEnd(data);
				})
			noaa.onRequestBegin();
		}
	}

	componentWillUnmount() {
		const { noaa } = this.props;
		if (!noaa.data && noaa.isRequesting)
			this.props.noaa.onRequestEnd(null);
	}

	render() {

		const { noaa } = this.props;
		if ((!noaa.data && !noaa.isRequesting) || (noaa.data && noaa.data.errors) || (noaa.data && noaa.data.data && !noaa.data.data.waterLevel)) {
			return <p>Error....</p>
		}
		else if (!noaa.data && noaa.isRequesting) {
			return <p>Requesting...</p>
		}
		else {
			const waterLevel = noaa.data.data.waterLevel;


			const previousPredictions =
				<div className="predictions predictions-previous">
					{createTable(waterLevel.predictionsBeforeCurrent)}
				</div>

			const nextPredictions =
				<div className="predictions predictions-next">
					{createTable(waterLevel.predictionsAfterCurrent)}
				</div>

			return (
				<div className="charts tab-view-bg">
					<header>Wells, Maine</header>
					{previousPredictions}
					<div className="current">
						<div className="line"></div>
						<div className="current-text">Current: {createPrettyTimeElement(waterLevel.current.time)}</div>
						<div className="line"></div>
					</div>
					{nextPredictions}
				</div>
			)
		}
	}
}

function createPrettyTimeElement(date: Date): JSX.Element {
	const pretty = Time.createPrettyTime(date);
	return (
		<span className="pretty">
			<span className="pretty-time">{pretty.time}</span>
			<span className="pretty-ampm">{pretty.ampm}</span>
		</span>
	)
}

function createPrettyMonthDay(date: Date): string {
	const month = date.toLocaleString("en-us", { month: "short" });
	const day = date.getDate();
	return `${month} ${day}`;
}

function createTable(predictions: Noaa.WaterLevelPrediction[]): JSX.Element {
	return (
		<table>
			<tbody>
				{predictions.map((p, i) => {
					return (
						<tr key={i}>
							<td>{p.isHigh ? "High" : "Low"}</td>
							<td>{createPrettyMonthDay(p.time)}</td>
							<td>{createPrettyTimeElement(p.time)}</td>
							<td>{(Math.round(p.val * 100) / 100).toString().padEnd(4, "0")} ft</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}