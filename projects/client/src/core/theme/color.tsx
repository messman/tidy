const systemColors: SystemColors = {
	red: {
		a_main: '#FF3B3B',
		b_darker: '#E63535',
		c_lighter: '#FF5C5C',
		d_lightest: '#FF8080',
		e_subtle: '#FFE6E6'
	},
	green: {
		a_main: '#06C270',
		b_darker: '#05A660',
		c_lighter: '#39D98A',
		d_lightest: '#57EBA1',
		e_subtle: '#E3FFF1'
	},
	blue: {
		a_main: '#3082FC',
		b_darker: '#095DDA',
		c_lighter: '#6D9EFF',
		d_lightest: '#A8C7FC',
		e_subtle: '#E5F0FF'
	},
	yellow: {
		a_main: '#FFCC00',
		b_darker: '#E6B800',
		c_lighter: '#FDDD48',
		d_lightest: '#FDED72',
		e_subtle: '#FFFEE6'
	},
	orange: {
		a_main: '#FF8800',
		b_darker: '#E67A00',
		c_lighter: '#FDAC42',
		d_lightest: '#FCCC75',
		e_subtle: '#FFF8E6'
	},
};

const commonTheme: CommonTheme = {
	system: systemColors,
	status: {
		error: systemColors.red.a_main,
		processing: systemColors.orange.a_main,
		info: systemColors.blue.a_main,
		success: systemColors.green.a_main
	},

	brand1: {
		main: '#3794EB',
		dark: '#2572BA'
	},

	content: {
		background: '#489EEE',
		sun: '#ECC741',
		moon: '#FAF1D0',
		cloudLight: '#F4F4F4',
		cloudDark: '#DFDFDF',
		snow: '#FFFFFF',
		rain: '#1262AD',
		lightning: '#ECD581',
		heat: '#961C2F',
		cold: '#B2D7F9',
	},

	expression: {
		green: {
			fore: '#56BE8A',
			back: '#6EEDAC',
		},
		yellow: {
			fore: '#ECAC4C',
			back: '#FBE086',
		},
		red: {
			fore: '#DE5135',
			back: '#EF8351',
		},
	},
	focusOutline: systemColors.red.a_main,
};

/** The light theme. */
export const baseLightTheme: Theme = {
	common: commonTheme,
	themeInfo: {
		isDark: false,
		name: 'Light'
	},

	gradient: {
		light: '#3794EB',
		dark: '#2572BA',
		cover: '#FFFFFF',
	},

	/**
	 * The basic dark text - high contrast with the background.
	 * Typically used for headings or bold text, but not body text.
	*/
	textDistinct: '#202024',
	/**
	 * Text that is slightly lighter than the distinct text, suitable for 
	 * paragraphs or descriptive "body" text.
	 */
	textSubtle: '#5D5D68',

	textLink: '#3794EB',

	/** A color distinct against the background, used for borders. */
	outlineDistinct: '#96B2CC',
	/** A color distinct against the background, used for borders. */
	outlineSubtle: '#A5C4DF',

	note: {
		outline: '#ECDD7E',
		background: '#FFFDF0',
	},

	rowHighlight: '#F5F8FA',

	badge: {
		water: '#1A66AB',
		textBackground: '#E1F1FF',
	},

	form: {
		outline: '#D0D6DA',
		background: '#F5F8FA',
		hover: '#E3EDF5',
		active: '#D7E3ED',
		disabled: '#D4D4D4',
		textDisabled: '#A6A6A6',
	},

	button: {
		base: '#3794EB',
		hover: '#4DA5F6',
		active: '#1A7BD6',
	},

	shadow: createShadowElevationSet({
		a_close: 'rgba(40,41,61,0.08)',
		b_far: 'rgba(96,97,112,0.16)'
	}),
};


export interface CommonTheme {
	/** All the system colors. These are provided without any UI logic context, so be think before using. */
	system: SystemColors;

	/** System colors that match a UI status. */
	status: {
		/** Error, danger, etc. */
		error: string;
		/** Waiting, loading, etc. */
		processing: string;
		/** Informational, etc. */
		info: string;
		/** Selected, success, etc. */
		success: string;
	};

	brand1: ColorBrandSet;

	content: {
		background: string;
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

	expression: {
		green: ExpressionColorSet;
		yellow: ExpressionColorSet;
		red: ExpressionColorSet;
	};

	/** A bright accessible color for focused elements. */
	focusOutline: string;
}

export interface Theme {
	/** Colors that are always the same, regardless of theme. */
	common: CommonTheme;

	/** Meta info about the theme. */
	themeInfo: {
		/** Is it a dark theme? */
		isDark: boolean;
		name: string;
	},

	gradient: {
		light: string;
		dark: string;
		cover: string;
	};

	/**
	 * The basic dark text - high contrast with the background.
	 * Typically used for headings or bold text, but not body text.
	*/
	textDistinct: string;
	/**
	 * Text that is slightly lighter than the distinct text, suitable for 
	 * paragraphs or descriptive "body" text.
	 */
	textSubtle: string;

	textLink: string;

	/** A color distinct against the background, used for borders. */
	outlineDistinct: string;
	/** A color distinct against the background, used for borders. */
	outlineSubtle: string;

	note: {
		outline: string;
		background: string;
	};

	rowHighlight: string;

	badge: {
		water: string;
		textBackground: string;
	};

	form: {
		outline: string;
		background: string;
		hover: string;
		active: string;
		disabled: string;
		textDisabled: string;
	},

	button: {
		base: string;
		hover: string;
		active: string;
	};

	shadow: ShadowElevationSet;
}

export interface ThemeBrand {
	/** Main theme brand color. Typically what you want to use. */
	main: string;
	subtle: string;
}

export interface ColorBrandSet {
	/** The brand main color. */
	main: string;
	/** Darker version of the brand main color. */
	dark: string;
}

/** A color set for buttons. The base color (1/7) should be another design color. */
export interface ColorButtonSet {
	active: string;
	main: string;
	hover: string;
	text: string;
}

export interface ExpressionColorSet {
	fore: string;
	back: string;
}


//#region System Colors

export interface SystemColorSet {
	a_main: string;
	b_darker: string;
	c_lighter: string;
	d_lightest: string;
	e_subtle: string;
}

export interface SystemColors {
	red: SystemColorSet;
	blue: SystemColorSet;
	yellow: SystemColorSet;
	green: SystemColorSet;
	orange: SystemColorSet;
}

//#endregion

//#region Shadows

export interface ShadowSetColor {
	a_close: string;
	b_far: string;
}

export interface ShadowElevationSet {
	/* Inset, for inputs. **/
	inset: string;
	/** 1/7: Background-level. */
	a_background: string;
	/** 2/7: Cards and pressed buttons. */
	b_card: string;
	/** 3/7: Buttons (default). */
	c_button: string;
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
}

function createShadowElevationSet(color: ShadowSetColor): ShadowElevationSet {
	// Light - rgba(40,41,61,0.08), rgba(96,97,112,0.16)
	// Dark - rgba(0,0,0,0.04), rgba(0,0,0,0.32)
	const { a_close, b_far } = color;
	return {
		a_background: `none`,
		b_card: `0 0 1px 0 ${a_close}, 0 1px 2px 0 ${b_far}`,
		c_button: `0 0 1px 0 ${a_close}, 0 2px 4px 0 ${b_far}`,
		d_navigation: `0 0 2px 0 ${a_close}, 0 4px 8px 0 ${b_far}`,
		d_navigationBottom: `0 0 2px 0 ${a_close}, 0 -4px 8px 0 ${b_far}`,
		e_raised: `0 2px 4px 0 ${a_close}, 0 8px 16px 0 ${b_far}`,
		f_picker: `0 2px 8px 0 ${a_close}, 0 16px 24px 0 ${b_far}`,
		g_overlay: `0 2px 8px 0 ${a_close}, 0 20px 32px 0 ${b_far}`,
		inset: `inset 0 0 4px 0 ${b_far}`,
	};
}

//#endregion