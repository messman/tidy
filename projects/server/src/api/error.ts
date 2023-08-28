import * as uid from 'uid-safe';
import { isInternalServerError, ServerError, ServerErrorDetail, ServerErrorForm, serverErrorForms } from '@wbtdevlocal/iso';
import { LogContext } from '../services/logging/pino';

export type ServerPromise<T> = Promise<ServerError | T>;

export interface ServerErrorHiddenLog {
	/**
	 * Any additional log arguments.
	 * 
	 * 'Hidden', not fully 'private'. Don't expose passwords / credentials.
	*/
	hiddenLog: {} | null;
};

export interface ServerErrorHiddenArea {
	/**
	 * The 'area' of the codebase. Used to describe the error to developers in the code
	 * and also easily find the code section based on the area from the logs.
	 * 
	 * Example: 'Redirect access token not given'
	 * 
	 * 'Hidden', not fully 'private'.
	 */
	hiddenArea: string;
};

export interface ServerErrorPublicDesc {
	/**
	 * An override of the description for the form to provide more context to the user.
	 * Any text here may be shown directly to the user, so it should be user-safe, 
	 * proper grammar, etc.
	 * 
	 * Example: 'Session is using outdated temporary credentials '
	*/
	publicDesc: string;
};

export interface ServerErrorPublicDetail<TDetail extends object | null = null> {
	/**
	 * Additional details to return to the API consumer, either for client-side logic
	 * or to assist with API discovery. Visible to API users and may be presented to
	 * the client user.
	*/
	publicDetail: TDetail;
};

export type ServerErrorInputHidden = ServerErrorHiddenArea & Partial<ServerErrorHiddenLog>;
export type ServerErrorInput<TDetail extends object | null = null> = Partial<ServerErrorPublicDesc & ServerErrorHiddenArea & ServerErrorPublicDetail<TDetail> & ServerErrorHiddenLog>;
export type ServerErrorInputNoDetail = Omit<ServerErrorInput, 'publicDetail'>;


function mergeNullableObject<T>(ob: T, newOb: T): T | undefined {
	// Keep null things undefined.
	if (!ob) {
		return newOb || undefined;
	}
	if (!newOb) {
		return ob || undefined;
	}
	return Object.assign(ob, newOb);
}

function createServerError<TDetail extends object | null = null>(ctx: LogContext, form: ServerErrorForm, input: Partial<ServerErrorInput<TDetail>> | null, overrideInput: Partial<ServerErrorInput<TDetail>> | null): ServerError {

	// Set description, falling back on default.
	form = {
		...form,
		description: overrideInput?.publicDesc || input?.publicDesc || form.description
	};

	const mergedDetail = mergeNullableObject(input?.publicDetail, overrideInput?.publicDetail);

	const error: ServerError = {
		_isServerError: true,
		id: uid.sync(8),
		form: form,
		detail: mergedDetail || null
	};

	const logger = ctx.logger.child({
		serverErrorId: error.id
	});

	const mergedExtra = mergeNullableObject(input?.hiddenLog, overrideInput?.hiddenLog);

	const logData = {
		form: error.form,
		area: overrideInput?.hiddenArea || input?.hiddenArea || undefined,
		detail: mergedDetail,
		extra: mergedExtra
	};

	// For binding purposes, don't change how the functions are called here.
	if (isInternalServerError(error)) {
		logger.error(error.form.description, logData);
	}
	else {
		// Still a server error... just not internal. No need to show the error color in our logging.
		logger.info((error as ServerError).form.description, logData);
	}
	return error;
}

function wrap(form: ServerErrorForm) {
	return <TDetail extends object | null = null>(ctx: LogContext, input: ServerErrorInput<TDetail>): ServerError => {
		return createServerError<TDetail>(ctx, form, input, null);
	};
}

export const serverErrors = {

	internal: {
		unknown: (ctx: LogContext, error: Error | null, input: ServerErrorInputHidden): ServerError => {
			return createServerError(ctx, serverErrorForms.internal.unknown, input, {
				hiddenLog: {
					error: error?.message || undefined
				}
			});
		},
		design: (ctx: LogContext, input: ServerErrorInputHidden): ServerError => {
			return createServerError(ctx, serverErrorForms.internal.design, input, null);
		},
		service: (ctx: LogContext, serviceName: string, input: ServerErrorInputHidden): ServerError => {
			return createServerError(ctx, serverErrorForms.internal.service, input, {
				publicDesc: `Error communicating with the service '${serviceName}'`,
				hiddenLog: {
					service: serviceName
				}
			});
		},
		mismatch: (ctx: LogContext, clientProvidedKey: string, serverClientKey: string, input: ServerErrorInputHidden): ServerError => {
			return createServerError(ctx, serverErrorForms.internal.mismatch, input, {
				publicDetail: {
					current: clientProvidedKey,
					needed: serverClientKey
				} satisfies ServerErrorDetail.InternalMismatch
			});
		},
	},
	logic: {
		missingParams: wrap(serverErrorForms.logic.missingParams),
		troubleParams: wrap(serverErrorForms.logic.troubleParams),
		structureLock: wrap(serverErrorForms.logic.notAllowed),
	},
	wire: {
		malformed: wrap(serverErrorForms.wire.malformed),
		routeNotFound: wrap(serverErrorForms.wire.routeNotFound),
	},
	resource: {
		notFound: wrap(serverErrorForms.resource.notFound),
	},
	dev: {
		test: wrap(serverErrorForms.dev.test)
	}
};