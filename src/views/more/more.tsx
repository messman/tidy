import * as React from "react";

import "./more.scss";
import { CurrentMoreData, getCurrentMoreData } from "../../services/noaa";
import * as Time from "../../services/time";

interface MoreProps {
	currentMore: {
		data: CurrentMoreData,
		isRequesting: boolean,
		onRequestBegin: () => void,
		onRequestEnd: (response: CurrentMoreData) => void
	}
}

interface MoreState {

}

export class More extends React.Component<MoreProps, MoreState> {

	componentDidMount() {
		const { currentMore } = this.props;
		if (!currentMore.data && !currentMore.isRequesting) {
			getCurrentMoreData()
				.then((data) => {
					currentMore.onRequestEnd(data);
				})
			currentMore.onRequestBegin();
		}
	}

	componentWillUnmount() {
		const { currentMore } = this.props;
		if (!currentMore.data && currentMore.isRequesting)
			this.props.currentMore.onRequestEnd(null);
	}

	render() {

		const { currentMore } = this.props;
		if ((!currentMore.data && !currentMore.isRequesting) || (currentMore.data && currentMore.data.errors)) {
			return <p>Error....</p>
		}
		else if (!currentMore.data && currentMore.isRequesting) {
			return <p>Requesting...</p>
		}
		else {
			const data = currentMore.data;
			const prettyTime = Time.createPrettyTime(data.airTemp.date);
			return (
				<div className="more tab-view-bg">
					<header>
						<div className="title">Current Conditions</div>
						<div className="timing">
							as of <span className="pretty-time">{prettyTime.time}</span><span className="pretty-ampm">{prettyTime.ampm}</span>
						</div>
					</header>
					<DataSection title="Water Temperature" value={data.waterTemp.value} unit="Degrees (F)" />
					<DataSection title="Air Temperature" value={data.airTemp.value} unit="Degrees (F)" />
					<DataSection title="Air Pressure" value={data.airPressure.value} unit="Millibars (mb)" />
					<section>
						<div className="data-title">Wind</div>
						<div className="data-value">
							<span className="value">{data.wind.speed}</span>
							<span className="unit">knots {data.wind.directionCardinal}</span>
						</div>
						<div className="data-value">
							<span className="value">{data.wind.gust}</span>
							<span className="unit">knot gusts</span>
						</div>
					</section>
				</div>
			);
		}
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