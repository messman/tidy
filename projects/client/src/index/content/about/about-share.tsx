import * as React from 'react';
import styled from 'styled-components';
import { BaseButton, Button } from '@/index/core/form/button';
import { Panel, PanelPadding } from '@/index/core/layout/layout-panel';
import { useSafeTimer } from '@/index/core/lifecycle/timer';
import { borderRadiusStyle, Spacing } from '@/index/core/primitive/primitive-design';
import { MediumBodyText } from '@/index/core/text/text-shared';
import { DEFINE } from '@/index/define';
import { setClipboard } from '@messman/react-common';
import { icons } from '@wbtdevlocal/assets';
import { PanelParagraph, SectionContainer, SectionHeading } from './about-shared';

enum ShareStatus {
	default,
	success,
	failure
}

const canUseDeviceShare = !!navigator.share || DEFINE.isDevelopment;
const site = 'https://wellsbeachtime.com';

export const AboutShare: React.FC = () => {

	return (
		<SectionContainer>
			<SectionHeading>Share & Save</SectionHeading>
			<DeviceSave />
			{canUseDeviceShare && <DeviceShare />}
			<Copy />
			<Panel title='QR Code'>
				<PanelPadding>
					<MediumBodyText>
						Another device can scan this QR code to find this app.
						This QR code can be saved as an image and printed.
					</MediumBodyText>
					<QRImage alt='QR code' title='QR code for wellsbeachtime.com' src='/qr-code.svg' />
				</PanelPadding>
			</Panel>
		</SectionContainer>
	);
};

// const isIOS = (() => {
// 	return [
// 		'iPad Simulator',
// 		'iPhone Simulator',
// 		'iPod Simulator',
// 		'iPad',
// 		'iPhone',
// 		'iPod'
// 	].includes(navigator.platform)
// 		// iPad on iOS 13 detection
// 		|| (navigator.userAgent.includes("Mac") && "ontouchend" in document);
// })();

// const isAndroid = (() => {
// 	const ua = navigator.userAgent.toLowerCase();
// 	return ua.indexOf("android") > -1;
// })();

// Not using this right now because why not just keep showing the instruction? NBD.
// const isKnownSavedToHomeScreen = window.matchMedia('(display-mode: standalone)').matches;

const DeviceSave: React.FC = () => {
	/*
		Note: while we can somewhat reliably see if the user is on iOS or Android, and
		we can maybe see if they've already added the app to the home screen, there would still
		be more work to be done to make sure they're on a browser that can save to the home screen.
		Better to just include all instruction.
	*/
	return (
		<Panel title='Save'>
			<PanelPadding>

				<MediumBodyText>
					You can save this web app to a device's home screen or bookmarks bar.
				</MediumBodyText>
				<MediumBodyText>
					On iOS Safari, tap the browser's share icon and choose "Add to Home Screen".
				</MediumBodyText>
				<MediumBodyText>
					on Android, open the browser's menu and choose "Add to Home screen".
				</MediumBodyText>
			</PanelPadding>
		</Panel>
	);
};

const Copy: React.FC = () => {

	const [copyStatus, setCopyStatus] = React.useState(ShareStatus.default);

	const { change: copyTimerChange } = useSafeTimer(() => {
		setCopyStatus(ShareStatus.default);
	});

	async function onClickCopyLink() {
		const result = await setClipboard(site);
		setCopyStatus(result ? ShareStatus.success : ShareStatus.failure);
		copyTimerChange(2000);
	}

	const copyLinkText = copyStatus === ShareStatus.default ? 'Copy Link' : (copyStatus === ShareStatus.success ? 'Link Copied!' : 'Copy Failed');

	return (
		<Panel title='Copy Link'>
			<PanelPadding>
				<MediumBodyText>
					You can copy the URL to this app and paste it to share.
				</MediumBodyText>
				<ButtonContainer>
					<Button
						onClick={onClickCopyLink}
						leftIcon={icons.toolLink}
						justifyContent='center'
					>
						{copyLinkText}
					</Button>
				</ButtonContainer>
			</PanelPadding>
		</Panel>
	);
};

const DeviceShare: React.FC = () => {

	const [shareStatus, setShareStatus] = React.useState(ShareStatus.default);

	const { change: shareTimerChange } = useSafeTimer(() => {
		setShareStatus(ShareStatus.default);
	});

	const shareLinkText = (() => {
		if (shareStatus === ShareStatus.failure) {
			return 'Device Share Failed';
		}
		return 'Share From Device';
	})();

	async function onClickShare() {
		try {
			await navigator.share({
				title: 'Wells Beach Time',
				url: site
			});
			setShareStatus(ShareStatus.success);
		}
		catch (e) {
			console.error('Web Share', e);
			setShareStatus(ShareStatus.failure);
		}
		shareTimerChange(2000);
	}

	return (
		<Panel title='Device Share'>
			<PanelPadding>
				<MediumBodyText>
					Use your device's share controls to share this app with others.
				</MediumBodyText>
				<ButtonContainer>
					<Button
						onClick={onClickShare}
						leftIcon={icons.toolUpload}
						justifyContent='center'
					>
						{shareLinkText}
					</Button>
				</ButtonContainer>
			</PanelPadding>
		</Panel>
	);
};

const QRImage = styled.img`
	display: block;
	margin: 1rem auto 0 auto;
	width: 100%;
	aspect-ratio: 1;
	max-width: 13rem;
	${borderRadiusStyle}
`;

const ButtonContainer = styled.div`
	flex: 1;
	display: flex;
	margin-top: 1rem;

	${BaseButton} {
		flex: 1;
		white-space: nowrap;
	}
`;