import { ApiRouteTypes } from '../../api/request-response';
import { Batch } from './batch-iso';

export type KeyQuery = {
	/**
	 * Key from the client. If mismatched with the server, the server should send an error.
	 * 
	 * This is *not* a security/privacy feature; this is just for ensuring that the client is up-to-date with the server.
	 * Like a cache break.
	*/
	key: string;
};

export namespace ApiRouteBatchLatest {
	export type Types = ApiRouteTypes<null, null, KeyQuery, ResponseInner>;

	export interface ResponseInner {
		batch: Batch;
	}
}

export namespace ApiRouteBatchSeed {
	export type Types = ApiRouteTypes<null, Path, KeyQuery, ResponseInner>;

	export type Path = {
		seed: string;
	};

	export interface ResponseInner {
		batch: Batch;
	}
}