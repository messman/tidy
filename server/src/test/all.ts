import { Info, AllResponse, errorIssue, AllResponseData, TideEvent, TideStatus } from 'tidy-shared';
import { APIConfigurationContext } from '../context';
import { interpretTides } from '../tide/tide-interpret';
import { randomizer } from './randomize';
import { DateTime } from 'luxon';

export function success(configContext: APIConfigurationContext): AllResponse {

	const [pastTideEvents, currentTideStatus, futureTideEvents] = createTideData(configContext);
	const interpretedTides = interpretTides(configContext, pastTideEvents, currentTideStatus, futureTideEvents);

	const data: AllResponseData = {
		warning: null!,
		current: {
			sun: null!,
			weather: null!,
			tides: interpretedTides.currentTides
		},
		predictions: {
			cutoffDate: configContext.context.maxShortTermDataFetch.toJSDate(),
			sun: null!,
			weather: null!,
			tides: interpretedTides.shortTermTides
		},
		daily: {
			cutoffDate: configContext.context.maxLongTermDataFetch.toJSDate(),
			tideExtremes: interpretedTides.longTermTideExtremes,
			days: interpretedTides.longTermTides.map((r) => {
				return {
					tides: r,
					date: r.events[0].time,
					sun: null!,
					weather: null!
				}
			})
		}
	};

	return {
		info: createInfo(configContext),
		error: null,
		data: data
	};
}

export function failure(configContext: APIConfigurationContext): AllResponse {
	return {
		info: createInfo(configContext),
		error: {
			errors: [errorIssue('Could not fetch any data', 'Here is a dev message')]
		},
		data: null
	};
}

function createInfo(configContext: APIConfigurationContext): Info {
	return {
		referenceTime: configContext.configuration.time.referenceTime,
		processingTime: new Date(),
		tideHeightPrecision: configContext.configuration.tides.tideHeightPrecision
	}
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

// tide height highs (random) - 6 to 9
// tide height lows (random) - 0 to 2.5
// tide time high/low (random) - 5.6 hours to 6.5 hours
// sunrise (function) - ([5:30,7] to [5:30,7]) - linear
// sunset (function) - ([18,19] to [18,19]) - linear
// weather time (function) - always 3 apart
// weather type (function) - polynomial 
// weather temp (function) - polynomial
// weather precip (function) - polynomial
// weather wind (function) - polynomial
// weather wind direction (function) - polynomial

function createTideData(configContext: APIConfigurationContext): [TideEvent[], TideStatus, TideEvent[]] {

	const tideRandomizer = randomizer('_tide_');

	// Get our time between highs and lows.
	// Between 5.6 hours and 6.5 hours
	const minTimeBetweenHighLowMinutes = 5.8 * 60;
	const maxTimeBetweenHighLowMinutes = 6.3 * 60;
	const tideHeightPrecision = configContext.configuration.tides.tideHeightPrecision;

	let startDateTime = configContext.context.tides.minimumTidesDataFetch;
	const endDateTime = configContext.context.maxLongTermDataFetch;

	const eventTimes: DateTime[] = [startDateTime];
	while (startDateTime < endDateTime) {
		const minutesPassed = tideRandomizer.randomInt(minTimeBetweenHighLowMinutes, maxTimeBetweenHighLowMinutes, true);
		startDateTime = startDateTime.plus({ minutes: minutesPassed });
		eventTimes.push(startDateTime);
	}

	const referenceTime = configContext.context.referenceTimeInZone;
	const startHighOrLowOffset = tideRandomizer.randomInt(0, 1, true);
	const previousEvents: TideEvent[] = [];
	const futureEvents: TideEvent[] = [];
	eventTimes.forEach((time, index) => {

		const isLow = (index + startHighOrLowOffset) % 2 === 0;
		// Low: [0, 2.5]
		// High: [6, 9]
		const height = isLow ? tideRandomizer.randomFloat(0, 2.5, tideHeightPrecision, true) : tideRandomizer.randomFloat(6, 9, tideHeightPrecision, true);

		const event: TideEvent = {
			time: time.toJSDate(),
			isLow: isLow,
			height: height
		};

		if (time < referenceTime) {
			previousEvents.push(event);
		}
		else if (time >= referenceTime) {
			futureEvents.push(event);
		}
	});

	const currentStatus: TideStatus = {
		height: 0,
		time: new Date()
	};

	return [previousEvents, currentStatus, futureEvents];
}