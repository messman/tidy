import * as React from 'react';
import { Flex, FlexRow } from '@/core/layout/flex';
import { addPadding, edgePaddingValue, flowPaddingValue } from '@/core/style/common';
import { styled } from '@/core/style/styled';
import { useCurrentTheme } from '@/core/style/theme';
import { Icon, iconTypes } from '@/core/symbol/icon';
import { Subtitle, Text, titleHeight } from '@/core/symbol/text';
import { CONSTANT } from '@/services/constant';
import { isInvalidLayoutForApplication, useResponsiveLayout } from '@/services/layout/responsive-layout';

export interface InvalidCheckProps {
	/** Used for testing. Messages about the application as a whole. */
	forceAlertMessages?: string[],
	/** Used for testing. Whether to show the Internet Explorer warning. */
	isForceInternetExplorer?: boolean,
	/** Used for testing. Whether to show the invalid layout warning. */
	isForceInvalidLayout?: boolean,
}

/** Wrapper component that will check for layout issues, build alerts, etc and show an overlay on the screen. */
export const InvalidCheck: React.FC<InvalidCheckProps> = (props) => {

	// Get our responsive layout so we can check its validity.
	const responsiveLayout = useResponsiveLayout();

	let invalidMessages: string[] = [];

	const forceAlertMessages = props.forceAlertMessages || [];
	const constantAlertMessages = CONSTANT.alertMessages || [];
	const alertMessages = forceAlertMessages.length ? forceAlertMessages : constantAlertMessages;
	if (alertMessages.length) {
		invalidMessages = alertMessages;
	}
	else if (props.isForceInternetExplorer || /MSIE|Trident/.test(window.navigator.userAgent)) {
		// Honestly, we may never even get here. Internet Explorer may cause the application to fail before we ever run this check. Nice to keep just in case, though.
		invalidMessages = [`It looks like you're using Internet Explorer`, 'Internet Explorer is not supported for this application.', 'Please, I beg you - use a more modern browser.'];
	}
	else if (props.isForceInvalidLayout || isInvalidLayoutForApplication(responsiveLayout)) {
		invalidMessages = ['Your screen size and/or rotation are invalid for this application', 'Consider rotating your device or using a different device.'];
	}

	// If we have messages, show. And don't show the children underneath.
	// TODO - This destroys our render tree, and may cause expensive recomputation in the case of the invalid layout case.
	if (invalidMessages && invalidMessages.length) {
		return <InvalidCenter messages={invalidMessages} />;
	}
	else {
		return <>{props.children}</>;
	}
};

export interface InvalidCenterProps {
	/** Messages to show. Each will become its own line. */
	messages: string[];
}

const InvalidCenter: React.FC<InvalidCenterProps> = (props) => {

	const theme = useCurrentTheme();

	// First message will get a larger size.
	const [firstMessage, ...otherMessages] = props.messages;

	// Other messages become regular text.
	const otherMessagesText = otherMessages.map((m) => {
		return (
			<Text key={m}>{m}</Text>
		);
	});

	/*
		Structure:
		- Outer FlexRow wrapper that takes up 100% of parent
			- Inner Flex that is centered and is sized to its contents
	*/
	return (
		<InvalidCenterWrapper alignItems='center'>
			<Flex>
				<Icon type={iconTypes.alert} fill={theme.color.error} height={titleHeight} />
				<PaddedSubtitle>{firstMessage}</PaddedSubtitle>
				{otherMessagesText}
			</Flex>
		</InvalidCenterWrapper>
	);
};

const InvalidCenterWrapper = styled(FlexRow)`
	/* Pad to ensure the inner Flex content doesn't run up against the edge. */
	padding: calc(${edgePaddingValue} * 3);
	text-align: center;
`;

const PaddedSubtitle = addPadding(Subtitle, flowPaddingValue);