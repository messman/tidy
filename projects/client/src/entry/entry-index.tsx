import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Wrapper } from './wrapper';
import { ApplicationResponsiveLayout } from '@/areas/layout/layout';

ReactDOM.render(
	<Wrapper>
		<ApplicationResponsiveLayout />
	</Wrapper>,
	document.getElementById('react-root')
);