import * as React from 'react';
import styled from 'styled-components';
import { Icon } from '@/index/core/icon/icon';
import { SpinnerIcon } from '@/index/core/icon/icon-spinner';
import { isDebug } from '@/index/utility/debug';
import { ErrorPanel } from '../error/error-panel';
import { MediumBodyText } from '../text/text-shared';
import { themeTokens } from '../theme/theme-root';
import { useBatchResponse } from './data';
import { parseRequestResultError } from './error-parse';

export const DefaultErrorLoad: React.FC = () => {
	const { error } = useBatchResponse();

	if (error) {

		if (isDebug()) {
			const { title, detail, text } = parseRequestResultError(error, true);

			return (
				<ErrorPanel
					title={title}
					description={detail || 'This error occurred while trying to load app data.'}
					additional={
						<TextContainer>
							{text.map((line) => {
								return <MediumBodyText key={line}>{line}</MediumBodyText>;
							})}
						</TextContainer>
					}
				/>
			);
		}
		else {
			return (
				<ErrorPanel
					title='Uh-oh! The data could not be loaded.'
				/>
			);
		}
	}

	return (
		<CenterContainer>
			<LargeSpinnerIcon type={SpinnerIcon} />
		</CenterContainer>
	);
};

const CenterContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 1rem 0;
`;

const LargeSpinnerIcon = styled(Icon)`
	color: ${themeTokens.text.distinct}; // Cannot have opacity
	width: 4rem;
	height: 4rem;
`;

const TextContainer = styled.div`
	text-align: left;
`;