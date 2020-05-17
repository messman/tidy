import * as React from 'react';
import { Text } from '@/core/symbol/text';
import { decorate } from '@/test/storybook/decorate';
import { text, button, select, boolean } from '@storybook/addon-knobs';
import { usePopup, PopupType } from './popup';

export default { title: 'areas/alert' };

export const Popups = decorate(() => {

	const setPopupData = usePopup()[1];

	const options = {
		warning: PopupType.warning,
		error: PopupType.error
	};

	const popupType = select('Type', options, PopupType.warning);
	const title = text('Title', 'Uh-oh, dude.');
	const popupText = text('Text', 'There was a problem while trying to do the thing.');
	const forcePageReload = boolean('Page Reload', false);
	const forceDataRefresh = boolean('Data Refresh', false);

	button('Trigger Popup', () => {
		setPopupData({
			type: popupType,
			title: title,
			text: popupText,
			forcePageReload: forcePageReload,
			forceDataRefresh: forceDataRefresh
		});
	});

	return (
		<Text>
			Here is some background text.
		</Text>
	);
});