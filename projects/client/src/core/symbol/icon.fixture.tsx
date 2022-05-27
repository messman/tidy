import * as React from 'react';
import { Icon, iconTypes } from '@/core/symbol/icon';
import { Text } from '@/core/symbol/text';
import { CosmosFixture } from '@/test';

export default CosmosFixture.create(() => {
	const iconList = Object.keys(iconTypes).map((iconName) => {
		const icon = iconTypes[iconName as keyof typeof iconTypes];

		return (
			<div key={iconName}>
				<Text>{iconName}</Text>
				<Icon type={icon} height='2rem' />
			</div>
		);
	});

	return (
		<>
			{iconList}
		</>
	);
}, {
	hasMargin: true
});
