import * as React from 'react';
import { decorate } from '@/test/storybook/decorate';
import { Text } from '@/core/symbol/text';
import { iconTypes, Icon } from '@/core/symbol/icon';

export default { title: 'Unit/Components/Icon' };

export const Icons = decorate(() => {

	const iconList = Object.keys(iconTypes).map((iconName) => {
		const icon = iconTypes[iconName as keyof typeof iconTypes];

		return (
			<div key={iconName}>
				<Text>{iconName}</Text>
				<Icon type={icon} />
			</div>
		);
	});

	return (
		<>
			{iconList}
		</>
	);
});