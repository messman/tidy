import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApplicationResponsiveLayout } from '@/areas/layout/layout';
import { MenuBar } from '@/areas/menu-bar/menu-bar';
import { Wrapper } from './wrapper';

ReactDOM.render(
	<Wrapper>
		<MenuBar>
			<ApplicationResponsiveLayout />
		</MenuBar>
	</Wrapper>,
	document.getElementById('react-root')
);
