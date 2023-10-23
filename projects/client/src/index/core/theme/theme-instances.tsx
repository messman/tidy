/**
 * Takes in a Figma hex color definition like `("#AABBCC", 0)` and creates an alpha hexadecimal notation like `"#AABBCC00`
 * Converts [0, 100] to 00-FF. 
 * @param hex The value with the hash symbol, like `#AABBCC`.
 * @param percent The percent opacity/alpha, like `88`.
*/
function alphaHex(hex: string, percent: number): string {
	return `${hex}${Math.floor((percent / 100) * 255).toString(16).toUpperCase().padStart(2, '0')}`;
}

export type RawColorSet = {
	distinct: string;
	subtle: string;
};

export const lightTokens = {
	/** Base colors that are used in a variety of contexts and have no meaning other than as contrast. */
	rawColor: {
		red: {
			distinct: '#FF3B3B',
			subtle: '#FF8080',
		},
		green: {
			distinct: '#06C270',
			subtle: '#57EBA1',
		},
		blue: {
			distinct: '#3082FC',
			subtle: '#A8C7FC',
		},
		yellow: {
			distinct: '#FFCC00',
			subtle: '#FDED72',
		},
		orange: {
			distinct: '#FF8800',
			subtle: '#FCCC75',
		},
		purple: {
			distinct: '#913CE7',
			subtle: '#A65AF3',
		},
	},

	background: {
		top: '#55b5d7',
		bottom: '#0c5ea0',
		/** the safe-area of the page (iOS PWA, for example). */
		base: 'linear-gradient(to bottom, #55b5d7 0% 49%, #0c5ea0 51% 100%)',
		gradient: 'radial-gradient(1055.01% 100.76% at 39.01% -0.00%, #83DAF5 13.54%, #287AC6 100%)',
		glass: {
			gradient: 'rgba(9, 81, 121, 0.41)',
			backdropFilter: 'blur(4px) saturate(130%)'
		},
		tint: {
			lightest: 'rgba(219, 235, 248, 0.15)',
			lighter: 'rgba(222, 236, 246, 0.08)',
			medium: 'rgba(0, 38, 60, 0.20)',
			darker: 'rgba(0, 38, 60, 0.30)',
			darkest: 'rgba(0, 38, 60, 0.50)',
			backdropFilter: ''
		}
	},

	text: {
		/** High contrast. Not for body text. */
		distinct: '#FFF',
		/** Lesser contrast. Body text. */
		subtle: alphaHex('#E9F7FF', 65),
		/** On the background directly, where the text needs to be darker. */
		onBackground: alphaHex('#010C15', 60),
		link: '#7df9c6',
		dark: alphaHex('#102C46', 75)
	},

	outline: {
		accessibility: "red",
	},

	button: {
		background: '#FFF',
		hover: '#EEE',
		active: '#DDD',
		disabled: '#D4D4D4',
		disabledText: '#A6A6A6'
	},

	inform: {
		positive: '#3ACE15',
		unsure: '#EDDB37',
		negative: '#EB5D5D',
		base: alphaHex('#a3a29b', 90),
	},

	lunar: {
		background: '#09102D',
		dark: '#525252',
		light: '#D9D9D9',
	},

	solar: {
		riseGradient: 'linear-gradient(180deg, rgba(70, 141, 248, 0.26) 66.15%, rgba(228, 183, 24, 0.81) 100%)',
		setGradient: 'linear-gradient(180deg, rgba(121, 191, 255, 0.36) 59.9%, rgba(255, 88, 188, 0.58) 82.81%, rgba(238, 138, 20, 0.98) 89.06%, #CAB600 100%)'
	},

	beachDiagram: {
		base: '#DDDDDD',
		baseTop: '#EEEEEE',
		baseSide: '#CCCCCC',
		roadTop: '#777',
		roadSide: '#666',
		wall: '#C2C2C2',
		wallTop: '#CCC',
		wallSide: '#AEAEAE',
		wallText: '#8d9398',
		sand: '#E7DEC0',
		sandSide: '#c1b7a5',
		sandFootstep: '#d0c8b0',
		sandWet: '#cdc3a4',
		sandText: '#b8ae8d',
		ocean: alphaHex('#2980b2', 95),
		oceanText: '#0f5379ed',
		oceanTop: alphaHex('#45ADE8', 75),
		oceanTopDark: alphaHex('#2e8abf', 95),
		oceanSide: alphaHex('#3a9dd6', 75),
		oceanSideDark: alphaHex('#2377a8', 95)
	},

	tideBar: {
		line: alphaHex('#002B52', 39),
		lineTip: alphaHex('#002B52', 39),
		lineNow: alphaHex('#FFFFFF', 70),
		lineTipNow: '#FFFFFF',
	},

	uvBar: {
		white: '#FFF',
		green: '#54c41c',
		yellow: '#F4E44C',
		orange: '#E6642A',
		red: '#C9423C',
		purple: '#7820E8'
	},

	content: {
		sun: '#FFDA17',
		moon: '#FFF5D0',
		cloud: '#FFFFFF',
		snow: '#FFFFFF',
		rain: '#30C1FF',
		lightning: '#FFD601',
		heat: '#FF8761',
		cold: '#B2D7F9',
		/** Should cover -25 to 120. */
		temperatureGradient: 'linear-gradient(90deg, #8A47DF 0%, #5189DD 15.79%, #52C4D3 35.92%, #61E1A3 50.08%, #E1C847 60.82%, #E24747 85.9%, #E247DC 100%)',
	},

} as const;