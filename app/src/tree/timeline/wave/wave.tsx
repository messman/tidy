import * as React from "react";
import { Flex, FlexRow, FlexColumn } from "@/unit/components/flex";
import styled, { css, ThemedCSS, StyledFC } from "@/styles/theme";
import * as C from "@/styles/common";
import { APIResponse } from "../../../../../data";
import { useRef } from "react";
import { useElementSize } from "@/unit/hooks/useElementSize";

interface WaveProps {
	isLoading: boolean,
	apiResponse: APIResponse
	animationOptions: WaveAnimationOptions
}

export interface WaveAnimationOptions {
	amplitude: number,
	waveSeparation: number,
	topBottomPadding: number,
	period: number,
	periodVariation: number,
	periodSeconds: number,
	periodSecondsVariation: number,
	timeOffsetSecondsVariation: number
}

export const Wave: React.FC<WaveProps> = (props) => {
	const { isLoading, apiResponse } = props;

	const ref = useRef<HTMLDivElement>(null);
	const size = useElementSize(ref, 300);

	let heightPercent = -1;
	let animationOptions0: SVGWaveAnimationOptions = null;
	let animationOptions1: SVGWaveAnimationOptions = null;
	let animationOptions2: SVGWaveAnimationOptions = null;
	if (!isLoading && apiResponse && apiResponse.success) {
		heightPercent = apiResponse.success.current.tides.percent;

		const {
			amplitude,
			waveSeparation,
			topBottomPadding,
			period,
			periodVariation,
			periodSeconds,
			periodSecondsVariation,
			timeOffsetSecondsVariation
		} = props.animationOptions;

		animationOptions0 = {
			amplitudePixels: amplitude,
			offsetAboveHeight: waveSeparation,
			upperPaddingPixels: topBottomPadding,
			lowerPaddingPixels: topBottomPadding,
			wavePeriod: period - periodVariation,
			periodDurationSeconds: periodSeconds - periodSecondsVariation,
			timeOffsetSeconds: timeOffsetSecondsVariation * 2,
			isForward: true
		}

		animationOptions1 = {
			amplitudePixels: amplitude,
			offsetAboveHeight: 0,
			upperPaddingPixels: topBottomPadding,
			lowerPaddingPixels: topBottomPadding,
			wavePeriod: period,
			periodDurationSeconds: periodSeconds,
			timeOffsetSeconds: timeOffsetSecondsVariation,
			isForward: false,
		}

		animationOptions2 = {
			amplitudePixels: amplitude,
			offsetAboveHeight: -waveSeparation,
			upperPaddingPixels: topBottomPadding,
			lowerPaddingPixels: topBottomPadding,
			wavePeriod: period + periodVariation,
			periodDurationSeconds: periodSeconds + periodSecondsVariation,
			timeOffsetSeconds: 0,
			isForward: true
		}
	}

	return (
		<C.ShadowBox>
			<FlexSpace ref={ref}>
				<SVGWave
					index={0}
					width={size.width}
					height={size.height}
					heightPercent={heightPercent}
					animationOptions={animationOptions0}
				/>
				<SVGWave
					index={1}
					width={size.width}
					height={size.height}
					heightPercent={heightPercent}
					animationOptions={animationOptions1}
				/>
				<SVGWave
					index={2}
					width={size.width}
					height={size.height}
					heightPercent={heightPercent}
					animationOptions={animationOptions2}
				/>
				<OpacityCover heightPercent={heightPercent} />
			</FlexSpace>
		</C.ShadowBox>
	);
}

const FlexSpace = styled(Flex)`
	z-index: 0;
	background-image: linear-gradient(180deg, ${props => props.theme.color.skyUpper} 2%, ${props => props.theme.color.skyLower} 38%);
	overflow: hidden;
`;

export const _SVGWave: StyledFC<SVGWaveProps> = (props) => {
	let wave: JSX.Element = null;

	const { width, height, heightPercent, index } = props;
	if (width > 1 && height > 1 && heightPercent !== -1) {

		const a = props.animationOptions;
		// Have to do some rounding so the wave animation will be fluid (pun).
		const freq = Math.round(width / a.wavePeriod);

		// Get the path
		const path = getPath(width, height, a.upperPaddingPixels, a.lowerPaddingPixels, heightPercent, a.offsetAboveHeight, a.amplitudePixels, freq);

		const totalDurationSeconds = a.periodDurationSeconds * freq;

		const name = `wave_${index}`;

		const from = a.isForward ? -width : "0";
		const to = a.isForward ? "0" : -width;

		wave = (
			<svg className={props.className} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
				<defs>
					<path id={name} d={path}></path>
				</defs>
				<use xlinkHref={`#${name}`} x="0" y="0">
					<animate attributeName="x" from={from} to={to} dur={`${totalDurationSeconds}s`} begin={a.timeOffsetSeconds} repeatCount="indefinite" />
				</use>
			</svg>
		);
	}
	return wave;
}

const SVGWave = styled(_SVGWave)`
	-webkit-filter: drop-shadow(5px 5px 4px rgba(0, 0, 0, .7));
	filter: drop-shadow(5px 5px 4px rgba(0, 0, 0, .7));
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	fill: ${props => (([props.theme.color.layerLight, props.theme.color.layerMed, props.theme.color.layerDark])[props.index])};
`;

interface OpacityCoverProps {
	heightPercent: number
}

const OpacityCover = styled.div<OpacityCoverProps>`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-image: linear-gradient(180deg, transparent ${props => props.heightPercent * 100}%, ${props => props.theme.color.bgMed} 100%);
`;


interface SVGWaveAnimationOptions {
	/** The amplitude, in pixels. */
	amplitudePixels: number,
	/** A pixel offset for the percentFallen. */
	offsetAboveHeight: number,
	/** Pixels to pad below the wave. Won't be a part of the percentFallen calculation. */
	lowerPaddingPixels: number,
	/** Pixels to pad above the wave. Won't be a part of the percentFallen calculation. */
	upperPaddingPixels: number,
	/** Pixels for the period of a wave */
	wavePeriod: number,
	periodDurationSeconds: number,
	timeOffsetSeconds: number,
	isForward: boolean
}

interface SVGWaveProps {
	index: number,
	width: number,
	height: number,
	/** How far up the wave should be. [0, 1] */
	heightPercent: number,
	animationOptions: SVGWaveAnimationOptions
}

function roundPercent(outOf1: number): string {
	return Math.round(outOf1 * 100).toString();
}

function roundVal(num: number): number {
	return Math.round(num * 100) / 100;
}

function getPath(totalWidth: number, totalHeight: number, topPadding: number, bottomPadding: number, heightPercent: number, offset: number, amplitude: number, freq: number): string {
	// Coordinate system is from top left
	let y = (totalHeight - topPadding - bottomPadding) * (1 - heightPercent);
	y = y + topPadding - offset;
	y = roundVal(y);

	const period = totalWidth / freq;
	const bezierLength = period / 2;
	const cp1Length = roundVal(bezierLength / 3);
	const cp2Length = roundVal(bezierLength - cp1Length);

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