import { Info } from "../all/info";
import { AllResponse, AllDailyInfo } from "../all/allResponse";
import { WeatherEvent } from "../weather/weatherEvent";
import { TideEvent } from "../tide/tideEvent";
import { SunEvent } from "../astro/astroEvent";
import { errorIssue } from "../all/issue";


function createInfo(date: Date | null): Info {
	return {
		processingTime: date || new Date(),
		referenceTime: date || new Date()
	}
}

export function getErrorResponse(): AllResponse {
	return {
		info: createInfo(null),
		error: {
			errors: [errorIssue('Could not fetch any data', 'Here is a dev message')]
		},
		data: null
	}
}

const allTides: TideEvent[] = [
	// Past
	createTideEvent("12/31/2018 08:30:00", true, 1),
	createTideEvent("12/31/2018 14:40:00", false, 10.5),
	createTideEvent("12/31/2018 20:30:00", true, 1),

	createTideEvent("1/1/2019 02:40:00", false, 11),

	// Previous / Current
	createTideEvent("1/1/2019 08:00:00", true, 0),

	// Next
	createTideEvent("1/1/2019 14:20:00", false, 11),

	// Chart
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
	createTideEvent("1/6/2019 17:40:00", false, 10.1),
	createTideEvent("1/6/2019 23:40:00", true, 2),

	// Extended
	createTideEvent("1/7/2019 05:20:00", false, 10.1),
	createTideEvent("1/7/2019 11:50:00", true, 1.5),
	createTideEvent("1/7/2019 18:10:00", false, 9.3),
	createTideEvent("1/8/2019 00:20:00", true, 1.1),
	createTideEvent("1/8/2019 06:40:00", false, 11.5),
	createTideEvent("1/8/2019 12:00:00", true, 1.3),
	createTideEvent("1/8/2019 18:35:00", false, 10.1),
	createTideEvent("1/8/2019 23:40:00", true, 1.5),
	createTideEvent("1/9/2019 05:40:00", false, 8.3),
	createTideEvent("1/9/2019 11:20:00", true, 1.1),
	createTideEvent("1/9/2019 17:40:00", false, 10.1),
];

const allSun: SunEvent[] = [
	// Previous / Current (OR OLD), Next
	...createSunEvents("1/1/2019", "06:10:00", "17:10:00"),

	// Chart
	...createSunEvents("1/2/2019", "06:10:00", "17:10:00"),
	...createSunEvents("1/3/2019", "06:10:00", "17:10:00"),
	...createSunEvents("1/4/2019", "06:10:00", "17:10:00"),
	...createSunEvents("1/5/2019", "06:10:00", "17:10:00"),
	...createSunEvents("1/6/2019", "06:10:00", "17:10:00"),

	// Extended
	...createSunEvents("1/7/2019", "06:10:00", "17:10:00"),
	...createSunEvents("1/8/2019", "06:10:00", "17:10:00"),
	...createSunEvents("1/9/2019", "06:10:00", "17:10:00"),
]

const now = new Date("1/1/2019 12:30:00");

const apiResponse: AllResponse = {
	info: createInfo(now),
	error: null,
	data: {
		warning: null,
		current: {
			tides: {
				percentBetweenPrevNext: .71,
				height: 8.0,
				previous: null!, // DYNAMIC - createTideEvent("1/1/2019 8:00:00", true, 0),
				next: null! // DYNAMIC - createTideEvent("1/1/2019 14:20:00", false, 11)
			},
			sun: {
				previous: null!, // DYNAMIC - createSunEvent("1/1/2019 16:10:00", true),
				next: null!, // DYNAMIC - createSunEvent("1/1/2019 17:10:00", false)
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
			cutoffDate: null!,
			tides: {
				minHeight: -1,
				maxHeight: -1,
				events: [],
				// [
				// 	createTideEvent("1/1/2019 14:20:00", false, 11),
				// 	createTideEvent("1/1/2019 20:30:00", true, 1),
				// 	createTideEvent("1/2/2019 02:40:00", false, 10.5),
				// 	createTideEvent("1/2/2019 09:50:00", true, 1),
				// 	createTideEvent("1/2/2019 15:20:00", false, 11.5),
				// 	createTideEvent("1/2/2019 20:10:00", true, 2),
				// 	createTideEvent("1/3/2019 02:30:00", false, 8.9),
				// 	createTideEvent("1/3/2019 08:20:00", true, 0.6),
				// 	createTideEvent("1/3/2019 14:20:00", false, 11),
				// 	createTideEvent("1/3/2019 21:40:00", true, .4),
				// 	createTideEvent("1/4/2019 03:50:00", false, 10.8),
				// 	createTideEvent("1/4/2019 10:10:00", true, 3),
				// 	createTideEvent("1/4/2019 16:00:00", false, 12),
				// 	createTideEvent("1/4/2019 22:10:00", true, 4),
				// 	createTideEvent("1/5/2019 04:10:00", false, 7),
				// 	createTideEvent("1/5/2019 10:40:00", true, 0),
				// 	createTideEvent("1/5/2019 17:20:00", false, 10),
				// 	createTideEvent("1/5/2019 23:30:00", true, 1),
				// 	createTideEvent("1/6/2019 05:40:00", false, 11.5),
				// 	createTideEvent("1/6/2019 11:20:00", true, 1.3),
				// 	createTideEvent("1/6/2019 17:40:00", true, 10.1),
				// ]
			},
			sun: [],
			// [
			// 	createSunEvent("1/1/2019 06:10:00", true),
			// 	createSunEvent("1/1/2019 17:10:00", false),
			// 	createSunEvent("1/2/2019 06:10:00", true),
			// 	createSunEvent("1/2/2019 17:10:00", false),
			// 	createSunEvent("1/3/2019 06:10:00", true),
			// 	createSunEvent("1/3/2019 17:10:00", false),
			// 	createSunEvent("1/4/2019 06:10:00", true),
			// 	createSunEvent("1/4/2019 17:10:00", false),
			// 	createSunEvent("1/5/2019 06:10:00", true),
			// 	createSunEvent("1/5/2019 17:10:00", false),
			// 	createSunEvent("1/6/2019 06:10:00", true),
			// 	createSunEvent("1/6/2019 17:10:00", false),
			// ],
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
			]
		},
		daily: {
			cutoffDate: null!,
			weather: [
				createWeatherEvent("1/1/2019 00:00:00", false, 65, .5, 4),
				createWeatherEvent("1/2/2019 00:00:00", false, 65, .5, 4),
				createWeatherEvent("1/3/2019 00:00:00", false, 65, .4, 4),
				createWeatherEvent("1/4/2019 00:00:00", false, 65, .4, 4),
				createWeatherEvent("1/5/2019 00:00:00", false, 65, .4, 4),
				createWeatherEvent("1/6/2019 00:00:00", true, 62, .4, 4),
				createWeatherEvent("1/7/2019 00:00:00", true, 62, .4, 4),
				createWeatherEvent("1/8/2019 00:00:00", true, 62, .8, 4),
				createWeatherEvent("1/9/2019 00:00:00", true, 62, .8, 4),
			],
			tides: {
				minHeight: -1,
				maxHeight: -1,
			},
			today: null!, // createDaily("1/1/2019", [createTideEvent("1/1/2019 8:00:00", true, 0), createTideEvent("1/1/2019 14:20:00", false, 11), createTideEvent("1/1/2019 20:30:00", true, 1)], createWeatherEvent("1/1/2019 15:00:00", false, 65, .5, 4), [createSunEvent("1/1/2019 06:10:00", true), createSunEvent("1/1/2019 17:10:00", false)]),
			future: [],
			// [
			// 	createDaily("1/2/2019", [createTideEvent("1/2/2019 02:40:00", false, 10.5), createTideEvent("1/2/2019 09:50:00", true, 1), createTideEvent("1/2/2019 15:20:00", false, 11.5), createTideEvent("1/2/2019 20:10:00", true, 2)], createWeatherEvent("1/2/2019 00:00:00", false, 65, .4, 4), [createSunEvent("1/2/2019 06:10:00", true), createSunEvent("1/2/2019 17:10:00", false)]),
			// 	createDaily("1/3/2019", [createTideEvent("1/3/2019 02:30:00", false, 8.9), createTideEvent("1/3/2019 08:20:00", true, 0.6), createTideEvent("1/3/2019 14:20:00", false, 11), createTideEvent("1/3/2019 21:40:00", true, .4)], createWeatherEvent("1/3/2019 00:00:00", true, 68, .5, 5), [createSunEvent("1/3/2019 06:10:00", true), createSunEvent("1/3/2019 17:10:00", false)]),
			// 	createDaily("1/4/2019", [createTideEvent("1/4/2019 03:50:00", false, 10.8), createTideEvent("1/4/2019 10:10:00", true, 3), createTideEvent("1/4/2019 16:00:00", false, 12), createTideEvent("1/4/2019 22:10:00", true, 4)], createWeatherEvent("1/4/2019 00:00:00", false, 61, .6, 3), [createSunEvent("1/4/2019 06:10:00", true), createSunEvent("1/4/2019 17:10:00", false)]),
			// 	createDaily("1/5/2019", [createTideEvent("1/5/2019 04:10:00", false, 7), createTideEvent("1/5/2019 10:40:00", true, 0), createTideEvent("1/5/2019 17:20:00", false, 10), createTideEvent("1/5/2019 23:30:00", true, 1)], createWeatherEvent("1/5/2019 00:00:00", true, 61, .6, 7), [createSunEvent("1/5/2019 06:10:00", true), createSunEvent("1/5/2019 17:10:00", false)]),
			// 	createDaily("1/6/2019", [createTideEvent("1/6/2019 05:40:00", false, 11.5), createTideEvent("1/6/2019 11:20:00", true, 1.3), createTideEvent("1/6/2019 17:40:00", true, 10.1)], createWeatherEvent("1/6/2019 00:00:00", true, 61, .6, 7), [createSunEvent("1/6/2019 06:10:00", true), createSunEvent("1/6/2019 17:10:00", false)]),
			// ]
		}
	}
}

export function getSuccessResponse(): AllResponse {
	return apiResponse;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get previous tide, next tide, all future tides for the next 3 days
// Get previous sun, next sun, all future suns for the next 3 days
// Get "Today" - yesterday's last tide, all tides from today, tomorrow's first tide PLUS today's sun PLUS today's weather
// Get the above for ALL days after today

const shortTermLimitDate = new Date(now);
shortTermLimitDate.setHours(24, 0, 0, 0);
shortTermLimitDate.setDate(shortTermLimitDate.getDate() + 3);
apiResponse.data!.predictions.cutoffDate = shortTermLimitDate;

function getLocalTideEvents(): void {

	const tides = apiResponse.data!.current.tides;

	allTides.some(function (t) {

		if (!tides.previous) {
			tides.previous = t;
		}
		if (tides.previous.time < t.time && t.time < now) {
			tides.previous = t;
		}
		if (!tides.next && t.time > now) {
			tides.next = t;
			return true;
		}
		return false;
	});

	// Go one past so it looks continuous.
	let firstPastLimit = false;
	const shortTermTides = allTides.filter(function (t) {
		if (t.time > now) {
			if (t.time <= shortTermLimitDate) {
				return true;
			}
			if (!firstPastLimit) {
				firstPastLimit = true;
				return true;
			}
		}
		return false;
	});
	apiResponse.data!.predictions.tides.events = shortTermTides;
	let minShortTideHeight: number = Infinity;
	let maxShortTideHeight: number = -Infinity;
	shortTermTides.forEach(function (t) {
		minShortTideHeight = Math.min(minShortTideHeight, t.height);
		maxShortTideHeight = Math.max(maxShortTideHeight, t.height);
	});
	apiResponse.data!.predictions.tides.minHeight = minShortTideHeight;
	apiResponse.data!.predictions.tides.maxHeight = maxShortTideHeight;
}
getLocalTideEvents();

function getLocalSunEvents(): void {
	allSun.some(function (sunEvent) {
		const sun = apiResponse.data!.current.sun;
		if (!sun.previous) {
			sun.previous = sunEvent;
		}

		if (sun.previous.time < sunEvent.time && sunEvent.time < now) {
			sun.previous = sunEvent;
		}
		if (!sun.next && sunEvent.time > now) {
			sun.next = sunEvent;
			return true;
		}
		return false;
	});

	// Go one past so it looks continuous.
	let firstPastLimit = false;
	const shortTermSun = allSun.filter(function (sun) {
		if (sun.time > now && sun.time <= shortTermLimitDate) {
			return true;
		}
		if (!firstPastLimit) {
			firstPastLimit = true;
			return true;
		}
		return false;
	});
	apiResponse.data!.predictions.sun = shortTermSun;
}
getLocalSunEvents();

function beginOfDay(date: Date): Date {
	var begin = new Date(date.getTime());
	begin.setHours(0, 0, 0, 0);
	return begin;
}

let lastDay: Date = null!;
let thisDayEvents: TideEvent[] = []
let days: TideEvent[][] = [];
allTides.forEach(function (tideEvent, i) {
	const thisDay = beginOfDay(tideEvent.time);
	if (!lastDay) {
		lastDay = thisDay;
	}
	if (thisDay.getTime() > lastDay.getTime()) {
		days.push(thisDayEvents);
		thisDayEvents = [tideEvent];
		lastDay = thisDay;
	}
	else if (lastDay.getTime() === thisDay.getTime()) {
		thisDayEvents.push(tideEvent);
		if (i === allTides.length - 1) {
			days.push(thisDayEvents);
		}
	}
});

//console.log(days);
const startIndex = 1;
const endIndex = days.length - 1;

function getDailies() {

	const dailiesMap: { [key: number]: AllDailyInfo } = {};

	for (let i = startIndex; i < endIndex; i++) {
		const day = days[i];
		const dayBefore = days[i - 1];
		const dayAfter = days[i + 1];

		const dayTime = beginOfDay(day[0].time);

		const dailyInfo: AllDailyInfo = {
			date: dayTime,
			tides: [dayBefore[dayBefore.length - 1], ...day, dayAfter[0]],
			sun: [], // done after
			weather: null! // done after
		};

		dailiesMap[dayTime.getTime()] = dailyInfo;
	}

	apiResponse.data!.daily.weather.forEach(function (dailyWeatherEvent) {
		const dayTimeKey = dailyWeatherEvent.time.getTime();
		const daily = dailiesMap[dayTimeKey];
		if (daily) {
			daily.weather = dailyWeatherEvent;
		}
	});

	allSun.forEach(function (sunEvent) {
		const dayTimeKey = beginOfDay(sunEvent.time).getTime();
		const daily = dailiesMap[dayTimeKey];
		if (daily) {
			daily.sun.push(sunEvent);
		}
	});

	const allDailies = Object.values(dailiesMap);
	const [today, ...future] = allDailies;
	apiResponse.data!.daily.today = today;
	apiResponse.data!.daily.future = future;

	let minLongTideHeight: number = Infinity;
	let maxLongTideHeight: number = -Infinity;
	allDailies.forEach(function (d) {
		d.tides.forEach(function (t) {
			minLongTideHeight = Math.min(minLongTideHeight, t.height);
			maxLongTideHeight = Math.max(maxLongTideHeight, t.height);
		});
	});
	apiResponse.data!.daily.tides.minHeight = minLongTideHeight;
	apiResponse.data!.daily.tides.maxHeight = maxLongTideHeight;
}
getDailies();



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createTideEvent(time: string, isLow: boolean, height: number): TideEvent {
	return { time: new Date(time), isLow, height };
}

function createSunEvent(time: string, isSunrise: boolean): SunEvent {
	return { time: new Date(time), isSunrise };
}

function createSunEvents(dateTime: string, sunriseTime: string, sunsetTime: string): [SunEvent, SunEvent] {
	return [createSunEvent(`${dateTime} ${sunriseTime}`, true), createSunEvent(`${dateTime} ${sunsetTime}`, false)];
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


// function createDaily(dayTime: string, tideEvents: TideEvent[], weatherEvent: WeatherEvent, sunEvents: SunEvent[]): AllDailyInfo {
// 	return {
// 		date: new Date(`${dayTime} 00:00:00`),
// 		tides: tideEvents,
// 		weather: weatherEvent,
// 		sun: sunEvents
// 	};
// }

