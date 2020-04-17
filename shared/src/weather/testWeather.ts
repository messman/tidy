import { WeatherEvent } from './weatherEvent';

export function createWeatherEvent(time: Date, isCloudy: boolean, temp: number, chanceRain: number, wind: number): WeatherEvent {
	return {
		time: time,
		status: isCloudy ? 'cloudy' : 'sunny',
		temp: temp,
		tempUnit: 'F',
		chanceRain: chanceRain,
		wind: wind,
		windUnit: 'mph',
		windDirection: 'ENE'
	}
}