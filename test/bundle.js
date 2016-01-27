/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Failure = exports.Success = exports.Try = undefined;

	var _catavolt = __webpack_require__(1);

	Object.defineProperty(exports, 'Try', {
	    enumerable: true,
	    get: function get() {
	        return _catavolt.Try;
	    }
	});
	Object.defineProperty(exports, 'Success', {
	    enumerable: true,
	    get: function get() {
	        return _catavolt.Success;
	    }
	});
	Object.defineProperty(exports, 'Failure', {
	    enumerable: true,
	    get: function get() {
	        return _catavolt.Failure;
	    }
	});

	var SERVICE_PATH = "www.catavolt.net";
	var tenantId = "***REMOVED***z";
	var userId = "sales";
	var password = "***REMOVED***";
	var clientType = "LIMITED_ACCESS";
	describe("Api Usage", function () {
	    beforeEach(function () {
	        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
	    });
	    it("Should run API Examples", function (done) {
	        loginWithAppContext();
	    });
	});
	function loginWithAppContext() {
	    return _catavolt.AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).bind(function (appWinDef) {
	        _catavolt.Log.info('Login Succeeded');
	        _catavolt.Log.info('AppWinDef: ' + _catavolt.Log.formatRecString(appWinDef));
	        _catavolt.Log.info('SessionContext: ' + _catavolt.Log.formatRecString(_catavolt.AppContext.singleton.sessionContextTry.success));
	        _catavolt.Log.info('TenantSettings: ' + _catavolt.Log.formatRecString(_catavolt.AppContext.singleton.tenantSettingsTry.success));
	        return setupWorkbench().bind(function (result) {
	            _catavolt.Log.info('Competed all workbenches.');
	            return null;
	        });
	    });
	}
	function setupWorkbench() {
	    var workbenches = _catavolt.AppContext.singleton.appWinDefTry.success.workbenches;
	    var launchWorkbenchesFuture = _catavolt.Future.createSuccessfulFuture('startSetupWorkbench', null);
	    workbenches.forEach(function (workbench) {
	        _catavolt.Log.info("Examining Workbench: " + workbench.name);
	        //test the first action
	        /*launchWorkbenchesFuture = launchWorkbenchesFuture.bind((lastResult:any)=>{
	         var launchAction = workbench.workbenchLaunchActions[0];
	         Log.info(">>>>> Launching Action: " +  launchAction.name + " Icon: " + launchAction.iconBase);
	         return performLaunchAction(launchAction).map((launchActionResult)=>{
	         Log.info('<<<<< Completed Launch Action ' + launchAction.name);
	         return launchActionResult;
	         });
	         });*/
	        workbench.workbenchLaunchActions.forEach(function (launchAction) {
	            launchWorkbenchesFuture = launchWorkbenchesFuture.bind(function (lastResult) {
	                _catavolt.Log.info(">>>>> Launching Action: " + launchAction.name + " Icon: " + launchAction.iconBase);
	                return performLaunchAction(launchAction).map(function (launchActionResult) {
	                    _catavolt.Log.info('<<<<< Completed Launch Action ' + launchAction.name);
	                    return launchActionResult;
	                });
	            });
	        });
	    });
	    return launchWorkbenchesFuture.map(function (lastLaunchActionResult) {
	        _catavolt.Log.info("");
	        _catavolt.Log.info("Completed all launch Actions");
	        _catavolt.Log.info("");
	    });
	}
	function performLaunchAction(launchAction) {
	    return _catavolt.AppContext.singleton.performLaunchAction(launchAction).bind(function (navRequest) {
	        _catavolt.Log.info("Perform Launch Action " + launchAction.name + ' succeeded. Continuing with NavRequest...');
	        return handleNavRequest(navRequest);
	    });
	}
	function getLaunchActionByName(name, workbenches) {
	    return null;
	}
	function handleNavRequest(navRequest) {
	    if (navRequest instanceof _catavolt.FormContext) {
	        return handleFormContext(navRequest);
	    } else {
	        _catavolt.Log.info('NavRequest in not a FormContext:  ' + navRequest.constructor['name']);
	        return _catavolt.Future.createSuccessfulFuture('handleNavRequest', navRequest);
	    }
	}
	function handleFormContext(formContext) {
	    displayMenus(formContext);
	    var handleContextsFuture = _catavolt.Future.createSuccessfulFuture('startHandleContexts', null);
	    formContext.childrenContexts.forEach(function (context) {
	        _catavolt.Log.info('');
	        _catavolt.Log.info('Got a ' + context.constructor['name'] + ' for display');
	        _catavolt.Log.info('');
	        if (context instanceof _catavolt.ListContext) {
	            handleContextsFuture = handleContextsFuture.bind(function (lastContextResult) {
	                return handleListContext(context);
	            });
	        } else if (context instanceof _catavolt.DetailsContext) {
	            handleContextsFuture = handleContextsFuture.bind(function (lastContextResult) {
	                return handleDetailsContext(context);
	            });
	        } else {
	            _catavolt.Log.info('');
	            _catavolt.Log.info('Not yet handling display for ' + context.constructor['name']);
	            _catavolt.Log.info('');
	            handleContextsFuture = handleContextsFuture.map(function (lastContextResult) {
	                return context;
	            });
	        }
	    });
	    return handleContextsFuture;
	}
	function displayMenus(paneContext) {
	    _catavolt.Log.info('----------Menus>>>-------------------------------');
	    _catavolt.Log.info(_catavolt.ObjUtil.formatRecAttr(paneContext.menuDefs));
	    _catavolt.Log.info('----------<<<Menus-------------------------------');
	    return _catavolt.Future.createSuccessfulFuture('displayMenus', paneContext);
	}
	function handleListContext(listContext) {
	    _catavolt.Log.info('Handling a ListContext... ');
	    listContext.setScroller(10, null, [_catavolt.QueryMarkerOption.None]);
	    var listFuture = listContext.refresh().bind(function (entityRec) {
	        _catavolt.Log.info('Finished refresh');
	        displayMenus(listContext);
	        var columnHeadings = listContext.listDef.activeColumnDefs.map(function (columnDef) {
	            return columnDef.heading;
	        });
	        _catavolt.Log.info(columnHeadings.join('|'));
	        listContext.scroller.buffer.forEach(function (entityRec) {
	            displayListItem(entityRec, listContext);
	        });
	        var scrollResultsFuture = scrollThroughAllResults(listContext).bind(function (scrollResult) {
	            return scrollBackwardThroughAllResults(listContext);
	        });
	        return scrollResultsFuture.bind(function (result) {
	            return handleDefaultActionForListItem(0, listContext);
	        });
	    });
	    listFuture.onFailure(function (failure) {
	        _catavolt.Log.error("ListContext failed to render with " + failure);
	    });
	    return listFuture;
	}
	function scrollThroughAllResults(listContext) {
	    if (listContext.scroller.hasMoreForward) {
	        _catavolt.Log.info('The list has more items to display.  Scrolling forward....');
	        return getNextPageOfResults(listContext).bind(function (prevPageEntityRecs) {
	            return scrollThroughAllResults(listContext);
	        });
	    } else {
	        _catavolt.Log.info('The list has no more items to display.');
	        return _catavolt.Future.createSuccessfulFuture('scrollThroughAllResults', listContext);
	    }
	}
	function scrollBackwardThroughAllResults(listContext) {
	    if (listContext.scroller.hasMoreBackward) {
	        _catavolt.Log.info('The list has previous items to display.  Scrolling backward....');
	        return getPreviousPageOfResults(listContext).bind(function (prevPageEntityRecs) {
	            return scrollBackwardThroughAllResults(listContext);
	        });
	    } else {
	        _catavolt.Log.info('The list has no more previous items to display.');
	        return _catavolt.Future.createSuccessfulFuture('scrollBackwardThroughAllResults', listContext);
	    }
	}
	function getNextPageOfResults(listContext) {
	    return listContext.scroller.pageForward().map(function (entityRecs) {
	        _catavolt.Log.info('Displaying next page of ' + entityRecs.length + ' records.');
	        entityRecs.forEach(function (entityRec) {
	            displayListItem(entityRec, listContext);
	        });
	        return entityRecs;
	    });
	}
	function getPreviousPageOfResults(listContext) {
	    return listContext.scroller.pageBackward().map(function (entityRecs) {
	        _catavolt.Log.info('Displaying previous page of ' + entityRecs.length + ' records.');
	        entityRecs.forEach(function (entityRec) {
	            displayListItem(entityRec, listContext);
	        });
	        return entityRecs;
	    });
	}
	function displayListItem(entityRec, listContext) {
	    var rowValues = listContext.rowValues(entityRec);
	    _catavolt.Log.info(rowValues.join('|'));
	}
	function handleDefaultActionForListItem(index, listContext) {
	    if (!listContext.listDef.defaultActionId) {
	        return _catavolt.Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
	    }
	    var defaultActionMenuDef = new _catavolt.MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW', listContext.listDef.defaultActionId, null, null, []);
	    var entityRecs = listContext.scroller.buffer;
	    if (entityRecs.length === 0) return _catavolt.Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
	    if (entityRecs.length > index) {
	        var entityRec = entityRecs[index];
	        _catavolt.Log.info('--------------------------------------------------------------');
	        _catavolt.Log.info('Invoking default action on list item ' + entityRec.objectId);
	        _catavolt.Log.info('--------------------------------------------------------------');
	        var targets = [entityRec.objectId];
	        return listContext.performMenuAction(defaultActionMenuDef, targets).bind(function (navRequest) {
	            return handleNavRequest(navRequest);
	        });
	    } else {
	        return _catavolt.Future.createFailedFuture('handleDefaultActionForListItem', 'Invalid index for listContext');
	    }
	}
	function handleDetailsContext(detailsContext) {
	    _catavolt.Log.info('Handling Details Context...');
	    return detailsContext.read().bind(function (entityRec) {
	        return layoutDetailsPane(detailsContext).map(function (renderedDetailRows) {
	            renderedDetailRows.forEach(function (row) {
	                _catavolt.Log.info('Detail Row: ' + row);
	            });
	            return renderedDetailRows;
	        });
	    });
	}
	function layoutDetailsPane(detailsContext) {
	    var allDefsComplete = _catavolt.Future.createSuccessfulFuture('layoutDetailsPaneStart', '');
	    var renderedDetailRows = [];
	    detailsContext.detailsDef.rows.forEach(function (cellDefRow) {
	        if (isValidDetailsDefRow(cellDefRow)) {
	            if (isSectionTitleDef(cellDefRow)) {
	                allDefsComplete = allDefsComplete.map(function (lastRowResult) {
	                    var titleRow = createTitleRow(cellDefRow);
	                    renderedDetailRows.push(titleRow);
	                    return titleRow;
	                });
	            } else {
	                allDefsComplete = allDefsComplete.bind(function (lastRowResult) {
	                    return createEditorRow(cellDefRow, detailsContext).map(function (editorRow) {
	                        renderedDetailRows.push(editorRow);
	                        return editorRow;
	                    });
	                });
	            }
	        } else {
	            _catavolt.Log.info('Detail row is invalid ' + _catavolt.ObjUtil.formatRecAttr(cellDefRow));
	        }
	    });
	    return allDefsComplete.map(function (lastRowResult) {
	        return renderedDetailRows;
	    });
	}
	function isValidDetailsDefRow(row) {
	    return row.length === 2 && row[0].values.length === 1 && row[1].values.length === 1 && (row[0].values[0] instanceof _catavolt.LabelCellValueDef || row[1].values[0] instanceof _catavolt.ForcedLineCellValueDef) && (row[1].values[0] instanceof _catavolt.AttributeCellValueDef || row[1].values[0] instanceof _catavolt.LabelCellValueDef || row[1].values[0] instanceof _catavolt.ForcedLineCellValueDef);
	}
	function isSectionTitleDef(row) {
	    return row[0].values[0] instanceof _catavolt.LabelCellValueDef && row[1].values[0] instanceof _catavolt.LabelCellValueDef;
	}
	function createTitleRow(row) {
	    return '<Label>' + row[0].values[0] + '</Label> : <Label>' + row[1].values[0] + '</Label>';
	}
	function createEditorRow(row, detailsContext) {
	    var labelDef = row[0].values[0];
	    var label;
	    if (labelDef instanceof _catavolt.LabelCellValueDef) {
	        label = '<Label>' + labelDef.value + '</Label>';
	    } else {
	        label = '<Label>N/A</Label>';
	    }
	    var valueDef = row[1].values[0];
	    if (valueDef instanceof _catavolt.AttributeCellValueDef && !detailsContext.isReadModeFor(valueDef.propertyName)) {
	        return createEditorControl(valueDef, detailsContext).map(function (editorCellString) {
	            return label + editorCellString;
	        });
	    } else if (valueDef instanceof _catavolt.AttributeCellValueDef) {
	        var value = "";
	        var prop = detailsContext.buffer.propAtName(valueDef.propertyName);
	        if (prop && detailsContext.isBinary(valueDef)) {
	            value = "<Binary name='" + valueDef.propertyName + "'/>";
	        } else if (prop) {
	            value = '<Label>' + detailsContext.formatForRead(prop.value, prop.name) + '</Label>';
	        }
	        return _catavolt.Future.createSuccessfulFuture('createEditorRow', label + ' : ' + value);
	    } else if (valueDef instanceof _catavolt.LabelCellValueDef) {
	        return _catavolt.Future.createSuccessfulFuture('createEditorRow', label + ' : <Label>' + valueDef.value + '</Label>');
	    } else {
	        _catavolt.Future.createSuccessfulFuture('createEditorRow', label + " : ");
	    }
	}
	function createEditorControl(attributeDef, detailsContext) {
	    if (attributeDef.isComboBoxEntryMethod) {
	        return detailsContext.getAvailableValues(attributeDef.propertyName).map(function (values) {
	            return '<ComboBox>' + values.join(", ") + '</ComboBox>';
	        });
	    } else if (attributeDef.isDropDownEntryMethod) {
	        return detailsContext.getAvailableValues(attributeDef.propertyName).map(function (values) {
	            return '<DropDown>' + values.join(", ") + '</DropDown>';
	        });
	    } else {
	        var entityRec = detailsContext.buffer;
	        var prop = entityRec.propAtName(attributeDef.propertyName);
	        if (prop && detailsContext.isBinary(attributeDef)) {
	            return _catavolt.Future.createSuccessfulFuture('createEditorControl', "<Binary name='" + prop.name + "' mode='WRITE'/>");
	        } else {
	            var value = prop ? detailsContext.formatForWrite(prop.value, prop.name) : "";
	            return _catavolt.Future.createSuccessfulFuture('createEditorControl', '<TextField>' + value + '</TextField>');
	        }
	    }
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _util = __webpack_require__(2);

	var _loop = function _loop(_key5) {
	  if (_key5 === "default") return 'continue';
	  Object.defineProperty(exports, _key5, {
	    enumerable: true,
	    get: function get() {
	      return _util[_key5];
	    }
	  });
	};

	for (var _key5 in _util) {
	  var _ret = _loop(_key5);

	  if (_ret === 'continue') continue;
	}

	var _fp = __webpack_require__(3);

	var _loop2 = function _loop2(_key6) {
	  if (_key6 === "default") return 'continue';
	  Object.defineProperty(exports, _key6, {
	    enumerable: true,
	    get: function get() {
	      return _fp[_key6];
	    }
	  });
	};

	for (var _key6 in _fp) {
	  var _ret2 = _loop2(_key6);

	  if (_ret2 === 'continue') continue;
	}

	var _ws = __webpack_require__(4);

	var _loop3 = function _loop3(_key7) {
	  if (_key7 === "default") return 'continue';
	  Object.defineProperty(exports, _key7, {
	    enumerable: true,
	    get: function get() {
	      return _ws[_key7];
	    }
	  });
	};

	for (var _key7 in _ws) {
	  var _ret3 = _loop3(_key7);

	  if (_ret3 === 'continue') continue;
	}

	var _dialog = __webpack_require__(5);

	var _loop4 = function _loop4(_key8) {
	  if (_key8 === "default") return 'continue';
	  Object.defineProperty(exports, _key8, {
	    enumerable: true,
	    get: function get() {
	      return _dialog[_key8];
	    }
	  });
	};

	for (var _key8 in _dialog) {
	  var _ret4 = _loop4(_key8);

	  if (_ret4 === 'continue') continue;
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by rburson on 3/6/15.
	 */

	var ArrayUtil = exports.ArrayUtil = function () {
	    function ArrayUtil() {
	        _classCallCheck(this, ArrayUtil);
	    }

	    _createClass(ArrayUtil, null, [{
	        key: "copy",
	        value: function copy(source) {
	            return source.map(function (e) {
	                return e;
	            });
	        }
	    }, {
	        key: "find",
	        value: function find(source, f) {
	            var value = null;
	            source.some(function (v) {
	                if (f(v)) {
	                    value = v;
	                    return true;
	                }
	                return false;
	            });
	            return value;
	        }
	    }]);

	    return ArrayUtil;
	}();
	/**
	 * *****************************************************
	 */
	/*
	 This implementation supports our ECMA 5.1 browser set, including IE9
	 If we no longer need to support IE9, a TypedArray implementaion would be more efficient...
	 */

	var Base64 = exports.Base64 = function () {
	    function Base64() {
	        _classCallCheck(this, Base64);
	    }

	    _createClass(Base64, null, [{
	        key: "encode",
	        value: function encode(input) {
	            var output = "";
	            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	            var i = 0;
	            input = Base64._utf8_encode(input);
	            while (i < input.length) {
	                chr1 = input.charCodeAt(i++);
	                chr2 = input.charCodeAt(i++);
	                chr3 = input.charCodeAt(i++);
	                enc1 = chr1 >> 2;
	                enc2 = (chr1 & 3) << 4 | chr2 >> 4;
	                enc3 = (chr2 & 15) << 2 | chr3 >> 6;
	                enc4 = chr3 & 63;
	                if (isNaN(chr2)) {
	                    enc3 = enc4 = 64;
	                } else if (isNaN(chr3)) {
	                    enc4 = 64;
	                }
	                output = output + Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) + Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
	            }
	            return output;
	        }
	    }, {
	        key: "decode",
	        value: function decode(input) {
	            var output = "";
	            var chr1, chr2, chr3;
	            var enc1, enc2, enc3, enc4;
	            var i = 0;
	            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	            while (i < input.length) {
	                enc1 = Base64._keyStr.indexOf(input.charAt(i++));
	                enc2 = Base64._keyStr.indexOf(input.charAt(i++));
	                enc3 = Base64._keyStr.indexOf(input.charAt(i++));
	                enc4 = Base64._keyStr.indexOf(input.charAt(i++));
	                chr1 = enc1 << 2 | enc2 >> 4;
	                chr2 = (enc2 & 15) << 4 | enc3 >> 2;
	                chr3 = (enc3 & 3) << 6 | enc4;
	                output = output + String.fromCharCode(chr1);
	                if (enc3 != 64) {
	                    output = output + String.fromCharCode(chr2);
	                }
	                if (enc4 != 64) {
	                    output = output + String.fromCharCode(chr3);
	                }
	            }
	            output = Base64._utf8_decode(output);
	            return output;
	        }
	    }, {
	        key: "_utf8_encode",
	        value: function _utf8_encode(s) {
	            s = s.replace(/\r\n/g, "\n");
	            var utftext = "";
	            for (var n = 0; n < s.length; n++) {
	                var c = s.charCodeAt(n);
	                if (c < 128) {
	                    utftext += String.fromCharCode(c);
	                } else if (c > 127 && c < 2048) {
	                    utftext += String.fromCharCode(c >> 6 | 192);
	                    utftext += String.fromCharCode(c & 63 | 128);
	                } else {
	                    utftext += String.fromCharCode(c >> 12 | 224);
	                    utftext += String.fromCharCode(c >> 6 & 63 | 128);
	                    utftext += String.fromCharCode(c & 63 | 128);
	                }
	            }
	            return utftext;
	        }
	    }, {
	        key: "_utf8_decode",
	        value: function _utf8_decode(utftext) {
	            var s = "";
	            var i = 0;
	            var c = 0,
	                c1 = 0,
	                c2 = 0,
	                c3 = 0;
	            while (i < utftext.length) {
	                c = utftext.charCodeAt(i);
	                if (c < 128) {
	                    s += String.fromCharCode(c);
	                    i++;
	                } else if (c > 191 && c < 224) {
	                    c2 = utftext.charCodeAt(i + 1);
	                    s += String.fromCharCode((c & 31) << 6 | c2 & 63);
	                    i += 2;
	                } else {
	                    c2 = utftext.charCodeAt(i + 1);
	                    c3 = utftext.charCodeAt(i + 2);
	                    s += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
	                    i += 3;
	                }
	            }
	            return s;
	        }
	    }]);

	    return Base64;
	}();

	Base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	/**
	 * *****************************************************
	 */
	var LogLevel = exports.LogLevel = undefined;
	(function (LogLevel) {
	    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
	    LogLevel[LogLevel["WARN"] = 1] = "WARN";
	    LogLevel[LogLevel["INFO"] = 2] = "INFO";
	    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
	})(LogLevel || (exports.LogLevel = LogLevel = {}));

	var Log = exports.Log = function () {
	    function Log() {
	        _classCallCheck(this, Log);
	    }

	    _createClass(Log, null, [{
	        key: "logLevel",
	        value: function logLevel(level) {
	            if (level >= LogLevel.DEBUG) {
	                Log.debug = function (message, method, clz) {
	                    Log.log(function (o) {
	                        console.info(o);
	                    }, 'DEBUG: ' + message, method, clz);
	                };
	            } else {
	                Log.debug = function (message, method, clz) {};
	            }
	            if (level >= LogLevel.INFO) {
	                Log.info = function (message, method, clz) {
	                    Log.log(function (o) {
	                        console.info(o);
	                    }, 'INFO: ' + message, method, clz);
	                };
	            } else {
	                Log.info = function (message, method, clz) {};
	            }
	            if (level >= LogLevel.WARN) {
	                Log.error = function (message, clz, method) {
	                    Log.log(function (o) {
	                        console.error(o);
	                    }, 'ERROR: ' + message, method, clz);
	                };
	            } else {
	                Log.error = function (message, clz, method) {};
	            }
	            if (level >= LogLevel.ERROR) {
	                Log.warn = function (message, clz, method) {
	                    Log.log(function (o) {
	                        console.info(o);
	                    }, 'WARN: ' + message, method, clz);
	                };
	            } else {
	                Log.warn = function (message, clz, method) {};
	            }
	        }
	    }, {
	        key: "log",
	        value: function log(logger, message, method, clz) {
	            var m = typeof message !== 'string' ? Log.formatRecString(message) : message;
	            if (clz || method) {
	                logger(clz + "::" + method + " : " + m);
	            } else {
	                logger(m);
	            }
	        }
	    }, {
	        key: "formatRecString",
	        value: function formatRecString(o) {
	            return ObjUtil.formatRecAttr(o);
	        }
	    }]);

	    return Log;
	}();
	//set default log level here

	Log.init = Log.logLevel(LogLevel.INFO);
	/**
	 * *****************************************************
	 */

	var ObjUtil = exports.ObjUtil = function () {
	    function ObjUtil() {
	        _classCallCheck(this, ObjUtil);
	    }

	    _createClass(ObjUtil, null, [{
	        key: "addAllProps",
	        value: function addAllProps(sourceObj, targetObj) {
	            if (null == sourceObj || "object" != (typeof sourceObj === "undefined" ? "undefined" : _typeof(sourceObj))) return targetObj;
	            if (null == targetObj || "object" != (typeof targetObj === "undefined" ? "undefined" : _typeof(targetObj))) return targetObj;
	            for (var attr in sourceObj) {
	                targetObj[attr] = sourceObj[attr];
	            }
	            return targetObj;
	        }
	    }, {
	        key: "cloneOwnProps",
	        value: function cloneOwnProps(sourceObj) {
	            if (null == sourceObj || "object" != (typeof sourceObj === "undefined" ? "undefined" : _typeof(sourceObj))) return sourceObj;
	            var copy = sourceObj.constructor();
	            for (var attr in sourceObj) {
	                if (sourceObj.hasOwnProperty(attr)) {
	                    copy[attr] = ObjUtil.cloneOwnProps(sourceObj[attr]);
	                }
	            }
	            return copy;
	        }
	    }, {
	        key: "copyNonNullFieldsOnly",
	        value: function copyNonNullFieldsOnly(obj, newObj, filterFn) {
	            for (var prop in obj) {
	                if (!filterFn || filterFn(prop)) {
	                    var type = _typeof(obj[prop]);
	                    if (type !== 'function') {
	                        var val = obj[prop];
	                        if (val) {
	                            newObj[prop] = val;
	                        }
	                    }
	                }
	            }
	            return newObj;
	        }
	    }, {
	        key: "formatRecAttr",
	        value: function formatRecAttr(o) {
	            //@TODO - add a filter here to build a cache and detect (and skip) circular references
	            return JSON.stringify(o);
	        }
	    }, {
	        key: "newInstance",
	        value: function newInstance(type) {
	            return new type();
	        }
	    }]);

	    return ObjUtil;
	}();
	/**
	 * *****************************************************
	 */

	var StringUtil = exports.StringUtil = function () {
	    function StringUtil() {
	        _classCallCheck(this, StringUtil);
	    }

	    _createClass(StringUtil, null, [{
	        key: "splitSimpleKeyValuePair",
	        value: function splitSimpleKeyValuePair(pairString) {
	            var pair = pairString.split(':');
	            var code = pair[0];
	            var desc = pair.length > 1 ? pair[1] : '';
	            return [code, desc];
	        }
	    }]);

	    return StringUtil;
	}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Promise = exports.Future = exports.Either = exports.Success = exports.Failure = exports.Try = undefined;

	var _util = __webpack_require__(2);

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	  IMPORTANT!
	  Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
	  Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
	 */
	/**
	 * Created by rburson on 3/16/15.
	 */

	var Try = exports.Try = function () {
	    function Try() {
	        _classCallCheck(this, Try);
	    }

	    _createClass(Try, [{
	        key: "bind",
	        value: function bind(f) {
	            return this.isFailure ? new Failure(this.failure) : f(this.success);
	        }
	    }, {
	        key: "map",
	        value: function map(f) {
	            return this.isFailure ? new Failure(this.failure) : new Success(f(this.success));
	        }
	    }, {
	        key: "failure",
	        get: function get() {
	            return null;
	        }
	    }, {
	        key: "isFailure",
	        get: function get() {
	            return false;
	        }
	    }, {
	        key: "isSuccess",
	        get: function get() {
	            return false;
	        }
	    }, {
	        key: "success",
	        get: function get() {
	            return null;
	        }
	    }], [{
	        key: "flatten",
	        value: function flatten(tryList) {
	            var successes = [];
	            var failures = [];
	            tryList.forEach(function (t) {
	                if (t.isFailure) {
	                    failures.push(t.failure);
	                } else {
	                    if (Array.isArray(t.success) && Try.isListOfTry(t.success)) {
	                        var flattened = Try.flatten(t.success);
	                        if (flattened.isFailure) {
	                            failures.push(flattened.failure);
	                        } else {
	                            successes.push(flattened.success);
	                        }
	                    } else {
	                        successes.push(t.success);
	                    }
	                }
	            });
	            if (failures.length > 0) {
	                return new Failure(failures);
	            } else {
	                return new Success(successes);
	            }
	        }
	    }, {
	        key: "isListOfTry",
	        value: function isListOfTry(list) {
	            return list.every(function (value) {
	                return value instanceof Try;
	            });
	        }
	    }]);

	    return Try;
	}();

	var Failure = exports.Failure = function (_Try) {
	    _inherits(Failure, _Try);

	    function Failure(_error) {
	        _classCallCheck(this, Failure);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Failure).call(this));

	        _this._error = _error;
	        return _this;
	    }

	    _createClass(Failure, [{
	        key: "failure",
	        get: function get() {
	            return this._error;
	        }
	    }, {
	        key: "isFailure",
	        get: function get() {
	            return true;
	        }
	    }]);

	    return Failure;
	}(Try);

	var Success = exports.Success = function (_Try2) {
	    _inherits(Success, _Try2);

	    function Success(_value) {
	        _classCallCheck(this, Success);

	        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Success).call(this));

	        _this2._value = _value;
	        return _this2;
	    }

	    _createClass(Success, [{
	        key: "isSuccess",
	        get: function get() {
	            return true;
	        }
	    }, {
	        key: "success",
	        get: function get() {
	            return this._value;
	        }
	    }]);

	    return Success;
	}(Try);
	/**
	 * Created by rburson on 3/5/15.
	 */

	var Either = function () {
	    function Either() {
	        _classCallCheck(this, Either);
	    }

	    _createClass(Either, [{
	        key: "isLeft",
	        get: function get() {
	            return !!this._left;
	        }
	    }, {
	        key: "isRight",
	        get: function get() {
	            return !!this._right;
	        }
	    }, {
	        key: "left",
	        get: function get() {
	            return this._left;
	        }
	    }, {
	        key: "right",
	        get: function get() {
	            return this._right;
	        }
	    }], [{
	        key: "left",
	        value: function left(_left) {
	            var either = new Either();
	            either._left = _left;
	            return either;
	        }
	    }, {
	        key: "right",
	        value: function right(_right) {
	            var either = new Either();
	            either._right = _right;
	            return either;
	        }
	    }]);

	    return Either;
	}();

	exports.Either = Either;

	var Future = exports.Future = function () {
	    /** --------------------- CONSTRUCTORS ------------------------------*/

	    function Future(_label) {
	        _classCallCheck(this, Future);

	        this._label = _label;
	        this._completionListeners = new Array();
	    }
	    /** --------------------- PUBLIC STATIC ------------------------------*/

	    _createClass(Future, [{
	        key: "bind",

	        /** --------------------- PUBLIC ------------------------------*/
	        value: function bind(f) {
	            var p = new Promise('Future.bind:' + this._label);
	            this.onComplete(function (t1) {
	                if (t1.isFailure) {
	                    p.failure(t1.failure);
	                } else {
	                    var a = t1.success;
	                    try {
	                        var mb = f(a);
	                        mb.onComplete(function (t2) {
	                            p.complete(t2);
	                        });
	                    } catch (error) {
	                        p.complete(new Failure(error));
	                    }
	                }
	            });
	            return p.future;
	        }
	    }, {
	        key: "map",
	        value: function map(f) {
	            var p = new Promise('Future.map:' + this._label);
	            this.onComplete(function (t1) {
	                if (t1.isFailure) {
	                    p.failure(t1.failure);
	                } else {
	                    var a = t1.success;
	                    try {
	                        var b = f(a);
	                        p.success(b);
	                    } catch (error) {
	                        p.complete(new Failure(error));
	                    }
	                }
	            });
	            return p.future;
	        }
	    }, {
	        key: "onComplete",
	        value: function onComplete(listener) {
	            this._result ? listener(this._result) : this._completionListeners.push(listener);
	        }
	    }, {
	        key: "onFailure",
	        value: function onFailure(listener) {
	            this.onComplete(function (t) {
	                t.isFailure && listener(t.failure);
	            });
	        }
	    }, {
	        key: "onSuccess",
	        value: function onSuccess(listener) {
	            this.onComplete(function (t) {
	                t.isSuccess && listener(t.success);
	            });
	        }
	    }, {
	        key: "complete",

	        /** --------------------- MODULE ------------------------------*/
	        //*** let's pretend this has module level visibility
	        value: function complete(t) {
	            var _this3 = this;

	            var notifyList = new Array();
	            //Log.debug("complete() called on Future " + this._label + ' there are ' + this._completionListeners.length + " listeners.");
	            if (t) {
	                if (!this._result) {
	                    this._result = t;
	                    /* capture the listener set to prevent missing a notification */
	                    notifyList = _util.ArrayUtil.copy(this._completionListeners);
	                } else {
	                    _util.Log.error("Future::complete() : Future " + this._label + " has already been completed");
	                }
	                notifyList.forEach(function (listener) {
	                    try {
	                        listener(_this3._result);
	                    } catch (error) {
	                        _util.Log.error("CompletionListener failed with " + error);
	                    }
	                });
	            } else {
	                _util.Log.error("Future::complete() : Can't complete Future with null result");
	            }
	            return this;
	        }
	    }, {
	        key: "failure",
	        get: function get() {
	            return this._result ? this._result.failure : null;
	        }
	    }, {
	        key: "isComplete",
	        get: function get() {
	            return !!this._result;
	        }
	    }, {
	        key: "isCompleteWithFailure",
	        get: function get() {
	            return !!this._result && this._result.isFailure;
	        }
	    }, {
	        key: "isCompleteWithSuccess",
	        get: function get() {
	            return !!this._result && this._result.isSuccess;
	        }
	    }, {
	        key: "result",
	        get: function get() {
	            return this._result;
	        }
	    }, {
	        key: "success",
	        get: function get() {
	            return this._result ? this.result.success : null;
	        }
	    }], [{
	        key: "createCompletedFuture",
	        value: function createCompletedFuture(label, result) {
	            var f = new Future(label);
	            return f.complete(result);
	        }
	    }, {
	        key: "createSuccessfulFuture",
	        value: function createSuccessfulFuture(label, value) {
	            return Future.createCompletedFuture(label, new Success(value));
	        }
	    }, {
	        key: "createFailedFuture",
	        value: function createFailedFuture(label, error) {
	            return Future.createCompletedFuture(label, new Failure(error));
	        }
	    }, {
	        key: "createFuture",
	        value: function createFuture(label) {
	            var f = new Future(label);
	            return f;
	        }
	    }, {
	        key: "sequence",
	        value: function sequence(seqOfFutures) {
	            var start = Future.createSuccessfulFuture('Future::sequence/start', []);
	            return seqOfFutures.reduce(function (seqFr, nextFr) {
	                return seqFr.bind(function (seq) {
	                    var pr = new Promise('Future::sequence/nextFr');
	                    nextFr.onComplete(function (t) {
	                        seq.push(t);
	                        pr.complete(new Success(seq));
	                    });
	                    return pr.future;
	                });
	            }, start);
	        }
	    }]);

	    return Future;
	}();
	/**
	 * Created by rburson on 3/6/15.
	 */

	var Promise = exports.Promise = function () {
	    function Promise(label) {
	        _classCallCheck(this, Promise);

	        this._future = Future.createFuture(label);
	    }
	    /** --------------------- PUBLIC ------------------------------*/

	    _createClass(Promise, [{
	        key: "isComplete",
	        value: function isComplete() {
	            return this._future.isComplete;
	        }
	    }, {
	        key: "complete",
	        value: function complete(t) {
	            //Log.debug('Promise calling complete on Future...');
	            this._future.complete(t);
	            return this;
	        }
	    }, {
	        key: "failure",
	        value: function failure(error) {
	            this.complete(new Failure(error));
	        }
	    }, {
	        key: "success",
	        value: function success(value) {
	            this.complete(new Success(value));
	        }
	    }, {
	        key: "future",
	        get: function get() {
	            return this._future;
	        }
	    }]);

	    return Promise;
	}();

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Get = exports.Call = exports.XMLHttpClient = undefined;

	var _fp = __webpack_require__(3);

	var _util = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var XMLHttpClient = exports.XMLHttpClient = function () {
	    function XMLHttpClient() {
	        _classCallCheck(this, XMLHttpClient);
	    }

	    _createClass(XMLHttpClient, [{
	        key: "jsonGet",
	        value: function jsonGet(targetUrl, timeoutMillis) {
	            return this.jsonCall(targetUrl, null, 'GET', timeoutMillis);
	        }
	    }, {
	        key: "jsonPost",
	        value: function jsonPost(targetUrl, jsonObj, timeoutMillis) {
	            return this.jsonCall(targetUrl, jsonObj, 'POST', timeoutMillis);
	        }
	    }, {
	        key: "jsonCall",
	        value: function jsonCall(targetUrl, jsonObj) {
	            var method = arguments.length <= 2 || arguments[2] === undefined ? 'GET' : arguments[2];
	            var timeoutMillis = arguments.length <= 3 || arguments[3] === undefined ? 30000 : arguments[3];

	            var body = jsonObj && JSON.stringify(jsonObj);
	            //var promise = new Promise<StringDictionary>("XMLHttpClient::jsonCall");
	            var promise = new _fp.Promise("XMLHttpClient::" + targetUrl + ":" + body);
	            if (method !== 'GET' && method !== 'POST') {
	                promise.failure(method + " method not supported.");
	                return promise.future;
	            }
	            var successCallback = function successCallback(request) {
	                try {
	                    _util.Log.debug("XMLHttpClient: Got successful response: " + request.responseText);
	                    var responseObj = JSON.parse(request.responseText);
	                    promise.success(responseObj);
	                } catch (error) {
	                    promise.failure("XMLHttpClient::jsonCall: Failed to parse response: " + request.responseText);
	                }
	            };
	            var errorCallback = function errorCallback(request) {
	                _util.Log.error('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
	                promise.failure('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
	            };
	            var timeoutCallback = function timeoutCallback() {
	                if (promise.isComplete()) {
	                    _util.Log.error('XMLHttpClient::jsonCall: Timeoutreceived but Promise was already complete.');
	                } else {
	                    _util.Log.error('XMLHttpClient::jsonCall: Timeoutreceived.');
	                    promise.failure('XMLHttpClient::jsonCall: Call timed out');
	                }
	            };
	            var wRequestTimer = null;
	            var xmlHttpRequest = new XMLHttpRequest();
	            xmlHttpRequest.onreadystatechange = function () {
	                if (xmlHttpRequest.readyState === 4) {
	                    if (wRequestTimer) {
	                        clearTimeout(wRequestTimer);
	                    }
	                    if (xmlHttpRequest.status !== 200 && xmlHttpRequest.status !== 304) {
	                        if (errorCallback) {
	                            errorCallback(xmlHttpRequest);
	                        }
	                    } else {
	                        successCallback(xmlHttpRequest);
	                    }
	                }
	            };
	            if (timeoutMillis) {
	                //check for timeout support on the xmlHttpRequest itself
	                if (typeof xmlHttpRequest.ontimeout !== "undefined") {
	                    xmlHttpRequest.timeout = timeoutMillis;
	                    xmlHttpRequest.ontimeout = timeoutCallback;
	                } else {
	                    wRequestTimer = setTimeout(timeoutCallback, timeoutMillis);
	                }
	            }
	            _util.Log.debug("XmlHttpClient: Calling: " + targetUrl);
	            _util.Log.debug("XmlHttpClient: body: " + body);
	            xmlHttpRequest.open(method, targetUrl, true);
	            if (method === 'POST') {
	                xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	                xmlHttpRequest.send(body);
	            } else {
	                xmlHttpRequest.send();
	            }
	            return promise.future;
	        }
	    }]);

	    return XMLHttpClient;
	}();

	var Call = exports.Call = function () {
	    function Call(service, method, params, systemContext, sessionContext) {
	        _classCallCheck(this, Call);

	        this._client = new XMLHttpClient();
	        this._performed = false;
	        this._cancelled = false;
	        this._systemContext = systemContext;
	        this._sessionContext = sessionContext;
	        this._service = service;
	        this._method = method;
	        this._params = params;
	        this._callId = Call.nextCallId();
	        this._responseHeaders = null;
	        this.timeoutMillis = 30000;
	    }

	    _createClass(Call, [{
	        key: "cancel",
	        value: function cancel() {
	            _util.Log.error("Needs implementation", "Call", "cancel");
	        }
	    }, {
	        key: "perform",
	        value: function perform() {
	            if (this._performed) {
	                return _fp.Future.createFailedFuture("Call::perform", "Call:perform(): Call is already performed");
	            }
	            this._performed = true;
	            if (!this._systemContext) {
	                return _fp.Future.createFailedFuture("Call::perform", "Call:perform(): SystemContext cannot be null");
	            }
	            var jsonObj = {
	                id: this._callId,
	                method: this._method,
	                params: this._params
	            };
	            var pathPrefix = "";
	            if (this._systemContext && this._systemContext.urlString) {
	                pathPrefix = this._systemContext.urlString;
	                if (pathPrefix.charAt(pathPrefix.length - 1) !== '/') {
	                    pathPrefix += '/';
	                }
	            }
	            var servicePath = pathPrefix + (this._service || "");
	            return this._client.jsonPost(servicePath, jsonObj, this.timeoutMillis);
	        }
	    }], [{
	        key: "nextCallId",
	        value: function nextCallId() {
	            return ++Call._lastCallId;
	        }
	    }, {
	        key: "createCall",
	        value: function createCall(service, method, params, sessionContext) {
	            return new Call(service, method, params, sessionContext.systemContext, sessionContext);
	        }
	    }, {
	        key: "createCallWithoutSession",
	        value: function createCallWithoutSession(service, method, params, systemContext) {
	            return new Call(service, method, params, systemContext, null);
	        }
	    }]);

	    return Call;
	}();

	Call._lastCallId = 0;

	var Get = exports.Get = function () {
	    function Get(url) {
	        _classCallCheck(this, Get);

	        this._client = new XMLHttpClient();
	        this._url = url;
	        this._performed = false;
	        this._promise = new _fp.Promise("catavolt.ws.Get");
	        this.timeoutMillis = 30000;
	    }

	    _createClass(Get, [{
	        key: "cancel",
	        value: function cancel() {
	            _util.Log.error("Needs implementation", "Get", "cancel");
	        }
	    }, {
	        key: "perform",
	        value: function perform() {
	            if (this._performed) {
	                return this.complete(new _fp.Failure("Get:perform(): Get is already performed")).future;
	            }
	            this._performed = true;
	            return this._client.jsonGet(this._url, this.timeoutMillis);
	        }
	    }, {
	        key: "complete",
	        value: function complete(t) {
	            if (!this._promise.isComplete()) {
	                this._promise.complete(t);
	            }
	            return this._promise;
	        }
	    }], [{
	        key: "fromUrl",
	        value: function fromUrl(url) {
	            return new Get(url);
	        }
	    }]);

	    return Get;
	}();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();Object.defineProperty(exports,"__esModule",{value:true});exports.OType=exports.XWriteResult=exports.XReadResult=exports.XReadPropertyResult=exports.XQueryResult=exports.XPropertyChangeResult=exports.XPaneDefRef=exports.XOpenQueryModelResult=exports.XOpenEditorModelResult=exports.XMapDef=exports.XListDef=exports.XImagePickerDef=exports.XGraphDef=exports.XGetSessionListPropertyResult=exports.XGetAvailableValuesResult=exports.XGetActiveColumnDefsResult=exports.XGeoLocationDef=exports.XGeoFixDef=exports.XFormModel=exports.XFormModelComp=exports.XFormDef=exports.XDetailsDef=exports.XChangePaneModeResult=exports.XCalendarDef=exports.XBarcodeScanDef=exports.XPaneDef=exports.Workbench=exports.WorkbenchService=exports.WorkbenchLaunchAction=exports.SystemContextImpl=exports.SortPropDef=exports.SessionService=exports.SessionContextImpl=exports.QueryScroller=exports.QueryMarkerOption=exports.IsEmptyQueryMarker=exports.HasMoreQueryMarker=exports.QueryResult=exports.Prop=exports.PropFormatter=exports.PropDef=exports.PaneMode=exports.ObjectRef=exports.NullNavRequest=exports.NavRequestUtil=exports.MenuDef=exports.GraphDataPointDef=exports.GeoLocation=exports.GeoFix=exports.GatewayService=exports.FormContextBuilder=exports.EntityRecDef=exports.DialogTriple=exports.DialogService=exports.DialogHandle=exports.DataAnno=exports.ContextAction=exports.ColumnDef=exports.CodeRef=exports.CellDef=exports.AppWinDef=exports.AppContext=exports.NullEntityRec=exports.EntityRecImpl=exports.EntityBuffer=exports.EntityRecUtil=exports.WorkbenchRedirection=exports.WebRedirection=exports.NullRedirection=exports.DialogRedirection=exports.Redirection=exports.InlineBinaryRef=exports.BinaryRef=exports.MapDef=exports.ListDef=exports.ImagePickerDef=exports.GraphDef=exports.GeoLocationDef=exports.GeoFixDef=exports.FormDef=exports.DetailsDef=exports.CalendarDef=exports.BarcodeScanDef=exports.PaneDef=exports.MapContext=exports.ListContext=exports.ImagePickerContext=exports.GraphContext=exports.CalendarContext=exports.GeoLocationContext=exports.GeoFixContext=exports.DetailsContext=exports.BarcodeScanContext=exports.QueryContext=exports.QueryDirection=exports.FormContext=exports.EditorContext=exports.PaneContext=exports.TabCellValueDef=exports.SubstitutionCellValueDef=exports.LabelCellValueDef=exports.ForcedLineCellValueDef=exports.AttributeCellValueDef=exports.CellValueDef=undefined;var _fp=__webpack_require__(3);var _util=__webpack_require__(2);var _ws=__webpack_require__(4);function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}} /*
	 IMPORTANT!
	 Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
	 Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
	 */ /**
	 * *********************************
	 */var CellValueDef=exports.CellValueDef=function(){function CellValueDef(_style){_classCallCheck(this,CellValueDef);this._style=_style;} /* Note compact deserialization will be handled normally by OType */_createClass(CellValueDef,[{key:"isInlineMediaStyle",get:function get(){return this.style&&(this.style===PropDef.STYLE_INLINE_MEDIA||this.style===PropDef.STYLE_INLINE_MEDIA2);}},{key:"style",get:function get(){return this._style;}}],[{key:"fromWS",value:function fromWS(otype,jsonObj){if(jsonObj['attributeCellValueDef']){return DialogTriple.fromWSDialogObject(jsonObj['attributeCellValueDef'],'WSAttributeCellValueDef',OType.factoryFn);}else if(jsonObj['forcedLineCellValueDef']){return DialogTriple.fromWSDialogObject(jsonObj['forcedLineCellValueDef'],'WSForcedLineCellValueDef',OType.factoryFn);}else if(jsonObj['labelCellValueDef']){return DialogTriple.fromWSDialogObject(jsonObj['labelCellValueDef'],'WSLabelCellValueDef',OType.factoryFn);}else if(jsonObj['substitutionCellValueDef']){return DialogTriple.fromWSDialogObject(jsonObj['substitutionCellValueDef'],'WSSubstitutionCellValueDef',OType.factoryFn);}else if(jsonObj['tabCellValueDef']){return DialogTriple.fromWSDialogObject(jsonObj['tabCellValueDef'],'WSTabCellValueDef',OType.factoryFn);}else {return new _fp.Failure('CellValueDef::fromWS: unknown CellValueDef type: '+_util.ObjUtil.formatRecAttr(jsonObj));}}}]);return CellValueDef;}(); /**
	 * *********************************
	 */var AttributeCellValueDef=exports.AttributeCellValueDef=function(_CellValueDef){_inherits(AttributeCellValueDef,_CellValueDef);function AttributeCellValueDef(_propertyName,_presentationLength,_entryMethod,_autoFillCapable,_hint,_toolTip,_fieldActions,style){_classCallCheck(this,AttributeCellValueDef);var _this=_possibleConstructorReturn(this,Object.getPrototypeOf(AttributeCellValueDef).call(this,style));_this._propertyName=_propertyName;_this._presentationLength=_presentationLength;_this._entryMethod=_entryMethod;_this._autoFillCapable=_autoFillCapable;_this._hint=_hint;_this._toolTip=_toolTip;_this._fieldActions=_fieldActions;return _this;}_createClass(AttributeCellValueDef,[{key:"autoFileCapable",get:function get(){return this._autoFillCapable;}},{key:"entryMethod",get:function get(){return this._entryMethod;}},{key:"fieldActions",get:function get(){return this._fieldActions;}},{key:"hint",get:function get(){return this._hint;}},{key:"isComboBoxEntryMethod",get:function get(){return this.entryMethod&&this.entryMethod==='ENTRY_METHOD_COMBO_BOX';}},{key:"isDropDownEntryMethod",get:function get(){return this.entryMethod&&this.entryMethod==='ENTRY_METHOD_DROP_DOWN';}},{key:"isTextFieldEntryMethod",get:function get(){return !this.entryMethod||this.entryMethod==='ENTRY_METHOD_TEXT_FIELD';}},{key:"presentationLength",get:function get(){return this._presentationLength;}},{key:"propertyName",get:function get(){return this._propertyName;}},{key:"toolTip",get:function get(){return this._toolTip;}}]);return AttributeCellValueDef;}(CellValueDef); /**
	 * *********************************
	 */var ForcedLineCellValueDef=exports.ForcedLineCellValueDef=function(_CellValueDef2){_inherits(ForcedLineCellValueDef,_CellValueDef2);function ForcedLineCellValueDef(){_classCallCheck(this,ForcedLineCellValueDef);return _possibleConstructorReturn(this,Object.getPrototypeOf(ForcedLineCellValueDef).call(this,null));}return ForcedLineCellValueDef;}(CellValueDef); /**
	 * *********************************
	 */var LabelCellValueDef=exports.LabelCellValueDef=function(_CellValueDef3){_inherits(LabelCellValueDef,_CellValueDef3);function LabelCellValueDef(_value,style){_classCallCheck(this,LabelCellValueDef);var _this3=_possibleConstructorReturn(this,Object.getPrototypeOf(LabelCellValueDef).call(this,style));_this3._value=_value;return _this3;}_createClass(LabelCellValueDef,[{key:"value",get:function get(){return this._value;}}]);return LabelCellValueDef;}(CellValueDef); /**
	 * *********************************
	 */var SubstitutionCellValueDef=exports.SubstitutionCellValueDef=function(_CellValueDef4){_inherits(SubstitutionCellValueDef,_CellValueDef4);function SubstitutionCellValueDef(_value,style){_classCallCheck(this,SubstitutionCellValueDef);var _this4=_possibleConstructorReturn(this,Object.getPrototypeOf(SubstitutionCellValueDef).call(this,style));_this4._value=_value;return _this4;}_createClass(SubstitutionCellValueDef,[{key:"value",get:function get(){return this._value;}}]);return SubstitutionCellValueDef;}(CellValueDef); /**
	 * *********************************
	 */var TabCellValueDef=exports.TabCellValueDef=function(_CellValueDef5){_inherits(TabCellValueDef,_CellValueDef5);function TabCellValueDef(){_classCallCheck(this,TabCellValueDef);return _possibleConstructorReturn(this,Object.getPrototypeOf(TabCellValueDef).call(this,null));}return TabCellValueDef;}(CellValueDef); /**
	 * *********************************
	 */var PaneContext=exports.PaneContext=function(){function PaneContext(paneRef){_classCallCheck(this,PaneContext);this._lastRefreshTime=new Date(0);this._parentContext=null;this._paneRef=null;this._paneRef=paneRef;this._binaryCache={};}_createClass(PaneContext,[{key:"findMenuDefAt",value:function findMenuDefAt(actionId){var result=null;this.menuDefs.some(function(md){result=md.findAtId(actionId);return result!=null;});return result;}},{key:"formatForRead",value:function formatForRead(propValue,propName){return PropFormatter.formatForRead(propValue,this.propDefAtName(propName));}},{key:"formatForWrite",value:function formatForWrite(propValue,propName){return PropFormatter.formatForWrite(propValue,this.propDefAtName(propName));}},{key:"parseValue",value:function parseValue(formattedValue,propName){return PropFormatter.parse(formattedValue,this.propDefAtName(propName));}},{key:"propDefAtName",value:function propDefAtName(propName){return this.entityRecDef.propDefAtName(propName);}},{key:"actionSource",get:function get(){return this.parentContext?this.parentContext.actionSource:null;}},{key:"dialogAlias",get:function get(){return this.dialogRedirection.dialogProperties['dialogAlias'];}},{key:"formDef",get:function get(){return this.parentContext.formDef;}},{key:"isRefreshNeeded",get:function get(){return this._lastRefreshTime.getTime()<AppContext.singleton.lastMaintenanceTime.getTime();}},{key:"lastRefreshTime",get:function get(){return this._lastRefreshTime;},set:function set(time){this._lastRefreshTime=time;}},{key:"menuDefs",get:function get(){return this.paneDef.menuDefs;}},{key:"offlineCapable",get:function get(){return this._parentContext&&this._parentContext.offlineCapable;}},{key:"paneDef",get:function get(){if(this.paneRef==null){return this.formDef.headerDef;}else {return this.formDef.childrenDefs[this.paneRef];}}},{key:"paneRef",get:function get(){return this._paneRef;}},{key:"paneTitle",get:function get(){return this.paneDef.findTitle();}},{key:"parentContext",get:function get(){return this._parentContext;},set:function set(parentContext){this._parentContext=parentContext;}},{key:"sessionContext",get:function get(){return this.parentContext.sessionContext;} /** --------------------- MODULE ------------------------------*/ //*** let's pretend this has module level visibility
	},{key:"dialogRedirection",get:function get(){return this.paneDef.dialogRedirection;}}],[{key:"resolveSettingsFromNavRequest",value:function resolveSettingsFromNavRequest(initialSettings,navRequest){var result=_util.ObjUtil.addAllProps(initialSettings,{});if(navRequest instanceof FormContext){_util.ObjUtil.addAllProps(navRequest.dialogRedirection.fromDialogProperties,result);_util.ObjUtil.addAllProps(navRequest.offlineProps,result);}else if(navRequest instanceof NullNavRequest){_util.ObjUtil.addAllProps(navRequest.fromDialogProperties,result);}var destroyed=result['fromDialogDestroyed'];if(destroyed)result['destroyed']=true;return result;}}]);return PaneContext;}();PaneContext.ANNO_NAME_KEY="com.catavolt.annoName";PaneContext.PROP_NAME_KEY="com.catavolt.propName"; /**
	 * *********************************
	 */var EditorContext=exports.EditorContext=function(_PaneContext){_inherits(EditorContext,_PaneContext);function EditorContext(paneRef){_classCallCheck(this,EditorContext);return _possibleConstructorReturn(this,Object.getPrototypeOf(EditorContext).call(this,paneRef));}_createClass(EditorContext,[{key:"changePaneMode",value:function changePaneMode(paneMode){var _this7=this;return DialogService.changePaneMode(this.paneDef.dialogHandle,paneMode,this.sessionContext).bind(function(changePaneModeResult){_this7.putSettings(changePaneModeResult.dialogProps);if(_this7.isDestroyedSetting){_this7._editorState=EditorState.DESTROYED;}else {_this7.entityRecDef=changePaneModeResult.entityRecDef;if(_this7.isReadModeSetting){_this7._editorState=EditorState.READ;}else {_this7._editorState=EditorState.WRITE;}}return _fp.Future.createSuccessfulFuture('EditorContext::changePaneMode',_this7.entityRecDef);});}},{key:"getAvailableValues",value:function getAvailableValues(propName){return DialogService.getAvailableValues(this.paneDef.dialogHandle,propName,this.buffer.afterEffects(),this.sessionContext).map(function(valuesResult){return valuesResult.list;});}},{key:"isBinary",value:function isBinary(cellValueDef){var propDef=this.propDefAtName(cellValueDef.propertyName);return propDef&&(propDef.isBinaryType||propDef.isURLType&&cellValueDef.isInlineMediaStyle);}},{key:"isReadModeFor",value:function isReadModeFor(propName){if(!this.isReadMode){var propDef=this.propDefAtName(propName);return !propDef||!propDef.maintainable||!propDef.writeEnabled;}return true;}},{key:"performMenuAction",value:function performMenuAction(menuDef,pendingWrites){var _this8=this;return DialogService.performEditorAction(this.paneDef.dialogHandle,menuDef.actionId,pendingWrites,this.sessionContext).bind(function(redirection){var ca=new ContextAction(menuDef.actionId,_this8.parentContext.dialogRedirection.objectId,_this8.actionSource);return NavRequestUtil.fromRedirection(redirection,ca,_this8.sessionContext).map(function(navRequest){_this8._settings=PaneContext.resolveSettingsFromNavRequest(_this8._settings,navRequest);if(_this8.isDestroyedSetting){_this8._editorState=EditorState.DESTROYED;}if(_this8.isRefreshSetting){AppContext.singleton.lastMaintenanceTime=new Date();}return navRequest;});});}},{key:"processSideEffects",value:function processSideEffects(propertyName,value){var _this9=this;var sideEffectsFr=DialogService.processSideEffects(this.paneDef.dialogHandle,this.sessionContext,propertyName,value,this.buffer.afterEffects()).map(function(changeResult){return changeResult.sideEffects?changeResult.sideEffects.entityRec:new NullEntityRec();});return sideEffectsFr.map(function(sideEffectsRec){var originalProps=_this9.buffer.before.props;var userEffects=_this9.buffer.afterEffects().props;var sideEffects=sideEffectsRec.props;sideEffects=sideEffects.filter(function(prop){return prop.name!==propertyName;});_this9._buffer=EntityBuffer.createEntityBuffer(_this9.buffer.objectId,EntityRecUtil.union(originalProps,sideEffects),EntityRecUtil.union(originalProps,EntityRecUtil.union(userEffects,sideEffects)));return null;});}},{key:"read",value:function read(){var _this10=this;return DialogService.readEditorModel(this.paneDef.dialogHandle,this.sessionContext).map(function(readResult){_this10.entityRecDef=readResult.entityRecDef;return readResult.entityRec;}).map(function(entityRec){_this10.initBuffer(entityRec);_this10.lastRefreshTime=new Date();return entityRec;});}},{key:"requestedAccuracy",value:function requestedAccuracy(){var accuracyStr=this.paneDef.settings[EditorContext.GPS_ACCURACY];return accuracyStr?Number(accuracyStr):500;}},{key:"requestedTimeoutSeconds",value:function requestedTimeoutSeconds(){var timeoutStr=this.paneDef.settings[EditorContext.GPS_SECONDS];return timeoutStr?Number(timeoutStr):30;}},{key:"write",value:function write(){var _this11=this;var result=DialogService.writeEditorModel(this.paneDef.dialogRedirection.dialogHandle,this.buffer.afterEffects(),this.sessionContext).bind(function(either){if(either.isLeft){var ca=new ContextAction('#write',_this11.parentContext.dialogRedirection.objectId,_this11.actionSource);var navRequestFr=NavRequestUtil.fromRedirection(either.left,ca,_this11.sessionContext).map(function(navRequest){return _fp.Either.left(navRequest);});}else {var writeResult=either.right;_this11.putSettings(writeResult.dialogProps);_this11.entityRecDef=writeResult.entityRecDef;return _fp.Future.createSuccessfulFuture('EditorContext::write',_fp.Either.right(writeResult.entityRec));}});return result.map(function(successfulWrite){var now=new Date();AppContext.singleton.lastMaintenanceTime=now;_this11.lastRefreshTime=now;if(successfulWrite.isLeft){_this11._settings=PaneContext.resolveSettingsFromNavRequest(_this11._settings,successfulWrite.left);}else {_this11.initBuffer(successfulWrite.right);}if(_this11.isDestroyedSetting){_this11._editorState=EditorState.DESTROYED;}else {if(_this11.isReadModeSetting){_this11._editorState=EditorState.READ;}}return successfulWrite;});} //Module level methods
	},{key:"initialize",value:function initialize(){this._entityRecDef=this.paneDef.entityRecDef;this._settings=_util.ObjUtil.addAllProps(this.dialogRedirection.dialogProperties,{});this._editorState=this.isReadModeSetting?EditorState.READ:EditorState.WRITE;}},{key:"initBuffer", //Private methods
	value:function initBuffer(entityRec){this._buffer=entityRec?new EntityBuffer(entityRec):new EntityBuffer(NullEntityRec.singleton);}},{key:"putSetting",value:function putSetting(key,value){this._settings[key]=value;}},{key:"putSettings",value:function putSettings(settings){_util.ObjUtil.addAllProps(settings,this._settings);}},{key:"buffer",get:function get(){if(!this._buffer){this._buffer=new EntityBuffer(NullEntityRec.singleton);}return this._buffer;}},{key:"entityRec",get:function get(){return this._buffer.toEntityRec();}},{key:"entityRecNow",get:function get(){return this.entityRec;}},{key:"entityRecDef",get:function get(){return this._entityRecDef;},set:function set(entityRecDef){this._entityRecDef=entityRecDef;}},{key:"isDestroyed",get:function get(){return this._editorState===EditorState.DESTROYED;}},{key:"isReadMode",get:function get(){return this._editorState===EditorState.READ;}},{key:"isWriteMode",get:function get(){return this._editorState===EditorState.WRITE;}},{key:"settings",get:function get(){return this._settings;}},{key:"isDestroyedSetting",get:function get(){var str=this._settings['destroyed'];return str&&str.toLowerCase()==='true';}},{key:"isGlobalRefreshSetting",get:function get(){var str=this._settings['globalRefresh'];return str&&str.toLowerCase()==='true';}},{key:"isLocalRefreshSetting",get:function get(){var str=this._settings['localRefresh'];return str&&str.toLowerCase()==='true';}},{key:"isReadModeSetting",get:function get(){var paneMode=this.paneModeSetting;return paneMode&&paneMode.toLowerCase()==='read';}},{key:"isRefreshSetting",get:function get(){return this.isLocalRefreshSetting||this.isGlobalRefreshSetting;}},{key:"paneModeSetting",get:function get(){return this._settings['paneMode'];}}]);return EditorContext;}(PaneContext);EditorContext.GPS_ACCURACY='com.catavolt.core.domain.GeoFix.accuracy';EditorContext.GPS_SECONDS='com.catavolt.core.domain.GeoFix.seconds'; /**
	 * *********************************
	 */var FormContext=exports.FormContext=function(_PaneContext2){_inherits(FormContext,_PaneContext2);function FormContext(_dialogRedirection,_actionSource,_formDef,_childrenContexts,_offlineCapable,_offlineData,_sessionContext){_classCallCheck(this,FormContext);var _this12=_possibleConstructorReturn(this,Object.getPrototypeOf(FormContext).call(this,null));_this12._dialogRedirection=_dialogRedirection;_this12._actionSource=_actionSource;_this12._formDef=_formDef;_this12._childrenContexts=_childrenContexts;_this12._offlineCapable=_offlineCapable;_this12._offlineData=_offlineData;_this12._sessionContext=_sessionContext;_this12._destroyed=false;_this12._offlineProps={};_this12._childrenContexts=_childrenContexts||[];_this12._childrenContexts.forEach(function(c){c.parentContext=_this12;});return _this12;}_createClass(FormContext,[{key:"close",value:function close(){return DialogService.closeEditorModel(this.dialogRedirection.dialogHandle,this.sessionContext);}},{key:"performMenuAction",value:function performMenuAction(menuDef){var _this13=this;return DialogService.performEditorAction(this.paneDef.dialogHandle,menuDef.actionId,NullEntityRec.singleton,this.sessionContext).bind(function(value){var destroyedStr=value.fromDialogProperties['destroyed'];if(destroyedStr&&destroyedStr.toLowerCase()==='true'){_this13._destroyed=true;}var ca=new ContextAction(menuDef.actionId,_this13.dialogRedirection.objectId,_this13.actionSource);return NavRequestUtil.fromRedirection(value,ca,_this13.sessionContext);});}},{key:"processNavRequestForDestroyed",value:function processNavRequestForDestroyed(navRequest){var fromDialogProps={};if(navRequest instanceof FormContext){fromDialogProps=navRequest.offlineProps;}else if(navRequest instanceof NullNavRequest){fromDialogProps=navRequest.fromDialogProperties;}var destroyedStr=fromDialogProps['destroyed'];if(destroyedStr&&destroyedStr.toLowerCase()==='true'){this._destroyed=true;}var fromDialogDestroyed=fromDialogProps['fromDialogDestroyed'];if(fromDialogDestroyed){this._destroyed=true;}}},{key:"actionSource",get:function get(){return this.parentContext?this.parentContext.actionSource:this._actionSource;}},{key:"childrenContexts",get:function get(){return this._childrenContexts;}},{key:"dialogRedirection",get:function get(){return this._dialogRedirection;}},{key:"entityRecDef",get:function get(){return this.formDef.entityRecDef;}},{key:"formDef",get:function get(){return this._formDef;}},{key:"headerContext",get:function get(){throw new Error('FormContext::headerContext: Needs Impl');}},{key:"isDestroyed",get:function get(){return this._destroyed||this.isAnyChildDestroyed;}},{key:"offlineCapable",get:function get(){return this._offlineCapable;}},{key:"menuDefs",get:function get(){return this.formDef.menuDefs;}},{key:"offlineProps",get:function get(){return this._offlineProps;}},{key:"paneDef",get:function get(){return this.formDef;}},{key:"sessionContext",get:function get(){return this._sessionContext;} /** --------------------- MODULE ------------------------------*/ //*** let's pretend this has module level visibility (no such thing (yet!))
	},{key:"isAnyChildDestroyed",get:function get(){return this.childrenContexts.some(function(paneContext){if(paneContext instanceof EditorContext||paneContext instanceof QueryContext){return paneContext.isDestroyed;}return false;});}}]);return FormContext;}(PaneContext); /**
	 * *********************************
	 */var QueryState;(function(QueryState){QueryState[QueryState["ACTIVE"]=0]="ACTIVE";QueryState[QueryState["DESTROYED"]=1]="DESTROYED";})(QueryState||(QueryState={}));var QueryDirection=exports.QueryDirection=undefined;(function(QueryDirection){QueryDirection[QueryDirection["FORWARD"]=0]="FORWARD";QueryDirection[QueryDirection["BACKWARD"]=1]="BACKWARD";})(QueryDirection||(exports.QueryDirection=QueryDirection={}));var QueryContext=exports.QueryContext=function(_PaneContext3){_inherits(QueryContext,_PaneContext3);function QueryContext(paneRef){var _offlineRecs=arguments.length<=1||arguments[1]===undefined?[]:arguments[1];var _settings=arguments.length<=2||arguments[2]===undefined?{}:arguments[2];_classCallCheck(this,QueryContext);var _this14=_possibleConstructorReturn(this,Object.getPrototypeOf(QueryContext).call(this,paneRef));_this14._offlineRecs=_offlineRecs;_this14._settings=_settings;return _this14;}_createClass(QueryContext,[{key:"isBinary",value:function isBinary(columnDef){var propDef=this.propDefAtName(columnDef.name);return propDef&&(propDef.isBinaryType||propDef.isURLType&&columnDef.isInlineMediaStyle);}},{key:"performMenuAction",value:function performMenuAction(menuDef,targets){var _this15=this;return DialogService.performQueryAction(this.paneDef.dialogHandle,menuDef.actionId,targets,this.sessionContext).bind(function(redirection){var target=targets.length>0?targets[0]:null;var ca=new ContextAction(menuDef.actionId,target,_this15.actionSource);return NavRequestUtil.fromRedirection(redirection,ca,_this15.sessionContext);}).map(function(navRequest){_this15._settings=PaneContext.resolveSettingsFromNavRequest(_this15._settings,navRequest);if(_this15.isDestroyedSetting){_this15._queryState=QueryState.DESTROYED;}return navRequest;});}},{key:"query",value:function query(maxRows,direction,fromObjectId){var _this16=this;return DialogService.queryQueryModel(this.paneDef.dialogHandle,direction,maxRows,fromObjectId,this.sessionContext).bind(function(value){var result=new QueryResult(value.entityRecs,value.hasMore);if(_this16.lastRefreshTime===new Date(0)){_this16.lastRefreshTime=new Date();}return _fp.Future.createSuccessfulFuture('QueryContext::query',result);});}},{key:"refresh",value:function refresh(){return this._scroller.refresh();}},{key:"setScroller",value:function setScroller(pageSize,firstObjectId,markerOptions){this._scroller=new QueryScroller(this,pageSize,firstObjectId,markerOptions);return this._scroller;} //module level methods
	},{key:"newScroller",value:function newScroller(){return this.setScroller(50,null,[QueryMarkerOption.None]);}},{key:"settings",value:function settings(){return this._settings;}},{key:"entityRecDef",get:function get(){return this.paneDef.entityRecDef;}},{key:"isDestroyed",get:function get(){return this._queryState===QueryState.DESTROYED;}},{key:"lastQueryFr",get:function get(){return this._lastQueryFr;}},{key:"offlineRecs",get:function get(){return this._offlineRecs;},set:function set(offlineRecs){this._offlineRecs=offlineRecs;}},{key:"paneMode",get:function get(){return this._settings['paneMode'];}},{key:"scroller",get:function get(){if(!this._scroller){this._scroller=this.newScroller();}return this._scroller;}},{key:"isDestroyedSetting",get:function get(){var str=this._settings['destroyed'];return str&&str.toLowerCase()==='true';}},{key:"isGlobalRefreshSetting",get:function get(){var str=this._settings['globalRefresh'];return str&&str.toLowerCase()==='true';}},{key:"isLocalRefreshSetting",get:function get(){var str=this._settings['localRefresh'];return str&&str.toLowerCase()==='true';}},{key:"isRefreshSetting",get:function get(){return this.isLocalRefreshSetting||this.isGlobalRefreshSetting;}}]);return QueryContext;}(PaneContext); /**
	 * *********************************
	 */var BarcodeScanContext=exports.BarcodeScanContext=function(_EditorContext){_inherits(BarcodeScanContext,_EditorContext);function BarcodeScanContext(paneRef){_classCallCheck(this,BarcodeScanContext);return _possibleConstructorReturn(this,Object.getPrototypeOf(BarcodeScanContext).call(this,paneRef));}_createClass(BarcodeScanContext,[{key:"barcodeScanDef",get:function get(){return this.paneDef;}}]);return BarcodeScanContext;}(EditorContext); /**
	 * *********************************
	 */var DetailsContext=exports.DetailsContext=function(_EditorContext2){_inherits(DetailsContext,_EditorContext2);function DetailsContext(paneRef){_classCallCheck(this,DetailsContext);return _possibleConstructorReturn(this,Object.getPrototypeOf(DetailsContext).call(this,paneRef));}_createClass(DetailsContext,[{key:"detailsDef",get:function get(){return this.paneDef;}},{key:"printMarkupURL",get:function get(){return this.paneDef.dialogRedirection.dialogProperties['formsURL'];}}]);return DetailsContext;}(EditorContext); /**
	 * *********************************
	 */var GeoFixContext=exports.GeoFixContext=function(_EditorContext3){_inherits(GeoFixContext,_EditorContext3);function GeoFixContext(paneRef){_classCallCheck(this,GeoFixContext);return _possibleConstructorReturn(this,Object.getPrototypeOf(GeoFixContext).call(this,paneRef));}_createClass(GeoFixContext,[{key:"geoFixDef",get:function get(){return this.paneDef;}}]);return GeoFixContext;}(EditorContext); /**
	 * *********************************
	 */var GeoLocationContext=exports.GeoLocationContext=function(_EditorContext4){_inherits(GeoLocationContext,_EditorContext4);function GeoLocationContext(paneRef){_classCallCheck(this,GeoLocationContext);return _possibleConstructorReturn(this,Object.getPrototypeOf(GeoLocationContext).call(this,paneRef));}_createClass(GeoLocationContext,[{key:"geoLocationDef",get:function get(){return this.paneDef;}}]);return GeoLocationContext;}(EditorContext); /**
	 * *********************************
	 */var CalendarContext=exports.CalendarContext=function(_QueryContext){_inherits(CalendarContext,_QueryContext);function CalendarContext(paneRef){_classCallCheck(this,CalendarContext);return _possibleConstructorReturn(this,Object.getPrototypeOf(CalendarContext).call(this,paneRef));}_createClass(CalendarContext,[{key:"calendarDef",get:function get(){return this.paneDef;}}]);return CalendarContext;}(QueryContext); /**
	 * *********************************
	 */var GraphContext=exports.GraphContext=function(_QueryContext2){_inherits(GraphContext,_QueryContext2);function GraphContext(paneRef){_classCallCheck(this,GraphContext);return _possibleConstructorReturn(this,Object.getPrototypeOf(GraphContext).call(this,paneRef));}_createClass(GraphContext,[{key:"graphDef",get:function get(){return this.paneDef;}}]);return GraphContext;}(QueryContext); /**
	 * *********************************
	 */var ImagePickerContext=exports.ImagePickerContext=function(_QueryContext3){_inherits(ImagePickerContext,_QueryContext3);function ImagePickerContext(paneRef){_classCallCheck(this,ImagePickerContext);return _possibleConstructorReturn(this,Object.getPrototypeOf(ImagePickerContext).call(this,paneRef));}_createClass(ImagePickerContext,[{key:"imagePickerDef",get:function get(){return this.paneDef;}}]);return ImagePickerContext;}(QueryContext); /**
	 * *********************************
	 */var ListContext=exports.ListContext=function(_QueryContext4){_inherits(ListContext,_QueryContext4);function ListContext(paneRef){var offlineRecs=arguments.length<=1||arguments[1]===undefined?[]:arguments[1];var settings=arguments.length<=2||arguments[2]===undefined?{}:arguments[2];_classCallCheck(this,ListContext);return _possibleConstructorReturn(this,Object.getPrototypeOf(ListContext).call(this,paneRef,offlineRecs,settings));}_createClass(ListContext,[{key:"rowValues",value:function rowValues(entityRec){return this.listDef.activeColumnDefs.map(function(cd){return entityRec.valueAtName(cd.name);});}},{key:"columnHeadings",get:function get(){return this.listDef.activeColumnDefs.map(function(cd){return cd.heading;});}},{key:"listDef",get:function get(){return this.paneDef;}},{key:"style",get:function get(){return this.listDef.style;}}]);return ListContext;}(QueryContext); /**
	 * *********************************
	 */var MapContext=exports.MapContext=function(_QueryContext5){_inherits(MapContext,_QueryContext5);function MapContext(paneRef){_classCallCheck(this,MapContext);return _possibleConstructorReturn(this,Object.getPrototypeOf(MapContext).call(this,paneRef));}_createClass(MapContext,[{key:"mapDef",get:function get(){return this.paneDef;}}]);return MapContext;}(QueryContext); /**
	 * *********************************
	 */var PaneDef=exports.PaneDef=function(){function PaneDef(_paneId,_name,_label,_title,_menuDefs,_entityRecDef,_dialogRedirection,_settings){_classCallCheck(this,PaneDef);this._paneId=_paneId;this._name=_name;this._label=_label;this._title=_title;this._menuDefs=_menuDefs;this._entityRecDef=_entityRecDef;this._dialogRedirection=_dialogRedirection;this._settings=_settings;}_createClass(PaneDef,[{key:"findTitle",value:function findTitle(){var result=this._title?this._title.trim():'';result=result==='null'?'':result;if(result===''){result=this._label?this._label.trim():'';result=result==='null'?'':result;}return result;}},{key:"dialogHandle",get:function get(){return this._dialogRedirection.dialogHandle;}},{key:"dialogRedirection",get:function get(){return this._dialogRedirection;}},{key:"entityRecDef",get:function get(){return this._entityRecDef;}},{key:"label",get:function get(){return this._label;}},{key:"menuDefs",get:function get(){return this._menuDefs;}},{key:"name",get:function get(){return this._name;}},{key:"paneId",get:function get(){return this._paneId;}},{key:"settings",get:function get(){return this._settings;}},{key:"title",get:function get(){return this._title;}}],[{key:"fromOpenPaneResult",value:function fromOpenPaneResult(childXOpenResult,childXComp,childXPaneDefRef,childXPaneDef,childXActiveColDefs,childMenuDefs){var settings={};_util.ObjUtil.addAllProps(childXComp.redirection.dialogProperties,settings);var newPaneDef;if(childXPaneDef instanceof XListDef){var xListDef=childXPaneDef;var xOpenQueryModelResult=childXOpenResult;newPaneDef=new ListDef(xListDef.paneId,xListDef.name,childXComp.label,xListDef.title,childMenuDefs,xOpenQueryModelResult.entityRecDef,childXComp.redirection,settings,xListDef.style,xListDef.initialColumns,childXActiveColDefs.columnDefs,xListDef.columnsStyle,xOpenQueryModelResult.defaultActionId,xListDef.graphicalMarkup);}else if(childXPaneDef instanceof XDetailsDef){var xDetailsDef=childXPaneDef;var xOpenEditorModelResult=childXOpenResult;newPaneDef=new DetailsDef(xDetailsDef.paneId,xDetailsDef.name,childXComp.label,xDetailsDef.title,childMenuDefs,xOpenEditorModelResult.entityRecDef,childXComp.redirection,settings,xDetailsDef.cancelButtonText,xDetailsDef.commitButtonText,xDetailsDef.editable,xDetailsDef.focusPropertyName,xDetailsDef.graphicalMarkup,xDetailsDef.rows);}else if(childXPaneDef instanceof XMapDef){var xMapDef=childXPaneDef;var xOpenQueryModelResult=childXOpenResult;newPaneDef=new MapDef(xMapDef.paneId,xMapDef.name,childXComp.label,xMapDef.title,childMenuDefs,xOpenQueryModelResult.entityRecDef,childXComp.redirection,settings,xMapDef.descriptionProperty,xMapDef.streetProperty,xMapDef.cityProperty,xMapDef.stateProperty,xMapDef.postalCodeProperty,xMapDef.latitudeProperty,xMapDef.longitudeProperty);}else if(childXPaneDef instanceof XGraphDef){var xGraphDef=childXPaneDef;var xOpenQueryModelResult=childXOpenResult;newPaneDef=new GraphDef(xGraphDef.paneId,xGraphDef.name,childXComp.label,xGraphDef.title,childMenuDefs,xOpenQueryModelResult.entityRecDef,childXComp.redirection,settings,xGraphDef.graphType,xGraphDef.identityDataPoint,xGraphDef.groupingDataPoint,xGraphDef.dataPoints,xGraphDef.filterDataPoints,xGraphDef.sampleModel);}else if(childXPaneDef instanceof XBarcodeScanDef){var xBarcodeScanDef=childXPaneDef;var xOpenEditorModelResult=childXOpenResult;newPaneDef=new BarcodeScanDef(xBarcodeScanDef.paneId,xBarcodeScanDef.name,childXComp.label,xBarcodeScanDef.title,childMenuDefs,xOpenEditorModelResult.entityRecDef,childXComp.redirection,settings);}else if(childXPaneDef instanceof XGeoFixDef){var xGeoFixDef=childXPaneDef;var xOpenEditorModelResult=childXOpenResult;newPaneDef=new GeoFixDef(xGeoFixDef.paneId,xGeoFixDef.name,childXComp.label,xGeoFixDef.title,childMenuDefs,xOpenEditorModelResult.entityRecDef,childXComp.redirection,settings);}else if(childXPaneDef instanceof XGeoLocationDef){var xGeoLocationDef=childXPaneDef;var xOpenEditorModelResult=childXOpenResult;newPaneDef=new GeoLocationDef(xGeoLocationDef.paneId,xGeoLocationDef.name,childXComp.label,xGeoLocationDef.title,childMenuDefs,xOpenEditorModelResult.entityRecDef,childXComp.redirection,settings);}else if(childXPaneDef instanceof XCalendarDef){var xCalendarDef=childXPaneDef;var xOpenQueryModelResult=childXOpenResult;newPaneDef=new CalendarDef(xCalendarDef.paneId,xCalendarDef.name,childXComp.label,xCalendarDef.title,childMenuDefs,xOpenQueryModelResult.entityRecDef,childXComp.redirection,settings,xCalendarDef.descriptionProperty,xCalendarDef.initialStyle,xCalendarDef.startDateProperty,xCalendarDef.startTimeProperty,xCalendarDef.endDateProperty,xCalendarDef.endTimeProperty,xCalendarDef.occurDateProperty,xCalendarDef.occurTimeProperty,xOpenQueryModelResult.defaultActionId);}else if(childXPaneDef instanceof XImagePickerDef){var xImagePickerDef=childXPaneDef;var xOpenQueryModelResult=childXOpenResult;newPaneDef=new ImagePickerDef(xImagePickerDef.paneId,xImagePickerDef.name,childXComp.label,xImagePickerDef.title,childMenuDefs,xOpenQueryModelResult.entityRecDef,childXComp.redirection,settings,xImagePickerDef.URLProperty,xImagePickerDef.defaultActionId);}else {return new _fp.Failure('PaneDef::fromOpenPaneResult needs impl for: '+_util.ObjUtil.formatRecAttr(childXPaneDef));}return new _fp.Success(newPaneDef);}}]);return PaneDef;}(); /**
	 * *********************************
	 */var BarcodeScanDef=exports.BarcodeScanDef=function(_PaneDef){_inherits(BarcodeScanDef,_PaneDef);function BarcodeScanDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings){_classCallCheck(this,BarcodeScanDef);return _possibleConstructorReturn(this,Object.getPrototypeOf(BarcodeScanDef).call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings));}return BarcodeScanDef;}(PaneDef); /**
	 * *********************************
	 */var CalendarDef=exports.CalendarDef=function(_PaneDef2){_inherits(CalendarDef,_PaneDef2);function CalendarDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_descriptionPropName,_initialStyle,_startDatePropName,_startTimePropName,_endDatePropName,_endTimePropName,_occurDatePropName,_occurTimePropName,_defaultActionId){_classCallCheck(this,CalendarDef);var _this27=_possibleConstructorReturn(this,Object.getPrototypeOf(CalendarDef).call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings));_this27._descriptionPropName=_descriptionPropName;_this27._initialStyle=_initialStyle;_this27._startDatePropName=_startDatePropName;_this27._startTimePropName=_startTimePropName;_this27._endDatePropName=_endDatePropName;_this27._endTimePropName=_endTimePropName;_this27._occurDatePropName=_occurDatePropName;_this27._occurTimePropName=_occurTimePropName;_this27._defaultActionId=_defaultActionId;return _this27;}_createClass(CalendarDef,[{key:"descriptionPropName",get:function get(){return this._descriptionPropName;}},{key:"initialStyle",get:function get(){return this._initialStyle;}},{key:"startDatePropName",get:function get(){return this._startDatePropName;}},{key:"startTimePropName",get:function get(){return this._startTimePropName;}},{key:"endDatePropName",get:function get(){return this._endDatePropName;}},{key:"endTimePropName",get:function get(){return this._endTimePropName;}},{key:"occurDatePropName",get:function get(){return this._occurDatePropName;}},{key:"occurTimePropName",get:function get(){return this._occurTimePropName;}},{key:"defaultActionId",get:function get(){return this._defaultActionId;}}]);return CalendarDef;}(PaneDef); /**
	 * *********************************
	 */var DetailsDef=exports.DetailsDef=function(_PaneDef3){_inherits(DetailsDef,_PaneDef3);function DetailsDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_cancelButtonText,_commitButtonText,_editable,_focusPropName,_graphicalMarkup,_rows){_classCallCheck(this,DetailsDef);var _this28=_possibleConstructorReturn(this,Object.getPrototypeOf(DetailsDef).call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings));_this28._cancelButtonText=_cancelButtonText;_this28._commitButtonText=_commitButtonText;_this28._editable=_editable;_this28._focusPropName=_focusPropName;_this28._graphicalMarkup=_graphicalMarkup;_this28._rows=_rows;return _this28;}_createClass(DetailsDef,[{key:"cancelButtonText",get:function get(){return this._cancelButtonText;}},{key:"commitButtonText",get:function get(){return this._commitButtonText;}},{key:"editable",get:function get(){return this._editable;}},{key:"focusPropName",get:function get(){return this._focusPropName;}},{key:"graphicalMarkup",get:function get(){return this._graphicalMarkup;}},{key:"rows",get:function get(){return this._rows;}}]);return DetailsDef;}(PaneDef); /**
	 * *********************************
	 */var FormDef=exports.FormDef=function(_PaneDef4){_inherits(FormDef,_PaneDef4);function FormDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_formLayout,_formStyle,_borderStyle,_headerDef,_childrenDefs){_classCallCheck(this,FormDef);var _this29=_possibleConstructorReturn(this,Object.getPrototypeOf(FormDef).call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings));_this29._formLayout=_formLayout;_this29._formStyle=_formStyle;_this29._borderStyle=_borderStyle;_this29._headerDef=_headerDef;_this29._childrenDefs=_childrenDefs;return _this29;}_createClass(FormDef,[{key:"borderStyle",get:function get(){return this._borderStyle;}},{key:"childrenDefs",get:function get(){return this._childrenDefs;}},{key:"formLayout",get:function get(){return this._formLayout;}},{key:"formStyle",get:function get(){return this._formStyle;}},{key:"headerDef",get:function get(){return this._headerDef;}},{key:"isFlowingLayout",get:function get(){return this.formLayout&&this.formLayout==='FLOWING';}},{key:"isFlowingTopDownLayout",get:function get(){return this.formLayout&&this.formLayout==='FLOWING_TOP_DOWN';}},{key:"isFourBoxSquareLayout",get:function get(){return this.formLayout&&this.formLayout==='FOUR_BOX_SQUARE';}},{key:"isHorizontalLayout",get:function get(){return this.formLayout&&this.formLayout==='H';}},{key:"isOptionsFormLayout",get:function get(){return this.formLayout&&this.formLayout==='OPTIONS_FORM';}},{key:"isTabsLayout",get:function get(){return this.formLayout&&this.formLayout==='TABS';}},{key:"isThreeBoxOneLeftLayout",get:function get(){return this.formLayout&&this.formLayout==='THREE_ONE_LEFT';}},{key:"isThreeBoxOneOverLayout",get:function get(){return this.formLayout&&this.formLayout==='THREE_ONE_OVER';}},{key:"isThreeBoxOneRightLayout",get:function get(){return this.formLayout&&this.formLayout==='THREE_ONE_RIGHT';}},{key:"isThreeBoxOneUnderLayout",get:function get(){return this.formLayout&&this.formLayout==='THREE_ONE_UNDER';}},{key:"isTopDownLayout",get:function get(){return this.formLayout&&this.formLayout==='TOP_DOWN';}},{key:"isTwoVerticalLayout",get:function get(){return this.formLayout&&this.formLayout==='H(2,V)';}}],[{key:"fromOpenFormResult",value:function fromOpenFormResult(formXOpenResult,formXFormDef,formMenuDefs,childrenXOpens,childrenXPaneDefs,childrenXActiveColDefs,childrenMenuDefs){var settings={'open':true};_util.ObjUtil.addAllProps(formXOpenResult.formRedirection.dialogProperties,settings);var headerDef=null;var childrenDefs=[];for(var i=0;i<childrenXOpens.length;i++){var childXOpen=childrenXOpens[i];var childXPaneDef=childrenXPaneDefs[i];var childXActiveColDefs=childrenXActiveColDefs[i];var childMenuDefs=childrenMenuDefs[i];var childXComp=formXOpenResult.formModel.children[i];var childXPaneDefRef=formXFormDef.paneDefRefs[i];var paneDefTry=PaneDef.fromOpenPaneResult(childXOpen,childXComp,childXPaneDefRef,childXPaneDef,childXActiveColDefs,childMenuDefs);if(paneDefTry.isFailure){return new _fp.Failure(paneDefTry.failure);}else {childrenDefs.push(paneDefTry.success);}}return new _fp.Success(new FormDef(formXFormDef.paneId,formXFormDef.name,formXOpenResult.formModel.form.label,formXFormDef.title,formMenuDefs,formXOpenResult.entityRecDef,formXOpenResult.formRedirection,settings,formXFormDef.formLayout,formXFormDef.formStyle,formXFormDef.borderStyle,headerDef,childrenDefs));}}]);return FormDef;}(PaneDef); /**
	 * *********************************
	 */var GeoFixDef=exports.GeoFixDef=function(_PaneDef5){_inherits(GeoFixDef,_PaneDef5);function GeoFixDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings){_classCallCheck(this,GeoFixDef);return _possibleConstructorReturn(this,Object.getPrototypeOf(GeoFixDef).call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings));}return GeoFixDef;}(PaneDef); /**
	 * *********************************
	 */var GeoLocationDef=exports.GeoLocationDef=function(_PaneDef6){_inherits(GeoLocationDef,_PaneDef6);function GeoLocationDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings){_classCallCheck(this,GeoLocationDef);return _possibleConstructorReturn(this,Object.getPrototypeOf(GeoLocationDef).call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings));}return GeoLocationDef;}(PaneDef); /**
	 * *********************************
	 */var GraphDef=exports.GraphDef=function(_PaneDef7){_inherits(GraphDef,_PaneDef7);function GraphDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_graphType,_identityDataPointDef,_groupingDataPointDef,_dataPointDefs,_filterDataPointDefs,_sampleModel){_classCallCheck(this,GraphDef);var _this32=_possibleConstructorReturn(this,Object.getPrototypeOf(GraphDef).call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings));_this32._graphType=_graphType;_this32._identityDataPointDef=_identityDataPointDef;_this32._groupingDataPointDef=_groupingDataPointDef;_this32._dataPointDefs=_dataPointDefs;_this32._filterDataPointDefs=_filterDataPointDefs;_this32._sampleModel=_sampleModel;return _this32;}_createClass(GraphDef,[{key:"dataPointDefs",get:function get(){return this._dataPointDefs;}},{key:"filterDataPointDefs",get:function get(){return this._filterDataPointDefs;}},{key:"identityDataPointDef",get:function get(){return this._identityDataPointDef;}},{key:"groupingDataPointDef",get:function get(){return this._groupingDataPointDef;}},{key:"sampleModel",get:function get(){return this._sampleModel;}}]);return GraphDef;}(PaneDef); /**
	 * *********************************
	 */var ImagePickerDef=exports.ImagePickerDef=function(_PaneDef8){_inherits(ImagePickerDef,_PaneDef8);function ImagePickerDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_URLPropName,_defaultActionId){_classCallCheck(this,ImagePickerDef);var _this33=_possibleConstructorReturn(this,Object.getPrototypeOf(ImagePickerDef).call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings));_this33._URLPropName=_URLPropName;_this33._defaultActionId=_defaultActionId;return _this33;}_createClass(ImagePickerDef,[{key:"defaultActionId",get:function get(){return this._defaultActionId;}},{key:"URLPropName",get:function get(){return this._URLPropName;}}]);return ImagePickerDef;}(PaneDef); /**
	 * *********************************
	 */var ListDef=exports.ListDef=function(_PaneDef9){_inherits(ListDef,_PaneDef9);function ListDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_style,_initialColumns,_activeColumnDefs,_columnsStyle,_defaultActionId,_graphicalMarkup){_classCallCheck(this,ListDef);var _this34=_possibleConstructorReturn(this,Object.getPrototypeOf(ListDef).call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings));_this34._style=_style;_this34._initialColumns=_initialColumns;_this34._activeColumnDefs=_activeColumnDefs;_this34._columnsStyle=_columnsStyle;_this34._defaultActionId=_defaultActionId;_this34._graphicalMarkup=_graphicalMarkup;return _this34;}_createClass(ListDef,[{key:"activeColumnDefs",get:function get(){return this._activeColumnDefs;}},{key:"columnsStyle",get:function get(){return this._columnsStyle;}},{key:"defaultActionId",get:function get(){return this._defaultActionId;}},{key:"graphicalMarkup",get:function get(){return this._graphicalMarkup;}},{key:"initialColumns",get:function get(){return this._initialColumns;}},{key:"isDefaultStyle",get:function get(){return this.style&&this.style==='DEFAULT';}},{key:"isDetailsFormStyle",get:function get(){return this.style&&this.style==='DETAILS_FORM';}},{key:"isFormStyle",get:function get(){return this.style&&this.style==='FORM';}},{key:"isTabularStyle",get:function get(){return this.style&&this.style==='TABULAR';}},{key:"style",get:function get(){return this._style;}}]);return ListDef;}(PaneDef); /**
	 * *********************************
	 */var MapDef=exports.MapDef=function(_PaneDef10){_inherits(MapDef,_PaneDef10);function MapDef(paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings,_descriptionPropName,_streetPropName,_cityPropName,_statePropName,_postalCodePropName,_latitudePropName,_longitudePropName){_classCallCheck(this,MapDef);var _this35=_possibleConstructorReturn(this,Object.getPrototypeOf(MapDef).call(this,paneId,name,label,title,menuDefs,entityRecDef,dialogRedirection,settings));_this35._descriptionPropName=_descriptionPropName;_this35._streetPropName=_streetPropName;_this35._cityPropName=_cityPropName;_this35._statePropName=_statePropName;_this35._postalCodePropName=_postalCodePropName;_this35._latitudePropName=_latitudePropName;_this35._longitudePropName=_longitudePropName;return _this35;}_createClass(MapDef,[{key:"cityPropName",get:function get(){return this._cityPropName;}},{key:"descriptionPropName",get:function get(){return this._descriptionPropName;}},{key:"latitudePropName",get:function get(){return this._latitudePropName;}},{key:"longitudePropName",get:function get(){return this._longitudePropName;}},{key:"postalCodePropName",get:function get(){return this._postalCodePropName;}},{key:"statePropName",get:function get(){return this._statePropName;}},{key:"streetPropName",get:function get(){return this._streetPropName;}}]);return MapDef;}(PaneDef); /**
	 * *********************************
	 */var BinaryRef=exports.BinaryRef=function(){function BinaryRef(_settings){_classCallCheck(this,BinaryRef);this._settings=_settings;}_createClass(BinaryRef,[{key:"settings",get:function get(){return this._settings;}}],[{key:"fromWSValue",value:function fromWSValue(encodedValue,settings){if(encodedValue&&encodedValue.length>0){return new _fp.Success(new InlineBinaryRef(_util.Base64.decode(encodedValue),settings));}else {return new _fp.Success(new ObjectBinaryRef(settings));}}}]);return BinaryRef;}();var InlineBinaryRef=exports.InlineBinaryRef=function(_BinaryRef){_inherits(InlineBinaryRef,_BinaryRef);function InlineBinaryRef(_inlineData,settings){_classCallCheck(this,InlineBinaryRef);var _this36=_possibleConstructorReturn(this,Object.getPrototypeOf(InlineBinaryRef).call(this,settings));_this36._inlineData=_inlineData;return _this36;} /* Base64 encoded data */_createClass(InlineBinaryRef,[{key:"inlineData",get:function get(){return this._inlineData;}}]);return InlineBinaryRef;}(BinaryRef);var ObjectBinaryRef=function(_BinaryRef2){_inherits(ObjectBinaryRef,_BinaryRef2);function ObjectBinaryRef(settings){_classCallCheck(this,ObjectBinaryRef);return _possibleConstructorReturn(this,Object.getPrototypeOf(ObjectBinaryRef).call(this,settings));}return ObjectBinaryRef;}(BinaryRef); /**
	 * *********************************
	 */var Redirection=exports.Redirection=function(){function Redirection(){_classCallCheck(this,Redirection);}_createClass(Redirection,null,[{key:"fromWS",value:function fromWS(otype,jsonObj){if(jsonObj&&jsonObj['webURL']){return OType.deserializeObject(jsonObj,'WSWebRedirection',OType.factoryFn);}else if(jsonObj&&jsonObj['workbenchId']){return OType.deserializeObject(jsonObj,'WSWorkbenchRedirection',OType.factoryFn);}else {return OType.deserializeObject(jsonObj,'WSDialogRedirection',OType.factoryFn);}}}]);return Redirection;}(); /**
	 * *********************************
	 */var DialogRedirection=exports.DialogRedirection=function(_Redirection){_inherits(DialogRedirection,_Redirection);function DialogRedirection(_dialogHandle,_dialogType,_dialogMode,_paneMode,_objectId,_open,_domainClassName,_dialogModelClassName,_dialogProperties,_fromDialogProperties){_classCallCheck(this,DialogRedirection);var _this38=_possibleConstructorReturn(this,Object.getPrototypeOf(DialogRedirection).call(this));_this38._dialogHandle=_dialogHandle;_this38._dialogType=_dialogType;_this38._dialogMode=_dialogMode;_this38._paneMode=_paneMode;_this38._objectId=_objectId;_this38._open=_open;_this38._domainClassName=_domainClassName;_this38._dialogModelClassName=_dialogModelClassName;_this38._dialogProperties=_dialogProperties;_this38._fromDialogProperties=_fromDialogProperties;return _this38;}_createClass(DialogRedirection,[{key:"dialogHandle",get:function get(){return this._dialogHandle;}},{key:"dialogMode",get:function get(){return this._dialogMode;}},{key:"dialogModelClassName",get:function get(){return this._dialogModelClassName;}},{key:"dialogProperties",get:function get(){return this._dialogProperties;}},{key:"dialogType",get:function get(){return this._dialogType;}},{key:"domainClassName",get:function get(){return this._domainClassName;}},{key:"fromDialogProperties",get:function get(){return this._fromDialogProperties;},set:function set(props){this._fromDialogProperties=props;}},{key:"isEditor",get:function get(){return this._dialogType==='EDITOR';}},{key:"isQuery",get:function get(){return this._dialogType==='QUERY';}},{key:"objectId",get:function get(){return this._objectId;}},{key:"open",get:function get(){return this._open;}},{key:"paneMode",get:function get(){return this._paneMode;}}]);return DialogRedirection;}(Redirection); /**
	 * *********************************
	 */var NullRedirection=exports.NullRedirection=function(_Redirection2){_inherits(NullRedirection,_Redirection2);function NullRedirection(fromDialogProperties){_classCallCheck(this,NullRedirection);var _this39=_possibleConstructorReturn(this,Object.getPrototypeOf(NullRedirection).call(this));_this39.fromDialogProperties=fromDialogProperties;return _this39;}return NullRedirection;}(Redirection); /**
	 * *********************************
	 */var WebRedirection=exports.WebRedirection=function(_Redirection3){_inherits(WebRedirection,_Redirection3);function WebRedirection(_webURL,_open,_dialogProperties,_fromDialogProperties){_classCallCheck(this,WebRedirection);var _this40=_possibleConstructorReturn(this,Object.getPrototypeOf(WebRedirection).call(this));_this40._webURL=_webURL;_this40._open=_open;_this40._dialogProperties=_dialogProperties;_this40._fromDialogProperties=_fromDialogProperties;return _this40;}_createClass(WebRedirection,[{key:"fromDialogProperties",get:function get(){return this._fromDialogProperties;},set:function set(props){this._fromDialogProperties=props;}}]);return WebRedirection;}(Redirection); /**
	 * *********************************
	 */var WorkbenchRedirection=exports.WorkbenchRedirection=function(_Redirection4){_inherits(WorkbenchRedirection,_Redirection4);function WorkbenchRedirection(_workbenchId,_dialogProperties,_fromDialogProperties){_classCallCheck(this,WorkbenchRedirection);var _this41=_possibleConstructorReturn(this,Object.getPrototypeOf(WorkbenchRedirection).call(this));_this41._workbenchId=_workbenchId;_this41._dialogProperties=_dialogProperties;_this41._fromDialogProperties=_fromDialogProperties;return _this41;}_createClass(WorkbenchRedirection,[{key:"workbenchId",get:function get(){return this._workbenchId;}},{key:"dialogProperties",get:function get(){return this._dialogProperties;}},{key:"fromDialogProperties",get:function get(){return this._fromDialogProperties;},set:function set(props){this._fromDialogProperties=props;}}]);return WorkbenchRedirection;}(Redirection);var EntityRecUtil=exports.EntityRecUtil=function(){function EntityRecUtil(){_classCallCheck(this,EntityRecUtil);}_createClass(EntityRecUtil,null,[{key:"newEntityRec",value:function newEntityRec(objectId,props,annos){return annos?new EntityRecImpl(objectId,props,annos):new EntityRecImpl(objectId,props);}},{key:"union",value:function union(l1,l2){var result=_util.ArrayUtil.copy(l1);l2.forEach(function(p2){if(!l1.some(function(p1,i){if(p1.name===p2.name){result[i]=p2;return true;}return false;})){result.push(p2);}});return result;} //module level functions
	},{key:"fromWSEditorRecord",value:function fromWSEditorRecord(otype,jsonObj){var objectId=jsonObj['objectId'];var namesJson=jsonObj['names'];if(namesJson['WS_LTYPE']!=='String'){return new _fp.Failure('fromWSEditorRecord: Expected WS_LTYPE of String but found '+namesJson['WS_LTYPE']);}var namesRaw=namesJson['values'];var propsJson=jsonObj['properties'];if(propsJson['WS_LTYPE']!=='Object'){return new _fp.Failure('fromWSEditorRecord: Expected WS_LTYPE of Object but found '+propsJson['WS_LTYPE']);}var propsRaw=propsJson['values'];var propsTry=Prop.fromWSNamesAndValues(namesRaw,propsRaw);if(propsTry.isFailure)return new _fp.Failure(propsTry.failure);var props=propsTry.success;if(jsonObj['propertyAnnotations']){var propAnnosObj=jsonObj['propertyAnnotations'];var annotatedPropsTry=DataAnno.annotatePropsUsingWSDataAnnotation(props,propAnnosObj);if(annotatedPropsTry.isFailure)return new _fp.Failure(annotatedPropsTry.failure);}var recAnnos=null;if(jsonObj['recordAnnotation']){var recAnnosTry=DataAnno.fromWS('WSDataAnnotation',jsonObj['recordAnnotation']);if(recAnnosTry.isFailure)return new _fp.Failure(recAnnosTry.failure);recAnnos=recAnnosTry.success;}return new _fp.Success(new EntityRecImpl(objectId,props,recAnnos));}}]);return EntityRecUtil;}(); /**
	 * *********************************
	 */var EntityBuffer=exports.EntityBuffer=function(){function EntityBuffer(_before,_after){_classCallCheck(this,EntityBuffer);this._before=_before;this._after=_after;if(!_before)throw new Error('_before is null in EntityBuffer');if(!_after)this._after=_before;}_createClass(EntityBuffer,[{key:"annosAtName",value:function annosAtName(propName){return this._after.annosAtName(propName);}},{key:"afterEffects",value:function afterEffects(afterAnother){if(afterAnother){return this._after.afterEffects(afterAnother);}else {return this._before.afterEffects(this._after);}}},{key:"backgroundColorFor",value:function backgroundColorFor(propName){return this._after.backgroundColorFor(propName);}},{key:"foregroundColorFor",value:function foregroundColorFor(propName){return this._after.foregroundColorFor(propName);}},{key:"imageNameFor",value:function imageNameFor(propName){return this._after.imageNameFor(propName);}},{key:"imagePlacementFor",value:function imagePlacementFor(propName){return this._after.imagePlacement;}},{key:"isBoldTextFor",value:function isBoldTextFor(propName){return this._after.isBoldTextFor(propName);}},{key:"isChanged",value:function isChanged(name){var before=this._before.propAtName(name);var after=this._after.propAtName(name);return before&&after?!before.equals(after):!(!before&&!after);}},{key:"isItalicTextFor",value:function isItalicTextFor(propName){return this._after.isItalicTextFor(propName);}},{key:"isPlacementCenterFor",value:function isPlacementCenterFor(propName){return this._after.isPlacementCenterFor(propName);}},{key:"isPlacementLeftFor",value:function isPlacementLeftFor(propName){return this._after.isPlacementLeftFor(propName);}},{key:"isPlacementRightFor",value:function isPlacementRightFor(propName){return this._after.isPlacementRightFor(propName);}},{key:"isPlacementStretchUnderFor",value:function isPlacementStretchUnderFor(propName){return this._after.isPlacementStretchUnderFor(propName);}},{key:"isPlacementUnderFor",value:function isPlacementUnderFor(propName){return this._after.isPlacementUnderFor(propName);}},{key:"isUnderlineFor",value:function isUnderlineFor(propName){return this._after.isUnderlineFor(propName);}},{key:"overrideTextFor",value:function overrideTextFor(propName){return this._after.overrideTextFor(propName);}},{key:"propAtIndex",value:function propAtIndex(index){return this.props[index];}},{key:"propAtName",value:function propAtName(propName){return this._after.propAtName(propName);}},{key:"setValue",value:function setValue(name,value){this.props.some(function(prop){if(prop.name===name){prop.value=value;return true;}return false;});}},{key:"tipTextFor",value:function tipTextFor(propName){return this._after.tipTextFor(propName);}},{key:"toEntityRec",value:function toEntityRec(){return EntityRecUtil.newEntityRec(this.objectId,this.props);}},{key:"toWSEditorRecord",value:function toWSEditorRecord(){return this.afterEffects().toWSEditorRecord();}},{key:"toWS",value:function toWS(){return this.afterEffects().toWS();}},{key:"valueAtName",value:function valueAtName(propName){return this._after.valueAtName(propName);}},{key:"after",get:function get(){return this._after;}},{key:"annos",get:function get(){return this._after.annos;}},{key:"backgroundColor",get:function get(){return this._after.backgroundColor;}},{key:"before",get:function get(){return this._before;}},{key:"foregroundColor",get:function get(){return this._after.foregroundColor;}},{key:"imageName",get:function get(){return this._after.imageName;}},{key:"imagePlacement",get:function get(){return this._after.imagePlacement;}},{key:"isBoldText",get:function get(){return this._after.isBoldText;}},{key:"isItalicText",get:function get(){return this._after.isItalicText;}},{key:"isPlacementCenter",get:function get(){return this._after.isPlacementCenter;}},{key:"isPlacementLeft",get:function get(){return this._after.isPlacementLeft;}},{key:"isPlacementRight",get:function get(){return this._after.isPlacementRight;}},{key:"isPlacementStretchUnder",get:function get(){return this._after.isPlacementStretchUnder;}},{key:"isPlacementUnder",get:function get(){return this._after.isPlacementUnder;}},{key:"isUnderline",get:function get(){return this._after.isUnderline;}},{key:"objectId",get:function get(){return this._after.objectId;}},{key:"overrideText",get:function get(){return this._after.overrideText;}},{key:"propCount",get:function get(){return this._after.propCount;}},{key:"propNames",get:function get(){return this._after.propNames;}},{key:"props",get:function get(){return this._after.props;}},{key:"propValues",get:function get(){return this._after.propValues;}},{key:"tipText",get:function get(){return this._after.tipText;}}],[{key:"createEntityBuffer",value:function createEntityBuffer(objectId,before,after){return new EntityBuffer(EntityRecUtil.newEntityRec(objectId,before),EntityRecUtil.newEntityRec(objectId,after));}}]);return EntityBuffer;}(); /**
	 * *********************************
	 */var EntityRecImpl=exports.EntityRecImpl=function(){function EntityRecImpl(objectId){var props=arguments.length<=1||arguments[1]===undefined?[]:arguments[1];var annos=arguments.length<=2||arguments[2]===undefined?[]:arguments[2];_classCallCheck(this,EntityRecImpl);this.objectId=objectId;this.props=props;this.annos=annos;}_createClass(EntityRecImpl,[{key:"annosAtName",value:function annosAtName(propName){var p=this.propAtName(propName);return p?p.annos:[];}},{key:"afterEffects",value:function afterEffects(after){var _this42=this;var effects=[];after.props.forEach(function(afterProp){var beforeProp=_this42.propAtName(afterProp.name);if(!afterProp.equals(beforeProp)){effects.push(afterProp);}});return new EntityRecImpl(after.objectId,effects);}},{key:"backgroundColorFor",value:function backgroundColorFor(propName){var p=this.propAtName(propName);return p&&p.backgroundColor?p.backgroundColor:this.backgroundColor;}},{key:"foregroundColorFor",value:function foregroundColorFor(propName){var p=this.propAtName(propName);return p&&p.foregroundColor?p.foregroundColor:this.foregroundColor;}},{key:"imageNameFor",value:function imageNameFor(propName){var p=this.propAtName(propName);return p&&p.imageName?p.imageName:this.imageName;}},{key:"imagePlacementFor",value:function imagePlacementFor(propName){var p=this.propAtName(propName);return p&&p.imagePlacement?p.imagePlacement:this.imagePlacement;}},{key:"isBoldTextFor",value:function isBoldTextFor(propName){var p=this.propAtName(propName);return p&&p.isBoldText?p.isBoldText:this.isBoldText;}},{key:"isItalicTextFor",value:function isItalicTextFor(propName){var p=this.propAtName(propName);return p&&p.isItalicText?p.isItalicText:this.isItalicText;}},{key:"isPlacementCenterFor",value:function isPlacementCenterFor(propName){var p=this.propAtName(propName);return p&&p.isPlacementCenter?p.isPlacementCenter:this.isPlacementCenter;}},{key:"isPlacementLeftFor",value:function isPlacementLeftFor(propName){var p=this.propAtName(propName);return p&&p.isPlacementLeft?p.isPlacementLeft:this.isPlacementLeft;}},{key:"isPlacementRightFor",value:function isPlacementRightFor(propName){var p=this.propAtName(propName);return p&&p.isPlacementRight?p.isPlacementRight:this.isPlacementRight;}},{key:"isPlacementStretchUnderFor",value:function isPlacementStretchUnderFor(propName){var p=this.propAtName(propName);return p&&p.isPlacementStretchUnder?p.isPlacementStretchUnder:this.isPlacementStretchUnder;}},{key:"isPlacementUnderFor",value:function isPlacementUnderFor(propName){var p=this.propAtName(propName);return p&&p.isPlacementUnder?p.isPlacementUnder:this.isPlacementUnder;}},{key:"isUnderlineFor",value:function isUnderlineFor(propName){var p=this.propAtName(propName);return p&&p.isUnderline?p.isUnderline:this.isUnderline;}},{key:"overrideTextFor",value:function overrideTextFor(propName){var p=this.propAtName(propName);return p&&p.overrideText?p.overrideText:this.overrideText;}},{key:"propAtIndex",value:function propAtIndex(index){return this.props[index];}},{key:"propAtName",value:function propAtName(propName){var prop=null;this.props.some(function(p){if(p.name===propName){prop=p;return true;}return false;});return prop;}},{key:"tipTextFor",value:function tipTextFor(propName){var p=this.propAtName(propName);return p&&p.tipText?p.tipText:this.tipText;}},{key:"toEntityRec",value:function toEntityRec(){return this;}},{key:"toWSEditorRecord",value:function toWSEditorRecord(){var result={'WS_OTYPE':'WSEditorRecord'};if(this.objectId)result['objectId']=this.objectId;result['names']=Prop.toWSListOfString(this.propNames);result['properties']=Prop.toWSListOfProperties(this.propValues);return result;}},{key:"toWS",value:function toWS(){var result={'WS_OTYPE':'WSEntityRec'};if(this.objectId)result['objectId']=this.objectId;result['props']=Prop.toListOfWSProp(this.props);if(this.annos)result['annos']=DataAnno.toListOfWSDataAnno(this.annos);return result;}},{key:"valueAtName",value:function valueAtName(propName){var value=null;this.props.some(function(p){if(p.name===propName){value=p.value;return true;}return false;});return value;}},{key:"backgroundColor",get:function get(){return DataAnno.backgroundColor(this.annos);}},{key:"foregroundColor",get:function get(){return DataAnno.foregroundColor(this.annos);}},{key:"imageName",get:function get(){return DataAnno.imageName(this.annos);}},{key:"imagePlacement",get:function get(){return DataAnno.imagePlacement(this.annos);}},{key:"isBoldText",get:function get(){return DataAnno.isBoldText(this.annos);}},{key:"isItalicText",get:function get(){return DataAnno.isItalicText(this.annos);}},{key:"isPlacementCenter",get:function get(){return DataAnno.isPlacementCenter(this.annos);}},{key:"isPlacementLeft",get:function get(){return DataAnno.isPlacementLeft(this.annos);}},{key:"isPlacementRight",get:function get(){return DataAnno.isPlacementRight(this.annos);}},{key:"isPlacementStretchUnder",get:function get(){return DataAnno.isPlacementStretchUnder(this.annos);}},{key:"isPlacementUnder",get:function get(){return DataAnno.isPlacementUnder(this.annos);}},{key:"isUnderline",get:function get(){return DataAnno.isUnderlineText(this.annos);}},{key:"overrideText",get:function get(){return DataAnno.overrideText(this.annos);}},{key:"propCount",get:function get(){return this.props.length;}},{key:"propNames",get:function get(){return this.props.map(function(p){return p.name;});}},{key:"propValues",get:function get(){return this.props.map(function(p){return p.value;});}},{key:"tipText",get:function get(){return DataAnno.tipText(this.annos);}}]);return EntityRecImpl;}(); /**
	 * *********************************
	 */var NullEntityRec=exports.NullEntityRec=function(){function NullEntityRec(){_classCallCheck(this,NullEntityRec);}_createClass(NullEntityRec,[{key:"annosAtName",value:function annosAtName(propName){return [];}},{key:"afterEffects",value:function afterEffects(after){return after;}},{key:"backgroundColorFor",value:function backgroundColorFor(propName){return null;}},{key:"foregroundColorFor",value:function foregroundColorFor(propName){return null;}},{key:"imageNameFor",value:function imageNameFor(propName){return null;}},{key:"imagePlacementFor",value:function imagePlacementFor(propName){return null;}},{key:"isBoldTextFor",value:function isBoldTextFor(propName){return false;}},{key:"isItalicTextFor",value:function isItalicTextFor(propName){return false;}},{key:"isPlacementCenterFor",value:function isPlacementCenterFor(propName){return false;}},{key:"isPlacementLeftFor",value:function isPlacementLeftFor(propName){return false;}},{key:"isPlacementRightFor",value:function isPlacementRightFor(propName){return false;}},{key:"isPlacementStretchUnderFor",value:function isPlacementStretchUnderFor(propName){return false;}},{key:"isPlacementUnderFor",value:function isPlacementUnderFor(propName){return false;}},{key:"isUnderlineFor",value:function isUnderlineFor(propName){return false;}},{key:"overrideTextFor",value:function overrideTextFor(propName){return null;}},{key:"propAtIndex",value:function propAtIndex(index){return null;}},{key:"propAtName",value:function propAtName(propName){return null;}},{key:"tipTextFor",value:function tipTextFor(propName){return null;}},{key:"toEntityRec",value:function toEntityRec(){return this;}},{key:"toWSEditorRecord",value:function toWSEditorRecord(){var result={'WS_OTYPE':'WSEditorRecord'};if(this.objectId)result['objectId']=this.objectId;result['names']=Prop.toWSListOfString(this.propNames);result['properties']=Prop.toWSListOfProperties(this.propValues);return result;}},{key:"toWS",value:function toWS(){var result={'WS_OTYPE':'WSEntityRec'};if(this.objectId)result['objectId']=this.objectId;result['props']=Prop.toListOfWSProp(this.props);if(this.annos)result['annos']=DataAnno.toListOfWSDataAnno(this.annos);return result;}},{key:"valueAtName",value:function valueAtName(propName){return null;}},{key:"annos",get:function get(){return [];}},{key:"backgroundColor",get:function get(){return null;}},{key:"foregroundColor",get:function get(){return null;}},{key:"imageName",get:function get(){return null;}},{key:"imagePlacement",get:function get(){return null;}},{key:"isBoldText",get:function get(){return false;}},{key:"isItalicText",get:function get(){return false;}},{key:"isPlacementCenter",get:function get(){return false;}},{key:"isPlacementLeft",get:function get(){return false;}},{key:"isPlacementRight",get:function get(){return false;}},{key:"isPlacementStretchUnder",get:function get(){return false;}},{key:"isPlacementUnder",get:function get(){return false;}},{key:"isUnderline",get:function get(){return false;}},{key:"objectId",get:function get(){return null;}},{key:"overrideText",get:function get(){return null;}},{key:"propCount",get:function get(){return 0;}},{key:"propNames",get:function get(){return [];}},{key:"props",get:function get(){return [];}},{key:"propValues",get:function get(){return [];}},{key:"tipText",get:function get(){return null;}}]);return NullEntityRec;}();NullEntityRec.singleton=new NullEntityRec(); /**
	 * *********************************
	 */var AppContextState;(function(AppContextState){AppContextState[AppContextState["LOGGED_OUT"]=0]="LOGGED_OUT";AppContextState[AppContextState["LOGGED_IN"]=1]="LOGGED_IN";})(AppContextState||(AppContextState={}));var AppContextValues=function AppContextValues(sessionContext,appWinDef,tenantSettings){_classCallCheck(this,AppContextValues);this.sessionContext=sessionContext;this.appWinDef=appWinDef;this.tenantSettings=tenantSettings;};var AppContext=exports.AppContext=function(){function AppContext(){_classCallCheck(this,AppContext);if(AppContext._singleton){throw new Error("Singleton instance already created");}this._deviceProps=[];this.setAppContextStateToLoggedOut();AppContext._singleton=this;}_createClass(AppContext,[{key:"getWorkbench",value:function getWorkbench(sessionContext,workbenchId){if(this._appContextState===AppContextState.LOGGED_OUT){return _fp.Future.createFailedFuture("AppContext::getWorkbench","User is logged out");}return WorkbenchService.getWorkbench(sessionContext,workbenchId);}},{key:"login",value:function login(gatewayHost,tenantId,clientType,userId,password){var _this43=this;if(this._appContextState===AppContextState.LOGGED_IN){return _fp.Future.createFailedFuture("AppContext::login","User is already logged in");}var answer;var appContextValuesFr=this.loginOnline(gatewayHost,tenantId,clientType,userId,password,this.deviceProps);return appContextValuesFr.bind(function(appContextValues){_this43.setAppContextStateToLoggedIn(appContextValues);return _fp.Future.createSuccessfulFuture('AppContext::login',appContextValues.appWinDef);});}},{key:"loginDirectly",value:function loginDirectly(url,tenantId,clientType,userId,password){var _this44=this;if(this._appContextState===AppContextState.LOGGED_IN){return _fp.Future.createFailedFuture("AppContext::loginDirectly","User is already logged in");}return this.loginFromSystemContext(new SystemContextImpl(url),tenantId,userId,password,this.deviceProps,clientType).bind(function(appContextValues){_this44.setAppContextStateToLoggedIn(appContextValues);return _fp.Future.createSuccessfulFuture('AppContext::loginDirectly',appContextValues.appWinDef);});}},{key:"logout",value:function logout(){if(this._appContextState===AppContextState.LOGGED_OUT){return _fp.Future.createFailedFuture("AppContext::loginDirectly","User is already logged out");}var result=SessionService.deleteSession(this.sessionContextTry.success);result.onComplete(function(deleteSessionTry){if(deleteSessionTry.isFailure){_util.Log.error('Error while logging out: '+_util.ObjUtil.formatRecAttr(deleteSessionTry.failure));}});this.setAppContextStateToLoggedOut();return result;}},{key:"performLaunchAction",value:function performLaunchAction(launchAction){if(this._appContextState===AppContextState.LOGGED_OUT){return _fp.Future.createFailedFuture("AppContext::performLaunchAction","User is logged out");}return this.performLaunchActionOnline(launchAction,this.sessionContextTry.success);}},{key:"refreshContext",value:function refreshContext(sessionContext){var _this45=this;var deviceProps=arguments.length<=1||arguments[1]===undefined?[]:arguments[1];var appContextValuesFr=this.finalizeContext(sessionContext,deviceProps);return appContextValuesFr.bind(function(appContextValues){_this45.setAppContextStateToLoggedIn(appContextValues);return _fp.Future.createSuccessfulFuture('AppContext::login',appContextValues.appWinDef);});}},{key:"finalizeContext",value:function finalizeContext(sessionContext,deviceProps){var devicePropName="com.catavolt.session.property.DeviceProperties";return SessionService.setSessionListProperty(devicePropName,deviceProps,sessionContext).bind(function(setPropertyListResult){var listPropName="com.catavolt.session.property.TenantProperties";return SessionService.getSessionListProperty(listPropName,sessionContext).bind(function(listPropertyResult){return WorkbenchService.getAppWinDef(sessionContext).bind(function(appWinDef){return _fp.Future.createSuccessfulFuture("AppContextCore:loginFromSystemContext",new AppContextValues(sessionContext,appWinDef,listPropertyResult.valuesAsDictionary()));});});});}},{key:"loginOnline",value:function loginOnline(gatewayHost,tenantId,clientType,userId,password,deviceProps){var _this46=this;var systemContextFr=this.newSystemContextFr(gatewayHost,tenantId);return systemContextFr.bind(function(sc){return _this46.loginFromSystemContext(sc,tenantId,userId,password,deviceProps,clientType);});}},{key:"loginFromSystemContext",value:function loginFromSystemContext(systemContext,tenantId,userId,password,deviceProps,clientType){var _this47=this;var sessionContextFuture=SessionService.createSession(tenantId,userId,password,clientType,systemContext);return sessionContextFuture.bind(function(sessionContext){return _this47.finalizeContext(sessionContext,deviceProps);});}},{key:"newSystemContextFr",value:function newSystemContextFr(gatewayHost,tenantId){var serviceEndpoint=GatewayService.getServiceEndpoint(tenantId,'soi-json',gatewayHost);return serviceEndpoint.map(function(serviceEndpoint){return new SystemContextImpl(serviceEndpoint.serverAssignment);});}},{key:"performLaunchActionOnline",value:function performLaunchActionOnline(launchAction,sessionContext){var redirFr=WorkbenchService.performLaunchAction(launchAction.id,launchAction.workbenchId,sessionContext);return redirFr.bind(function(r){return NavRequestUtil.fromRedirection(r,launchAction,sessionContext);});}},{key:"setAppContextStateToLoggedIn",value:function setAppContextStateToLoggedIn(appContextValues){this._appWinDefTry=new _fp.Success(appContextValues.appWinDef);this._tenantSettingsTry=new _fp.Success(appContextValues.tenantSettings);this._sessionContextTry=new _fp.Success(appContextValues.sessionContext);this._appContextState=AppContextState.LOGGED_IN;}},{key:"setAppContextStateToLoggedOut",value:function setAppContextStateToLoggedOut(){this._appWinDefTry=new _fp.Failure("Not logged in");this._tenantSettingsTry=new _fp.Failure('Not logged in"');this._sessionContextTry=new _fp.Failure('Not loggged in');this._appContextState=AppContextState.LOGGED_OUT;}},{key:"appWinDefTry",get:function get(){return this._appWinDefTry;}},{key:"deviceProps",get:function get(){return this._deviceProps;}},{key:"isLoggedIn",get:function get(){return this._appContextState===AppContextState.LOGGED_IN;}},{key:"sessionContextTry",get:function get(){return this._sessionContextTry;}},{key:"tenantSettingsTry",get:function get(){return this._tenantSettingsTry;}}],[{key:"defaultTTLInMillis",get:function get(){return AppContext.ONE_DAY_IN_MILLIS;}},{key:"singleton",get:function get(){if(!AppContext._singleton){AppContext._singleton=new AppContext();}return AppContext._singleton;}}]);return AppContext;}();AppContext.ONE_DAY_IN_MILLIS=60*60*24*1000; /**
	 * *********************************
	 */var AppWinDef=exports.AppWinDef=function(){function AppWinDef(workbenches,appVendors,windowTitle,windowWidth,windowHeight){_classCallCheck(this,AppWinDef);this._workbenches=workbenches||[];this._applicationVendors=appVendors||[];this._windowTitle=windowTitle;this._windowWidth=windowWidth;this._windowHeight=windowHeight;}_createClass(AppWinDef,[{key:"appVendors",get:function get(){return this._applicationVendors;}},{key:"windowHeight",get:function get(){return this._windowHeight;}},{key:"windowTitle",get:function get(){return this._windowTitle;}},{key:"windowWidth",get:function get(){return this._windowWidth;}},{key:"workbenches",get:function get(){return this._workbenches;}}]);return AppWinDef;}(); /**
	 * *********************************
	 */ /*
	 @TODO

	 Test all of the deserialization methods
	 They should all be handled, but the cover many of the edge cases (i.e. List<List<CellDef>>)
	 */var CellDef=exports.CellDef=function(){function CellDef(_values){_classCallCheck(this,CellDef);this._values=_values;}_createClass(CellDef,[{key:"values",get:function get(){return this._values;}}]);return CellDef;}(); /**
	 * *********************************
	 */var CodeRef=exports.CodeRef=function(){function CodeRef(_code,_description){_classCallCheck(this,CodeRef);this._code=_code;this._description=_description;}_createClass(CodeRef,[{key:"toString",value:function toString(){return this.code+":"+this.description;}},{key:"code",get:function get(){return this._code;}},{key:"description",get:function get(){return this._description;}}],[{key:"fromFormattedValue",value:function fromFormattedValue(value){var pair=_util.StringUtil.splitSimpleKeyValuePair(value);return new CodeRef(pair[0],pair[1]);}}]);return CodeRef;}(); /**
	 * *********************************
	 */var ColumnDef=exports.ColumnDef=function(){function ColumnDef(_name,_heading,_propertyDef){_classCallCheck(this,ColumnDef);this._name=_name;this._heading=_heading;this._propertyDef=_propertyDef;}_createClass(ColumnDef,[{key:"heading",get:function get(){return this._heading;}},{key:"isInlineMediaStyle",get:function get(){return this._propertyDef.isInlineMediaStyle;}},{key:"name",get:function get(){return this._name;}},{key:"propertyDef",get:function get(){return this._propertyDef;}}]);return ColumnDef;}(); /**
	 * *********************************
	 */var ContextAction=exports.ContextAction=function(){function ContextAction(actionId,objectId,fromActionSource){_classCallCheck(this,ContextAction);this.actionId=actionId;this.objectId=objectId;this.fromActionSource=fromActionSource;}_createClass(ContextAction,[{key:"virtualPathSuffix",get:function get(){return [this.objectId,this.actionId];}}]);return ContextAction;}(); /**
	 * *********************************
	 */var DataAnno=exports.DataAnno=function(){function DataAnno(_name,_value){_classCallCheck(this,DataAnno);this._name=_name;this._value=_value;}_createClass(DataAnno,[{key:"equals",value:function equals(dataAnno){return this.name===dataAnno.name;}},{key:"toWS",value:function toWS(){return {'WS_OTYPE':'WSDataAnno','name':this.name,'value':this.value};}},{key:"backgroundColor",get:function get(){return this.isBackgroundColor?this.value:null;}},{key:"foregroundColor",get:function get(){return this.isForegroundColor?this.value:null;}},{key:"isBackgroundColor",get:function get(){return this.name===DataAnno.BACKGROUND_COLOR;}},{key:"isBoldText",get:function get(){return this.name===DataAnno.BOLD_TEXT&&this.value===DataAnno.TRUE_VALUE;}},{key:"isForegroundColor",get:function get(){return this.name===DataAnno.FOREGROUND_COLOR;}},{key:"isImageName",get:function get(){return this.name===DataAnno.IMAGE_NAME;}},{key:"isImagePlacement",get:function get(){return this.name===DataAnno.IMAGE_PLACEMENT;}},{key:"isItalicText",get:function get(){return this.name===DataAnno.ITALIC_TEXT&&this.value===DataAnno.TRUE_VALUE;}},{key:"isOverrideText",get:function get(){return this.name===DataAnno.OVERRIDE_TEXT;}},{key:"isPlacementCenter",get:function get(){return this.isImagePlacement&&this.value===DataAnno.PLACEMENT_CENTER;}},{key:"isPlacementLeft",get:function get(){return this.isImagePlacement&&this.value===DataAnno.PLACEMENT_LEFT;}},{key:"isPlacementRight",get:function get(){return this.isImagePlacement&&this.value===DataAnno.PLACEMENT_RIGHT;}},{key:"isPlacementStretchUnder",get:function get(){return this.isImagePlacement&&this.value===DataAnno.PLACEMENT_STRETCH_UNDER;}},{key:"isPlacementUnder",get:function get(){return this.isImagePlacement&&this.value===DataAnno.PLACEMENT_UNDER;}},{key:"isTipText",get:function get(){return this.name===DataAnno.TIP_TEXT;}},{key:"isUnderlineText",get:function get(){return this.name===DataAnno.UNDERLINE&&this.value===DataAnno.TRUE_VALUE;}},{key:"name",get:function get(){return this._name;}},{key:"value",get:function get(){return this._value;}}],[{key:"annotatePropsUsingWSDataAnnotation",value:function annotatePropsUsingWSDataAnnotation(props,jsonObj){return DialogTriple.fromListOfWSDialogObject(jsonObj,'WSDataAnnotation',OType.factoryFn).bind(function(propAnnos){var annotatedProps=[];for(var i=0;i<props.length;i++){var p=props[i];var annos=propAnnos[i];if(annos){annotatedProps.push(new Prop(p.name,p.value,annos));}else {annotatedProps.push(p);}}return new _fp.Success(annotatedProps);});}},{key:"backgroundColor",value:function backgroundColor(annos){var result=_util.ArrayUtil.find(annos,function(anno){return anno.isBackgroundColor;});return result?result.backgroundColor:null;}},{key:"foregroundColor",value:function foregroundColor(annos){var result=_util.ArrayUtil.find(annos,function(anno){return anno.isForegroundColor;});return result?result.foregroundColor:null;}},{key:"fromWS",value:function fromWS(otype,jsonObj){var stringObj=jsonObj['annotations'];if(stringObj['WS_LTYPE']!=='String'){return new _fp.Failure('DataAnno:fromWS: expected WS_LTYPE of String but found '+stringObj['WS_LTYPE']);}var annoStrings=stringObj['values'];var annos=[];for(var i=0;i<annoStrings.length;i++){annos.push(DataAnno.parseString(annoStrings[i]));}return new _fp.Success(annos);}},{key:"imageName",value:function imageName(annos){var result=_util.ArrayUtil.find(annos,function(anno){return anno.isImageName;});return result?result.value:null;}},{key:"imagePlacement",value:function imagePlacement(annos){var result=_util.ArrayUtil.find(annos,function(anno){return anno.isImagePlacement;});return result?result.value:null;}},{key:"isBoldText",value:function isBoldText(annos){return annos.some(function(anno){return anno.isBoldText;});}},{key:"isItalicText",value:function isItalicText(annos){return annos.some(function(anno){return anno.isItalicText;});}},{key:"isPlacementCenter",value:function isPlacementCenter(annos){return annos.some(function(anno){return anno.isPlacementCenter;});}},{key:"isPlacementLeft",value:function isPlacementLeft(annos){return annos.some(function(anno){return anno.isPlacementLeft;});}},{key:"isPlacementRight",value:function isPlacementRight(annos){return annos.some(function(anno){return anno.isPlacementRight;});}},{key:"isPlacementStretchUnder",value:function isPlacementStretchUnder(annos){return annos.some(function(anno){return anno.isPlacementStretchUnder;});}},{key:"isPlacementUnder",value:function isPlacementUnder(annos){return annos.some(function(anno){return anno.isPlacementUnder;});}},{key:"isUnderlineText",value:function isUnderlineText(annos){return annos.some(function(anno){return anno.isUnderlineText;});}},{key:"overrideText",value:function overrideText(annos){var result=_util.ArrayUtil.find(annos,function(anno){return anno.isOverrideText;});return result?result.value:null;}},{key:"tipText",value:function tipText(annos){var result=_util.ArrayUtil.find(annos,function(anno){return anno.isTipText;});return result?result.value:null;}},{key:"toListOfWSDataAnno",value:function toListOfWSDataAnno(annos){var result={'WS_LTYPE':'WSDataAnno'};var values=[];annos.forEach(function(anno){values.push(anno.toWS());});result['values']=values;return result;}},{key:"parseString",value:function parseString(formatted){var pair=_util.StringUtil.splitSimpleKeyValuePair(formatted);return new DataAnno(pair[0],pair[1]);}}]);return DataAnno;}();DataAnno.BOLD_TEXT="BOLD_TEXT";DataAnno.BACKGROUND_COLOR="BGND_COLOR";DataAnno.FOREGROUND_COLOR="FGND_COLOR";DataAnno.IMAGE_NAME="IMAGE_NAME";DataAnno.IMAGE_PLACEMENT="IMAGE_PLACEMENT";DataAnno.ITALIC_TEXT="ITALIC_TEXT";DataAnno.OVERRIDE_TEXT="OVRD_TEXT";DataAnno.TIP_TEXT="TIP_TEXT";DataAnno.UNDERLINE="UNDERLINE";DataAnno.TRUE_VALUE="1";DataAnno.PLACEMENT_CENTER="CENTER";DataAnno.PLACEMENT_LEFT="LEFT";DataAnno.PLACEMENT_RIGHT="RIGHT";DataAnno.PLACEMENT_UNDER="UNDER";DataAnno.PLACEMENT_STRETCH_UNDER="STRETCH_UNDER"; /**
	 * *********************************
	 */var DialogHandle=exports.DialogHandle=function DialogHandle(handleValue,sessionHandle){_classCallCheck(this,DialogHandle);this.handleValue=handleValue;this.sessionHandle=sessionHandle;}; /**
	 * *********************************
	 */var DialogService=exports.DialogService=function(){function DialogService(){_classCallCheck(this,DialogService);}_createClass(DialogService,null,[{key:"changePaneMode",value:function changePaneMode(dialogHandle,paneMode,sessionContext){var method='changePaneMode';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),'paneMode':PaneMode[paneMode]};var call=_ws.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture('changePaneMode',DialogTriple.fromWSDialogObject(result,'WSChangePaneModeResult',OType.factoryFn));});}},{key:"closeEditorModel",value:function closeEditorModel(dialogHandle,sessionContext){var method='close';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=_ws.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createSuccessfulFuture('closeEditorModel',result);});}},{key:"getAvailableValues",value:function getAvailableValues(dialogHandle,propertyName,pendingWrites,sessionContext){var method='getAvailableValues';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),'propertyName':propertyName};if(pendingWrites)params['pendingWrites']=pendingWrites.toWSEditorRecord();var call=_ws.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture('getAvailableValues',DialogTriple.fromWSDialogObject(result,'WSGetAvailableValuesResult',OType.factoryFn));});}},{key:"getActiveColumnDefs",value:function getActiveColumnDefs(dialogHandle,sessionContext){var method='getActiveColumnDefs';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=_ws.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture('getActiveColumnDefs',DialogTriple.fromWSDialogObject(result,'WSGetActiveColumnDefsResult',OType.factoryFn));});}},{key:"getEditorModelMenuDefs",value:function getEditorModelMenuDefs(dialogHandle,sessionContext){var method='getMenuDefs';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=_ws.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture('getEditorModelMenuDefs',DialogTriple.fromWSDialogObjectsResult(result,'WSGetMenuDefsResult','WSMenuDef','menuDefs',OType.factoryFn));});}},{key:"getEditorModelPaneDef",value:function getEditorModelPaneDef(dialogHandle,paneId,sessionContext){var method='getPaneDef';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};params['paneId']=paneId;var call=_ws.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture('getEditorModelPaneDef',DialogTriple.fromWSDialogObjectResult(result,'WSGetPaneDefResult','WSPaneDef','paneDef',OType.factoryFn));});}},{key:"getQueryModelMenuDefs",value:function getQueryModelMenuDefs(dialogHandle,sessionContext){var method='getMenuDefs';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=_ws.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture('getQueryModelMenuDefs',DialogTriple.fromWSDialogObjectsResult(result,'WSGetMenuDefsResult','WSMenuDef','menuDefs',OType.factoryFn));});}},{key:"openEditorModelFromRedir",value:function openEditorModelFromRedir(redirection,sessionContext){var method='open2';var params={'editorMode':redirection.dialogMode,'dialogHandle':OType.serializeObject(redirection.dialogHandle,'WSDialogHandle')};if(redirection.objectId)params['objectId']=redirection.objectId;var call=_ws.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture('openEditorModelFromRedir',DialogTriple.fromWSDialogObject(result,'WSOpenEditorModelResult',OType.factoryFn));});}},{key:"openQueryModelFromRedir",value:function openQueryModelFromRedir(redirection,sessionContext){if(!redirection.isQuery)return _fp.Future.createFailedFuture('DialogService::openQueryModelFromRedir','Redirection must be a query');var method='open';var params={'dialogHandle':OType.serializeObject(redirection.dialogHandle,'WSDialogHandle')};var call=_ws.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture('openQueryModelFromRedir',DialogTriple.fromWSDialogObject(result,'WSOpenQueryModelResult',OType.factoryFn));});}},{key:"performEditorAction",value:function performEditorAction(dialogHandle,actionId,pendingWrites,sessionContext){var method='performAction';var params={'actionId':actionId,'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};if(pendingWrites)params['pendingWrites']=pendingWrites.toWSEditorRecord();var call=_ws.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){var redirectionTry=DialogTriple.extractRedirection(result,'WSPerformActionResult');if(redirectionTry.isSuccess){var r=redirectionTry.success;r.fromDialogProperties=result['dialogProperties'];redirectionTry=new _fp.Success(r);}return _fp.Future.createCompletedFuture('performEditorAction',redirectionTry);});}},{key:"performQueryAction",value:function performQueryAction(dialogHandle,actionId,targets,sessionContext){var method='performAction';var params={'actionId':actionId,'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};if(targets){params['targets']=targets;}var call=_ws.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){var redirectionTry=DialogTriple.extractRedirection(result,'WSPerformActionResult');if(redirectionTry.isSuccess){var r=redirectionTry.success;r.fromDialogProperties=result['dialogProperties'];redirectionTry=new _fp.Success(r);}return _fp.Future.createCompletedFuture('performQueryAction',redirectionTry);});}},{key:"processSideEffects",value:function processSideEffects(dialogHandle,sessionContext,propertyName,propertyValue,pendingWrites){var method='handlePropertyChange';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),'propertyName':propertyName,'propertyValue':Prop.toWSProperty(propertyValue),'pendingWrites':pendingWrites.toWSEditorRecord()};var call=_ws.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture('processSideEffects',DialogTriple.fromWSDialogObject(result,'WSHandlePropertyChangeResult',OType.factoryFn));});}},{key:"queryQueryModel",value:function queryQueryModel(dialogHandle,direction,maxRows,fromObjectId,sessionContext){var method='query';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),'maxRows':maxRows,'direction':direction===QueryDirection.BACKWARD?'BACKWARD':'FORWARD'};if(fromObjectId&&fromObjectId.trim()!==''){params['fromObjectId']=fromObjectId.trim();}_util.Log.info('Running query');var call=_ws.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){var call=_ws.Call.createCall(DialogService.QUERY_SERVICE_PATH,method,params,sessionContext);return _fp.Future.createCompletedFuture('DialogService::queryQueryModel',DialogTriple.fromWSDialogObject(result,'WSQueryResult',OType.factoryFn));});}},{key:"readEditorModel",value:function readEditorModel(dialogHandle,sessionContext){var method='read';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle')};var call=_ws.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture('readEditorModel',DialogTriple.fromWSDialogObject(result,'WSReadResult',OType.factoryFn));});}},{key:"writeEditorModel",value:function writeEditorModel(dialogHandle,entityRec,sessionContext){var method='write';var params={'dialogHandle':OType.serializeObject(dialogHandle,'WSDialogHandle'),'editorRecord':entityRec.toWSEditorRecord()};var call=_ws.Call.createCall(DialogService.EDITOR_SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){var writeResultTry=DialogTriple.fromWSDialogObject(result,'WSWriteResult',OType.factoryFn);if(writeResultTry.isSuccess&&writeResultTry.success.isLeft){var redirection=writeResultTry.success.left;redirection.fromDialogProperties=result['dialogProperties']||{};writeResultTry=new _fp.Success(_fp.Either.left(redirection));}return _fp.Future.createCompletedFuture('writeEditorModel',writeResultTry);});}}]);return DialogService;}();DialogService.EDITOR_SERVICE_NAME='EditorService';DialogService.EDITOR_SERVICE_PATH='soi-json-v02/'+DialogService.EDITOR_SERVICE_NAME;DialogService.QUERY_SERVICE_NAME='QueryService';DialogService.QUERY_SERVICE_PATH='soi-json-v02/'+DialogService.QUERY_SERVICE_NAME; /**
	 * *********************************
	 */var DialogTriple=exports.DialogTriple=function(){function DialogTriple(){_classCallCheck(this,DialogTriple);}_createClass(DialogTriple,null,[{key:"extractList",value:function extractList(jsonObject,Ltype,extractor){var result;if(jsonObject){var lt=jsonObject['WS_LTYPE'];if(Ltype===lt){if(jsonObject['values']){var realValues=[];var values=jsonObject['values'];values.every(function(item){var extdValue=extractor(item);if(extdValue.isFailure){result=new _fp.Failure(extdValue.failure);return false;}realValues.push(extdValue.success);return true;});if(!result){result=new _fp.Success(realValues);}}else {result=new _fp.Failure("DialogTriple::extractList: Values array not found");}}else {result=new _fp.Failure("DialogTriple::extractList: Expected WS_LTYPE "+Ltype+" but found "+lt);}}return result;}},{key:"extractRedirection",value:function extractRedirection(jsonObject,Otype){var tripleTry=DialogTriple._extractTriple(jsonObject,Otype,false,function(){return new _fp.Success(new NullRedirection({}));});var answer;if(tripleTry.isSuccess){var triple=tripleTry.success;answer=triple.isLeft?new _fp.Success(triple.left):new _fp.Success(triple.right);}else {answer=new _fp.Failure(tripleTry.failure);}return answer;}},{key:"extractTriple",value:function extractTriple(jsonObject,Otype,extractor){return DialogTriple._extractTriple(jsonObject,Otype,false,extractor);}},{key:"extractValue",value:function extractValue(jsonObject,Otype,extractor){return DialogTriple._extractValue(jsonObject,Otype,false,extractor);}},{key:"extractValueIgnoringRedirection",value:function extractValueIgnoringRedirection(jsonObject,Otype,extractor){return DialogTriple._extractValue(jsonObject,Otype,true,extractor);}},{key:"fromWSDialogObject",value:function fromWSDialogObject(obj,Otype,factoryFn){var ignoreRedirection=arguments.length<=3||arguments[3]===undefined?false:arguments[3];if(!obj){return new _fp.Failure('DialogTriple::fromWSDialogObject: Cannot extract from null value');}else if((typeof obj==="undefined"?"undefined":_typeof(obj))!=='object'){return new _fp.Success(obj);}try{if(!factoryFn){ /* Assume we're just going to coerce the exiting object */return DialogTriple.extractValue(obj,Otype,function(){return new _fp.Success(obj);});}else {if(ignoreRedirection){return DialogTriple.extractValueIgnoringRedirection(obj,Otype,function(){return OType.deserializeObject(obj,Otype,factoryFn);});}else {return DialogTriple.extractValue(obj,Otype,function(){return OType.deserializeObject(obj,Otype,factoryFn);});}}}catch(e){return new _fp.Failure('DialogTriple::fromWSDialogObject: '+e.name+": "+e.message);}}},{key:"fromListOfWSDialogObject",value:function fromListOfWSDialogObject(jsonObject,Ltype,factoryFn){var ignoreRedirection=arguments.length<=3||arguments[3]===undefined?false:arguments[3];return DialogTriple.extractList(jsonObject,Ltype,function(value){ /*note - we could add a check here to make sure the otype 'is a' ltype, to enforce the generic constraint
	             i.e. list items should be lype assignment compatible*/if(!value)return new _fp.Success(null);var Otype=value['WS_OTYPE']||Ltype;return DialogTriple.fromWSDialogObject(value,Otype,factoryFn,ignoreRedirection);});}},{key:"fromWSDialogObjectResult",value:function fromWSDialogObjectResult(jsonObject,resultOtype,targetOtype,objPropName,factoryFn){return DialogTriple.extractValue(jsonObject,resultOtype,function(){return DialogTriple.fromWSDialogObject(jsonObject[objPropName],targetOtype,factoryFn);});}},{key:"fromWSDialogObjectsResult",value:function fromWSDialogObjectsResult(jsonObject,resultOtype,targetLtype,objPropName,factoryFn){return DialogTriple.extractValue(jsonObject,resultOtype,function(){return DialogTriple.fromListOfWSDialogObject(jsonObject[objPropName],targetLtype,factoryFn);});}},{key:"_extractTriple",value:function _extractTriple(jsonObject,Otype,ignoreRedirection,extractor){if(!jsonObject){return new _fp.Failure('DialogTriple::extractTriple: cannot extract object of WS_OTYPE '+Otype+' because json object is null');}else {if(Array.isArray(jsonObject)){ //verify we'll dealing with a nested List
	if(Otype.indexOf('List')!==0){return new _fp.Failure("DialogTriple::extractTriple: expected OType of List<> for Array obj");}}else {var ot=jsonObject['WS_OTYPE'];if(!ot||Otype!==ot){return new _fp.Failure('DialogTriple:extractTriple: expected O_TYPE '+Otype+' but found '+ot);}else {if(jsonObject['exception']){var dialogException=jsonObject['exception'];return new _fp.Failure(dialogException);}else if(jsonObject['redirection']&&!ignoreRedirection){var drt=DialogTriple.fromWSDialogObject(jsonObject['redirection'],'WSRedirection',OType.factoryFn);if(drt.isFailure){return new _fp.Failure(drt.failure);}else {var either=_fp.Either.left(drt.success);return new _fp.Success(either);}}}}var result;if(extractor){var valueTry=extractor();if(valueTry.isFailure){result=new _fp.Failure(valueTry.failure);}else {result=new _fp.Success(_fp.Either.right(valueTry.success));}}else {result=new _fp.Failure('DialogTriple::extractTriple: Triple is not an exception or redirection and no value extractor was provided');}return result;}}},{key:"_extractValue",value:function _extractValue(jsonObject,Otype,ignoreRedirection,extractor){var tripleTry=DialogTriple._extractTriple(jsonObject,Otype,ignoreRedirection,extractor);var result;if(tripleTry.isFailure){result=new _fp.Failure(tripleTry.failure);}else {var triple=tripleTry.success;if(triple.isLeft){result=new _fp.Failure('DialogTriple::extractValue: Unexpected redirection for O_TYPE: '+Otype);}else {result=new _fp.Success(triple.right);}}return result;}}]);return DialogTriple;}(); /**
	 * *********************************
	 */var EditorState;(function(EditorState){EditorState[EditorState["READ"]=0]="READ";EditorState[EditorState["WRITE"]=1]="WRITE";EditorState[EditorState["DESTROYED"]=2]="DESTROYED";})(EditorState||(EditorState={}));; /**
	 * *********************************
	 */var EntityRecDef=exports.EntityRecDef=function(){function EntityRecDef(_propDefs){_classCallCheck(this,EntityRecDef);this._propDefs=_propDefs;}_createClass(EntityRecDef,[{key:"propDefAtName",value:function propDefAtName(name){var propDef=null;this.propDefs.some(function(p){if(p.name===name){propDef=p;return true;}return false;});return propDef;} // Note we need to support both 'propDefs' and 'propertyDefs' as both
	// field names seem to be used in the dialog model
	},{key:"propCount",get:function get(){return this.propDefs.length;}},{key:"propDefs",get:function get(){return this._propDefs;},set:function set(propDefs){this._propDefs=propDefs;}},{key:"propertyDefs",get:function get(){return this._propDefs;},set:function set(propDefs){this._propDefs=propDefs;}},{key:"propNames",get:function get(){return this.propDefs.map(function(p){return p.name;});}}]);return EntityRecDef;}(); /**
	 * *********************************
	 */var FormContextBuilder=exports.FormContextBuilder=function(){function FormContextBuilder(_dialogRedirection,_actionSource,_sessionContext){_classCallCheck(this,FormContextBuilder);this._dialogRedirection=_dialogRedirection;this._actionSource=_actionSource;this._sessionContext=_sessionContext;}_createClass(FormContextBuilder,[{key:"build",value:function build(){var _this48=this;if(!this.dialogRedirection.isEditor){return _fp.Future.createFailedFuture('FormContextBuilder::build','Forms with a root query model are not supported');}var xOpenFr=DialogService.openEditorModelFromRedir(this._dialogRedirection,this.sessionContext);var openAllFr=xOpenFr.bind(function(formXOpen){var formXOpenFr=_fp.Future.createSuccessfulFuture('FormContext/open/openForm',formXOpen);var formXFormDefFr=_this48.fetchXFormDef(formXOpen);var formMenuDefsFr=DialogService.getEditorModelMenuDefs(formXOpen.formRedirection.dialogHandle,_this48.sessionContext);var formChildrenFr=formXFormDefFr.bind(function(xFormDef){var childrenXOpenFr=_this48.openChildren(formXOpen);var childrenXPaneDefsFr=_this48.fetchChildrenXPaneDefs(formXOpen,xFormDef);var childrenActiveColDefsFr=_this48.fetchChildrenActiveColDefs(formXOpen);var childrenMenuDefsFr=_this48.fetchChildrenMenuDefs(formXOpen);return _fp.Future.sequence([childrenXOpenFr,childrenXPaneDefsFr,childrenActiveColDefsFr,childrenMenuDefsFr]);});return _fp.Future.sequence([formXOpenFr,formXFormDefFr,formMenuDefsFr,formChildrenFr]);});return openAllFr.bind(function(value){var formDefTry=_this48.completeOpenPromise(value);var formContextTry=null;if(formDefTry.isFailure){formContextTry=new _fp.Failure(formDefTry.failure);}else {var formDef=formDefTry.success;var childContexts=_this48.createChildrenContexts(formDef);var formContext=new FormContext(_this48.dialogRedirection,_this48._actionSource,formDef,childContexts,false,false,_this48.sessionContext);formContextTry=new _fp.Success(formContext);}return _fp.Future.createCompletedFuture('FormContextBuilder::build',formContextTry);});}},{key:"completeOpenPromise",value:function completeOpenPromise(openAllResults){var flattenedTry=_fp.Try.flatten(openAllResults);if(flattenedTry.isFailure){return new _fp.Failure('FormContextBuilder::build: '+_util.ObjUtil.formatRecAttr(flattenedTry.failure));}var flattened=flattenedTry.success;if(flattened.length!=4)return new _fp.Failure('FormContextBuilder::build: Open form should have resulted in 4 elements');var formXOpen=flattened[0];var formXFormDef=flattened[1];var formMenuDefs=flattened[2];var formChildren=flattened[3];if(formChildren.length!=4)return new _fp.Failure('FormContextBuilder::build: Open form should have resulted in 3 elements for children panes');var childrenXOpens=formChildren[0];var childrenXPaneDefs=formChildren[1];var childrenXActiveColDefs=formChildren[2];var childrenMenuDefs=formChildren[3];return FormDef.fromOpenFormResult(formXOpen,formXFormDef,formMenuDefs,childrenXOpens,childrenXPaneDefs,childrenXActiveColDefs,childrenMenuDefs);}},{key:"createChildrenContexts",value:function createChildrenContexts(formDef){var result=[];formDef.childrenDefs.forEach(function(paneDef,i){if(paneDef instanceof ListDef){result.push(new ListContext(i));}else if(paneDef instanceof DetailsDef){result.push(new DetailsContext(i));}else if(paneDef instanceof MapDef){result.push(new MapContext(i));}else if(paneDef instanceof GraphDef){result.push(new GraphContext(i));}else if(paneDef instanceof CalendarDef){result.push(new CalendarContext(i));}else if(paneDef instanceof ImagePickerDef){result.push(new ImagePickerContext(i));}else if(paneDef instanceof BarcodeScanDef){result.push(new BarcodeScanContext(i));}else if(paneDef instanceof GeoFixDef){result.push(new GeoFixContext(i));}else if(paneDef instanceof GeoLocationDef){result.push(new GeoLocationContext(i));}});return result;}},{key:"fetchChildrenActiveColDefs",value:function fetchChildrenActiveColDefs(formXOpen){var _this49=this;var xComps=formXOpen.formModel.children;var seqOfFutures=xComps.map(function(xComp){if(xComp.redirection.isQuery){return DialogService.getActiveColumnDefs(xComp.redirection.dialogHandle,_this49.sessionContext);}else {return _fp.Future.createSuccessfulFuture('FormContextBuilder::fetchChildrenActiveColDefs',null);}});return _fp.Future.sequence(seqOfFutures);}},{key:"fetchChildrenMenuDefs",value:function fetchChildrenMenuDefs(formXOpen){var _this50=this;var xComps=formXOpen.formModel.children;var seqOfFutures=xComps.map(function(xComp){if(xComp.redirection.isEditor){return DialogService.getEditorModelMenuDefs(xComp.redirection.dialogHandle,_this50.sessionContext);}else {return DialogService.getQueryModelMenuDefs(xComp.redirection.dialogHandle,_this50.sessionContext);}});return _fp.Future.sequence(seqOfFutures);}},{key:"fetchChildrenXPaneDefs",value:function fetchChildrenXPaneDefs(formXOpen,xFormDef){var _this51=this;var formHandle=formXOpen.formModel.form.redirection.dialogHandle;var xRefs=xFormDef.paneDefRefs;var seqOfFutures=xRefs.map(function(xRef){return DialogService.getEditorModelPaneDef(formHandle,xRef.paneId,_this51.sessionContext);});return _fp.Future.sequence(seqOfFutures);}},{key:"fetchXFormDef",value:function fetchXFormDef(xformOpenResult){var dialogHandle=xformOpenResult.formRedirection.dialogHandle;var formPaneId=xformOpenResult.formPaneId;return DialogService.getEditorModelPaneDef(dialogHandle,formPaneId,this.sessionContext).bind(function(value){if(value instanceof XFormDef){return _fp.Future.createSuccessfulFuture('fetchXFormDef/success',value);}else {return _fp.Future.createFailedFuture('fetchXFormDef/failure','Expected reponse to contain an XFormDef but got '+_util.ObjUtil.formatRecAttr(value));}});}},{key:"openChildren",value:function openChildren(formXOpen){var _this52=this;var xComps=formXOpen.formModel.children;var seqOfFutures=[];xComps.forEach(function(nextXComp){var nextFr=null;if(nextXComp.redirection.isEditor){nextFr=DialogService.openEditorModelFromRedir(nextXComp.redirection,_this52.sessionContext);}else {nextFr=DialogService.openQueryModelFromRedir(nextXComp.redirection,_this52.sessionContext);}seqOfFutures.push(nextFr);});return _fp.Future.sequence(seqOfFutures);}},{key:"actionSource",get:function get(){return this._actionSource;}},{key:"dialogRedirection",get:function get(){return this._dialogRedirection;}},{key:"sessionContext",get:function get(){return this._sessionContext;}}]);return FormContextBuilder;}(); /**
	 * *********************************
	 */ /*
	 @TODO - current the gateway response is mocked, due to cross-domain issues
	 This should be removed (and the commented section uncommented for production!!!
	 */var GatewayService=exports.GatewayService=function(){function GatewayService(){_classCallCheck(this,GatewayService);}_createClass(GatewayService,null,[{key:"getServiceEndpoint",value:function getServiceEndpoint(tenantId,serviceName,gatewayHost){ //We have to fake this for now, due to cross domain issues
	/*
	         var fakeResponse = {
	         responseType:"soi-json",
	         tenantId:"***REMOVED***z",
	         serverAssignment:"https://dfw.catavolt.net/vs301",
	         appVersion:"1.3.262",soiVersion:"v02"
	         }

	         var endPointFuture = Future.createSuccessfulFuture<ServiceEndpoint>('serviceEndpoint', <any>fakeResponse);

	         */var f=_ws.Get.fromUrl('https://'+gatewayHost+'/'+tenantId+'/'+serviceName).perform();var endPointFuture=f.bind(function(jsonObject){ //'bounce cast' the jsonObject here to coerce into ServiceEndpoint
	return _fp.Future.createSuccessfulFuture("serviceEndpoint",jsonObject);});return endPointFuture;}}]);return GatewayService;}(); /**
	 * *********************************
	 */var GeoFix=exports.GeoFix=function(){function GeoFix(_latitude,_longitude,_source,_accuracy){_classCallCheck(this,GeoFix);this._latitude=_latitude;this._longitude=_longitude;this._source=_source;this._accuracy=_accuracy;}_createClass(GeoFix,[{key:"toString",value:function toString(){return this.latitude+":"+this.longitude;}},{key:"latitude",get:function get(){return this._latitude;}},{key:"longitude",get:function get(){return this._longitude;}},{key:"source",get:function get(){return this._source;}},{key:"accuracy",get:function get(){return this._accuracy;}}],[{key:"fromFormattedValue",value:function fromFormattedValue(value){var pair=_util.StringUtil.splitSimpleKeyValuePair(value);return new GeoFix(Number(pair[0]),Number(pair[1]),null,null);}}]);return GeoFix;}(); /**
	 * *********************************
	 */var GeoLocation=exports.GeoLocation=function(){function GeoLocation(_latitude,_longitude){_classCallCheck(this,GeoLocation);this._latitude=_latitude;this._longitude=_longitude;}_createClass(GeoLocation,[{key:"toString",value:function toString(){return this.latitude+":"+this.longitude;}},{key:"latitude",get:function get(){return this._latitude;}},{key:"longitude",get:function get(){return this._longitude;}}],[{key:"fromFormattedValue",value:function fromFormattedValue(value){var pair=_util.StringUtil.splitSimpleKeyValuePair(value);return new GeoLocation(Number(pair[0]),Number(pair[1]));}}]);return GeoLocation;}(); /**
	 * *********************************
	 */var GraphDataPointDef=exports.GraphDataPointDef=function GraphDataPointDef(_name,_type,_plotType,_legendkey){_classCallCheck(this,GraphDataPointDef);this._name=_name;this._type=_type;this._plotType=_plotType;this._legendkey=_legendkey;}; /**
	 * *********************************
	 */var MenuDef=exports.MenuDef=function(){function MenuDef(_name,_type,_actionId,_mode,_label,_iconName,_directive,_menuDefs){_classCallCheck(this,MenuDef);this._name=_name;this._type=_type;this._actionId=_actionId;this._mode=_mode;this._label=_label;this._iconName=_iconName;this._directive=_directive;this._menuDefs=_menuDefs;}_createClass(MenuDef,[{key:"findAtId",value:function findAtId(actionId){if(this.actionId===actionId)return this;var result=null;this.menuDefs.some(function(md){result=md.findAtId(actionId);return result!=null;});return result;}},{key:"actionId",get:function get(){return this._actionId;}},{key:"directive",get:function get(){return this._directive;}},{key:"iconName",get:function get(){return this._iconName;}},{key:"isPresaveDirective",get:function get(){return this._directive&&this._directive==='PRESAVE';}},{key:"isRead",get:function get(){return this._mode&&this._mode.indexOf('R')>-1;}},{key:"isSeparator",get:function get(){return this._type&&this._type==='separator';}},{key:"isWrite",get:function get(){return this._mode&&this._mode.indexOf('W')>-1;}},{key:"label",get:function get(){return this._label;}},{key:"menuDefs",get:function get(){return this._menuDefs;}},{key:"mode",get:function get(){return this._mode;}},{key:"name",get:function get(){return this._name;}},{key:"type",get:function get(){return this._type;}}]);return MenuDef;}();var NavRequestUtil=exports.NavRequestUtil=function(){function NavRequestUtil(){_classCallCheck(this,NavRequestUtil);}_createClass(NavRequestUtil,null,[{key:"fromRedirection",value:function fromRedirection(redirection,actionSource,sessionContext){var result;if(redirection instanceof WebRedirection){result=_fp.Future.createSuccessfulFuture('NavRequest::fromRedirection',redirection);}else if(redirection instanceof WorkbenchRedirection){var wbr=redirection;result=AppContext.singleton.getWorkbench(sessionContext,wbr.workbenchId).map(function(wb){return wb;});}else if(redirection instanceof DialogRedirection){var dr=redirection;var fcb=new FormContextBuilder(dr,actionSource,sessionContext);result=fcb.build();}else if(redirection instanceof NullRedirection){var nullRedir=redirection;var nullNavRequest=new NullNavRequest();_util.ObjUtil.addAllProps(nullRedir.fromDialogProperties,nullNavRequest.fromDialogProperties);result=_fp.Future.createSuccessfulFuture('NavRequest:fromRedirection/nullRedirection',nullNavRequest);}else {result=_fp.Future.createFailedFuture('NavRequest::fromRedirection','Unrecognized type of Redirection '+_util.ObjUtil.formatRecAttr(redirection));}return result;}}]);return NavRequestUtil;}(); /**
	 * *********************************
	 */var NullNavRequest=exports.NullNavRequest=function NullNavRequest(){_classCallCheck(this,NullNavRequest);this.fromDialogProperties={};}; /**
	 * *********************************
	 */var ObjectRef=exports.ObjectRef=function(){function ObjectRef(_objectId,_description){_classCallCheck(this,ObjectRef);this._objectId=_objectId;this._description=_description;}_createClass(ObjectRef,[{key:"toString",value:function toString(){return this.objectId+":"+this.description;}},{key:"description",get:function get(){return this._description;}},{key:"objectId",get:function get(){return this._objectId;}}],[{key:"fromFormattedValue",value:function fromFormattedValue(value){var pair=_util.StringUtil.splitSimpleKeyValuePair(value);return new ObjectRef(pair[0],pair[1]);}}]);return ObjectRef;}(); /**
	 * *********************************
	 */var PaneMode=exports.PaneMode=undefined;(function(PaneMode){PaneMode[PaneMode["READ"]=0]="READ";PaneMode[PaneMode["WRITE"]=1]="WRITE";})(PaneMode||(exports.PaneMode=PaneMode={})); /**
	 * *********************************
	 */var PropDef=exports.PropDef=function(){function PropDef(_name,_type,_elementType,_style,_propertyLength,_propertyScale,_presLength,_presScale,_dataDictionaryKey,_maintainable,_writeEnabled,_canCauseSideEffects){_classCallCheck(this,PropDef);this._name=_name;this._type=_type;this._elementType=_elementType;this._style=_style;this._propertyLength=_propertyLength;this._propertyScale=_propertyScale;this._presLength=_presLength;this._presScale=_presScale;this._dataDictionaryKey=_dataDictionaryKey;this._maintainable=_maintainable;this._writeEnabled=_writeEnabled;this._canCauseSideEffects=_canCauseSideEffects;}_createClass(PropDef,[{key:"canCauseSideEffects",get:function get(){return this._canCauseSideEffects;}},{key:"dataDictionaryKey",get:function get(){return this._dataDictionaryKey;}},{key:"elementType",get:function get(){return this._elementType;}},{key:"isBarcodeType",get:function get(){return this.type&&this.type==='STRING'&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_BARCODE';}},{key:"isBinaryType",get:function get(){return this.isLargeBinaryType;}},{key:"isBooleanType",get:function get(){return this.type&&this.type==='BOOLEAN';}},{key:"isCodeRefType",get:function get(){return this.type&&this.type==='CODE_REF';}},{key:"isDateType",get:function get(){return this.type&&this.type==='DATE';}},{key:"isDateTimeType",get:function get(){return this.type&&this.type==='DATE_TIME';}},{key:"isDecimalType",get:function get(){return this.type&&this.type==='DECIMAL';}},{key:"isDoubleType",get:function get(){return this.type&&this.type==='DOUBLE';}},{key:"isEmailType",get:function get(){return this.type&&this.type==='DATA_EMAIL';}},{key:"isGeoFixType",get:function get(){return this.type&&this.type==='GEO_FIX';}},{key:"isGeoLocationType",get:function get(){return this.type&&this.type==='GEO_LOCATION';}},{key:"isHTMLType",get:function get(){return this.type&&this.type==='DATA_HTML';}},{key:"isListType",get:function get(){return this.type&&this.type==='LIST';}},{key:"isInlineMediaStyle",get:function get(){return this.style&&(this.style===PropDef.STYLE_INLINE_MEDIA||this.style===PropDef.STYLE_INLINE_MEDIA2);}},{key:"isIntType",get:function get(){return this.type&&this.type==='INT';}},{key:"isLargeBinaryType",get:function get(){return this.type&&this.type==='com.dgoi.core.domain.BinaryRef'&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_LARGEBINARY';}},{key:"isLongType",get:function get(){return this.type&&this.type==='LONG';}},{key:"isMoneyType",get:function get(){return this.isNumericType&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_MONEY';}},{key:"isNumericType",get:function get(){return this.isDecimalType||this.isDoubleType||this.isIntType||this.isLongType;}},{key:"isObjRefType",get:function get(){return this.type&&this.type==='OBJ_REF';}},{key:"isPasswordType",get:function get(){return this.isStringType&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_PASSWORD';}},{key:"isPercentType",get:function get(){return this.isNumericType&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_PERCENT';}},{key:"isStringType",get:function get(){return this.type&&this.type==='STRING';}},{key:"isTelephoneType",get:function get(){return this.isStringType&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_TELEPHONE';}},{key:"isTextBlock",get:function get(){return this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_TEXT_BLOCK';}},{key:"isTimeType",get:function get(){return this.type&&this.type==='TIME';}},{key:"isUnformattedNumericType",get:function get(){return this.isNumericType&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_UNFORMATTED_NUMBER';}},{key:"isURLType",get:function get(){return this.isStringType&&this.dataDictionaryKey&&this.dataDictionaryKey==='DATA_URL';}},{key:"maintainable",get:function get(){return this._maintainable;}},{key:"name",get:function get(){return this._name;}},{key:"presLength",get:function get(){return this._presLength;}},{key:"presScale",get:function get(){return this._presScale;}},{key:"propertyLength",get:function get(){return this._propertyLength;}},{key:"propertyScale",get:function get(){return this._propertyScale;}},{key:"style",get:function get(){return this._style;}},{key:"type",get:function get(){return this._type;}},{key:"writeEnabled",get:function get(){return this._writeEnabled;}}]);return PropDef;}();PropDef.STYLE_INLINE_MEDIA="inlineMedia";PropDef.STYLE_INLINE_MEDIA2="Image/Video"; /**
	 * *********************************
	 */var PropFormatter=exports.PropFormatter=function(){function PropFormatter(){_classCallCheck(this,PropFormatter);}_createClass(PropFormatter,null,[{key:"formatForRead",value:function formatForRead(prop,propDef){return  true?PropFormatter.toString(prop):'';}},{key:"formatForWrite",value:function formatForWrite(prop,propDef){return prop?PropFormatter.toString(prop):'';}},{key:"parse",value:function parse(value,propDef){var propValue=value;if(propDef.isDecimalType){propValue=Number(value);}else if(propDef.isLongType){propValue=Number(value);}else if(propDef.isBooleanType){propValue=value!=='false';}else if(propDef.isDateType){propValue=new Date(value);}else if(propDef.isDateTimeType){propValue=new Date(value);}else if(propDef.isTimeType){propValue=new Date(value);}else if(propDef.isObjRefType){propValue=ObjectRef.fromFormattedValue(value);}else if(propDef.isCodeRefType){propValue=CodeRef.fromFormattedValue(value);}else if(propDef.isGeoFixType){propValue=GeoFix.fromFormattedValue(value);}else if(propDef.isGeoLocationType){propValue=GeoLocation.fromFormattedValue(value);}return propValue;}},{key:"toString",value:function toString(o){if(typeof o==='number'){return String(o);}else if((typeof o==="undefined"?"undefined":_typeof(o))==='object'){if(o instanceof Date){return o.toUTCString();}else if(o instanceof CodeRef){return o.toString();}else if(o instanceof ObjectRef){return o.toString();}else if(o instanceof GeoFix){return o.toString();}else if(o instanceof GeoLocation){return o.toString();}else {return String(o);}}else {return String(o);}}}]);return PropFormatter;}();var Prop=exports.Prop=function(){function Prop(_name,_value){var _annos=arguments.length<=2||arguments[2]===undefined?[]:arguments[2];_classCallCheck(this,Prop);this._name=_name;this._value=_value;this._annos=_annos;}_createClass(Prop,[{key:"equals",value:function equals(prop){return this.name===prop.name&&this.value===prop.value;}},{key:"toWS",value:function toWS(){var result={'WS_OTYPE':'WSProp','name':this.name,'value':Prop.toWSProperty(this.value)};if(this.annos){result['annos']=DataAnno.toListOfWSDataAnno(this.annos);}return result;}},{key:"annos",get:function get(){return this._annos;}},{key:"backgroundColor",get:function get(){return DataAnno.backgroundColor(this.annos);}},{key:"foregroundColor",get:function get(){return DataAnno.foregroundColor(this.annos);}},{key:"imageName",get:function get(){return DataAnno.imageName(this.annos);}},{key:"imagePlacement",get:function get(){return DataAnno.imagePlacement(this.annos);}},{key:"isBoldText",get:function get(){return DataAnno.isBoldText(this.annos);}},{key:"isItalicText",get:function get(){return DataAnno.isItalicText(this.annos);}},{key:"isPlacementCenter",get:function get(){return DataAnno.isPlacementCenter(this.annos);}},{key:"isPlacementLeft",get:function get(){return DataAnno.isPlacementLeft(this.annos);}},{key:"isPlacementRight",get:function get(){return DataAnno.isPlacementRight(this.annos);}},{key:"isPlacementStretchUnder",get:function get(){return DataAnno.isPlacementStretchUnder(this.annos);}},{key:"isPlacementUnder",get:function get(){return DataAnno.isPlacementUnder(this.annos);}},{key:"isUnderline",get:function get(){return DataAnno.isUnderlineText(this.annos);}},{key:"name",get:function get(){return this._name;}},{key:"overrideText",get:function get(){return DataAnno.overrideText(this.annos);}},{key:"tipText",get:function get(){return DataAnno.tipText(this.annos);}},{key:"value",get:function get(){return this._value;},set:function set(value){this._value=value;}}],[{key:"fromListOfWSValue",value:function fromListOfWSValue(values){var props=[];values.forEach(function(v){var propTry=Prop.fromWSValue(v);if(propTry.isFailure)return new _fp.Failure(propTry.failure);props.push(propTry.success);});return new _fp.Success(props);}},{key:"fromWSNameAndWSValue",value:function fromWSNameAndWSValue(name,value){var propTry=Prop.fromWSValue(value);if(propTry.isFailure){return new _fp.Failure(propTry.failure);}return new _fp.Success(new Prop(name,propTry.success));}},{key:"fromWSNamesAndValues",value:function fromWSNamesAndValues(names,values){if(names.length!=values.length){return new _fp.Failure("Prop::fromWSNamesAndValues: names and values must be of same length");}var list=[];for(var i=0;i<names.length;i++){var propTry=Prop.fromWSNameAndWSValue(names[i],values[i]);if(propTry.isFailure){return new _fp.Failure(propTry.failure);}list.push(propTry.success);}return new _fp.Success(list);}},{key:"fromWSValue",value:function fromWSValue(value){var propValue=value;if(value&&'object'===(typeof value==="undefined"?"undefined":_typeof(value))){var PType=value['WS_PTYPE'];var strVal=value['value'];if(PType){if(PType==='Decimal'){propValue=Number(strVal);}else if(PType==='Date'){propValue=new Date(strVal);}else if(PType==='DateTime'){propValue=new Date(strVal);}else if(PType==='Time'){propValue=new Date(strVal);}else if(PType==='BinaryRef'){var binaryRefTry=BinaryRef.fromWSValue(strVal,value['properties']);if(binaryRefTry.isFailure)return new _fp.Failure(binaryRefTry.failure);propValue=binaryRefTry.success;}else if(PType==='ObjectRef'){propValue=ObjectRef.fromFormattedValue(strVal);}else if(PType==='CodeRef'){propValue=CodeRef.fromFormattedValue(strVal);}else if(PType==='GeoFix'){propValue=GeoFix.fromFormattedValue(strVal);}else if(PType==='GeoLocation'){propValue=GeoLocation.fromFormattedValue(strVal);}else {return new _fp.Failure('Prop::fromWSValue: Property WS_PTYPE is not valid: '+PType);}}}return new _fp.Success(propValue);}},{key:"fromWS",value:function fromWS(otype,jsonObj){var name=jsonObj['name'];var valueTry=Prop.fromWSValue(jsonObj['value']);if(valueTry.isFailure)return new _fp.Failure(valueTry.failure);var annos=null;if(jsonObj['annos']){var annosListTry=DialogTriple.fromListOfWSDialogObject(jsonObj['annos'],'WSDataAnno',OType.factoryFn);if(annosListTry.isFailure)return new _fp.Failure(annosListTry.failure);annos=annosListTry.success;}return new _fp.Success(new Prop(name,valueTry.success,annos));}},{key:"toWSProperty",value:function toWSProperty(o){if(typeof o==='number'){return {'WS_PTYPE':'Decimal','value':String(o)};}else if((typeof o==="undefined"?"undefined":_typeof(o))==='object'){if(o instanceof Date){return {'WS_PTYPE':'DateTime','value':o.toUTCString()};}else if(o instanceof CodeRef){return {'WS_PTYPE':'CodeRef','value':o.toString()};}else if(o instanceof ObjectRef){return {'WS_PTYPE':'ObjectRef','value':o.toString()};}else if(o instanceof GeoFix){return {'WS_PTYPE':'GeoFix','value':o.toString()};}else if(o instanceof GeoLocation){return {'WS_PTYPE':'GeoLocation','value':o.toString()};}}else {return o;}}},{key:"toWSListOfProperties",value:function toWSListOfProperties(list){var result={'WS_LTYPE':'Object'};var values=[];list.forEach(function(o){values.push(Prop.toWSProperty(o));});result['values']=values;return result;}},{key:"toWSListOfString",value:function toWSListOfString(list){return {'WS_LTYPE':'String','values':list};}},{key:"toListOfWSProp",value:function toListOfWSProp(props){var result={'WS_LTYPE':'WSProp'};var values=[];props.forEach(function(prop){values.push(prop.toWS());});result['values']=values;return result;}}]);return Prop;}(); /**
	 * *********************************
	 */var QueryResult=exports.QueryResult=function QueryResult(entityRecs,hasMore){_classCallCheck(this,QueryResult);this.entityRecs=entityRecs;this.hasMore=hasMore;}; /**
	 * *********************************
	 */var HasMoreQueryMarker=exports.HasMoreQueryMarker=function(_NullEntityRec){_inherits(HasMoreQueryMarker,_NullEntityRec);function HasMoreQueryMarker(){_classCallCheck(this,HasMoreQueryMarker);return _possibleConstructorReturn(this,Object.getPrototypeOf(HasMoreQueryMarker).apply(this,arguments));}return HasMoreQueryMarker;}(NullEntityRec);HasMoreQueryMarker.singleton=new HasMoreQueryMarker();var IsEmptyQueryMarker=exports.IsEmptyQueryMarker=function(_NullEntityRec2){_inherits(IsEmptyQueryMarker,_NullEntityRec2);function IsEmptyQueryMarker(){_classCallCheck(this,IsEmptyQueryMarker);return _possibleConstructorReturn(this,Object.getPrototypeOf(IsEmptyQueryMarker).apply(this,arguments));}return IsEmptyQueryMarker;}(NullEntityRec);IsEmptyQueryMarker.singleton=new IsEmptyQueryMarker();var QueryMarkerOption=exports.QueryMarkerOption=undefined;(function(QueryMarkerOption){QueryMarkerOption[QueryMarkerOption["None"]=0]="None";QueryMarkerOption[QueryMarkerOption["IsEmpty"]=1]="IsEmpty";QueryMarkerOption[QueryMarkerOption["HasMore"]=2]="HasMore";})(QueryMarkerOption||(exports.QueryMarkerOption=QueryMarkerOption={}));var QueryScroller=exports.QueryScroller=function(){function QueryScroller(_context,_pageSize,_firstObjectId){var _markerOptions=arguments.length<=3||arguments[3]===undefined?[]:arguments[3];_classCallCheck(this,QueryScroller);this._context=_context;this._pageSize=_pageSize;this._firstObjectId=_firstObjectId;this._markerOptions=_markerOptions;this.clear();}_createClass(QueryScroller,[{key:"pageBackward",value:function pageBackward(){var _this55=this;if(!this._hasMoreBackward){return _fp.Future.createSuccessfulFuture('QueryScroller::pageBackward',[]);}if(!this._prevPageFr||this._prevPageFr.isComplete){var fromObjectId=this._buffer.length===0?null:this._buffer[0].objectId;this._prevPageFr=this._context.query(this._pageSize,QueryDirection.BACKWARD,fromObjectId);}else {this._prevPageFr=this._prevPageFr.bind(function(queryResult){var fromObjectId=_this55._buffer.length===0?null:_this55._buffer[0].objectId;return _this55._context.query(_this55._pageSize,QueryDirection.BACKWARD,fromObjectId);});}var beforeSize=this._buffer.length;return this._prevPageFr.map(function(queryResult){var afterSize=beforeSize;_this55._hasMoreBackward=queryResult.hasMore;if(queryResult.entityRecs.length>0){var newBuffer=[];for(var i=queryResult.entityRecs.length-1;i>-1;i--){newBuffer.push(queryResult.entityRecs[i]);}_this55._buffer.forEach(function(entityRec){newBuffer.push(entityRec);});_this55._buffer=newBuffer;afterSize=_this55._buffer.length;}return queryResult.entityRecs;});}},{key:"pageForward",value:function pageForward(){var _this56=this;if(!this._hasMoreForward){return _fp.Future.createSuccessfulFuture('QueryScroller::pageForward',[]);}if(!this._nextPageFr||this._nextPageFr.isComplete){var fromObjectId=this._buffer.length===0?null:this._buffer[this._buffer.length-1].objectId;this._nextPageFr=this._context.query(this._pageSize,QueryDirection.FORWARD,fromObjectId);}else {this._nextPageFr=this._nextPageFr.bind(function(queryResult){var fromObjectId=_this56._buffer.length===0?null:_this56._buffer[_this56._buffer.length-1].objectId;return _this56._context.query(_this56._pageSize,QueryDirection.FORWARD,fromObjectId);});}var beforeSize=this._buffer.length;return this._nextPageFr.map(function(queryResult){var afterSize=beforeSize;_this56._hasMoreForward=queryResult.hasMore;if(queryResult.entityRecs.length>0){var newBuffer=[];_this56._buffer.forEach(function(entityRec){newBuffer.push(entityRec);});queryResult.entityRecs.forEach(function(entityRec){newBuffer.push(entityRec);});_this56._buffer=newBuffer;afterSize=_this56._buffer.length;}return queryResult.entityRecs;});}},{key:"refresh",value:function refresh(){var _this57=this;this.clear();return this.pageForward().map(function(entityRecList){_this57.context.lastRefreshTime=new Date();return entityRecList;});}},{key:"trimFirst",value:function trimFirst(n){var newBuffer=[];for(var i=n;i<this._buffer.length;i++){newBuffer.push(this._buffer[i]);}this._buffer=newBuffer;this._hasMoreBackward=true;if(this._buffer.length===0)this._hasMoreForward=true;}},{key:"trimLast",value:function trimLast(n){var newBuffer=[];for(var i=0;i<this._buffer.length-n;i++){newBuffer.push(this._buffer[i]);}this._buffer=newBuffer;this._hasMoreForward=true;if(this._buffer.length===0)this._hasMoreBackward=true;}},{key:"clear",value:function clear(){this._hasMoreBackward=!!this._firstObjectId;this._hasMoreForward=true;this._buffer=[];}},{key:"buffer",get:function get(){return this._buffer;}},{key:"bufferWithMarkers",get:function get(){var result=_util.ArrayUtil.copy(this._buffer);if(this.isComplete){if(this._markerOptions.indexOf(QueryMarkerOption.IsEmpty)>-1){if(this.isEmpty){result.push(IsEmptyQueryMarker.singleton);}}}else if(this._markerOptions.indexOf(QueryMarkerOption.HasMore)>-1){if(result.length===0){result.push(HasMoreQueryMarker.singleton);}else {if(this._hasMoreBackward){result.unshift(HasMoreQueryMarker.singleton);}if(this._hasMoreForward){result.push(HasMoreQueryMarker.singleton);}}}return result;}},{key:"context",get:function get(){return this._context;}},{key:"firstObjectId",get:function get(){return this._firstObjectId;}},{key:"hasMoreBackward",get:function get(){return this._hasMoreBackward;}},{key:"hasMoreForward",get:function get(){return this._hasMoreForward;}},{key:"isComplete",get:function get(){return !this._hasMoreBackward&&!this._hasMoreForward;}},{key:"isCompleteAndEmpty",get:function get(){return this.isComplete&&this._buffer.length===0;}},{key:"isEmpty",get:function get(){return this._buffer.length===0;}},{key:"pageSize",get:function get(){return this._pageSize;}}]);return QueryScroller;}(); /**
	 * *********************************
	 */var SessionContextImpl=exports.SessionContextImpl=function(){function SessionContextImpl(sessionHandle,userName,currentDivision,serverVersion,systemContext){_classCallCheck(this,SessionContextImpl);this.sessionHandle=sessionHandle;this.userName=userName;this.currentDivision=currentDivision;this.serverVersion=serverVersion;this.systemContext=systemContext;this._remoteSession=true;}_createClass(SessionContextImpl,[{key:"clientType",get:function get(){return this._clientType;}},{key:"gatewayHost",get:function get(){return this._gatewayHost;}},{key:"isLocalSession",get:function get(){return !this._remoteSession;}},{key:"isRemoteSession",get:function get(){return this._remoteSession;}},{key:"password",get:function get(){return this._password;}},{key:"tenantId",get:function get(){return this._tenantId;}},{key:"userId",get:function get(){return this._userId;}},{key:"online",set:function set(online){this._remoteSession=online;}}],[{key:"fromWSCreateSessionResult",value:function fromWSCreateSessionResult(jsonObject,systemContext){var sessionContextTry=DialogTriple.fromWSDialogObject(jsonObject,'WSCreateSessionResult',OType.factoryFn);return sessionContextTry.map(function(sessionContext){sessionContext.systemContext=systemContext;return sessionContext;});}},{key:"createSessionContext",value:function createSessionContext(gatewayHost,tenantId,clientType,userId,password){var sessionContext=new SessionContextImpl(null,userId,"",null,null);sessionContext._gatewayHost=gatewayHost;sessionContext._tenantId=tenantId;sessionContext._clientType=clientType;sessionContext._userId=userId;sessionContext._password=password;sessionContext._remoteSession=false;return sessionContext;}}]);return SessionContextImpl;}(); /**
	 * *********************************
	 */var SessionService=exports.SessionService=function(){function SessionService(){_classCallCheck(this,SessionService);}_createClass(SessionService,null,[{key:"createSession",value:function createSession(tenantId,userId,password,clientType,systemContext){var method="createSessionDirectly";var params={'tenantId':tenantId,'userId':userId,'password':password,'clientType':clientType};var call=_ws.Call.createCallWithoutSession(SessionService.SERVICE_PATH,method,params,systemContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture("createSession/extractSessionContextFromResponse",SessionContextImpl.fromWSCreateSessionResult(result,systemContext));});}},{key:"deleteSession",value:function deleteSession(sessionContext){var method="deleteSession";var params={'sessionHandle':sessionContext.sessionHandle};var call=_ws.Call.createCall(SessionService.SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createSuccessfulFuture("deleteSession/extractVoidResultFromResponse",result);});}},{key:"getSessionListProperty",value:function getSessionListProperty(propertyName,sessionContext){var method="getSessionListProperty";var params={'propertyName':propertyName,'sessionHandle':sessionContext.sessionHandle};var call=_ws.Call.createCall(SessionService.SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture("getSessionListProperty/extractResultFromResponse",DialogTriple.fromWSDialogObject(result,'WSGetSessionListPropertyResult',OType.factoryFn));});}},{key:"setSessionListProperty",value:function setSessionListProperty(propertyName,listProperty,sessionContext){var method="setSessionListProperty";var params={'propertyName':propertyName,'listProperty':listProperty,'sessionHandle':sessionContext.sessionHandle};var call=_ws.Call.createCall(SessionService.SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createSuccessfulFuture("setSessionListProperty/extractVoidResultFromResponse",result);});}}]);return SessionService;}();SessionService.SERVICE_NAME="SessionService";SessionService.SERVICE_PATH="soi-json-v02/"+SessionService.SERVICE_NAME; /**
	 * *********************************
	 */var SortPropDef=exports.SortPropDef=function(){function SortPropDef(_name,_direction){_classCallCheck(this,SortPropDef);this._name=_name;this._direction=_direction;}_createClass(SortPropDef,[{key:"direction",get:function get(){return this._direction;}},{key:"name",get:function get(){return this._name;}}]);return SortPropDef;}(); /**
	 * *********************************
	 */var SystemContextImpl=exports.SystemContextImpl=function(){function SystemContextImpl(_urlString){_classCallCheck(this,SystemContextImpl);this._urlString=_urlString;}_createClass(SystemContextImpl,[{key:"urlString",get:function get(){return this._urlString;}}]);return SystemContextImpl;}(); /**
	 * *********************************
	 */var WorkbenchLaunchAction=exports.WorkbenchLaunchAction=function(){function WorkbenchLaunchAction(id,workbenchId,name,alias,iconBase){_classCallCheck(this,WorkbenchLaunchAction);this.id=id;this.workbenchId=workbenchId;this.name=name;this.alias=alias;this.iconBase=iconBase;}_createClass(WorkbenchLaunchAction,[{key:"actionId",get:function get(){return this.id;}},{key:"fromActionSource",get:function get(){return null;}},{key:"virtualPathSuffix",get:function get(){return [this.workbenchId,this.id];}}]);return WorkbenchLaunchAction;}(); /**
	 * *********************************
	 */var WorkbenchService=exports.WorkbenchService=function(){function WorkbenchService(){_classCallCheck(this,WorkbenchService);}_createClass(WorkbenchService,null,[{key:"getAppWinDef",value:function getAppWinDef(sessionContext){var method="getApplicationWindowDef";var params={'sessionHandle':sessionContext.sessionHandle};var call=_ws.Call.createCall(WorkbenchService.SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture("createSession/extractAppWinDefFromResult",DialogTriple.fromWSDialogObjectResult(result,'WSApplicationWindowDefResult','WSApplicationWindowDef','applicationWindowDef',OType.factoryFn));});}},{key:"getWorkbench",value:function getWorkbench(sessionContext,workbenchId){var method="getWorkbench";var params={'sessionHandle':sessionContext.sessionHandle,'workbenchId':workbenchId};var call=_ws.Call.createCall(WorkbenchService.SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture("getWorkbench/extractObject",DialogTriple.fromWSDialogObjectResult(result,'WSWorkbenchResult','WSWorkbench','workbench',OType.factoryFn));});}},{key:"performLaunchAction",value:function performLaunchAction(actionId,workbenchId,sessionContext){var method="performLaunchAction";var params={'actionId':actionId,'workbenchId':workbenchId,'sessionHandle':sessionContext.sessionHandle};var call=_ws.Call.createCall(WorkbenchService.SERVICE_PATH,method,params,sessionContext);return call.perform().bind(function(result){return _fp.Future.createCompletedFuture("performLaunchAction/extractRedirection",DialogTriple.fromWSDialogObject(result['redirection'],'WSRedirection',OType.factoryFn));});}}]);return WorkbenchService;}();WorkbenchService.SERVICE_NAME="WorkbenchService";WorkbenchService.SERVICE_PATH="soi-json-v02/"+WorkbenchService.SERVICE_NAME; /**
	 * *********************************
	 */var Workbench=exports.Workbench=function(){function Workbench(_id,_name,_alias,_actions){_classCallCheck(this,Workbench);this._id=_id;this._name=_name;this._alias=_alias;this._actions=_actions;}_createClass(Workbench,[{key:"getLaunchActionById",value:function getLaunchActionById(launchActionId){var result=null;this.workbenchLaunchActions.some(function(launchAction){if(launchAction.id=launchActionId){result=launchAction;return true;}});return result;}},{key:"alias",get:function get(){return this._alias;}},{key:"name",get:function get(){return this._name;}},{key:"workbenchId",get:function get(){return this._id;}},{key:"workbenchLaunchActions",get:function get(){return _util.ArrayUtil.copy(this._actions);}}]);return Workbench;}(); /* XPane Classes */ /**
	 * *********************************
	 */var XPaneDef=exports.XPaneDef=function(){function XPaneDef(){_classCallCheck(this,XPaneDef);}_createClass(XPaneDef,null,[{key:"fromWS",value:function fromWS(otype,jsonObj){if(jsonObj['listDef']){return DialogTriple.fromWSDialogObject(jsonObj['listDef'],'WSListDef',OType.factoryFn);}else if(jsonObj['detailsDef']){return DialogTriple.fromWSDialogObject(jsonObj['detailsDef'],'WSDetailsDef',OType.factoryFn);}else if(jsonObj['formDef']){return DialogTriple.fromWSDialogObject(jsonObj['formDef'],'WSFormDef',OType.factoryFn);}else if(jsonObj['mapDef']){return DialogTriple.fromWSDialogObject(jsonObj['mapDef'],'WSMapDef',OType.factoryFn);}else if(jsonObj['graphDef']){return DialogTriple.fromWSDialogObject(jsonObj['graphDef'],'WSGraphDef',OType.factoryFn);}else if(jsonObj['barcodeScanDef']){return DialogTriple.fromWSDialogObject(jsonObj['barcodeScanDef'],'WSBarcodeScanDef',OType.factoryFn);}else if(jsonObj['imagePickerDef']){return DialogTriple.fromWSDialogObject(jsonObj['imagePickerDef'],'WSImagePickerDef',OType.factoryFn);}else if(jsonObj['geoFixDef']){return DialogTriple.fromWSDialogObject(jsonObj['geoFixDef'],'WSGeoFixDef',OType.factoryFn);}else if(jsonObj['geoLocationDef']){return DialogTriple.fromWSDialogObject(jsonObj['geoLocationDef'],'WSGeoLocationDef',OType.factoryFn);}else if(jsonObj['calendarDef']){return DialogTriple.fromWSDialogObject(jsonObj['calendarDef'],'WSCalendarDef',OType.factoryFn);}else {return new _fp.Failure('XPaneDef::fromWS: Cannot determine concrete class for XPaneDef '+_util.ObjUtil.formatRecAttr(jsonObj));}}}]);return XPaneDef;}(); /**
	 * *********************************
	 */var XBarcodeScanDef=exports.XBarcodeScanDef=function(_XPaneDef){_inherits(XBarcodeScanDef,_XPaneDef);function XBarcodeScanDef(paneId,name,title){_classCallCheck(this,XBarcodeScanDef);var _this58=_possibleConstructorReturn(this,Object.getPrototypeOf(XBarcodeScanDef).call(this));_this58.paneId=paneId;_this58.name=name;_this58.title=title;return _this58;}return XBarcodeScanDef;}(XPaneDef); /**
	 * *********************************
	 */var XCalendarDef=exports.XCalendarDef=function(_XPaneDef2){_inherits(XCalendarDef,_XPaneDef2);function XCalendarDef(paneId,name,title,descriptionProperty,initialStyle,startDateProperty,startTimeProperty,endDateProperty,endTimeProperty,occurDateProperty,occurTimeProperty){_classCallCheck(this,XCalendarDef);var _this59=_possibleConstructorReturn(this,Object.getPrototypeOf(XCalendarDef).call(this));_this59.paneId=paneId;_this59.name=name;_this59.title=title;_this59.descriptionProperty=descriptionProperty;_this59.initialStyle=initialStyle;_this59.startDateProperty=startDateProperty;_this59.startTimeProperty=startTimeProperty;_this59.endDateProperty=endDateProperty;_this59.endTimeProperty=endTimeProperty;_this59.occurDateProperty=occurDateProperty;_this59.occurTimeProperty=occurTimeProperty;return _this59;}return XCalendarDef;}(XPaneDef); /**
	 * *********************************
	 */var XChangePaneModeResult=exports.XChangePaneModeResult=function(){function XChangePaneModeResult(editorRecordDef,dialogProperties){_classCallCheck(this,XChangePaneModeResult);this.editorRecordDef=editorRecordDef;this.dialogProperties=dialogProperties;}_createClass(XChangePaneModeResult,[{key:"entityRecDef",get:function get(){return this.editorRecordDef;}},{key:"dialogProps",get:function get(){return this.dialogProperties;}}]);return XChangePaneModeResult;}(); /**
	 * *********************************
	 */ /*
	 @TODO

	 Note! Use this as a test example!
	 It has an Array of Array with subitems that also have Array of Array!!
	 */var XDetailsDef=exports.XDetailsDef=function(_XPaneDef3){_inherits(XDetailsDef,_XPaneDef3);function XDetailsDef(paneId,name,title,cancelButtonText,commitButtonText,editable,focusPropertyName,overrideGML,rows){_classCallCheck(this,XDetailsDef);var _this60=_possibleConstructorReturn(this,Object.getPrototypeOf(XDetailsDef).call(this));_this60.paneId=paneId;_this60.name=name;_this60.title=title;_this60.cancelButtonText=cancelButtonText;_this60.commitButtonText=commitButtonText;_this60.editable=editable;_this60.focusPropertyName=focusPropertyName;_this60.overrideGML=overrideGML;_this60.rows=rows;return _this60;}_createClass(XDetailsDef,[{key:"graphicalMarkup",get:function get(){return this.overrideGML;}}]);return XDetailsDef;}(XPaneDef); /**
	 * *********************************
	 */var XFormDef=exports.XFormDef=function(_XPaneDef4){_inherits(XFormDef,_XPaneDef4);function XFormDef(borderStyle,formLayout,formStyle,name,paneId,title,headerDefRef,paneDefRefs){_classCallCheck(this,XFormDef);var _this61=_possibleConstructorReturn(this,Object.getPrototypeOf(XFormDef).call(this));_this61.borderStyle=borderStyle;_this61.formLayout=formLayout;_this61.formStyle=formStyle;_this61.name=name;_this61.paneId=paneId;_this61.title=title;_this61.headerDefRef=headerDefRef;_this61.paneDefRefs=paneDefRefs;return _this61;}return XFormDef;}(XPaneDef); /**
	 * *********************************
	 */var XFormModelComp=exports.XFormModelComp=function XFormModelComp(paneId,redirection,label,title){_classCallCheck(this,XFormModelComp);this.paneId=paneId;this.redirection=redirection;this.label=label;this.title=title;}; /**
	 * *********************************
	 */var XFormModel=exports.XFormModel=function(){function XFormModel(form,header,children,placement,refreshTimer,sizeToWindow){_classCallCheck(this,XFormModel);this.form=form;this.header=header;this.children=children;this.placement=placement;this.refreshTimer=refreshTimer;this.sizeToWindow=sizeToWindow;} /*
	     This custom fromWS method is necessary because the XFormModelComps, must be
	     built with the 'ignoreRedirection' flag set to true
	     */_createClass(XFormModel,null,[{key:"fromWS",value:function fromWS(otype,jsonObj){return DialogTriple.fromWSDialogObject(jsonObj['form'],'WSFormModelComp',OType.factoryFn,true).bind(function(form){var header=null;if(jsonObj['header']){var headerTry=DialogTriple.fromWSDialogObject(jsonObj['header'],'WSFormModelComp',OType.factoryFn,true);if(headerTry.isFailure)return new _fp.Failure(headerTry.isFailure);header=headerTry.success;}return DialogTriple.fromListOfWSDialogObject(jsonObj['children'],'WSFormModelComp',OType.factoryFn,true).bind(function(children){return new _fp.Success(new XFormModel(form,header,children,jsonObj['placement'],jsonObj['refreshTimer'],jsonObj['sizeToWindow']));});});}}]);return XFormModel;}(); /**
	 * *********************************
	 */var XGeoFixDef=exports.XGeoFixDef=function(_XPaneDef5){_inherits(XGeoFixDef,_XPaneDef5);function XGeoFixDef(paneId,name,title){_classCallCheck(this,XGeoFixDef);var _this62=_possibleConstructorReturn(this,Object.getPrototypeOf(XGeoFixDef).call(this));_this62.paneId=paneId;_this62.name=name;_this62.title=title;return _this62;}return XGeoFixDef;}(XPaneDef); /**
	 * *********************************
	 */var XGeoLocationDef=exports.XGeoLocationDef=function(_XPaneDef6){_inherits(XGeoLocationDef,_XPaneDef6);function XGeoLocationDef(paneId,name,title){_classCallCheck(this,XGeoLocationDef);var _this63=_possibleConstructorReturn(this,Object.getPrototypeOf(XGeoLocationDef).call(this));_this63.paneId=paneId;_this63.name=name;_this63.title=title;return _this63;}return XGeoLocationDef;}(XPaneDef); /**
	 * *********************************
	 */var XGetActiveColumnDefsResult=exports.XGetActiveColumnDefsResult=function(){function XGetActiveColumnDefsResult(columnsStyle,columns){_classCallCheck(this,XGetActiveColumnDefsResult);this.columnsStyle=columnsStyle;this.columns=columns;}_createClass(XGetActiveColumnDefsResult,[{key:"columnDefs",get:function get(){return this.columns;}}]);return XGetActiveColumnDefsResult;}(); /**
	 * *********************************
	 */var XGetAvailableValuesResult=exports.XGetAvailableValuesResult=function(){function XGetAvailableValuesResult(list){_classCallCheck(this,XGetAvailableValuesResult);this.list=list;}_createClass(XGetAvailableValuesResult,null,[{key:"fromWS",value:function fromWS(otype,jsonObj){var listJson=jsonObj['list'];var valuesJson=listJson['values'];return Prop.fromListOfWSValue(valuesJson).bind(function(values){return new _fp.Success(new XGetAvailableValuesResult(values));});}}]);return XGetAvailableValuesResult;}(); /**
	 * *********************************
	 */var XGetSessionListPropertyResult=exports.XGetSessionListPropertyResult=function(){function XGetSessionListPropertyResult(_list,_dialogProps){_classCallCheck(this,XGetSessionListPropertyResult);this._list=_list;this._dialogProps=_dialogProps;}_createClass(XGetSessionListPropertyResult,[{key:"valuesAsDictionary",value:function valuesAsDictionary(){var result={};this.values.forEach(function(v){var pair=_util.StringUtil.splitSimpleKeyValuePair(v);result[pair[0]]=pair[1];});return result;}},{key:"dialogProps",get:function get(){return this._dialogProps;}},{key:"values",get:function get(){return this._list;}}]);return XGetSessionListPropertyResult;}(); /**
	 * *********************************
	 */var XGraphDef=exports.XGraphDef=function(_XPaneDef7){_inherits(XGraphDef,_XPaneDef7);function XGraphDef(paneId,name,title,graphType,identityDataPoint,groupingDataPoint,dataPoints,filterDataPoints,sampleModel){_classCallCheck(this,XGraphDef);var _this64=_possibleConstructorReturn(this,Object.getPrototypeOf(XGraphDef).call(this));_this64.paneId=paneId;_this64.name=name;_this64.title=title;_this64.graphType=graphType;_this64.identityDataPoint=identityDataPoint;_this64.groupingDataPoint=groupingDataPoint;_this64.dataPoints=dataPoints;_this64.filterDataPoints=filterDataPoints;_this64.sampleModel=sampleModel;return _this64;}return XGraphDef;}(XPaneDef); /**
	 * *********************************
	 */var XImagePickerDef=exports.XImagePickerDef=function(_XPaneDef8){_inherits(XImagePickerDef,_XPaneDef8);function XImagePickerDef(paneId,name,title,URLProperty,defaultActionId){_classCallCheck(this,XImagePickerDef);var _this65=_possibleConstructorReturn(this,Object.getPrototypeOf(XImagePickerDef).call(this));_this65.paneId=paneId;_this65.name=name;_this65.title=title;_this65.URLProperty=URLProperty;_this65.defaultActionId=defaultActionId;return _this65;}return XImagePickerDef;}(XPaneDef); /**
	 * *********************************
	 */var XListDef=exports.XListDef=function(_XPaneDef9){_inherits(XListDef,_XPaneDef9);function XListDef(paneId,name,title,style,initialColumns,columnsStyle,overrideGML){_classCallCheck(this,XListDef);var _this66=_possibleConstructorReturn(this,Object.getPrototypeOf(XListDef).call(this));_this66.paneId=paneId;_this66.name=name;_this66.title=title;_this66.style=style;_this66.initialColumns=initialColumns;_this66.columnsStyle=columnsStyle;_this66.overrideGML=overrideGML;return _this66;}_createClass(XListDef,[{key:"graphicalMarkup",get:function get(){return this.overrideGML;},set:function set(graphicalMarkup){this.overrideGML=graphicalMarkup;}}]);return XListDef;}(XPaneDef); /**
	 * *********************************
	 */var XMapDef=exports.XMapDef=function(_XPaneDef10){_inherits(XMapDef,_XPaneDef10);function XMapDef(paneId,name,title,descriptionProperty,streetProperty,cityProperty,stateProperty,postalCodeProperty,latitudeProperty,longitudeProperty){_classCallCheck(this,XMapDef);var _this67=_possibleConstructorReturn(this,Object.getPrototypeOf(XMapDef).call(this));_this67.paneId=paneId;_this67.name=name;_this67.title=title;_this67.descriptionProperty=descriptionProperty;_this67.streetProperty=streetProperty;_this67.cityProperty=cityProperty;_this67.stateProperty=stateProperty;_this67.postalCodeProperty=postalCodeProperty;_this67.latitudeProperty=latitudeProperty;_this67.longitudeProperty=longitudeProperty;return _this67;} //descriptionProperty is misspelled in json returned by server currently...
	_createClass(XMapDef,[{key:"descrptionProperty",set:function set(prop){this.descriptionProperty=prop;}}]);return XMapDef;}(XPaneDef); /**
	 * *********************************
	 */var XOpenEditorModelResult=exports.XOpenEditorModelResult=function(){function XOpenEditorModelResult(editorRecordDef,formModel){_classCallCheck(this,XOpenEditorModelResult);this.editorRecordDef=editorRecordDef;this.formModel=formModel;}_createClass(XOpenEditorModelResult,[{key:"entityRecDef",get:function get(){return this.editorRecordDef;}},{key:"formPaneId",get:function get(){return this.formModel.form.paneId;}},{key:"formRedirection",get:function get(){return this.formModel.form.redirection;}}]);return XOpenEditorModelResult;}(); /**
	 * *********************************
	 */var XOpenQueryModelResult=exports.XOpenQueryModelResult=function(){function XOpenQueryModelResult(entityRecDef,sortPropertyDef,defaultActionId){_classCallCheck(this,XOpenQueryModelResult);this.entityRecDef=entityRecDef;this.sortPropertyDef=sortPropertyDef;this.defaultActionId=defaultActionId;}_createClass(XOpenQueryModelResult,null,[{key:"fromWS",value:function fromWS(otype,jsonObj){var queryRecDefJson=jsonObj['queryRecordDef'];var defaultActionId=queryRecDefJson['defaultActionId'];return DialogTriple.fromListOfWSDialogObject(queryRecDefJson['propertyDefs'],'WSPropertyDef',OType.factoryFn).bind(function(propDefs){var entityRecDef=new EntityRecDef(propDefs);return DialogTriple.fromListOfWSDialogObject(queryRecDefJson['sortPropertyDefs'],'WSSortPropertyDef',OType.factoryFn).bind(function(sortPropDefs){return new _fp.Success(new XOpenQueryModelResult(entityRecDef,sortPropDefs,defaultActionId));});});}}]);return XOpenQueryModelResult;}(); /**
	 * *********************************
	 */var XPaneDefRef=exports.XPaneDefRef=function XPaneDefRef(name,paneId,title,type){_classCallCheck(this,XPaneDefRef);this.name=name;this.paneId=paneId;this.title=title;this.type=type;}; /**
	 * *********************************
	 */var XPropertyChangeResult=exports.XPropertyChangeResult=function(){function XPropertyChangeResult(availableValueChanges,propertyName,sideEffects,editorRecordDef){_classCallCheck(this,XPropertyChangeResult);this.availableValueChanges=availableValueChanges;this.propertyName=propertyName;this.sideEffects=sideEffects;this.editorRecordDef=editorRecordDef;}_createClass(XPropertyChangeResult,[{key:"sideEffectsDef",get:function get(){return this.editorRecordDef;}}]);return XPropertyChangeResult;}(); /**
	 * *********************************
	 */var XQueryResult=exports.XQueryResult=function(){function XQueryResult(entityRecs,entityRecDef,hasMore,sortPropDefs,defaultActionId,dialogProps){_classCallCheck(this,XQueryResult);this.entityRecs=entityRecs;this.entityRecDef=entityRecDef;this.hasMore=hasMore;this.sortPropDefs=sortPropDefs;this.defaultActionId=defaultActionId;this.dialogProps=dialogProps;}_createClass(XQueryResult,null,[{key:"fromWS",value:function fromWS(otype,jsonObj){return DialogTriple.fromWSDialogObject(jsonObj['queryRecordDef'],'WSQueryRecordDef',OType.factoryFn).bind(function(entityRecDef){var entityRecDefJson=jsonObj['queryRecordDef'];var actionId=jsonObj['defaultActionId'];return DialogTriple.fromListOfWSDialogObject(entityRecDefJson['sortPropertyDefs'],'WSSortPropertyDef',OType.factoryFn).bind(function(sortPropDefs){var queryRecsJson=jsonObj['queryRecords'];if(queryRecsJson['WS_LTYPE']!=='WSQueryRecord'){return new _fp.Failure('XQueryResult::fromWS: Expected WS_LTYPE of WSQueryRecord but found '+queryRecsJson['WS_LTYPE']);}var queryRecsValues=queryRecsJson['values'];var entityRecs=[];for(var i=0;i<queryRecsValues.length;i++){var queryRecValue=queryRecsValues[i];if(queryRecValue['WS_OTYPE']!=='WSQueryRecord'){return new _fp.Failure('XQueryResult::fromWS: Expected WS_OTYPE of WSQueryRecord but found '+queryRecValue['WS_LTYPE']);}var objectId=queryRecValue['objectId'];var recPropsObj=queryRecValue['properties'];if(recPropsObj['WS_LTYPE']!=='Object'){return new _fp.Failure('XQueryResult::fromWS: Expected WS_LTYPE of Object but found '+recPropsObj['WS_LTYPE']);}var recPropsObjValues=recPropsObj['values'];var propsTry=Prop.fromWSNamesAndValues(entityRecDef.propNames,recPropsObjValues);if(propsTry.isFailure)return new _fp.Failure(propsTry.failure);var props=propsTry.success;if(queryRecValue['propertyAnnotations']){var propAnnosJson=queryRecValue['propertyAnnotations'];var annotatedPropsTry=DataAnno.annotatePropsUsingWSDataAnnotation(props,propAnnosJson);if(annotatedPropsTry.isFailure)return new _fp.Failure(annotatedPropsTry.failure);props=annotatedPropsTry.success;}var recAnnos=null;if(queryRecValue['recordAnnotation']){var recAnnosTry=DialogTriple.fromWSDialogObject(queryRecValue['recordAnnotation'],'WSDataAnnotation',OType.factoryFn);if(recAnnosTry.isFailure)return new _fp.Failure(recAnnosTry.failure);recAnnos=recAnnosTry.success;}var entityRec=EntityRecUtil.newEntityRec(objectId,props,recAnnos);entityRecs.push(entityRec);}var dialogProps=jsonObj['dialogProperties'];var hasMore=jsonObj['hasMore'];return new _fp.Success(new XQueryResult(entityRecs,entityRecDef,hasMore,sortPropDefs,actionId,dialogProps));});});}}]);return XQueryResult;}(); /**
	 * *********************************
	 */var XReadPropertyResult=exports.XReadPropertyResult=function XReadPropertyResult(){_classCallCheck(this,XReadPropertyResult);}; /**
	 * *********************************
	 */var XReadResult=exports.XReadResult=function(){function XReadResult(_editorRecord,_editorRecordDef,_dialogProperties){_classCallCheck(this,XReadResult);this._editorRecord=_editorRecord;this._editorRecordDef=_editorRecordDef;this._dialogProperties=_dialogProperties;}_createClass(XReadResult,[{key:"entityRec",get:function get(){return this._editorRecord;}},{key:"entityRecDef",get:function get(){return this._editorRecordDef;}},{key:"dialogProps",get:function get(){return this._dialogProperties;}}]);return XReadResult;}(); /**
	 * *********************************
	 */var XWriteResult=exports.XWriteResult=function(){function XWriteResult(_editorRecord,_editorRecordDef,_dialogProperties){_classCallCheck(this,XWriteResult);this._editorRecord=_editorRecord;this._editorRecordDef=_editorRecordDef;this._dialogProperties=_dialogProperties;}_createClass(XWriteResult,[{key:"dialogProps",get:function get(){return this._dialogProperties;}},{key:"entityRec",get:function get(){return this._editorRecord;}},{key:"entityRecDef",get:function get(){return this._editorRecordDef;}},{key:"isDestroyed",get:function get(){var destoyedStr=this.dialogProps['destroyed'];return destoyedStr&&destoyedStr.toLowerCase()==='true';}}],[{key:"fromWS",value:function fromWS(otype,jsonObj){return DialogTriple.extractTriple(jsonObj,'WSWriteResult',function(){return OType.deserializeObject(jsonObj,'XWriteResult',OType.factoryFn);});}}]);return XWriteResult;}(); /*
	  OType must be last as it references almost all other classes in the module
	 */var OType=exports.OType=function(){function OType(){_classCallCheck(this,OType);}_createClass(OType,null,[{key:"typeInstance",value:function typeInstance(name){var type=OType.types[name];return type&&new type();}},{key:"factoryFn",value:function factoryFn(otype,jsonObj){var typeFn=OType.typeFns[otype];if(typeFn){return typeFn(otype,jsonObj);}return null;}},{key:"deserializeObject",value:function deserializeObject(obj,Otype,factoryFn){_util.Log.debug('Deserializing '+Otype);if(Array.isArray(obj)){ //it's a nested array (no LTYPE!)
	return OType.handleNestedArray(Otype,obj);}else {var newObj=null;var objTry=factoryFn(Otype,obj); //this returns null if there is no custom function
	if(objTry){if(objTry.isFailure){var error='OType::deserializeObject: factory failed to produce object for '+Otype+" : "+_util.ObjUtil.formatRecAttr(objTry.failure);_util.Log.error(error);return new _fp.Failure(error);}newObj=objTry.success;}else {newObj=OType.typeInstance(Otype);if(!newObj){_util.Log.error('OType::deserializeObject: no type constructor found for '+Otype);return new _fp.Failure('OType::deserializeObject: no type constructor found for '+Otype);}for(var prop in obj){var value=obj[prop];_util.Log.debug("prop: "+prop+" is type "+(typeof value==="undefined"?"undefined":_typeof(value)));if(value&&(typeof value==="undefined"?"undefined":_typeof(value))==='object'){if('WS_OTYPE' in value){var otypeTry=DialogTriple.fromWSDialogObject(value,value['WS_OTYPE'],OType.factoryFn);if(otypeTry.isFailure)return new _fp.Failure(otypeTry.failure);OType.assignPropIfDefined(prop,otypeTry.success,newObj,Otype);}else if('WS_LTYPE' in value){var ltypeTry=DialogTriple.fromListOfWSDialogObject(value,value['WS_LTYPE'],OType.factoryFn);if(ltypeTry.isFailure)return new _fp.Failure(ltypeTry.failure);OType.assignPropIfDefined(prop,ltypeTry.success,newObj,Otype);}else {OType.assignPropIfDefined(prop,obj[prop],newObj,Otype);}}else {OType.assignPropIfDefined(prop,obj[prop],newObj,Otype);}}}return new _fp.Success(newObj);}}},{key:"serializeObject",value:function serializeObject(obj,Otype,filterFn){var newObj={'WS_OTYPE':Otype};return _util.ObjUtil.copyNonNullFieldsOnly(obj,newObj,function(prop){return prop.charAt(0)!=='_'&&(!filterFn||filterFn(prop));});}},{key:"handleNestedArray",value:function handleNestedArray(Otype,obj){return OType.extractLType(Otype).bind(function(ltype){var newArrayTry=OType.deserializeNestedArray(obj,ltype);if(newArrayTry.isFailure)return new _fp.Failure(newArrayTry.failure);return new _fp.Success(newArrayTry.success);});}},{key:"deserializeNestedArray",value:function deserializeNestedArray(array,ltype){var newArray=[];for(var i=0;i<array.length;i++){var value=array[i];if(value&&(typeof value==="undefined"?"undefined":_typeof(value))==='object'){var otypeTry=DialogTriple.fromWSDialogObject(value,ltype,OType.factoryFn);if(otypeTry.isFailure){return new _fp.Failure(otypeTry.failure);}newArray.push(otypeTry.success);}else {newArray.push(value);}}return new _fp.Success(newArray);}},{key:"extractLType",value:function extractLType(Otype){if(Otype.length>5&&Otype.slice(0,5)!=='List<'){return new _fp.Failure('Expected OType of List<some_type> but found '+Otype);}var ltype=Otype.slice(5,-1);return new _fp.Success(ltype);}},{key:"assignPropIfDefined",value:function assignPropIfDefined(prop,value,target){var otype=arguments.length<=3||arguments[3]===undefined?'object':arguments[3];try{if('_'+prop in target){target['_'+prop]=value;}else { //it may be public
	if(prop in target){target[prop]=value;}else {_util.Log.debug("Didn't find target value for prop "+prop+" on target for "+otype);}}}catch(error){_util.Log.error('OType::assignPropIfDefined: Failed to set prop: '+prop+' on target: '+error);}}}]);return OType;}();OType.types={'WSApplicationWindowDef':AppWinDef,'WSAttributeCellValueDef':AttributeCellValueDef,'WSBarcodeScanDef':XBarcodeScanDef,'WSCalendarDef':XCalendarDef,'WSCellDef':CellDef,'WSChangePaneModeResult':XChangePaneModeResult,'WSColumnDef':ColumnDef,'WSContextAction':ContextAction,'WSCreateSessionResult':SessionContextImpl,'WSDialogHandle':DialogHandle,'WSDataAnno':DataAnno,'WSDetailsDef':XDetailsDef,'WSDialogRedirection':DialogRedirection,'WSEditorRecordDef':EntityRecDef,'WSEntityRecDef':EntityRecDef,'WSForcedLineCellValueDef':ForcedLineCellValueDef,'WSFormDef':XFormDef,'WSFormModelComp':XFormModelComp,'WSGeoFixDef':XGeoFixDef,'WSGeoLocationDef':XGeoLocationDef,'WSGetActiveColumnDefsResult':XGetActiveColumnDefsResult,'WSGetSessionListPropertyResult':XGetSessionListPropertyResult,'WSGraphDataPointDef':GraphDataPointDef,'WSGraphDef':XGraphDef,'WSHandlePropertyChangeResult':XPropertyChangeResult,'WSImagePickerDef':XImagePickerDef,'WSLabelCellValueDef':LabelCellValueDef,'WSListDef':XListDef,'WSMapDef':XMapDef,'WSMenuDef':MenuDef,'WSOpenEditorModelResult':XOpenEditorModelResult,'WSOpenQueryModelResult':XOpenQueryModelResult,'WSPaneDefRef':XPaneDefRef,'WSPropertyDef':PropDef,'WSQueryRecordDef':EntityRecDef,'WSReadResult':XReadResult,'WSSortPropertyDef':SortPropDef,'WSSubstitutionCellValueDef':SubstitutionCellValueDef,'WSTabCellValueDef':TabCellValueDef,'WSWebRedirection':WebRedirection,'WSWorkbench':Workbench,'WSWorkbenchRedirection':WorkbenchRedirection,'WSWorkbenchLaunchAction':WorkbenchLaunchAction,'XWriteResult':XWriteResult};OType.typeFns={'WSCellValueDef':CellValueDef.fromWS,'WSDataAnnotation':DataAnno.fromWS,'WSEditorRecord':EntityRecUtil.fromWSEditorRecord,'WSFormModel':XFormModel.fromWS,'WSGetAvailableValuesResult':XGetAvailableValuesResult.fromWS,'WSPaneDef':XPaneDef.fromWS,'WSOpenQueryModelResult':XOpenQueryModelResult.fromWS,'WSProp':Prop.fromWS,'WSQueryResult':XQueryResult.fromWS,'WSRedirection':Redirection.fromWS,'WSWriteResult':XWriteResult.fromWS}; /**
	 * *********************************
	 */

/***/ }
/******/ ]);