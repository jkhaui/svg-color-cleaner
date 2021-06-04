(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("svg-color-cleaner", [], factory);
	else if(typeof exports === 'object')
		exports["svg-color-cleaner"] = factory();
	else
		root["svg-color-cleaner"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/SVGColorCleaner.js":
/*!********************************!*\
  !*** ./src/SVGColorCleaner.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ SVGColorCleaner
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SVGColorCleaner = function SVGColorCleaner(_ref) {
  var _this = this;

  var _ref$fillColor = _ref.fillColor,
      fillColor = _ref$fillColor === void 0 ? "#000" : _ref$fillColor,
      _ref$strokeColor = _ref.strokeColor,
      strokeColor = _ref$strokeColor === void 0 ? "#000" : _ref$strokeColor;

  _classCallCheck(this, SVGColorCleaner);

  _defineProperty(this, "mutateAttribute", function (newSvg, node) {
    var hasFillAttribute = node.hasAttribute(_this.FILL_ATTRIBUTE) || window.getComputedStyle(node).getPropertyValue(_this.FILL_ATTRIBUTE) !== "none";
    var hasStrokeAttribute = node.hasAttribute(_this.STROKE_ATTRIBUTE) || window.getComputedStyle(node).getPropertyValue(_this.STROKE_ATTRIBUTE) !== "none";

    if (hasFillAttribute) {
      node.removeAttribute(_this.FILL_ATTRIBUTE);
      node.setAttribute("style", "fill: " + _this.FILL_COLOR);
    } // TODO: FInd a way to handle transparent strokes.


    if (hasStrokeAttribute) {
      node.removeAttribute(_this.STROKE_ATTRIBUTE);
      node.setAttribute("style", "stroke: " + _this.STROKE_COLOR);
    }

    newSvg.appendChild(node);
  });

  _defineProperty(this, "copySvgAttributes", function (oldSvg, newSvg) {
    if (oldSvg.hasAttribute(_this.STROKE_ATTRIBUTE)) {
      var _stroke = oldSvg.getAttribute(_this.STROKE_ATTRIBUTE);

      if (_stroke) {
        newSvg.setAttribute(_this.STROKE_ATTRIBUTE, _stroke);
      }
    }

    if (oldSvg.hasAttribute(_this.FILL_ATTRIBUTE)) {
      var _fill = oldSvg.getAttribute(_this.FILL_ATTRIBUTE);

      if (_fill) {
        newSvg.setAttribute(_this.FILL_ATTRIBUTE, _fill);
      }
    }

    if (oldSvg.hasAttribute(_this.WIDTH_ATTRIBUTE)) {
      var _width = oldSvg.getAttribute(_this.WIDTH_ATTRIBUTE);

      if (_width) {
        newSvg.setAttribute(_this.WIDTH_ATTRIBUTE, _width);
      }
    }

    if (oldSvg.hasAttribute(_this.HEIGHT_ATTRIBUTE)) {
      var _height = oldSvg.getAttribute(_this.HEIGHT_ATTRIBUTE);

      if (_height) {
        newSvg.setAttribute(_this.HEIGHT_ATTRIBUTE, _height);
      }
    }

    if (oldSvg.hasAttribute(_this.VIEWBOX_ATTRIBUTE)) {
      var _viewBox = oldSvg.getAttribute(_this.VIEWBOX_ATTRIBUTE);

      if (_viewBox) {
        newSvg.setAttribute(_this.VIEWBOX_ATTRIBUTE, _viewBox);
      }
    }
  });

  _defineProperty(this, "traverseChildren", function (oldSvg, newSvg, node) {
    var nodeType = node.nodeName;

    switch (nodeType) {
      case _this.SVG_NODE:
        _this.copySvgAttributes(oldSvg, newSvg, node);

        break;
      // TODO: do NOT apply styling to rect nodes for now... It appears to
      // ruin the svg.

      case _this.RECT_NODE:
      case _this.TEXT_NODE:
        break;

      case _this.CIRCLE_NODE:
      case _this.PATH_NODE:
        _this.mutateAttribute(newSvg, node);

        break;

      case _this.DEFS_NODE:
      case _this.GLOBAL_NODE:
        // Declare a variable with (what is assumed to be) the low-level SVG
        // element.
        var grandchildNodes = node.childNodes;
        var grandchildrenCollection = grandchildNodes;
        var grandchildrenLength = grandchildNodes.length; // const grandchildNodeType = grandchildNodes.nodeName;
        // const hasGreatGrandChildren =
        //   grandchildNodes.length > 0;
        // const grandchildNodeCount = grandchildNodes.length;

        var i = -1;

        if (++i < grandchildrenLength) {
          do {
            if (grandchildrenCollection[i]) {
              _this.traverseChildren(oldSvg, newSvg, grandchildrenCollection[i]);
            }
          } while (++i < grandchildrenCollection);
        } // First-child nodes, e.g. <g>, <defs>, etc.
        // if (++i < grandchildNodeCount) do {
        //   console.log(grandchildrenCollection[i]);
        //   if (hasGreatGrandChildren) {
        //     // TODO: handle recursive looping through n layers of child
        // nodes. // const greatGrandChild = ... //
        // this.mutateAttribute(greatGrandChild); return; } } while (++i <
        // grandchildNodeCount);


        break;

      case _this.CLIPPATH_NODE:
      case _this.MASK_NODE:
      default:
        // An exception error message is passed back to the caller if any of
        // the above nodes, or otherwise unknown node types, are detected.
        return false;
    }
  });

  _defineProperty(this, "renderVirtualSvg", /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fileData) {
      var parser, vDom, oldSvg, newSvg, childrenCollection, parentLength, i, throwError, mutate, serializer, stringifiedSvg;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // 1. Instantiate a new virtual DOM instance.
              // This creates an empty document node in-memory, with an empty svg element
              // as the single child node.
              parser = new DOMParser();
              vDom = parser.parseFromString(fileData, "image/svg+xml");
              oldSvg = vDom.children[0];
              newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
              childrenCollection = vDom.all; // Cache the length prop to maximise performance.

              parentLength = childrenCollection.length;
              i = -1;
              throwError = false; // 2. Iterate through, and extract, all the low-level SVG elements.

              if (++i < parentLength) {
                do {
                  if (childrenCollection[i]) {
                    mutate = _this.traverseChildren(oldSvg, newSvg, childrenCollection[i]);

                    if ((childrenCollection[i] || {}).nodeName === _this.PATH_NODE && i > 0) {
                      i--;
                    }

                    if (mutate === false) {
                      throwError = true;
                    }
                  }
                } while (++i < parentLength);
              }

              if (!throwError) {
                _context.next = 11;
                break;
              }

              return _context.abrupt("return", Error("Unidentified node type."));

            case 11:
              vDom.removeChild(oldSvg);
              vDom.appendChild(newSvg);
              serializer = new XMLSerializer();
              stringifiedSvg = serializer.serializeToString(vDom); // Returns the cleaned SVG string as a promise, if successful.

              return _context.abrupt("return", stringifiedSvg);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());

  // Define global variables.
  this.FILL_ATTRIBUTE = "fill";
  this.SVG_NODE = "svg"; // Low-level nodes.

  this.PATH_NODE = "path";
  this.RECT_NODE = "rect";
  this.CIRCLE_NODE = "circle";
  this.TEXT_NODE = "#text"; // Wrapper nodes.

  this.GLOBAL_NODE = "g";
  this.MASK_NODE = "mask";
  this.DEFS_NODE = "defs";
  this.CLIPPATH_NODE = "clipPath";
  this.STROKE_ATTRIBUTE = "stroke"; // SVG attributes to be copied onto the virtual SVG.

  this.WIDTH_ATTRIBUTE = "width";
  this.HEIGHT_ATTRIBUTE = "height";
  this.VIEWBOX_ATTRIBUTE = "viewBox";
  this.FILL_COLOR = fillColor;
  this.STROKE_COLOR = strokeColor;
};



/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _SVGColorCleaner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SVGColorCleaner.js */ "./src/SVGColorCleaner.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  SVGColorCleaner: _SVGColorCleaner_js__WEBPACK_IMPORTED_MODULE_0__.default
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.js");
/******/ })()
.default;
});
//# sourceMappingURL=svg-color-cleaner.js.map