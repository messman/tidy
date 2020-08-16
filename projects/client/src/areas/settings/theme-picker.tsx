import * as React from 'react';
import { Toggle } from '@/core/common/toggle';
import { themes, useLocalStorageTheme } from '@/core/style/theme';

const themeEntries = themes.map((theme) => theme.name);

export const ThemePicker: React.FC = () => {

	const [themeIndex, setThemeIndex] = useLocalStorageTheme();

	function onClick(index: number): void {
		setThemeIndex(index);
	}

	return (
		<Toggle selectedEntryIndex={themeIndex} onSelected={onClick} entries={themeEntries} />
	);
};