import * as React from 'react';
import { icons, SVGIconTypeName, SVGIconTypeUrl } from '@wbtdevlocal/assets';
import { isInEnum, mapEnumValue } from '@wbtdevlocal/bridge-iso';
import { styled, StyledFC } from '../theme/styled';

interface SVGLoadState {
	isError: boolean;
	svg: string | null;
}

export interface UrlIconProps {
	value: SVGIconTypeName;
}

/**
 * Not for external use. Use 'Icon' instead.
 */
export const UrlIcon: StyledFC<UrlIconProps> = (props) => {
	const { value, className } = props;
	const [state, setState] = React.useState<SVGLoadState>(() => {
		return {
			isError: false,
			svg: null
		};
	});

	React.useEffect(() => {
		let isUnmounted = false;

		// Look for a url.
		if (isInEnum(SVGIconTypeName, value)) {
			const url = mapEnumValue(SVGIconTypeName, SVGIconTypeUrl, value);
			if (url) {
				/*
					Need to test?
					1. Enable CORS on static file server
					2. Add url prefix if necessary
					3. Add setTimeout
				*/
				fetch(url)
					.then(res => res.text())
					.then((svg) => {
						if (!isUnmounted) {
							if (svg.startsWith('<svg')) {
								setState({
									isError: false,
									svg: svg
								});
							}
							else {
								setState({
									isError: true,
									svg: null
								});
							}
						}
					})
					.catch((e) => {
						console.error(e, url);
						if (!isUnmounted) {
							setState({
								isError: true,
								svg: null
							});
						}
					});
				setState({
					isError: false,
					svg: null
				});
			}
		}

		return () => {
			isUnmounted = true;
		};
	}, [value]);

	const { isError, svg } = state;

	if (isError || !svg) {
		const LoadingComponent = icons.demoDiamond; // TODO - get a dedicated static loading SVG
		return <LoadingComponent className={className} />;
	}

	return (
		<IconContainer className={className} dangerouslySetInnerHTML={{ __html: svg }} />
	);
};

const IconContainer = styled.span`
	display: inline-block;
	position: relative;
	svg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
`;