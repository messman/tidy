import * as React from "react";

import "./wave.scss";
import { WaterLevel } from "../../../services/noaa";
import { StyleScript } from "./styleScript/styleScript";

interface WaveProps {
	waterLevel: WaterLevel
}

interface WaveState {
	emAsPixel: number
}

export class Wave extends React.Component<WaveProps, WaveState> {

	constructor(props) {
		super(props);
		this.state = {
			emAsPixel: Wave.emAsPixel
		};
	}

	private static emAsPixel: number = -1;

	private setEmAsPixels = (value: number) => {

		console.log({ emAsPixels: value });
		if (Wave.emAsPixel !== -1)
			value = Wave.emAsPixel;
		if (isNaN(value) || value < 1) {
			value = 16; // 1em === 16px default
		}

		Wave.emAsPixel = value;
		this.setState({ emAsPixel: value });
	}

	render() {

		const data = this.props.waterLevel;
		if (!data || data.errors || (this.state.emAsPixel === -1)) {
			return <StyleScript input="1em" outputPixels={this.setEmAsPixels} />
		}

		const isRising = data.currentIsRising;
		const high = isRising ? data.next : data.previous;
		const low = isRising ? data.previous : data.next;

		const currentVal = data.current.val;
		const highVal = high.val;
		const lowVal = low.val;
		let percentFallen = 1 - ((currentVal - lowVal) / (highVal - lowVal));

		const percentToDirection = isRising ? 1 - percentFallen : percentFallen;
		const percent_text = `${roundPercent(percentToDirection)}%`;
		const percent_text_direction = isRising ? "risen" : "fallen";

		const upperLine = Math.max(Math.round(percentFallen * 100), 0);
		const upperLineStyle: React.CSSProperties = {
			flex: upperLine
		};
		const lowerLine = 100 - upperLine;
		const lowerLineStyle: React.CSSProperties = {
			flex: lowerLine
		};

		const emAsPixels = this.state.emAsPixel;
		const upperBackWaveOpts: SVGWaveAnimationOpts = {
			percentFallen: percentFallen,
			amplitudePixels: emAsPixels * .5,
			offsetAboveFallen: emAsPixels * .5,
			upperPaddingPixels: emAsPixels, // 1em for marker range
			lowerPaddingPixels: emAsPixels * 2, // 1em for padding, 1 for marker range 
			wavePeriod: emAsPixels * 18,
			colorClass: "wave-higher",
			periodDurationSeconds: 7,
		};

		const lowerFrontWaveOpts: SVGWaveAnimationOpts = {
			percentFallen: percentFallen,
			amplitudePixels: emAsPixels * .5,
			offsetAboveFallen: -emAsPixels * .5,
			upperPaddingPixels: emAsPixels, // 1em for marker range
			lowerPaddingPixels: emAsPixels * 2, // 1em for padding, 1 for marker range 
			colorClass: "wave-lower",
			wavePeriod: emAsPixels * 17,
			periodDurationSeconds: 4,
		};

		return (
			<div className="graphic">
				<div className="crab-container">
					{crab_svg}
				</div>
				<div className="percent">
					<span className="value">{percent_text}</span>
					<span className="direction">{percent_text_direction}</span>
				</div>
				<div className="waves">
					<SVGWave animationOpts={upperBackWaveOpts} />
					{rock_svg}
					<SVGWave animationOpts={lowerFrontWaveOpts} />
					<div className="wave-svg-offset"></div>
					<div className="marker">
						<div className="line-container">
							<div className={`line line-cap line-begin ${isRising ? "line-faint" : ""}`} ></div>
							<div className="line-flex">
								<div className={`line ${isRising ? "line-faint" : ""}`} style={upperLineStyle} ></div>
								<div className="line-arrow-holder">
									{isRising ? arrow_up_svg : arrow_down_svg}
								</div>
								<div className={`line ${isRising ? "" : "line-faint"}`} style={lowerLineStyle} ></div>
							</div>
							<div className={`line line-cap line-end ${isRising ? "" : "line-faint"}`} ></div>
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
			</div>
		);
	}
}

function roundPercent(outOf1: number): string {
	return Math.round(outOf1 * 100).toString().padEnd(2, "0");
}

function roundVal(num: number): number {
	return Math.round(num * 100) / 100;
}

interface SVGWaveAnimationOpts {
	/** How far down the wave should be. [0, 1] */
	percentFallen: number,
	/** The amplitude, in pixels. */
	amplitudePixels: number,
	/** A pixel offset for the percentFallen. */
	offsetAboveFallen: number,
	/** Pixels to pad below the wave. Won't be a part of the percentFallen calculation. */
	lowerPaddingPixels: number,
	/** Pixels to pad above the wave. Won't be a part of the percentFallen calculation. */
	upperPaddingPixels: number,
	/** Pixels for the period of a wave */
	wavePeriod: number,
	colorClass: string,
	periodDurationSeconds: number,
}

interface SVGWaveProps {
	animationOpts: SVGWaveAnimationOpts
}

interface SVGWaveState {
	height: number,
	width: number,
}

export class SVGWave extends React.Component<SVGWaveProps, SVGWaveState> {

	constructor(props) {
		super(props);

		this.state = {
			width: -1,
			height: -1
		};

		SVGWave.addListener(this);
	}

	static throttlerTimeoutId: number = -1;
	static throttlerTimeout: number = 250;
	static throttleResize = () => {
		if (SVGWave.throttlerTimeoutId === -1) {
			SVGWave.throttlerTimeoutId = window.setTimeout(() => {
				SVGWave.throttlerTimeoutId = -1;
				SVGWave.onResize();
			}, SVGWave.throttlerTimeout);
		}
	}
	static onResize = () => {
		SVGWave.listeners.forEach((l) => {
			l.resize();
		});
	}

	static listeners: SVGWave[] = [];
	static addListener(svgWave: SVGWave): void {
		const indexOf = SVGWave.listeners.indexOf(svgWave);
		if (indexOf === -1)
			SVGWave.listeners.push(svgWave);
	}
	static removeListener(svgWave: SVGWave): void {
		const indexOf = SVGWave.listeners.indexOf(svgWave);
		if (indexOf !== -1)
			SVGWave.listeners.splice(indexOf, 1);
	}

	static _init = (() => {
		window.addEventListener("resize", SVGWave.throttleResize, { capture: true });
		window.addEventListener("orientationchange", SVGWave.throttleResize, { capture: true });
		window.addEventListener("visibilitychange", SVGWave.throttleResize, { capture: true });
	})();

	private ref: React.RefObject<HTMLDivElement> = React.createRef();

	resize() {
		if (this.ref && this.ref.current) {
			const container = this.ref.current;
			this.setState({ width: container.offsetWidth, height: container.offsetHeight });
		}
	}

	componentDidMount() {
		this.resize();
	}

	componentWillUnmount(): void {
		SVGWave.removeListener(this);
	}

	static getPath(totalWidth: number, totalHeight: number, topPadding: number, bottomPadding: number, percentFallen: number, offset: number, amplitude: number, freq: number): string {
		// Coordinate system is from top left
		let y = (totalHeight - topPadding - bottomPadding) * percentFallen;
		y = y + topPadding - offset;
		y = roundVal(y);

		const period = totalWidth / freq;
		const bezierLength = period / 2;
		const cp1Length = roundVal(bezierLength / 3);
		const cp2Length = roundVal(bezierLength - cp1Length);

		console.log({ y, period, bezierLength, cp1Length, cp2Length, totalWidth, totalHeight, percentFallen });

		// Firefox: path cannot use commas
		// Bezier is relative to start point of the bezier, not absolute
		// c (first control point) (second control point) (how far to actually go)
		const singleWaveBezier = `c ${cp1Length} -${amplitude} ${cp2Length} -${amplitude} ${bezierLength} 0 c${cp1Length} ${amplitude} ${cp2Length} ${amplitude} ${bezierLength} 0`;
		let waveBezier = "";
		for (let i = 0; i < freq; i++)
			waveBezier += singleWaveBezier + " ";
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
		// Coordinate system is from top left
		// "m0 (Y amount for percent) (bezier) (bezier) v(total - Y amount for percent) h-(2 * total width) v-(total - y amount for percent) z"
		return `M0 ${y} ${waveBezier} ${waveBezier} v${totalHeight - y} h-${totalWidth * 2} v-${totalHeight - y} z`
		// M0,${p} c13,0 20.3,-${r} 33.3,-${r} c13,0 20.3,${r} 33.3,${r} c13,0 20.3,-${r} 33.3,-${r} v100 h-100 v-${100 - p} z
	}

	render() {
		const waveContainer = <div ref={this.ref} className="wave-container"></div>;

		let wave: JSX.Element = null;
		if (this.state.height !== -1) {

			const opts = this.props.animationOpts;
			const { width, height } = this.state;

			// Have to do some rounding so the wave animation will be fluid (pun)
			const freq = Math.round(width / opts.wavePeriod);

			// Get the path
			const path = SVGWave.getPath(width, height, opts.upperPaddingPixels, opts.lowerPaddingPixels, opts.percentFallen, opts.offsetAboveFallen, opts.amplitudePixels, freq);

			const name = `wave_${opts.colorClass}`;

			const totalDurationSeconds = opts.periodDurationSeconds * freq;

			wave =
				<svg className={`wave ${opts.colorClass}`} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
					<defs>
						<path id={name} d={path}>
						</path>
					</defs>
					<use xlinkHref={`#${name}`} x="0" y="0">
						<animate attributeName="x" from={-width} to="0" dur={`${totalDurationSeconds}s`}
							repeatCount="indefinite" />
					</use>
				</svg>
		}

		return (
			<>
				{waveContainer}
				{wave}
			</>
		);
	}
}

const crab_svg =
	<svg className="crab" viewBox="0,0,155,110" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" >
		<defs>
			<path d="M25.592 40.968c10.679 0 19.336-7.576 19.336-16.92 0-9.346-8.657-16.921-19.336-16.921.879 7.108 1.47 14.35 1.776 21.727-6.22-4.285-12.037-9.188-17.455-14.711-2.3 2.784-3.657 6.206-3.657 9.904 0 9.345 8.657 16.92 19.336 16.92z" id="a" />
			<path d="M25.592 40.968c10.679 0 19.336-7.576 19.336-16.92 0-9.346-8.657-16.921-19.336-16.921.879 7.108 1.47 14.35 1.776 21.727-6.22-4.285-12.037-9.188-17.455-14.711-2.3 2.784-3.657 6.206-3.657 9.904 0 9.345 8.657 16.92 19.336 16.92z" id="b" />
			<ellipse id="c" cx="10.392" cy="10.35" rx="10.392" ry="10.35" />
			<ellipse id="e" cx="10.392" cy="10.35" rx="10.392" ry="10.35" />
		</defs>
		<g fill="none" fillRule="evenodd">
			<path d="M125.689 93.82c1.129.1 5.124 9.114 5.31 12.444.02.365-.603.533-1.475-.015-.872-.547-8.168-6.783-8.928-9.248.68-1.7 3.964-3.283 5.093-3.182z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
			<path d="M115.551 96.807c4.173 3.85 8.873 3.304 10.56.895 1.686-2.408.038-6.781-4.743-9.2-4.782-2.42-8.582-3.72-10.269-1.31-1.686 2.408.28 5.765 4.452 9.615z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
			<path d="M123.953 97.485c-2.342-1.135-7.596-2.806-9.968-5.704 1.232 4.093 7.087 6.93 9.968 5.704z" fill="#F26E69" />
			<path d="M131.461 86.489c1.133-.018 6.049 8.53 6.582 11.821.058.361-.544.593-1.469.14-.924-.453-8.832-5.892-9.846-8.264.5-1.761 3.6-3.68 4.733-3.697z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
			<path d="M121.691 90.52c4.552 3.393 9.17 2.358 10.595-.213 1.426-2.572-.67-6.749-5.679-8.655-5.008-1.907-8.923-2.801-10.349-.23-1.425 2.572.881 5.706 5.433 9.099z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
			<path d="M130.118 90.316c-2.448-.884-7.848-1.997-10.51-4.63 1.653 3.941 7.773 6.15 10.51 4.63z" fill="#F26E69" />
			<g>
				<path d="M136.18 75.633c1.095-.291 7.932 6.813 9.246 9.878.144.336-.384.707-1.391.49-1.007-.216-9.996-3.58-11.553-5.636.058-1.83 2.602-4.441 3.698-4.732z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
				<path d="M127.676 81.908c5.237 2.19 9.467.07 10.228-2.77.76-2.84-2.283-6.386-7.604-7.024-5.32-.639-9.336-.56-10.097 2.28-.761 2.84 2.235 5.323 7.473 7.514z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
				<path d="M135.802 79.671c-2.588-.265-8.097-.04-11.318-1.95 2.558 3.424 9.03 4.088 11.318 1.95z" fill="#F26E69" />
			</g>
			<g>
				<path d="M33.153 95.434c-1.125.14-4.803 9.289-4.873 12.623-.008.365.621.511 1.474-.066.852-.578 7.926-7.065 8.6-9.554-.74-1.675-4.077-3.143-5.201-3.003z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
				<path d="M43.388 98.067c-4.035 3.993-8.752 3.61-10.521 1.263-1.77-2.348-.276-6.776 4.419-9.361 4.694-2.585 8.447-4.016 10.216-1.668 1.77 2.348-.078 5.773-4.114 9.766z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
				<path d="M35.015 99.037c2.3-1.215 7.493-3.07 9.763-6.048-1.088 4.134-6.84 7.173-9.763 6.048z" fill="#F26E69" />
				<g>
					<path d="M27.128 88.31c-1.133.022-5.747 8.736-6.165 12.044-.046.363.564.574 1.472.088.909-.485 8.621-6.197 9.552-8.602-.56-1.743-3.726-3.552-4.859-3.53z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
					<path d="M37.033 91.998c-4.431 3.55-9.082 2.676-10.596.156-1.514-2.52.434-6.767 5.373-8.847 4.939-2.08 8.82-3.111 10.335-.591 1.514 2.52-.682 5.733-5.112 9.282z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
					<path d="M28.604 92.088c2.415-.969 7.773-2.27 10.342-4.995-1.515 3.997-7.553 6.419-10.342 4.995z" fill="#F26E69" />
				</g>
				<g>
					<path d="M22.034 77.625c-1.105-.253-7.69 7.086-8.896 10.195-.133.34.408.693 1.407.442.999-.251 9.864-3.928 11.349-6.037-.122-1.826-2.756-4.347-3.86-4.6z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
					<path d="M30.751 83.6c-5.158 2.372-9.459.4-10.318-2.412-.86-2.812 2.059-6.461 7.354-7.285 5.295-.824 9.31-.885 10.17 1.927.86 2.812-2.048 5.398-7.206 7.77z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
					<path d="M22.551 81.648c2.578-.356 8.092-.322 11.244-2.344-2.437 3.511-8.882 4.4-11.244 2.344z" fill="#F26E69" />
				</g>
			</g>
			<g>
				<path d="M145.408 41.037c1.928-6.733-2.026-11.6-6.22-12.114-4.192-.515-8.531 3.732-8.241 10.339.29 6.607 1.303 11.51 5.496 12.025 4.193.515 7.038-3.517 8.965-10.25z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
				<path d="M139.242 56.119c4.075-4.553 2.888-9.848-.156-11.825-3.043-1.976-8.027-.277-10.34 5.009-2.313 5.285-3.413 9.507-.37 11.483 3.044 1.976 6.79-.115 10.866-4.667z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
				<path d="M129.56 64.032c4.549-2.654 5.01-7.285 3.062-9.69-1.948-2.405-6.469-2.315-9.78 1.396-3.31 3.711-5.345 6.87-3.398 9.275 1.948 2.405 5.566 1.673 10.115-.98z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
				<use stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="rotate(-13 58.23 -452.225)" xlinkHref="#a" />
				<path d="M144.483 29.311c-13.613 4.44-20.848-2.098-28.145-11.478.208 9.472 15.077 19.228 28.145 11.478z" fill="#F26E69" />
			</g>
			<g>
				<path d="M10.584 42.307c-2.161-6.662 1.62-11.663 5.793-12.324 4.173-.66 8.657 3.432 8.598 10.045-.059 6.613-.9 11.549-5.073 12.21-4.173.66-7.156-3.27-9.318-9.931z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
				<path d="M17.274 57.164c-4.232-4.407-3.23-9.741-.258-11.823 2.973-2.081 8.013-.556 10.51 4.645 2.495 5.201 3.742 9.382.77 11.463-2.973 2.082-6.79.122-11.022-4.285z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
				<path d="M27.226 64.735c-4.639-2.494-5.26-7.106-3.398-9.577 1.862-2.472 6.383-2.54 9.822 1.053 3.438 3.593 5.582 6.68 3.72 9.151-1.863 2.472-5.504 1.867-10.144-.627z" stroke="#E03232" strokeWidth="3" fill="#F0504F" />
				<use stroke="#E03232" strokeWidth="3" fill="#F0504F" transform="scale(-1 1) rotate(-11 -18.778 267.396)" xlinkHref="#b" />
				<path d="M11.899 31.158c12.753 3.985 18.976-1.916 25.08-10.379.4 8.537-12.621 17.347-25.08 10.379z" fill="#F26E69" />
			</g>
			<g>
				<path d="M73.449 42.163a77.718 77.718 0 0 1 4.843-.217 12.595 12.595 0 0 1-.075-1.176c-.125-7.144 5.8-13.04 13.234-13.17 7.434-.13 13.562 5.556 13.686 12.7.037 2.104-.45 4.1-1.347 5.872 12.907 4.9 21.53 13.598 21.705 23.652.277 15.847-20.539 29.06-46.492 29.514-25.954.453-47.217-12.027-47.494-27.874-.16-9.15 6.714-17.424 17.549-22.868a12.53 12.53 0 0 1-2.485-7.273c-.124-7.144 5.801-13.041 13.235-13.17 7.434-.13 13.561 5.556 13.686 12.7.008.442-.008.879-.045 1.31z" stroke="#E03232" strokeWidth="4" fill="#F0504F" />
				<path d="M56.926 93.135c-4.805-4.62-15.815-12.898-22.558-20.309 1.564 8.442 16.378 18.065 22.558 20.31z" fill="#F26E69" />
				<path d="M99.91 65.565C89.144 71.4 63.764 78.9 52.207 66.398c5.1 21.088 44.375 21.579 47.701-.833z" fill="#565757" />
				<g transform="rotate(-1 1782.956 -2804.82)">
					<mask id="d" fill="#fff">
						<use xlinkHref="#c" />
					</mask>
					<use fill="#D8EEEE" xlinkHref="#c" />
					<ellipse fill="#FFF" mask="url(#d)" cx="13.698" cy="10.35" rx="10.392" ry="10.35" />
				</g>
				<path d="M62.51 33.388a3.453 3.453 0 0 0-.454 1.783c.032 1.818 1.432 3.269 3.128 3.24.959-.018 1.807-.505 2.357-1.254.46.927.726 1.972.745 3.081.068 3.897-2.942 7.11-6.725 7.175-3.782.066-6.903-3.04-6.971-6.936-.068-3.897 2.943-7.11 6.725-7.175.407-.007.806.022 1.194.086zm-3.694 5.604c.783-.014 1.404-.762 1.388-1.671-.016-.91-.663-1.636-1.445-1.622-.783.014-1.404.762-1.389 1.671.016.91.663 1.635 1.446 1.622z" fill="#565757" />
				<g>
					<g transform="rotate(-1 1766.895 -4645.148)">
						<mask id="f" fill="#fff">
							<use xlinkHref="#e" />
						</mask>
						<use fill="#D8EEEE" xlinkHref="#e" />
						<ellipse fill="#FFF" mask="url(#f)" cx="13.698" cy="10.35" rx="10.392" ry="10.35" />
					</g>
					<path d="M95.105 33.29a3.453 3.453 0 0 0-.452 1.783c.031 1.818 1.431 3.268 3.127 3.239.96-.017 1.807-.504 2.357-1.253.46.926.726 1.971.746 3.08.068 3.897-2.943 7.11-6.725 7.176-3.783.066-6.904-3.04-6.972-6.936-.068-3.897 2.943-7.11 6.725-7.176.407-.007.806.023 1.194.086zm-3.693 5.603c.783-.013 1.404-.762 1.388-1.67-.016-.91-.663-1.636-1.445-1.622-.783.013-1.404.761-1.388 1.67.015.91.663 1.636 1.445 1.622z" fill="#565757" />
				</g>
			</g>
		</g>
	</svg>

const rock_svg =
	<svg className="rocks" viewBox="0 0 268 500" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none">
		<defs>
			<rect id="path-1" x="0" y="0" width="355" height="500"></rect>
		</defs>
		<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
			<g transform="translate(-87.000000, 0.000000)">
				<mask id="mask-2" fill="white">
					<use xlinkHref="#path-1"></use>
				</mask>
				<g id="Beach" mask="url(#mask-2)">
					<g transform="translate(87.000000, 0.000000)">
						<polygon id="Path-3-Copy" fill="#807065" points="130 3.02898551 224.336 0 298.504 0 330 13.9263701 281.232 196.672072 99.368 213.537676 90 90.8695652 109 50.4830918"></polygon>
						<path d="M61.0012132,181.616706 L53.053824,239.116588 C52.9025928,240.210755 53.6669939,241.220351 54.7611615,241.371582 C54.8518986,241.384123 54.9433901,241.390416 55.0349898,241.390416 L173,241.390416 C174.104569,241.390416 175,240.494985 175,239.390416 L175,139.995598 C175,139.668656 174.919849,139.346699 174.766566,139.057917 L150.843415,93.9873454 C150.325548,93.0116981 149.114815,92.6405938 148.139168,93.1584607 C147.952014,93.2578007 147.781835,93.3862497 147.634996,93.5390028 L134.829423,106.860382 C134.420482,107.285796 133.844547,107.508906 133.255736,107.470009 L93.4204169,104.83845 C93.332247,104.832625 93.2437881,104.83265 93.1556215,104.838525 L54.8277489,107.392227 C53.725623,107.465659 52.891702,108.418637 52.9651342,109.520763 C52.9671445,109.550935 52.9698388,109.581057 52.973215,109.611107 L61.007542,181.119573 C61.0261175,181.284902 61.0239915,181.451903 61.0012132,181.616706 Z" id="Path-3-Copy" fill="#938071"></path>
						<path d="M150.719036,45.5194591 L146.844562,88.5504472 L117.775815,111.051811 C117.201096,111.496686 116.912947,112.218322 117.023182,112.936698 L122.673383,149.757947 C122.779628,150.450327 123.240365,151.036661 123.887977,151.303639 L171.429651,170.902705 C171.94653,171.115789 172.529003,171.102798 173.035868,170.866881 L215.417952,151.140402 C215.791145,150.966701 216.208845,150.912384 216.614051,150.984863 L246.606757,156.349625 C246.892399,156.400718 247.185737,156.389042 247.466415,156.315409 L288.404071,145.575781 C289.017754,145.414787 289.51865,144.972167 289.753941,144.38296 L304.823109,106.647283 C304.877077,106.512139 304.945633,106.383288 305.02756,106.26302 L319.589735,84.8858843 C319.757498,84.6396088 319.86811,84.3589576 319.913485,84.0644454 L326.5212,41.1758627 C326.689393,40.0841737 325.940752,39.0628374 324.849063,38.8946441 C324.80957,38.8885596 324.769903,38.8836599 324.730117,38.8799518 L261.862764,33.0207426 C261.85063,33.0196117 261.838485,33.0185917 261.826332,33.0176828 L208.181123,29.0055702 C207.958324,28.9889071 207.734308,29.0096935 207.518379,29.067066 L152.197396,43.7658778 C151.385099,43.9817055 150.794407,44.6823648 150.719036,45.5194591 Z" id="Path-4" fill="#A08D7F"></path>
						<path d="M59.2525739,275.471154 L39.1760839,219.486058 C38.9566316,218.874096 38.9419109,218.207406 39.1341379,217.586353 L53.9378182,169.758208 C54.1667151,169.018681 54.6726269,168.396266 55.349781,168.021092 L99.8321299,143.375854 C100.479721,143.017059 101.237112,142.910392 101.95861,143.076372 L179.20998,160.848014 C179.623922,160.943241 180.053367,160.949482 180.469901,160.866323 L191.827863,158.59878 C193.200428,158.324756 194.580093,159.036271 195.152681,160.313443 L214.575452,203.636402 C214.748509,204.02241 214.837974,204.440655 214.837974,204.863682 L214.837974,246.714719 C214.837974,247.661097 214.391416,248.55199 213.633183,249.118305 L167.950333,283.238259 C167.431909,283.625464 166.802188,283.834673 166.155125,283.834673 L97.4800744,283.834673 C97.3017666,283.834673 97.1238138,283.818777 96.9483293,283.787172 L61.544745,277.410984 C60.4887695,277.220803 59.6147596,276.481141 59.2525739,275.471154 Z" id="Path-2" fill="#817064"></path>
						<path d="M197.594575,89.5241583 L155.755313,122.791409 C155.194665,123.237192 154.915214,123.948758 155.022677,124.656925 L166.895576,202.898369 C167.061294,203.990436 168.08093,204.741391 169.172998,204.575673 C169.306458,204.555421 169.437525,204.521709 169.564194,204.475054 L267.709428,168.325555 C267.930775,168.244027 268.164799,168.202299 268.400682,168.202299 L309.990006,168.202299 C311.024847,168.202299 311.888789,167.412886 311.981895,166.382242 L318.834272,90.5296518 C318.901328,89.7873778 318.550088,89.0693913 317.922929,88.6667281 L289.342717,70.3170196 C289.020333,70.1100354 288.645283,70 288.262172,70 L251.202144,70 C250.968489,70 250.736641,70.0409437 250.517118,70.1209737 L198.154276,89.2105889 C197.952051,89.2843129 197.763053,89.390198 197.594575,89.5241583 Z" id="Path-5" fill="#938071"></path>
						<path d="M55.1492163,225.152059 L44.7404564,251.179988 C44.670305,251.355408 44.6253628,251.539882 44.6069697,251.72791 L37.0096451,329.394039 C36.902109,330.493361 37.7061107,331.471713 38.8054332,331.579249 C39.2152736,331.61934 39.6274988,331.531944 39.9858126,331.328997 L77.2111363,310.244735 C77.4894486,310.0871 77.8015092,309.998515 78.121134,309.986413 L157.126411,306.99509 C157.45996,306.982461 157.785045,306.886552 158.072033,306.716104 L191.634698,286.782609 L176.763801,225.10237 C176.643038,224.601481 176.333626,224.166522 175.900056,223.888152 L146.974971,205.31702 C146.652587,205.110035 146.277537,205 145.894426,205 L108.834398,205 C108.600742,205 108.368894,205.040944 108.149372,205.120974 L56.3212034,224.015666 C55.7866925,224.21053 55.3604669,224.623811 55.1492163,225.152059 Z" id="Path-5-Copy" fill="#938071"></path>
						<path d="M123.130042,214.751338 L140.349737,260.148296 C140.572709,260.736126 141.05911,261.184898 141.662955,261.35992 L202.427569,278.972257 C202.646305,279.035656 202.874262,279.061231 203.101609,279.047878 L300.933116,273.301881 C301.943549,273.242535 302.750357,272.437657 302.812124,271.42737 L307.666309,192.029781 C307.690789,191.629378 307.594295,191.230865 307.389362,190.88601 L295.759648,171.315878 C295.722496,171.253361 295.681963,171.192917 295.638228,171.134815 L276.703879,145.980487 L227.463285,140.014525 C226.974288,139.955278 226.480626,140.078569 226.076905,140.360769 L187.836857,167.090434 C187.748351,167.1523 187.654979,167.206896 187.557658,167.253687 L145.703879,187.376622 L123.495739,212.724035 C123.008427,213.280232 122.867781,214.059929 123.130042,214.751338 Z" id="Path-3" fill="#88776C"></path>
						<path d="M82.452093,249.931238 L58.8770781,290 L52.9594522,316.424439 C52.9050153,316.66752 52.8964681,316.918632 52.9342505,317.164852 L58.6431952,354.368923 C58.7810137,355.267059 59.5069561,355.95942 60.4106083,356.054578 L99.6919922,360.191026 C99.9190002,360.214931 100.148425,360.199798 100.370327,360.146283 L140.566131,350.45248 C140.874305,350.378159 141.195731,350.378159 141.503904,350.45248 L181.578999,360.117172 C181.878941,360.189508 182.191553,360.191466 182.492378,360.122894 L225.388727,350.344784 C225.404471,350.341196 225.420171,350.337416 225.435824,350.333447 L269.147494,339.249302 C269.711051,339.106399 270.184532,338.725338 270.444619,338.205364 L286.729591,305.648053 C286.927599,305.252191 286.988695,304.801827 286.903307,304.36752 L278.221554,260.209738 C278.103721,259.610407 277.718474,259.097776 277.175567,258.817892 L229.602333,234.292468 C229.233291,234.102216 228.814187,234.031534 228.403161,234.090228 L145.092618,245.986774 C145.030906,245.995587 144.968817,246.001509 144.906552,246.004522 L84.0792034,248.94778 C83.4057314,248.980368 82.7940119,249.350103 82.452093,249.931238 Z" id="Path-4-Copy" fill="#A08D7F"></path>
						<path d="M159.236358,384.860732 L121.89618,348.126471 C121.109287,347.352346 120.811076,346.208628 121.119796,345.148835 L135.331565,296.361963 C135.517593,295.723356 135.910577,295.164681 136.448735,294.773769 L189.039041,256.572771 C189.551538,256.2005 190.168718,256 190.802152,256 L222.618542,256 L229.204724,265.537811 L271.809568,275.857421 C272.233716,275.960156 272.675171,275.969116 273.103137,275.883675 L284.443343,273.619677 C285.815908,273.345653 287.195572,274.057169 287.768161,275.33434 L307.190931,318.657299 C307.363989,319.043307 307.453454,319.461552 307.453454,319.884579 L307.453454,361.735616 C307.453454,362.681994 307.006896,363.572887 306.248662,364.139202 L260.565813,398.259156 C260.047389,398.646361 259.417668,398.85557 258.770604,398.85557 L190.472535,398.85557 C190.047409,398.85557 189.627137,398.765216 189.239574,398.590494 L160.107295,385.457055 C159.784021,385.311316 159.489145,385.109417 159.236358,384.860732 Z" id="Path-2-Copy" fill="#817064"></path>
						<path d="M21.003395,336.51875 L24.866694,402.829385 C24.9110246,403.590287 25.3839851,404.259845 26.0863053,404.555957 L69.5640708,422.887079 C69.8464508,423.006136 70.1524136,423.05871 70.4583389,423.040742 L168.168343,417.301881 C169.178776,417.242535 169.985584,416.437657 170.04735,415.42737 L174.901536,336.029781 C174.926015,335.629378 174.829522,335.230865 174.624589,334.88601 L162.994874,315.315878 C162.957723,315.253361 162.917189,315.192917 162.873454,315.134815 L143.939106,289.980487 L94.6985112,284.014525 C94.2095145,283.955278 93.7158526,284.078569 93.312131,284.360769 L54.9466035,311.178144 C54.9416049,311.181638 54.9366222,311.185155 54.9316558,311.188695 L21.839241,334.773741 C21.2790799,335.172969 20.9633872,335.832046 21.003395,336.51875 Z" id="Path-3-Copy-2" fill="#88776C"></path>
						<path d="M127.666609,397.959917 L151.586866,432.405087 C151.853806,432.789481 152.247092,433.068092 152.698265,433.192423 L198.874615,445.9174 C199.073248,445.972138 199.279147,445.995854 199.485023,445.987709 L272.992116,443.079441 C274.095822,443.035773 274.955153,442.105643 274.911485,441.001937 C274.911361,440.998796 274.911229,440.995654 274.91109,440.992513 L271.041325,353.617297 C271.040019,353.587818 271.039366,353.558313 271.039366,353.528805 L271.039366,321.041835 C271.039366,319.937266 270.143936,319.041835 269.039366,319.041835 C268.995299,319.041835 268.951243,319.043292 268.907272,319.046202 L230.378839,321.596468 C230.275631,321.6033 230.173108,321.618127 230.072193,321.640817 L184.456214,331.897422 C184.156118,331.964897 183.875629,332.100681 183.636557,332.294216 L142.347299,365.718853 C142.118586,365.904002 141.933546,366.137339 141.805377,366.402221 L127.509031,395.948004 C127.194554,396.597922 127.254781,397.366884 127.666609,397.959917 Z" id="Path-3-Copy-3" fill="#938071"></path>
						<path d="M16.734227,382.151683 L11,407 L25.7756007,419.03055 C26.4934908,419.615069 26.7164099,420.615873 26.3144695,421.449822 L14.4453388,446.076007 C14.1657583,446.656083 14.1825782,447.335291 14.4905284,447.900817 L26.3452267,469.671051 C26.739928,470.395889 27.539341,470.803832 28.3578783,470.698114 L69.9254902,465.329423 C69.9751459,465.32301 70.0245432,465.314734 70.0735778,465.304614 L119.799973,455.041285 C119.932978,455.013833 120.068434,455 120.204244,455 L183.241655,455 C183.634855,455 184.019331,454.884098 184.34702,454.666784 L226.577505,426.660684 C226.793315,426.517565 226.979278,426.333897 227.125067,426.11988 L241.589735,404.885884 C241.757498,404.639609 241.86811,404.358958 241.913485,404.064445 L248.5212,361.175863 C248.689393,360.084174 247.940752,359.062837 246.849063,358.894644 C246.80957,358.88856 246.769903,358.88366 246.730117,358.879952 L183.862764,353.020743 C183.85063,353.019612 183.838485,353.018592 183.826332,353.017683 L130.19836,349.006859 C129.964322,348.989356 129.729029,349.013181 129.503251,349.077246 L18.1370628,380.677359 C17.435683,380.876375 16.898165,381.441285 16.734227,382.151683 Z" id="Path-4-Copy-2" fill="#A08D7F"></path>
						<path d="M38.2363575,520.860732 L0.896179881,484.126471 C0.109286633,483.352346 -0.188924475,482.208628 0.119796497,481.148835 L14.3315647,432.361963 C14.5175929,431.723356 14.9105773,431.164681 15.4487348,430.773769 L68.0390409,392.572771 C68.5515376,392.2005 69.1687176,392 69.8021521,392 L101.618542,392 L164.410515,408.782739 C165.282947,409.015918 166.003924,409.629692 166.373358,410.453724 L186.190931,454.657299 C186.363989,455.043307 186.453454,455.461552 186.453454,455.884579 L186.453454,497.735616 C186.453454,498.681994 186.006896,499.572887 185.248662,500.139202 L139.565813,534.259156 C139.047389,534.646361 138.417668,534.85557 137.770604,534.85557 L69.472535,534.85557 C69.0474087,534.85557 68.627137,534.765216 68.2395743,534.590494 L39.1072948,521.457055 C38.7840206,521.311316 38.489145,521.109417 38.2363575,520.860732 Z" id="Path-2-Copy-2" fill="#817064"></path>
						<path d="M145.115588,432.014953 L156,469 L149.310593,498.437499 C149.095691,499.383202 149.590237,500.346805 150.48387,500.723579 L193.564071,518.887079 C193.846451,519.006136 194.152414,519.05871 194.458339,519.040742 L292.168343,513.301881 C293.178776,513.242535 293.985584,512.437657 294.04735,511.42737 L298.901536,432.029781 C298.926015,431.629378 298.829522,431.230865 298.624589,430.88601 L286.994874,411.315878 C286.957723,411.253361 286.917189,411.192917 286.873454,411.134815 L267.939106,385.980487 L246,389 L218.495818,380.102613 C218.131854,379.984873 217.741758,379.973983 217.371792,380.071233 C205.094257,383.298531 195.970326,386.274787 190,389 C184.078433,391.702956 173.126735,394.628226 157.144906,397.775809 L157.144907,397.775815 C156.437196,397.915197 155.859366,398.42486 155.632699,399.109626 L145.135544,430.821823 C145.007636,431.208236 145.000674,431.624478 145.115588,432.014953 Z" id="Path-3-Copy-4" fill="#88776C"></path>
					</g>
				</g>
			</g>
		</g>
	</svg>


const arrow_up_svg =
	<svg className="arrow arrow-up" version="1.1" xmlns="http://www.w3.org/2000/svg" width="44" height="30" viewBox="0 0 44 30">
		<path d="M42.050 29.917h-40.32c-0.933 0-1.69-0.757-1.69-1.69 0-0.373 0.123-0.735 0.351-1.031l20.13-26.151c0.569-0.74 1.631-0.878 2.37-0.308 0.115 0.089 0.218 0.192 0.307 0.306l20.19 26.151c0.57 0.739 0.434 1.8-0.305 2.371-0.296 0.228-0.659 0.352-1.033 0.352z"></path>
	</svg>

const arrow_down_svg =
	<svg className="arrow arrow-down" version="1.1" xmlns="http://www.w3.org/2000/svg" width="45" height="30" viewBox="0 0 45 30">
		<path d="M1.298 0h42.038c0.7 0 1.268 0.568 1.268 1.268 0 0.28-0.093 0.552-0.263 0.773l-20.988 27.265c-0.427 0.555-1.223 0.658-1.778 0.231-0.086-0.066-0.164-0.144-0.23-0.23l-21.050-27.265c-0.428-0.554-0.325-1.35 0.229-1.778 0.222-0.171 0.494-0.264 0.775-0.264z"></path>
	</svg>