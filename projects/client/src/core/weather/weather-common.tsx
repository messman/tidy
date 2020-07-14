import styled from 'styled-components';
import { Icon } from '../symbol/icon';

const iconSpace = {
	close: .2,
	default: .5,
	far: .8
};

export interface SpacedIconProps {
	spacing?: keyof typeof iconSpace;
	spaceDirection?: 'left' | 'right';
}

export const SpacedIcon = styled(Icon)<SpacedIconProps>((props) => {
	const ruleName = `margin-${props.spaceDirection}`;
	return {
		[ruleName]: `${iconSpace[props.spacing as keyof typeof iconSpace]}rem`
	};
});

SpacedIcon.defaultProps = {
	spacing: 'default',
	spaceDirection: 'right'
};