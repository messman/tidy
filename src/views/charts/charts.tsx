import * as React from "react";

import { getWaterLevelData, WaterLevel, WaterLevelPrediction } from "../../services/noaa";
import * as Time from "../../services/time";

import "./charts.scss";

interface ChartsProps {
	waterLevel: {
		data: WaterLevel,
		isRequesting: boolean,
		onRequestBegin: () => void,
		onRequestEnd: (response: WaterLevel) => void
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
		const { waterLevel } = this.props;
		if (!waterLevel.data && !waterLevel.isRequesting) {
			getWaterLevelData()
				.then((data) => {
					waterLevel.onRequestEnd(data);
				})
			waterLevel.onRequestBegin();
		}
	}

	componentWillUnmount() {
		const { waterLevel } = this.props;
		if (!waterLevel.data && waterLevel.isRequesting)
			this.props.waterLevel.onRequestEnd(null);
	}

	render() {

		const { waterLevel } = this.props;
		if ((!waterLevel.data && !waterLevel.isRequesting) || (waterLevel.data && waterLevel.data.errors)) {
			return <p>Error....</p>
		}
		else if (!waterLevel.data && waterLevel.isRequesting) {
			return <p>Requesting...</p>
		}
		else {
			const data = waterLevel.data;

			const previousPredictions =
				<div className="predictions predictions-previous">
					{createTable(data.predictionsBeforeCurrent)}
				</div>

			const nextPredictions =
				<div className="predictions predictions-next">
					{createTable(data.predictionsAfterCurrent)}
				</div>

			return (
				<div className="charts tab-view-bg">
					<header>Wells, Maine</header>
					{previousPredictions}
					<div className="current">
						<div className="line"></div>
						<div className="current-text">Current: {createPrettyTimeElement(data.current.time)}</div>
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

function createTable(predictions: WaterLevelPrediction[]): JSX.Element {
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