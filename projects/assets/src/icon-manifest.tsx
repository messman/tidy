import { create } from './icon-require';

/*
	Icon build process:
	Icon designs are held in Figma. They are exported from Figma as SVG.
	Designs may include any colors, but only one color may be overridden by code:
	in the SVGR options (replaceAttrValues option of svgr - https://github.com/gregberge/svgr/issues/163),
	we replace black (#000) with the string 'currentColor'. This means that those paths will use the CSS
	'color' value as their color, which can be controlled by styled-components.
	Alternatively, *all* colors in the SVG can be set to another color by setting css 'fill' property.

	For more info, see the webpack build for this project. Look for SVG-related processing.
*/

/*
	Icons are listed in alphabetical order to match their input directory listing.
	Note: URLs will use a directory prefix.
*/

// Astro
export const astroMoondown = create('astroMoondown', require('@/static/icons/astro/moondown.svg'));
export const astroMoonrise = create('astroMoonrise', require('@/static/icons/astro/moonrise.svg'));
export const astroSundown = create('astroSundown', require('@/static/icons/astro/sundown.svg'));
export const astroSunrise = create('astroSunrise', require('@/static/icons/astro/sunrise.svg'));

// Core / Arrow
export const coreArrowChevronDown = create('coreArrowChevronDown', require('@/static/icons/core/arrow/chevron-down.svg'));
export const coreArrowChevronLeft = create('coreArrowChevronLeft', require('@/static/icons/core/arrow/chevron-left.svg'));
export const coreArrowChevronRight = create('coreArrowChevronRight', require('@/static/icons/core/arrow/chevron-right.svg'));
export const coreArrowChevronUp = create('coreArrowChevronUp', require('@/static/icons/core/arrow/chevron-up.svg'));
export const coreArrowDown = create('coreArrowDown', require('@/static/icons/core/arrow/down.svg'));
export const coreArrowInlineBack = create('coreArrowInlineBack', require('@/static/icons/core/arrow/inline-back.svg'));
export const coreArrowInlineForward = create('coreArrowInlineForward', require('@/static/icons/core/arrow/inline-forward.svg'));
export const coreArrowLeft = create('coreArrowLeft', require('@/static/icons/core/arrow/left.svg'));
export const coreArrowRight = create('coreArrowRight', require('@/static/icons/core/arrow/right.svg'));
export const coreArrowUp = create('coreArrowUp', require('@/static/icons/core/arrow/up.svg'));

// Core
export const coreAdd = create('coreAdd', require('@/static/icons/core/add.svg'));
export const coreCalendar = create('coreCalendar', require('@/static/icons/core/calendar.svg'));
export const coreCheck = create('coreCheck', require('@/static/icons/core/check.svg'));
export const coreClose = create('coreClose', require('@/static/icons/core/close.svg'));
export const coreEducation = create('coreEducation', require('@/static/icons/core/education.svg'));
export const coreHeartFilled = create('coreHeartFilled', require('@/static/icons/core/heart-filled.svg'));
export const coreMinus = create('coreMinus', require('@/static/icons/core/minus.svg'));
export const coreNewSparkle = create('coreNewSparkle', require('@/static/icons/core/new-sparkle.svg'));

// Inform
export const informBadgeOutline = create('informBadgeOutline', require('@/static/icons/inform/badge-outline.svg'));
export const informBadgeSolid = create('informBadgeSolid', require('@/static/icons/inform/badge-solid.svg'));
export const informCheckCircleOutline = create('informCheckCircleOutline', require('@/static/icons/inform/check-circle-outline.svg'));
export const informCheckCircleSolid = create('informCheckCircleSolid', require('@/static/icons/inform/check-circle-solid.svg'));
export const informCheckOpen = create('informCheckOpen', require('@/static/icons/inform/check-open.svg'));
export const informCircleSolid = create('informCircleSolid', require('@/static/icons/inform/circle-solid.svg'));
export const informCrossCircleOutline = create('informCrossCircleOutline', require('@/static/icons/inform/cross-circle-outline.svg'));
export const informCrossCircleSolid = create('informCrossCircleSolid', require('@/static/icons/inform/cross-circle-solid.svg'));
export const informExclaimCircle = create('informExclaimCircle', require('@/static/icons/inform/exclaim-circle.svg'));
export const informExclaimOpen = create('informExclaimOpen', require('@/static/icons/inform/exclaim-open.svg'));
export const informInfoCircle = create('informInfoCircle', require('@/static/icons/inform/info-circle.svg'));
export const informQuestionCircle = create('informQuestionCircle', require('@/static/icons/inform/question-circle.svg'));
export const informTriangleSolid = create('informTriangleSolid', require('@/static/icons/inform/triangle-solid.svg'));
export const informWarningOutline = create('informWarningOutline', require('@/static/icons/inform/warning-outline.svg'));
export const informWarningSolid = create('informWarningSolid', require('@/static/icons/inform/warning-solid.svg'));

// Moon
export const moonFirstQuarter = create('moonFirstQuarter', require('@/static/icons/moon/first-quarter.svg'));
export const moonFull = create('moonFull', require('@/static/icons/moon/full.svg'));
export const moonNew = create('moonNew', require('@/static/icons/moon/new.svg'));
export const moonThirdQuarter = create('moonThirdQuarter', require('@/static/icons/moon/third-quarter.svg'));
export const moonWaningCrescent = create('moonWaningCrescent', require('@/static/icons/moon/waning-crescent.svg'));
export const moonWaningGibbous = create('moonWaningGibbous', require('@/static/icons/moon/waning-gibbous.svg'));
export const moonWaxingCrescent = create('moonWaxingCrescent', require('@/static/icons/moon/waxing-crescent.svg'));
export const moonWaxingGibbous = create('moonWaxingGibbous', require('@/static/icons/moon/waxing-gibbous.svg'));

// Tide
export const tideDownLong = create('tideDownLong', require('@/static/icons/tide/down-long.svg'));
export const tideDown = create('tideDown', require('@/static/icons/tide/down.svg'));
export const tideUpLong = create('tideUpLong', require('@/static/icons/tide/up-long.svg'));
export const tideUp = create('tideUp', require('@/static/icons/tide/up.svg'));
export const tideWave = create('tideWave', require('@/static/icons/tide/wave.svg'));

// Tool
export const toolDotsHorizontal = create('toolDotsHorizontal', require('@/static/icons/tool/dots-horizontal.svg'));
export const toolFilter = create('toolFilter', require('@/static/icons/tool/filter.svg'));
export const toolLinkOut = create('toolLinkOut', require('@/static/icons/tool/link-out.svg'));
export const toolLink = create('toolLink', require('@/static/icons/tool/link.svg'));
export const toolQuarterTurn = create('toolQuarterTurn', require('@/static/icons/tool/quarter-turn.svg'));
export const toolSupport = create('toolSupport', require('@/static/icons/tool/support.svg'));
export const toolUpload = create('toolUpload', require('@/static/icons/tool/upload.svg'));

// Weather
export const weatherCloud = create('weatherCloud', require('@/static/icons/weather/cloud.svg'));
export const weatherClouds = create('weatherClouds', require('@/static/icons/weather/clouds.svg'));
export const weatherCloudyMoon = create('weatherCloudyMoon', require('@/static/icons/weather/cloudy-moon.svg'));
export const weatherCloudySun = create('weatherCloudySun', require('@/static/icons/weather/cloudy-sun.svg'));
export const weatherCloudyWind = create('weatherCloudyWind', require('@/static/icons/weather/cloudy-wind.svg'));
export const weatherFog = create('weatherFog', require('@/static/icons/weather/fog.svg'));
export const weatherHail = create('weatherHail', require('@/static/icons/weather/hail.svg'));
export const weatherLightningMoon = create('weatherLightningMoon', require('@/static/icons/weather/lightning-moon.svg'));
export const weatherLightningSun = create('weatherLightningSun', require('@/static/icons/weather/lightning-sun.svg'));
export const weatherLightning = create('weatherLightning', require('@/static/icons/weather/lightning.svg'));
export const weatherMoon = create('weatherMoon', require('@/static/icons/weather/moon.svg'));
export const weatherPressure = create('weatherPressure', require('@/static/icons/weather/pressure.svg'));
export const weatherQuestion = create('weatherQuestion', require('@/static/icons/weather/question.svg'));
export const weatherRainMoon = create('weatherRainMoon', require('@/static/icons/weather/rain-moon.svg'));
export const weatherRainSun = create('weatherRainSun', require('@/static/icons/weather/rain-sun.svg'));
export const weatherRain = create('weatherRain', require('@/static/icons/weather/rain.svg'));
export const weatherSnowflake = create('weatherSnowflake', require('@/static/icons/weather/snowflake.svg'));
export const weatherSun = create('weatherSun', require('@/static/icons/weather/sun.svg'));
export const weatherTemperatureHot = create('weatherTemperatureHot', require('@/static/icons/weather/temperature-hot.svg'));
export const weatherTemperature = create('weatherTemperature', require('@/static/icons/weather/temperature.svg'));
export const weatherWater = create('weatherWater', require('@/static/icons/weather/water.svg'));
export const weatherWind = create('weatherWind', require('@/static/icons/weather/wind.svg'));

// Wind
export const windArrow = create('windArrow', require('@/static/icons/wind/arrow.svg'));
export const windRose = create('windRose', require('@/static/icons/wind/rose.svg'));