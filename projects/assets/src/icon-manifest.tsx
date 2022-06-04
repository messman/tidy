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

// Action
export const actionAdd = create('actionAdd', require('@/static/icons/action/add.svg'));
export const actionCheckBold = create('actionCheckBold', require('@/static/icons/action/check-bold.svg'));
export const actionCheck = create('actionCheck', require('@/static/icons/action/check.svg'));
export const actionClose = create('actionClose', require('@/static/icons/action/close.svg'));
export const actionFilter = create('actionFilter', require('@/static/icons/action/filter.svg'));
export const actionMinus = create('actionMinus', require('@/static/icons/action/minus.svg'));

// Arrow
export const arrowChevronDown = create('arrowChevronDown', require('@/static/icons/arrow/chevron-down.svg'));
export const arrowChevronLeftInline = create('arrowChevronLeftInline', require('@/static/icons/arrow/chevron-left-inline.svg'));
export const arrowChevronLeft = create('arrowChevronLeft', require('@/static/icons/arrow/chevron-left.svg'));
export const arrowChevronRightInline = create('arrowChevronRightInline', require('@/static/icons/arrow/chevron-right-inline.svg'));
export const arrowChevronRight = create('arrowChevronRight', require('@/static/icons/arrow/chevron-right.svg'));
export const arrowChevronUp = create('arrowChevronUp', require('@/static/icons/arrow/chevron-up.svg'));
export const arrowDown = create('arrowDown', require('@/static/icons/arrow/down.svg'));
export const arrowLeft = create('arrowLeft', require('@/static/icons/arrow/left.svg'));
export const arrowOut = create('arrowOut', require('@/static/icons/arrow/out.svg'));
export const arrowRight = create('arrowRight', require('@/static/icons/arrow/right.svg'));
export const arrowUp = create('arrowUp', require('@/static/icons/arrow/up.svg'));

// Brand
export const brandUmbrella = create('brandUmbrella', require('@/static/icons/brand/umbrella.svg'));

// Decoration
export const decorationLike = create('decorationLike', require('@/static/icons/decoration/like.svg'));

// Expression
export const expressionHappy = create('expressionHappy', require('@/static/icons/expression/happy.svg'));
export const expressionSad = create('expressionSad', require('@/static/icons/expression/sad.svg'));
export const expressionStraight = create('expressionStraight', require('@/static/icons/expression/straight.svg'));

// Loader
export const loaderQuarterTurn = create('loaderQuarterTurn', require('@/static/icons/loader/quarter-turn.svg'));

// Navigation
export const navigationDashboard = create('navigationDashboard', require('@/static/icons/navigation/dashboard.svg'));
export const navigationDev = create('navigationDev', require('@/static/icons/navigation/dev.svg'));
export const navigationHome = create('navigationHome', require('@/static/icons/navigation/home.svg'));
export const navigationLocation = create('navigationLocation', require('@/static/icons/navigation/location.svg'));
export const navigationMenu = create('navigationMenu', require('@/static/icons/navigation/menu.svg'));
export const navigationSettings = create('navigationSettings', require('@/static/icons/navigation/settings.svg'));
export const navigationUrl = create('navigationUrl', require('@/static/icons/navigation/url.svg'));

// Status
export const statusAlertOutline = create('statusAlertOutline', require('@/static/icons/status/alert/outline.svg'));
export const statusAlertSolid = create('statusAlertSolid', require('@/static/icons/status/alert/solid.svg'));
export const statusErrorOutline = create('statusErrorOutline', require('@/static/icons/status/error/outline.svg'));
export const statusErrorSolid = create('statusErrorSolid', require('@/static/icons/status/error/solid.svg'));
export const statusInfoOutline = create('statusInfoOutline', require('@/static/icons/status/info/outline.svg'));
export const statusInfoSolid = create('statusInfoSolid', require('@/static/icons/status/info/solid.svg'));
export const statusSuccessOutline = create('statusSuccessOutline', require('@/static/icons/status/success/outline.svg'));
export const statusSuccessSolid = create('statusSuccessSolid', require('@/static/icons/status/success/solid.svg'));
export const statusCircle = create('statusCircle', require('@/static/icons/status/circle.svg'));
export const statusTriangle = create('statusTriangle', require('@/static/icons/status/triangle.svg'));

// Tide
export const tideDownLong = create('tideDownLong', require('@/static/icons/tide/down-long.svg'));
export const tideDown = create('tideDown', require('@/static/icons/tide/down.svg'));
export const tideUpLong = create('tideUpLong', require('@/static/icons/tide/up-long.svg'));
export const tideUp = create('tideUp', require('@/static/icons/tide/up.svg'));
export const tideWave = create('tideWave', require('@/static/icons/tide/wave.svg'));

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
export const weatherSundown = create('weatherSundown', require('@/static/icons/weather/sundown.svg'));
export const weatherSunrise = create('weatherSunrise', require('@/static/icons/weather/sunrise.svg'));
export const weatherTemperatureCold = create('weatherTemperatureCold', require('@/static/icons/weather/temperature-cold.svg'));
export const weatherTemperatureHot = create('weatherTemperatureHot', require('@/static/icons/weather/temperature-hot.svg'));
export const weatherTemperature = create('weatherTemperature', require('@/static/icons/weather/temperature.svg'));
export const weatherWind = create('weatherWind', require('@/static/icons/weather/wind.svg'));