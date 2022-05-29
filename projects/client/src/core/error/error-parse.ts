import { ClientErrorForm, RequestResultError } from '@/services/network/request';
import { ServerErrorFormParent } from '@wbtdevlocal/iso';

export interface RequestResultErrorParseOutput {
	title: string;
	detail: string | null;
	text: string[];
}

export function parseRequestResultError(result: RequestResultError, isDevelopment: boolean): RequestResultErrorParseOutput {
	const { clientError: client, serverError: server } = result;

	let title: string = null!;
	let detail: string | null = null!;
	let text: string[] = [];

	if (client) {
		title = clientErrorFormInfo[ClientErrorForm[client.form] as keyof typeof ClientErrorForm];

		text.push('Type: Client');
		if (isDevelopment && client.error) {
			text.push('Error: ' + client.error.message);
		}
	}
	else if (server) {
		const { form, id } = server;
		const parentName = ServerErrorFormParent[form.parent];

		title = form.description;
		detail = `${form.statusCode} ${parentName}_${form.name} #${id}`;

		text.push('Type: Server');
		text.push(`Form: ${parentName}_${form.name}`);
		text.push(`Description: ${form.description}`);
		text.push('ID: ' + id);
		text.push('Status Code: ' + form.statusCode);
		text.push('Detailed: ' + (server.detail ? 'Yes' : 'No'));
	}

	text.push(`URL: ${result.pathInfo.method} ${result.pathInfo.finalUrl}`);

	return {
		title,
		detail,
		text
	};
}

const clientErrorFormInfo: Record<keyof typeof ClientErrorForm, string> = {
	aborted: 'The request did not complete.',
	fetchTimeout: 'The request took too long to complete.',
	networkIssue: 'The server could not be reached.',
	packRequest: 'The application could not send the request properly.',
	parseResult: 'The server response could not be parsed.',
};