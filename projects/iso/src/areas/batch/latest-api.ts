import { DateTime } from 'luxon';
import { ApiRoute, BaseApiRequest, BaseApiResponse } from '../../api/request-response';
import { SunEvent } from '../astro/astro-event';
import { CurrentTides, TideEventRange } from '../tide/tide-event';
import { WeatherStatus } from '../weather/weather-status';
import { Daily } from './latest-iso';

export namespace Batch {
	export namespace Latest {
		export type Route = ApiRoute<Request, Response>;
		export interface Request extends BaseApiRequest<null, null, null> { }

		export interface Response extends BaseApiResponse {
			/** Info about the request. */
			meta: Meta,
			/** Information about the current state of the location. */
			current: Current,
			/** Prediction data for the location. */
			predictions: Predictions,
			/** Daily-view information for the location. */
			daily: Daily;
		}
	}

	export interface Meta {
		/** Time the request was processed on the server. */
		processingTime: DateTime,
		/** Matches to the configuration reference time. */
		referenceTime: DateTime,
		/** Time zone of all dates. */
		timeZone: string,
		/** Digits after the decimal for tide height. */
		tideHeightPrecision: number,
	}

	export interface Current {
		/** Current data about the tides. */
		tides: CurrentTides,
		/** Current data about the sunrise/sunset. */
		sun: {
			/** The previous astro sun event relative to now. */
			previous: SunEvent,
			/** The next astro sun event relative to now. */
			next: SunEvent;
		},
		/** The current weather information. */
		weather: WeatherStatus;
	}

	export interface Predictions {
		/** The cutoff date for all events in this area. Data may go past this point; implementations should check. Date will be an exact time. */
		cutoffDate: DateTime,
		/** Predictions for tides. */
		tides: TideEventRange;
		/** Predictions for sun events.  */
		sun: SunEvent[],
		/** Predictions for weather events. */
		weather: WeatherStatus[];
	}
}