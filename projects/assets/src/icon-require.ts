import * as React from 'react';

export interface SVGIconType extends React.FC<React.SVGAttributes<SVGElement>> {
	/** key of the name enum, both for debug purposes and dynamically matching. */
	iconName: string;
}

/**
 * Thanks to @svgr/webpack and file-loader,
 * 'require' of the SVG generates both the url
 * (like 'icons/A45FE232...9BD0342A.svg') and
 * the actual inline SVG.
 */
interface InnerSVGDef {
	default: string;
	ReactComponent: SVGIconType;
}

/** Dictionary of (keys of name enum) -> (URL). */
export const SVGIconTypeUrl = {} as unknown as Record<keyof typeof SVGIconTypeName, string>;

/**
 * Creates the correctly-typed React SVG component.
 * Also adds the URL of the component to our dictionary.
*/
export function create(name: keyof typeof SVGIconTypeName, result: any): SVGIconType {
	const inner = result as InnerSVGDef;

	inner.ReactComponent.iconName = name;
	SVGIconTypeUrl[name] = inner.default;

	return inner.ReactComponent;
}

export type EmptyIconName = 'empty';

/**
 * Serves to ensure all names are unique.
 */
export enum SVGIconTypeName {

	// Action
	actionAdd,
	actionCheck,
	actionCheckBold,
	actionClose,
	actionDelete,
	actionLike,
	actionMinus,
	actionPasswordHide,
	actionPasswordShow,
	actionPlay,
	actionSearch,
	actionStar,

	// // Arrow
	// arrowTriangleDownOutline,
	// arrowTriangleDownSolid,
	// arrowTriangleLeftOutline,
	// arrowTriangleLeftSolid,
	// arrowTriangleRightOutline,
	// arrowTriangleRightSolid,
	// arrowTriangleUpOutline,
	// arrowTriangleUpSolid,
	// arrowChevronDown,
	// arrowChevronLeftInline,
	// arrowChevronLeft,
	// arrowChevronRightInline,
	// arrowChevronRight,
	// arrowChevronUp,
	// arrowDown,
	// arrowLeft,
	// arrowOut,
	// arrowRight,
	// arrowUp,

	// // Brand
	// brandFavicon,
	// brandFull,
	// brandNamed,

	// // Communication
	// communicationAvatar,
	// communicationChat,
	// communicationForward,
	// communicationMask,
	// communicationMessage,
	// communicationNotification,
	// communicationReply,

	// // Content
	// contentCalendar,
	// contentDownload,
	// contentFile,
	// contentFolderOpened,
	// contentFolder,
	// contentReport,
	// contentUpload,

	// // Demo
	// demoCircle,
	// demoCube,
	// demoDiamond,
	// demoSquare,

	// // Editor
	// editorAlignmentCenter,
	// editorAlignmentLeft,
	// editorAlignmentRight,
	// editorEdit,
	// editorTypeface,

	// // Loader
	// loaderSun,
	// loaderQuarterTurn,

	// // Modifier
	// modifierDraggable,
	// modifierInputResizer,

	// // Navigation
	// navigationDashboard,
	// navigationDev,
	// navigationHome,
	// navigationLocation,
	// navigationMenu,
	// navigationSignIn,
	// navigationSignOut,
	// navigationUrl,

	// // Settings
	// settingsFilter,
	// settingsPassword,
	// settingsSettings,
	// settingsSort,

	// // Social
	// socialGithub,
	// socialTwitter,
	// socialYouTube,

	// // Status
	// statusAlertOutline,
	// statusAlertSolid,
	// statusErrorOutline,
	// statusErrorSolid,
	// statusInfoOutline,
	// statusInfoSolid,
	// statusSuccessOutline,
	// statusSuccessSolid,
	// statusCircle,
	// statusTriangle,

	// // Animal
	// animalBat,
	// animalBear,
	// animalBeaver,
	// animalBuffalo,
	// animalCamel,
	// animalCat,
	// animalElephant,
	// animalGiraffe,
	// animalHedgehog,
	// animalHorse,
	// animalKangaroo,
	// animalLlama,
	// animalMole,
	// animalSeal,
	// animalSquirrel,
	// animalWolf,
}
