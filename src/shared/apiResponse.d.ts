export interface APIResponse<TDate> {
	/** Info about the request. */
	info: RInfo<TDate>,
	/** Error information about the request. Null if no errors. */
	error: RError,
	/** Success information - the response data. Null if errors.  */
	success: RSuccess<TDate>
}

export interface RInfo<TDate> {
	/** Time the request was processed on the server. */
	time: TDate
}

export interface RError {
	/** Errors. Should never be null. */
	errors: Issue[]
}

export enum IssueLevel {
	warning,
	error
}

export interface Issue {
	level: IssueLevel,
	/** A user-safe message string. */
	userMessage: string,
	dev: {
		/** A dev message string (still only user-safe info, just technical). */
		message: string,
		/** dev data for debugging. */
		data: {}
	}
}

export interface RSuccess<TDate> {
	/** Warnings. Null if no warnings. */
	warning: RWarning,
	/** Information about the current state of the location. */
	current: RSuccessCurrent<TDate>,
	/** Prediction data for the location. */
	predictions: RSuccessPredictions<TDate>,
	/** Daily-view information for the location. */
	daily: RSuccessDaily<TDate>
}

export interface RWarning {
	/** Warnings. Should not be null. */
	warnings: Issue[]
}

export interface RSuccessCurrent<TDate> {
	/** Current data about the tides. */
	tides: {
		/** The percent height of the water level between the high and low. 1 means high, 0 means low. */
		percentBetweenPrevNext: number,
		/** The height, in feet. */
		height: number,
		/** The previous tide event, which may also be the current tide event. */
		previous: TideEvent<TDate>,
		/** The next tide event. */
		next: TideEvent<TDate>
	},
	/** Current data about the sunrise/sunset. */
	sun: {
		/** The previous sun event relative to now. */
		previous: SunEvent<TDate>,
		/** The next sun event relative to now. */
		next: SunEvent<TDate>
	},
	/** The current weather information. */
	weather: WeatherEvent<TDate>
}

export interface RSuccessPredictions<TDate> {
	/** The cutoff date for all events in this area. Data may go past this point; implementations should check. Date will be an exact time. */
	cutoffDate: TDate,
	/** Predictions for tides. */
	tides: {
		/** The min height amongst all provided predictions. */
		minHeight: number,
		/** The max height amongst all provided predictions. */
		maxHeight: number,
		/** Tide prediction events - does not include previous/current, but does include next. Purposefully goes one past cutoff date for graph continuity. */
		events: TideEvent<TDate>[],
	}
	/** Predictions for sun events.  */
	sun: SunEvent<TDate>[],
	/** Predictions for weather events. */
	weather: WeatherEvent<TDate>[]
}

export interface RSuccessDaily<TDate> {
	/** The cutoff date for all events in this area. Data may go past this point; implementations should check. Date will be an exact time.  */
	cutoffDate: TDate,
	/** Weather events, one per day. */
	weather: WeatherEvent<TDate>[],
	/** Metadata for tides provided in 'today' and 'future'. */
	tides: {
		/** min height amongst all tide events. */
		minHeight: number,
		/** max height amongst all tide events. */
		maxHeight: number,
	}
	/** Information specific to today. */
	today: DailyInfo<TDate>,
	/** Information for each day past today. */
	future: DailyInfo<TDate>[]
}

export interface TideEvent<TDate> {
	/** The time of the event. */
	time: TDate,
	/** Whether the tide was low or not. */
	isLow: boolean,
	/** The height, in feet. */
	height: number
}

export interface SunEvent<TDate> {
	/** The time of the sun event. */
	time: TDate,
	/** Whether or not the event is a sunrise (otherwise, it's a sunset). */
	isSunrise: boolean
}

export interface WeatherEvent<TDate> {
	/** Time of the weather event. */
	time: TDate,
	/** The desciption of the weather at the time. */
	status: 'cloudy' | 'raining' | 'sunny',
	/** The temperature. */
	temp: number,
	/** The chance for rain, as a percentage, between 0 and 1. */
	chanceRain: number,
	/** The wind speed. */
	wind: number,
	/** The wind direction. */
	windDirection: string
}

export interface DailyInfo<TDate> {
	/** The date. A day, but not a specific time. */
	date: TDate,
	/** The weather event to describe the day. */
	weather: WeatherEvent<TDate>,
	/** Tide events for the day - includes events on the day before and the day after for continuity. */
	tides: TideEvent<TDate>[],
	/** Sun events specific to the day. */
	sun: SunEvent<TDate>[]
}