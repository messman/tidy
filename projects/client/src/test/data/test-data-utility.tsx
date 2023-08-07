import { RequestResultServerError } from '@/index/core/data/request';
import { getUnique } from '@messman/react-common';
import * as iso from '@wbtdevlocal/iso';

export function createRequestResultServerError(form: iso.ServerErrorForm, overrideDescription?: string): RequestResultServerError {
	return {
		isSuccess: false,
		clientError: null,
		pathInfo: {
			finalUrl: 'fake_url',
			method: iso.HttpMethod.GET
		},
		data: null,
		serverError: {
			_isServerError: true,
			detail: null,
			form: {
				...form,
				description: overrideDescription || form.description
			},
			id: `7rkl083a${getUnique()}`
		}
	};
}

export function createTestServerError<T extends object | null>(detail?: T): iso.ServerError {
	return {
		_isServerError: true,
		id: 'id',
		form: iso.serverErrorForms.dev.test,
		detail: detail || null
	};
}