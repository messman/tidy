import * as React from 'react';
import { CosmosFixture } from '@/test';
import { icons } from '@wbtdevlocal/assets';
import { SectionHeader } from '../section/section';
import { Block, Padding } from '../theme/box';
import { GroupButton, GroupContainer, GroupKeyValue, GroupRaisedContainer } from './group';

export default CosmosFixture.create(() => {

	function onClick() {
		alert('!Clicked!');
	}

	const text = 'Longer Content That Takes Up More Space';

	return (
		<Padding.Dog16>

			<SectionHeader>Regular</SectionHeader>
			<GroupContainer>
				<GroupKeyValue label='Regular Key'>Regular Value</GroupKeyValue>
				<GroupKeyValue label='Disabled Key' isDisabled>Disabled Value</GroupKeyValue>
				<GroupKeyValue label='Extra Long Key' title={text}>{text}</GroupKeyValue>
				<GroupKeyValue label='Clickable' onClick={onClick}>Clickable</GroupKeyValue>
				<GroupKeyValue label='Clickable' isDisabled onClick={onClick}>Disabled Clickable</GroupKeyValue>
			</GroupContainer>
			<Block.Elf24 />

			<SectionHeader>With Icons</SectionHeader>
			<GroupContainer>
				<GroupKeyValue label='Icon A' icon={icons.demoCube}>Looks Good</GroupKeyValue>
				<GroupKeyValue label='Chat' icon={icons.communicationChat} onClick={onClick}>5 Messages</GroupKeyValue>
				<GroupKeyValue label='Clickable' icon={icons.communicationAvatar} isDisabled onClick={onClick}>Disabled Clickable</GroupKeyValue>
				<GroupButton label='Button Clickable' icon={icons.actionAdd} onClick={onClick} />
				<GroupKeyValue label='Something Else' icon={icons.contentFolder}>Bueno</GroupKeyValue>
			</GroupContainer>
			<Block.Elf24 />

			<SectionHeader>Buttons</SectionHeader>
			<GroupRaisedContainer>
				<GroupButton label='Sign Out' onClick={onClick} />
				<GroupButton label='Switch Profile' isDisabled onClick={onClick} />
				<GroupButton label='Delete Account' onClick={onClick} />
			</GroupRaisedContainer>
			<Block.Dog16 />

			<GroupRaisedContainer>
				<GroupButton label='Execute Operation' onClick={onClick} hasArrow />
			</GroupRaisedContainer>
			<Block.Elf24 />

			<SectionHeader>Mixed With Buttons</SectionHeader>
			<GroupContainer>
				<GroupKeyValue label='Test' >Hello!</GroupKeyValue>
				<GroupButton label='Add New Entry...' onClick={onClick} />
				<GroupButton label='Clear All Entries' onClick={onClick} />
			</GroupContainer>
			<Block.Elf24 />

		</Padding.Dog16>
	);
}, {

});