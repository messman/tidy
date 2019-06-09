import * as React from "react";

import * as Noaa from "../../services/noaa";
import * as Time from "../../services/time";

import "./charts.scss";

interface ChartsProps {
	noaa: Noaa.Response
}

export class Charts extends React.Component<ChartsProps> {

	constructor(props: ChartsProps) {
		super(props);
	}

	render() {
		const { noaa } = this.props;
		const waterLevel = noaa.data.waterLevel;
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
							<td>{p.val.toFixed(2)} ft</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}