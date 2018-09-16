import * as React from "react";

import "./more.scss";
import * as Noaa from "../../services/noaa";
import * as Time from "../../services/time";

interface MoreProps {
	noaa: Noaa.Response
}

export class More extends React.Component<MoreProps> {

	render() {
		const { noaa } = this.props;
		const current = noaa.data.current;
		const prettyTime = Time.createPrettyTime(current.airTemp.time);
		return (
			<div className="more tab-view-bg">
				<header>
					<div className="title">Current Conditions</div>
					<div className="timing">
						as of <span className="pretty-time">{prettyTime.time}</span><span className="pretty-ampm">{prettyTime.ampm}</span>
					</div>
				</header>
				<DataSection title="Water Temperature" value={current.waterTemp.val} unit="Degrees (F)" />
				<DataSection title="Air Temperature" value={current.airTemp.val} unit="Degrees (F)" />
				<DataSection title="Air Pressure" value={current.airPressure.val} unit="Millibars (mb)" />
				<section>
					<div className="data-title">Wind</div>
					<div className="data-value">
						<span className="value">{current.wind.speed}</span>
						<span className="unit">knots {current.wind.directionCardinal}</span>
					</div>
					<div className="data-value">
						<span className="value">{current.wind.gust}</span>
						<span className="unit">knot gusts</span>
					</div>
				</section>
			</div>
		);
	}
}

interface DataSectionProps {
	title: string,
	value: string | number,
	unit: string
}

class DataSection extends React.Component<DataSectionProps> {
	render() {
		const props = this.props;
		return (
			<section>
				<div className="data-title">{props.title}</div>
				<div className="data-value">
					<span className="value">{props.value}</span>
					<span className="unit">{props.unit}</span>
				</div>
			</section>
		);
	}
}