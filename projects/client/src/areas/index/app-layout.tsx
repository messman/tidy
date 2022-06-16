import * as React from 'react';
import { isCompactWidthLayout } from '@/services/layout/window-layout';
import { useWindowMediaLayout } from '@messman/react-common';
import { CompactApplicationLayout } from './app-layout-compact';
import { WideApplicationLayout } from './app-layout-wide';

export const ApplicationLayout: React.FC = (props) => {
	const { children } = props;
	const { widthBreakpoint } = useWindowMediaLayout();
	const Layout = isCompactWidthLayout(widthBreakpoint) ? CompactApplicationLayout : WideApplicationLayout;

	return (
		<Layout>
			{children}
		</Layout>
	);
};