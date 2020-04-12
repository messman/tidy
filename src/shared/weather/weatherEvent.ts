export interface WeatherEvent {
	/** Time of the weather event. */
	time: Date,
	/** The desciption of the weather at the time. */
	status: 'cloudy' | 'raining' | 'sunny',
	/** The temperature. */
	temp: number,
	/* Unit for temperature. */
	tempUnit: 'F' | 'C',
	/** The chance for rain, as a percentage, between 0 and 1. */
	chanceRain: number,
	/** The wind speed. */
	wind: number,
	/* Unit for wind speed. */
	windUnit: 'mph' | 'knots',
	/** The wind direction. */
	windDirection: string
}