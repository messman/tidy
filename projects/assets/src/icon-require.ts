import * as React from 'react';

export interface SVGIconType extends React.FC<React.SVGAttributes<SVGElement>> {
	/** key of the name enum, both for debug purposes and dynamically matching. */
	iconName: string;
}

/**
 * Thanks to @svgr/webpack and file-loader,
 * 'require' of the SVG generates both the url
 * (like 'icons/A45FE232...9BD0342A.svg') and
 * the actual inline SVG.
 */
interface InnerSVGDef {
	default: string;
	ReactComponent: SVGIconType;
}

/** Dictionary of (keys of name enum) -> (URL). */
export const SVGIconTypeUrl = {} as unknown as Record<keyof typeof SVGIconTypeName, string>;

/**
 * Creates the correctly-typed React SVG component.
 * Also adds the URL of the component to our dictionary.
*/
export function create(name: keyof typeof SVGIconTypeName, result: any): SVGIconType {
	const inner = result as InnerSVGDef;

	inner.ReactComponent.iconName = name;
	SVGIconTypeUrl[name] = inner.default;

	return inner.ReactComponent;
}

export type EmptyIconName = 'empty';

/**
 * Serves to ensure all names are unique.
 */
export enum SVGIconTypeName {

	// Action
	actionAdd,
	actionCheckBold,
	actionCheck,
	actionClose,
	actionFilter,
	actionMinus,

	// Arrow
	arrowChevronDown,
	arrowChevronLeftInline,
	arrowChevronLeft,
	arrowChevronRightInline,
	arrowChevronRight,
	arrowChevronUp,
	arrowDown,
	arrowLeft,
	arrowOut,
	arrowRight,
	arrowUp,

	// Brand
	brandUmbrella,

	// Decoration
	decorationLike,

	// Expression
	expressionHappy,
	expressionSad,
	expressionStraight,

	// Loader
	loaderQuarterTurn,

	// Moon
	moonFirstQuarter,
	moonFull,
	moonNew,
	moonThirdQuarter,
	moonWaningCrescent,
	moonWaningGibbous,
	moonWaxingCrescent,
	moonWaxingGibbous,

	// Navigation
	navigationDashboard,
	navigationDev,
	navigationHome,
	navigationLocation,
	navigationMenu,
	navigationSettings,
	navigationUrl,

	// Status
	statusAlertOutline,
	statusAlertSolid,
	statusErrorOutline,
	statusErrorSolid,
	statusInfoOutline,
	statusInfoSolid,
	statusSuccessOutline,
	statusSuccessSolid,
	statusCircle,
	statusTriangle,

	// Tide
	tideDownLong,
	tideDown,
	tideUpLong,
	tideUp,
	tideWave,

	// Weather
	weatherCloud,
	weatherClouds,
	weatherCloudyMoon,
	weatherCloudySun,
	weatherCloudyWind,
	weatherFog,
	weatherHail,
	weatherLightningMoon,
	weatherLightningSun,
	weatherLightning,
	weatherMoon,
	weatherPressure,
	weatherQuestion,
	weatherRainMoon,
	weatherRainSun,
	weatherRain,
	weatherSnowflake,
	weatherSun,
	weatherSundown,
	weatherSunrise,
	weatherTemperatureCold,
	weatherTemperatureHot,
	weatherTemperature,
	weatherWater,
	weatherWind
}
