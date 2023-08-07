import * as React from 'react';
import { isCompactWidthLayout } from '@/index/core/layout/window-layout';
import { useWindowMediaLayout } from '@messman/react-common';
import { CompactApplicationLayout } from './app-layout-compact';
import { WideApplicationLayout } from './app-layout-wide';

export const ApplicationLayout: React.FC<React.PropsWithChildren> = (props) => {
	const { children } = props;
	const { widthBreakpoint } = useWindowMediaLayout();
	const Layout = isCompactWidthLayout(widthBreakpoint) ? CompactApplicationLayout : WideApplicationLayout;

	return (
		<Layout>
			{children}
		</Layout>
	);
};