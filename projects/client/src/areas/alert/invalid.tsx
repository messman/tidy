import * as React from 'react';
import { Flex, FlexRow } from '@/core/layout/flex';
import { styled } from '@/core/style/styled';
import { useResponsiveLayout, isInvalidLayoutForApplication } from '@/services/layout/responsive-layout';
import { edgePaddingValue, flowPaddingValue } from '@/core/style/common';
import { Icon, iconTypes } from '@/core/symbol/icon';
import { Text, Subtitle } from '@/core/symbol/text';
import { CONSTANT } from '@/services/constant';
import { useCurrentTheme } from '@/core/style/theme';

interface InvalidCheckProps {
	/** Used for testing. */
	forceAlertMessages?: string[],
	/** Used for testing. */
	isForceInternetExplorer?: boolean,
	/** Used for testing. */
	isForceInvalidLayout?: boolean,
}

export const InvalidCheck: React.FC<InvalidCheckProps> = (props) => {

	const responsiveLayout = useResponsiveLayout();

	let invalidMessages: string[] = [];

	const forceAlertMessages = props.forceAlertMessages || [];
	const constantAlertMessages = CONSTANT.alertMessages || [];
	const alertMessages = forceAlertMessages.length ? forceAlertMessages : constantAlertMessages;
	if (alertMessages.length) {
		invalidMessages = alertMessages;
	}
	else if (props.isForceInternetExplorer || /MSIE|Trident/.test(window.navigator.userAgent)) {
		invalidMessages = [`It looks like you're using Internet Explorer`, 'Internet Explorer is not supported for this application.', 'Please, I beg you - use a more modern browser.'];
	}
	else if (props.isForceInvalidLayout || isInvalidLayoutForApplication(responsiveLayout)) {
		invalidMessages = ['Your screen size and/or rotation are invalid for this application', 'Consider rotating your device or using a different device.'];
	}

	if (invalidMessages && invalidMessages.length) {
		return <InvalidCenter messages={invalidMessages} />;
	}
	else {
		return <>{props.children}</>;
	}
}

export interface InvalidCenterProps {
	messages: string[]
}

const InvalidCenter: React.FC<InvalidCenterProps> = (props) => {

	const theme = useCurrentTheme();

	const [firstMessage, ...otherMessages] = props.messages;

	const otherMessagesText = otherMessages.map((m) => {
		return (
			<Text key={m}>{m}</Text>
		);
	});

	return (
		<InvalidCenterWrapper alignItems='center'>
			<Flex>
				<Icon type={iconTypes.alert} fill={theme.color.error} height='3rem' />
				<CenterPadding>
					<Subtitle>{firstMessage}</Subtitle>
				</CenterPadding>
				{otherMessagesText}
			</Flex>
		</InvalidCenterWrapper>
	);
}

const InvalidCenterWrapper = styled(FlexRow)`
	padding: calc(${edgePaddingValue} * 3);
	text-align: center;
`;

const CenterPadding = styled.div`
	margin: ${flowPaddingValue};
`;