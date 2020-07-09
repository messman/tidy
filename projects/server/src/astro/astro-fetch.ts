import { DateTime } from 'luxon';
import { SunEvent } from 'tidy-shared';
import { APIConfigurationContext } from '../all/context';
import { RunFlags } from '../util/run-flags';
import { IntermediateAstroValues } from './astro-intermediate';

/*
	For now, while we are only supporting sunrise / sunset, we do the calculation manually without the assistance of an API.
	This calculation is derived from the NOAA Solar Calculator (https://www.esrl.noaa.gov/gmd/grad/solcalc/)

	If we need an API, consider https://sunrise-sunset.org/api (free) or time-and-date (paid)


	Concepts in the below code:
	- Julian Day: days since noon, Jan 1, 4713 BC on the Julian calendar

*/

export async function fetchAstro(configContext: APIConfigurationContext, _: RunFlags): Promise<IntermediateAstroValues> {

	const { latitude, longitude } = configContext.configuration.location;
	const startDay = configContext.context.astro.minimumSunDataFetch;
	const endDay = configContext.context.maxLongTermDataFetch;
	const daysBetween = endDay.diff(startDay, 'days').days;

	const sunEvents: SunEvent[] = [];

	for (let i = 0; i < daysBetween; i++) {
		const day = startDay.plus({ days: i });
		const daySunEvents = getSunEventsForDay(day, latitude, longitude);
		sunEvents.push(...daySunEvents);
	}
	return {
		errors: null,
		warnings: null,
		sunEvents: sunEvents
	};
}

function getSunEventsForDay(day: DateTime, latitude: number, longitude: number): SunEvent[] {
	const julianDay = getJulianDay(day);
	const timezoneOffset = day.offset / 60; // To get hours

	const rise = getSunriseSunset(true, julianDay, latitude, longitude, timezoneOffset);
	const sunriseEvent = createSunEventFromOutput(true, day, julianDay, rise);

	const set = getSunriseSunset(false, julianDay, latitude, longitude, timezoneOffset);
	const sunsetEvent = createSunEventFromOutput(false, day, julianDay, set);

	return [sunriseEvent, sunsetEvent];
}

function createSunEventFromOutput(isSunrise: boolean, day: DateTime, julianDay: number, output: SunriseSunsetOutput): SunEvent {
	const dayOffset = output.julianDay - julianDay;
	return {
		isSunrise: isSunrise,
		time: day.plus({ days: dayOffset, minutes: output.localMinutes })
	};
}

// Original: getJD
function getJulianDay(date: DateTime): number {
	let { day, month, year } = date;
	if (month <= 2) {
		year -= 1;
		month += 12;
	}
	const A = Math.floor(year / 100);
	const B = 2 - A + Math.floor(A / 4);
	const julianDay = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;

	return julianDay;
}

interface SunriseSunsetOutput {
	julianDay: number,
	localMinutes: number,
	azimuth: number;
}

// Original: calcSunriseSet
function getSunriseSunset(isSunrise: boolean, julianDay: number, latitude: number, longitude: number, timezoneOffset: number): SunriseSunsetOutput {

	const timeUTC = getSunriseSunsetUTC(isSunrise, julianDay, latitude, longitude);
	const newTimeUTC = getSunriseSunsetUTC(isSunrise, julianDay + (timeUTC / 1440.0), latitude, longitude);
	let finalJulianDay: number = null!;
	let timeLocal: number = null!;
	let azimuth: number = null!;

	if (isNumber(newTimeUTC)) {
		timeLocal = newTimeUTC + (timezoneOffset * 60.0);
		const riseT = calcTimeJulianCent(julianDay + newTimeUTC / 1440.0);
		const riseAzEl = calcAzEl(riseT, timeLocal, latitude, longitude, timezoneOffset);
		azimuth = riseAzEl.azimuth;
		finalJulianDay = julianDay;
		if ((timeLocal < 0.0) || (timeLocal >= 1440.0)) {
			const increment = ((timeLocal < 0) ? 1 : -1);
			while ((timeLocal < 0.0) || (timeLocal >= 1440.0)) {
				timeLocal += increment * 1440.0;
				finalJulianDay -= increment;
			}
		}
	}
	else { // no sunrise/set found

		azimuth = -1.0;
		timeLocal = 0.0;
		const doy = calcDoyFromJD(julianDay);
		if (((latitude > 66.4) && (doy > 79) && (doy < 267)) ||
			((latitude < -66.4) && ((doy < 83) || (doy > 263)))) {
			//previous sunrise/next sunset
			finalJulianDay = calcJDofNextPrevRiseSet(!isSunrise, isSunrise, julianDay, latitude, longitude, timezoneOffset);
		} else {   //previous sunset/next sunrise
			finalJulianDay = calcJDofNextPrevRiseSet(isSunrise, isSunrise, julianDay, latitude, longitude, timezoneOffset);
		}
	}

	return {
		julianDay: finalJulianDay,
		localMinutes: timeLocal,
		azimuth: azimuth
	};
}

// Original: calcSunriseSetUTC
function getSunriseSunsetUTC(isSunrise: boolean, julianDay: number, latitude: number, longitude: number) {
	const t = calcTimeJulianCent(julianDay);
	const eqTime = calcEquationOfTime(t);
	const solarDec = calcSunDeclination(t);
	let hourAngle = calcHourAngleSunrise(latitude, solarDec);
	if (!isSunrise) {
		hourAngle = -hourAngle;
	}
	const delta = longitude + radToDeg(hourAngle);
	const timeUTC = 720 - (4.0 * delta) - eqTime; // in minutes
	return timeUTC;
}

function calcTimeJulianCent(julianDay: number) {
	return (julianDay - 2451545.0) / 36525.0;
}

function isLeapYear(year: number) {
	return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0);
}

function calcDateFromJD(jd: number) {
	var z = Math.floor(jd + 0.5);
	var f = (jd + 0.5) - z;
	if (z < 2299161) {
		var A = z;
	} else {
		const alpha = Math.floor((z - 1867216.25) / 36524.25);
		var A = z + 1 + alpha - Math.floor(alpha / 4);
	}
	var B = A + 1524;
	var C = Math.floor((B - 122.1) / 365.25);
	var D = Math.floor(365.25 * C);
	var E = Math.floor((B - D) / 30.6001);
	var day = B - D - Math.floor(30.6001 * E) + f;
	var month = (E < 14) ? E - 1 : E - 13;
	var year = (month > 2) ? C - 4716 : C - 4715;

	return { "year": year, "month": month, "day": day };
}

function calcDoyFromJD(jd: number) {
	var date = calcDateFromJD(jd);

	var k = (isLeapYear(date.year) ? 1 : 2);
	var doy = Math.floor((275 * date.month) / 9) - k * Math.floor((date.month + 9) / 12) + date.day - 30;

	return doy;
}


function radToDeg(angleRad: number) {
	return (180.0 * angleRad / Math.PI);
}

function degToRad(angleDeg: number) {
	return (Math.PI * angleDeg / 180.0);
}

function calcGeomMeanLongSun(t: number) {
	var L0 = 280.46646 + t * (36000.76983 + t * (0.0003032));
	while (L0 > 360.0) {
		L0 -= 360.0;
	}
	while (L0 < 0.0) {
		L0 += 360.0;
	}
	return L0;		// in degrees
}

function calcGeomMeanAnomalySun(t: number) {
	var M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
	return M;		// in degrees
}

function calcEccentricityEarthOrbit(t: number) {
	var e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
	return e;		// unit-less
}

function calcSunEqOfCenter(t: number) {
	var m = calcGeomMeanAnomalySun(t);
	var mrad = degToRad(m);
	var sinm = Math.sin(mrad);
	var sin2m = Math.sin(mrad + mrad);
	var sin3m = Math.sin(mrad + mrad + mrad);
	var C = sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin2m * (0.019993 - 0.000101 * t) + sin3m * 0.000289;
	return C;		// in degrees
}

function calcSunTrueLong(t: number) {
	var l0 = calcGeomMeanLongSun(t);
	var c = calcSunEqOfCenter(t);
	var O = l0 + c;
	return O;		// in degrees
}

function calcSunApparentLong(t: number) {
	var o = calcSunTrueLong(t);
	var omega = 125.04 - 1934.136 * t;
	var lambda = o - 0.00569 - 0.00478 * Math.sin(degToRad(omega));
	return lambda;		// in degrees
}

function calcMeanObliquityOfEcliptic(t: number) {
	var seconds = 21.448 - t * (46.8150 + t * (0.00059 - t * (0.001813)));
	var e0 = 23.0 + (26.0 + (seconds / 60.0)) / 60.0;
	return e0;		// in degrees
}

function calcObliquityCorrection(t: number) {
	var e0 = calcMeanObliquityOfEcliptic(t);
	var omega = 125.04 - 1934.136 * t;
	var e = e0 + 0.00256 * Math.cos(degToRad(omega));
	return e;		// in degrees
}

// function calcSunRtAscension(t) {
// 	var e = calcObliquityCorrection(t);
// 	var lambda = calcSunApparentLong(t);
// 	var tananum = (Math.cos(degToRad(e)) * Math.sin(degToRad(lambda)));
// 	var tanadenom = (Math.cos(degToRad(lambda)));
// 	var alpha = radToDeg(Math.atan2(tananum, tanadenom));
// 	return alpha;		// in degrees
// }

function calcSunDeclination(t: number) {
	var e = calcObliquityCorrection(t);
	var lambda = calcSunApparentLong(t);
	var sint = Math.sin(degToRad(e)) * Math.sin(degToRad(lambda));
	var theta = radToDeg(Math.asin(sint));
	return theta;		// in degrees
}

function calcEquationOfTime(t: number) {
	var epsilon = calcObliquityCorrection(t);
	var l0 = calcGeomMeanLongSun(t);
	var e = calcEccentricityEarthOrbit(t);
	var m = calcGeomMeanAnomalySun(t);

	var y = Math.tan(degToRad(epsilon) / 2.0);
	y *= y;

	var sin2l0 = Math.sin(2.0 * degToRad(l0));
	var sinm = Math.sin(degToRad(m));
	var cos2l0 = Math.cos(2.0 * degToRad(l0));
	var sin4l0 = Math.sin(4.0 * degToRad(l0));
	var sin2m = Math.sin(2.0 * degToRad(m));

	var Etime = y * sin2l0 - 2.0 * e * sinm + 4.0 * e * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;
	return radToDeg(Etime) * 4.0;	// in minutes of time
}

function calcHourAngleSunrise(lat: number, solarDec: number) {
	var latRad = degToRad(lat);
	var sdRad = degToRad(solarDec);
	var HAarg = (Math.cos(degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));
	var HA = Math.acos(HAarg);
	return HA;		// in radians (for sunset, use -HA)
}

function isNumber(inputVal: string | number) {
	var oneDecimal = false;
	var inputStr = "" + inputVal;
	for (var i = 0; i < inputStr.length; i++) {
		var oneChar = inputStr.charAt(i);
		if (i == 0 && (oneChar == "-" || oneChar == "+")) {
			continue;
		}
		if (oneChar == "." && !oneDecimal) {
			oneDecimal = true;
			continue;
		}
		if (oneChar < "0" || oneChar > "9") {
			return false;
		}
	}
	return true;
}

function calcRefraction(elev: number) {

	if (elev > 85.0) {
		var correction = 0.0;
	} else {
		var te = Math.tan(degToRad(elev));
		if (elev > 5.0) {
			var correction = 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te);
		} else if (elev > -0.575) {
			var correction = 1735.0 + elev * (-518.2 + elev * (103.4 + elev * (-12.79 + elev * 0.711)));
		} else {
			var correction = -20.774 / te;
		}
		correction = correction / 3600.0;
	}

	return correction;
}

function calcAzEl(T: number, localtime: number, latitude: number, longitude: number, zone: number) {

	var eqTime = calcEquationOfTime(T);
	var theta = calcSunDeclination(T);

	var solarTimeFix = eqTime + 4.0 * longitude - 60.0 * zone;
	var trueSolarTime = localtime + solarTimeFix;
	while (trueSolarTime > 1440) {
		trueSolarTime -= 1440;
	}
	var hourAngle = trueSolarTime / 4.0 - 180.0;
	if (hourAngle < -180) {
		hourAngle += 360.0;
	}
	var haRad = degToRad(hourAngle);
	var csz = Math.sin(degToRad(latitude)) * Math.sin(degToRad(theta)) + Math.cos(degToRad(latitude)) * Math.cos(degToRad(theta)) * Math.cos(haRad);
	if (csz > 1.0) {
		csz = 1.0;
	} else if (csz < -1.0) {
		csz = -1.0;
	}
	var zenith = radToDeg(Math.acos(csz));
	var azDenom = (Math.cos(degToRad(latitude)) * Math.sin(degToRad(zenith)));
	if (Math.abs(azDenom) > 0.001) {
		var azRad = ((Math.sin(degToRad(latitude)) * Math.cos(degToRad(zenith))) - Math.sin(degToRad(theta))) / azDenom;
		if (Math.abs(azRad) > 1.0) {
			if (azRad < 0) {
				azRad = -1.0;
			} else {
				azRad = 1.0;
			}
		}
		var azimuth = 180.0 - radToDeg(Math.acos(azRad));
		if (hourAngle > 0.0) {
			azimuth = -azimuth;
		}
	} else {
		if (latitude > 0.0) {
			var azimuth = 180.0;
		} else {
			var azimuth = 0.0;
		}
	}
	if (azimuth < 0.0) {
		azimuth += 360.0;
	}
	var exoatmElevation = 90.0 - zenith;

	// Atmospheric Refraction correction
	var refractionCorrection = calcRefraction(exoatmElevation);

	var solarZen = zenith - refractionCorrection;
	var elevation = 90.0 - solarZen;

	return { "azimuth": azimuth, "elevation": elevation };
}


function calcJDofNextPrevRiseSet(isNext: boolean, isSunrise: boolean, JD: number, latitude: number, longitude: number, tz: number) {

	var julianday = JD;
	var increment = ((isNext) ? 1.0 : -1.0);
	var time = getSunriseSunsetUTC(isSunrise, julianday, latitude, longitude);

	while (!isNumber(time)) {
		julianday += increment;
		time = getSunriseSunsetUTC(isSunrise, julianday, latitude, longitude);
	}
	var timeLocal = time + tz * 60.0;
	while ((timeLocal < 0.0) || (timeLocal >= 1440.0)) {
		var incr = ((timeLocal < 0) ? 1 : -1);
		timeLocal += (incr * 1440.0);
		julianday -= incr;
	}

	return julianday;
}
