import * as React from "react";

import * as Noaa from "../../services/noaa";
import { Title } from "./title/title";
import { Wave } from "./wave/wave";

import "./tide.scss";

interface TideProps {
	noaa: Noaa.Response
}

export class Tide extends React.Component<TideProps> {

	constructor(props: TideProps) {
		super(props);
	}

	// clickShare = () => {

	// }

	// clickRefresh = () => {

	// }

	render() {
		const { noaa } = this.props;
		return (
			<div className="tide">
				<Title noaa={noaa} />
				<Wave noaa={noaa} />
				{/* <button className="low-button share" onClick={this.clickShare}>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="23" height="30" viewBox="0 0 23 30">
							<path d="M19.688 3.75h-4.688c0-2.068-1.682-3.75-3.75-3.75s-3.75 1.682-3.75 3.75h-4.688c-1.553 0-2.813 1.259-2.813 2.813v20.625c0 1.553 1.259 2.813 2.813 2.813h16.875c1.553 0 2.813-1.259 2.813-2.813v-20.625c0-1.553-1.259-2.813-2.813-2.813zM19.336 27.188h-16.172c-0.194 0-0.352-0.157-0.352-0.352v0-19.922c0-0.194 0.157-0.352 0.352-0.352v0h2.461v2.109c0 0.388 0.315 0.703 0.703 0.703h9.844c0.388 0 0.703-0.315 0.703-0.703v-2.109h2.461c0.194 0 0.352 0.157 0.352 0.352v0 19.922c0 0.194-0.157 0.352-0.352 0.352v0zM11.25 2.344c0.777 0 1.406 0.63 1.406 1.406s-0.63 1.406-1.406 1.406-1.406-0.63-1.406-1.406 0.63-1.406 1.406-1.406z"></path>
						</svg>
						<span className="low-button-title">Share</span>
					</button>
					<button className="low-button refresh" onClick={this.clickRefresh}>
						<span className="low-button-title">Refresh</span>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
							<path d="M21.722 7.809c-1.832-1.715-4.209-2.655-6.731-2.653-4.539 0.004-8.457 3.116-9.539 7.433-0.079 0.314-0.359 0.536-0.683 0.536h-3.358c-0.439 0-0.773-0.399-0.692-0.831 1.268-6.732 7.179-11.826 14.28-11.826 3.893 0 7.429 1.531 10.038 4.025l2.093-2.093c0.886-0.886 2.401-0.258 2.401 0.994v7.855c0 0.777-0.63 1.406-1.406 1.406h-7.855c-1.253 0-1.88-1.515-0.994-2.401l2.446-2.446zM1.875 17.344h7.855c1.253 0 1.88 1.515 0.994 2.401l-2.446 2.446c1.832 1.715 4.209 2.655 6.731 2.653 4.536-0.004 8.456-3.114 9.538-7.433 0.079-0.314 0.359-0.536 0.683-0.536h3.358c0.439 0 0.773 0.399 0.692 0.831-1.268 6.732-7.179 11.826-14.28 11.826-3.893 0-7.429-1.531-10.038-4.025l-2.093 2.093c-0.886 0.886-2.401 0.258-2.401-0.994v-7.855c0-0.777 0.63-1.406 1.406-1.406z"></path>
						</svg>
					</button> */}
			</div>
		)
	}
}