import express from "express";
export const router = express.Router();

import { getData, SerializedAPIResponse } from "./collector";

const expirationMS: number = 1000 * 60 * 10; // 10 minutes

let lastResponse: SerializedAPIResponse = null;
let lastResponseTime: number = -1;

let latestCacheHits: number = 0;
let latestCacheBreaks: number = 0;
let latestTotal: number = 0;

export interface LatestResponse {
	isCached: boolean,
	cachedForMs: number,
	response: SerializedAPIResponse
}

router.get("/latest", async function (req, res) {

	const now = Date.now();
	let isCached = false;
	let cachedForMs = 0;
	let response: SerializedAPIResponse = lastResponse;

	if (!response || lastResponseTime === -1 || now > lastResponseTime + expirationMS) {

		response = await getData();

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
	response: SerializedAPIResponse
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
