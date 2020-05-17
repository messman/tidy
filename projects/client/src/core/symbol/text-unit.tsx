import * as React from 'react';
import { TextInline, SubTextInline } from './text';
import { styled } from '../style/styled';

export interface TextUnitProps {
	text: string,
	unit: string
}

export const TextUnit: React.FC<TextUnitProps> = (props) => {
	return (
		<TextInline>
			{props.text}
			<SubTextUnit>{props.unit}</SubTextUnit>
		</TextInline>
	);
}

const SubTextUnit = styled(SubTextInline)`
	vertical-align: baseline;
	margin-left: .1rem;
`;