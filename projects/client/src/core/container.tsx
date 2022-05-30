import { css } from './theme/styled';

// Use type 'ThemedCSS' for these properties.

export const containers = {
	/** 1/8: For input elements. */
	inset: css`
		background-color: ${p => p.theme.gradient.cover};
		box-shadow: ${p => p.theme.shadow.inset};
	`,
	/** 2/8: Regular background. */
	background: css`
		background-color: ${p => p.theme.gradient.cover};
		box-shadow: ${p => p.theme.shadow.a_background};
	`,
	/** 3/8: Slightly-raised cards and pressed buttons. */
	card: css`
		background-color: ${p => p.theme.gradient.cover};
		box-shadow: ${p => p.theme.shadow.b_card};
	`,
	/** 4/8: Regular buttons. */
	button: css`
		background-color: ${p => p.theme.gradient.cover};
		box-shadow: ${p => p.theme.shadow.c_button};
	`,
	/** 5/8: Navigation elements. */
	navigation: css`
		background-color: ${p => p.theme.gradient.cover};
		box-shadow: ${p => p.theme.shadow.d_navigation};
	`,
	navigationBottom: css`
		background-color: ${p => p.theme.gradient.cover};
		box-shadow: ${p => p.theme.shadow.d_navigationBottom};
	`,
	/** 6/8: Raised buttons or cards. */
	raised: css`
		background-color: ${p => p.theme.gradient.cover};
		box-shadow: ${p => p.theme.shadow.e_raised};
	`,
	/** 7/8: Picker components (calendars, dropdowns). */
	picker: css`
		background-color: ${p => p.theme.gradient.cover};
		box-shadow: ${p => p.theme.shadow.f_picker};
	`,
	/** 8/8: Overlay. */
	overlay: css`
		background-color: ${p => p.theme.gradient.cover};
		box-shadow: ${p => p.theme.shadow.g_overlay};
	`,
	/** 8/8: Overlay, but for content that needs to be above other overlay parts. */
	overlayNavigation: css`
		background-color: ${p => p.theme.gradient.cover};
		box-shadow: ${p => p.theme.shadow.d_navigation};
	`,
	/** 8/8: Overlay, but for content that needs to be above other overlay parts. */
	overlayNavigationBottom: css`
		background-color: ${p => p.theme.gradient.cover};
		box-shadow: ${p => p.theme.shadow.d_navigationBottom};
	`,
};
