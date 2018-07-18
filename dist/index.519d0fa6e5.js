webpackJsonp([1],{

/***/ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/components/tabs/tabs.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".react-tabs {\n  height: 100%;\n  display: flex;\n  flex-direction: column; }\n  .react-tabs .tab-view {\n    overflow: hidden;\n    flex: 1; }\n  .react-tabs .tab-buttons {\n    background-color: #EAEAEA;\n    border-top: 1px solid #BEBEBE;\n    color: #BEBEBE;\n    fill: #BEBEBE;\n    display: flex; }\n  .react-tabs .tab-button {\n    flex: 1;\n    padding: .5rem;\n    text-align: center;\n    font-size: .8rem; }\n    .react-tabs .tab-button svg {\n      display: block;\n      margin: 0 auto;\n      margin-top: .2rem;\n      height: 26px; }\n    .react-tabs .tab-button:not(.tab-active) {\n      cursor: pointer; }\n  .react-tabs .tab-active {\n    cursor: default;\n    color: #19576D;\n    fill: #19576D; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/views/index.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "html {\n  font-family: \"Mitr\", sans-serif;\n  color: #19576D;\n  background-color: #EAEAEA; }\n\n* {\n  box-sizing: border-box; }\n\nhtml, body {\n  margin: 0;\n  padding: 0;\n  height: 100%; }\n\nmain {\n  background-color: #DFEEF4;\n  max-width: 700px;\n  margin: 0 auto;\n  padding: 0;\n  height: 100%;\n  outline: 1px solid #BEBEBE; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/views/tide/tide.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
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

/***/ "./node_modules/style-loader/lib/addStyles.js":
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

var	fixUrls = __webpack_require__("./node_modules/style-loader/lib/urls.js");

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

/***/ "./node_modules/style-loader/lib/urls.js":
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

/***/ "./src/components/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tabs = __webpack_require__("./src/components/tabs/tabs.tsx");

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

/***/ "./src/components/tabs/tabs.scss":
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/components/tabs/tabs.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);

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

/***/ "./src/components/tabs/tabs.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TabView = exports.TabButton = exports.Tab = exports.Tabs = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/index.js");

var React = _interopRequireWildcard(_react);

__webpack_require__("./src/components/tabs/tabs.scss");

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

/***/ "./src/services/define.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
// These definitions are set in your webpack config.
// Will fail if not set proerly in the webpack config.
var DEFINE = exports.DEFINE = {
    BUILD: {
        IS_PRODUCTION: false,
        TIME: "Wed Jul 18 2018 19:18:03 GMT-0400 (EDT)"
    }
};
// Make these public on the window for us to easily check
window["DEFINE"] = DEFINE;

/***/ }),

/***/ "./src/views/index.scss":
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/views/index.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);

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

/***/ "./src/views/index.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__("./src/views/index.scss");

var _react = __webpack_require__("./node_modules/react/index.js");

var React = _interopRequireWildcard(_react);

var _reactDom = __webpack_require__("./node_modules/react-dom/index.js");

var ReactDOM = _interopRequireWildcard(_reactDom);

var _components = __webpack_require__("./src/components/index.ts");

var _tide = __webpack_require__("./src/views/tide/tide.tsx");

var _define = __webpack_require__("./src/services/define.ts");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

console.log((_define.DEFINE.BUILD.IS_PRODUCTION ? "Production" : "Debug") + " | " + _define.DEFINE.BUILD.TIME);

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        // Set initial tab to 0 (TODO: add routing)
        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            selectedTab: 0
        };
        return _this;
    }

    _createClass(App, [{
        key: "render",
        value: function render() {
            var selectedTab = this.state.selectedTab;

            var view = React.createElement(_components.Tabs, null, React.createElement(_components.Tab, null, React.createElement(_components.TabButton, null, React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "30", height: "30", viewBox: "0 0 30 30" }, React.createElement("path", { d: "M15 0.469c-8.027 0-14.531 6.504-14.531 14.531s6.504 14.531 14.531 14.531 14.531-6.504 14.531-14.531-6.504-14.531-14.531-14.531zM15 26.719c-6.475 0-11.719-5.244-11.719-11.719s5.244-11.719 11.719-11.719 11.719 5.244 11.719 11.719-5.244 11.719-11.719 11.719zM18.621 20.602l-4.975-3.615c-0.182-0.135-0.287-0.346-0.287-0.568v-9.621c0-0.387 0.316-0.703 0.703-0.703h1.875c0.387 0 0.703 0.316 0.703 0.703v8.303l3.914 2.848c0.316 0.229 0.381 0.668 0.152 0.984l-1.102 1.518c-0.229 0.311-0.668 0.381-0.984 0.152z" })), React.createElement("span", null, "Tides")), React.createElement(_components.TabView, null, React.createElement(_tide.Tide, null))), React.createElement(_components.Tab, null, React.createElement(_components.TabButton, null, React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "30", height: "30", viewBox: "0 0 30 30" }, React.createElement("path", { d: "M27.188 1.875h-24.375c-1.553 0-2.813 1.259-2.813 2.813v20.625c0 1.553 1.259 2.813 2.813 2.813h24.375c1.553 0 2.813-1.259 2.813-2.813v-20.625c0-1.553-1.259-2.813-2.813-2.813zM13.125 24.375h-9.375v-15h9.375v15zM26.25 24.375h-9.375v-15h9.375v15z" })), React.createElement("span", null, "Charts")), React.createElement(_components.TabView, null, React.createElement("div", null, "Charts"))), React.createElement(_components.Tab, null, React.createElement(_components.TabButton, null, React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "15", height: "30", viewBox: "0 0 15 30" }, React.createElement("path", { d: "M11.25 22.5c0 2.071-1.679 3.75-3.75 3.75s-3.75-1.679-3.75-3.75c0-1.388 0.754-2.599 1.875-3.247v-6.128c0-1.036 0.839-1.875 1.875-1.875s1.875 0.839 1.875 1.875v6.128c1.121 0.649 1.875 1.859 1.875 3.247zM13.125 17.54c1.167 1.322 1.875 3.058 1.875 4.96 0 4.142-3.358 7.5-7.5 7.5-0.018 0-0.036-0-0.053-0-4.119-0.029-7.468-3.42-7.447-7.539 0.010-1.887 0.716-3.608 1.875-4.921v-11.915c0-3.107 2.518-5.625 5.625-5.625s5.625 2.518 5.625 5.625v11.915zM12.188 22.5c0-2.012-1.135-3.058-1.875-3.897v-12.978c0-1.551-1.262-2.813-2.813-2.813s-2.813 1.262-2.813 2.813v12.978c-0.746 0.845-1.865 1.881-1.875 3.872-0.013 2.571 2.084 4.694 4.654 4.712l0.034 0c2.585 0 4.688-2.103 4.688-4.688z" })), React.createElement("span", null, "More")), React.createElement(_components.TabView, null, React.createElement("div", null, "More"))), React.createElement(_components.Tab, null, React.createElement(_components.TabButton, null, React.createElement("svg", { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "38", height: "30", viewBox: "0 0 38 30" }, React.createElement("path", { d: "M30.006 11.191l-0.48 0.838c-0.176 0.311-0.551 0.439-0.885 0.316-0.691-0.258-1.324-0.627-1.881-1.090-0.27-0.223-0.34-0.615-0.164-0.92l0.48-0.838c-0.404-0.469-0.721-1.014-0.932-1.605h-0.967c-0.352 0-0.656-0.252-0.715-0.604-0.117-0.703-0.123-1.441 0-2.174 0.059-0.352 0.363-0.609 0.715-0.609h0.967c0.211-0.592 0.527-1.137 0.932-1.605l-0.48-0.838c-0.176-0.305-0.111-0.697 0.164-0.92 0.557-0.463 1.195-0.832 1.881-1.090 0.334-0.123 0.709 0.006 0.885 0.316l0.48 0.838c0.615-0.111 1.242-0.111 1.857 0l0.48-0.838c0.176-0.311 0.551-0.439 0.885-0.316 0.691 0.258 1.324 0.627 1.881 1.090 0.27 0.223 0.34 0.615 0.164 0.92l-0.48 0.838c0.404 0.469 0.721 1.014 0.932 1.605h0.967c0.352 0 0.656 0.252 0.715 0.604 0.117 0.703 0.123 1.441 0 2.174-0.059 0.352-0.363 0.609-0.715 0.609h-0.967c-0.211 0.592-0.527 1.137-0.932 1.605l0.48 0.838c0.176 0.305 0.111 0.697-0.164 0.92-0.557 0.463-1.195 0.832-1.881 1.090-0.334 0.123-0.709-0.006-0.885-0.316l-0.48-0.838c-0.609 0.111-1.242 0.111-1.857 0zM29.391 7.746c2.256 1.734 4.828-0.838 3.094-3.094-2.256-1.74-4.828 0.838-3.094 3.094zM22.635 16.764l1.975 0.984c0.592 0.34 0.85 1.061 0.615 1.705-0.521 1.418-1.547 2.719-2.496 3.855-0.434 0.521-1.184 0.65-1.775 0.311l-1.705-0.984c-0.938 0.803-2.027 1.441-3.217 1.857v1.969c0 0.68-0.486 1.266-1.154 1.383-1.441 0.246-2.953 0.258-4.447 0-0.674-0.117-1.172-0.697-1.172-1.383v-1.969c-1.189-0.422-2.279-1.055-3.217-1.857l-1.705 0.979c-0.586 0.34-1.342 0.211-1.775-0.311-0.949-1.137-1.951-2.438-2.473-3.85-0.234-0.639 0.023-1.359 0.615-1.705l1.951-0.984c-0.229-1.225-0.229-2.484 0-3.715l-1.951-0.99c-0.592-0.34-0.855-1.061-0.615-1.699 0.521-1.418 1.523-2.719 2.473-3.855 0.434-0.521 1.184-0.65 1.775-0.311l1.705 0.984c0.938-0.803 2.027-1.441 3.217-1.857v-1.975c0-0.674 0.48-1.26 1.148-1.377 1.441-0.246 2.959-0.258 4.453-0.006 0.674 0.117 1.172 0.697 1.172 1.383v1.969c1.189 0.422 2.279 1.055 3.217 1.857l1.705-0.984c0.586-0.34 1.342-0.211 1.775 0.311 0.949 1.137 1.945 2.438 2.467 3.855 0.234 0.639 0.006 1.359-0.586 1.705l-1.975 0.984c0.229 1.23 0.229 2.49 0 3.721zM15.744 18c3.469-4.512-1.682-9.662-6.193-6.193-3.469 4.512 1.682 9.662 6.193 6.193zM30.006 28.705l-0.48 0.838c-0.176 0.311-0.551 0.439-0.885 0.316-0.691-0.258-1.324-0.627-1.881-1.090-0.27-0.223-0.34-0.615-0.164-0.92l0.48-0.838c-0.404-0.469-0.721-1.014-0.932-1.605h-0.967c-0.352 0-0.656-0.252-0.715-0.604-0.117-0.703-0.123-1.441 0-2.174 0.059-0.352 0.363-0.609 0.715-0.609h0.967c0.211-0.592 0.527-1.137 0.932-1.605l-0.48-0.838c-0.176-0.305-0.111-0.697 0.164-0.92 0.557-0.463 1.195-0.832 1.881-1.090 0.334-0.123 0.709 0.006 0.885 0.316l0.48 0.838c0.615-0.111 1.242-0.111 1.857 0l0.48-0.838c0.176-0.311 0.551-0.439 0.885-0.316 0.691 0.258 1.324 0.627 1.881 1.090 0.27 0.223 0.34 0.615 0.164 0.92l-0.48 0.838c0.404 0.469 0.721 1.014 0.932 1.605h0.967c0.352 0 0.656 0.252 0.715 0.604 0.117 0.703 0.123 1.441 0 2.174-0.059 0.352-0.363 0.609-0.715 0.609h-0.967c-0.211 0.592-0.527 1.137-0.932 1.605l0.48 0.838c0.176 0.305 0.111 0.697-0.164 0.92-0.557 0.463-1.195 0.832-1.881 1.090-0.334 0.123-0.709-0.006-0.885-0.316l-0.48-0.838c-0.609 0.111-1.242 0.111-1.857 0zM29.391 25.254c2.256 1.734 4.828-0.838 3.094-3.094-2.256-1.734-4.828 0.838-3.094 3.094z" })), React.createElement("span", null, "Settings")), React.createElement(_components.TabView, null, React.createElement("div", null, "Settings"))));
            return view;
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("react-root"));

/***/ }),

/***/ "./src/views/tide/tide.scss":
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/views/tide/tide.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);

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

/***/ "./src/views/tide/tide.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tide = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/index.js");

var React = _interopRequireWildcard(_react);

__webpack_require__("./src/views/tide/tide.scss");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tide = exports.Tide = function (_React$Component) {
    _inherits(Tide, _React$Component);

    function Tide(props) {
        _classCallCheck(this, Tide);

        var _this = _possibleConstructorReturn(this, (Tide.__proto__ || Object.getPrototypeOf(Tide)).call(this, props));

        _this.state = {};
        return _this;
    }

    _createClass(Tide, [{
        key: "render",
        value: function render() {
            return React.createElement("h1", null, "TIDES");
        }
    }]);

    return Tide;
}(React.Component);

/***/ })

},["./src/views/index.tsx"]);
//# sourceMappingURL=index.519d0fa6e5.js.map