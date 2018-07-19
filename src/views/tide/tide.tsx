import * as React from "react";

import { getWaterLevelData, WaterLevel } from "../../services/noaa";
import { Title } from "./title/title";

import "./tide.scss";

interface TideProps {
	waterLevel: {
		data: WaterLevel,
		isRequesting: boolean,
		onRequestBegin: () => void,
		onRequestEnd: (response: WaterLevel) => void
	}
}

interface TideState {

}

export class Tide extends React.Component<TideProps, TideState> {

	constructor(props: TideProps) {
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
			return (
				<Title waterLevel={data} />
			)
		}
	}
}