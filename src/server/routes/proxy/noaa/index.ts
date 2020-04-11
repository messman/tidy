import express from "express";
export const router = express.Router();

import { Response as CleanResponse } from "./models";
import { getNoaaData } from "./requests";

const expirationMS: number = 1000 * 60 * 10; // 10 minutes

let lastResponse: CleanResponse = null;
let lastResponseTime: number = -1;

let latestCacheHits: number = 0;
let latestCacheBreaks: number = 0;
let latestTotal: number = 0;

export interface LatestResponse {
	isCached: boolean,
	cachedForMs: number,
	response: CleanResponse
}

router.get("/latest", async function (req, res) {

	const now = Date.now();
	let isCached = false;
	let cachedForMs = 0;
	let response: CleanResponse = lastResponse;

	if (!response || lastResponseTime === -1 || now > lastResponseTime + expirationMS) {

		response = await getNoaaData();

		lastResponse = response;
		lastResponseTime = now;

		latestCacheBreaks++;
		latestCacheHits = 1;
	} else {
		isCached = true;
		cachedForMs = now - lastResponseTime;
		latestCacheHits++;
	}

	latestTotal++;

	const latest: LatestResponse = {
		isCached,
		cachedForMs,
		response
	};
	return res.json(latest);
});

export interface LastResponse {
	cachedForMs: number,
	response: CleanResponse
}

router.get("/last", async function (req, res) {
	const last: LastResponse = {
		response: lastResponse || null,
		cachedForMs: lastResponse ? (Date.now() - lastResponseTime) : -1
	};
	res.json(last);
});

export interface StatsResponse {
	updates: number,
	sinceUpdate: number,
	total: number,
}

router.get("/stats", async function (req, res) {
	const stats: StatsResponse = {
		updates: latestCacheBreaks,
		sinceUpdate: latestCacheHits,
		total: latestTotal,
	};
	res.json(stats);
});
