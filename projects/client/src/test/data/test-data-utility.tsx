import { RequestResultServerError } from '@/index/core/data/request';
import { getUnique } from '@messman/react-common';
import { HttpMethod, ServerError, ServerErrorForm, serverErrorForms } from '@wbtdevlocal/iso';

export function createRequestResultServerError(form: ServerErrorForm, overrideDescription?: string): RequestResultServerError {
	return {
		isSuccess: false,
		clientError: null,
		pathInfo: {
			finalUrl: 'fake_url',
			method: HttpMethod.GET
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

export function createTestServerError<T extends object | null>(detail?: T): ServerError {
	return {
		_isServerError: true,
		id: 'id',
		form: serverErrorForms.dev.test,
		detail: detail || null
	};
}