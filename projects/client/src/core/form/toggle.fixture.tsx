import { CosmosFixture } from '@/test';
import * as React from 'react';
import { GroupContainer, GroupKeyValue } from '../group/group';
import { Block } from '../theme/box';
import { GroupKeyValueToggle } from './toggle';

export default CosmosFixture.create(() => {

	const [isGPS, setIsGPS] = React.useState(false);

	function onToggle(value: boolean) {
		setIsGPS(value);
	}

	function onToggleOpposite(value: boolean) {
		setIsGPS(!value);
	}

	function onClick() {
		window.alert();
	}

	return (
		<>
			<GroupContainer>
				<GroupKeyValueToggle label='GPS' value={isGPS} onToggle={onToggle}>{isGPS ? 'Yes' : 'No'}</GroupKeyValueToggle>

			</GroupContainer>
			<Block.Dog16 />
			<GroupContainer>
				<GroupKeyValue label='Text Here'>Text Here</GroupKeyValue>
				<GroupKeyValueToggle label='GPS' value={isGPS} isDisabled={true} onToggle={onToggle}>{isGPS ? 'Yes' : 'No'}</GroupKeyValueToggle>
				<GroupKeyValue label='WiFi' onClick={onClick}>Off</GroupKeyValue>
				<GroupKeyValueToggle label='GPS' value={!isGPS} onToggle={onToggleOpposite}>{!isGPS ? 'Yes' : 'No'}</GroupKeyValueToggle>
				<GroupKeyValue label='Cellular' onClick={onClick}>On</GroupKeyValue>
			</GroupContainer>
		</>
	);
}, {
	hasMargin: true
});
