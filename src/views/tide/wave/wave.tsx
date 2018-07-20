import * as React from "react";

import "./wave.scss";
import { WaterLevel } from "../../../services/noaa";

interface WaveProps {
	waterLevel: WaterLevel
}

interface WaveState {

}

export class Wave extends React.Component<WaveProps, WaveState> {

	private static rock_svg =
		<svg className="rocks" version="1.1" xmlns="http://www.w3.org/2000/svg" width="42" height="30" viewBox="0 0 42 30" preserveAspectRatio="none">
			<path fill="#a49081" d="M23.1 10.253l3.75-6.646 5.85-3.608 6.45 2.848h6.15l-1.65 25.823-18.75 1.329z"></path>
			<path fill="#7c6c60" d="M10.242 15.967l8.349-6.689c0.117-0.094 0.255-0.157 0.403-0.183l5.632-1.016 12.023 6.4 8.146-6.72c0.383-0.316 0.951-0.262 1.267 0.121 0.187 0.226 0.251 0.529 0.174 0.811l-4.028 14.653c-0.092 0.335-0.369 0.587-0.712 0.648l-28.514 5.028c-0.489 0.086-0.956-0.241-1.043-0.73l-2.021-11.464c-0.057-0.324 0.067-0.653 0.324-0.859z"></path>
			<path fill="#938071" d="M13.806 14.886l5.682-0.699c0.161-0.020 0.314-0.083 0.442-0.182l5.987-4.647 9.202-0.722 4.326 5.15c0.064 0.076 0.114 0.162 0.15 0.254l3.38 8.739c0.179 0.464-0.051 0.985-0.515 1.164-0.070 0.027-0.144 0.045-0.219 0.054l-27.844 3.303c-0.494 0.059-0.941-0.294-1-0.788-0.003-0.025-0.005-0.049-0.006-0.074l-0.376-10.627c-0.017-0.466 0.326-0.868 0.79-0.925z"></path>
			<path fill="#6b5b50" d="M14.1 23.475l8.369-6.525 10.945 3.026 4.237 4.539-2.85 5.485h-34.8l5.25-7.376z"></path>
			<path fill="#a49081" d="M23.85 24.483l6.15-6.278 8.1-3.805 5.7 3.805-1.050 11.795h-21.15z"></path>
		</svg>

	private static arrow_up_svg =
		<svg className="arrow arrow-up" version="1.1" xmlns="http://www.w3.org/2000/svg" width="44" height="30" viewBox="0 0 44 30">
			<path d="M42.050 29.917h-40.32c-0.933 0-1.69-0.757-1.69-1.69 0-0.373 0.123-0.735 0.351-1.031l20.13-26.151c0.569-0.74 1.631-0.878 2.37-0.308 0.115 0.089 0.218 0.192 0.307 0.306l20.19 26.151c0.57 0.739 0.434 1.8-0.305 2.371-0.296 0.228-0.659 0.352-1.033 0.352z"></path>
		</svg>

	private static arrow_down_svg =
		<svg className="arrow arrow-down" version="1.1" xmlns="http://www.w3.org/2000/svg" width="45" height="30" viewBox="0 0 45 30">
			<path d="M1.298 0h42.038c0.7 0 1.268 0.568 1.268 1.268 0 0.28-0.093 0.552-0.263 0.773l-20.988 27.265c-0.427 0.555-1.223 0.658-1.778 0.231-0.086-0.066-0.164-0.144-0.23-0.23l-21.050-27.265c-0.428-0.554-0.325-1.35 0.229-1.778 0.222-0.171 0.494-0.264 0.775-0.264z"></path>
		</svg>

	render() {

		const data = this.props.waterLevel;
		if (!data || data.errors) {
			return <div>TODO</div>;
		}

		const isRising = data.currentIsRising;
		const high = isRising ? data.next : data.previous;
		const low = isRising ? data.previous : data.next;

		const currentVal = data.current.val;
		const highVal = high.val;
		const lowVal = low.val;
		let percentFallen = .7; //1 - ((currentVal - lowVal) / (highVal - lowVal));
		console.log(percentFallen, currentVal, highVal, lowVal);

		const upperWavePercent = percentFallen;
		const lowerWavePercent = percentFallen;

		const upperLine = Math.max(Math.round(percentFallen * 100), 10);
		const upperLineStyle: React.CSSProperties = {
			flex: upperLine
		};
		const lowerLine = 100 - upperLine;
		const lowerLineStyle: React.CSSProperties = {
			flex: lowerLine
		};

		return (
			<div className="wave">
				<div className="wave-container">
					<div className="animation">
						<SVGWave animationOpts={{ percentFallen: upperWavePercent, percentMin: .1, percentRange: .7, colorClass: "wave-higher", duration: 7.5 }} />
						{Wave.rock_svg}
						<SVGWave animationOpts={{ percentFallen: lowerWavePercent, percentMin: .2, percentRange: .7, colorClass: "wave-lower", duration: 6 }} />
					</div>
					<div className="marker">
						<div className="line-container">
							<div className={`line ${isRising ? "line-faint" : ""}`} style={upperLineStyle} ></div>
							<div className="line-arrow-holder">
								{isRising ? Wave.arrow_up_svg : Wave.arrow_down_svg}
							</div>
							<div className={`line ${isRising ? "" : "line-faint"}`} style={lowerLineStyle} ></div>
						</div>
						<span className="marker-header marker-high">
							<span className="marker-title">High</span>
							<span className="marker-value">({roundVal(highVal)} ft)</span>
						</span>
						<span className="marker-header marker-low">
							<span className="marker-title">Low</span>
							<span className="marker-value">({roundVal(lowVal)} ft)</span>
						</span>
					</div>
				</div>
				<div className="gradient-out"></div>
			</div >
		);
	}
}

function roundVal(num: number): number {
	return Math.round(num * 100) / 100;
}

interface SVGWaveAnimationOpts {
	percentFallen: number,
	percentMin: number,
	percentRange: number,
	colorClass: string,
	duration: number,
}

interface SVGWaveProps {
	animationOpts: SVGWaveAnimationOpts
}

export class SVGWave extends React.Component<SVGWaveProps> {

	static getPath(topDistanceOutOf1, ampOutOf1, periodOutOf1, controlPointOutOf1, viewBoxX, viewBoxY, timePassed): string {
		const y = topDistanceOutOf1 * viewBoxY;
		const r = ampOutOf1 * viewBoxY;
		const p = viewBoxX / 2; // half of the period; one bezier distance

		// Control Point of 1 means the distance between the two points of the bezier curve
		const cp1 = p * controlPointOutOf1;
		const cp2 = p - (p * controlPointOutOf1);

		console.log({ y, r, p, cp1, cp2 });

		const singleWaveBezier = `c ${cp1} -${r}, ${cp2} -${r}, ${p} 0, c${cp1} ${r}, ${cp2} ${r}, ${p} 0`;
		/*
			One wave:
			     ____
			    /    \
			(A)/      \       /
			           \     /
						-----
			Where (A) is the top distance 
		*/

		// Make 2 waves (first of which covers the whole viewbox - second of which is completely offscreen) so we are 2X the viewbox width
		return `M0 ${y}, ${singleWaveBezier} ${singleWaveBezier} v${viewBoxY - y} h-${viewBoxX * 2} v-${viewBoxY - y} z`
		// M0,${p} c13,0 20.3,-${r} 33.3,-${r} c13,0 20.3,${r} 33.3,${r} c13,0 20.3,-${r} 33.3,-${r} v100 h-100 v-${100 - p} z
	}

	render() {

		const opts = this.props.animationOpts;

		// Should be between 0 and 1 inclusive
		const p = Math.min(Math.max(opts.percentFallen, 0), 1);
		// Transform to between .3 and .9, inclusive, steps by .1
		const min = opts.percentMin;
		const range = opts.percentRange;
		const transformedP = Math.floor(((p * range) + min) * 100) / 100;
		console.log(transformedP);

		// Get the path
		const path = SVGWave.getPath(transformedP, .05, 1.5, .3, 100, 100, 0);
		console.log(path);

		const name = `wave_${opts.colorClass}`;
		return (
			<svg className={`wave ${opts.colorClass}`} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
				<defs>
					<path id={name} d={path}>
					</path>
				</defs>
				<use xlinkHref={`#${name}`} x="0" y="0">
					<animate attributeName="x" from="-100" to="0" dur={`${opts.duration}s`}
						repeatCount="indefinite" />
				</use>
			</svg>
		);
	}
}