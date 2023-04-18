import { constrainObject } from '../utility';

/** The top-level category of a server error. */
export enum ServerErrorFormParent {
	/** "Something is wrong on our side" */
	internal = 100,
	/** Business logic issues / "You can't do that" */
	logic = 101,
	/** Routing / request parsing / infrastructural request issues */
	wire = 102,
	/** REST / CRUD */
	resource = 103,
	/** Development */
	dev = 104
}

/*
	Note: The description text is:
	- Short and descriptive
	- Public to API consumers and possibly shown in the client UI
	- Generic enough that a more specific description can be provided to override it
*/
export const serverErrorForms = {
	internal: {
		/** We really don't know what's going on. */
		unknown: createFormInternal('unknown', 'The error is unknown'),
		/**
		 * The error is one created via development to prevent logical errors in the design of the API.
		 * For example, maybe calling an internal 'sign out' function without first
		 * checking whether 'sign out' was already called should throw an error.
		 */
		design: createFormInternal('design', 'Error due to server logical design'),
		/** A third-party service (Google, etc) threw an error or reported a problem. */
		service: createFormInternal('service', 'Error communicating with a service')
	},
	logic: {
		/** Parameters from URLs or request body is missing. Useful as a separate error for debugging. */
		missingParams: createFormLogic('missing_params', 'Parameters missing'),
		/**
		 * Used for basic high-level param checks before getting into more complex logic.
		 * Some parameter is malformed or not in the parse-able range,
		 * Use other errors for logic issues.
		 */
		troubleParams: createFormLogic('trouble_params', 'Parameters are malformed or troublesome to understand'),
		/**
		 * The catch-all 'business logic prevents this'.
		 * */
		notAllowed: createFormLogic('not_allowed', 'Action is not allowed'),
	},
	wire: {
		malformed: createFormWire('request_malformed', 'Request is malformed', 400),
		routeNotFound: createFormWire('route_not_found', 'Route does not exist', 404),
	},
	resource: {
		notFound: createFormResource('not_found', 'Resource does not exist', 404),
	},
	dev: {
		test: createForm(ServerErrorFormParent.dev, 'test', 'Error created for development', 403)
	}
};

export interface ServerErrorForm {
	parent: ServerErrorFormParent;
	name: string;
	description: string;
	statusCode: number;
}

function createForm(parent: ServerErrorFormParent, name: string, description: string, statusCode: number): ServerErrorForm {
	return { parent, name, description, statusCode };
}

function createFormInternal(name: string, description: string): ServerErrorForm {
	return createForm(ServerErrorFormParent.internal, name, description, 500);
}

function createFormLogic(name: string, description: string): ServerErrorForm {
	return createForm(ServerErrorFormParent.logic, name, description, 403);
}

function createFormWire(name: string, description: string, statusCode: number): ServerErrorForm {
	return createForm(ServerErrorFormParent.wire, name, description, statusCode);
}

function createFormResource(name: string, description: string, statusCode: number): ServerErrorForm {
	return createForm(ServerErrorFormParent.resource, name, description, statusCode);
}

export interface ServerError {
	_isServerError: true;
	id: string;
	form: ServerErrorForm;
	detail: {} | null;
}
/** Removes extraneous properties from a ServerError, since it may be extended. */
export function scrubServerError(error: ServerError): ServerError {
	return constrainObject(error, { _isServerError: 1, detail: 'all', form: 'all', id: 1 });
}

export function isServerError<T>(object: T | ServerError): object is ServerError {
	const anyObject = object as any;
	return anyObject && anyObject['_isServerError'] === true;
}

export function isInternalServerError<T>(object: T | ServerError): object is ServerError {
	return isServerError(object) && object.form.parent === ServerErrorFormParent.internal;
}

export function isDevServerError<T>(object: T | ServerError): object is ServerError {
	return isServerError(object) && object.form.parent === ServerErrorFormParent.dev;
}