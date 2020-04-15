// For requests out to the NOAA API
// API documentation: https://tidesandcurrents.noaa.gov/api/


export interface CurrentData {
	t: string, // Date string, like "2018-07-18 16:33"
	v: string, // Value, like "-4.809"

	// Not Used / Used only in some
	f?: string,
	s?: string,
	q?: string,
}

export interface CurrentWindData {
	d: string, // direction degrees
	dr: string, // direction as letters (N, NNW)
	g: string, // gusts
	s: string, // speed
	t: string, // time

	// Not used
	f?: string,
}

export interface WaterLevelPredictionData extends CurrentData {
	type: "H" | "L"
}

export interface RawResponseWaterLevelPrediction {
	predictions: WaterLevelPredictionData[]
}

export interface RawResponse<T> {
	data: T[],
	metadata: {}
}

export interface JSONError {
	errText: string,
	errContext: string
}

export interface ErrorResponse {
	error: JSONError
}

export interface Response {
	tzo: number, // server time zone offset
	errors: JSONError[],
	data: {
		waterLevelPrediction: RawResponseWaterLevelPrediction | ErrorResponse,
		currentWaterLevel: RawResponse<CurrentData> | ErrorResponse,
		airPressure: RawResponse<CurrentData> | ErrorResponse,
		airTemp: RawResponse<CurrentData> | ErrorResponse,
		waterTemp: RawResponse<CurrentData> | ErrorResponse,
		wind: RawResponse<CurrentWindData> | ErrorResponse
	}
}