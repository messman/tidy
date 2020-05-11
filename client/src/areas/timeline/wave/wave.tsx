import * as React from 'react';
import { Flex, FlexColumn } from '@/core/layout/flex';
import { styled, StyledFC } from '@/core/style/styled';
import { useRef } from 'react';
import { useElementSize } from '@/services/layout/element-size';
import { useAppDataContext } from '@/services/data/appData';
import * as Bezier from '@/services/draw/bezier';
import { PercentView } from './percentView';

interface WaveProps {
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
	const { isLoading, success } = useAppDataContext();

	const ref = useRef<HTMLDivElement>(null!);
	const size = useElementSize(ref, 300);

	let animationOptions0: SVGWaveAnimationOptions | null = null;
	let animationOptions1: SVGWaveAnimationOptions | null = null;
	let animationOptions2: SVGWaveAnimationOptions | null = null;
	let percentView: JSX.Element = null!;

	// Visual height percent is what the user will believe is for between prev and next, but 
	// is actually between short-term min and max to match the chart.
	// The numbers we display will match so nbd.
	let visualHeightPercent = -1;

	if (!isLoading && success && success.data && !size.isSizing) {
		const tides = success.data!.current.tides;
		const predictTides = success.data!.predictions.tides;

		visualHeightPercent = (tides.height - predictTides.lowest.height) / (predictTides.highest.height - predictTides.lowest.height);
		// Turn into a rough sine wave
		// y = .5sin(xpi - .5pi) + .5 from 0 to 1
		visualHeightPercent = .5 * Math.sin((visualHeightPercent * Math.PI) - (.5 * Math.PI)) + .5;

		percentView = <PercentView
			height={tides.height}
			visualHeightPercent={visualHeightPercent}
			eventHeightPercent={.5}
		/>

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
		<>
			<Container>
				<Flex ref={ref}>
					<SVGWave
						index={0}
						width={size.width}
						height={size.height}
						heightPercent={visualHeightPercent}
						animationOptions={animationOptions0!}
					/>
					<SVGWave
						index={1}
						width={size.width}
						height={size.height}
						heightPercent={visualHeightPercent}
						animationOptions={animationOptions1!}
					/>
					<SVGWave
						index={2}
						width={size.width}
						height={size.height}
						heightPercent={visualHeightPercent}
						animationOptions={animationOptions2!}
					/>
				</Flex>
				<OpacityCover heightPercent={visualHeightPercent} />
				{percentView}
			</Container>
		</>
	);
}

const Container = styled(FlexColumn)`
	z-index: 0;
	background-image: linear-gradient(180deg, ${p => p.theme.color.background} 2%, ${p => p.theme.color.background} 38%);
	overflow: hidden;
`;

export const _SVGWave: StyledFC<SVGWaveProps> = (props) => {
	let wave: JSX.Element | null = null;

	const { width, height, heightPercent, index } = props;
	if (width > 1 && height > 1 && heightPercent !== -1) {

		const a = props.animationOptions;
		// Have to do some rounding so the wave animation will be fluid (pun).
		const freq = Math.round(width / a.wavePeriod);

		// Get the path
		const path = Bezier.getPath(width, height, a.upperPaddingPixels, a.lowerPaddingPixels, heightPercent, a.offsetAboveHeight, a.amplitudePixels, freq);

		const totalDurationSeconds = a.periodDurationSeconds * freq;

		const name = `wave_${index}`;

		const from = a.isForward ? -width : '0';
		const to = a.isForward ? '0' : -width;

		wave = (
			<svg className={props.className} version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox={`0 0 ${width} ${height}`} preserveAspectRatio='none'>
				<defs>
					<path id={name} d={path}></path>
				</defs>
				<use xlinkHref={`#${name}`} x='0' y='0'>
					<animate attributeName='x' from={from} to={to} dur={`${totalDurationSeconds}s`} begin={a.timeOffsetSeconds} repeatCount='indefinite' />
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
	overflow: visible;
	fill: ${p => (([p.theme.color.background, p.theme.color.background, p.theme.color.background])[p.index])};
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
	background-image: linear-gradient(180deg, transparent ${p => p.heightPercent * 100}%, ${p => p.theme.color.background} 100%);
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