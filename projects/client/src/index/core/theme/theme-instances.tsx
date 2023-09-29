/**
 * Takes in a Figma hex color definition like `("AABBCC", 0)` and creates an alpha hexadecimal notation like `"#AABBCC00`
 * Converts [0, 100] to 00-FF. 
 * @param hex The value without the hash symbol, like `AABBCC`.
 * @param percent The percent opacity/alpha, like `88`.
*/
function alphaHex(hex: string, percent: number): string {
	return `#${hex}${Math.floor((percent / 100) * 255).toString(16).toUpperCase().padStart(2, '0')}`;
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
		/** For top navigation. */
		light: '#FFF',
		/** For bottom navigation and side gutters. */
		dark: '#206981',
		gradient: 'radial-gradient(1055.01% 100.76% at 39.01% -0.00%, #83DAF5 13.54%, #287AC6 100%)',
		glass: {
			gradient: 'rgba(9, 81, 121, 0.41)',
			blendMode: 'luminosity'
		},
		tint: {
			lightest: 'rgba(219, 235, 248, 0.15)',
			lighter: 'rgba(222, 236, 246, 0.08)',
			medium: 'rgba(0, 38, 60, 0.20)',
			darker: 'rgba(0, 38, 60, 0.30)',
			darkest: 'rgba(0, 38, 60, 0.50)',
		}
	},

	text: {
		/** High contrast. Not for body text. */
		distinct: '#FFF',
		/** Lesser contrast. Body text. */
		subtle: alphaHex('E9F7FF', 65),
		/** On the background directly, where the text needs to be darker. */
		onBackground: alphaHex('010C15', 60),
		link: '#CDE7FF',
	},

	outline: {
		accessibility: "red",
	},

	inform: {
		positive: '#3ACE15',
		unsure: '#EDDB37',
		base: alphaHex('a3a29b', 90),
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
		sand: '#E7DEC0',
		sandDarker: '#C9BD9E',
		ocean: alphaHex('45ADE8', 90),
		oceanSide: alphaHex('2C9AD8', 90)
	},

	tideBar: {
		line: alphaHex('002B52', 39),
		lineTip: alphaHex('002B52', 39),
		lineNow: alphaHex('FFFFFF', 50),
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