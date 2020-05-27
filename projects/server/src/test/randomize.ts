import * as seedrandom from 'seedrandom';

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

export interface Randomizer {
	getSeed: () => number | string | null | undefined,
	random: () => number,
	randomFloat: OmitFirstArg<typeof randomFloat>,
	randomFloatSet: OmitFirstArg<typeof randomFloatSet>,
	randomInt: OmitFirstArg<typeof randomInt>,
	randomIntSet: OmitFirstArg<typeof randomIntSet>,
	shake: OmitFirstArg<typeof shake>,
	shakeSet: OmitFirstArg<typeof shakeSet>
}

interface RandomFunc {
	(): number
}

function makeFunctionSet<F extends (...args: any) => any>(f: F) {
	return function (randomFunc: RandomFunc, n: number, ...args: Parameters<OmitFirstArg<F>>): number[] {
		const result: number[] = [];
		for (let i = 0; i < n; i++) {
			result.push(f(randomFunc, ...args as any[]));
		}
		return result;
	}
}

export function randomizer(seed?: number | string): Randomizer {
	/**
	 * Returns a random number for the seed. [0, 1).
	 * See https://github.com/davidbau/seedrandom
	 */
	const randomFunc = seed ? seedrandom(`${seed}`) : seedrandom();
	return {
		getSeed: () => seed,
		random: randomFunc,
		randomFloat: randomFloat.bind(null, randomFunc),
		randomFloatSet: randomFloatSet.bind(null, randomFunc),
		randomInt: randomInt.bind(null, randomFunc),
		randomIntSet: randomIntSet.bind(null, randomFunc),
		shake: shake.bind(null, randomFunc),
		shakeSet: shakeSet.bind(null, randomFunc)
	}
}

/**
 * Gets a random number with a specified precision.
 * Using "0" as precision is the equivalent of the random int function.
 * Min and Max can be of any precision.
 * Positive precision is number of digits after the decimal point.
 * 
 * Note - JS does not keep trailing or leading zeros. So keep that precision around for the UI.
 * 
 * Ex:
 * [123, 456, 3] ==> 282.334
 * [3.4, 7.000392, 2] ==> 4.01
 */
function randomFloat(randomFunc: RandomFunc, min: number, max: number, precision: number, inclusive: boolean): number {
	const precisionFactor = Math.pow(10, precision);
	const workingMin = Math.floor(min * precisionFactor);
	const workingMax = Math.floor(max * precisionFactor);
	const int = randomInt(randomFunc, workingMin, workingMax, inclusive);
	return int / precisionFactor;
}
const randomFloatSet = makeFunctionSet(randomFloat);

/** Gets an integer number between min and max. */
function randomInt(randomFunc: RandomFunc, min: number, max: number, inclusive: boolean): number {
	return Math.floor(randomFunc() * (max - min + (inclusive ? 1 : 0))) + min
}
const randomIntSet = makeFunctionSet(randomInt);

function shake(randomFunc: RandomFunc, min: number, max: number, precision: number, value: number, shakeRange: number, inclusive: boolean): number {
	shakeRange = Math.max(shakeRange, Math.min(shakeRange, 1), 0);
	if (shakeRange === 0) {
		return value;
	}
	// Divide by two so that a shakeRange of 1 potentially covers the entire range, while .5 means .5 of the total range (.25 each direction).
	const shake = ((max - min) * shakeRange) / 2;
	const shakenMin = Math.min(max, Math.max(min, value - shake));
	const shakenMax = Math.max(min, Math.min(max, value + shake));
	return randomFloat(randomFunc, shakenMin, shakenMax, precision, inclusive);
}
const shakeSet = makeFunctionSet(shake);