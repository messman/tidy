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
// // export const actionMoreHorizontalOpen = create('actionMoreHorizontalOpen', require('@/static/icons/action/more/horizontal-open.svg'));
// // export const actionMoreHorizontal = create('actionMoreHorizontal', require('@/static/icons/action/more/horizontal.svg'));
// // export const actionMoreVerticalOpen = create('actionMoreVerticalOpen', require('@/static/icons/action/more/vertical-open.svg'));
// // export const actionMoreVertical = create('actionMoreVertical', require('@/static/icons/action/more/vertical.svg'));
export const actionAdd = create('actionAdd', require('@/static/icons/action/add.svg'));
export const actionCheck = create('actionCheck', require('@/static/icons/action/check.svg'));
export const actionCheckBold = create('actionCheckBold', require('@/static/icons/action/check-bold.svg'));
export const actionClose = create('actionClose', require('@/static/icons/action/close.svg'));
export const actionDelete = create('actionDelete', require('@/static/icons/action/delete.svg'));
export const actionLike = create('actionLike', require('@/static/icons/action/like.svg'));
export const actionMinus = create('actionMinus', require('@/static/icons/action/minus.svg'));
export const actionPasswordHide = create('actionPasswordHide', require('@/static/icons/action/password-hide.svg'));
export const actionPasswordShow = create('actionPasswordShow', require('@/static/icons/action/password-show.svg'));
export const actionPlay = create('actionPlay', require('@/static/icons/action/play.svg'));
export const actionSearch = create('actionSearch', require('@/static/icons/action/search.svg'));
export const actionStar = create('actionStar', require('@/static/icons/action/star.svg'));
// // Arrow
// export const arrowTriangleDownOutline = create('arrowTriangleDownOutline', require('@/static/icons/arrow/triangle/down-outline.svg'));
// export const arrowTriangleDownSolid = create('arrowTriangleDownSolid', require('@/static/icons/arrow/triangle/down-solid.svg'));
// export const arrowTriangleLeftOutline = create('arrowTriangleLeftOutline', require('@/static/icons/arrow/triangle/left-outline.svg'));
// export const arrowTriangleLeftSolid = create('arrowTriangleLeftSolid', require('@/static/icons/arrow/triangle/left-solid.svg'));
// export const arrowTriangleRightOutline = create('arrowTriangleRightOutline', require('@/static/icons/arrow/triangle/right-outline.svg'));
// export const arrowTriangleRightSolid = create('arrowTriangleRightSolid', require('@/static/icons/arrow/triangle/right-solid.svg'));
// export const arrowTriangleUpOutline = create('arrowTriangleUpOutline', require('@/static/icons/arrow/triangle/up-outline.svg'));
// export const arrowTriangleUpSolid = create('arrowTriangleUpSolid', require('@/static/icons/arrow/triangle/up-solid.svg'));
// export const arrowChevronDown = create('arrowChevronDown', require('@/static/icons/arrow/chevron-down.svg'));
// export const arrowChevronLeftInline = create('arrowChevronLeftInline', require('@/static/icons/arrow/chevron-left-inline.svg'));
// export const arrowChevronLeft = create('arrowChevronLeft', require('@/static/icons/arrow/chevron-left.svg'));
// export const arrowChevronRightInline = create('arrowChevronRightInline', require('@/static/icons/arrow/chevron-right-inline.svg'));
// export const arrowChevronRight = create('arrowChevronRight', require('@/static/icons/arrow/chevron-right.svg'));
// export const arrowChevronUp = create('arrowChevronUp', require('@/static/icons/arrow/chevron-up.svg'));
// export const arrowDown = create('arrowDown', require('@/static/icons/arrow/down.svg'));
// export const arrowLeft = create('arrowLeft', require('@/static/icons/arrow/left.svg'));
// export const arrowOut = create('arrowOut', require('@/static/icons/arrow/out.svg'));
// export const arrowRight = create('arrowRight', require('@/static/icons/arrow/right.svg'));
// export const arrowUp = create('arrowUp', require('@/static/icons/arrow/up.svg'));
// // Brand
// export const brandFavicon = create('brandFavicon', require('@/static/icons/brand/favicon.svg'));
// export const brandFull = create('brandFull', require('@/static/icons/brand/full.svg'));
// export const brandNamed = create('brandNamed', require('@/static/icons/brand/named.svg'));
// // Communication
// export const communicationAvatar = create('communicationAvatar', require('@/static/icons/communication/avatar.svg'));
// export const communicationChat = create('communicationChat', require('@/static/icons/communication/chat.svg'));
// export const communicationForward = create('communicationForward', require('@/static/icons/communication/forward.svg'));
// export const communicationMask = create('communicationMask', require('@/static/icons/communication/mask.svg'));
// export const communicationMessage = create('communicationMessage', require('@/static/icons/communication/message.svg'));
// export const communicationNotification = create('communicationNotification', require('@/static/icons/communication/notification.svg'));
// export const communicationReply = create('communicationReply', require('@/static/icons/communication/reply.svg'));
// // Content
// export const contentCalendar = create('contentCalendar', require('@/static/icons/content/calendar.svg'));
// export const contentDownload = create('contentDownload', require('@/static/icons/content/download.svg'));
// export const contentFile = create('contentFile', require('@/static/icons/content/file.svg'));
// export const contentFolderOpened = create('contentFolderOpened', require('@/static/icons/content/folder-opened.svg'));
// export const contentFolder = create('contentFolder', require('@/static/icons/content/folder.svg'));
// export const contentReport = create('contentReport', require('@/static/icons/content/report.svg'));
// export const contentUpload = create('contentUpload', require('@/static/icons/content/upload.svg'));
// // Demo
// export const demoCircle = create('demoCircle', require('@/static/icons/demo/circle.svg'));
// export const demoCube = create('demoCube', require('@/static/icons/demo/cube.svg'));
// export const demoDiamond = create('demoDiamond', require('@/static/icons/demo/diamond.svg'));
// export const demoSquare = create('demoSquare', require('@/static/icons/demo/square.svg'));
// // Editor
// export const editorAlignmentCenter = create('editorAlignmentCenter', require('@/static/icons/editor/alignment-center.svg'));
// export const editorAlignmentLeft = create('editorAlignmentLeft', require('@/static/icons/editor/alignment-left.svg'));
// export const editorAlignmentRight = create('editorAlignmentRight', require('@/static/icons/editor/alignment-right.svg'));
// export const editorEdit = create('editorEdit', require('@/static/icons/editor/edit.svg'));
// export const editorTypeface = create('editorTypeface', require('@/static/icons/editor/typeface.svg'));
// // Loader
// export const loaderSun = create('loaderSun', require('@/static/icons/loader/sun.svg'));
// export const loaderQuarterTurn = create('loaderQuarterTurn', require('@/static/icons/loader/quarter-turn.svg'));
// // Modifier
// export const modifierDraggable = create('modifierDraggable', require('@/static/icons/modifier/draggable.svg'));
// export const modifierInputResizer = create('modifierInputResizer', require('@/static/icons/modifier/input-resizer.svg'));
// // Navigation
// export const navigationDashboard = create('navigationDashboard', require('@/static/icons/navigation/dashboard.svg'));
// export const navigationDev = create('navigationDev', require('@/static/icons/navigation/dev.svg'));
// export const navigationHome = create('navigationHome', require('@/static/icons/navigation/home.svg'));
// export const navigationLocation = create('navigationLocation', require('@/static/icons/navigation/location.svg'));
// export const navigationMenu = create('navigationMenu', require('@/static/icons/navigation/menu.svg'));
// export const navigationSignIn = create('navigationSignIn', require('@/static/icons/navigation/sign-in.svg'));
// export const navigationSignOut = create('navigationSignOut', require('@/static/icons/navigation/sign-out.svg'));
// export const navigationUrl = create('navigationUrl', require('@/static/icons/navigation/url.svg'));
// // Settings
// export const settingsFilter = create('settingsFilter', require('@/static/icons/settings/filter.svg'));
// export const settingsPassword = create('settingsPassword', require('@/static/icons/settings/password.svg'));
// export const settingsSettings = create('settingsSettings', require('@/static/icons/settings/settings.svg'));
// export const settingsSort = create('settingsSort', require('@/static/icons/settings/sort.svg'));
// // Social
// export const socialGithub = create('socialGithub', require('@/static/icons/social/github.svg'));
// export const socialTwitter = create('socialTwitter', require('@/static/icons/social/twitter.svg'));
// export const socialYouTube = create('socialYouTube', require('@/static/icons/social/youtube.svg'));
// // Status
// export const statusAlertOutline = create('statusAlertOutline', require('@/static/icons/status/alert/outline.svg'));
// export const statusAlertSolid = create('statusAlertSolid', require('@/static/icons/status/alert/solid.svg'));
// export const statusErrorOutline = create('statusErrorOutline', require('@/static/icons/status/error/outline.svg'));
// export const statusErrorSolid = create('statusErrorSolid', require('@/static/icons/status/error/solid.svg'));
// export const statusInfoOutline = create('statusInfoOutline', require('@/static/icons/status/info/outline.svg'));
// export const statusInfoSolid = create('statusInfoSolid', require('@/static/icons/status/info/solid.svg'));
// export const statusSuccessOutline = create('statusSuccessOutline', require('@/static/icons/status/success/outline.svg'));
// export const statusSuccessSolid = create('statusSuccessSolid', require('@/static/icons/status/success/solid.svg'));
// export const statusCircle = create('statusCircle', require('@/static/icons/status/circle.svg'));
// export const statusTriangle = create('statusTriangle', require('@/static/icons/status/triangle.svg'));
// // Animal
// export const animalBat = create('animalBat', require('@/static/icons/animal/bat.svg'));
// export const animalBear = create('animalBear', require('@/static/icons/animal/bear.svg'));
// export const animalBeaver = create('animalBeaver', require('@/static/icons/animal/beaver.svg'));
// export const animalBuffalo = create('animalBuffalo', require('@/static/icons/animal/buffalo.svg'));
// export const animalCamel = create('animalCamel', require('@/static/icons/animal/camel.svg'));
// export const animalCat = create('animalCat', require('@/static/icons/animal/cat.svg'));
// export const animalElephant = create('animalElephant', require('@/static/icons/animal/elephant.svg'));
// export const animalGiraffe = create('animalGiraffe', require('@/static/icons/animal/giraffe.svg'));
// export const animalHedgehog = create('animalHedgehog', require('@/static/icons/animal/hedgehog.svg'));
// export const animalHorse = create('animalHorse', require('@/static/icons/animal/horse.svg'));
// export const animalKangaroo = create('animalKangaroo', require('@/static/icons/animal/kangaroo.svg'));
// export const animalLlama = create('animalLlama', require('@/static/icons/animal/llama.svg'));
// export const animalMole = create('animalMole', require('@/static/icons/animal/mole.svg'));
// export const animalSeal = create('animalSeal', require('@/static/icons/animal/seal.svg'));
// export const animalSquirrel = create('animalSquirrel', require('@/static/icons/animal/squirrel.svg'));
// export const animalWolf = create('animalWolf', require('@/static/icons/animal/wolf.svg'));