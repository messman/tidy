import * as React from 'react';
import { styled, StyledFC } from '@/core/style/styled';
import { Theme, useCurrentTheme } from '../style/theme';

export type SVGIconType = React.FC<React.SVGAttributes<SVGElement>>;

const Sun = require('@/static/icons/sun.svg').default as SVGIconType;
const Moon = require('@/static/icons/moon.svg').default as SVGIconType;
const CloudySun = require('@/static/icons/cloudy-sun.svg').default as SVGIconType;
const CloudyMoon = require('@/static/icons/cloudy-moon.svg').default as SVGIconType;
const Cloud = require('@/static/icons/cloud.svg').default as SVGIconType;
const Clouds = require('@/static/icons/clouds.svg').default as SVGIconType;
const Wind = require('@/static/icons/wind.svg').default as SVGIconType;
const CloudyWind = require('@/static/icons/cloudy-wind.svg').default as SVGIconType;
const Snowflake = require('@/static/icons/snowflake.svg').default as SVGIconType;
const Hail = require('@/static/icons/hail.svg').default as SVGIconType;
const Rain = require('@/static/icons/rain.svg').default as SVGIconType;
const RainSun = require('@/static/icons/rain-sun.svg').default as SVGIconType;
const RainMoon = require('@/static/icons/rain-moon.svg').default as SVGIconType;
const Lightning = require('@/static/icons/lightning.svg').default as SVGIconType;
const LightningSun = require('@/static/icons/lightning-sun.svg').default as SVGIconType;
const LightningMoon = require('@/static/icons/lightning-moon.svg').default as SVGIconType;
const Fog = require('@/static/icons/fog.svg').default as SVGIconType;
const WeatherAlert = require('@/static/icons/weather-alert.svg').default as SVGIconType;
const Question = require('@/static/icons/question.svg').default as SVGIconType;
const TemperatureHot = require('@/static/icons/temperature-hot.svg').default as SVGIconType;
const Temperature = require('@/static/icons/temperature.svg').default as SVGIconType;
const TemperatureCold = require('@/static/icons/temperature-cold.svg').default as SVGIconType;
const Alert = require('@/static/icons/alert.svg').default as SVGIconType;
const Calendar = require('@/static/icons/calendar.svg').default as SVGIconType;
const Clipboard = require('@/static/icons/clipboard.svg').default as SVGIconType;
const ClipboardCheck = require('@/static/icons/clipboard-check.svg').default as SVGIconType;
const Gear = require('@/static/icons/gear.svg').default as SVGIconType;
const Reload = require('@/static/icons/reload.svg').default as SVGIconType;
const ChevronLeft = require('@/static/icons/chevron-left.svg').default as SVGIconType;
const ArrowDown = require('@/static/icons/arrow-down.svg').default as SVGIconType;
const ArrowUp = require('@/static/icons/arrow-up.svg').default as SVGIconType;
const Pressure = require('@/static/icons/pressure.svg').default as SVGIconType;

export type DefaultThemeColorPicker = (t: Theme) => string;

function defaultTo(icon: SVGIconType, colorPicker: DefaultThemeColorPicker): [SVGIconType, DefaultThemeColorPicker] {
	return [icon, colorPicker];
}

const defaultGray: DefaultThemeColorPicker = (t: Theme) => t.color.weatherIconGray;

export type IconType = SVGIconType | [SVGIconType, DefaultThemeColorPicker];

export const iconTypes = {
	sun: Sun,
	moon: defaultTo(Moon, defaultGray),
	cloudySun: defaultTo(CloudySun, defaultGray),
	cloudyMoon: defaultTo(CloudyMoon, defaultGray),
	cloud: defaultTo(Cloud, defaultGray),
	clouds: defaultTo(Clouds, defaultGray),
	wind: defaultTo(Wind, defaultGray),
	cloudyWind: defaultTo(CloudyWind, defaultGray),
	snowflake: defaultTo(Snowflake, defaultGray),
	hail: defaultTo(Hail, defaultGray),
	rain: defaultTo(Rain, defaultGray),
	rainSun: defaultTo(RainSun, defaultGray),
	rainMoon: defaultTo(RainMoon, defaultGray),
	lightning: defaultTo(Lightning, defaultGray),
	lightningSun: defaultTo(LightningSun, defaultGray),
	lightningMoon: defaultTo(LightningMoon, defaultGray),
	fog: defaultTo(Fog, defaultGray),
	weatherAlert: WeatherAlert,
	question: Question,
	temperatureHot: TemperatureHot,
	temperature: Temperature,
	temperatureCold: TemperatureCold,

	alert: Alert,
	calendar: Calendar,
	clipboard: Clipboard,
	clipboardCheck: ClipboardCheck,
	gear: Gear,
	reload: Reload,
	chevronLeft: ChevronLeft,
	arrowDown: ArrowDown,
	arrowUp: ArrowUp,
	pressure: Pressure
};

export interface IconProps {
	type: IconType,
	/** If set, overrides the default text icon color for icons that allow it. */
	defaultColor?: string;
	/** If set, overrides all colors in the icon. */
	fillColor?: string;
	width?: string,
	height?: string;
}

export const Icon: StyledFC<IconProps> = (props) => {

	/*
		Fill and color:
		SVGs are exported from Sketch. We want the icons to have multiple colors, where one of those colors is dynamic
		(can be changed by CSS). If we used CSS Fill, it would change all our multiple colors; so instead, we use the 'currentColor'.
		During build, we use the replaceAttrValues option of svgr (https://github.com/gregberge/svgr/issues/163) to replace all 
		'#000' colors with 'currentColor'. Then, here, we set the currentColor via CSS 'color'.
		So in summary: Fill will override all the colors coming from Sketch; color will just set the one color we want to change.
	*/

	const theme = useCurrentTheme();
	const { type, defaultColor, fillColor, width, height } = props;

	let color = defaultColor;

	let SVGIcon: SVGIconType = null!;
	if (Array.isArray(type)) {
		const [wrappedType, defaultColor] = type;
		SVGIcon = wrappedType;
		color = defaultColor(theme) || color;
	}
	else {
		SVGIcon = type;
	}

	// Note - Safari SVG does not accept 'rem' width/height - so use percent and scale using wrapper.
	const setValue = !!width ? 'width' : 'height';
	const iconProp = { [setValue]: '100%' };

	return (
		<SVGWrapper className={props.className} svgColor={color} svgFill={fillColor} wrapperWidth={width} wrapperHeight={height}>
			<SVGIcon {...iconProp} />
		</SVGWrapper>
	);
};

interface SVGWrapperProps {
	wrapperWidth?: string,
	wrapperHeight?: string,
	svgColor?: string;
	svgFill?: string;
}

const SVGWrapper = styled.span<SVGWrapperProps>`
	display: inline-block;
	width: ${p => p.wrapperWidth || 'unset'};
	height: ${p => p.wrapperHeight || 'unset'}; 

	svg, svg path {
		color: ${p => (p.svgColor || p.theme.color.textAndIcon)};
		${p => p.svgFill && ({
		fill: p.svgFill!
	})}
	}
`;