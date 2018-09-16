webpackJsonp([0],[
/* 0 */,
/* 1 */
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
/* 2 */
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

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(20);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

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

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
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
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createPrettyTime = createPrettyTime;
exports.createPrettyTimespan = createPrettyTimespan;
function createPrettyTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var minutesString = minutes.toString().padStart(2, "0");
    return {
        time: hours + ":" + minutesString,
        ampm: ampm
    };
}
function createPrettyTimespan(time) {
    var minutes = Math.ceil(time / 1000 / 60);
    if (minutes <= 1) return "right about now";
    if (minutes < 100) return "in " + minutes + " min";
    var hours = Math.round(minutes / 60);
    if (hours === 1) return "in an hour";
    return "in " + hours + " hours";
}

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
// These definitions are set in your webpack config.
// Will fail if not set proerly in the webpack config.
var DEFINE = exports.DEFINE = {
    BUILD: {
        IS_PRODUCTION: true,
        VERSION: "1.1.0",
        TIME: 1537122766545
    },
    DEBUG: {
        LOCAL_REQUEST_DATA: true
    }
};
// Make these public on the window for us to easily check
window["DEFINE"] = DEFINE;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(18);

var _react = __webpack_require__(0);

var React = _interopRequireWildcard(_react);

var _reactDom = __webpack_require__(11);

var ReactDOM = _interopRequireWildcard(_reactDom);

var _components = __webpack_require__(32);

var _tide = __webpack_require__(42);

var _settings = __webpack_require__(52);

var _define = __webpack_require__(16);

var _noaa = __webpack_require__(55);

var Noaa = _interopRequireWildcard(_noaa);

var _info = __webpack_require__(56);

var _more = __webpack_require__(59);

var _charts = __webpack_require__(62);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var date = new Date(_define.DEFINE.BUILD.TIME);
if (console && console.log) console.log((_define.DEFINE.BUILD.IS_PRODUCTION ? "Production" : "Debug") + " | " + date);

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        // Set initial tab to 0 (TODO: add routing)
        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            isStarting: true,
            selectedTab: 0,
            noaa: null,
            noaaIsRequesting: false,
            noaaRequestError: null
        };
        return _this;
    }

    _createClass(App, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            Noaa.getNoaaData(650).then(function (noaa) {
                // noaa object must exist
                _this2.setState({
                    noaa: noaa,
                    noaaIsRequesting: false
                });
            }).catch(function (err) {
                _this2.setState({
                    noaaIsRequesting: false,
                    noaaRequestError: err
                });
            });
            this.setState({
                isStarting: false,
                noaaIsRequesting: true
            });
        }
    }, {
        key: "render",
        value: function render() {
            var state = this.state;
            var isLoading = state.isStarting || state.noaaIsRequesting;
            var isRequestError = !!state.noaaRequestError;
            var noaa = state.noaa;
            var isNoaaResponseError = !isLoading && !isRequestError && !!noaa && !!noaa.errors && !!noaa.errors.length;
            var tideComponent = null;
            var chartsComponent = null;
            var moreComponent = null;
            if (isLoading) {
                var loading = React.createElement(_components.Loading, null);
                tideComponent = loading;
                chartsComponent = loading;
                moreComponent = loading;
            } else if (isRequestError) {
                var error = React.createElement(_components.AppError, { error: state.noaaRequestError, jsonErrs: null });
                tideComponent = error;
                chartsComponent = error;
                moreComponent = error;
            } else if (isNoaaResponseError) {
                var errs = noaa.errors;
                var _error = React.createElement(_components.AppError, { error: null, jsonErrs: errs });
                tideComponent = _error;
                chartsComponent = _error;
                moreComponent = _error;
            } else {
                tideComponent = React.createElement(_tide.Tide, { noaa: noaa });
                chartsComponent = React.createElement(_charts.Charts, { noaa: noaa });
                moreComponent = React.createElement(_more.More, { noaa: noaa });
            }
            return React.createElement(_components.Tabs, null, React.createElement(_components.Tab, null, React.createElement(_components.TabButton, null, React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "30", height: "30", viewBox: "0 0 30 30" }, React.createElement("path", { d: "M15 0.469c-8.027 0-14.531 6.504-14.531 14.531s6.504 14.531 14.531 14.531 14.531-6.504 14.531-14.531-6.504-14.531-14.531-14.531zM15 26.719c-6.475 0-11.719-5.244-11.719-11.719s5.244-11.719 11.719-11.719 11.719 5.244 11.719 11.719-5.244 11.719-11.719 11.719zM18.621 20.602l-4.975-3.615c-0.182-0.135-0.287-0.346-0.287-0.568v-9.621c0-0.387 0.316-0.703 0.703-0.703h1.875c0.387 0 0.703 0.316 0.703 0.703v8.303l3.914 2.848c0.316 0.229 0.381 0.668 0.152 0.984l-1.102 1.518c-0.229 0.311-0.668 0.381-0.984 0.152z" })), React.createElement("span", null, "Tide")), React.createElement(_components.TabView, null, tideComponent)), React.createElement(_components.Tab, null, React.createElement(_components.TabButton, null, React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "30", height: "30", viewBox: "0 0 30 30" }, React.createElement("path", { d: "M27.188 1.875h-24.375c-1.553 0-2.813 1.259-2.813 2.813v20.625c0 1.553 1.259 2.813 2.813 2.813h24.375c1.553 0 2.813-1.259 2.813-2.813v-20.625c0-1.553-1.259-2.813-2.813-2.813zM13.125 24.375h-9.375v-15h9.375v15zM26.25 24.375h-9.375v-15h9.375v15z" })), React.createElement("span", null, "Charts")), React.createElement(_components.TabView, null, chartsComponent)), React.createElement(_components.Tab, null, React.createElement(_components.TabButton, null, React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "15", height: "30", viewBox: "0 0 15 30" }, React.createElement("path", { d: "M11.25 22.5c0 2.071-1.679 3.75-3.75 3.75s-3.75-1.679-3.75-3.75c0-1.388 0.754-2.599 1.875-3.247v-6.128c0-1.036 0.839-1.875 1.875-1.875s1.875 0.839 1.875 1.875v6.128c1.121 0.649 1.875 1.859 1.875 3.247zM13.125 17.54c1.167 1.322 1.875 3.058 1.875 4.96 0 4.142-3.358 7.5-7.5 7.5-0.018 0-0.036-0-0.053-0-4.119-0.029-7.468-3.42-7.447-7.539 0.010-1.887 0.716-3.608 1.875-4.921v-11.915c0-3.107 2.518-5.625 5.625-5.625s5.625 2.518 5.625 5.625v11.915zM12.188 22.5c0-2.012-1.135-3.058-1.875-3.897v-12.978c0-1.551-1.262-2.813-2.813-2.813s-2.813 1.262-2.813 2.813v12.978c-0.746 0.845-1.865 1.881-1.875 3.872-0.013 2.571 2.084 4.694 4.654 4.712l0.034 0c2.585 0 4.688-2.103 4.688-4.688z" })), React.createElement("span", null, "More")), React.createElement(_components.TabView, null, moreComponent)), React.createElement(_components.Tab, null, React.createElement(_components.TabButton, null, React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "38", height: "30", viewBox: "0 0 38 30" }, React.createElement("path", { d: "M30.006 11.191l-0.48 0.838c-0.176 0.311-0.551 0.439-0.885 0.316-0.691-0.258-1.324-0.627-1.881-1.090-0.27-0.223-0.34-0.615-0.164-0.92l0.48-0.838c-0.404-0.469-0.721-1.014-0.932-1.605h-0.967c-0.352 0-0.656-0.252-0.715-0.604-0.117-0.703-0.123-1.441 0-2.174 0.059-0.352 0.363-0.609 0.715-0.609h0.967c0.211-0.592 0.527-1.137 0.932-1.605l-0.48-0.838c-0.176-0.305-0.111-0.697 0.164-0.92 0.557-0.463 1.195-0.832 1.881-1.090 0.334-0.123 0.709 0.006 0.885 0.316l0.48 0.838c0.615-0.111 1.242-0.111 1.857 0l0.48-0.838c0.176-0.311 0.551-0.439 0.885-0.316 0.691 0.258 1.324 0.627 1.881 1.090 0.27 0.223 0.34 0.615 0.164 0.92l-0.48 0.838c0.404 0.469 0.721 1.014 0.932 1.605h0.967c0.352 0 0.656 0.252 0.715 0.604 0.117 0.703 0.123 1.441 0 2.174-0.059 0.352-0.363 0.609-0.715 0.609h-0.967c-0.211 0.592-0.527 1.137-0.932 1.605l0.48 0.838c0.176 0.305 0.111 0.697-0.164 0.92-0.557 0.463-1.195 0.832-1.881 1.090-0.334 0.123-0.709-0.006-0.885-0.316l-0.48-0.838c-0.609 0.111-1.242 0.111-1.857 0zM29.391 7.746c2.256 1.734 4.828-0.838 3.094-3.094-2.256-1.74-4.828 0.838-3.094 3.094zM22.635 16.764l1.975 0.984c0.592 0.34 0.85 1.061 0.615 1.705-0.521 1.418-1.547 2.719-2.496 3.855-0.434 0.521-1.184 0.65-1.775 0.311l-1.705-0.984c-0.938 0.803-2.027 1.441-3.217 1.857v1.969c0 0.68-0.486 1.266-1.154 1.383-1.441 0.246-2.953 0.258-4.447 0-0.674-0.117-1.172-0.697-1.172-1.383v-1.969c-1.189-0.422-2.279-1.055-3.217-1.857l-1.705 0.979c-0.586 0.34-1.342 0.211-1.775-0.311-0.949-1.137-1.951-2.438-2.473-3.85-0.234-0.639 0.023-1.359 0.615-1.705l1.951-0.984c-0.229-1.225-0.229-2.484 0-3.715l-1.951-0.99c-0.592-0.34-0.855-1.061-0.615-1.699 0.521-1.418 1.523-2.719 2.473-3.855 0.434-0.521 1.184-0.65 1.775-0.311l1.705 0.984c0.938-0.803 2.027-1.441 3.217-1.857v-1.975c0-0.674 0.48-1.26 1.148-1.377 1.441-0.246 2.959-0.258 4.453-0.006 0.674 0.117 1.172 0.697 1.172 1.383v1.969c1.189 0.422 2.279 1.055 3.217 1.857l1.705-0.984c0.586-0.34 1.342-0.211 1.775 0.311 0.949 1.137 1.945 2.438 2.467 3.855 0.234 0.639 0.006 1.359-0.586 1.705l-1.975 0.984c0.229 1.23 0.229 2.49 0 3.721zM15.744 18c3.469-4.512-1.682-9.662-6.193-6.193-3.469 4.512 1.682 9.662 6.193 6.193zM30.006 28.705l-0.48 0.838c-0.176 0.311-0.551 0.439-0.885 0.316-0.691-0.258-1.324-0.627-1.881-1.090-0.27-0.223-0.34-0.615-0.164-0.92l0.48-0.838c-0.404-0.469-0.721-1.014-0.932-1.605h-0.967c-0.352 0-0.656-0.252-0.715-0.604-0.117-0.703-0.123-1.441 0-2.174 0.059-0.352 0.363-0.609 0.715-0.609h0.967c0.211-0.592 0.527-1.137 0.932-1.605l-0.48-0.838c-0.176-0.305-0.111-0.697 0.164-0.92 0.557-0.463 1.195-0.832 1.881-1.090 0.334-0.123 0.709 0.006 0.885 0.316l0.48 0.838c0.615-0.111 1.242-0.111 1.857 0l0.48-0.838c0.176-0.311 0.551-0.439 0.885-0.316 0.691 0.258 1.324 0.627 1.881 1.090 0.27 0.223 0.34 0.615 0.164 0.92l-0.48 0.838c0.404 0.469 0.721 1.014 0.932 1.605h0.967c0.352 0 0.656 0.252 0.715 0.604 0.117 0.703 0.123 1.441 0 2.174-0.059 0.352-0.363 0.609-0.715 0.609h-0.967c-0.211 0.592-0.527 1.137-0.932 1.605l0.48 0.838c0.176 0.305 0.111 0.697-0.164 0.92-0.557 0.463-1.195 0.832-1.881 1.090-0.334 0.123-0.709-0.006-0.885-0.316l-0.48-0.838c-0.609 0.111-1.242 0.111-1.857 0zM29.391 25.254c2.256 1.734 4.828-0.838 3.094-3.094-2.256-1.734-4.828 0.838-3.094 3.094z" })), React.createElement("span", null, "Settings")), React.createElement(_components.TabView, null, React.createElement(_settings.Settings, null))), React.createElement(_components.Tab, null, React.createElement(_components.TabButton, null, React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "30", height: "30", viewBox: "0 0 30 30" }, React.createElement("path", { d: "M15 0.469c-8.025 0-14.531 6.509-14.531 14.531 0 8.027 6.506 14.531 14.531 14.531s14.531-6.504 14.531-14.531c0-8.022-6.506-14.531-14.531-14.531zM15 6.914c1.359 0 2.461 1.102 2.461 2.461s-1.102 2.461-2.461 2.461-2.461-1.102-2.461-2.461 1.102-2.461 2.461-2.461zM18.281 21.797c0 0.388-0.315 0.703-0.703 0.703h-5.156c-0.388 0-0.703-0.315-0.703-0.703v-1.406c0-0.388 0.315-0.703 0.703-0.703h0.703v-3.75h-0.703c-0.388 0-0.703-0.315-0.703-0.703v-1.406c0-0.388 0.315-0.703 0.703-0.703h3.75c0.388 0 0.703 0.315 0.703 0.703v5.859h0.703c0.388 0 0.703 0.315 0.703 0.703v1.406z" })), React.createElement("span", null, "Info")), React.createElement(_components.TabView, null, React.createElement(_info.Info, null))));
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("react-root"));

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(19);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(2)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "html {\n  font-family: \"Mitr\", sans-serif;\n  color: #19576D;\n  background-color: #EAEAEA; }\n\n* {\n  box-sizing: border-box;\n  font-weight: 300; }\n\nhtml, body {\n  margin: 0;\n  padding: 0;\n  height: 100%; }\n\nbody {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: stretch; }\n\nmain {\n  background-color: #fcfeff;\n  width: 100%;\n  max-width: 700px;\n  max-height: 1200px;\n  margin: 0 auto;\n  padding: 0;\n  height: 100%;\n  outline: 1px solid #BEBEBE; }\n\n.tab-view-bg {\n  padding: .5rem;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%; }\n", ""]);

// exports


/***/ }),
/* 20 */
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
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
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
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _error = __webpack_require__(33);

Object.keys(_error).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _error[key];
    }
  });
});

var _loading = __webpack_require__(36);

Object.keys(_loading).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _loading[key];
    }
  });
});

var _tabs = __webpack_require__(39);

Object.keys(_tabs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _tabs[key];
    }
  });
});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppError = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var React = _interopRequireWildcard(_react);

__webpack_require__(34);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AppError = exports.AppError = function (_React$Component) {
    _inherits(AppError, _React$Component);

    function AppError(props) {
        _classCallCheck(this, AppError);

        return _possibleConstructorReturn(this, (AppError.__proto__ || Object.getPrototypeOf(AppError)).call(this, props));
    }

    _createClass(AppError, [{
        key: "render",
        value: function render() {
            var errContent = null;
            if (this.props.error) {
                errContent = React.createElement("span", null, "this.props.error.message");
            } else if (this.props.jsonErrs) {
                var errs = this.props.jsonErrs;
                errContent = React.createElement(React.Fragment, null, React.createElement("div", null, errs.length + " " + (errs.length > 1 ? "errors were" : "error was") + " returned from the API in the following contexts:"), React.createElement("ul", null, errs.map(function (err) {
                    return React.createElement("li", null, err.errContext);
                })));
            } else {
                errContent = React.createElement("span", null, "Error Unknown");
            }
            return React.createElement("div", { className: "react-error tab-view-bg" }, React.createElement("header", null, React.createElement("h1", null, "Uh-oh!"), React.createElement("h3", null, "Something's gone wrong.")), React.createElement("hr", null), React.createElement("p", null, "It looks like the application isn't working correctly. If the problem persists, please reach out to the developer on GitHub by going to the ", React.createElement("strong", null, "Info"), " tab."), React.createElement("hr", null), React.createElement("div", { className: "detailed" }, React.createElement("div", { className: "detailed-header" }, "Detailed error information:"), React.createElement("div", { className: "detailed-content" }, errContent)));
        }
    }]);

    return AppError;
}(React.Component);

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(35);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(2)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./error.scss", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./error.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".react-error {\n  color: #ffcaca;\n  padding: 1rem; }\n  .react-error.tab-view-bg {\n    background-color: #da5151; }\n  .react-error header {\n    text-align: left; }\n    .react-error header h1 {\n      margin: 0; }\n    .react-error header h3 {\n      margin: 0; }\n  .react-error hr {\n    border: none;\n    border-bottom: 2px solid #b12121;\n    margin: 1rem 0; }\n  .react-error .detailed {\n    font-size: .8rem; }\n  .react-error .detailed-content {\n    font-family: 'Courier New', Courier, monospace; }\n", ""]);

// exports


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Loading = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var React = _interopRequireWildcard(_react);

__webpack_require__(37);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Loading = exports.Loading = function (_React$Component) {
    _inherits(Loading, _React$Component);

    function Loading(props) {
        _classCallCheck(this, Loading);

        return _possibleConstructorReturn(this, (Loading.__proto__ || Object.getPrototypeOf(Loading)).call(this, props));
    }

    _createClass(Loading, [{
        key: "render",
        value: function render() {
            return React.createElement("div", { className: "react-loading" }, React.createElement("h1", null, "Loading"));
        }
    }]);

    return Loading;
}(React.Component);

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(38);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(2)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./loading.scss", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./loading.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".react-loading {\n  text-align: center; }\n  .react-loading h1 {\n    font-weight: bold;\n    display: inline-block;\n    margin: 4rem auto;\n    padding: .25rem 1rem;\n    border: 5px solid #19576D;\n    border-radius: 2px;\n    animation: colors 2s linear infinite alternate; }\n\n@keyframes colors {\n  0% {\n    color: #19576D;\n    border-color: #8DC2D5; }\n  50% {\n    color: #8DC2D5;\n    border-color: #19576D; }\n  100% {\n    color: #19576D;\n    border-color: #8DC2D5; } }\n", ""]);

// exports


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TabView = exports.TabButton = exports.Tab = exports.Tabs = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var React = _interopRequireWildcard(_react);

__webpack_require__(40);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tabs = exports.Tabs = function (_React$Component) {
    _inherits(Tabs, _React$Component);

    function Tabs(props) {
        _classCallCheck(this, Tabs);

        var _this = _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, props));

        _this.state = {
            selected: 0
        };
        return _this;
    }

    _createClass(Tabs, [{
        key: "selectTab",
        value: function selectTab(index) {
            this.setState({
                selected: index
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var tabs = Tabs.getTabs(this.props.children);
            var selected = this.state.selected;

            var tabTitles = tabs.map(function (tab, index) {
                var className = ["tab-button"];
                var onClick = null;
                if (index === selected) {
                    className.push("tab-active");
                } else {
                    onClick = _this2.selectTab.bind(_this2, index);
                }
                return React.createElement("div", { key: index, className: className.join(" "), onClick: onClick }, tab.button.props.children);
            });
            var activeTabContent = tabs.filter(function (tab, index) {
                return index === selected;
            })[0];
            var buttons = React.createElement("div", { className: "tab-buttons" }, tabTitles);
            var views = React.createElement("div", { className: "tab-view" }, activeTabContent.view.props.children);
            var content = null;
            content = React.createElement(React.Fragment, null, views, buttons);
            return React.createElement("div", { className: "react-tabs" }, content);
        }
    }], [{
        key: "getChildrenOfPropsType",
        value: function getChildrenOfPropsType(children, childType) {
            return React.Children.map(children, function (child) {
                var type = child && child["type"] || null;
                if (type && type === childType) return child;
                return null;
            }).filter(function (a) {
                return !!a;
            });
        }
    }, {
        key: "getTabs",
        value: function getTabs(children) {
            var tabChildren = Tabs.getChildrenOfPropsType(children, Tab);
            return tabChildren.map(function (el) {
                var children = el.props && el.props.children;
                if (!children) return null;
                var tabModel = {
                    button: null,
                    view: null
                };
                var tabButtonChildren = Tabs.getChildrenOfPropsType(children, TabButton);
                if (tabButtonChildren && tabButtonChildren.length) tabModel.button = tabButtonChildren[0];
                var tabViewChildren = Tabs.getChildrenOfPropsType(children, TabView);
                if (tabViewChildren && tabViewChildren.length) tabModel.view = tabViewChildren[0];
                return tabModel;
            }).filter(function (tabModel) {
                return !!tabModel && !!tabModel.button && !!tabModel.view;
            });
        }
    }]);

    return Tabs;
}(React.Component);

var Tab = exports.Tab = function (_React$Component2) {
    _inherits(Tab, _React$Component2);

    function Tab(props) {
        _classCallCheck(this, Tab);

        var _this3 = _possibleConstructorReturn(this, (Tab.__proto__ || Object.getPrototypeOf(Tab)).call(this, props));

        _this3.state = {};
        return _this3;
    }

    _createClass(Tab, [{
        key: "render",
        value: function render() {
            return React.createElement("div", { className: "react-tabs-tab" }, this.props.children);
        }
    }]);

    return Tab;
}(React.Component);

var TabButton = exports.TabButton = function (_React$PureComponent) {
    _inherits(TabButton, _React$PureComponent);

    function TabButton() {
        _classCallCheck(this, TabButton);

        return _possibleConstructorReturn(this, (TabButton.__proto__ || Object.getPrototypeOf(TabButton)).apply(this, arguments));
    }

    _createClass(TabButton, [{
        key: "render",
        value: function render() {
            return React.createElement("div", { className: "react-tabs-tab-button" }, this.props.children);
        }
    }]);

    return TabButton;
}(React.PureComponent);

var TabView = exports.TabView = function (_React$PureComponent2) {
    _inherits(TabView, _React$PureComponent2);

    function TabView() {
        _classCallCheck(this, TabView);

        return _possibleConstructorReturn(this, (TabView.__proto__ || Object.getPrototypeOf(TabView)).apply(this, arguments));
    }

    _createClass(TabView, [{
        key: "render",
        value: function render() {
            return React.createElement("div", { className: "react-tabs-tab-view" }, this.props.children);
        }
    }]);

    return TabView;
}(React.PureComponent);

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(41);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(2)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./tabs.scss", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./tabs.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".react-tabs {\n  height: 100%;\n  display: flex;\n  flex-direction: column; }\n  .react-tabs .tab-view {\n    overflow: hidden;\n    flex: 1;\n    position: relative; }\n  .react-tabs .tab-buttons {\n    background-color: #EAEAEA;\n    border-top: 1px solid #BEBEBE;\n    color: #BEBEBE;\n    fill: #BEBEBE;\n    display: flex; }\n  .react-tabs .tab-button {\n    flex: 1;\n    text-align: center;\n    font-size: .8rem; }\n    .react-tabs .tab-button svg {\n      display: block;\n      margin: 0 auto;\n      margin-top: .3rem;\n      height: 24px; }\n    .react-tabs .tab-button:not(.tab-active) {\n      cursor: pointer; }\n  .react-tabs .tab-active {\n    cursor: default;\n    color: #19576D;\n    fill: #19576D; }\n", ""]);

// exports


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tide = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var React = _interopRequireWildcard(_react);

var _title = __webpack_require__(43);

var _wave = __webpack_require__(46);

__webpack_require__(50);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tide = exports.Tide = function (_React$Component) {
    _inherits(Tide, _React$Component);

    function Tide(props) {
        _classCallCheck(this, Tide);

        return _possibleConstructorReturn(this, (Tide.__proto__ || Object.getPrototypeOf(Tide)).call(this, props));
    }
    // clickShare = () => {
    // }
    // clickRefresh = () => {
    // }


    _createClass(Tide, [{
        key: "render",
        value: function render() {
            var noaa = this.props.noaa;

            return React.createElement("div", { className: "tide" }, React.createElement(_title.Title, { noaa: noaa }), React.createElement(_wave.Wave, { noaa: noaa }));
        }
    }]);

    return Tide;
}(React.Component);

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LastNext = exports.Title = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var React = _interopRequireWildcard(_react);

__webpack_require__(44);

var _time = __webpack_require__(8);

var Time = _interopRequireWildcard(_time);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Title = exports.Title = function (_React$Component) {
    _inherits(Title, _React$Component);

    function Title() {
        _classCallCheck(this, Title);

        return _possibleConstructorReturn(this, (Title.__proto__ || Object.getPrototypeOf(Title)).apply(this, arguments));
    }

    _createClass(Title, [{
        key: "render",
        value: function render() {
            var data = this.props.noaa;
            var title = "Cannot load data";
            var message = "Please try again.";
            var svg = null;
            var lastNext = null;
            if (data) {
                if (data.errors) {} else {
                    var waterLevel = data.data.waterLevel;
                    var percentFallen = waterLevel.currentPercentFallen;
                    if (percentFallen > .90) {
                        title = "It's low tide.";
                    } else if (percentFallen < .10) {
                        title = "It's high tide.";
                    } else {
                        title = "The tide is " + (waterLevel.currentIsRising ? "rising" : "falling") + ".";
                    }
                    var timeUntilNext = Math.abs(waterLevel.next.time.getTime() - waterLevel.current.time.getTime());
                    var currentPrettyTime = Time.createPrettyTime(waterLevel.current.time);
                    message = "As of " + currentPrettyTime.time + " " + currentPrettyTime.ampm + ", " + (waterLevel.currentIsRising ? "high" : "low") + " tide is " + Time.createPrettyTimespan(timeUntilNext) + ".";
                    if (waterLevel.currentIsRising) svg = Title.svgTideRising;else svg = Title.svgTideFalling;
                    lastNext = React.createElement("div", { className: "lastnext" }, React.createElement(LastNext, { name: "left", title: "Last " + (waterLevel.previous.isHigh ? "High" : "Low"), prettyTime: Time.createPrettyTime(waterLevel.previous.time) }), React.createElement(LastNext, { name: "center", title: "Next " + (waterLevel.next.isHigh ? "High" : "Low"), prettyTime: Time.createPrettyTime(waterLevel.next.time) }), React.createElement(LastNext, { name: "right", title: "Next " + (waterLevel.predictionsAfterCurrent[1].isHigh ? "High" : "Low"), prettyTime: Time.createPrettyTime(waterLevel.predictionsAfterCurrent[1].time) }));
                }
            }
            return React.createElement("header", null, React.createElement("div", { className: "top" }, React.createElement("span", { className: "left" }, "Wells, Maine"), React.createElement("span", { className: "right" }, "8419317")), React.createElement("div", { className: "title" }, React.createElement("div", { className: "head" }, svg, React.createElement("h2", null, title)), React.createElement("h2", null, message)), lastNext);
        }
    }]);

    return Title;
}(React.Component);

Title.svgTideRising = React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "30", height: "30", viewBox: "0 0 30 30" }, React.createElement("path", { d: "M0.469 15c0-8.027 6.504-14.531 14.531-14.531s14.531 6.504 14.531 14.531-6.504 14.531-14.531 14.531-14.531-6.504-14.531-14.531zM17.578 21.797v-6.797h4.154c0.627 0 0.943-0.762 0.498-1.201l-6.732-6.697c-0.275-0.275-0.715-0.275-0.99 0l-6.738 6.697c-0.445 0.445-0.129 1.201 0.498 1.201h4.154v6.797c0 0.387 0.316 0.703 0.703 0.703h3.75c0.387 0 0.703-0.316 0.703-0.703z" }));
Title.svgTideFalling = React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "30", height: "30", viewBox: "0 0 30 30" }, React.createElement("path", { d: "M29.531 15c0 8.027-6.504 14.531-14.531 14.531s-14.531-6.504-14.531-14.531 6.504-14.531 14.531-14.531 14.531 6.504 14.531 14.531zM12.422 8.203v6.797h-4.154c-0.627 0-0.943 0.762-0.498 1.201l6.732 6.697c0.275 0.275 0.715 0.275 0.99 0l6.732-6.697c0.445-0.445 0.129-1.201-0.498-1.201h-4.148v-6.797c0-0.387-0.316-0.703-0.703-0.703h-3.75c-0.387 0-0.703 0.316-0.703 0.703z" }));

var LastNext = exports.LastNext = function (_React$Component2) {
    _inherits(LastNext, _React$Component2);

    function LastNext() {
        _classCallCheck(this, LastNext);

        return _possibleConstructorReturn(this, (LastNext.__proto__ || Object.getPrototypeOf(LastNext)).apply(this, arguments));
    }

    _createClass(LastNext, [{
        key: "render",
        value: function render() {
            return React.createElement("div", { className: "lastnext-item " + this.props.name }, React.createElement("span", { className: "lastnext-item-inner" }, React.createElement("div", { className: "lastnext-title" }, this.props.title), React.createElement("div", { className: "lastnext-time" }, React.createElement("span", { className: "lastnext-time-num" }, this.props.prettyTime.time), React.createElement("span", { className: "lastnext-time-ampm" }, this.props.prettyTime.ampm))));
        }
    }]);

    return LastNext;
}(React.Component);

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(45);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(2)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./title.scss", function() {
		var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./title.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".tide header {\n  margin: .5rem; }\n  .tide header .top .right {\n    float: right; }\n  .tide header .top::after {\n    content: \"\";\n    clear: both; }\n  .tide header .title {\n    background-color: #19576D;\n    color: #fcfeff;\n    fill: #fcfeff;\n    border-radius: 6px;\n    padding: 0 .5rem;\n    overflow: hidden;\n    text-align: center; }\n    .tide header .title h2 {\n      font-size: 1rem;\n      margin: 0;\n      margin-bottom: .5rem; }\n  .tide header .head svg {\n    height: 30px;\n    display: inline-block;\n    margin-right: .5rem;\n    margin-top: .8rem; }\n  .tide header .head h2 {\n    vertical-align: top;\n    display: inline-block;\n    margin: 0;\n    margin-top: .25rem;\n    font-size: 1.8rem; }\n\n.tide .lastnext {\n  margin: .5rem 1rem;\n  display: flex; }\n\n.tide .lastnext-item {\n  flex: 1;\n  text-align: center; }\n  .tide .lastnext-item.center .lastnext-item-inner {\n    background-color: #19576D;\n    color: #fcfeff; }\n  .tide .lastnext-item .lastnext-item-inner {\n    border-radius: 4px;\n    display: inline-block;\n    padding: .3rem .5rem; }\n  .tide .lastnext-item .lastnext-time-ampm {\n    font-size: .8em;\n    display: inline-block;\n    margin-left: .3rem; }\n", ""]);

// exports


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SVGWave = exports.Wave = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var React = _interopRequireWildcard(_react);

__webpack_require__(47);

var _styleScript = __webpack_require__(49);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Wave = exports.Wave = function (_React$Component) {
    _inherits(Wave, _React$Component);

    function Wave(props) {
        _classCallCheck(this, Wave);

        var _this = _possibleConstructorReturn(this, (Wave.__proto__ || Object.getPrototypeOf(Wave)).call(this, props));

        _this.setEmAsPixels = function (value) {
            if (Wave.emAsPixel !== -1) value = Wave.emAsPixel;
            if (isNaN(value) || value < 1) {
                value = 16; // 1em === 16px default
            }
            Wave.emAsPixel = value;
            _this.setState({ emAsPixel: value });
        };
        _this.state = {
            emAsPixel: Wave.emAsPixel
        };
        return _this;
    }

    _createClass(Wave, [{
        key: "render",
        value: function render() {
            var data = this.props.noaa;
            if (!data || data.errors || this.state.emAsPixel === -1) {
                return React.createElement(_styleScript.StyleScript, { input: "1em", outputPixels: this.setEmAsPixels });
            }
            var waterLevel = data.data.waterLevel;
            var isRising = waterLevel.currentIsRising;
            var percentFallen = waterLevel.currentPercentFallen;
            var highVal = waterLevel.high.val;
            var lowVal = waterLevel.low.val;
            var percentToDirection = isRising ? 1 - percentFallen : percentFallen;
            var percent_text = roundPercent(percentToDirection) + "%";
            var percent_text_direction = isRising ? "risen" : "fallen";
            var upperLine = Math.max(Math.round(percentFallen * 100), 0);
            var upperLineStyle = {
                flex: upperLine
            };
            var lowerLine = 100 - upperLine;
            var lowerLineStyle = {
                flex: lowerLine
            };
            var emAsPixels = this.state.emAsPixel;
            var upperBackWaveOpts = {
                percentFallen: percentFallen,
                amplitudePixels: emAsPixels * .5,
                offsetAboveFallen: emAsPixels * .5,
                upperPaddingPixels: emAsPixels,
                lowerPaddingPixels: emAsPixels * 2,
                wavePeriod: emAsPixels * 18,
                colorClass: "wave-higher",
                periodDurationSeconds: 7
            };
            var lowerFrontWaveOpts = {
                percentFallen: percentFallen,
                amplitudePixels: emAsPixels * .5,
                offsetAboveFallen: -emAsPixels * .5,
                upperPaddingPixels: emAsPixels,
                lowerPaddingPixels: emAsPixels * 2,
                colorClass: "wave-lower",
                wavePeriod: emAsPixels * 17,
                periodDurationSeconds: 4
            };
            return React.createElement("div", { className: "graphic" }, React.createElement("div", { className: "crab-container" }, crab_svg), React.createElement("div", { className: "percent" }, React.createElement("span", { className: "value" }, percent_text), React.createElement("span", { className: "direction" }, percent_text_direction)), React.createElement("div", { className: "waves" }, React.createElement(SVGWave, { animationOpts: upperBackWaveOpts }), rock_svg, React.createElement(SVGWave, { animationOpts: lowerFrontWaveOpts }), React.createElement("div", { className: "wave-svg-offset" }), React.createElement("div", { className: "marker" }, React.createElement("div", { className: "line-container" }, React.createElement("div", { className: "line line-cap line-begin " + (isRising ? "line-faint" : "") }), React.createElement("div", { className: "line-flex" }, React.createElement("div", { className: "line " + (isRising ? "line-faint" : ""), style: upperLineStyle }), React.createElement("div", { className: "line-arrow-holder" }, isRising ? arrow_up_svg : arrow_down_svg), React.createElement("div", { className: "line " + (isRising ? "" : "line-faint"), style: lowerLineStyle })), React.createElement("div", { className: "line line-cap line-end " + (isRising ? "" : "line-faint") })), React.createElement("span", { className: "marker-header marker-high" }, React.createElement("span", { className: "marker-title" }, "High"), React.createElement("span", { className: "marker-value" }, "(", roundVal(highVal), " ft)")), React.createElement("span", { className: "marker-header marker-low" }, React.createElement("span", { className: "marker-title" }, "Low"), React.createElement("span", { className: "marker-value" }, "(", roundVal(lowVal), " ft)")))));
        }
    }]);

    return Wave;
}(React.Component);

Wave.emAsPixel = -1;
function roundPercent(outOf1) {
    return Math.round(outOf1 * 100).toString();
}
function roundVal(num) {
    return Math.round(num * 100) / 100;
}

var SVGWave = exports.SVGWave = function (_React$Component2) {
    _inherits(SVGWave, _React$Component2);

    function SVGWave(props) {
        _classCallCheck(this, SVGWave);

        var _this2 = _possibleConstructorReturn(this, (SVGWave.__proto__ || Object.getPrototypeOf(SVGWave)).call(this, props));

        _this2.ref = React.createRef();
        _this2.state = {
            width: -1,
            height: -1
        };
        SVGWave.addListener(_this2);
        return _this2;
    }

    _createClass(SVGWave, [{
        key: "resize",
        value: function resize() {
            if (this.ref && this.ref.current) {
                var container = this.ref.current;
                this.setState({ width: container.offsetWidth, height: container.offsetHeight });
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.resize();
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            SVGWave.removeListener(this);
        }
    }, {
        key: "render",
        value: function render() {
            var waveContainer = React.createElement("div", { ref: this.ref, className: "wave-container" });
            var wave = null;
            if (this.state.height !== -1) {
                var opts = this.props.animationOpts;
                var _state = this.state,
                    width = _state.width,
                    height = _state.height;
                // Have to do some rounding so the wave animation will be fluid (pun)

                var freq = Math.round(width / opts.wavePeriod);
                // Get the path
                var path = SVGWave.getPath(width, height, opts.upperPaddingPixels, opts.lowerPaddingPixels, opts.percentFallen, opts.offsetAboveFallen, opts.amplitudePixels, freq);
                var name = "wave_" + opts.colorClass;
                var totalDurationSeconds = opts.periodDurationSeconds * freq;
                wave = React.createElement("svg", { className: "wave " + opts.colorClass, version: "1.1", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 " + width + " " + height, preserveAspectRatio: "none" }, React.createElement("defs", null, React.createElement("path", { id: name, d: path })), React.createElement("use", { xlinkHref: "#" + name, x: "0", y: "0" }, React.createElement("animate", { attributeName: "x", from: -width, to: "0", dur: totalDurationSeconds + "s", repeatCount: "indefinite" })));
            }
            return React.createElement(React.Fragment, null, waveContainer, wave);
        }
    }], [{
        key: "addListener",
        value: function addListener(svgWave) {
            var indexOf = SVGWave.listeners.indexOf(svgWave);
            if (indexOf === -1) SVGWave.listeners.push(svgWave);
        }
    }, {
        key: "removeListener",
        value: function removeListener(svgWave) {
            var indexOf = SVGWave.listeners.indexOf(svgWave);
            if (indexOf !== -1) SVGWave.listeners.splice(indexOf, 1);
        }
    }, {
        key: "getPath",
        value: function getPath(totalWidth, totalHeight, topPadding, bottomPadding, percentFallen, offset, amplitude, freq) {
            // Coordinate system is from top left
            var y = (totalHeight - topPadding - bottomPadding) * percentFallen;
            y = y + topPadding - offset;
            y = roundVal(y);
            var period = totalWidth / freq;
            var bezierLength = period / 2;
            var cp1Length = roundVal(bezierLength / 3);
            var cp2Length = roundVal(bezierLength - cp1Length);
            // Firefox: path cannot use commas
            // Bezier is relative to start point of the bezier, not absolute
            // c (first control point) (second control point) (how far to actually go)
            var singleWaveBezier = "c " + cp1Length + " -" + amplitude + " " + cp2Length + " -" + amplitude + " " + bezierLength + " 0 c" + cp1Length + " " + amplitude + " " + cp2Length + " " + amplitude + " " + bezierLength + " 0";
            var waveBezier = "";
            for (var i = 0; i < freq; i++) {
                waveBezier += singleWaveBezier + " ";
            } /*
                  One wave:
                       ____
                      /    \
                  (A)/      \       /
                             \     /
                              -----
                  Where (A) is the top distance
              */
            // Make 2 waves (first of which covers the whole viewbox - second of which is completely offscreen) so we are 2X the viewbox width
            // Coordinate system is from top left
            // "m0 (Y amount for percent) (bezier) (bezier) v(total - Y amount for percent) h-(2 * total width) v-(total - y amount for percent) z"
            return "M0 " + y + " " + waveBezier + " " + waveBezier + " v" + (totalHeight - y) + " h-" + totalWidth * 2 + " v-" + (totalHeight - y) + " z";
            // M0,${p} c13,0 20.3,-${r} 33.3,-${r} c13,0 20.3,${r} 33.3,${r} c13,0 20.3,-${r} 33.3,-${r} v100 h-100 v-${100 - p} z
        }
    }]);

    return SVGWave;
}(React.Component);

SVGWave.throttlerTimeoutId = -1;
SVGWave.throttlerTimeout = 250;
SVGWave.throttleResize = function () {
    if (SVGWave.throttlerTimeoutId === -1) {
        SVGWave.throttlerTimeoutId = window.setTimeout(function () {
            SVGWave.throttlerTimeoutId = -1;
            SVGWave.onResize();
        }, SVGWave.throttlerTimeout);
    }
};
SVGWave.onResize = function () {
    SVGWave.listeners.forEach(function (l) {
        l.resize();
    });
};
SVGWave.listeners = [];
SVGWave._init = function () {
    window.addEventListener("resize", SVGWave.throttleResize, { capture: true });
    window.addEventListener("orientationchange", SVGWave.throttleResize, { capture: true });
    window.addEventListener("visibilitychange", SVGWave.throttleResize, { capture: true });
}();
var crab_svg = React.createElement("svg", { className: "crab", viewBox: "0,0,155,110", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink" }, React.createElement("defs", null, React.createElement("path", { d: "M25.592 40.968c10.679 0 19.336-7.576 19.336-16.92 0-9.346-8.657-16.921-19.336-16.921.879 7.108 1.47 14.35 1.776 21.727-6.22-4.285-12.037-9.188-17.455-14.711-2.3 2.784-3.657 6.206-3.657 9.904 0 9.345 8.657 16.92 19.336 16.92z", id: "a" }), React.createElement("path", { d: "M25.592 40.968c10.679 0 19.336-7.576 19.336-16.92 0-9.346-8.657-16.921-19.336-16.921.879 7.108 1.47 14.35 1.776 21.727-6.22-4.285-12.037-9.188-17.455-14.711-2.3 2.784-3.657 6.206-3.657 9.904 0 9.345 8.657 16.92 19.336 16.92z", id: "b" }), React.createElement("ellipse", { id: "c", cx: "10.392", cy: "10.35", rx: "10.392", ry: "10.35" }), React.createElement("ellipse", { id: "e", cx: "10.392", cy: "10.35", rx: "10.392", ry: "10.35" })), React.createElement("g", { fill: "none", fillRule: "evenodd" }, React.createElement("path", { d: "M125.689 93.82c1.129.1 5.124 9.114 5.31 12.444.02.365-.603.533-1.475-.015-.872-.547-8.168-6.783-8.928-9.248.68-1.7 3.964-3.283 5.093-3.182z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M115.551 96.807c4.173 3.85 8.873 3.304 10.56.895 1.686-2.408.038-6.781-4.743-9.2-4.782-2.42-8.582-3.72-10.269-1.31-1.686 2.408.28 5.765 4.452 9.615z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M123.953 97.485c-2.342-1.135-7.596-2.806-9.968-5.704 1.232 4.093 7.087 6.93 9.968 5.704z", fill: "#F26E69" }), React.createElement("path", { d: "M131.461 86.489c1.133-.018 6.049 8.53 6.582 11.821.058.361-.544.593-1.469.14-.924-.453-8.832-5.892-9.846-8.264.5-1.761 3.6-3.68 4.733-3.697z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M121.691 90.52c4.552 3.393 9.17 2.358 10.595-.213 1.426-2.572-.67-6.749-5.679-8.655-5.008-1.907-8.923-2.801-10.349-.23-1.425 2.572.881 5.706 5.433 9.099z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M130.118 90.316c-2.448-.884-7.848-1.997-10.51-4.63 1.653 3.941 7.773 6.15 10.51 4.63z", fill: "#F26E69" }), React.createElement("g", null, React.createElement("path", { d: "M136.18 75.633c1.095-.291 7.932 6.813 9.246 9.878.144.336-.384.707-1.391.49-1.007-.216-9.996-3.58-11.553-5.636.058-1.83 2.602-4.441 3.698-4.732z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M127.676 81.908c5.237 2.19 9.467.07 10.228-2.77.76-2.84-2.283-6.386-7.604-7.024-5.32-.639-9.336-.56-10.097 2.28-.761 2.84 2.235 5.323 7.473 7.514z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M135.802 79.671c-2.588-.265-8.097-.04-11.318-1.95 2.558 3.424 9.03 4.088 11.318 1.95z", fill: "#F26E69" })), React.createElement("g", null, React.createElement("path", { d: "M33.153 95.434c-1.125.14-4.803 9.289-4.873 12.623-.008.365.621.511 1.474-.066.852-.578 7.926-7.065 8.6-9.554-.74-1.675-4.077-3.143-5.201-3.003z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M43.388 98.067c-4.035 3.993-8.752 3.61-10.521 1.263-1.77-2.348-.276-6.776 4.419-9.361 4.694-2.585 8.447-4.016 10.216-1.668 1.77 2.348-.078 5.773-4.114 9.766z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M35.015 99.037c2.3-1.215 7.493-3.07 9.763-6.048-1.088 4.134-6.84 7.173-9.763 6.048z", fill: "#F26E69" }), React.createElement("g", null, React.createElement("path", { d: "M27.128 88.31c-1.133.022-5.747 8.736-6.165 12.044-.046.363.564.574 1.472.088.909-.485 8.621-6.197 9.552-8.602-.56-1.743-3.726-3.552-4.859-3.53z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M37.033 91.998c-4.431 3.55-9.082 2.676-10.596.156-1.514-2.52.434-6.767 5.373-8.847 4.939-2.08 8.82-3.111 10.335-.591 1.514 2.52-.682 5.733-5.112 9.282z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M28.604 92.088c2.415-.969 7.773-2.27 10.342-4.995-1.515 3.997-7.553 6.419-10.342 4.995z", fill: "#F26E69" })), React.createElement("g", null, React.createElement("path", { d: "M22.034 77.625c-1.105-.253-7.69 7.086-8.896 10.195-.133.34.408.693 1.407.442.999-.251 9.864-3.928 11.349-6.037-.122-1.826-2.756-4.347-3.86-4.6z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M30.751 83.6c-5.158 2.372-9.459.4-10.318-2.412-.86-2.812 2.059-6.461 7.354-7.285 5.295-.824 9.31-.885 10.17 1.927.86 2.812-2.048 5.398-7.206 7.77z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M22.551 81.648c2.578-.356 8.092-.322 11.244-2.344-2.437 3.511-8.882 4.4-11.244 2.344z", fill: "#F26E69" }))), React.createElement("g", null, React.createElement("path", { d: "M145.408 41.037c1.928-6.733-2.026-11.6-6.22-12.114-4.192-.515-8.531 3.732-8.241 10.339.29 6.607 1.303 11.51 5.496 12.025 4.193.515 7.038-3.517 8.965-10.25z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M139.242 56.119c4.075-4.553 2.888-9.848-.156-11.825-3.043-1.976-8.027-.277-10.34 5.009-2.313 5.285-3.413 9.507-.37 11.483 3.044 1.976 6.79-.115 10.866-4.667z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M129.56 64.032c4.549-2.654 5.01-7.285 3.062-9.69-1.948-2.405-6.469-2.315-9.78 1.396-3.31 3.711-5.345 6.87-3.398 9.275 1.948 2.405 5.566 1.673 10.115-.98z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("use", { stroke: "#E03232", strokeWidth: "3", fill: "#F0504F", transform: "rotate(-13 58.23 -452.225)", xlinkHref: "#a" }), React.createElement("path", { d: "M144.483 29.311c-13.613 4.44-20.848-2.098-28.145-11.478.208 9.472 15.077 19.228 28.145 11.478z", fill: "#F26E69" })), React.createElement("g", null, React.createElement("path", { d: "M10.584 42.307c-2.161-6.662 1.62-11.663 5.793-12.324 4.173-.66 8.657 3.432 8.598 10.045-.059 6.613-.9 11.549-5.073 12.21-4.173.66-7.156-3.27-9.318-9.931z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M17.274 57.164c-4.232-4.407-3.23-9.741-.258-11.823 2.973-2.081 8.013-.556 10.51 4.645 2.495 5.201 3.742 9.382.77 11.463-2.973 2.082-6.79.122-11.022-4.285z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("path", { d: "M27.226 64.735c-4.639-2.494-5.26-7.106-3.398-9.577 1.862-2.472 6.383-2.54 9.822 1.053 3.438 3.593 5.582 6.68 3.72 9.151-1.863 2.472-5.504 1.867-10.144-.627z", stroke: "#E03232", strokeWidth: "3", fill: "#F0504F" }), React.createElement("use", { stroke: "#E03232", strokeWidth: "3", fill: "#F0504F", transform: "scale(-1 1) rotate(-11 -18.778 267.396)", xlinkHref: "#b" }), React.createElement("path", { d: "M11.899 31.158c12.753 3.985 18.976-1.916 25.08-10.379.4 8.537-12.621 17.347-25.08 10.379z", fill: "#F26E69" })), React.createElement("g", null, React.createElement("path", { d: "M73.449 42.163a77.718 77.718 0 0 1 4.843-.217 12.595 12.595 0 0 1-.075-1.176c-.125-7.144 5.8-13.04 13.234-13.17 7.434-.13 13.562 5.556 13.686 12.7.037 2.104-.45 4.1-1.347 5.872 12.907 4.9 21.53 13.598 21.705 23.652.277 15.847-20.539 29.06-46.492 29.514-25.954.453-47.217-12.027-47.494-27.874-.16-9.15 6.714-17.424 17.549-22.868a12.53 12.53 0 0 1-2.485-7.273c-.124-7.144 5.801-13.041 13.235-13.17 7.434-.13 13.561 5.556 13.686 12.7.008.442-.008.879-.045 1.31z", stroke: "#E03232", strokeWidth: "4", fill: "#F0504F" }), React.createElement("path", { d: "M56.926 93.135c-4.805-4.62-15.815-12.898-22.558-20.309 1.564 8.442 16.378 18.065 22.558 20.31z", fill: "#F26E69" }), React.createElement("path", { d: "M99.91 65.565C89.144 71.4 63.764 78.9 52.207 66.398c5.1 21.088 44.375 21.579 47.701-.833z", fill: "#565757" }), React.createElement("g", { transform: "rotate(-1 1782.956 -2804.82)" }, React.createElement("mask", { id: "d", fill: "#fff" }, React.createElement("use", { xlinkHref: "#c" })), React.createElement("use", { fill: "#D8EEEE", xlinkHref: "#c" }), React.createElement("ellipse", { fill: "#FFF", mask: "url(#d)", cx: "13.698", cy: "10.35", rx: "10.392", ry: "10.35" })), React.createElement("path", { d: "M62.51 33.388a3.453 3.453 0 0 0-.454 1.783c.032 1.818 1.432 3.269 3.128 3.24.959-.018 1.807-.505 2.357-1.254.46.927.726 1.972.745 3.081.068 3.897-2.942 7.11-6.725 7.175-3.782.066-6.903-3.04-6.971-6.936-.068-3.897 2.943-7.11 6.725-7.175.407-.007.806.022 1.194.086zm-3.694 5.604c.783-.014 1.404-.762 1.388-1.671-.016-.91-.663-1.636-1.445-1.622-.783.014-1.404.762-1.389 1.671.016.91.663 1.635 1.446 1.622z", fill: "#565757" }), React.createElement("g", null, React.createElement("g", { transform: "rotate(-1 1766.895 -4645.148)" }, React.createElement("mask", { id: "f", fill: "#fff" }, React.createElement("use", { xlinkHref: "#e" })), React.createElement("use", { fill: "#D8EEEE", xlinkHref: "#e" }), React.createElement("ellipse", { fill: "#FFF", mask: "url(#f)", cx: "13.698", cy: "10.35", rx: "10.392", ry: "10.35" })), React.createElement("path", { d: "M95.105 33.29a3.453 3.453 0 0 0-.452 1.783c.031 1.818 1.431 3.268 3.127 3.239.96-.017 1.807-.504 2.357-1.253.46.926.726 1.971.746 3.08.068 3.897-2.943 7.11-6.725 7.176-3.783.066-6.904-3.04-6.972-6.936-.068-3.897 2.943-7.11 6.725-7.176.407-.007.806.023 1.194.086zm-3.693 5.603c.783-.013 1.404-.762 1.388-1.67-.016-.91-.663-1.636-1.445-1.622-.783.013-1.404.761-1.388 1.67.015.91.663 1.636 1.445 1.622z", fill: "#565757" })))));
var rock_svg = React.createElement("svg", { className: "rocks", viewBox: "0 0 268 500", version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", preserveAspectRatio: "none" }, React.createElement("defs", null, React.createElement("rect", { id: "path-1", x: "0", y: "0", width: "355", height: "500" })), React.createElement("g", { stroke: "none", strokeWidth: "1", fill: "none", fillRule: "evenodd" }, React.createElement("g", { transform: "translate(-87.000000, 0.000000)" }, React.createElement("mask", { id: "mask-2", fill: "white" }, React.createElement("use", { xlinkHref: "#path-1" })), React.createElement("g", { id: "Beach", mask: "url(#mask-2)" }, React.createElement("g", { transform: "translate(87.000000, 0.000000)" }, React.createElement("polygon", { id: "Path-3-Copy", fill: "#807065", points: "130 3.02898551 224.336 0 298.504 0 330 13.9263701 281.232 196.672072 99.368 213.537676 90 90.8695652 109 50.4830918" }), React.createElement("path", { d: "M61.0012132,181.616706 L53.053824,239.116588 C52.9025928,240.210755 53.6669939,241.220351 54.7611615,241.371582 C54.8518986,241.384123 54.9433901,241.390416 55.0349898,241.390416 L173,241.390416 C174.104569,241.390416 175,240.494985 175,239.390416 L175,139.995598 C175,139.668656 174.919849,139.346699 174.766566,139.057917 L150.843415,93.9873454 C150.325548,93.0116981 149.114815,92.6405938 148.139168,93.1584607 C147.952014,93.2578007 147.781835,93.3862497 147.634996,93.5390028 L134.829423,106.860382 C134.420482,107.285796 133.844547,107.508906 133.255736,107.470009 L93.4204169,104.83845 C93.332247,104.832625 93.2437881,104.83265 93.1556215,104.838525 L54.8277489,107.392227 C53.725623,107.465659 52.891702,108.418637 52.9651342,109.520763 C52.9671445,109.550935 52.9698388,109.581057 52.973215,109.611107 L61.007542,181.119573 C61.0261175,181.284902 61.0239915,181.451903 61.0012132,181.616706 Z", id: "Path-3-Copy", fill: "#938071" }), React.createElement("path", { d: "M150.719036,45.5194591 L146.844562,88.5504472 L117.775815,111.051811 C117.201096,111.496686 116.912947,112.218322 117.023182,112.936698 L122.673383,149.757947 C122.779628,150.450327 123.240365,151.036661 123.887977,151.303639 L171.429651,170.902705 C171.94653,171.115789 172.529003,171.102798 173.035868,170.866881 L215.417952,151.140402 C215.791145,150.966701 216.208845,150.912384 216.614051,150.984863 L246.606757,156.349625 C246.892399,156.400718 247.185737,156.389042 247.466415,156.315409 L288.404071,145.575781 C289.017754,145.414787 289.51865,144.972167 289.753941,144.38296 L304.823109,106.647283 C304.877077,106.512139 304.945633,106.383288 305.02756,106.26302 L319.589735,84.8858843 C319.757498,84.6396088 319.86811,84.3589576 319.913485,84.0644454 L326.5212,41.1758627 C326.689393,40.0841737 325.940752,39.0628374 324.849063,38.8946441 C324.80957,38.8885596 324.769903,38.8836599 324.730117,38.8799518 L261.862764,33.0207426 C261.85063,33.0196117 261.838485,33.0185917 261.826332,33.0176828 L208.181123,29.0055702 C207.958324,28.9889071 207.734308,29.0096935 207.518379,29.067066 L152.197396,43.7658778 C151.385099,43.9817055 150.794407,44.6823648 150.719036,45.5194591 Z", id: "Path-4", fill: "#A08D7F" }), React.createElement("path", { d: "M59.2525739,275.471154 L39.1760839,219.486058 C38.9566316,218.874096 38.9419109,218.207406 39.1341379,217.586353 L53.9378182,169.758208 C54.1667151,169.018681 54.6726269,168.396266 55.349781,168.021092 L99.8321299,143.375854 C100.479721,143.017059 101.237112,142.910392 101.95861,143.076372 L179.20998,160.848014 C179.623922,160.943241 180.053367,160.949482 180.469901,160.866323 L191.827863,158.59878 C193.200428,158.324756 194.580093,159.036271 195.152681,160.313443 L214.575452,203.636402 C214.748509,204.02241 214.837974,204.440655 214.837974,204.863682 L214.837974,246.714719 C214.837974,247.661097 214.391416,248.55199 213.633183,249.118305 L167.950333,283.238259 C167.431909,283.625464 166.802188,283.834673 166.155125,283.834673 L97.4800744,283.834673 C97.3017666,283.834673 97.1238138,283.818777 96.9483293,283.787172 L61.544745,277.410984 C60.4887695,277.220803 59.6147596,276.481141 59.2525739,275.471154 Z", id: "Path-2", fill: "#817064" }), React.createElement("path", { d: "M197.594575,89.5241583 L155.755313,122.791409 C155.194665,123.237192 154.915214,123.948758 155.022677,124.656925 L166.895576,202.898369 C167.061294,203.990436 168.08093,204.741391 169.172998,204.575673 C169.306458,204.555421 169.437525,204.521709 169.564194,204.475054 L267.709428,168.325555 C267.930775,168.244027 268.164799,168.202299 268.400682,168.202299 L309.990006,168.202299 C311.024847,168.202299 311.888789,167.412886 311.981895,166.382242 L318.834272,90.5296518 C318.901328,89.7873778 318.550088,89.0693913 317.922929,88.6667281 L289.342717,70.3170196 C289.020333,70.1100354 288.645283,70 288.262172,70 L251.202144,70 C250.968489,70 250.736641,70.0409437 250.517118,70.1209737 L198.154276,89.2105889 C197.952051,89.2843129 197.763053,89.390198 197.594575,89.5241583 Z", id: "Path-5", fill: "#938071" }), React.createElement("path", { d: "M55.1492163,225.152059 L44.7404564,251.179988 C44.670305,251.355408 44.6253628,251.539882 44.6069697,251.72791 L37.0096451,329.394039 C36.902109,330.493361 37.7061107,331.471713 38.8054332,331.579249 C39.2152736,331.61934 39.6274988,331.531944 39.9858126,331.328997 L77.2111363,310.244735 C77.4894486,310.0871 77.8015092,309.998515 78.121134,309.986413 L157.126411,306.99509 C157.45996,306.982461 157.785045,306.886552 158.072033,306.716104 L191.634698,286.782609 L176.763801,225.10237 C176.643038,224.601481 176.333626,224.166522 175.900056,223.888152 L146.974971,205.31702 C146.652587,205.110035 146.277537,205 145.894426,205 L108.834398,205 C108.600742,205 108.368894,205.040944 108.149372,205.120974 L56.3212034,224.015666 C55.7866925,224.21053 55.3604669,224.623811 55.1492163,225.152059 Z", id: "Path-5-Copy", fill: "#938071" }), React.createElement("path", { d: "M123.130042,214.751338 L140.349737,260.148296 C140.572709,260.736126 141.05911,261.184898 141.662955,261.35992 L202.427569,278.972257 C202.646305,279.035656 202.874262,279.061231 203.101609,279.047878 L300.933116,273.301881 C301.943549,273.242535 302.750357,272.437657 302.812124,271.42737 L307.666309,192.029781 C307.690789,191.629378 307.594295,191.230865 307.389362,190.88601 L295.759648,171.315878 C295.722496,171.253361 295.681963,171.192917 295.638228,171.134815 L276.703879,145.980487 L227.463285,140.014525 C226.974288,139.955278 226.480626,140.078569 226.076905,140.360769 L187.836857,167.090434 C187.748351,167.1523 187.654979,167.206896 187.557658,167.253687 L145.703879,187.376622 L123.495739,212.724035 C123.008427,213.280232 122.867781,214.059929 123.130042,214.751338 Z", id: "Path-3", fill: "#88776C" }), React.createElement("path", { d: "M82.452093,249.931238 L58.8770781,290 L52.9594522,316.424439 C52.9050153,316.66752 52.8964681,316.918632 52.9342505,317.164852 L58.6431952,354.368923 C58.7810137,355.267059 59.5069561,355.95942 60.4106083,356.054578 L99.6919922,360.191026 C99.9190002,360.214931 100.148425,360.199798 100.370327,360.146283 L140.566131,350.45248 C140.874305,350.378159 141.195731,350.378159 141.503904,350.45248 L181.578999,360.117172 C181.878941,360.189508 182.191553,360.191466 182.492378,360.122894 L225.388727,350.344784 C225.404471,350.341196 225.420171,350.337416 225.435824,350.333447 L269.147494,339.249302 C269.711051,339.106399 270.184532,338.725338 270.444619,338.205364 L286.729591,305.648053 C286.927599,305.252191 286.988695,304.801827 286.903307,304.36752 L278.221554,260.209738 C278.103721,259.610407 277.718474,259.097776 277.175567,258.817892 L229.602333,234.292468 C229.233291,234.102216 228.814187,234.031534 228.403161,234.090228 L145.092618,245.986774 C145.030906,245.995587 144.968817,246.001509 144.906552,246.004522 L84.0792034,248.94778 C83.4057314,248.980368 82.7940119,249.350103 82.452093,249.931238 Z", id: "Path-4-Copy", fill: "#A08D7F" }), React.createElement("path", { d: "M159.236358,384.860732 L121.89618,348.126471 C121.109287,347.352346 120.811076,346.208628 121.119796,345.148835 L135.331565,296.361963 C135.517593,295.723356 135.910577,295.164681 136.448735,294.773769 L189.039041,256.572771 C189.551538,256.2005 190.168718,256 190.802152,256 L222.618542,256 L229.204724,265.537811 L271.809568,275.857421 C272.233716,275.960156 272.675171,275.969116 273.103137,275.883675 L284.443343,273.619677 C285.815908,273.345653 287.195572,274.057169 287.768161,275.33434 L307.190931,318.657299 C307.363989,319.043307 307.453454,319.461552 307.453454,319.884579 L307.453454,361.735616 C307.453454,362.681994 307.006896,363.572887 306.248662,364.139202 L260.565813,398.259156 C260.047389,398.646361 259.417668,398.85557 258.770604,398.85557 L190.472535,398.85557 C190.047409,398.85557 189.627137,398.765216 189.239574,398.590494 L160.107295,385.457055 C159.784021,385.311316 159.489145,385.109417 159.236358,384.860732 Z", id: "Path-2-Copy", fill: "#817064" }), React.createElement("path", { d: "M21.003395,336.51875 L24.866694,402.829385 C24.9110246,403.590287 25.3839851,404.259845 26.0863053,404.555957 L69.5640708,422.887079 C69.8464508,423.006136 70.1524136,423.05871 70.4583389,423.040742 L168.168343,417.301881 C169.178776,417.242535 169.985584,416.437657 170.04735,415.42737 L174.901536,336.029781 C174.926015,335.629378 174.829522,335.230865 174.624589,334.88601 L162.994874,315.315878 C162.957723,315.253361 162.917189,315.192917 162.873454,315.134815 L143.939106,289.980487 L94.6985112,284.014525 C94.2095145,283.955278 93.7158526,284.078569 93.312131,284.360769 L54.9466035,311.178144 C54.9416049,311.181638 54.9366222,311.185155 54.9316558,311.188695 L21.839241,334.773741 C21.2790799,335.172969 20.9633872,335.832046 21.003395,336.51875 Z", id: "Path-3-Copy-2", fill: "#88776C" }), React.createElement("path", { d: "M127.666609,397.959917 L151.586866,432.405087 C151.853806,432.789481 152.247092,433.068092 152.698265,433.192423 L198.874615,445.9174 C199.073248,445.972138 199.279147,445.995854 199.485023,445.987709 L272.992116,443.079441 C274.095822,443.035773 274.955153,442.105643 274.911485,441.001937 C274.911361,440.998796 274.911229,440.995654 274.91109,440.992513 L271.041325,353.617297 C271.040019,353.587818 271.039366,353.558313 271.039366,353.528805 L271.039366,321.041835 C271.039366,319.937266 270.143936,319.041835 269.039366,319.041835 C268.995299,319.041835 268.951243,319.043292 268.907272,319.046202 L230.378839,321.596468 C230.275631,321.6033 230.173108,321.618127 230.072193,321.640817 L184.456214,331.897422 C184.156118,331.964897 183.875629,332.100681 183.636557,332.294216 L142.347299,365.718853 C142.118586,365.904002 141.933546,366.137339 141.805377,366.402221 L127.509031,395.948004 C127.194554,396.597922 127.254781,397.366884 127.666609,397.959917 Z", id: "Path-3-Copy-3", fill: "#938071" }), React.createElement("path", { d: "M16.734227,382.151683 L11,407 L25.7756007,419.03055 C26.4934908,419.615069 26.7164099,420.615873 26.3144695,421.449822 L14.4453388,446.076007 C14.1657583,446.656083 14.1825782,447.335291 14.4905284,447.900817 L26.3452267,469.671051 C26.739928,470.395889 27.539341,470.803832 28.3578783,470.698114 L69.9254902,465.329423 C69.9751459,465.32301 70.0245432,465.314734 70.0735778,465.304614 L119.799973,455.041285 C119.932978,455.013833 120.068434,455 120.204244,455 L183.241655,455 C183.634855,455 184.019331,454.884098 184.34702,454.666784 L226.577505,426.660684 C226.793315,426.517565 226.979278,426.333897 227.125067,426.11988 L241.589735,404.885884 C241.757498,404.639609 241.86811,404.358958 241.913485,404.064445 L248.5212,361.175863 C248.689393,360.084174 247.940752,359.062837 246.849063,358.894644 C246.80957,358.88856 246.769903,358.88366 246.730117,358.879952 L183.862764,353.020743 C183.85063,353.019612 183.838485,353.018592 183.826332,353.017683 L130.19836,349.006859 C129.964322,348.989356 129.729029,349.013181 129.503251,349.077246 L18.1370628,380.677359 C17.435683,380.876375 16.898165,381.441285 16.734227,382.151683 Z", id: "Path-4-Copy-2", fill: "#A08D7F" }), React.createElement("path", { d: "M38.2363575,520.860732 L0.896179881,484.126471 C0.109286633,483.352346 -0.188924475,482.208628 0.119796497,481.148835 L14.3315647,432.361963 C14.5175929,431.723356 14.9105773,431.164681 15.4487348,430.773769 L68.0390409,392.572771 C68.5515376,392.2005 69.1687176,392 69.8021521,392 L101.618542,392 L164.410515,408.782739 C165.282947,409.015918 166.003924,409.629692 166.373358,410.453724 L186.190931,454.657299 C186.363989,455.043307 186.453454,455.461552 186.453454,455.884579 L186.453454,497.735616 C186.453454,498.681994 186.006896,499.572887 185.248662,500.139202 L139.565813,534.259156 C139.047389,534.646361 138.417668,534.85557 137.770604,534.85557 L69.472535,534.85557 C69.0474087,534.85557 68.627137,534.765216 68.2395743,534.590494 L39.1072948,521.457055 C38.7840206,521.311316 38.489145,521.109417 38.2363575,520.860732 Z", id: "Path-2-Copy-2", fill: "#817064" }), React.createElement("path", { d: "M145.115588,432.014953 L156,469 L149.310593,498.437499 C149.095691,499.383202 149.590237,500.346805 150.48387,500.723579 L193.564071,518.887079 C193.846451,519.006136 194.152414,519.05871 194.458339,519.040742 L292.168343,513.301881 C293.178776,513.242535 293.985584,512.437657 294.04735,511.42737 L298.901536,432.029781 C298.926015,431.629378 298.829522,431.230865 298.624589,430.88601 L286.994874,411.315878 C286.957723,411.253361 286.917189,411.192917 286.873454,411.134815 L267.939106,385.980487 L246,389 L218.495818,380.102613 C218.131854,379.984873 217.741758,379.973983 217.371792,380.071233 C205.094257,383.298531 195.970326,386.274787 190,389 C184.078433,391.702956 173.126735,394.628226 157.144906,397.775809 L157.144907,397.775815 C156.437196,397.915197 155.859366,398.42486 155.632699,399.109626 L145.135544,430.821823 C145.007636,431.208236 145.000674,431.624478 145.115588,432.014953 Z", id: "Path-3-Copy-4", fill: "#88776C" }))))));
var arrow_up_svg = React.createElement("svg", { className: "arrow arrow-up", version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "44", height: "30", viewBox: "0 0 44 30" }, React.createElement("path", { d: "M42.050 29.917h-40.32c-0.933 0-1.69-0.757-1.69-1.69 0-0.373 0.123-0.735 0.351-1.031l20.13-26.151c0.569-0.74 1.631-0.878 2.37-0.308 0.115 0.089 0.218 0.192 0.307 0.306l20.19 26.151c0.57 0.739 0.434 1.8-0.305 2.371-0.296 0.228-0.659 0.352-1.033 0.352z" }));
var arrow_down_svg = React.createElement("svg", { className: "arrow arrow-down", version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "45", height: "30", viewBox: "0 0 45 30" }, React.createElement("path", { d: "M1.298 0h42.038c0.7 0 1.268 0.568 1.268 1.268 0 0.28-0.093 0.552-0.263 0.773l-20.988 27.265c-0.427 0.555-1.223 0.658-1.778 0.231-0.086-0.066-0.164-0.144-0.23-0.23l-21.050-27.265c-0.428-0.554-0.325-1.35 0.229-1.778 0.222-0.171 0.494-0.264 0.775-0.264z" }));

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(48);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(2)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./wave.scss", function() {
		var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/sass-loader/lib/loader.js!./wave.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".graphic {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  flex-basis: auto;\n  position: relative; }\n\n.graphic .percent {\n  position: absolute;\n  top: 1rem;\n  left: 1rem; }\n  .graphic .percent .value {\n    font-size: 2rem; }\n  .graphic .percent .direction {\n    display: inline-block;\n    margin-left: .5rem; }\n\n.graphic .crab-container {\n  height: 4rem;\n  position: relative; }\n  .graphic .crab-container .crab {\n    position: absolute;\n    top: 0;\n    right: -.5rem;\n    z-index: 5;\n    height: 5rem; }\n\n.graphic .waves {\n  flex: 1;\n  position: relative; }\n  .graphic .waves .wave, .graphic .waves .wave-container {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%; }\n  .graphic .waves .wave-lower {\n    fill: #8DC2D5; }\n  .graphic .waves .wave-higher {\n    fill: #B5DCE8; }\n  .graphic .waves .wave-svg-offset {\n    position: absolute;\n    bottom: 0;\n    height: 5px;\n    width: 100%;\n    background-color: #8DC2D5; }\n  .graphic .waves .rocks {\n    position: absolute;\n    right: 0rem;\n    width: 14rem;\n    min-width: 40%;\n    max-width: 60%;\n    height: 30rem;\n    max-height: 250%;\n    min-height: 100%; }\n\n.graphic .marker {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  height: 100%;\n  width: 60%; }\n  .graphic .marker .line-container {\n    width: 3rem;\n    margin-left: 1rem;\n    padding: 0;\n    padding-bottom: 1rem;\n    height: 100%;\n    display: flex;\n    flex-direction: column; }\n    .graphic .marker .line-container .line {\n      width: 1rem;\n      margin: 0 auto;\n      background-color: #19576D; }\n    .graphic .marker .line-container .line-cap {\n      height: 1rem; }\n    .graphic .marker .line-container .line-begin {\n      border-radius: 2px 2px 0 0; }\n    .graphic .marker .line-container .line-end {\n      border-radius: 0 0 2px 2px; }\n    .graphic .marker .line-container .line-faint {\n      opacity: .4; }\n  .graphic .marker .line-flex {\n    flex: 1;\n    display: flex;\n    flex-direction: column; }\n    .graphic .marker .line-flex .line {\n      flex: 0; }\n    .graphic .marker .line-flex .line-arrow-holder {\n      position: relative;\n      width: 1rem;\n      height: .1rem;\n      margin: 0 auto; }\n    .graphic .marker .line-flex .arrow {\n      fill: #19576D;\n      position: absolute;\n      width: 3rem;\n      height: 3rem;\n      left: -1rem; }\n    .graphic .marker .line-flex .arrow-up {\n      top: -2rem; }\n    .graphic .marker .line-flex .arrow-down {\n      top: -1rem; }\n  .graphic .marker .marker-header {\n    display: block;\n    position: absolute;\n    left: 4.6rem; }\n    .graphic .marker .marker-header span {\n      white-space: pre; }\n  .graphic .marker .marker-title {\n    font-size: 1.2rem;\n    font-weight: bold;\n    display: inline-block;\n    margin-right: 1rem; }\n  .graphic .marker .marker-high {\n    top: 0rem; }\n  .graphic .marker .marker-low {\n    bottom: 1rem; }\n", ""]);

// exports


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StyleScript = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StyleScript = exports.StyleScript = function (_React$Component) {
    _inherits(StyleScript, _React$Component);

    function StyleScript(props) {
        _classCallCheck(this, StyleScript);

        var _this = _possibleConstructorReturn(this, (StyleScript.__proto__ || Object.getPrototypeOf(StyleScript)).call(this, props));

        _this.ref = null;
        _this.ref = React.createRef();
        return _this;
    }

    _createClass(StyleScript, [{
        key: "render",
        value: function render() {
            return React.createElement("div", { ref: this.ref, style: { position: "absolute", width: "100%", height: this.props.input } });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var outputPixels = -1;
            if (this.ref && this.ref.current) outputPixels = this.ref.current.offsetHeight;
            this.props.outputPixels(outputPixels);
        }
    }]);

    return StyleScript;
}(React.Component);

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(51);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(2)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./tide.scss", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./tide.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".tide {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  position: relative; }\n  .tide .low-button {\n    position: absolute;\n    bottom: 0;\n    display: flex;\n    padding: .3rem .4rem;\n    margin: .5rem;\n    border: 1px solid #19576D;\n    border-radius: 3px;\n    background-color: transparent;\n    color: #19576D;\n    align-items: center; }\n    .tide .low-button svg {\n      fill: #19576D;\n      height: 1.6rem; }\n  .tide .low-button-title {\n    display: inline-block;\n    margin: 0 .5rem;\n    font-weight: bold; }\n  .tide .share {\n    left: 0; }\n  .tide .refresh {\n    right: 0; }\n", ""]);

// exports


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Settings = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var React = _interopRequireWildcard(_react);

__webpack_require__(53);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Settings = exports.Settings = function (_React$Component) {
    _inherits(Settings, _React$Component);

    function Settings() {
        _classCallCheck(this, Settings);

        return _possibleConstructorReturn(this, (Settings.__proto__ || Object.getPrototypeOf(Settings)).apply(this, arguments));
    }

    _createClass(Settings, [{
        key: "render",
        value: function render() {
            return React.createElement("div", { className: "settings tab-view-bg" }, React.createElement("h3", null, "Settings coming soon."));
        }
    }]);

    return Settings;
}(React.Component);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(54);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(2)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./settings.scss", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./settings.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".settings {\n  text-align: center; }\n", ""]);

// exports


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getNoaaData = getNoaaData;
//const noaaUri = "api/proxy/noaa/latest";
var noaaUri = "http://localhost:8000/proxy/noaa/latest";
function getNoaaData(minTimeMs) {
    return wrapPromise(fetch(noaaUri).then(function (res) {
        if (res.ok) {
            return res.json().then(function (json) {
                console.log(json.isUpdated);
                return parseJsonToResponse(json.response);
            }).catch(function (err) {
                throw new Error("There was a problem deserializing the API response");
            });
        } else {
            if (res.status === 404) {
                throw new Error("The application could not connect to the API (404)");
            }
            throw new Error("The API experienced an error (" + res.status + ")");
        }
    }).catch(function (err) {
        if (!(err instanceof Error)) {
            err = new Error(err);
        }
        console.error(noaaUri, err);
        throw err;
    }), minTimeMs);
}
function timeoutPromise(val, pass, timeout) {
    return new Promise(function (res, rej) {
        setTimeout(function () {
            if (pass) res(val);else rej(val);
        }, timeout);
    });
}
// Delays a promise, including its error.
function wrapPromise(promise, time) {
    var now = Date.now();
    return promise.then(function (val) {
        var diff = Date.now() - now;
        if (diff < time) return timeoutPromise(val, true, time - diff);else return val;
    }).catch(function (err) {
        var diff = Date.now() - now;
        if (diff < time) return timeoutPromise(err, false, time - diff);else return err;
    });
}
function parseJsonToResponse(json) {
    var parsed = {
        tzo: json.tzo,
        errors: json.errors,
        data: {
            waterLevel: null,
            current: {
                airPressure: null,
                airTemp: null,
                waterTemp: null,
                wind: null
            }
        }
    };
    if (!!json.data.waterLevel) {
        var waterLevelJson = json.data.waterLevel;
        parsed.data.waterLevel = {
            predictionsBeforeCurrent: waterLevelJson.predictionsBeforeCurrent.map(parseJsonToPrediction),
            previous: parseJsonToPrediction(waterLevelJson.previous),
            current: parseJsonToCurrentData(waterLevelJson.current),
            currentIsRising: waterLevelJson.currentIsRising,
            currentPercentFallen: waterLevelJson.currentPercentFallen,
            next: parseJsonToPrediction(waterLevelJson.next),
            high: parseJsonToPrediction(waterLevelJson.high),
            low: parseJsonToPrediction(waterLevelJson.low),
            predictionsAfterCurrent: waterLevelJson.predictionsAfterCurrent.map(parseJsonToPrediction)
        };
    }
    if (!!json.data.current.airPressure) parsed.data.current.airPressure = parseJsonToCurrentData(json.data.current.airPressure);
    if (!!json.data.current.airTemp) parsed.data.current.airTemp = parseJsonToCurrentData(json.data.current.airTemp);
    if (!!json.data.current.waterTemp) parsed.data.current.waterTemp = parseJsonToCurrentData(json.data.current.waterTemp);
    if (!!json.data.current.wind) {
        var windJson = json.data.current.wind;
        parsed.data.current.wind = {
            time: new Date(windJson.time),
            direction: windJson.direction,
            directionCardinal: windJson.directionCardinal,
            gust: windJson.gust,
            speed: windJson.speed
        };
    }
    return parsed;
}
function parseJsonToPrediction(json) {
    var currentData = parseJsonToCurrentData(json);
    currentData.isHigh = json.isHigh;
    return currentData;
}
function parseJsonToCurrentData(json) {
    return {
        time: new Date(json.time),
        val: json.val
    };
}
//
//
/// ABOVE copied from api project (proxy/noaa/models)
//
//

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Info = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var React = _interopRequireWildcard(_react);

__webpack_require__(57);

var _define = __webpack_require__(16);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Info = exports.Info = function (_React$Component) {
    _inherits(Info, _React$Component);

    function Info(props) {
        _classCallCheck(this, Info);

        var _this = _possibleConstructorReturn(this, (Info.__proto__ || Object.getPrototypeOf(Info)).call(this, props));

        _this.state = {};
        return _this;
    }

    _createClass(Info, [{
        key: "render",
        value: function render() {
            var date = new Date(_define.DEFINE.BUILD.TIME);
            var dateStr = date.toISOString();
            return React.createElement("div", { className: "info tab-view-bg" }, React.createElement("section", { className: "info-header" }, React.createElement("div", null, React.createElement("span", { className: "key" }, "Authored by"), React.createElement("span", { className: "value" }, "Andrew Messier")), React.createElement("div", null, React.createElement("span", { className: "key" }, "Version"), React.createElement("span", { className: "value" }, _define.DEFINE.BUILD.VERSION, " (", _define.DEFINE.BUILD.IS_PRODUCTION ? "Production" : "Debug", ")")), React.createElement("div", null, React.createElement("span", { className: "key" }, "Updated"), React.createElement("span", { className: "value" }, dateStr))), React.createElement("section", { className: "info-gh" }, React.createElement("a", { href: "https://github.com/messman/quick-tides", rel: "noopener noreferrer" }, React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "32", height: "30", viewBox: "0 0 32 30" }, React.createElement("path", { d: "M10.738 24.136c0 0.124-0.149 0.223-0.337 0.223-0.214 0.019-0.362-0.081-0.362-0.223 0-0.124 0.149-0.223 0.337-0.223 0.194-0.019 0.362 0.081 0.362 0.223zM8.725 23.857c-0.045 0.124 0.084 0.267 0.278 0.304 0.168 0.062 0.362 0 0.401-0.124s-0.084-0.267-0.278-0.322c-0.168-0.043-0.356 0.019-0.401 0.143zM11.586 23.752c-0.188 0.043-0.317 0.161-0.298 0.304 0.019 0.124 0.188 0.205 0.382 0.161 0.188-0.043 0.317-0.161 0.298-0.285-0.019-0.118-0.194-0.198-0.382-0.18zM15.845 0c-8.978 0-15.845 6.527-15.845 15.124 0 6.874 4.518 12.756 10.971 14.826 0.829 0.143 1.12-0.347 1.12-0.75 0-0.384-0.019-2.504-0.019-3.806 0 0-4.531 0.93-5.482-1.847 0 0-0.738-1.804-1.799-2.269 0 0-1.482-0.973 0.104-0.955 0 0 1.612 0.124 2.498 1.599 1.418 2.393 3.793 1.705 4.719 1.295 0.149-0.992 0.57-1.68 1.036-2.089-3.618-0.384-7.269-0.886-7.269-6.849 0-1.705 0.492-2.56 1.528-3.651-0.168-0.403-0.718-2.064 0.168-4.209 1.353-0.403 4.466 1.674 4.466 1.674 1.295-0.347 2.686-0.527 4.065-0.527s2.77 0.18 4.065 0.527c0 0 3.113-2.083 4.466-1.674 0.887 2.151 0.337 3.806 0.168 4.209 1.036 1.097 1.67 1.952 1.67 3.651 0 5.981-3.812 6.459-7.431 6.849 0.595 0.49 1.1 1.419 1.1 2.876 0 2.089-0.019 4.674-0.019 5.182 0 0.403 0.298 0.893 1.12 0.75 6.473-2.058 10.861-7.94 10.861-14.814 0-8.597-7.282-15.124-16.259-15.124zM6.291 21.378c-0.084 0.062-0.065 0.205 0.045 0.322 0.104 0.099 0.252 0.143 0.337 0.062 0.084-0.062 0.065-0.205-0.045-0.322-0.104-0.099-0.252-0.143-0.337-0.062zM5.592 20.876c-0.045 0.081 0.019 0.18 0.149 0.242 0.104 0.062 0.233 0.043 0.278-0.043 0.045-0.081-0.019-0.18-0.149-0.242-0.129-0.037-0.233-0.019-0.278 0.043zM7.69 23.083c-0.104 0.081-0.065 0.267 0.084 0.384 0.149 0.143 0.337 0.161 0.421 0.062 0.084-0.081 0.045-0.267-0.084-0.384-0.142-0.143-0.337-0.161-0.421-0.062zM6.952 22.171c-0.104 0.062-0.104 0.223 0 0.366s0.278 0.205 0.362 0.143c0.104-0.081 0.104-0.242 0-0.384-0.091-0.143-0.259-0.205-0.362-0.124z" })), React.createElement("div", { className: "split-right" }, React.createElement("p", null, "open-source on GitHub"), React.createElement("p", null, "at messman/quick-tides")))), React.createElement("section", { className: "info-thanks" }, React.createElement("div", null, "Dedicated to Mark & Dawna Messier."), React.createElement("div", null, "Many thanks to the U.S. National Oceanic and Atmospheric Administration (NOAA) for their ", React.createElement("a", { href: "https://tidesandcurrents.noaa.gov/api/" }, "Data Retrieval API"), "."), React.createElement("div", null, "Think the data on this app is incorrect? Check it against the NOAA station page for ", React.createElement("a", { href: "https://tidesandcurrents.noaa.gov/stationhome.html?id=8419317" }, "Wells, ME - Station ID: 8419317"), "."), React.createElement("div", null, "Technical acknowledgments:", React.createElement("ul", null, React.createElement("li", null, "IcoMoon and FontAwesome for icons"), React.createElement("li", null, "Sketch, VSCode, & Chrome for development")))));
        }
    }]);

    return Info;
}(React.Component);

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(58);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(2)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./info.scss", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./info.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".info {\n  text-align: center;\n  font-family: 'Courier New', Courier, monospace; }\n  .info section {\n    margin: .5rem; }\n    .info section + section {\n      margin-top: 1.5rem; }\n\n.info-header span {\n  display: inline-block;\n  padding: 0 .2rem; }\n\n.info-header .value {\n  color: rgba(25, 87, 109, 0.7); }\n\n.info-gh a {\n  margin: auto;\n  background-color: #EAEAEA;\n  border: 1px solid #BEBEBE;\n  border-radius: 6px;\n  box-shadow: 0 1px 3px 0 #333;\n  padding: .6rem .7rem;\n  display: inline-flex;\n  align-items: center;\n  position: relative;\n  box-shadow: inset 0 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 0 3px 0 rgba(0, 0, 0, 0.4), inset 0 0 3px 5px rgba(0, 0, 0, 0.05), 2px 2px 4px 0 rgba(0, 0, 0, 0.4);\n  color: #333; }\n  .info-gh a:before, .info-gh a:after {\n    content: '';\n    display: block;\n    position: absolute;\n    left: 2px;\n    right: 2px;\n    height: 2px; }\n  .info-gh a:before {\n    top: 0;\n    border-bottom-left-radius: 6px;\n    border-bottom-right-radius: 6px;\n    background: rgba(255, 255, 255, 0.6);\n    box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.6); }\n  .info-gh a:after {\n    bottom: 0;\n    border-top-left-radius: 6px;\n    border-top-right-radius: 6px;\n    background: rgba(0, 0, 0, 0.15);\n    box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.15); }\n  .info-gh a:link, .info-gh a:visited, .info-gh a:active, .info-gh a:hover {\n    color: #333;\n    text-decoration: none; }\n  .info-gh a p {\n    text-align: left;\n    margin: 0;\n    line-height: 1.4rem;\n    font-weight: bold; }\n  .info-gh a svg {\n    fill: #333;\n    height: 2.5rem;\n    width: auto; }\n  .info-gh a .split-right {\n    padding-left: .7rem;\n    font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif; }\n\n.info-thanks > div {\n  margin: 1.5rem 0;\n  line-height: 1rem; }\n\n.info-thanks a, .info-thanks a:link, .info-thanks a:hover, .info-thanks a:active, .info-thanks a:visited {\n  color: #06151a;\n  white-space: pre; }\n\n.info-thanks ul {\n  margin: .5rem 0;\n  padding: 0;\n  list-style-type: none; }\n  .info-thanks ul li {\n    color: rgba(25, 87, 109, 0.7); }\n", ""]);

// exports


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.More = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var React = _interopRequireWildcard(_react);

__webpack_require__(60);

var _time = __webpack_require__(8);

var Time = _interopRequireWildcard(_time);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var More = exports.More = function (_React$Component) {
    _inherits(More, _React$Component);

    function More() {
        _classCallCheck(this, More);

        return _possibleConstructorReturn(this, (More.__proto__ || Object.getPrototypeOf(More)).apply(this, arguments));
    }

    _createClass(More, [{
        key: "render",
        value: function render() {
            var noaa = this.props.noaa;

            var current = noaa.data.current;
            var prettyTime = Time.createPrettyTime(current.airTemp.time);
            return React.createElement("div", { className: "more tab-view-bg" }, React.createElement("header", null, React.createElement("div", { className: "title" }, "Current Conditions"), React.createElement("div", { className: "timing" }, "as of ", React.createElement("span", { className: "pretty-time" }, prettyTime.time), React.createElement("span", { className: "pretty-ampm" }, prettyTime.ampm))), React.createElement(DataSection, { title: "Water Temperature", value: current.waterTemp.val, unit: "Degrees (F)" }), React.createElement(DataSection, { title: "Air Temperature", value: current.airTemp.val, unit: "Degrees (F)" }), React.createElement(DataSection, { title: "Air Pressure", value: current.airPressure.val, unit: "Millibars (mb)" }), React.createElement("section", null, React.createElement("div", { className: "data-title" }, "Wind"), React.createElement("div", { className: "data-value" }, React.createElement("span", { className: "value" }, current.wind.speed), React.createElement("span", { className: "unit" }, "knots ", current.wind.directionCardinal)), React.createElement("div", { className: "data-value" }, React.createElement("span", { className: "value" }, current.wind.gust), React.createElement("span", { className: "unit" }, "knot gusts"))));
        }
    }]);

    return More;
}(React.Component);

var DataSection = function (_React$Component2) {
    _inherits(DataSection, _React$Component2);

    function DataSection() {
        _classCallCheck(this, DataSection);

        return _possibleConstructorReturn(this, (DataSection.__proto__ || Object.getPrototypeOf(DataSection)).apply(this, arguments));
    }

    _createClass(DataSection, [{
        key: "render",
        value: function render() {
            var props = this.props;
            return React.createElement("section", null, React.createElement("div", { className: "data-title" }, props.title), React.createElement("div", { className: "data-value" }, React.createElement("span", { className: "value" }, props.value), React.createElement("span", { className: "unit" }, props.unit)));
        }
    }]);

    return DataSection;
}(React.Component);

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(61);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(2)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./more.scss", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./more.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".more {\n  text-align: center; }\n  .more header {\n    margin: 2rem; }\n    .more header .title {\n      font-size: 1.5rem; }\n    .more header .timing {\n      font-size: 1.2rem; }\n    .more header .pretty-ampm {\n      display: inline-block;\n      margin-left: .3rem;\n      font-size: 80%; }\n  .more section {\n    margin: 1rem 2rem; }\n    .more section .data-title {\n      font-size: 1.2rem; }\n    .more section .unit {\n      display: inline-block;\n      margin-left: .4rem;\n      color: rgba(25, 87, 109, 0.7); }\n", ""]);

// exports


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Charts = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var React = _interopRequireWildcard(_react);

var _time = __webpack_require__(8);

var Time = _interopRequireWildcard(_time);

__webpack_require__(63);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Charts = exports.Charts = function (_React$Component) {
    _inherits(Charts, _React$Component);

    function Charts(props) {
        _classCallCheck(this, Charts);

        return _possibleConstructorReturn(this, (Charts.__proto__ || Object.getPrototypeOf(Charts)).call(this, props));
    }

    _createClass(Charts, [{
        key: "render",
        value: function render() {
            var noaa = this.props.noaa;

            var waterLevel = noaa.data.waterLevel;
            var previousPredictions = React.createElement("div", { className: "predictions predictions-previous" }, createTable(waterLevel.predictionsBeforeCurrent));
            var nextPredictions = React.createElement("div", { className: "predictions predictions-next" }, createTable(waterLevel.predictionsAfterCurrent));
            return React.createElement("div", { className: "charts tab-view-bg" }, React.createElement("header", null, "Wells, Maine"), previousPredictions, React.createElement("div", { className: "current" }, React.createElement("div", { className: "line" }), React.createElement("div", { className: "current-text" }, "Current: ", createPrettyTimeElement(waterLevel.current.time)), React.createElement("div", { className: "line" })), nextPredictions);
        }
    }]);

    return Charts;
}(React.Component);

function createPrettyTimeElement(date) {
    var pretty = Time.createPrettyTime(date);
    return React.createElement("span", { className: "pretty" }, React.createElement("span", { className: "pretty-time" }, pretty.time), React.createElement("span", { className: "pretty-ampm" }, pretty.ampm));
}
function createPrettyMonthDay(date) {
    var month = date.toLocaleString("en-us", { month: "short" });
    var day = date.getDate();
    return month + " " + day;
}
function createTable(predictions) {
    return React.createElement("table", null, React.createElement("tbody", null, predictions.map(function (p, i) {
        return React.createElement("tr", { key: i }, React.createElement("td", null, p.isHigh ? "High" : "Low"), React.createElement("td", null, createPrettyMonthDay(p.time)), React.createElement("td", null, createPrettyTimeElement(p.time)), React.createElement("td", null, p.val.toFixed(2), " ft"));
    })));
}

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(64);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(2)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./charts.scss", function() {
		var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./charts.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".charts {\n  text-align: center; }\n  .charts header {\n    margin: 2rem 0;\n    font-size: 2rem;\n    line-height: 2rem; }\n  .charts table {\n    width: 100%;\n    font-size: 1.2rem; }\n  .charts td {\n    width: 25%; }\n  .charts .pretty-ampm {\n    display: inline-block;\n    margin-left: .2rem;\n    font-size: .8rem; }\n  .charts .predictions-previous {\n    color: rgba(25, 87, 109, 0.7); }\n  .charts .current {\n    display: flex;\n    align-items: center;\n    margin: .5rem; }\n    .charts .current .line {\n      flex: 1;\n      height: 1px;\n      background-color: #19576D; }\n  .charts .current-text {\n    display: inline-block;\n    padding: .1rem .5rem;\n    border-radius: 5px;\n    background-color: #19576D;\n    color: #fcfeff; }\n", ""]);

// exports


/***/ })
],[17]);
//# sourceMappingURL=index.js.map