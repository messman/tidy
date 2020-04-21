import { IterableData } from "../util/iterator";


export interface IntermediateWeatherValues {
	temperature: IterableData<number>[],
	apparentTemperature: IterableData<number>[],
	probabilityOfPrecipitation: IterableData<number>[],
	windDirection: IterableData<string>[],
	windSpeed: IterableData<number>[],
	dewPoint: IterableData<number>[],
	cloudCover: IterableData<number>[],
	visibility: IterableData<number>[],

	icon: IterableData<string>[]
}