
const noaaUri = "api/proxy/noaa/latest";

export function getNoaaData(): Promise<Response> {
	return fetch(noaaUri)
		.then((res) => {
			if (res.ok) {
				return res.json()
					.then((json) => {
						console.log(json.isUpdated);
						return parseJsonToResponse(json.response);
					})
					.catch((err) => {
						throw new Error("There was a problem deserializing the API response");
					});
			}
			else {
				if (res.status === 404) {
					throw new Error("The application could not connect to the API (404)");
				}
				throw new Error(`The API experienced an error (${res.status})`);
			}
		})
		.catch((err) => {
			if (!(err instanceof Error)) {
				err = new Error(err);
			}
			console.error(noaaUri, err);
			throw err;
		});
}

function parseJsonToResponse(json: any): Response {
	const parsed: Response = {
		tzo: json.tzo,
		errors: json.errors,
		data: {
			waterLevel: null,
			current: {
				airPressure: null,
				airTemp: null,
				waterTemp: null,
				wind: null
			}
		}
	}

	if (!!json.data.waterLevel) {
		const waterLevelJson = json.data.waterLevel;
		parsed.data.waterLevel = {
			predictionsBeforeCurrent: waterLevelJson.predictionsBeforeCurrent.map(parseJsonToPrediction),
			previous: parseJsonToPrediction(waterLevelJson.previous),
			current: parseJsonToCurrentData(waterLevelJson.current),
			currentIsRising: waterLevelJson.currentIsRising,
			currentPercentFallen: waterLevelJson.currentPercentFallen,
			next: parseJsonToPrediction(waterLevelJson.next),
			high: parseJsonToPrediction(waterLevelJson.high),
			low: parseJsonToPrediction(waterLevelJson.low),
			predictionsAfterCurrent: waterLevelJson.predictionsAfterCurrent.map(parseJsonToPrediction),
		}
	}

	if (!!json.data.current.airPressure)
		parsed.data.current.airPressure = parseJsonToCurrentData(json.data.current.airPressure);

	if (!!json.data.current.airTemp)
		parsed.data.current.airTemp = parseJsonToCurrentData(json.data.current.airTemp);

	if (!!json.data.current.waterTemp)
		parsed.data.current.waterTemp = parseJsonToCurrentData(json.data.current.waterTemp);

	if (!!json.data.current.wind) {
		const windJson = json.data.current.wind;
		parsed.data.current.wind = {
			time: new Date(windJson.time),
			direction: windJson.direction,
			directionCardinal: windJson.directionCardinal,
			gust: windJson.gust,
			speed: windJson.speed
		};
	}

	return parsed;
}

function parseJsonToPrediction(json: any): WaterLevelPrediction {
	const currentData = parseJsonToCurrentData(json) as any;
	currentData.isHigh = json.isHigh;
	return currentData;
}

function parseJsonToCurrentData(json: any): CurrentData {
	return {
		time: new Date(json.time),
		val: json.val
	}
}

//
//
/// BELOW copied from api project (proxy/noaa/models)
//
//

export interface CurrentData {
	time: Date,
	val: number
}

export interface WaterLevelPrediction extends CurrentData {
	isHigh: boolean
}

export interface JSONError {
	errText: string,
	errContext: string
}

export interface Response {
	tzo: number, // time zone offset, for debugging
	errors: JSONError[],
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
				time: Date,
				direction: number,
				directionCardinal: string,
				gust: number,
				speed: number
			}
		}
	}
}

//
//
/// ABOVE copied from api project (proxy/noaa/models)
//
//