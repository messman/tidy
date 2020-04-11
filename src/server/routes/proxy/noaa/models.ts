import { JSONError } from "./requestModels";

export interface CurrentData {
	time: string, // local to Wells
	val: number
}

export interface WaterLevelPrediction extends CurrentData {
	isHigh: boolean
}

export interface Response {
	tzo: number, // server time zone offset
	errors: JSONError[]
	data: {
		waterLevel: {
			predictionsBeforeCurrent: WaterLevelPrediction[],
			previous: WaterLevelPrediction,
			current: CurrentData,
			currentIsRising: boolean,
			currentPercentFallen: number, // [0,1]. Adjusted to be between low and high
			next: WaterLevelPrediction,
			high: WaterLevelPrediction, // May be next or previous
			low: WaterLevelPrediction, // May be next or previous
			predictionsAfterCurrent: WaterLevelPrediction[],
		},
		current: {
			airPressure: CurrentData,
			airTemp: CurrentData,
			waterTemp: CurrentData,
			wind: {
				time: string, // local to Wells
				direction: number,
				directionCardinal: string,
				gust: number,
				speed: number
			}
		}

	}
}