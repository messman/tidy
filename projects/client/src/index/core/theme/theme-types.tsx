/** Properties passed in to styled-components as the "DefaultTheme" type for the theme provider. */
export interface ThemeInfo {
	/** Like 'Basic Light' or 'Basic Dark' */
	name: string;
	/** Is it a dark theme? */
	isDark: boolean;
	/** The variable definitions for the global style. */
	variableDefinitions: string;
}

export namespace ThemeTypes {

	export interface RawColorSet {
		distinct: string;
		subtle: string;
	}

	export interface Tokens {
		/** Base colors that are used in a variety of contexts and have no meaning other than as contrast. */
		rawColor: {
			red: RawColorSet;
			blue: RawColorSet;
			yellow: RawColorSet;
			green: RawColorSet;
			orange: RawColorSet;
			purple: RawColorSet;
		};

		background: {
			waterGradient: string;
			waterLight: string;
			waterDark: string;

			oneBox: string;

			two: string;
			twoBox: string;
			overlayCover: string;
		};

		text: {
			/** High contrast. Not for body text. */
			distinct: string;
			/** Lesser contrast. Body text. */
			subtle: string;
			disabled: string;
			link: string;

			/** Usually a light color to distinguish on darker fills from brand colors. */
			distinctOnSaturatedFill: string;
			/** If dark, opposite is light, and distinct would be dark. */
			distinctOnOppositeFill: string;
		};

		brand: {
			red: string;
			blue: string;
		};

		outline: {
			/** Higher contrast border. */
			distinct: string;
			/** Lesser contrast border. */
			subtle: string;
			/** Light themes sometimes use a border where dark would not, for additional contrast and separation. */
			subtleLightOnly: string;
			/** Colorful, high-contrast value for accessibility. */
			accessible: string;
		};

		/** Modifications of states applied to background elements. */
		filter: {
			/** Selected against the background. */
			selected: string;

			hover: string;
		};

		form: {
			/** Used where there is a border - so the fill may be almost transparent or match the background. Most subtle. */
			bordered: string;
			/** A (usually light) grayscale color to indicate knobs or other controls that are available for use. */
			available: string;
			/** A subtle form element color. Typically used in background for large containers. */
			subtle: string;
			/** A distinct form element color, typically backgrounds for switches, etc. */
			distinct: string;
			/** Opposite, for contrast. If this is a light theme, this color would be very dark. */
			opposite: string;
			/** Disabled of bordered style. */
			disabledBordered: string;
			/** Disabled of available style. */
			disabledAvailable: string;
			/** Disabled of subtle style. */
			disabledSubtle: string;
			/** Disabled of distinct style. */
			disabledDistinct: string;
			/** Disabled of opposite style. */
			disabledOpposite: string;
		};

		/** System colors that match a UI status. */
		inform: {
			/** Selected, success, etc. */
			positive: string;
			/** Error, danger, etc. */
			negative: string;
			/** Informational, etc. */
			info: string;
			/** Waiting, loading, etc. */
			unsure: string;
			/** Used to replace the other colors when an input is disabled. */
			disabled: string;
		};

		gradient: {
			umbrella: string;
		};

		content: {
			backgroundDay: string;
			sun: string;
			moon: string;
			cloudLight: string;
			cloudDark: string;
			snow: string;
			rain: string;
			lightning: string;
			heat: string;
			cold: string;
		};

		note: {
			outline: string;
			background: string;
		};


		badge: {
			water: string;
			textBackground: string;
		};

		visual: {
			background: string;
			tideCoverage: string;
			/** Should cover -25 to 120. */
			temperatureGradient: string;
		};

		shadow: {
			/* Inset, for inputs. **/
			inset: string;
			/** 1/7: Background-level. */
			a_none: string;
			/** 2/7: Cards and pressed buttons. */
			b_card: string;
			/** 3/7: Buttons (default). */
			c_button: string;
			// /** 3/7: Buttons, but that have a darker fill and require a more pronounced shadow. Needed for light themes. */
			// c_buttonDarkFill: string;
			/** 4/7: Navigation. */
			d_navigation: string;
			/** 4/7: Navigation (bottom). */
			d_navigationBottom: string;
			/** 5/7: Hover for buttons and cards. */
			e_raised: string;
			/** 6/7: Pickers. */
			f_picker: string;
			/** 7/7: Modals. */
			g_overlay: string;
		};
	}

	// export interface CommonTheme {
	// 	/** All the system colors. These are provided without any UI logic context, so be think before using. */
	// 	system: SystemColors;

	// 	/** System colors that match a UI status. */
	// 	status: {
	// 		/** Error, danger, etc. */
	// 		error: string;
	// 		/** Waiting, loading, etc. */
	// 		processing: string;
	// 		/** Informational, etc. */
	// 		info: string;
	// 		/** Selected, success, etc. */
	// 		success: string;
	// 	};

	// 	brand1: ColorBrandSet;
	// 	umbrellaGradient: string;

	// 	content: {
	// 		backgroundDay: string;
	// 		sun: string;
	// 		moon: string;
	// 		cloudLight: string;
	// 		cloudDark: string;
	// 		snow: string;
	// 		rain: string;
	// 		lightning: string;
	// 		heat: string;
	// 		cold: string;
	// 	};

	// 	expression: {
	// 		green: ExpressionColorSet;
	// 		yellow: ExpressionColorSet;
	// 		red: ExpressionColorSet;
	// 	};

	// 	/** A bright accessible color for focused elements. */
	// 	focusOutline: string;
	// }

	// export interface Theme {
	// 	/** Colors that are always the same, regardless of theme. */
	// 	common: CommonTheme;

	// 	/** Meta info about the theme. */
	// 	themeInfo: {
	// 		/** Is it a dark theme? */
	// 		isDark: boolean;
	// 		name: string;
	// 	},

	// 	gradient: {
	// 		light: string;
	// 		dark: string;
	// 		cover: string;
	// 	};

	// 	/**
	// 	 * The basic dark text - high contrast with the background.
	// 	 * Typically used for headings or bold text, but not body text.
	// 	*/
	// 	textDistinct: string;
	// 	/**
	// 	 * Text that is slightly lighter than the distinct text, suitable for 
	// 	 * paragraphs or descriptive "body" text.
	// 	 */
	// 	textSubtle: string;

	// 	textLink: string;

	// 	/** A color distinct against the background, used for borders. */
	// 	outlineDistinct: string;
	// 	/** A color distinct against the background, used for borders. */
	// 	outlineSubtle: string;

	// 	rowHighlight: string;
	// 	note: {
	// 		outline: string;
	// 		background: string;
	// 	};



	// 	badge: {
	// 		water: string;
	// 		textBackground: string;
	// 	};

	// 	visual: {
	// 		background: string;
	// 		tideCoverage: string;
	// 		/** Should cover -25 to 120. */
	// 		temperatureGradient: string;
	// 	};

	// 	form: {
	// 		outline: string;
	// 		background: string;
	// 		hover: string;
	// 		active: string;
	// 		disabled: string;
	// 		textDisabled: string;
	// 	},

	// 	button: {
	// 		base: string;
	// 		hover: string;
	// 		active: string;
	// 	};

	// 	shadow: ShadowElevationSet;
	// }

	// export interface ThemeBrand {
	// 	/** Main theme brand color. Typically what you want to use. */
	// 	main: string;
	// 	subtle: string;
	// }

	// export interface ColorBrandSet {
	// 	/** The brand main color. */
	// 	main: string;
	// 	/** Darker version of the brand main color. */
	// 	dark: string;
	// }

	// /** A color set for buttons. The base color (1/7) should be another design color. */
	// export interface ColorButtonSet {
	// 	active: string;
	// 	main: string;
	// 	hover: string;
	// 	text: string;
	// }

	// export interface ExpressionColorSet {
	// 	fore: string;
	// 	back: string;
	// }


	// //#region System Colors

	// export interface SystemColorSet {
	// 	a_main: string;
	// 	b_darker: string;
	// 	c_lighter: string;
	// 	d_lightest: string;
	// 	e_subtle: string;
	// }

	// export interface SystemColors {
	// 	red: SystemColorSet;
	// 	blue: SystemColorSet;
	// 	yellow: SystemColorSet;
	// 	green: SystemColorSet;
	// 	orange: SystemColorSet;
	// }

	// //#endregion

	// //#region Shadows

	// export interface ShadowSetColor {
	// 	a_close: string;
	// 	b_far: string;
	// }

	// export interface ShadowElevationSet {
	// 	/* Inset, for inputs. **/
	// 	inset: string;
	// 	/** 1/7: Background-level. */
	// 	a_background: string;
	// 	/** 2/7: Cards and pressed buttons. */
	// 	b_card: string;
	// 	/** 3/7: Buttons (default). */
	// 	c_button: string;
	// 	/** 4/7: Navigation. */
	// 	d_navigation: string;
	// 	/** 4/7: Navigation (bottom). */
	// 	d_navigationBottom: string;
	// 	/** 5/7: Hover for buttons and cards. */
	// 	e_raised: string;
	// 	/** 6/7: Pickers. */
	// 	f_picker: string;
	// 	/** 7/7: Modals. */
	// 	g_overlay: string;
	// }
}