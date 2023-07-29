import { ThemeTypes } from './theme-types';

export const lightTokens: ThemeTypes.Tokens = {
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
		waterLight: '#3794EB',
		waterDark: '#2572BA',
		waterGradient: `linear-gradient(172.78deg, #5EC7F4 10.6%, #45A8FC 40.05%, #0E569A 84.48%);`,
		oneBox: '#FFFFFF',
		two: '#FFFFFF',
		twoBox: '#F8F9FA',
		overlayCover: 'rgba(251, 251, 251, 0.65)',
	},

	text: {
		distinct: '#202024',
		subtle: '#5D5D68',
		link: '#3794EB',
		disabled: '#86868e',
		distinctOnSaturatedFill: '#FFFFFF',
		distinctOnOppositeFill: '#FFFFFF',
	},

	brand: {
		red: '#D84747',
		blue: '#3794EB'
	},

	outline: {
		distinct: '#C1C1C1',
		subtle: '#DADADA',
		subtleLightOnly: '#DADADA',
		accessible: '#D84747'
	},

	filter: {
		selected: '#F5F8FA',
		hover: '#F5F8FA',
	},

	form: {
		bordered: '#FFFFFF',
		available: '#FFFFFF',
		subtle: 'rgba(222, 222, 222, 0.3)',
		distinct: 'rgba(180, 180, 180, 0.3)',
		opposite: '#353535',
		disabledBordered: 'rgba(220, 220, 220, 0.3)',
		disabledAvailable: '#F0F0F0',
		disabledSubtle: '#EFEFEF',
		disabledDistinct: '#D7D7D7',
		disabledOpposite: '#EFEFEF',
	},

	inform: {
		positive: '#06C270',
		negative: '#FF3B3B',
		info: '#3082FC',
		unsure: '#E5AA0F',
		disabled: '#B1B1B1',
	},

	gradient: {
		umbrella: 'linear-gradient(180deg, #3794EB 0%, #2572BA 100%)'
	},

	content: {
		backgroundDay: '#489EEE',
		sun: '#F2DD1C',
		moon: '#FAF1D0',
		cloudLight: '#F4F4F4',
		cloudDark: '#DFDFDF',
		snow: '#FFFFFF',
		rain: '#1262AD',
		lightning: '#ECD581',
		heat: '#961C2F',
		cold: '#B2D7F9',
	},

	note: {
		outline: '#ECDD7E',
		background: '#FFFDF0',
	},


	badge: {
		water: '#1A66AB',
		textBackground: '#E4EFF9',
	},

	visual: {
		background: '#E4EFF9',
		tideCoverage: '#7bc0f9',
		temperatureGradient: 'linear-gradient(90deg, #8A47DF 0%, #5189DD 15.79%, #52C4D3 35.92%, #61E1A3 50.08%, #E1C847 60.82%, #E24747 85.9%, #E247DC 100%)',
	},

	shadow: {
		inset: `inset 0 0 4px 0 rgba(96,97,112,0.16)`,
		a_none: `none`,
		b_card: `0 0 1px 0 rgba(40,41,61,0.08), 0 1px 2px 0 rgba(96,97,112,0.16)`,
		c_button: `0 0 1px 0 rgba(40,41,61,0.08), 0 2px 4px 0 rgba(96,97,112,0.16)`,
		d_navigation: `0 0 2px 0 rgba(40,41,61,0.08), 0 4px 8px 0 rgba(96,97,112,0.16)`,
		d_navigationBottom: `0 0 2px 0 rgba(40,41,61,0.08), 0 -4px 8px 0 rgba(96,97,112,0.16)`,
		e_raised: `0 2px 4px 0 rgba(40,41,61,0.08), 0 8px 16px 0 rgba(96,97,112,0.16)`,
		f_picker: `0 2px 8px 0 rgba(40,41,61,0.08), 0 16px 24px 0 rgba(96,97,112,0.16)`,
		g_overlay: `0 2px 8px 0 rgba(40,41,61,0.08), 0 20px 32px 0 rgba(96,97,112,0.16)`,
	}
};