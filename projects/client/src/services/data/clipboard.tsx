
/*
	Clipboard is hard. https://stackoverflow.com/q/34045777
	
	MDN: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
	There is upcoming new functionality for this in the form of the async 'writeText' and permissions API.
	But since not all browsers support it, we have to fall back on the crap implementations.

	There are implementations out there, but most are either too complicated or not complicated enough.
	This code only writes to the clipboard. It does not try to read from the clipboard at all.

	Test this in Firefox, iOS Safari, Desktop Safari, and Chrome.
*/

export async function setClipboard(text: string | string[]): Promise<void> {
	const textLines = Array.isArray(text) ? text : [text];

	let isSuccess = tryExecCopy(textLines);
	if (!isSuccess) {
		console.warn('Failure to copy to clipboard via exec copy command.');

		if (!!window.navigator && !!window.navigator.clipboard) {
			await navigator.clipboard.writeText(textLines.join('\n'));
		}
		else {
			throw new Error('Copy to clipboard failed');
		}
	}
}

function tryExecCopy(textLines: string[]): boolean {
	const textarea = document.createElement('textarea');

	textarea.setAttribute('size', '0');
	textarea.style.setProperty('border', 'none');
	textarea.style.setProperty('margin', '0');
	textarea.style.setProperty('padding', '0');
	textarea.style.setProperty('outline', 'none');

	textarea.style.setProperty('box-sizing', 'border-box');
	textarea.style.setProperty('position', 'absolute');

	textarea.style.setProperty('width', '1px');
	textarea.style.setProperty('height', '1px');
	textarea.style.setProperty('min-width', '1px');
	textarea.style.setProperty('min-height', '1px');
	textarea.style.setProperty('max-width', '1px');
	textarea.style.setProperty('max-height', '1px');

	textarea.style.setProperty('margin-bottom', '-1px');
	textarea.style.setProperty('margin-right', '-1px');

	document.body.appendChild(textarea);

	textarea.value = textLines.join('\n');
	textarea.select();
	const isSuccess = document.execCommand('copy');
	textarea.parentNode!.removeChild(textarea);

	return isSuccess;
}