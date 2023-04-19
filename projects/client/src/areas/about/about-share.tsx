import * as React from 'react';
import styled from 'styled-components';
import { BaseButton, StandardButton } from '@/core/form/button';
import { Heading, Paragraph } from '@/core/text';
import { Block, borderRadiusStyle, Spacing } from '@/core/theme/box';
import { useSafeTimer } from '@/services/lifecycle/timer';
import { setClipboard } from '@messman/react-common';
import { icons } from '@wbtdevlocal/assets';

enum ShareStatus {
	default,
	success,
	failure
}

const canShare = !!navigator.share;
const site = 'https://wellsbeachtime.com';

export const AboutShare: React.FC = () => {

	const [copyStatus, setCopyStatus] = React.useState(ShareStatus.default);
	const [shareStatus, setShareStatus] = React.useState(ShareStatus.default);

	const { change: copyTimerChange } = useSafeTimer(() => {
		setCopyStatus(ShareStatus.default);
	});
	const { change: shareTimerChange } = useSafeTimer(() => {
		setShareStatus(ShareStatus.default);
	});

	async function onClickCopyLink() {
		const result = await setClipboard(site);
		setCopyStatus(result ? ShareStatus.success : ShareStatus.failure);
		copyTimerChange(2000);
	}

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

	const copyLinkText = copyStatus === ShareStatus.default ? 'Copy Link' : (copyStatus === ShareStatus.success ? 'Link Copied!' : 'Copy Failed');

	let shareLinkText = 'No Device Sharing';
	if (canShare) {
		shareLinkText = shareStatus === ShareStatus.default ? 'Share From Device' : (shareStatus === ShareStatus.success ? 'Shared From Device!' : 'Device Share Failed');
	}

	return (
		<>
			<Heading>Share</Heading>
			<Paragraph>
				You can bookmark this webpage or save it to your mobile device's home screen to view it at any time.
			</Paragraph>
			<Paragraph>
				Others can access this webpage by scanning the QR code below. You can also share the webpage with the sharing buttons.
			</Paragraph>
			<Block.Bat08 />
			<ShareContainer>
				<QRImage alt='QR code' title='QR code for wellsbeachtime.com' src='/qr-code.svg' />
				<ButtonContainer>
					<StandardButton
						isDisabled={false}
						onClick={onClickCopyLink}
						leftIcon={icons.navigationUrl}
						justifyContent='center'
					>
						{copyLinkText}
					</StandardButton>
					<Block.Bat08 />
					<StandardButton
						isDisabled={!canShare}
						onClick={onClickShare}
						leftIcon={icons.navigationShare}
						justifyContent='center'
					>
						{shareLinkText}
					</StandardButton>
				</ButtonContainer>
			</ShareContainer>
		</>
	);
};

const ShareContainer = styled.div`
	display: flex;
	justify-content: space-evenly;
	align-items: stretch;
	flex-wrap: wrap;
	gap: ${Spacing.bat08};
`;

const QRImage = styled.img`
	width: 6rem;
	height: 6rem;
	border: 4px solid ${p => p.theme.common.brand1.main};
	${borderRadiusStyle}
`;

const ButtonContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;

	${BaseButton} {
		flex: 1;
		white-space: nowrap;
	}
`;