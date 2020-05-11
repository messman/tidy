import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app';
import { Wrapper } from './wrapper';

ReactDOM.render(
	<Wrapper>
		<App />
	</Wrapper>,
	document.getElementById('react-root')
);