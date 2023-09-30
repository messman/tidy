import * as React from 'react';

export interface SVGIcon extends React.FC<React.SVGAttributes<SVGElement>> {
	/** key of the name enum, both for debug purposes and dynamically matching. */
	iconName: string;
}

/**
 * #REF_ASSETS_ICONS_URL
 * 
 * Thanks to @svgr/webpack and file-loader,
 * 'require' of the SVG generates both the url
 * (like 'icons/A45FE232...9BD0342A.svg') and
 * the actual inline SVG.
 * SVGR sees that the default export was already taken by the URL and
 * so it writes the SVG component to the "ReactComponent" property.
 */
interface InnerSVGDef {
	/** The URL generated by file-loader. */
	default: string;
	ReactComponent: SVGIcon;
}

/** Dictionary of (keys of name enum) -> (URL). */
export const SVGIconUrl = {

	// Astro
	astroMoondown: '',
	astroMoonrise: '',
	astroSundown: '',
	astroSunrise: '',

	// Brand
	brandUmbrellaUnclipped: '',

	// Core / Arrow
	coreArrowChevronDown: '',
	coreArrowChevronLeft: '',
	coreArrowChevronRight: '',
	coreArrowChevronUp: '',
	coreArrowDown: '',
	coreArrowInlineBack: '',
	coreArrowInlineForward: '',
	coreArrowLeft: '',
	coreArrowRight: '',
	coreArrowUp: '',

	// Core
	coreAdd: '',
	coreCalendar: '',
	coreCheck: '',
	coreClose: '',
	coreEducation: '',
	coreHeartFilled: '',
	coreMinus: '',
	coreNewSparkle: '',

	// Inform
	informBadgeOutline: '',
	informBadgeSolid: '',
	informCheckCircleOutline: '',
	informCheckCircleSolid: '',
	informCheckOpen: '',
	informCircleSolid: '',
	informCrossCircleOutline: '',
	informCrossCircleSolid: '',
	informExclaimCircle: '',
	informExclaimOpen: '',
	informInfoCircle: '',
	informQuestionCircle: '',
	informTriangleSolid: '',
	informWarningOutline: '',
	informWarningSolid: '',

	// Navigation
	navigationDashboard: '',
	navigationDev: '',
	navigationHome: '',
	navigationLocation: '',
	navigationMenu: '',
	navigationSettings: '',
	navigationShare: '',
	navigationUrl: '',

	// Status
	statusAlertOutline: '',
	statusAlertSolid: '',
	statusErrorOutline: '',
	statusErrorSolid: '',
	statusInfoOutline: '',
	statusInfoSolid: '',
	statusSuccessOutline: '',
	statusSuccessSolid: '',
	statusCircle: '',
	statusTriangle: '',

	// Moon
	moonFirstQuarter: '',
	moonFull: '',
	moonNew: '',
	moonThirdQuarter: '',
	moonWaningCrescent: '',
	moonWaningGibbous: '',
	moonWaxingCrescent: '',
	moonWaxingGibbous: '',

	// Tide
	tideDownLong: '',
	tideDown: '',
	tideUpLong: '',
	tideUp: '',
	tideWave: '',

	// Tool
	toolDotsHorizontal: '',
	toolFilter: '',
	toolLinkOut: '',
	toolLink: '',
	toolQuarterTurn: '',
	toolSupport: '',
	toolUpload: '',

	// Weather
	weatherCloud: '',
	weatherClouds: '',
	weatherCloudyMoon: '',
	weatherCloudySun: '',
	weatherCloudyWind: '',
	weatherFog: '',
	weatherHail: '',
	weatherLightningMoon: '',
	weatherLightningSun: '',
	weatherLightning: '',
	weatherMoon: '',
	weatherPressure: '',
	weatherQuestion: '',
	weatherRainMoon: '',
	weatherRainSun: '',
	weatherRain: '',
	weatherSnowflake: '',
	weatherSun: '',
	weatherTemperatureHot: '',
	weatherTemperature: '',
	weatherWater: '',
	weatherWind: '',

	// Wind
	windRose: '',
	windArrow: ''
} satisfies Record<string, string>;

/**
 * Provides a reverse-lookup of URL -> icon name.
 * Used to find the icon component if one exists on the page already.
 * 
 * #REF_ASSETS_ICONS_URL
 */
export const SVGIconUrlNameLookup: Record<string, string> = {};


/**
 * Creates the correctly-typed React SVG component.
 * Also adds the URL of the component to our dictionary.
*/
export function create(name: keyof typeof SVGIconUrl, result: any): SVGIcon {
	const inner = result as InnerSVGDef;

	inner.ReactComponent.iconName = name;
	// #REF_ASSETS_ICONS_URL
	SVGIconUrl[name] = inner.default;
	SVGIconUrlNameLookup[inner.default] = name;

	return inner.ReactComponent;
}

export const emptyIcon = '_empty_';
export type EmptyIconName = typeof emptyIcon;