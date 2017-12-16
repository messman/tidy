/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(3);

__webpack_require__(6);

__webpack_require__(8);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./page.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./page.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Comfortaa|Lato:700);", ""]);

// module
exports.push([module.i, "html {\n  box-sizing: border-box;\n  font-family: \"Lato\", sans-serif;\n  color: #11394D;\n  background-image: linear-gradient(139deg, #A3CED4 0%, #1CAAB8 28%, #10597C 100%);\n  background-repeat: no-repeat;\n  background-attachment: fixed; }\n\nhtml, body {\n  margin: 0;\n  padding: 0; }\n\nheader {\n  text-align: center; }\n\nmain, .viewer {\n  display: flex;\n  flex-direction: column; }\n\n.viewer, .viewer-tides {\n  flex: 1; }\n\n.viewer-nums {\n  display: flex;\n  flex-direction: horizontal; }\n  .viewer-nums > * {\n    flex: 1;\n    padding: 1em 2em; }\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./waiting.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./waiting.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Comfortaa|Lato:700);", ""]);

// module
exports.push([module.i, ".waiting {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center; }\n\n.waiting-outer {\n  width: 75vmin;\n  height: 75vmin;\n  background-color: #DEE3E7;\n  border-radius: 50%;\n  border: 3vmin solid #979AAB;\n  position: relative;\n  overflow: hidden;\n  z-index: 1; }\n\n.waiting-wave {\n  position: absolute;\n  height: 100%;\n  width: 400%;\n  bottom: -60%;\n  left: -100%;\n  opacity: .4;\n  background: linear-gradient(to top, #10597C 50%, #1CAAB8 100%); }\n\n.waiting-wave:nth-child(1) {\n  animation: swell 8s ease-in-out 0s infinite, rock 8s ease-in-out -2s infinite; }\n\n.waiting-wave:nth-child(2) {\n  animation: swell 6s ease-in-out -1.5s infinite, rock 6s ease-in-out -3s infinite; }\n\n.waiting-wave:nth-child(3) {\n  animation: swell 8s ease-in-out -4s infinite, rock 8s ease-in-out -6s infinite; }\n\n@keyframes rock {\n  0%, 100% {\n    transform: rotate(5deg); }\n  50% {\n    transform: rotate(-17deg); } }\n\n@keyframes swell {\n  0% {\n    bottom: -60%; }\n  40% {\n    border-top-right-radius: 80%; }\n  50% {\n    bottom: -50%; }\n  100% {\n    border-radius: 0; } }\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _requests = __webpack_require__(9);

var Requests = _interopRequireWildcard(_requests);

var _sample_data = __webpack_require__(10);

var Data = _interopRequireWildcard(_sample_data);

var _ui = __webpack_require__(11);

var UI = _interopRequireWildcard(_ui);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Entry point to application
document.addEventListener("DOMContentLoaded", function () {
	console.log("Ready!");

	// Check for fetch support
	if (!window.fetch) {
		alert("This browser is not supported. Please use a more modern browser.");
	}

	// Requests.refreshData()
	// 	.then((values) => {
	// 		console.log(values);
	// 	});

	var data = {};
	Data.data.forEach(function (datapiece) {
		data[datapiece.key] = datapiece;
	});
	console.log(data);

	UI.fillNums(data);
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.refreshData = refreshData;
// API documentation: https://tidesandcurrents.noaa.gov/api/
var api = "https://tidesandcurrents.noaa.gov/api/datagetter";

var fetch_options = {
	station: 8419317, // Default: Wells, ME https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317
	application: "messman/quick-tides",
	format: "json",
	time_zone: "lst", // Local Time
	units: "english" // english | metric
};

function createRequest(opts) {
	opts = Object.assign({}, fetch_options, opts);
	var optsString = Object.keys(opts).map(function (key) {
		return key + "=" + encodeURIComponent(opts[key]);
	}).join("&");
	return api + "?" + optsString;
}

var products = {
	water_level: { product: "water_level", datum: "mllw", range: 24 },
	water_level_prediction: { product: "predictions", datum: "mllw", range: 24 },
	air_temp: { product: "air_temperature", date: "latest" },
	water_temp: { product: "water_temperature", date: "latest" },
	wind: { product: "wind", date: "latest" }
};

var lastRequestTime = -1;
var naturalRefreshTime = 6000 * 60; // 6 minutes, per the API

function refreshData() {
	var promises = Object.keys(products).map(function (key) {
		var url = createRequest(products[key]);
		return fetch(url).then(function (response) {
			if (response.ok) {
				return response.json();
			} else {
				return Promise.reject(response);
			}
		}).then(function (data) {
			data.key = key;
			return data;
		}).catch(function () {
			alert("Error"); // TODO
		});
	});
	return Promise.all(promises);
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var data = exports.data = [{
	"metadata": {
		"id": "8419317",
		"name": "Wells",
		"lat": "43.3200",
		"lon": "-70.5633"
	},
	"data": [{
		"t": "2017-12-15 15:36",
		"v": "-0.167",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 15:42",
		"v": "-0.125",
		"s": "0.010",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 15:48",
		"v": "-0.180",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 15:54",
		"v": "-0.075",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 16:00",
		"v": "0.026",
		"s": "0.013",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 16:06",
		"v": "0.056",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 16:12",
		"v": "0.072",
		"s": "0.013",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 16:18",
		"v": "0.177",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 16:24",
		"v": "0.302",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 16:30",
		"v": "0.400",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 16:36",
		"v": "0.669",
		"s": "0.039",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 16:42",
		"v": "0.794",
		"s": "0.016",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 16:48",
		"v": "0.919",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 16:54",
		"v": "1.004",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 17:00",
		"v": "1.089",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 17:06",
		"v": "1.302",
		"s": "0.033",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 17:12",
		"v": "1.493",
		"s": "0.003",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 17:18",
		"v": "1.699",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 17:24",
		"v": "1.890",
		"s": "0.049",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 17:30",
		"v": "2.080",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 17:36",
		"v": "2.218",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 17:42",
		"v": "2.441",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 17:48",
		"v": "2.612",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 17:54",
		"v": "2.785",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 18:00",
		"v": "2.969",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 18:06",
		"v": "3.189",
		"s": "0.039",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 18:12",
		"v": "3.458",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 18:18",
		"v": "3.684",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 18:24",
		"v": "3.924",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 18:30",
		"v": "4.114",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 18:36",
		"v": "4.288",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 18:42",
		"v": "4.498",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 18:48",
		"v": "4.672",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 18:54",
		"v": "4.902",
		"s": "0.036",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 19:00",
		"v": "5.167",
		"s": "0.033",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 19:06",
		"v": "5.384",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 19:12",
		"v": "5.577",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 19:18",
		"v": "5.758",
		"s": "0.016",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 19:24",
		"v": "5.974",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 19:30",
		"v": "6.211",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 19:36",
		"v": "6.434",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 19:42",
		"v": "6.608",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 19:48",
		"v": "6.775",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 19:54",
		"v": "6.906",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 20:00",
		"v": "7.008",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 20:06",
		"v": "7.156",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 20:12",
		"v": "7.323",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 20:18",
		"v": "7.418",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 20:24",
		"v": "7.559",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 20:30",
		"v": "7.720",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 20:36",
		"v": "7.812",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 20:42",
		"v": "7.943",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 20:48",
		"v": "8.058",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 20:54",
		"v": "8.117",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 21:00",
		"v": "8.179",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 21:06",
		"v": "8.228",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 21:12",
		"v": "8.258",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 21:18",
		"v": "8.258",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 21:24",
		"v": "8.255",
		"s": "0.010",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 21:30",
		"v": "8.261",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 21:36",
		"v": "8.271",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 21:42",
		"v": "8.251",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 21:48",
		"v": "8.232",
		"s": "0.010",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 21:54",
		"v": "8.232",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 22:00",
		"v": "8.169",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 22:06",
		"v": "8.130",
		"s": "0.010",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 22:12",
		"v": "8.110",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 22:18",
		"v": "8.002",
		"s": "0.010",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 22:24",
		"v": "7.953",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 22:30",
		"v": "7.897",
		"s": "0.016",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 22:36",
		"v": "7.785",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 22:42",
		"v": "7.680",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 22:48",
		"v": "7.572",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 22:54",
		"v": "7.516",
		"s": "0.013",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 23:00",
		"v": "7.385",
		"s": "0.016",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 23:06",
		"v": "7.297",
		"s": "0.013",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 23:12",
		"v": "7.182",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 23:18",
		"v": "7.011",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 23:24",
		"v": "6.893",
		"s": "0.013",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 23:30",
		"v": "6.742",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 23:36",
		"v": "6.549",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 23:42",
		"v": "6.411",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 23:48",
		"v": "6.181",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-15 23:54",
		"v": "6.007",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 00:00",
		"v": "5.823",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 00:06",
		"v": "5.597",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 00:12",
		"v": "5.387",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 00:18",
		"v": "5.213",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 00:24",
		"v": "5.016",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 00:30",
		"v": "4.892",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 00:36",
		"v": "4.744",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 00:42",
		"v": "4.478",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 00:48",
		"v": "4.265",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 00:54",
		"v": "4.039",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 01:00",
		"v": "3.825",
		"s": "0.043",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 01:06",
		"v": "3.560",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 01:12",
		"v": "3.402",
		"s": "0.010",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 01:18",
		"v": "3.251",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 01:24",
		"v": "3.107",
		"s": "0.010",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 01:30",
		"v": "3.002",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 01:36",
		"v": "2.795",
		"s": "0.033",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 01:42",
		"v": "2.543",
		"s": "0.013",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 01:48",
		"v": "2.257",
		"s": "0.046",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 01:54",
		"v": "2.037",
		"s": "0.049",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 02:00",
		"v": "2.018",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 02:06",
		"v": "1.962",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 02:12",
		"v": "1.798",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 02:18",
		"v": "1.801",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 02:24",
		"v": "1.591",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 02:30",
		"v": "1.329",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 02:36",
		"v": "1.237",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 02:42",
		"v": "1.181",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 02:48",
		"v": "1.043",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 02:54",
		"v": "1.020",
		"s": "0.043",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 03:00",
		"v": "1.053",
		"s": "0.013",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 03:06",
		"v": "0.951",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 03:12",
		"v": "0.886",
		"s": "0.010",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 03:18",
		"v": "0.902",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 03:24",
		"v": "0.958",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 03:30",
		"v": "0.797",
		"s": "0.003",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 03:36",
		"v": "0.833",
		"s": "0.039",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 03:42",
		"v": "0.784",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 03:48",
		"v": "0.840",
		"s": "0.007",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 03:54",
		"v": "1.014",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 04:00",
		"v": "1.063",
		"s": "0.007",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 04:06",
		"v": "1.070",
		"s": "0.007",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 04:12",
		"v": "1.171",
		"s": "0.010",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 04:18",
		"v": "1.201",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 04:24",
		"v": "1.204",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 04:30",
		"v": "1.414",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 04:36",
		"v": "1.440",
		"s": "0.003",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 04:42",
		"v": "1.581",
		"s": "0.049",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 04:48",
		"v": "1.749",
		"s": "0.007",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 04:54",
		"v": "1.785",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 05:00",
		"v": "1.955",
		"s": "0.036",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 05:06",
		"v": "2.185",
		"s": "0.010",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 05:12",
		"v": "2.264",
		"s": "0.010",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 05:18",
		"v": "2.425",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 05:24",
		"v": "2.523",
		"s": "0.010",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 05:30",
		"v": "2.648",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 05:36",
		"v": "2.858",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 05:42",
		"v": "3.045",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 05:48",
		"v": "3.278",
		"s": "0.039",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 05:54",
		"v": "3.504",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 06:00",
		"v": "3.678",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 06:06",
		"v": "3.885",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 06:12",
		"v": "4.094",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 06:18",
		"v": "4.259",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 06:24",
		"v": "4.459",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 06:30",
		"v": "4.695",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 06:36",
		"v": "4.934",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 06:42",
		"v": "5.148",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 06:48",
		"v": "5.341",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 06:54",
		"v": "5.564",
		"s": "0.033",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 07:00",
		"v": "5.768",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 07:06",
		"v": "5.938",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 07:12",
		"v": "6.158",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 07:18",
		"v": "6.401",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 07:24",
		"v": "6.594",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 07:30",
		"v": "6.795",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 07:36",
		"v": "6.988",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 07:42",
		"v": "7.162",
		"s": "0.033",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 07:48",
		"v": "7.362",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 07:54",
		"v": "7.559",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 08:00",
		"v": "7.736",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 08:06",
		"v": "7.904",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 08:12",
		"v": "8.058",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 08:18",
		"v": "8.209",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 08:24",
		"v": "8.330",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 08:30",
		"v": "8.474",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 08:36",
		"v": "8.599",
		"s": "0.016",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 08:42",
		"v": "8.711",
		"s": "0.013",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 08:48",
		"v": "8.799",
		"s": "0.010",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 08:54",
		"v": "8.862",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 09:00",
		"v": "8.950",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 09:06",
		"v": "9.006",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 09:12",
		"v": "9.081",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 09:18",
		"v": "9.131",
		"s": "0.007",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 09:24",
		"v": "9.114",
		"s": "0.007",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 09:30",
		"v": "9.150",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 09:36",
		"v": "9.147",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 09:42",
		"v": "9.121",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 09:48",
		"v": "9.127",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 09:54",
		"v": "9.088",
		"s": "0.007",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 10:00",
		"v": "9.081",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 10:06",
		"v": "9.058",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 10:12",
		"v": "9.012",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 10:18",
		"v": "8.973",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 10:24",
		"v": "8.914",
		"s": "0.010",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 10:30",
		"v": "8.819",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 10:36",
		"v": "8.704",
		"s": "0.016",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 10:42",
		"v": "8.612",
		"s": "0.013",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 10:48",
		"v": "8.510",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 10:54",
		"v": "8.389",
		"s": "0.016",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 11:00",
		"v": "8.251",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 11:06",
		"v": "8.130",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 11:12",
		"v": "7.969",
		"s": "0.020",
		"f": "1,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 11:18",
		"v": "7.815",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 11:24",
		"v": "7.677",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 11:30",
		"v": "7.513",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 11:36",
		"v": "7.320",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 11:42",
		"v": "7.139",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 11:48",
		"v": "6.932",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 11:54",
		"v": "6.729",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 12:00",
		"v": "6.539",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 12:06",
		"v": "6.335",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 12:12",
		"v": "6.132",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 12:18",
		"v": "5.915",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 12:24",
		"v": "5.709",
		"s": "0.033",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 12:30",
		"v": "5.502",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 12:36",
		"v": "5.295",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 12:42",
		"v": "5.062",
		"s": "0.036",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 12:48",
		"v": "4.833",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 12:54",
		"v": "4.619",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 13:00",
		"v": "4.383",
		"s": "0.033",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 13:06",
		"v": "4.134",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 13:12",
		"v": "3.901",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 13:18",
		"v": "3.645",
		"s": "0.033",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 13:24",
		"v": "3.415",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 13:30",
		"v": "3.159",
		"s": "0.036",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 13:36",
		"v": "2.910",
		"s": "0.036",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 13:42",
		"v": "2.651",
		"s": "0.030",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 13:48",
		"v": "2.461",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 13:54",
		"v": "2.257",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 14:00",
		"v": "2.067",
		"s": "0.026",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 14:06",
		"v": "1.896",
		"s": "0.023",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 14:12",
		"v": "1.631",
		"s": "0.039",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 14:18",
		"v": "1.417",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 14:24",
		"v": "1.266",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 14:30",
		"v": "1.106",
		"s": "0.033",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 14:36",
		"v": "0.919",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 14:42",
		"v": "0.810",
		"s": "0.007",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 14:48",
		"v": "0.666",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 14:54",
		"v": "0.446",
		"s": "0.033",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 15:00",
		"v": "0.322",
		"s": "0.013",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 15:06",
		"v": "0.276",
		"s": "0.007",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 15:12",
		"v": "0.131",
		"s": "0.033",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 15:18",
		"v": "-0.016",
		"s": "0.016",
		"f": "0,0,0,0",
		"q": "p"
	}, {
		"t": "2017-12-16 15:24",
		"v": "-0.007",
		"s": "0.003",
		"f": "0,0,0,0",
		"q": "p"
	}],
	"key": "water_level"
}, {
	"predictions": [{
		"t": "2017-12-15 20:30",
		"v": "7.811"
	}, {
		"t": "2017-12-15 20:36",
		"v": "7.917"
	}, {
		"t": "2017-12-15 20:42",
		"v": "8.015"
	}, {
		"t": "2017-12-15 20:48",
		"v": "8.104"
	}, {
		"t": "2017-12-15 20:54",
		"v": "8.184"
	}, {
		"t": "2017-12-15 21:00",
		"v": "8.254"
	}, {
		"t": "2017-12-15 21:06",
		"v": "8.316"
	}, {
		"t": "2017-12-15 21:12",
		"v": "8.368"
	}, {
		"t": "2017-12-15 21:18",
		"v": "8.410"
	}, {
		"t": "2017-12-15 21:24",
		"v": "8.443"
	}, {
		"t": "2017-12-15 21:30",
		"v": "8.467"
	}, {
		"t": "2017-12-15 21:36",
		"v": "8.481"
	}, {
		"t": "2017-12-15 21:42",
		"v": "8.485"
	}, {
		"t": "2017-12-15 21:48",
		"v": "8.479"
	}, {
		"t": "2017-12-15 21:54",
		"v": "8.463"
	}, {
		"t": "2017-12-15 22:00",
		"v": "8.438"
	}, {
		"t": "2017-12-15 22:06",
		"v": "8.403"
	}, {
		"t": "2017-12-15 22:12",
		"v": "8.357"
	}, {
		"t": "2017-12-15 22:18",
		"v": "8.302"
	}, {
		"t": "2017-12-15 22:24",
		"v": "8.237"
	}, {
		"t": "2017-12-15 22:30",
		"v": "8.161"
	}, {
		"t": "2017-12-15 22:36",
		"v": "8.076"
	}, {
		"t": "2017-12-15 22:42",
		"v": "7.981"
	}, {
		"t": "2017-12-15 22:48",
		"v": "7.875"
	}, {
		"t": "2017-12-15 22:54",
		"v": "7.760"
	}, {
		"t": "2017-12-15 23:00",
		"v": "7.635"
	}, {
		"t": "2017-12-15 23:06",
		"v": "7.501"
	}, {
		"t": "2017-12-15 23:12",
		"v": "7.357"
	}, {
		"t": "2017-12-15 23:18",
		"v": "7.205"
	}, {
		"t": "2017-12-15 23:24",
		"v": "7.044"
	}, {
		"t": "2017-12-15 23:30",
		"v": "6.874"
	}, {
		"t": "2017-12-15 23:36",
		"v": "6.697"
	}, {
		"t": "2017-12-15 23:42",
		"v": "6.513"
	}, {
		"t": "2017-12-15 23:48",
		"v": "6.321"
	}, {
		"t": "2017-12-15 23:54",
		"v": "6.124"
	}, {
		"t": "2017-12-16 00:00",
		"v": "5.921"
	}, {
		"t": "2017-12-16 00:06",
		"v": "5.713"
	}, {
		"t": "2017-12-16 00:12",
		"v": "5.502"
	}, {
		"t": "2017-12-16 00:18",
		"v": "5.287"
	}, {
		"t": "2017-12-16 00:24",
		"v": "5.069"
	}, {
		"t": "2017-12-16 00:30",
		"v": "4.850"
	}, {
		"t": "2017-12-16 00:36",
		"v": "4.629"
	}, {
		"t": "2017-12-16 00:42",
		"v": "4.409"
	}, {
		"t": "2017-12-16 00:48",
		"v": "4.189"
	}, {
		"t": "2017-12-16 00:54",
		"v": "3.971"
	}, {
		"t": "2017-12-16 01:00",
		"v": "3.755"
	}, {
		"t": "2017-12-16 01:06",
		"v": "3.543"
	}, {
		"t": "2017-12-16 01:12",
		"v": "3.334"
	}, {
		"t": "2017-12-16 01:18",
		"v": "3.130"
	}, {
		"t": "2017-12-16 01:24",
		"v": "2.930"
	}, {
		"t": "2017-12-16 01:30",
		"v": "2.737"
	}, {
		"t": "2017-12-16 01:36",
		"v": "2.550"
	}, {
		"t": "2017-12-16 01:42",
		"v": "2.370"
	}, {
		"t": "2017-12-16 01:48",
		"v": "2.197"
	}, {
		"t": "2017-12-16 01:54",
		"v": "2.032"
	}, {
		"t": "2017-12-16 02:00",
		"v": "1.875"
	}, {
		"t": "2017-12-16 02:06",
		"v": "1.727"
	}, {
		"t": "2017-12-16 02:12",
		"v": "1.588"
	}, {
		"t": "2017-12-16 02:18",
		"v": "1.458"
	}, {
		"t": "2017-12-16 02:24",
		"v": "1.337"
	}, {
		"t": "2017-12-16 02:30",
		"v": "1.226"
	}, {
		"t": "2017-12-16 02:36",
		"v": "1.125"
	}, {
		"t": "2017-12-16 02:42",
		"v": "1.034"
	}, {
		"t": "2017-12-16 02:48",
		"v": "0.952"
	}, {
		"t": "2017-12-16 02:54",
		"v": "0.882"
	}, {
		"t": "2017-12-16 03:00",
		"v": "0.821"
	}, {
		"t": "2017-12-16 03:06",
		"v": "0.772"
	}, {
		"t": "2017-12-16 03:12",
		"v": "0.732"
	}, {
		"t": "2017-12-16 03:18",
		"v": "0.704"
	}, {
		"t": "2017-12-16 03:24",
		"v": "0.686"
	}, {
		"t": "2017-12-16 03:30",
		"v": "0.679"
	}, {
		"t": "2017-12-16 03:36",
		"v": "0.682"
	}, {
		"t": "2017-12-16 03:42",
		"v": "0.697"
	}, {
		"t": "2017-12-16 03:48",
		"v": "0.722"
	}, {
		"t": "2017-12-16 03:54",
		"v": "0.758"
	}, {
		"t": "2017-12-16 04:00",
		"v": "0.805"
	}, {
		"t": "2017-12-16 04:06",
		"v": "0.862"
	}, {
		"t": "2017-12-16 04:12",
		"v": "0.930"
	}, {
		"t": "2017-12-16 04:18",
		"v": "1.008"
	}, {
		"t": "2017-12-16 04:24",
		"v": "1.097"
	}, {
		"t": "2017-12-16 04:30",
		"v": "1.196"
	}, {
		"t": "2017-12-16 04:36",
		"v": "1.304"
	}, {
		"t": "2017-12-16 04:42",
		"v": "1.422"
	}, {
		"t": "2017-12-16 04:48",
		"v": "1.550"
	}, {
		"t": "2017-12-16 04:54",
		"v": "1.686"
	}, {
		"t": "2017-12-16 05:00",
		"v": "1.832"
	}, {
		"t": "2017-12-16 05:06",
		"v": "1.985"
	}, {
		"t": "2017-12-16 05:12",
		"v": "2.147"
	}, {
		"t": "2017-12-16 05:18",
		"v": "2.316"
	}, {
		"t": "2017-12-16 05:24",
		"v": "2.492"
	}, {
		"t": "2017-12-16 05:30",
		"v": "2.675"
	}, {
		"t": "2017-12-16 05:36",
		"v": "2.864"
	}, {
		"t": "2017-12-16 05:42",
		"v": "3.059"
	}, {
		"t": "2017-12-16 05:48",
		"v": "3.258"
	}, {
		"t": "2017-12-16 05:54",
		"v": "3.463"
	}, {
		"t": "2017-12-16 06:00",
		"v": "3.672"
	}, {
		"t": "2017-12-16 06:06",
		"v": "3.884"
	}, {
		"t": "2017-12-16 06:12",
		"v": "4.099"
	}, {
		"t": "2017-12-16 06:18",
		"v": "4.317"
	}, {
		"t": "2017-12-16 06:24",
		"v": "4.537"
	}, {
		"t": "2017-12-16 06:30",
		"v": "4.758"
	}, {
		"t": "2017-12-16 06:36",
		"v": "4.980"
	}, {
		"t": "2017-12-16 06:42",
		"v": "5.202"
	}, {
		"t": "2017-12-16 06:48",
		"v": "5.424"
	}, {
		"t": "2017-12-16 06:54",
		"v": "5.645"
	}, {
		"t": "2017-12-16 07:00",
		"v": "5.864"
	}, {
		"t": "2017-12-16 07:06",
		"v": "6.082"
	}, {
		"t": "2017-12-16 07:12",
		"v": "6.297"
	}, {
		"t": "2017-12-16 07:18",
		"v": "6.509"
	}, {
		"t": "2017-12-16 07:24",
		"v": "6.717"
	}, {
		"t": "2017-12-16 07:30",
		"v": "6.921"
	}, {
		"t": "2017-12-16 07:36",
		"v": "7.120"
	}, {
		"t": "2017-12-16 07:42",
		"v": "7.315"
	}, {
		"t": "2017-12-16 07:48",
		"v": "7.503"
	}, {
		"t": "2017-12-16 07:54",
		"v": "7.686"
	}, {
		"t": "2017-12-16 08:00",
		"v": "7.862"
	}, {
		"t": "2017-12-16 08:06",
		"v": "8.031"
	}, {
		"t": "2017-12-16 08:12",
		"v": "8.192"
	}, {
		"t": "2017-12-16 08:18",
		"v": "8.346"
	}, {
		"t": "2017-12-16 08:24",
		"v": "8.491"
	}, {
		"t": "2017-12-16 08:30",
		"v": "8.628"
	}, {
		"t": "2017-12-16 08:36",
		"v": "8.757"
	}, {
		"t": "2017-12-16 08:42",
		"v": "8.876"
	}, {
		"t": "2017-12-16 08:48",
		"v": "8.986"
	}, {
		"t": "2017-12-16 08:54",
		"v": "9.087"
	}, {
		"t": "2017-12-16 09:00",
		"v": "9.178"
	}, {
		"t": "2017-12-16 09:06",
		"v": "9.259"
	}, {
		"t": "2017-12-16 09:12",
		"v": "9.330"
	}, {
		"t": "2017-12-16 09:18",
		"v": "9.392"
	}, {
		"t": "2017-12-16 09:24",
		"v": "9.443"
	}, {
		"t": "2017-12-16 09:30",
		"v": "9.484"
	}, {
		"t": "2017-12-16 09:36",
		"v": "9.515"
	}, {
		"t": "2017-12-16 09:42",
		"v": "9.536"
	}, {
		"t": "2017-12-16 09:48",
		"v": "9.546"
	}, {
		"t": "2017-12-16 09:54",
		"v": "9.546"
	}, {
		"t": "2017-12-16 10:00",
		"v": "9.536"
	}, {
		"t": "2017-12-16 10:06",
		"v": "9.515"
	}, {
		"t": "2017-12-16 10:12",
		"v": "9.484"
	}, {
		"t": "2017-12-16 10:18",
		"v": "9.443"
	}, {
		"t": "2017-12-16 10:24",
		"v": "9.391"
	}, {
		"t": "2017-12-16 10:30",
		"v": "9.329"
	}, {
		"t": "2017-12-16 10:36",
		"v": "9.256"
	}, {
		"t": "2017-12-16 10:42",
		"v": "9.173"
	}, {
		"t": "2017-12-16 10:48",
		"v": "9.079"
	}, {
		"t": "2017-12-16 10:54",
		"v": "8.975"
	}, {
		"t": "2017-12-16 11:00",
		"v": "8.861"
	}, {
		"t": "2017-12-16 11:06",
		"v": "8.736"
	}, {
		"t": "2017-12-16 11:12",
		"v": "8.601"
	}, {
		"t": "2017-12-16 11:18",
		"v": "8.456"
	}, {
		"t": "2017-12-16 11:24",
		"v": "8.300"
	}, {
		"t": "2017-12-16 11:30",
		"v": "8.136"
	}, {
		"t": "2017-12-16 11:36",
		"v": "7.961"
	}, {
		"t": "2017-12-16 11:42",
		"v": "7.778"
	}, {
		"t": "2017-12-16 11:48",
		"v": "7.585"
	}, {
		"t": "2017-12-16 11:54",
		"v": "7.384"
	}, {
		"t": "2017-12-16 12:00",
		"v": "7.175"
	}, {
		"t": "2017-12-16 12:06",
		"v": "6.959"
	}, {
		"t": "2017-12-16 12:12",
		"v": "6.736"
	}, {
		"t": "2017-12-16 12:18",
		"v": "6.506"
	}, {
		"t": "2017-12-16 12:24",
		"v": "6.271"
	}, {
		"t": "2017-12-16 12:30",
		"v": "6.031"
	}, {
		"t": "2017-12-16 12:36",
		"v": "5.786"
	}, {
		"t": "2017-12-16 12:42",
		"v": "5.539"
	}, {
		"t": "2017-12-16 12:48",
		"v": "5.289"
	}, {
		"t": "2017-12-16 12:54",
		"v": "5.037"
	}, {
		"t": "2017-12-16 13:00",
		"v": "4.784"
	}, {
		"t": "2017-12-16 13:06",
		"v": "4.531"
	}, {
		"t": "2017-12-16 13:12",
		"v": "4.280"
	}, {
		"t": "2017-12-16 13:18",
		"v": "4.029"
	}, {
		"t": "2017-12-16 13:24",
		"v": "3.781"
	}, {
		"t": "2017-12-16 13:30",
		"v": "3.537"
	}, {
		"t": "2017-12-16 13:36",
		"v": "3.296"
	}, {
		"t": "2017-12-16 13:42",
		"v": "3.060"
	}, {
		"t": "2017-12-16 13:48",
		"v": "2.830"
	}, {
		"t": "2017-12-16 13:54",
		"v": "2.606"
	}, {
		"t": "2017-12-16 14:00",
		"v": "2.388"
	}, {
		"t": "2017-12-16 14:06",
		"v": "2.177"
	}, {
		"t": "2017-12-16 14:12",
		"v": "1.975"
	}, {
		"t": "2017-12-16 14:18",
		"v": "1.780"
	}, {
		"t": "2017-12-16 14:24",
		"v": "1.594"
	}, {
		"t": "2017-12-16 14:30",
		"v": "1.417"
	}, {
		"t": "2017-12-16 14:36",
		"v": "1.249"
	}, {
		"t": "2017-12-16 14:42",
		"v": "1.090"
	}, {
		"t": "2017-12-16 14:48",
		"v": "0.942"
	}, {
		"t": "2017-12-16 14:54",
		"v": "0.803"
	}, {
		"t": "2017-12-16 15:00",
		"v": "0.675"
	}, {
		"t": "2017-12-16 15:06",
		"v": "0.557"
	}, {
		"t": "2017-12-16 15:12",
		"v": "0.449"
	}, {
		"t": "2017-12-16 15:18",
		"v": "0.352"
	}, {
		"t": "2017-12-16 15:24",
		"v": "0.266"
	}, {
		"t": "2017-12-16 15:30",
		"v": "0.191"
	}, {
		"t": "2017-12-16 15:36",
		"v": "0.127"
	}, {
		"t": "2017-12-16 15:42",
		"v": "0.073"
	}, {
		"t": "2017-12-16 15:48",
		"v": "0.031"
	}, {
		"t": "2017-12-16 15:54",
		"v": "0.000"
	}, {
		"t": "2017-12-16 16:00",
		"v": "-0.020"
	}, {
		"t": "2017-12-16 16:06",
		"v": "-0.029"
	}, {
		"t": "2017-12-16 16:12",
		"v": "-0.027"
	}, {
		"t": "2017-12-16 16:18",
		"v": "-0.014"
	}, {
		"t": "2017-12-16 16:24",
		"v": "0.011"
	}, {
		"t": "2017-12-16 16:30",
		"v": "0.046"
	}, {
		"t": "2017-12-16 16:36",
		"v": "0.092"
	}, {
		"t": "2017-12-16 16:42",
		"v": "0.149"
	}, {
		"t": "2017-12-16 16:48",
		"v": "0.217"
	}, {
		"t": "2017-12-16 16:54",
		"v": "0.295"
	}, {
		"t": "2017-12-16 17:00",
		"v": "0.384"
	}, {
		"t": "2017-12-16 17:06",
		"v": "0.483"
	}, {
		"t": "2017-12-16 17:12",
		"v": "0.591"
	}, {
		"t": "2017-12-16 17:18",
		"v": "0.709"
	}, {
		"t": "2017-12-16 17:24",
		"v": "0.837"
	}, {
		"t": "2017-12-16 17:30",
		"v": "0.973"
	}, {
		"t": "2017-12-16 17:36",
		"v": "1.118"
	}, {
		"t": "2017-12-16 17:42",
		"v": "1.270"
	}, {
		"t": "2017-12-16 17:48",
		"v": "1.431"
	}, {
		"t": "2017-12-16 17:54",
		"v": "1.599"
	}, {
		"t": "2017-12-16 18:00",
		"v": "1.774"
	}, {
		"t": "2017-12-16 18:06",
		"v": "1.955"
	}, {
		"t": "2017-12-16 18:12",
		"v": "2.141"
	}, {
		"t": "2017-12-16 18:18",
		"v": "2.334"
	}, {
		"t": "2017-12-16 18:24",
		"v": "2.531"
	}, {
		"t": "2017-12-16 18:30",
		"v": "2.732"
	}, {
		"t": "2017-12-16 18:36",
		"v": "2.937"
	}, {
		"t": "2017-12-16 18:42",
		"v": "3.145"
	}, {
		"t": "2017-12-16 18:48",
		"v": "3.356"
	}, {
		"t": "2017-12-16 18:54",
		"v": "3.569"
	}, {
		"t": "2017-12-16 19:00",
		"v": "3.783"
	}, {
		"t": "2017-12-16 19:06",
		"v": "3.998"
	}, {
		"t": "2017-12-16 19:12",
		"v": "4.214"
	}, {
		"t": "2017-12-16 19:18",
		"v": "4.430"
	}, {
		"t": "2017-12-16 19:24",
		"v": "4.644"
	}, {
		"t": "2017-12-16 19:30",
		"v": "4.858"
	}, {
		"t": "2017-12-16 19:36",
		"v": "5.069"
	}, {
		"t": "2017-12-16 19:42",
		"v": "5.279"
	}, {
		"t": "2017-12-16 19:48",
		"v": "5.485"
	}, {
		"t": "2017-12-16 19:54",
		"v": "5.688"
	}, {
		"t": "2017-12-16 20:00",
		"v": "5.886"
	}, {
		"t": "2017-12-16 20:06",
		"v": "6.081"
	}, {
		"t": "2017-12-16 20:12",
		"v": "6.270"
	}, {
		"t": "2017-12-16 20:18",
		"v": "6.454"
	}, {
		"t": "2017-12-16 20:24",
		"v": "6.632"
	}, {
		"t": "2017-12-16 20:30",
		"v": "6.803"
	}],
	"key": "water_level_prediction"
}, {
	"metadata": {
		"id": "8419317",
		"name": "Wells",
		"lat": "43.3200",
		"lon": "-70.5633"
	},
	"data": [{
		"t": "2017-12-15 15:36",
		"v": "25.2",
		"f": "0,0,0"
	}],
	"key": "air_temp"
}, {
	"metadata": {
		"id": "8419317",
		"name": "Wells",
		"lat": "43.3200",
		"lon": "-70.5633"
	},
	"data": [{
		"t": "2017-12-15 15:36",
		"v": "37.0",
		"f": "0,0,0"
	}],
	"key": "water_temp"
}, {
	"metadata": {
		"id": "8419317",
		"name": "Wells",
		"lat": "43.3200",
		"lon": "-70.5633"
	},
	"data": [{
		"t": "2017-12-15 15:36",
		"s": "2.14",
		"d": "260.00",
		"dr": "W",
		"g": "3.69",
		"f": "0,0"
	}],
	"key": "wind"
}];

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fillNums = fillNums;
var ui = {
	air: {
		temp: "ui-air-temp",
		wind: "ui-air-wind"
	},
	water: {
		temp: "ui-water-temp",
		level: "ui-water-level"
	}
};

function fillNums(data) {

	// Air Temp
	var airTempData = data["air_temp"];
	var airTempUI = document.getElementById(ui.air.temp);
	if (airTempData.data) {
		var first = airTempData.data[0];
		airTempUI.innerHTML = first.v + "&deg;";
	} else {
		airTempUI.innerHTML = "?";
	}

	// Wind
	var windData = data["wind"];
	var windUI = document.getElementById(ui.air.wind);
	if (windData.data) {
		var _first = windData.data[0];
		var mph = Math.round(_first.s * (6076 / 5280) * 100) / 100;
		windUI.innerHTML = mph + " mph " + _first.dr + " (" + _first.d + "&deg;)";
	} else {
		windUI.innerHTML = "?";
	}
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map