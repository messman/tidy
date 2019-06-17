export interface APIResponse {
	info: RInfo,
	error: RError,
	success: RSuccess
}

export interface RInfo {
	time: Date
}

export interface RError {
	errors: Error[]
}

export interface RSuccess {
	current: RSuccessCurrent,
	predictions: RSuccessPredictions
}

export interface RSuccessCurrent {
	tides: {
		percent: number,
		height: number,
		previous: TideEvent,
		next: TideEvent
	},
	sun: {
		previous: SunEvent,
		next: SunEvent
	},
	weather: WeatherEvent
}

export interface RSuccessPredictions {
	tides: {
		maxHeight: number,
		minHeight: number,
		events: TideEvent[],
	}
	sun: SunEvent[],
	weather: WeatherEvent[]
}

export interface TideEvent {
	time: Date,
	isLow: boolean,
	height: number
}

export interface SunEvent {
	time: Date,
	isSunrise: boolean
}

export interface WeatherEvent {
	time: Date,
	status: 'cloudy' | 'raining' | 'sunny',
	temp: number,
	tempUnit: string,
	chanceRain: number,
	wind: number,
	windUnit: string,
	windDirection: string
}

////////////////////////////////////////////////////////

function createInfo(date: Date): RInfo {
	return {
		time: date || new Date()
	}
}

export function getErrorResponse(): APIResponse {
	return {
		info: createInfo(null),
		error: {
			errors: [new Error('Could not fetch NOAA data')]
		},
		success: null
	}
}

export function getSuccessResponse(): APIResponse {

	return {
		info: createInfo(new Date("1/1/2019 12:30:00")),
		error: null,
		success: {
			current: {
				tides: {
					percent: .7,
					height: 8.5,
					previous: createTideEvent("1/1/2019 8:00:00", true, 0),
					next: createTideEvent("1/1/2019 14:20:00", false, 11)
				},
				sun: {
					previous: createSunEvent("1/1/2019 16:10:00", true),
					next: createSunEvent("1/1/2019 17:10:00", false)
				},
				weather: {
					time: new Date("1/1/2019 12:15:00"),
					status: 'cloudy',
					temp: 60,
					tempUnit: 'F',
					chanceRain: .5,
					wind: 5,
					windUnit: 'mph',
					windDirection: 'ENE'
				}
			},
			predictions: {
				tides: {
					minHeight: 0,
					maxHeight: 12,
					events: [
						createTideEvent("1/1/2019 14:20:00", false, 11),
						createTideEvent("1/1/2019 20:30:00", true, 1),
						createTideEvent("1/2/2019 02:40:00", false, 10.5),
						createTideEvent("1/2/2019 09:50:00", true, 1),
						createTideEvent("1/2/2019 15:20:00", false, 11.5),
						createTideEvent("1/2/2019 20:10:00", true, 2),
						createTideEvent("1/3/2019 02:30:00", false, 8.9),
						createTideEvent("1/3/2019 08:20:00", true, 0.6),
						createTideEvent("1/3/2019 14:20:00", false, 11),
						createTideEvent("1/3/2019 21:40:00", true, .4),
						createTideEvent("1/4/2019 03:50:00", false, 10.8),
						createTideEvent("1/4/2019 10:10:00", true, 3),
						createTideEvent("1/4/2019 16:00:00", false, 12),
						createTideEvent("1/4/2019 22:10:00", true, 4),
						createTideEvent("1/5/2019 04:10:00", false, 7),
						createTideEvent("1/5/2019 10:40:00", true, 0),
						createTideEvent("1/5/2019 17:20:00", false, 10),
						createTideEvent("1/5/2019 23:30:00", true, 1),
						createTideEvent("1/6/2019 05:40:00", false, 11.5),
						createTideEvent("1/6/2019 11:20:00", true, 1.3),
					]
				},
				sun: [
					createSunEvent("1/1/2019 06:10:00", true),
					createSunEvent("1/1/2019 17:10:00", false),
					createSunEvent("1/2/2019 06:10:00", true),
					createSunEvent("1/2/2019 17:10:00", false),
					createSunEvent("1/3/2019 06:10:00", true),
					createSunEvent("1/3/2019 17:10:00", false),
					createSunEvent("1/4/2019 06:10:00", true),
					createSunEvent("1/4/2019 17:10:00", false),
					createSunEvent("1/5/2019 06:10:00", true),
					createSunEvent("1/5/2019 17:10:00", false),
					createSunEvent("1/6/2019 06:10:00", true),
					createSunEvent("1/6/2019 17:10:00", false),
				],
				weather: [
					createWeatherEvent("1/1/2019 15:00:00", false, 65, .5, 4),
					createWeatherEvent("1/1/2019 18:00:00", false, 65, .4, 4),
					createWeatherEvent("1/1/2019 21:00:00", false, 65, .4, 4),
					createWeatherEvent("1/2/2019 00:00:00", false, 65, .4, 4),
					createWeatherEvent("1/2/2019 03:00:00", true, 62, .4, 4),
					createWeatherEvent("1/2/2019 06:00:00", true, 62, .4, 4),
					createWeatherEvent("1/2/2019 09:00:00", true, 62, .8, 4),
					createWeatherEvent("1/2/2019 12:00:00", true, 62, .8, 4),
					createWeatherEvent("1/2/2019 15:00:00", true, 62, .8, 5),
					createWeatherEvent("1/2/2019 18:00:00", true, 62, .8, 5),
					createWeatherEvent("1/2/2019 21:00:00", true, 68, .5, 5),
					createWeatherEvent("1/3/2019 00:00:00", true, 68, .5, 5),
					createWeatherEvent("1/3/2019 03:00:00", true, 68, .5, 5),
					createWeatherEvent("1/3/2019 06:00:00", true, 68, .2, 5),
					createWeatherEvent("1/3/2019 09:00:00", true, 68, .2, 5),
					createWeatherEvent("1/3/2019 12:00:00", false, 68, .9, 5),
					createWeatherEvent("1/3/2019 15:00:00", false, 68, .9, 5),
					createWeatherEvent("1/3/2019 18:00:00", false, 68, .9, 3),
					createWeatherEvent("1/3/2019 21:00:00", false, 68, .3, 3),
					createWeatherEvent("1/4/2019 00:00:00", false, 61, .6, 3),
					createWeatherEvent("1/4/2019 03:00:00", false, 61, .6, 3),
					createWeatherEvent("1/4/2019 06:00:00", true, 61, .6, 7),
					createWeatherEvent("1/4/2019 09:00:00", true, 61, .6, 7),
					createWeatherEvent("1/4/2019 12:00:00", true, 61, .6, 7),
					createWeatherEvent("1/4/2019 15:00:00", true, 61, .6, 7),
					createWeatherEvent("1/4/2019 18:00:00", true, 61, .6, 7),
					createWeatherEvent("1/4/2019 21:00:00", true, 61, .6, 7),
					createWeatherEvent("1/5/2019 00:00:00", true, 61, .6, 7),
					createWeatherEvent("1/5/2019 03:00:00", true, 61, .6, 7),
					createWeatherEvent("1/5/2019 06:00:00", true, 61, .6, 7),
					createWeatherEvent("1/5/2019 09:00:00", true, 65, .2, 7),
					createWeatherEvent("1/5/2019 12:00:00", true, 65, .2, 7),
				]
			}
		}
	}
}

function createTideEvent(time: string, isLow: boolean, height: number): TideEvent {
	return { time: new Date(time), isLow, height };
}

function createSunEvent(time: string, isSunrise: boolean): SunEvent {
	return { time: new Date(time), isSunrise };
}

function createWeatherEvent(time: string, isCloudy: boolean, temp: number, chanceRain: number, wind: number): WeatherEvent {
	return {
		time: new Date(time),
		status: isCloudy ? 'cloudy' : "sunny",
		temp: temp,
		tempUnit: 'F',
		chanceRain: chanceRain,
		wind: wind,
		windUnit: 'mph',
		windDirection: 'ENE'
	}
}

// interface Range {
// 	min: number,
// 	max: number
// }
// export function pickFromRange(percent: number, { min, max }: Range): number {
// 	return (max - min) * percent;
// }

// const tideHeightRange: Range = {
// 	min: 1,
// 	max: 12
// };

