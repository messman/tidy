import { DateTime } from 'luxon';
import { constant, isServerError, TidePointExtreme } from '@wbtdevlocal/iso';
import { serverErrors, ServerPromise } from '../../api/error';
import { BaseConfig } from '../config';
import { LogContext } from '../logging/pino';
import { makeRequestAscii } from '../network/request';
import { createTidePointExtremeId } from './tide-shared';

/*
	The GoMOFS System 

	Our traditional method of getting tidal information includes getting information from NOAA's observation API:
	- Getting the list of official listed HI/LO tides for the time before and after our date
	- Getting a reading of the current water level

	The problem with that is:
	- The current water level reading is 6-15 minutes behind, and hard to rely on
	- The Wells station no longer provides water level reading, so it would be the Portland value (which is not the same)
	- The official listed HI/LO tides do not account for wind, weather, etc
		More info on this from https://tidesandcurrents.noaa.gov/ofs/gomofs/gomofs.html:
		"
			For decades, mariners in the United States have depended on NOAA's Tide Tables for the best estimate of
			expected water levels. These tables provide accurate predictions of the astronomical tide (i.e., the
			change in water level due to the gravitational effects of the moon and sun and the rotation of the Earth);
			however, they cannot predict water-level changes due to wind, atmospheric pressure, and river flow,
			which are often significant.
		"
	
	By using GoMOFS (Gulf of Maine Operational Forecast System), we can (hopefully) get better accuracy from our water level reading and
	our tide high/low values even though they are computer-generated values.


	How it works:

	There's a "nowcast" and a "forecast" generated 4x per day. The forecast goes out to 72 hours into the future.
	We will find the most recent forecast from the past and then fast-forward to our time.

	The data comes to us as 6-minute intervals of water level. We'll have to figure out high/low/current from that.

	The data is not constructed to be easily consumed as JSON web API data. It's in the "NC" NetCDF format, which is mostly
	for data modeling. Typically it would be read as binary data, I guess.

	Luckily for us, one of the servers provides a UI for selecting out pieces of the data to be returned in easily-parsable ASCII
	(plain text). We can transform it into the data we care about. 


	Resources:

	- NOAA GoMOFS home page: https://tidesandcurrents.noaa.gov/ofs/gomofs/gomofs.html
		- More info page: https://tidesandcurrents.noaa.gov/ofs/gomofs/gomofs_info.html
		- About what it is based on, ROMS: https://en.wikipedia.org/wiki/Regional_Ocean_Modeling_System
		- Wells page: https://tidesandcurrents.noaa.gov/ofs/ofs_station.html?stname=Wells&ofs=gom&stnid=8419317&subdomain=0
		- Portland page: https://tidesandcurrents.noaa.gov/ofs/ofs_station.html?stname=Portland&ofs=gom&stnid=8418150&subdomain=0
			- Shows comparison of the OFS data to the actual observations!
			- From this we can see that the OFS forecast data is typically dead-on in the middle 70%, but can sometimes be too extreme on the extremes.
				Highs are usually a bit above the stated high, but wthe forecast will sometimes add on even more to the high than that.
				Lows are more muted.
	- The THREDDS server that holds the data: https://opendap.co-ops.nos.noaa.gov/thredds/catalog/NOAA/GOMOFS/MODELS/catalog.html
		- Example catalog for a day: https://opendap.co-ops.nos.noaa.gov/thredds/catalog/NOAA/GOMOFS/MODELS/2023/09/24/catalog.html?dataset=NOAA/GOMOFS/MODELS/2023/09/24/nos.gomofs.stations.forecast.20230924.t00z.nc
			- Choose "nos.gomofs.stations.forecast.______" to get to the forecast entry.
		- Example forecast entry: https://opendap.co-ops.nos.noaa.gov/thredds/catalog/NOAA/GOMOFS/MODELS/2023/09/24/catalog.html?dataset=NOAA/GOMOFS/MODELS/2023/09/24/nos.gomofs.stations.forecast.20230924.t00z.nc
			- Choose the link beside "OPENDAP" to get to the HTML tool.
		- Example HTML tool for an entry: https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/GOMOFS/MODELS/2023/09/24/nos.gomofs.stations.forecast.20230924.t00z.nc.html
			- Click the checkbox next to a data type to mark that data to be returned.
			- When you see "0:1:126", that means "[startIndex]:[step]:[length]": so "give me each 1 of between index 0 and index 125 (126 things)"; so "4:1:4" means "give me each 1 between index 4 and index 4 (1 thing)"


	Other notes:
	- You can compare against https://cdmo.baruch.sc.edu//pwa/index.html?stationCode=WELINWQ, which has observational data from the estuary.
	- For going between MLLW and other measurements for water level: https://tidesandcurrents.noaa.gov/datums.html?id=8419317
	- About nowcast / forecast with GoMOFS:
		- nowcast is for 6 hours, which makes sense since the next nowcast will arrive at the end of those 6 hours, so you always have a "now"
			for 2023-09-22 00:00:00, first was 2.437128E8 (2023-09-21 18:00:00), last was 2.437344E8 (2023-09-22 00:00:00); updates 6 minutes apart.
			So it's the last 6 hours, 6 minutes apart.
		-  forecast has the same dataset types as nowcast, except ocean_time is much longer: 72 hours. 
			for 2023-09-22 00:00:00, first was 2.437344E8 (2023-09-22 00:00:00), last was 2.439936E8 (2023-09-25 00:00:00); also 6 minutes apart.
			So it's the next 72 hours, 6 minutes apart.


	Sample of returned data:

	Dataset {
		Float64 lon_rho[station = 126];
		Float64 lat_rho[station = 126];
	} NOAA/GOMOFS/MODELS/2023/09/20/nos.gomofs.stations.forecast.20230920.t18z.nc;
	---------------------------------------------
	lon_rho[126]
	-66.942022325, -67.1953163, -68.20549009999999, -70.209506975, -70.55615997500001, -70.70682335, -71.01374055, -69.941268925, -70.67153355, -70.77109145, -70.10110664999999, 1.0E37, 1.0E37, -66.942022325, -67.1953163, -68.20549009999999, -70.209506975, -70.55615997500001, -71.03917885, -70.67644885, -70.10110664999999, 1.0E37, -70.5643444, -70.4253578, -69.35647965, -68.99869155, -68.111175525, -67.615856175, -65.90480805000001, -71.11997794999999, -71.02762795000001, -70.67141725, -70.67153355, -70.64943885, -70.571785, -70.4178276, -70.17131045, -70.1465168, -70.1465168, -70.09479139999999, -69.6263981, -69.360561375, -69.250461575, -69.130052575, -69.002758, -68.20549009999999, -68.107406625, -67.88546372500001, -67.30900765, -67.1953163, -66.942022325, -66.6008282, -65.927814475, 1.0E37, -67.1796131, -67.309276575, -67.8465767, -68.18991659999999, -68.4401665, -68.6040287, -68.80705835, -68.80705835, 1.0E37, -68.892719275, -69.77279854999999, 1.0E37, -70.201908125, -70.3321495, -70.37117384999999, -70.6984844, -70.71015739999999, -70.807209025, -70.769645675, -70.61053085, 1.0E37, -70.8544769, -70.95158769999999, -70.88757325, -70.96068385000001, -70.708581925, -70.64028357499998, -70.16631890000001, -70.6640358, -70.6648064, -70.49143980000001, -70.15187452500001, 1.0E37, -70.70612335, -70.712615975, -69.9446106, -70.05307962500001, -70.7997322, -70.29529575000001, -70.65457915, -70.89403150000001, -69.9946518, -70.92792130000001, -70.67153355, -70.761642475, -70.5869217, -70.5511532, -70.92896845, -70.8501339, -70.72494125, -70.5000038, 1.0E37, -71.18834875, 1.0E37, 1.0E37, 1.0E37, 1.0E37, 1.0E37, 1.0E37, 1.0E37, -71.45525359999999, -71.4895649, -71.76013375, -71.5508385, -71.5735874, -71.588071825, -71.617010125, -70.83008575000001, -69.85131835, -66.27776717500001, -61.264434825, -62.077562349999994

	lat_rho[126]
	44.94107244999999, 44.65554525, 44.387898449999994, 43.626993175, 43.315724374999995, 43.06029795, 42.342561725, 41.677501649999996, 41.511686299999994, 41.36173345, 41.202785500000005, 1.0E37, 1.0E37, 44.94107244999999, 44.65554525, 44.387898449999994, 43.626993175, 43.315724374999995, 42.32473945, 41.53124715, 41.202785500000005, 1.0E37, 42.521072399999994, 43.1816206, 43.71147155, 44.0551796, 44.10503005, 43.51288795, 42.33113195, 40.98251342499999, 42.3223343, 41.44687365, 41.511686299999994, 42.349311799999995, 42.51802255, 43.184658049999996, 42.803063375, 43.530138975, 43.530138975, 41.298715574999996, 42.127404225, 43.717017150000004, 40.50135325, 43.201061249999995, 44.06073765, 44.387898449999994, 44.113483425, 43.483341225000004, 44.2852726, 44.65554525, 44.94107244999999, 41.105028149999995, 42.30894185, 1.0E37, 44.6471157, 44.6359463, 44.519474974999994, 44.393644325000004, 44.18061065, 44.175928125, 44.46837425, 44.46837425, 1.0E37, 44.166425724999996, 43.7420435, 1.0E37, 43.630013475000005, 43.5278778, 43.4620018, 43.049294450000005, 43.051738699999994, 42.81752015, 42.70323085, 42.660478600000005, 1.0E37, 42.5313072, 42.440591825, 42.33007335, 42.285245875, 42.1952171, 42.065028175, 42.037286775, 42.019165, 41.968418099999994, 41.77398395, 41.756093025, 1.0E37, 41.71342375, 41.696295750000004, 41.668965325, 41.660344124999995, 41.645406725, 41.6251249, 41.6052494, 41.591367725, 41.540897349999995, 41.5337801, 41.511686299999994, 41.452251425, 41.4750519, 41.4395962, 41.432258625, 41.429431925, 41.402782425, 41.396177300000005, 1.0E37, 41.44518565, 1.0E37, 1.0E37, 1.0E37, 1.0E37, 1.0E37, 1.0E37, 1.0E37, 41.403636, 41.35992147499999, 41.3231125, 41.174009325, 41.127915375, 41.223235125, 41.159940725, 39.92195225, 38.551660549999994, 40.003147150000004, 41.744832025, 43.16949175
*/

export interface TidesFetchedGoMOFS {
	/** Water level. May be up to 6 minutes behind. Forecasted, not observed. */
	waterLevel: number;
	/** The time used for the water level forecast. */
	waterLevelTime: DateTime;
	/** The time the forecast was created. */
	forecastEntryTimeUtc: DateTime;
	/** The number of retries to find forecast data. */
	retries: number;
	/** The station the water level and extremes are forecasted for. */
	station: Coordinate;
	/** A quick approximation of how many meters away the forecasted station is from our ideal coordinates. In kilometers. */
	approxStationOffset: number;
	/** Tide extremes, calculated crudely from the 6-min intervals. */
	extrema: TidePointExtreme[];
	/** Temperature, in Fahrenheit. */
	waterTemp: number;
}

export async function fetchTidesGoMOFS(ctx: LogContext, config: BaseConfig): ServerPromise<TidesFetchedGoMOFS> {

	const forecastUrlInfo = await getForecastUrl(ctx, config);
	if (isServerError(forecastUrlInfo)) {
		return serverErrors.internal.service(ctx, 'GoMOFS', {
			hiddenArea: 'finding any recent data from GoMOFS',
			hiddenLog: forecastUrlInfo
		});
	}
	const { retries, time, baseUrl } = forecastUrlInfo;

	const stationInfo = await getStationInfo(ctx, baseUrl);
	if (isServerError(stationInfo)) {
		return stationInfo;
	}
	const { diff, station, stationIndex } = stationInfo;

	const oceanTimes = await getOceanTimes(ctx, baseUrl);
	if (isServerError(oceanTimes)) {
		return oceanTimes;
	}

	const waterLevels = await getWaterLevels(ctx, baseUrl, stationIndex);
	if (isServerError(waterLevels)) {
		return waterLevels;
	}

	const { current, currentTime, extrema } = getCurrentAndExtrema(config.referenceTime, oceanTimes, waterLevels);

	const waterTemp = await getWaterTemp(ctx, baseUrl, stationIndex, oceanTimes, config.referenceTime);
	if (isServerError(waterTemp)) {
		return waterTemp;
	}

	const output = {
		retries,
		forecastEntryTimeUtc: time,
		approxStationOffset: diff,
		station,
		extrema,
		waterLevel: current,
		waterLevelTime: currentTime,
		waterTemp
	} satisfies TidesFetchedGoMOFS;
	return output;
}

async function getForecastUrl(ctx: LogContext, config: BaseConfig): ServerPromise<{ retries: number; time: DateTime; baseUrl: string; }> {
	/*
		Data is published for each 6 hour period of the day: 00:00, 06:00, 12:00, and 18:00.
		However, the data is published roughly an hour after its stated time. So, for example, the 00:00-based data is typically published around 01:30.
		(Even then, that "Last Modified" time is inaccurate... it usually isn't *visible* for up to another hour after that.)
		We can consider this as a reflection of the time it takes to gather all the observations and turn that into models and upload it.
		(The stated time is also in UTC.)
		So, if we take our reference time - say Sep 22 at 10PM - and convert it to UTC, we'd have Sep 23 at 2AM UTC. We can check for the Sep 23 00:00 UTC
		posting, and if not, fall back to the Sep 22 6PM UTC posting, and so on. It's nice to get the most recent possible for accuracy, but we have a 72-hour window
		of data, so it's alright if we have to "go back further".
	*/

	const referenceInUtc = config.referenceTime.setZone('utc');
	const firstTryTimeUtc = getClosestQuarterTime(referenceInUtc.minus({ hour: 7 })); // Subtract some time first time to ensure we get forecast data to cover reference time
	const secondTryTimeUtc = getClosestQuarterTime(firstTryTimeUtc.minus({ hour: 1 })); // Subtract an hour to ensure different time
	const thirdTryTimeUtc = getClosestQuarterTime(secondTryTimeUtc.minus({ hour: 1 })); // Subtract an hour to ensure different time

	const tryTimes = [firstTryTimeUtc, secondTryTimeUtc, thirdTryTimeUtc];
	for (let i = 0; i < tryTimes.length; i++) {
		const time = tryTimes[i];
		// Hour is 0-based, everything else is as you'd expect.
		const { year, month, day, hour } = time;
		const padMonth = month.toString().padStart(2, '0');
		const padDay = day.toString().padStart(2, '0');
		const padHour = hour.toString().padStart(2, '0');
		const baseUrl = `https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/GOMOFS/MODELS/${year}/${padMonth}/${padDay}/nos.gomofs.stations.forecast.${year}${padMonth}${padDay}.t${padHour}z.nc`;
		// Just try to get some simple small data to prove it's accessible
		const trySimpleGetUrl = `${baseUrl}.ascii?ntimes`;

		const simpleText = await makeRequestAscii(ctx, `GoMOFS - access try ${i} (0-based)`, trySimpleGetUrl);
		if (isServerError(simpleText)) {
			// If last, return the server error
			if (i === tryTimes.length - 1) {
				return simpleText;
			}
			continue;
		}
		return {
			retries: i,
			time,
			baseUrl: baseUrl
		};
	};
	return null!; // Handled by logic above.
}

function getClosestQuarterTime(time: DateTime): DateTime {
	const startOfHour = time.startOf('hour');
	const quarterFloorHour = Math.floor(startOfHour.hour / 6) * 6; // Get from [0, 23] to [0, 3]
	const quarterFloorTime = startOfHour.set({ hour: quarterFloorHour });
	return quarterFloorTime;
}

async function getStationInfo(ctx: LogContext, baseUrl: string): ServerPromise<{ station: Coordinate; diff: number; stationIndex: number; }> {
	// Get just the ascii for latitude and longitude
	const latLonUrl = `${baseUrl}.ascii?lon_rho%5B0:1:125%5D,lat_rho%5B0:1:125%5D`;

	const latLonText = await makeRequestAscii(ctx, 'GoMOFS - lat/lon', latLonUrl);
	if (isServerError(latLonText)) {
		return latLonText;
	}

	const latLonParsed = parseAscii(latLonText);

	// We now have lat and lon, in separate arrays, with string values.
	const stations: (Coordinate | null)[] = [];
	const lat = latLonParsed['lat_rho'];
	const lon = latLonParsed['lon_rho'];
	for (let i = 0; i < Math.min(lat.length, lon.length); i++) {
		const latNum = parseFloat(lat[i] as string);
		const lonNum = parseFloat(lon[i] as string);
		if (isTooLargeValue(latNum) || isTooLargeValue(lonNum)) {
			stations.push(null);
		}
		else {
			stations.push({
				lat: latNum,
				lon: lonNum
			});
		}
	}
	let closestDiff = Infinity;
	let closestStationIndex = -1;
	stations.forEach((station, i) => {
		if (!station) {
			return;
		}
		const { lat, lon } = station;
		// Using crude approximation of meters: https://stackoverflow.com/a/39540339
		const latDiff = Math.abs(lat - constant.latitude) * 111.32;
		const lonDiff = Math.abs(lon - constant.longitude) * 40075 * Math.cos(lat) / 360;
		const diff = Math.sqrt(Math.pow(latDiff, 2) + Math.pow(lonDiff, 2));

		if (diff < closestDiff) {
			closestDiff = diff;
			closestStationIndex = i;
		}
	});

	return {
		station: stations[closestStationIndex]!,
		stationIndex: closestStationIndex,
		diff: closestDiff
	};
}

async function getOceanTimes(ctx: LogContext, baseUrl: string): ServerPromise<DateTime[]> {
	// Get the ascii for the ocean times
	const oceanTimeUrl = `${baseUrl}.ascii?ocean_time%5B0:1:720%5D`;
	const oceanTimeText = await makeRequestAscii(ctx, 'GoMOFS - ocean time', oceanTimeUrl);
	if (isServerError(oceanTimeText)) {
		return oceanTimeText;
	}

	const oceanTimeParsed = parseAscii(oceanTimeText);
	const baseTime = DateTime.fromISO('2016-01-01T00:00:00.000Z');
	const oceanTimes = oceanTimeParsed['ocean_time'].map((text) => {
		// Text is seconds since 2016-01-01 UTC; must also convert to our time zone
		const seconds = Number(text as string);
		const time = baseTime.plus({ seconds }).setZone(constant.timeZoneLabel);
		return time;
	});

	return oceanTimes;
}

async function getWaterLevels(ctx: LogContext, baseUrl: string, stationIndex: number): ServerPromise<number[]> {

	const waterLevelUrl = `${baseUrl}.ascii?zeta%5B0:1:720%5D%5B${stationIndex}:1:${stationIndex}%5D`;
	const waterLevelText = await makeRequestAscii(ctx, 'GoMOFS - water level', waterLevelUrl);
	if (isServerError(waterLevelText)) {
		return waterLevelText;
	}
	const waterLevelParsed = parseAscii(waterLevelText);
	const waterLevels = waterLevelParsed['zeta'].flat().map((text) => {
		// Text is meters from mean sea level (MSL)
		const meters = parseFloat(text as string);
		const feet = 3.28084 * meters;
		const feetMLLW = feet + 4.77; // https://tidesandcurrents.noaa.gov/datums.html?id=8419317
		return Math.round(feetMLLW * 100) / 100;
	});

	return waterLevels;
}

interface WaterLevelWithTime {
	time: DateTime;
	value: number;
}

function getCurrentAndExtrema(referenceTime: DateTime, oceanTimes: DateTime[], waterLevels: number[]): { extrema: TidePointExtreme[], current: number; currentTime: DateTime; } {
	const waterLevelsWithTime: WaterLevelWithTime[] = [];
	for (let i = 0; i < Math.min(oceanTimes.length, waterLevels.length); i++) {
		waterLevelsWithTime.push({
			time: oceanTimes[i],
			value: waterLevels[i]
		});
	}

	let beforeReferenceTime: WaterLevelWithTime = null!;
	let indexOfFirstOfSame: number = -1;
	// Will have to go through and check for switches from increasing to decreasing.
	let isIncreasing: boolean | undefined = undefined;
	const extrema: TidePointExtreme[] = [];

	/*
		We will assume here that 6 minutes is enough resolution such that we don't need to do fancy quadratic equation math
		to figure out exact extreme points. For now, we'll just assume the extreme *is* one of the data points.

		If in the future this needs to change, we can use https://stackoverflow.com/a/16896810 to feed in three data points
		and build up the quadratic equation, then https://www.wikihow.com/Find-the-Maximum-or-Minimum-Value-of-a-Quadratic-Function-Easily
		to turn that into graph points.

		Note that we may have adjacent entries with the same value because of our resolution.
	*/
	for (let i = 1; i < waterLevelsWithTime.length; i++) {
		const { time, value } = waterLevelsWithTime[i];
		const { time: previousTime, value: previousValue } = waterLevelsWithTime[i - 1];

		// Check for our current water level
		if (!beforeReferenceTime && referenceTime < time) {
			beforeReferenceTime = waterLevelsWithTime[i - 1];
		}

		// Figure out if we are currently or have just been seeing the same value.
		let isOrWasInStretchOfSameValue = false;
		if (value === previousValue) {
			if (indexOfFirstOfSame === -1) {
				indexOfFirstOfSame = i - 1;
				isOrWasInStretchOfSameValue = true;
			}
		}
		else if (indexOfFirstOfSame !== -1) {
			const numEntriesBetween = (i - 1) - indexOfFirstOfSame + 1;
			// We had some in a row of the same value (likely 2).
			if (numEntriesBetween % 2 === 0) {
				const start = waterLevelsWithTime[indexOfFirstOfSame];
				const halfwayTime = DateTime.fromMillis(start.time.toMillis() + ((previousTime.toMillis() - start.time.toMillis()) / 2), { zone: previousTime.zone });

				// Even number
				extrema.push({
					id: createTidePointExtremeId(halfwayTime, 'gomofs'),
					time: halfwayTime,
					height: previousValue,
					isLow: value > previousValue,
				});
			}
			else {
				// Odd number, just use middle
				const middle = waterLevelsWithTime[indexOfFirstOfSame + (((i - 1) - indexOfFirstOfSame) / 2)];
				extrema.push({
					id: createTidePointExtremeId(middle.time, 'gomofs'),
					time: middle.time,
					height: middle.value,
					isLow: value > middle.value,
				});
			}
			indexOfFirstOfSame = -1;
			isOrWasInStretchOfSameValue = true;
		}

		const isNowIncreasing = value > previousValue;
		if (!isOrWasInStretchOfSameValue && isIncreasing !== undefined && isNowIncreasing !== isIncreasing) {
			/*
				We're outside of any same-value stuffs, and switched from increasing to decreasing.
				Could be the real peak was between i-2 and i-1, or between i-1 and i.
			*/
			//const { time: twoBackTime, value: twoBackValue } = waterLevelsWithTime[i - 2];
			extrema.push({
				id: createTidePointExtremeId(previousTime, 'gomofs'),
				time: previousTime,
				height: previousValue,
				isLow: value > previousValue,
			});
		}
		isIncreasing = isNowIncreasing;
	}


	return {
		current: beforeReferenceTime.value,
		currentTime: beforeReferenceTime.time,
		extrema
	};
}

async function getWaterTemp(ctx: LogContext, baseUrl: string, stationIndex: number, oceanTimes: DateTime[], referenceTime: DateTime): ServerPromise<number> {

	/*
		Water temp, because it varies with depth, has depth as one of the input dimensions.
		We'll get the last one (29), since that's supposedly the closest to the surface.
		[ocean_time][station][s_rho]

		Test: https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/GOMOFS/MODELS/2023/09/23/nos.gomofs.stations.forecast.20230923.t00z.nc.ascii?s_rho%5B0:1:29%5D,temp%5B1:1:1%5D%5B4:1:4%5D%5B0:1:29%5D
	*/

	const waterTempUrl = `${baseUrl}.ascii?temp%5B0:1:720%5D%5B${stationIndex}:1:${stationIndex}%5D%5B29:1:29%5D`;
	const waterTempText = await makeRequestAscii(ctx, 'GoMOFS - water temp', waterTempUrl);
	if (isServerError(waterTempText)) {
		return waterTempText;
	}
	const waterTempParsed = parseAscii(waterTempText);
	const waterTemps = waterTempParsed['temp'].flat(2).map((text) => {
		// Text is degrees celsius, like 16.237352
		const celsius = parseFloat(text as string);
		const fahrenheit = celsius * (9 / 5) + 32;
		return Math.round(fahrenheit * 100) / 100;
	});

	let currentWaterTemp: number = null!;
	for (let i = 0; i < oceanTimes.length; i++) {
		const oceanTime = oceanTimes[i];
		if (referenceTime < oceanTime) {
			currentWaterTemp = waterTemps[i - 1];
		}
	}

	return currentWaterTemp;
}

interface Coordinate {
	lat: number;
	lon: number;
}

// The value 1.0E37 is often used for "unknown".
function isTooLargeValue(value: number): boolean {
	return value > 1_000_000_000;
}

function getDimensionIndices(text: string): number[] {
	// Ex: lat_rho[12]
	// Ex: lat_rho[1][2]
	// Ex: lat_rho[44][4][6]
	// https://stackoverflow.com/a/55983161
	const dimensionRegex = new RegExp(/\[([0-9]+)\]/g);
	const matches = Array.from(text.matchAll(dimensionRegex));
	return matches.map((match) => parseInt(match[1], 10));
}

type ValueOrArray<T> = T | ValueOrArray<T>[];

type ParsedAscii = {
	[name: string]: ValueOrArray<string>[];
};

function parseAscii(ascii: string): ParsedAscii {
	/*
		Format:

		=============================================

		Dataset {
			Datatype name[key = length];
			Datatype name[key = length];
		} Model/Name/Here.this.that;
		---------------------------------------------
		name[length]
		value1, value2, value3

		name[length][length]
		[0], value1, value2
		[1], value1, value2

		name[length][length][length]
		[0][0], value1, value2
		[0][1], value1, value2

		=============================================

		Note that:
		- there's always a header section with a "---" break
		- each value set has a double newline after, including the last
		- all the values for a single dimension are on one line
	*/
	const split = ascii.split('\n');

	const parsed: ParsedAscii = {};
	let currentKey: string | null = null;
	let currentValues: ValueOrArray<string>[] = [];

	let hasReachedSplitter = false;
	split.forEach((line) => {
		// Search for the splitter
		if (!hasReachedSplitter) {
			// Ex: -------------
			if (/^[\-]+$/.test(line)) {
				// If found, mark and head to next line
				hasReachedSplitter = true;
			}
			return;
		}
		// Search for start of a section
		if (currentKey === null) {
			// Ex: lat_rho[12]
			// Ex: lat_rho[1][2]
			// Ex: lat_rho[44][4][6]
			if (/[a-zA-Z_]+\[.*/.test(line)) {
				currentKey = line.slice(0, line.indexOf('['));
				return;
			}
		}
		if (currentKey !== null) {
			if (!line.length) {
				parsed[currentKey] = currentValues;
				currentKey = null;
				currentValues = [];
			}
			else {
				// A line of values
				// Ex: 1, 2, 3
				// Ex: [1], 1, 2, 3
				// Ex: [44][4], 1, 2, 3
				const dimensionText = line.slice(0, line.indexOf(','));
				const dimensionIndices = getDimensionIndices(dimensionText);
				const valuesText = dimensionIndices.length ? line.slice(line.indexOf(',') + 2) : line;
				let arr = currentValues;
				dimensionIndices.forEach((dimensionIndex) => {
					if (arr[dimensionIndex] === undefined) {
						arr[dimensionIndex] = [];
					}
					arr = arr[dimensionIndex] as ValueOrArray<string>[];
				});

				const splitValues = valuesText.split(', ');
				arr.push(...splitValues);
			}
		}
	});

	return parsed;
}
