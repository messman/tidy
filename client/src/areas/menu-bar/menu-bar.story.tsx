import * as React from 'react';
import { decorateFullScreen } from '@/test/storybook/decorate';
import { Text } from '@/core/symbol/text';
import { MenuBar } from './menu-bar';
import { Flex, RootRow } from '@/core/layout/flex';

export default { title: 'areas/menu-bar' };

export const MenuBars = decorateFullScreen(() => {

	const [isClipboardSuccess, setIsClipboardSuccess] = React.useState(false);
	const [isClipboardFailure, setIsClipboardFailure] = React.useState(false);
	const clipboardCounter = React.useRef(0);

	const [text, setText] = React.useState<string>('Content');

	function onClipboardClick(): void {
		const isSuccess = clipboardCounter.current % 2 === 0;
		clipboardCounter.current++;
		const timeout = 3000;
		if (isSuccess) {
			setIsClipboardSuccess(true);
			setText('Clipboard Success!');
			setTimeout(() => {
				setIsClipboardSuccess(false);
			}, timeout);
		}
		else {
			setIsClipboardFailure(true);
			setText('Clipboard Failure!');
			setTimeout(() => {
				setIsClipboardFailure(false);
			}, timeout);
		}
	}

	function onForecastClick(): void {
		setText('Forecast clicked!');
	}

	function onSettingsClick(): void {
		setText('Settings clicked!');
	}

	// Root can be row or column.
	// Child within must be a flex item.
	return (
		<RootRow>
			<MenuBar
				clipboardIsDisabledSuccess={isClipboardSuccess}
				clipboardIsDisabledFailure={isClipboardFailure}
				clipboardOnClick={onClipboardClick}
				forecastOnClick={onForecastClick}
				settingsOnClick={onSettingsClick}
			>
				<Flex>
					<Text>{text}</Text>
				</Flex>
			</MenuBar>
		</RootRow>
	);
});