import styled from 'styled-components';
import { Icon } from '../symbol/icon';

const iconSpace = {
	close: .2,
	default: .5,
	far: .8
};

export interface SpacedIconProps {
	spacing?: keyof typeof iconSpace;
}

export const SpacedIcon = styled(Icon) <SpacedIconProps>`
	margin-right: ${p => iconSpace[p.spacing as keyof typeof iconSpace]}rem;
`;

SpacedIcon.defaultProps = {
	spacing: 'default'
};