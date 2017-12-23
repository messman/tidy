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

__webpack_require__(12);

__webpack_require__(6);

__webpack_require__(15);

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


// module
exports.push([module.i, "html {\n  box-sizing: border-box;\n  font-family: \"Futura\", \"Trebuchet MS\", Helvetica, sans-serif;\n  color: #11394D;\n  font-size: 120%;\n  background-image: linear-gradient(139deg, #A3CED4 0%, #1CAAB8 28%, #10597C 100%);\n  background-repeat: no-repeat;\n  background-attachment: fixed; }\n\nhtml, body, main {\n  margin: 0;\n  padding: 0;\n  height: 100%; }\n\nh1 {\n  text-shadow: 2px 2px rgba(0, 0, 0, 0.2); }\n\nh2 {\n  text-shadow: 1px 1px rgba(0, 0, 0, 0.1); }\n\nheader {\n  text-align: center; }\n\nmain, .viewer {\n  display: flex;\n  flex-direction: column; }\n\n.viewer, .viewer-tides {\n  flex: 1; }\n\n.viewer-nums {\n  display: flex;\n  flex-direction: row; }\n  .viewer-nums > * {\n    flex: 1; }\n", ""]);

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

var _tidewheel = __webpack_require__(14);

var TideWheel = _interopRequireWildcard(_tidewheel);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Entry point to application
document.addEventListener("DOMContentLoaded", function () {
	console.log("Ready!");

	// Check for fetch support
	if (!window.fetch) {
		alert("This browser is not supported. Please use a more modern browser.");
	}

	TideWheel.setup();

	// Requests.refreshData()
	// 	.then((values) => {
	// 		console.log(values);
	// 		window.stuff = values;
	// 	});

	var data = {};
	Data.data.forEach(function (datapiece) {
		data[datapiece.key] = datapiece;
	});

	display(Data.now, data);
});

function display(now, data) {
	UI.fillNums(data);
	TideWheel.update(now, data);
}

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
	water_level_prediction: { product: "predictions", datum: "mtl" },
	water_level: { product: "water_level", datum: "mtl", date: "latest" },
	air_temp: { product: "air_temperature", date: "latest" },
	water_temp: { product: "water_temperature", date: "latest" },
	wind: { product: "wind", date: "latest" }
};

var lastRequestTime = -1;
var naturalRefreshTime = 6000 * 60; // 6 minutes, per the API

// Return a formatted date minus X hours
function formatDate(minusHours) {
	//yyyyMMdd HH:mm
	var d = new Date();
	d.setHours(d.getHours() - minusHours);
	var twos = [d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()];
	twos = twos.map(function (num) {
		return num.toString().padStart(2, "0");
	});
	return "" + d.getFullYear() + twos[0] + twos[1] + " " + twos[2] + ":" + twos[3];
}

var predictionHoursRadius = 20;

function refreshData() {
	// Update the water_level_prediction to be X hours before and X hours after
	var predictions = products["water_level_prediction"];
	predictions["begin_date"] = formatDate(predictionHoursRadius);
	predictions["range"] = predictionHoursRadius * 2;

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
var now = exports.now = 1513465847306;
var data = exports.data = [{
	"predictions": [{
		"t": "2017-12-16 03:30",
		"v": "-4.056"
	}, {
		"t": "2017-12-16 03:36",
		"v": "-4.052"
	}, {
		"t": "2017-12-16 03:42",
		"v": "-4.037"
	}, {
		"t": "2017-12-16 03:48",
		"v": "-4.012"
	}, {
		"t": "2017-12-16 03:54",
		"v": "-3.976"
	}, {
		"t": "2017-12-16 04:00",
		"v": "-3.930"
	}, {
		"t": "2017-12-16 04:06",
		"v": "-3.872"
	}, {
		"t": "2017-12-16 04:12",
		"v": "-3.804"
	}, {
		"t": "2017-12-16 04:18",
		"v": "-3.726"
	}, {
		"t": "2017-12-16 04:24",
		"v": "-3.637"
	}, {
		"t": "2017-12-16 04:30",
		"v": "-3.539"
	}, {
		"t": "2017-12-16 04:36",
		"v": "-3.430"
	}, {
		"t": "2017-12-16 04:42",
		"v": "-3.312"
	}, {
		"t": "2017-12-16 04:48",
		"v": "-3.185"
	}, {
		"t": "2017-12-16 04:54",
		"v": "-3.048"
	}, {
		"t": "2017-12-16 05:00",
		"v": "-2.903"
	}, {
		"t": "2017-12-16 05:06",
		"v": "-2.749"
	}, {
		"t": "2017-12-16 05:12",
		"v": "-2.588"
	}, {
		"t": "2017-12-16 05:18",
		"v": "-2.418"
	}, {
		"t": "2017-12-16 05:24",
		"v": "-2.242"
	}, {
		"t": "2017-12-16 05:30",
		"v": "-2.059"
	}, {
		"t": "2017-12-16 05:36",
		"v": "-1.870"
	}, {
		"t": "2017-12-16 05:42",
		"v": "-1.676"
	}, {
		"t": "2017-12-16 05:48",
		"v": "-1.476"
	}, {
		"t": "2017-12-16 05:54",
		"v": "-1.271"
	}, {
		"t": "2017-12-16 06:00",
		"v": "-1.063"
	}, {
		"t": "2017-12-16 06:06",
		"v": "-0.850"
	}, {
		"t": "2017-12-16 06:12",
		"v": "-0.635"
	}, {
		"t": "2017-12-16 06:18",
		"v": "-0.417"
	}, {
		"t": "2017-12-16 06:24",
		"v": "-0.198"
	}, {
		"t": "2017-12-16 06:30",
		"v": "0.024"
	}, {
		"t": "2017-12-16 06:36",
		"v": "0.245"
	}, {
		"t": "2017-12-16 06:42",
		"v": "0.468"
	}, {
		"t": "2017-12-16 06:48",
		"v": "0.689"
	}, {
		"t": "2017-12-16 06:54",
		"v": "0.910"
	}, {
		"t": "2017-12-16 07:00",
		"v": "1.130"
	}, {
		"t": "2017-12-16 07:06",
		"v": "1.347"
	}, {
		"t": "2017-12-16 07:12",
		"v": "1.562"
	}, {
		"t": "2017-12-16 07:18",
		"v": "1.774"
	}, {
		"t": "2017-12-16 07:24",
		"v": "1.983"
	}, {
		"t": "2017-12-16 07:30",
		"v": "2.187"
	}, {
		"t": "2017-12-16 07:36",
		"v": "2.386"
	}, {
		"t": "2017-12-16 07:42",
		"v": "2.580"
	}, {
		"t": "2017-12-16 07:48",
		"v": "2.769"
	}, {
		"t": "2017-12-16 07:54",
		"v": "2.952"
	}, {
		"t": "2017-12-16 08:00",
		"v": "3.127"
	}, {
		"t": "2017-12-16 08:06",
		"v": "3.296"
	}, {
		"t": "2017-12-16 08:12",
		"v": "3.458"
	}, {
		"t": "2017-12-16 08:18",
		"v": "3.611"
	}, {
		"t": "2017-12-16 08:24",
		"v": "3.757"
	}, {
		"t": "2017-12-16 08:30",
		"v": "3.894"
	}, {
		"t": "2017-12-16 08:36",
		"v": "4.022"
	}, {
		"t": "2017-12-16 08:42",
		"v": "4.142"
	}, {
		"t": "2017-12-16 08:48",
		"v": "4.252"
	}, {
		"t": "2017-12-16 08:54",
		"v": "4.352"
	}, {
		"t": "2017-12-16 09:00",
		"v": "4.443"
	}, {
		"t": "2017-12-16 09:06",
		"v": "4.525"
	}, {
		"t": "2017-12-16 09:12",
		"v": "4.596"
	}, {
		"t": "2017-12-16 09:18",
		"v": "4.657"
	}, {
		"t": "2017-12-16 09:24",
		"v": "4.709"
	}, {
		"t": "2017-12-16 09:30",
		"v": "4.750"
	}, {
		"t": "2017-12-16 09:36",
		"v": "4.781"
	}, {
		"t": "2017-12-16 09:42",
		"v": "4.801"
	}, {
		"t": "2017-12-16 09:48",
		"v": "4.812"
	}, {
		"t": "2017-12-16 09:54",
		"v": "4.812"
	}, {
		"t": "2017-12-16 10:00",
		"v": "4.802"
	}, {
		"t": "2017-12-16 10:06",
		"v": "4.781"
	}, {
		"t": "2017-12-16 10:12",
		"v": "4.750"
	}, {
		"t": "2017-12-16 10:18",
		"v": "4.709"
	}, {
		"t": "2017-12-16 10:24",
		"v": "4.657"
	}, {
		"t": "2017-12-16 10:30",
		"v": "4.595"
	}, {
		"t": "2017-12-16 10:36",
		"v": "4.522"
	}, {
		"t": "2017-12-16 10:42",
		"v": "4.439"
	}, {
		"t": "2017-12-16 10:48",
		"v": "4.345"
	}, {
		"t": "2017-12-16 10:54",
		"v": "4.241"
	}, {
		"t": "2017-12-16 11:00",
		"v": "4.126"
	}, {
		"t": "2017-12-16 11:06",
		"v": "4.002"
	}, {
		"t": "2017-12-16 11:12",
		"v": "3.867"
	}, {
		"t": "2017-12-16 11:18",
		"v": "3.721"
	}, {
		"t": "2017-12-16 11:24",
		"v": "3.566"
	}, {
		"t": "2017-12-16 11:30",
		"v": "3.401"
	}, {
		"t": "2017-12-16 11:36",
		"v": "3.227"
	}, {
		"t": "2017-12-16 11:42",
		"v": "3.043"
	}, {
		"t": "2017-12-16 11:48",
		"v": "2.851"
	}, {
		"t": "2017-12-16 11:54",
		"v": "2.650"
	}, {
		"t": "2017-12-16 12:00",
		"v": "2.441"
	}, {
		"t": "2017-12-16 12:06",
		"v": "2.225"
	}, {
		"t": "2017-12-16 12:12",
		"v": "2.001"
	}, {
		"t": "2017-12-16 12:18",
		"v": "1.772"
	}, {
		"t": "2017-12-16 12:24",
		"v": "1.537"
	}, {
		"t": "2017-12-16 12:30",
		"v": "1.296"
	}, {
		"t": "2017-12-16 12:36",
		"v": "1.052"
	}, {
		"t": "2017-12-16 12:42",
		"v": "0.805"
	}, {
		"t": "2017-12-16 12:48",
		"v": "0.555"
	}, {
		"t": "2017-12-16 12:54",
		"v": "0.303"
	}, {
		"t": "2017-12-16 13:00",
		"v": "0.050"
	}, {
		"t": "2017-12-16 13:06",
		"v": "-0.203"
	}, {
		"t": "2017-12-16 13:12",
		"v": "-0.455"
	}, {
		"t": "2017-12-16 13:18",
		"v": "-0.705"
	}, {
		"t": "2017-12-16 13:24",
		"v": "-0.953"
	}, {
		"t": "2017-12-16 13:30",
		"v": "-1.197"
	}, {
		"t": "2017-12-16 13:36",
		"v": "-1.438"
	}, {
		"t": "2017-12-16 13:42",
		"v": "-1.674"
	}, {
		"t": "2017-12-16 13:48",
		"v": "-1.904"
	}, {
		"t": "2017-12-16 13:54",
		"v": "-2.129"
	}, {
		"t": "2017-12-16 14:00",
		"v": "-2.346"
	}, {
		"t": "2017-12-16 14:06",
		"v": "-2.557"
	}, {
		"t": "2017-12-16 14:12",
		"v": "-2.760"
	}, {
		"t": "2017-12-16 14:18",
		"v": "-2.954"
	}, {
		"t": "2017-12-16 14:24",
		"v": "-3.140"
	}, {
		"t": "2017-12-16 14:30",
		"v": "-3.318"
	}, {
		"t": "2017-12-16 14:36",
		"v": "-3.486"
	}, {
		"t": "2017-12-16 14:42",
		"v": "-3.644"
	}, {
		"t": "2017-12-16 14:48",
		"v": "-3.793"
	}, {
		"t": "2017-12-16 14:54",
		"v": "-3.931"
	}, {
		"t": "2017-12-16 15:00",
		"v": "-4.060"
	}, {
		"t": "2017-12-16 15:06",
		"v": "-4.178"
	}, {
		"t": "2017-12-16 15:12",
		"v": "-4.285"
	}, {
		"t": "2017-12-16 15:18",
		"v": "-4.382"
	}, {
		"t": "2017-12-16 15:24",
		"v": "-4.468"
	}, {
		"t": "2017-12-16 15:30",
		"v": "-4.543"
	}, {
		"t": "2017-12-16 15:36",
		"v": "-4.608"
	}, {
		"t": "2017-12-16 15:42",
		"v": "-4.661"
	}, {
		"t": "2017-12-16 15:48",
		"v": "-4.703"
	}, {
		"t": "2017-12-16 15:54",
		"v": "-4.735"
	}, {
		"t": "2017-12-16 16:00",
		"v": "-4.755"
	}, {
		"t": "2017-12-16 16:06",
		"v": "-4.764"
	}, {
		"t": "2017-12-16 16:12",
		"v": "-4.761"
	}, {
		"t": "2017-12-16 16:18",
		"v": "-4.748"
	}, {
		"t": "2017-12-16 16:24",
		"v": "-4.724"
	}, {
		"t": "2017-12-16 16:30",
		"v": "-4.688"
	}, {
		"t": "2017-12-16 16:36",
		"v": "-4.642"
	}, {
		"t": "2017-12-16 16:42",
		"v": "-4.585"
	}, {
		"t": "2017-12-16 16:48",
		"v": "-4.517"
	}, {
		"t": "2017-12-16 16:54",
		"v": "-4.439"
	}, {
		"t": "2017-12-16 17:00",
		"v": "-4.350"
	}, {
		"t": "2017-12-16 17:06",
		"v": "-4.252"
	}, {
		"t": "2017-12-16 17:12",
		"v": "-4.143"
	}, {
		"t": "2017-12-16 17:18",
		"v": "-4.025"
	}, {
		"t": "2017-12-16 17:24",
		"v": "-3.898"
	}, {
		"t": "2017-12-16 17:30",
		"v": "-3.761"
	}, {
		"t": "2017-12-16 17:36",
		"v": "-3.617"
	}, {
		"t": "2017-12-16 17:42",
		"v": "-3.464"
	}, {
		"t": "2017-12-16 17:48",
		"v": "-3.303"
	}, {
		"t": "2017-12-16 17:54",
		"v": "-3.135"
	}, {
		"t": "2017-12-16 18:00",
		"v": "-2.961"
	}, {
		"t": "2017-12-16 18:06",
		"v": "-2.780"
	}, {
		"t": "2017-12-16 18:12",
		"v": "-2.593"
	}, {
		"t": "2017-12-16 18:18",
		"v": "-2.401"
	}, {
		"t": "2017-12-16 18:24",
		"v": "-2.204"
	}, {
		"t": "2017-12-16 18:30",
		"v": "-2.002"
	}, {
		"t": "2017-12-16 18:36",
		"v": "-1.797"
	}, {
		"t": "2017-12-16 18:42",
		"v": "-1.589"
	}, {
		"t": "2017-12-16 18:48",
		"v": "-1.378"
	}, {
		"t": "2017-12-16 18:54",
		"v": "-1.166"
	}, {
		"t": "2017-12-16 19:00",
		"v": "-0.951"
	}, {
		"t": "2017-12-16 19:06",
		"v": "-0.736"
	}, {
		"t": "2017-12-16 19:12",
		"v": "-0.520"
	}, {
		"t": "2017-12-16 19:18",
		"v": "-0.305"
	}, {
		"t": "2017-12-16 19:24",
		"v": "-0.090"
	}, {
		"t": "2017-12-16 19:30",
		"v": "0.124"
	}, {
		"t": "2017-12-16 19:36",
		"v": "0.335"
	}, {
		"t": "2017-12-16 19:42",
		"v": "0.544"
	}, {
		"t": "2017-12-16 19:48",
		"v": "0.751"
	}, {
		"t": "2017-12-16 19:54",
		"v": "0.953"
	}, {
		"t": "2017-12-16 20:00",
		"v": "1.152"
	}, {
		"t": "2017-12-16 20:06",
		"v": "1.346"
	}, {
		"t": "2017-12-16 20:12",
		"v": "1.536"
	}, {
		"t": "2017-12-16 20:18",
		"v": "1.719"
	}, {
		"t": "2017-12-16 20:24",
		"v": "1.897"
	}, {
		"t": "2017-12-16 20:30",
		"v": "2.069"
	}, {
		"t": "2017-12-16 20:36",
		"v": "2.234"
	}, {
		"t": "2017-12-16 20:42",
		"v": "2.391"
	}, {
		"t": "2017-12-16 20:48",
		"v": "2.541"
	}, {
		"t": "2017-12-16 20:54",
		"v": "2.684"
	}, {
		"t": "2017-12-16 21:00",
		"v": "2.818"
	}, {
		"t": "2017-12-16 21:06",
		"v": "2.944"
	}, {
		"t": "2017-12-16 21:12",
		"v": "3.061"
	}, {
		"t": "2017-12-16 21:18",
		"v": "3.170"
	}, {
		"t": "2017-12-16 21:24",
		"v": "3.269"
	}, {
		"t": "2017-12-16 21:30",
		"v": "3.360"
	}, {
		"t": "2017-12-16 21:36",
		"v": "3.441"
	}, {
		"t": "2017-12-16 21:42",
		"v": "3.513"
	}, {
		"t": "2017-12-16 21:48",
		"v": "3.575"
	}, {
		"t": "2017-12-16 21:54",
		"v": "3.628"
	}, {
		"t": "2017-12-16 22:00",
		"v": "3.672"
	}, {
		"t": "2017-12-16 22:06",
		"v": "3.705"
	}, {
		"t": "2017-12-16 22:12",
		"v": "3.730"
	}, {
		"t": "2017-12-16 22:18",
		"v": "3.744"
	}, {
		"t": "2017-12-16 22:24",
		"v": "3.749"
	}, {
		"t": "2017-12-16 22:30",
		"v": "3.744"
	}, {
		"t": "2017-12-16 22:36",
		"v": "3.729"
	}, {
		"t": "2017-12-16 22:42",
		"v": "3.705"
	}, {
		"t": "2017-12-16 22:48",
		"v": "3.670"
	}, {
		"t": "2017-12-16 22:54",
		"v": "3.626"
	}, {
		"t": "2017-12-16 23:00",
		"v": "3.572"
	}, {
		"t": "2017-12-16 23:06",
		"v": "3.508"
	}, {
		"t": "2017-12-16 23:12",
		"v": "3.435"
	}, {
		"t": "2017-12-16 23:18",
		"v": "3.351"
	}, {
		"t": "2017-12-16 23:24",
		"v": "3.258"
	}, {
		"t": "2017-12-16 23:30",
		"v": "3.154"
	}, {
		"t": "2017-12-16 23:36",
		"v": "3.042"
	}, {
		"t": "2017-12-16 23:42",
		"v": "2.919"
	}, {
		"t": "2017-12-16 23:48",
		"v": "2.787"
	}, {
		"t": "2017-12-16 23:54",
		"v": "2.646"
	}, {
		"t": "2017-12-17 00:00",
		"v": "2.496"
	}, {
		"t": "2017-12-17 00:06",
		"v": "2.337"
	}, {
		"t": "2017-12-17 00:12",
		"v": "2.170"
	}, {
		"t": "2017-12-17 00:18",
		"v": "1.995"
	}, {
		"t": "2017-12-17 00:24",
		"v": "1.813"
	}, {
		"t": "2017-12-17 00:30",
		"v": "1.623"
	}, {
		"t": "2017-12-17 00:36",
		"v": "1.428"
	}, {
		"t": "2017-12-17 00:42",
		"v": "1.226"
	}, {
		"t": "2017-12-17 00:48",
		"v": "1.019"
	}, {
		"t": "2017-12-17 00:54",
		"v": "0.808"
	}, {
		"t": "2017-12-17 01:00",
		"v": "0.593"
	}, {
		"t": "2017-12-17 01:06",
		"v": "0.376"
	}, {
		"t": "2017-12-17 01:12",
		"v": "0.156"
	}, {
		"t": "2017-12-17 01:18",
		"v": "-0.065"
	}, {
		"t": "2017-12-17 01:24",
		"v": "-0.286"
	}, {
		"t": "2017-12-17 01:30",
		"v": "-0.507"
	}, {
		"t": "2017-12-17 01:36",
		"v": "-0.726"
	}, {
		"t": "2017-12-17 01:42",
		"v": "-0.944"
	}, {
		"t": "2017-12-17 01:48",
		"v": "-1.158"
	}, {
		"t": "2017-12-17 01:54",
		"v": "-1.369"
	}, {
		"t": "2017-12-17 02:00",
		"v": "-1.575"
	}, {
		"t": "2017-12-17 02:06",
		"v": "-1.776"
	}, {
		"t": "2017-12-17 02:12",
		"v": "-1.971"
	}, {
		"t": "2017-12-17 02:18",
		"v": "-2.159"
	}, {
		"t": "2017-12-17 02:24",
		"v": "-2.340"
	}, {
		"t": "2017-12-17 02:30",
		"v": "-2.514"
	}, {
		"t": "2017-12-17 02:36",
		"v": "-2.680"
	}, {
		"t": "2017-12-17 02:42",
		"v": "-2.837"
	}, {
		"t": "2017-12-17 02:48",
		"v": "-2.985"
	}, {
		"t": "2017-12-17 02:54",
		"v": "-3.124"
	}, {
		"t": "2017-12-17 03:00",
		"v": "-3.253"
	}, {
		"t": "2017-12-17 03:06",
		"v": "-3.373"
	}, {
		"t": "2017-12-17 03:12",
		"v": "-3.483"
	}, {
		"t": "2017-12-17 03:18",
		"v": "-3.582"
	}, {
		"t": "2017-12-17 03:24",
		"v": "-3.671"
	}, {
		"t": "2017-12-17 03:30",
		"v": "-3.750"
	}, {
		"t": "2017-12-17 03:36",
		"v": "-3.818"
	}, {
		"t": "2017-12-17 03:42",
		"v": "-3.875"
	}, {
		"t": "2017-12-17 03:48",
		"v": "-3.922"
	}, {
		"t": "2017-12-17 03:54",
		"v": "-3.958"
	}, {
		"t": "2017-12-17 04:00",
		"v": "-3.984"
	}, {
		"t": "2017-12-17 04:06",
		"v": "-3.998"
	}, {
		"t": "2017-12-17 04:12",
		"v": "-4.002"
	}, {
		"t": "2017-12-17 04:18",
		"v": "-3.995"
	}, {
		"t": "2017-12-17 04:24",
		"v": "-3.977"
	}, {
		"t": "2017-12-17 04:30",
		"v": "-3.949"
	}, {
		"t": "2017-12-17 04:36",
		"v": "-3.910"
	}, {
		"t": "2017-12-17 04:42",
		"v": "-3.860"
	}, {
		"t": "2017-12-17 04:48",
		"v": "-3.800"
	}, {
		"t": "2017-12-17 04:54",
		"v": "-3.729"
	}, {
		"t": "2017-12-17 05:00",
		"v": "-3.648"
	}, {
		"t": "2017-12-17 05:06",
		"v": "-3.557"
	}, {
		"t": "2017-12-17 05:12",
		"v": "-3.456"
	}, {
		"t": "2017-12-17 05:18",
		"v": "-3.345"
	}, {
		"t": "2017-12-17 05:24",
		"v": "-3.225"
	}, {
		"t": "2017-12-17 05:30",
		"v": "-3.095"
	}, {
		"t": "2017-12-17 05:36",
		"v": "-2.957"
	}, {
		"t": "2017-12-17 05:42",
		"v": "-2.809"
	}, {
		"t": "2017-12-17 05:48",
		"v": "-2.654"
	}, {
		"t": "2017-12-17 05:54",
		"v": "-2.490"
	}, {
		"t": "2017-12-17 06:00",
		"v": "-2.319"
	}, {
		"t": "2017-12-17 06:06",
		"v": "-2.141"
	}, {
		"t": "2017-12-17 06:12",
		"v": "-1.956"
	}, {
		"t": "2017-12-17 06:18",
		"v": "-1.765"
	}, {
		"t": "2017-12-17 06:24",
		"v": "-1.569"
	}, {
		"t": "2017-12-17 06:30",
		"v": "-1.367"
	}, {
		"t": "2017-12-17 06:36",
		"v": "-1.160"
	}, {
		"t": "2017-12-17 06:42",
		"v": "-0.950"
	}, {
		"t": "2017-12-17 06:48",
		"v": "-0.736"
	}, {
		"t": "2017-12-17 06:54",
		"v": "-0.519"
	}, {
		"t": "2017-12-17 07:00",
		"v": "-0.299"
	}, {
		"t": "2017-12-17 07:06",
		"v": "-0.078"
	}, {
		"t": "2017-12-17 07:12",
		"v": "0.145"
	}, {
		"t": "2017-12-17 07:18",
		"v": "0.368"
	}, {
		"t": "2017-12-17 07:24",
		"v": "0.591"
	}, {
		"t": "2017-12-17 07:30",
		"v": "0.814"
	}, {
		"t": "2017-12-17 07:36",
		"v": "1.036"
	}, {
		"t": "2017-12-17 07:42",
		"v": "1.256"
	}, {
		"t": "2017-12-17 07:48",
		"v": "1.474"
	}, {
		"t": "2017-12-17 07:54",
		"v": "1.689"
	}, {
		"t": "2017-12-17 08:00",
		"v": "1.900"
	}, {
		"t": "2017-12-17 08:06",
		"v": "2.108"
	}, {
		"t": "2017-12-17 08:12",
		"v": "2.312"
	}, {
		"t": "2017-12-17 08:18",
		"v": "2.510"
	}, {
		"t": "2017-12-17 08:24",
		"v": "2.703"
	}, {
		"t": "2017-12-17 08:30",
		"v": "2.890"
	}, {
		"t": "2017-12-17 08:36",
		"v": "3.070"
	}, {
		"t": "2017-12-17 08:42",
		"v": "3.244"
	}, {
		"t": "2017-12-17 08:48",
		"v": "3.410"
	}, {
		"t": "2017-12-17 08:54",
		"v": "3.569"
	}, {
		"t": "2017-12-17 09:00",
		"v": "3.719"
	}, {
		"t": "2017-12-17 09:06",
		"v": "3.861"
	}, {
		"t": "2017-12-17 09:12",
		"v": "3.995"
	}, {
		"t": "2017-12-17 09:18",
		"v": "4.119"
	}, {
		"t": "2017-12-17 09:24",
		"v": "4.234"
	}, {
		"t": "2017-12-17 09:30",
		"v": "4.339"
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
		"t": "2017-12-16 18:24",
		"v": "-2.415",
		"s": "0.020",
		"f": "0,0,0,0",
		"q": "p"
	}],
	"key": "water_level"
}, {
	"metadata": {
		"id": "8419317",
		"name": "Wells",
		"lat": "43.3200",
		"lon": "-70.5633"
	},
	"data": [{
		"t": "2017-12-16 18:24",
		"v": "26.4",
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
		"t": "2017-12-16 18:24",
		"v": "37.6",
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
		"t": "2017-12-16 18:24",
		"s": "4.86",
		"d": "273.00",
		"dr": "W",
		"g": "9.52",
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
		waterTempUI.style.color = "";
	}

	// Wind
	var windData = data["wind"];
	var windUI = document.getElementById(ui.air.wind);
	if (windData.data) {
		var _first = windData.data[0];
		var mph = Math.round(_first.s * (6076 / 5280) * 10) / 10;
		windUI.innerHTML = mph + "mph " + _first.dr; // (${first.d}&deg;)`;
	} else {
		windUI.innerHTML = "?";
	}

	// Water Temp
	var waterTempData = data["water_temp"];
	var waterTempUI = document.getElementById(ui.water.temp);
	if (waterTempData.data) {
		var _first2 = waterTempData.data[0];
		waterTempUI.innerHTML = _first2.v + "&deg;";
	} else {
		waterTempUI.innerHTML = "?";
		waterTempUI.style.color = "";
	}

	// Water Level
	var waterLevelData = data["water_level"];
	var waterLevelUI = document.getElementById(ui.water.level);
	if (waterLevelData.data) {
		var _first3 = waterLevelData.data[0];
		waterLevelUI.innerHTML = _first3.v + "ft";
	} else {
		waterLevelUI.innerHTML = "?";
	}
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
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
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./nums.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./nums.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".nums {\n  padding: 0 1em; }\n\n.nums-content {\n  text-align: center;\n  font-family: \"Futura\", \"Trebuchet MS\", Helvetica, sans-serif;\n  border-bottom: 1px solid #11394D; }\n  .nums-content h1, .nums-content h2, .nums-content h3 {\n    margin: .5em;\n    margin-top: 0; }\n\n.nums-title {\n  margin: .2em; }\n\n.nums-left .nums-title {\n  text-align: left; }\n\n.nums-right .nums-title {\n  text-align: right; }\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setup = setup;
exports.update = update;
/*
	High / Low tides are calculated based on measurement data.

	Sample data output should be:
	Low		3:31AM	.7ft
	High	9:51AM	9.5ft
	Low		4:08PM	0ft
	High	10:23PM	8.5ft
*/

// The canvas we will draw to.
var canvas = null;
var canvasWidth = 0;
var canvasHeight = 0;
var devicePixelRatio = window.devicePixelRatio || 1;

function resize() {
	var ctx = canvas.getContext("2d");
	var backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
	var ratio = devicePixelRatio / backingStoreRatio;

	canvas.style.width = "100%";
	canvas.style.height = "100%";
	var rect = canvas.getBoundingClientRect();
	canvasWidth = Math.floor(rect.width);
	canvasHeight = Math.floor(rect.height);
	canvas.width = canvasWidth * ratio;
	canvas.height = canvasHeight * ratio;

	ctx.scale(ratio, ratio);

	redraw();
};
window.onresize = resize;

function setup() {
	canvas = document.getElementById("tides-canvas");
	resize();
}

var drawNums = null;

function parseTime(timeString) {
	// Parse for Safari
	// year-month-date HH:mm
	timeString = timeString.trim();
	var parts = timeString.split(" ");
	var date = parts[0];
	var dateParts = date.split("-");
	var year = dateParts[0];
	var month = dateParts[1];
	var dateDay = dateParts[2];

	var time = parts[1];
	var timeParts = time.split(":");
	var hours = timeParts[0];
	var minutes = timeParts[1];

	var newDate = new Date();
	newDate.setFullYear(year, month - 1, dateDay);
	newDate.setHours(hours);
	newDate.setMinutes(minutes);
	newDate.setSeconds(0);
	newDate.setMilliseconds(0);

	return newDate;
}

function update(now, data) {
	var p = data["water_level_prediction"].predictions;
	if (!p || !p.length) return;

	var isRising = false;
	var prev = null;
	var points = [];
	p.forEach(function (curr, i) {
		if (i === 0) {
			prev = curr;
			return;
		}
		var diff = curr.v - prev.v;
		var add = false;
		if (isRising && diff > 0) {
			isRising = false;
			add = true;
		} else if (!isRising && diff < 0) {
			isRising = true;
			add = true;
		}
		if (add) {
			points.push({
				time: parseTime(curr.t),
				val: parseFloat(curr.v),
				index: i
			});
		}
		prev = curr;
	});

	var nowDate = new Date(now);
	nowDate.setHours(nowDate.getHours() + 4);
	var currentLevel = parseFloat(data["water_level"].data[0].v);

	var closestHigh = null;
	var closestLow = null;
	points.forEach(function (point) {
		if (point.val < currentLevel) {
			if (!closestLow || Math.abs(nowDate - point.time) < Math.abs(now - closestLow.time)) closestLow = point;
		} else {
			if (!closestHigh || Math.abs(nowDate - point.time) < Math.abs(now - closestHigh.time)) closestHigh = point;
		}
	});

	var diff = closestLow.time - closestHigh.time;
	isRising = diff < 0;
	var angle = void 0;
	if (isRising) {
		angle = (nowDate - closestLow.time) / Math.abs(diff) * Math.PI + Math.PI;
	} else {
		angle = (nowDate - closestHigh.time) / Math.abs(diff) * Math.PI;
	}

	drawNums = {
		now: nowDate,
		low: closestLow.time,
		high: closestHigh.time,
		isRising: isRising,
		angle: angle
	};
	console.log(drawNums);

	redraw();
}

var colors = {
	darkBlue: "#11394D",
	mediumBlue: "#10597C",
	lightBlue: "#1CAAB8",
	paleBlue: "#A3CED4",
	light: "#DEE3E7",
	gray: "#979AAB"
};

var centerRadiusPercent = .3;
var dialThicknessPercent = .1;
var tidalAreaHeightPercent = .20;

function redraw() {
	if (!drawNums) return;

	var ctx = canvas.getContext("2d");

	// So we don't get cut off due to rounding
	var padding = 10;
	var totalWidth = canvasWidth - padding * 2;
	var totalHeight = canvasHeight - padding * 2;
	var bounds = { x: padding, y: padding, size: 0 };
	var diff = (totalWidth - totalHeight) / 2;
	if (diff > 0) {
		// Longer than tall
		bounds.size = totalHeight;
		bounds.x += diff;
	} else if (diff < 0) {
		// Taller than long
		bounds.size = totalWidth;
		bounds.y += -diff;
	}

	ctx.rect(bounds.x, bounds.y, bounds.size, bounds.size);
	ctx.save();

	var radius = bounds.size / 2;
	var centerX = bounds.x + radius;
	var centerY = bounds.y + radius;

	var centerRadius = radius * centerRadiusPercent;
	var tidalAreaHeight = bounds.size * tidalAreaHeightPercent;
	var dialThickness = bounds.size * dialThicknessPercent;

	try {

		// Draw the oval
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fillStyle = colors.paleBlue;
		ctx.fill();
		ctx.strokeStyle = colors.paleBlue;
		ctx.lineWidth = 2;
		ctx.globalCompositeOperation = "destination-out";
		ctx.stroke();
		ctx.globalCompositeOperation = "source-over";
		ctx.clip();

		// Draw the high / low tide areas as a step "gradient"
		drawTidalAreaGradient(ctx, centerX, bounds.y - radius, radius * 2);
		drawTidalAreaGradient(ctx, centerX, centerY + radius * 2, radius * 2);

		// Draw the turner
		try {
			ctx.save();
			ctx.translate(centerX, centerY);
			ctx.rotate(drawNums.angle - Math.PI * .5);
			ctx.translate(-centerX, -centerY);
			ctx.fillStyle = colors.darkBlue;
			ctx.fillRect(centerX, centerY - dialThickness / 2, radius, dialThickness);
		} finally {
			ctx.restore();
		}

		// Draw the center
		ctx.fillStyle = colors.light;
		ctx.fillRect(centerX - centerRadius, centerY - centerRadius / 2, centerRadius * 2, centerRadius);

		var timeNow = twelveHourDate(drawNums.now);
		setFont(ctx, centerRadius / 2.5);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = colors.darkBlue;
		ctx.fillText(timeNow, centerX, centerY);

		// Draw the high
		ctx.fillStyle = colors.light;
		ctx.globalAlpha = .5;
		ctx.fillRect(centerX - centerRadius, bounds.y - centerRadius / 3, centerRadius * 2, centerRadius);
		ctx.globalAlpha = 1;

		var timeHigh = twelveHourDate(drawNums.high);
		setFont(ctx, centerRadius / 2.5);
		ctx.fillStyle = colors.darkBlue;
		ctx.fillText(timeHigh, centerX, bounds.y + centerRadius / 3);

		// Draw the low
		ctx.fillStyle = colors.light;
		ctx.globalAlpha = .5;
		ctx.fillRect(centerX - centerRadius, bounds.y + bounds.size - centerRadius * 2 / 3, centerRadius * 2, centerRadius);
		ctx.globalAlpha = 1;

		var timeLow = twelveHourDate(drawNums.low);
		setFont(ctx, centerRadius / 2.5);
		ctx.fillStyle = colors.darkBlue;
		ctx.fillText(timeLow, centerX, bounds.y + bounds.size - centerRadius / 3);
	} finally {
		ctx.restore();
	}
}

function setFont(ctx, size) {
	ctx.font = size + "px \"Gill Sans\", \"Gill Sans MT\", Calibri, sans-serif";
}

function drawTidalAreaGradient(ctx, centerX, centerY, radius) {
	var zone = 1;
	var stop = .5;
	var step = .1;

	while (zone > stop) {
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius * zone, 0, Math.PI * 2);
		ctx.closePath();
		ctx.globalAlpha = Math.min((1 - (zone - stop)) / stop - 1, 1);
		ctx.fillStyle = "black";
		ctx.globalCompositeOperation = "destination-out";
		ctx.fill();

		zone -= step;
	}

	ctx.globalCompositeOperation = "source-over";
	ctx.globalAlpha = 1;
}

function twelveHourDate(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	if (hours === 0) hours = 12;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	return hours + ":" + minutes + " " + ampm;
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
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
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./tidewheel.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./tidewheel.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".viewer-tides {\n  position: relative; }\n  .viewer-tides canvas {\n    position: absolute;\n    top: 0;\n    left: 0; }\n", ""]);

// exports


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map