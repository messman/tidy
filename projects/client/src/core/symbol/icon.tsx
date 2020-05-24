import * as React from 'react';
import { styled, StyledFC } from '@/core/style/styled';

export type SVGIconType = React.FC<React.SVGAttributes<SVGElement>>;

const Sunset = require('@/static/icons/sunset.svg').default as SVGIconType;
const Sunrise = require('@/static/icons/sunrise.svg').default as SVGIconType;
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

export const iconTypes = {
	sunset: Sunset,
	sunrise: Sunrise,
	sun: Sun,
	moon: Moon,
	cloudySun: CloudySun,
	cloudyMoon: CloudyMoon,
	cloud: Cloud,
	clouds: Clouds,
	wind: Wind,
	cloudyWind: CloudyWind,
	snowflake: Snowflake,
	hail: Hail,
	rain: Rain,
	rainSun: RainSun,
	rainMoon: RainMoon,
	lightning: Lightning,
	lightningSun: LightningSun,
	lightningMoon: LightningMoon,
	fog: Fog,
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
};

export interface IconProps {
	type: SVGIconType,
	fill?: string,
	width?: string,
	height?: string;
}

export const Icon: StyledFC<IconProps> = (props) => {

	// Get the width and height props separately. If we use spread, 
	const { type, fill, width, height } = props;
	// Note - Safari SVG does not accept 'rem' width/height - so use percent and scale using wrapper.
	const setValue = !!width ? 'width' : 'height';
	const iconProp = { [setValue]: '100%' };

	const SVGIcon = type;


	return (
		<SVGWrapper className={props.className} svgFill={fill} wrapperWidth={width} wrapperHeight={height}>
			<SVGIcon {...iconProp} />
		</SVGWrapper>
	);
};

interface SVGWrapperProps {
	wrapperWidth?: string,
	wrapperHeight?: string,
	svgFill?: string;
}

const SVGWrapper = styled.span<SVGWrapperProps>`
	display: inline-block;
	width: ${p => p.wrapperWidth || 'unset'};
	height: ${p => p.wrapperHeight || 'unset'}; 

	svg, svg path {
		fill: ${p => (p.svgFill || p.theme.color.textAndIcon)};
	}
`;