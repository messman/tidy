import * as React from 'react';
import { LocalStorageThemeProvider, ThemePicker } from '@/core/style/theme';
import { defaultLowerBreakpoints, ResponsiveLayoutProvider } from '@/services/layout/responsive-layout';
import { decorateWith } from '@/test/storybook/decorate';
import { boolean, text } from '@storybook/addon-knobs';
import { InvalidCheck } from './invalid';
import { FlexRoot } from '@/core/layout/flex';

export default { title: 'areas/alert' };

// Use a custom wrapper, so that we can customize the component we are testing
const WrapperDecorator = (story: () => JSX.Element) => {
	return (
		<LocalStorageThemeProvider>
			<ResponsiveLayoutProvider lowerBreakpoints={defaultLowerBreakpoints}>
				<FlexRoot>
					{story()}
				</FlexRoot>
			</ResponsiveLayoutProvider>
		</LocalStorageThemeProvider>
	);
};

export const Invalid = decorateWith(() => {

	const isForceAlertMessages = boolean('Force Alert Messages', false, 'Build Alert');
	const firstAlertMessage = text('First Alert Message', 'Houston, we have a problem.', 'Build Alert');
	const secondForceAlertMessage = text('Second Alert Message', 'but we probably do not know what that problem is.', 'Build Alert');

	const alertMessages = [];
	if (isForceAlertMessages && firstAlertMessage) {
		alertMessages.push(firstAlertMessage);
		if (secondForceAlertMessage) {
			alertMessages.push(secondForceAlertMessage);
		}
	}

	const isForceInternetExplorer = boolean('Force Internet Explorer', false);
	const isForceInvalidLayout = boolean('Force Invalid Layout', false);

	return (
		<InvalidCheck
			forceAlertMessages={alertMessages}
			isForceInternetExplorer={isForceInternetExplorer}
			isForceInvalidLayout={isForceInvalidLayout}
		>
			<div>
				<ThemePicker />
			</div>
		</InvalidCheck>
	);
}, [WrapperDecorator]);