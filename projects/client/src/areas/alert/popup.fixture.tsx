import * as React from 'react';
import { Text } from '@/core/symbol/text';
import { Cosmos, CosmosFixture } from '@/test';
import { PopupType, usePopup } from './popup';

const enumControl = Cosmos.createControlSelectForEnum(PopupType);

export default CosmosFixture.create(() => {
	// Just get the setter.
	const setPopupData = usePopup()[1];

	const popupType = Cosmos.useControlSelect('Type', enumControl, 'warning');

	const title = Cosmos.useControlValue('Title', 'Uh-oh, dude.');
	const popupText = Cosmos.useControlValue('Text', 'There was a problem while trying to do the thing.');
	const forcePageReload = Cosmos.useControlValue('Page Reload', false);
	const forceDataRefresh = Cosmos.useControlValue('Data Refresh', false);

	const buttonRender = Cosmos.useTestButtons({
		'Trigger Popup': () => {
			setPopupData({
				type: popupType,
				title: title,
				text: popupText,
				forcePageReload: forcePageReload,
				forceDataRefresh: forceDataRefresh
			});
		}
	});

	return (
		<>
			{buttonRender}
			<Text>
				Here is some background text.
			</Text>
		</>
	);
}, {
	hasMargin: true
});