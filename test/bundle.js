(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _WorkbenchService = require('./WorkbenchService');

var _SystemContextImpl = require('./SystemContextImpl');

var _SessionService = require('./SessionService');

var _GatewayService = require('./GatewayService');

var _Future = require('../fp/Future');

var _Success = require('../fp/Success');

var _Failure = require('../fp/Failure');

var _Log = require('../util/Log');

var _ObjUtil = require('../util/ObjUtil');

var _NavRequest = require('./NavRequest');

/**
 * Created by rburson on 3/13/15.
 */

var AppContextState;
(function (AppContextState) {
    AppContextState[AppContextState["LOGGED_OUT"] = 0] = "LOGGED_OUT";
    AppContextState[AppContextState["LOGGED_IN"] = 1] = "LOGGED_IN";
})(AppContextState || (AppContextState = {}));
var AppContextValues = (function () {
    function AppContextValues(sessionContext, appWinDef, tenantSettings) {
        this.sessionContext = sessionContext;
        this.appWinDef = appWinDef;
        this.tenantSettings = tenantSettings;
    }
    return AppContextValues;
})();
var AppContext = (function () {
    function AppContext() {
        if (AppContext._singleton) {
            throw new Error("Singleton instance already created");
        }
        this._deviceProps = [];
        this.setAppContextStateToLoggedOut();
        AppContext._singleton = this;
    }
    Object.defineProperty(AppContext, "defaultTTLInMillis", {
        get: function get() {
            return AppContext.ONE_DAY_IN_MILLIS;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext, "singleton", {
        get: function get() {
            if (!AppContext._singleton) {
                AppContext._singleton = new AppContext();
            }
            return AppContext._singleton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "appWinDefTry", {
        get: function get() {
            return this._appWinDefTry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "deviceProps", {
        get: function get() {
            return this._deviceProps;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "isLoggedIn", {
        get: function get() {
            return this._appContextState === AppContextState.LOGGED_IN;
        },
        enumerable: true,
        configurable: true
    });
    AppContext.prototype.getWorkbench = function (sessionContext, workbenchId) {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return _Future.Future.createFailedFuture("AppContext::getWorkbench", "User is logged out");
        }
        return _WorkbenchService.WorkbenchService.getWorkbench(sessionContext, workbenchId);
    };
    AppContext.prototype.login = function (gatewayHost, tenantId, clientType, userId, password) {
        var _this = this;
        if (this._appContextState === AppContextState.LOGGED_IN) {
            return _Future.Future.createFailedFuture("AppContext::login", "User is already logged in");
        }
        var answer;
        var appContextValuesFr = this.loginOnline(gatewayHost, tenantId, clientType, userId, password, this.deviceProps);
        return appContextValuesFr.bind(function (appContextValues) {
            _this.setAppContextStateToLoggedIn(appContextValues);
            return _Future.Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
        });
    };
    AppContext.prototype.loginDirectly = function (url, tenantId, clientType, userId, password) {
        var _this = this;
        if (this._appContextState === AppContextState.LOGGED_IN) {
            return _Future.Future.createFailedFuture("AppContext::loginDirectly", "User is already logged in");
        }
        return this.loginFromSystemContext(new _SystemContextImpl.SystemContextImpl(url), tenantId, userId, password, this.deviceProps, clientType).bind(function (appContextValues) {
            _this.setAppContextStateToLoggedIn(appContextValues);
            return _Future.Future.createSuccessfulFuture('AppContext::loginDirectly', appContextValues.appWinDef);
        });
    };
    AppContext.prototype.logout = function () {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return _Future.Future.createFailedFuture("AppContext::loginDirectly", "User is already logged out");
        }
        var result = _SessionService.SessionService.deleteSession(this.sessionContextTry.success);
        result.onComplete(function (deleteSessionTry) {
            if (deleteSessionTry.isFailure) {
                _Log.Log.error('Error while logging out: ' + _ObjUtil.ObjUtil.formatRecAttr(deleteSessionTry.failure));
            }
        });
        this.setAppContextStateToLoggedOut();
        return result;
    };
    AppContext.prototype.performLaunchAction = function (launchAction) {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return _Future.Future.createFailedFuture("AppContext::performLaunchAction", "User is logged out");
        }
        return this.performLaunchActionOnline(launchAction, this.sessionContextTry.success);
    };
    AppContext.prototype.refreshContext = function (sessionContext, deviceProps) {
        var _this = this;
        if (deviceProps === void 0) {
            deviceProps = [];
        }
        var appContextValuesFr = this.finalizeContext(sessionContext, deviceProps);
        return appContextValuesFr.bind(function (appContextValues) {
            _this.setAppContextStateToLoggedIn(appContextValues);
            return _Future.Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
        });
    };
    Object.defineProperty(AppContext.prototype, "sessionContextTry", {
        get: function get() {
            return this._sessionContextTry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "tenantSettingsTry", {
        get: function get() {
            return this._tenantSettingsTry;
        },
        enumerable: true,
        configurable: true
    });
    AppContext.prototype.finalizeContext = function (sessionContext, deviceProps) {
        var devicePropName = "com.catavolt.session.property.DeviceProperties";
        return _SessionService.SessionService.setSessionListProperty(devicePropName, deviceProps, sessionContext).bind(function (setPropertyListResult) {
            var listPropName = "com.catavolt.session.property.TenantProperties";
            return _SessionService.SessionService.getSessionListProperty(listPropName, sessionContext).bind(function (listPropertyResult) {
                return _WorkbenchService.WorkbenchService.getAppWinDef(sessionContext).bind(function (appWinDef) {
                    return _Future.Future.createSuccessfulFuture("AppContextCore:loginFromSystemContext", new AppContextValues(sessionContext, appWinDef, listPropertyResult.valuesAsDictionary()));
                });
            });
        });
    };
    AppContext.prototype.loginOnline = function (gatewayHost, tenantId, clientType, userId, password, deviceProps) {
        var _this = this;
        var systemContextFr = this.newSystemContextFr(gatewayHost, tenantId);
        return systemContextFr.bind(function (sc) {
            return _this.loginFromSystemContext(sc, tenantId, userId, password, deviceProps, clientType);
        });
    };
    AppContext.prototype.loginFromSystemContext = function (systemContext, tenantId, userId, password, deviceProps, clientType) {
        var _this = this;
        var sessionContextFuture = _SessionService.SessionService.createSession(tenantId, userId, password, clientType, systemContext);
        return sessionContextFuture.bind(function (sessionContext) {
            return _this.finalizeContext(sessionContext, deviceProps);
        });
    };
    AppContext.prototype.newSystemContextFr = function (gatewayHost, tenantId) {
        var serviceEndpoint = _GatewayService.GatewayService.getServiceEndpoint(tenantId, 'soi-json', gatewayHost);
        return serviceEndpoint.map(function (serviceEndpoint) {
            return new _SystemContextImpl.SystemContextImpl(serviceEndpoint.serverAssignment);
        });
    };
    AppContext.prototype.performLaunchActionOnline = function (launchAction, sessionContext) {
        var redirFr = _WorkbenchService.WorkbenchService.performLaunchAction(launchAction.id, launchAction.workbenchId, sessionContext);
        return redirFr.bind(function (r) {
            return _NavRequest.NavRequestUtil.fromRedirection(r, launchAction, sessionContext);
        });
    };
    AppContext.prototype.setAppContextStateToLoggedIn = function (appContextValues) {
        this._appWinDefTry = new _Success.Success(appContextValues.appWinDef);
        this._tenantSettingsTry = new _Success.Success(appContextValues.tenantSettings);
        this._sessionContextTry = new _Success.Success(appContextValues.sessionContext);
        this._appContextState = AppContextState.LOGGED_IN;
    };
    AppContext.prototype.setAppContextStateToLoggedOut = function () {
        this._appWinDefTry = new _Failure.Failure("Not logged in");
        this._tenantSettingsTry = new _Failure.Failure('Not logged in"');
        this._sessionContextTry = new _Failure.Failure('Not loggged in');
        this._appContextState = AppContextState.LOGGED_OUT;
    };
    AppContext.ONE_DAY_IN_MILLIS = 60 * 60 * 24 * 1000;
    return AppContext;
})();
AppContext = AppContext;

},{"../fp/Failure":100,"../fp/Future":101,"../fp/Success":103,"../util/Log":107,"../util/ObjUtil":108,"./GatewayService":30,"./NavRequest":48,"./SessionService":65,"./SystemContextImpl":68,"./WorkbenchService":74}],2:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/13/15.
 */
var AppWinDef = (function () {
    function AppWinDef(workbenches, appVendors, windowTitle, windowWidth, windowHeight) {
        this._workbenches = workbenches || [];
        this._applicationVendors = appVendors || [];
        this._windowTitle = windowTitle;
        this._windowWidth = windowWidth;
        this._windowHeight = windowHeight;
    }
    Object.defineProperty(AppWinDef.prototype, "appVendors", {
        get: function get() {
            return this._applicationVendors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppWinDef.prototype, "windowHeight", {
        get: function get() {
            return this._windowHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppWinDef.prototype, "windowTitle", {
        get: function get() {
            return this._windowTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppWinDef.prototype, "windowWidth", {
        get: function get() {
            return this._windowWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppWinDef.prototype, "workbenches", {
        get: function get() {
            return this._workbenches;
        },
        enumerable: true,
        configurable: true
    });
    return AppWinDef;
})();
AppWinDef = AppWinDef;

},{}],3:[function(require,module,exports){
"use strict";

var _CellValueDef = require("./CellValueDef");

/**
 * Created by rburson on 4/16/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var AttributeCellValueDef = (function (_super) {
    __extends(AttributeCellValueDef, _super);
    function AttributeCellValueDef(_propertyName, _presentationLength, _entryMethod, _autoFillCapable, _hint, _toolTip, _fieldActions, style) {
        _super.call(this, style);
        this._propertyName = _propertyName;
        this._presentationLength = _presentationLength;
        this._entryMethod = _entryMethod;
        this._autoFillCapable = _autoFillCapable;
        this._hint = _hint;
        this._toolTip = _toolTip;
        this._fieldActions = _fieldActions;
    }
    Object.defineProperty(AttributeCellValueDef.prototype, "autoFileCapable", {
        get: function get() {
            return this._autoFillCapable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "entryMethod", {
        get: function get() {
            return this._entryMethod;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "fieldActions", {
        get: function get() {
            return this._fieldActions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "hint", {
        get: function get() {
            return this._hint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "isComboBoxEntryMethod", {
        get: function get() {
            return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_COMBO_BOX';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "isDropDownEntryMethod", {
        get: function get() {
            return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_DROP_DOWN';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "isTextFieldEntryMethod", {
        get: function get() {
            return !this.entryMethod || this.entryMethod === 'ENTRY_METHOD_TEXT_FIELD';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "presentationLength", {
        get: function get() {
            return this._presentationLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "propertyName", {
        get: function get() {
            return this._propertyName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "toolTip", {
        get: function get() {
            return this._toolTip;
        },
        enumerable: true,
        configurable: true
    });
    return AttributeCellValueDef;
})(_CellValueDef.CellValueDef);
AttributeCellValueDef = AttributeCellValueDef;

},{"./CellValueDef":10}],4:[function(require,module,exports){
"use strict";

var _EditorContext = require("./EditorContext");

/**
 * Created by rburson on 5/4/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var BarcodeScanContext = (function (_super) {
    __extends(BarcodeScanContext, _super);
    function BarcodeScanContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(BarcodeScanContext.prototype, "barcodeScanDef", {
        get: function get() {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return BarcodeScanContext;
})(_EditorContext.EditorContext);
BarcodeScanContext = BarcodeScanContext;

},{"./EditorContext":21}],5:[function(require,module,exports){
"use strict";

var _PaneDef = require("./PaneDef");

/**
 * Created by rburson on 4/22/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var BarcodeScanDef = (function (_super) {
    __extends(BarcodeScanDef, _super);
    function BarcodeScanDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }
    return BarcodeScanDef;
})(_PaneDef.PaneDef);
BarcodeScanDef = BarcodeScanDef;

},{"./PaneDef":55}],6:[function(require,module,exports){
"use strict";

var _Base = require("../util/Base64");

var _Success = require("../fp/Success");

/**
 * Created by rburson on 4/4/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var BinaryRef = (function () {
    function BinaryRef(_settings) {
        this._settings = _settings;
    }
    BinaryRef.fromWSValue = function (encodedValue, settings) {
        if (encodedValue && encodedValue.length > 0) {
            return new _Success.Success(new InlineBinaryRef(_Base.Base64.decode(encodedValue), settings));
        } else {
            return new _Success.Success(new ObjectBinaryRef(settings));
        }
    };
    Object.defineProperty(BinaryRef.prototype, "settings", {
        get: function get() {
            return this._settings;
        },
        enumerable: true,
        configurable: true
    });
    return BinaryRef;
})();
BinaryRef = BinaryRef;
var InlineBinaryRef = (function (_super) {
    __extends(InlineBinaryRef, _super);
    function InlineBinaryRef(_inlineData, settings) {
        _super.call(this, settings);
        this._inlineData = _inlineData;
    }
    Object.defineProperty(InlineBinaryRef.prototype, "inlineData", {
        /* Base64 encoded data */
        get: function get() {
            return this._inlineData;
        },
        enumerable: true,
        configurable: true
    });
    return InlineBinaryRef;
})(BinaryRef);
InlineBinaryRef = InlineBinaryRef;
var ObjectBinaryRef = (function (_super) {
    __extends(ObjectBinaryRef, _super);
    function ObjectBinaryRef(settings) {
        _super.call(this, settings);
    }
    return ObjectBinaryRef;
})(BinaryRef);

},{"../fp/Success":103,"../util/Base64":106}],7:[function(require,module,exports){
"use strict";

var _QueryContext = require("./QueryContext");

/**
 * Created by rburson on 5/4/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var CalendarContext = (function (_super) {
    __extends(CalendarContext, _super);
    function CalendarContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(CalendarContext.prototype, "calendarDef", {
        get: function get() {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return CalendarContext;
})(_QueryContext.QueryContext);
CalendarContext = CalendarContext;

},{"./QueryContext":60}],8:[function(require,module,exports){
"use strict";

var _PaneDef = require("./PaneDef");

/**
 * Created by rburson on 4/22/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var CalendarDef = (function (_super) {
    __extends(CalendarDef, _super);
    function CalendarDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _descriptionPropName, _initialStyle, _startDatePropName, _startTimePropName, _endDatePropName, _endTimePropName, _occurDatePropName, _occurTimePropName, _defaultActionId) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._descriptionPropName = _descriptionPropName;
        this._initialStyle = _initialStyle;
        this._startDatePropName = _startDatePropName;
        this._startTimePropName = _startTimePropName;
        this._endDatePropName = _endDatePropName;
        this._endTimePropName = _endTimePropName;
        this._occurDatePropName = _occurDatePropName;
        this._occurTimePropName = _occurTimePropName;
        this._defaultActionId = _defaultActionId;
    }
    Object.defineProperty(CalendarDef.prototype, "descriptionPropName", {
        get: function get() {
            return this._descriptionPropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "initialStyle", {
        get: function get() {
            return this._initialStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "startDatePropName", {
        get: function get() {
            return this._startDatePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "startTimePropName", {
        get: function get() {
            return this._startTimePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "endDatePropName", {
        get: function get() {
            return this._endDatePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "endTimePropName", {
        get: function get() {
            return this._endTimePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "occurDatePropName", {
        get: function get() {
            return this._occurDatePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "occurTimePropName", {
        get: function get() {
            return this._occurTimePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "defaultActionId", {
        get: function get() {
            return this._defaultActionId;
        },
        enumerable: true,
        configurable: true
    });
    return CalendarDef;
})(_PaneDef.PaneDef);
CalendarDef = CalendarDef;

},{"./PaneDef":55}],9:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/31/15.
 */
var CellDef = (function () {
    function CellDef(_values) {
        this._values = _values;
    }
    Object.defineProperty(CellDef.prototype, "values", {
        get: function get() {
            return this._values;
        },
        enumerable: true,
        configurable: true
    });
    return CellDef;
})();
CellDef = CellDef;

},{}],10:[function(require,module,exports){
"use strict";

var _DialogTriple = require("./DialogTriple");

var _OType = require("./OType");

var _ObjUtil = require("../util/ObjUtil");

var _Failure = require("../fp/Failure");

var _PropDef = require("./PropDef");

var CellValueDef = (function () {
    function CellValueDef(_style) {
        this._style = _style;
    }
    /* Note compact deserialization will be handled normally by OType */
    CellValueDef.fromWS = function (otype, jsonObj) {
        if (jsonObj['attributeCellValueDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['attributeCellValueDef'], 'WSAttributeCellValueDef', _OType.OType.factoryFn);
        } else if (jsonObj['forcedLineCellValueDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['forcedLineCellValueDef'], 'WSForcedLineCellValueDef', _OType.OType.factoryFn);
        } else if (jsonObj['labelCellValueDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['labelCellValueDef'], 'WSLabelCellValueDef', _OType.OType.factoryFn);
        } else if (jsonObj['substitutionCellValueDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['substitutionCellValueDef'], 'WSSubstitutionCellValueDef', _OType.OType.factoryFn);
        } else if (jsonObj['tabCellValueDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['tabCellValueDef'], 'WSTabCellValueDef', _OType.OType.factoryFn);
        } else {
            return new _Failure.Failure('CellValueDef::fromWS: unknown CellValueDef type: ' + _ObjUtil.ObjUtil.formatRecAttr(jsonObj));
        }
    };
    Object.defineProperty(CellValueDef.prototype, "isInlineMediaStyle", {
        get: function get() {
            return this.style && (this.style === _PropDef.PropDef.STYLE_INLINE_MEDIA || this.style === _PropDef.PropDef.STYLE_INLINE_MEDIA2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CellValueDef.prototype, "style", {
        get: function get() {
            return this._style;
        },
        enumerable: true,
        configurable: true
    });
    return CellValueDef;
})(); /**
       * Created by rburson on 3/31/15.
       */

CellValueDef = CellValueDef;

},{"../fp/Failure":100,"../util/ObjUtil":108,"./DialogTriple":20,"./OType":52,"./PropDef":58}],11:[function(require,module,exports){
"use strict";

var _StringUtil = require("../util/StringUtil");

var CodeRef = (function () {
    function CodeRef(_code, _description) {
        this._code = _code;
        this._description = _description;
    }
    CodeRef.fromFormattedValue = function (value) {
        var pair = _StringUtil.StringUtil.splitSimpleKeyValuePair(value);
        return new CodeRef(pair[0], pair[1]);
    };
    Object.defineProperty(CodeRef.prototype, "code", {
        get: function get() {
            return this._code;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeRef.prototype, "description", {
        get: function get() {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    CodeRef.prototype.toString = function () {
        return this.code + ":" + this.description;
    };
    return CodeRef;
})(); /**
       * Created by rburson on 4/5/15.
       */

CodeRef = CodeRef;

},{"../util/StringUtil":109}],12:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 4/1/15.
 */
var ColumnDef = (function () {
    function ColumnDef(_name, _heading, _propertyDef) {
        this._name = _name;
        this._heading = _heading;
        this._propertyDef = _propertyDef;
    }
    Object.defineProperty(ColumnDef.prototype, "heading", {
        get: function get() {
            return this._heading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnDef.prototype, "isInlineMediaStyle", {
        get: function get() {
            return this._propertyDef.isInlineMediaStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnDef.prototype, "name", {
        get: function get() {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnDef.prototype, "propertyDef", {
        get: function get() {
            return this._propertyDef;
        },
        enumerable: true,
        configurable: true
    });
    return ColumnDef;
})();
ColumnDef = ColumnDef;

},{}],13:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/27/15.
 */
var ContextAction = (function () {
    function ContextAction(actionId, objectId, fromActionSource) {
        this.actionId = actionId;
        this.objectId = objectId;
        this.fromActionSource = fromActionSource;
    }
    Object.defineProperty(ContextAction.prototype, "virtualPathSuffix", {
        get: function get() {
            return [this.objectId, this.actionId];
        },
        enumerable: true,
        configurable: true
    });
    return ContextAction;
})();
ContextAction = ContextAction;

},{}],14:[function(require,module,exports){
"use strict";

var _StringUtil = require("../util/StringUtil");

var _ArrayUtil = require("../util/ArrayUtil");

var _Success = require("../fp/Success");

var _Failure = require("../fp/Failure");

var _DialogTriple = require("./DialogTriple");

var _Prop = require("./Prop");

var _OType = require("./OType");

var DataAnno = (function () {
    function DataAnno(_name, _value) {
        this._name = _name;
        this._value = _value;
    }
    DataAnno.annotatePropsUsingWSDataAnnotation = function (props, jsonObj) {
        return _DialogTriple.DialogTriple.fromListOfWSDialogObject(jsonObj, 'WSDataAnnotation', _OType.OType.factoryFn).bind(function (propAnnos) {
            var annotatedProps = [];
            for (var i = 0; i < props.length; i++) {
                var p = props[i];
                var annos = propAnnos[i];
                if (annos) {
                    annotatedProps.push(new _Prop.Prop(p.name, p.value, annos));
                } else {
                    annotatedProps.push(p);
                }
            }
            return new _Success.Success(annotatedProps);
        });
    };
    DataAnno.backgroundColor = function (annos) {
        var result = _ArrayUtil.ArrayUtil.find(annos, function (anno) {
            return anno.isBackgroundColor;
        });
        return result ? result.backgroundColor : null;
    };
    DataAnno.foregroundColor = function (annos) {
        var result = _ArrayUtil.ArrayUtil.find(annos, function (anno) {
            return anno.isForegroundColor;
        });
        return result ? result.foregroundColor : null;
    };
    DataAnno.fromWS = function (otype, jsonObj) {
        var stringObj = jsonObj['annotations'];
        if (stringObj['WS_LTYPE'] !== 'String') {
            return new _Failure.Failure('DataAnno:fromWS: expected WS_LTYPE of String but found ' + stringObj['WS_LTYPE']);
        }
        var annoStrings = stringObj['values'];
        var annos = [];
        for (var i = 0; i < annoStrings.length; i++) {
            annos.push(DataAnno.parseString(annoStrings[i]));
        }
        return new _Success.Success(annos);
    };
    DataAnno.imageName = function (annos) {
        var result = _ArrayUtil.ArrayUtil.find(annos, function (anno) {
            return anno.isImageName;
        });
        return result ? result.value : null;
    };
    DataAnno.imagePlacement = function (annos) {
        var result = _ArrayUtil.ArrayUtil.find(annos, function (anno) {
            return anno.isImagePlacement;
        });
        return result ? result.value : null;
    };
    DataAnno.isBoldText = function (annos) {
        return annos.some(function (anno) {
            return anno.isBoldText;
        });
    };
    DataAnno.isItalicText = function (annos) {
        return annos.some(function (anno) {
            return anno.isItalicText;
        });
    };
    DataAnno.isPlacementCenter = function (annos) {
        return annos.some(function (anno) {
            return anno.isPlacementCenter;
        });
    };
    DataAnno.isPlacementLeft = function (annos) {
        return annos.some(function (anno) {
            return anno.isPlacementLeft;
        });
    };
    DataAnno.isPlacementRight = function (annos) {
        return annos.some(function (anno) {
            return anno.isPlacementRight;
        });
    };
    DataAnno.isPlacementStretchUnder = function (annos) {
        return annos.some(function (anno) {
            return anno.isPlacementStretchUnder;
        });
    };
    DataAnno.isPlacementUnder = function (annos) {
        return annos.some(function (anno) {
            return anno.isPlacementUnder;
        });
    };
    DataAnno.isUnderlineText = function (annos) {
        return annos.some(function (anno) {
            return anno.isUnderlineText;
        });
    };
    DataAnno.overrideText = function (annos) {
        var result = _ArrayUtil.ArrayUtil.find(annos, function (anno) {
            return anno.isOverrideText;
        });
        return result ? result.value : null;
    };
    DataAnno.tipText = function (annos) {
        var result = _ArrayUtil.ArrayUtil.find(annos, function (anno) {
            return anno.isTipText;
        });
        return result ? result.value : null;
    };
    DataAnno.toListOfWSDataAnno = function (annos) {
        var result = { 'WS_LTYPE': 'WSDataAnno' };
        var values = [];
        annos.forEach(function (anno) {
            values.push(anno.toWS());
        });
        result['values'] = values;
        return result;
    };
    DataAnno.parseString = function (formatted) {
        var pair = _StringUtil.StringUtil.splitSimpleKeyValuePair(formatted);
        return new DataAnno(pair[0], pair[1]);
    };
    Object.defineProperty(DataAnno.prototype, "backgroundColor", {
        get: function get() {
            return this.isBackgroundColor ? this.value : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "foregroundColor", {
        get: function get() {
            return this.isForegroundColor ? this.value : null;
        },
        enumerable: true,
        configurable: true
    });
    DataAnno.prototype.equals = function (dataAnno) {
        return this.name === dataAnno.name;
    };
    Object.defineProperty(DataAnno.prototype, "isBackgroundColor", {
        get: function get() {
            return this.name === DataAnno.BACKGROUND_COLOR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isBoldText", {
        get: function get() {
            return this.name === DataAnno.BOLD_TEXT && this.value === DataAnno.TRUE_VALUE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isForegroundColor", {
        get: function get() {
            return this.name === DataAnno.FOREGROUND_COLOR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isImageName", {
        get: function get() {
            return this.name === DataAnno.IMAGE_NAME;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isImagePlacement", {
        get: function get() {
            return this.name === DataAnno.IMAGE_PLACEMENT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isItalicText", {
        get: function get() {
            return this.name === DataAnno.ITALIC_TEXT && this.value === DataAnno.TRUE_VALUE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isOverrideText", {
        get: function get() {
            return this.name === DataAnno.OVERRIDE_TEXT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isPlacementCenter", {
        get: function get() {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_CENTER;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isPlacementLeft", {
        get: function get() {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_LEFT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isPlacementRight", {
        get: function get() {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_RIGHT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isPlacementStretchUnder", {
        get: function get() {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_STRETCH_UNDER;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isPlacementUnder", {
        get: function get() {
            return this.isImagePlacement && this.value === DataAnno.PLACEMENT_UNDER;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isTipText", {
        get: function get() {
            return this.name === DataAnno.TIP_TEXT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "isUnderlineText", {
        get: function get() {
            return this.name === DataAnno.UNDERLINE && this.value === DataAnno.TRUE_VALUE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "name", {
        get: function get() {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataAnno.prototype, "value", {
        get: function get() {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    DataAnno.prototype.toWS = function () {
        return { 'WS_OTYPE': 'WSDataAnno', 'name': this.name, 'value': this.value };
    };
    DataAnno.BOLD_TEXT = "BOLD_TEXT";
    DataAnno.BACKGROUND_COLOR = "BGND_COLOR";
    DataAnno.FOREGROUND_COLOR = "FGND_COLOR";
    DataAnno.IMAGE_NAME = "IMAGE_NAME";
    DataAnno.IMAGE_PLACEMENT = "IMAGE_PLACEMENT";
    DataAnno.ITALIC_TEXT = "ITALIC_TEXT";
    DataAnno.OVERRIDE_TEXT = "OVRD_TEXT";
    DataAnno.TIP_TEXT = "TIP_TEXT";
    DataAnno.UNDERLINE = "UNDERLINE";
    DataAnno.TRUE_VALUE = "1";
    DataAnno.PLACEMENT_CENTER = "CENTER";
    DataAnno.PLACEMENT_LEFT = "LEFT";
    DataAnno.PLACEMENT_RIGHT = "RIGHT";
    DataAnno.PLACEMENT_UNDER = "UNDER";
    DataAnno.PLACEMENT_STRETCH_UNDER = "STRETCH_UNDER";
    return DataAnno;
})(); /**
       * Created by rburson on 4/2/15.
       */

DataAnno = DataAnno;

},{"../fp/Failure":100,"../fp/Success":103,"../util/ArrayUtil":105,"../util/StringUtil":109,"./DialogTriple":20,"./OType":52,"./Prop":57}],15:[function(require,module,exports){
"use strict";

var _EditorContext = require("./EditorContext");

/**
 * Created by rburson on 5/4/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var DetailsContext = (function (_super) {
    __extends(DetailsContext, _super);
    function DetailsContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(DetailsContext.prototype, "detailsDef", {
        get: function get() {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsContext.prototype, "printMarkupURL", {
        get: function get() {
            return this.paneDef.dialogRedirection.dialogProperties['formsURL'];
        },
        enumerable: true,
        configurable: true
    });
    return DetailsContext;
})(_EditorContext.EditorContext);
DetailsContext = DetailsContext;

},{"./EditorContext":21}],16:[function(require,module,exports){
"use strict";

var _PaneDef = require("./PaneDef");

/**
 * Created by rburson on 4/21/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var DetailsDef = (function (_super) {
    __extends(DetailsDef, _super);
    function DetailsDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _cancelButtonText, _commitButtonText, _editable, _focusPropName, _graphicalMarkup, _rows) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._cancelButtonText = _cancelButtonText;
        this._commitButtonText = _commitButtonText;
        this._editable = _editable;
        this._focusPropName = _focusPropName;
        this._graphicalMarkup = _graphicalMarkup;
        this._rows = _rows;
    }
    Object.defineProperty(DetailsDef.prototype, "cancelButtonText", {
        get: function get() {
            return this._cancelButtonText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsDef.prototype, "commitButtonText", {
        get: function get() {
            return this._commitButtonText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsDef.prototype, "editable", {
        get: function get() {
            return this._editable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsDef.prototype, "focusPropName", {
        get: function get() {
            return this._focusPropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsDef.prototype, "graphicalMarkup", {
        get: function get() {
            return this._graphicalMarkup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetailsDef.prototype, "rows", {
        get: function get() {
            return this._rows;
        },
        enumerable: true,
        configurable: true
    });
    return DetailsDef;
})(_PaneDef.PaneDef);
DetailsDef = DetailsDef;

},{"./PaneDef":55}],17:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/27/15.
 */
var DialogHandle = (function () {
    function DialogHandle(handleValue, sessionHandle) {
        this.handleValue = handleValue;
        this.sessionHandle = sessionHandle;
    }
    return DialogHandle;
})();
DialogHandle = DialogHandle;

},{}],18:[function(require,module,exports){
"use strict";

var _Redirection = require("./Redirection");

/**
 * Created by rburson on 3/26/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var DialogRedirection = (function (_super) {
    __extends(DialogRedirection, _super);
    function DialogRedirection(_dialogHandle, _dialogType, _dialogMode, _paneMode, _objectId, _open, _domainClassName, _dialogModelClassName, _dialogProperties, _fromDialogProperties) {
        _super.call(this);
        this._dialogHandle = _dialogHandle;
        this._dialogType = _dialogType;
        this._dialogMode = _dialogMode;
        this._paneMode = _paneMode;
        this._objectId = _objectId;
        this._open = _open;
        this._domainClassName = _domainClassName;
        this._dialogModelClassName = _dialogModelClassName;
        this._dialogProperties = _dialogProperties;
        this._fromDialogProperties = _fromDialogProperties;
    }
    Object.defineProperty(DialogRedirection.prototype, "dialogHandle", {
        get: function get() {
            return this._dialogHandle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "dialogMode", {
        get: function get() {
            return this._dialogMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "dialogModelClassName", {
        get: function get() {
            return this._dialogModelClassName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "dialogProperties", {
        get: function get() {
            return this._dialogProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "dialogType", {
        get: function get() {
            return this._dialogType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "domainClassName", {
        get: function get() {
            return this._domainClassName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "fromDialogProperties", {
        get: function get() {
            return this._fromDialogProperties;
        },
        set: function set(props) {
            this._fromDialogProperties = props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "isEditor", {
        get: function get() {
            return this._dialogType === 'EDITOR';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "isQuery", {
        get: function get() {
            return this._dialogType === 'QUERY';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "objectId", {
        get: function get() {
            return this._objectId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "open", {
        get: function get() {
            return this._open;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogRedirection.prototype, "paneMode", {
        get: function get() {
            return this._paneMode;
        },
        enumerable: true,
        configurable: true
    });
    return DialogRedirection;
})(_Redirection.Redirection);
DialogRedirection = DialogRedirection;

},{"./Redirection":63}],19:[function(require,module,exports){
"use strict";

var _PaneMode = require("./PaneMode");

var _Future = require("../fp/Future");

var _OType = require("./OType");

var _Request = require("../ws/Request");

var _DialogTriple = require("./DialogTriple");

var _Success = require("../fp/Success");

var _Prop = require("./Prop");

var _QueryContext = require("./QueryContext");

var _Log = require("../util/Log");

var _Either = require("../fp/Either");

/**
 * Created by rburson on 4/14/15.
 */

var DialogService = (function () {
    function DialogService() {}
    DialogService.changePaneMode = function (dialogHandle, paneMode, sessionContext) {
        var method = 'changePaneMode';
        var params = {
            'dialogHandle': _OType.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'paneMode': _PaneMode.PaneMode[paneMode]
        };
        var call = _Request.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture('changePaneMode', _DialogTriple.DialogTriple.fromWSDialogObject(result, 'WSChangePaneModeResult', _OType.OType.factoryFn));
        });
    };
    DialogService.closeEditorModel = function (dialogHandle, sessionContext) {
        var method = 'close';
        var params = { 'dialogHandle': _OType.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = _Request.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createSuccessfulFuture('closeEditorModel', result);
        });
    };
    DialogService.getAvailableValues = function (dialogHandle, propertyName, pendingWrites, sessionContext) {
        var method = 'getAvailableValues';
        var params = {
            'dialogHandle': _OType.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName
        };
        if (pendingWrites) params['pendingWrites'] = pendingWrites.toWSEditorRecord();
        var call = _Request.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture('getAvailableValues', _DialogTriple.DialogTriple.fromWSDialogObject(result, 'WSGetAvailableValuesResult', _OType.OType.factoryFn));
        });
    };
    DialogService.getActiveColumnDefs = function (dialogHandle, sessionContext) {
        var method = 'getActiveColumnDefs';
        var params = { 'dialogHandle': _OType.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = _Request.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture('getActiveColumnDefs', _DialogTriple.DialogTriple.fromWSDialogObject(result, 'WSGetActiveColumnDefsResult', _OType.OType.factoryFn));
        });
    };
    DialogService.getEditorModelMenuDefs = function (dialogHandle, sessionContext) {
        var method = 'getMenuDefs';
        var params = { 'dialogHandle': _OType.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = _Request.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture('getEditorModelMenuDefs', _DialogTriple.DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', _OType.OType.factoryFn));
        });
    };
    DialogService.getEditorModelPaneDef = function (dialogHandle, paneId, sessionContext) {
        var method = 'getPaneDef';
        var params = { 'dialogHandle': _OType.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        params['paneId'] = paneId;
        var call = _Request.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture('getEditorModelPaneDef', _DialogTriple.DialogTriple.fromWSDialogObjectResult(result, 'WSGetPaneDefResult', 'WSPaneDef', 'paneDef', _OType.OType.factoryFn));
        });
    };
    DialogService.getQueryModelMenuDefs = function (dialogHandle, sessionContext) {
        var method = 'getMenuDefs';
        var params = { 'dialogHandle': _OType.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = _Request.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture('getQueryModelMenuDefs', _DialogTriple.DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', _OType.OType.factoryFn));
        });
    };
    DialogService.openEditorModelFromRedir = function (redirection, sessionContext) {
        var method = 'open2';
        var params = {
            'editorMode': redirection.dialogMode,
            'dialogHandle': _OType.OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle')
        };
        if (redirection.objectId) params['objectId'] = redirection.objectId;
        var call = _Request.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture('openEditorModelFromRedir', _DialogTriple.DialogTriple.fromWSDialogObject(result, 'WSOpenEditorModelResult', _OType.OType.factoryFn));
        });
    };
    DialogService.openQueryModelFromRedir = function (redirection, sessionContext) {
        if (!redirection.isQuery) return _Future.Future.createFailedFuture('DialogService::openQueryModelFromRedir', 'Redirection must be a query');
        var method = 'open';
        var params = { 'dialogHandle': _OType.OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle') };
        var call = _Request.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture('openQueryModelFromRedir', _DialogTriple.DialogTriple.fromWSDialogObject(result, 'WSOpenQueryModelResult', _OType.OType.factoryFn));
        });
    };
    DialogService.performEditorAction = function (dialogHandle, actionId, pendingWrites, sessionContext) {
        var method = 'performAction';
        var params = {
            'actionId': actionId,
            'dialogHandle': _OType.OType.serializeObject(dialogHandle, 'WSDialogHandle')
        };
        if (pendingWrites) params['pendingWrites'] = pendingWrites.toWSEditorRecord();
        var call = _Request.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            var redirectionTry = _DialogTriple.DialogTriple.extractRedirection(result, 'WSPerformActionResult');
            if (redirectionTry.isSuccess) {
                var r = redirectionTry.success;
                r.fromDialogProperties = result['dialogProperties'];
                redirectionTry = new _Success.Success(r);
            }
            return _Future.Future.createCompletedFuture('performEditorAction', redirectionTry);
        });
    };
    DialogService.performQueryAction = function (dialogHandle, actionId, targets, sessionContext) {
        var method = 'performAction';
        var params = {
            'actionId': actionId,
            'dialogHandle': _OType.OType.serializeObject(dialogHandle, 'WSDialogHandle')
        };
        if (targets) {
            params['targets'] = targets;
        }
        var call = _Request.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            var redirectionTry = _DialogTriple.DialogTriple.extractRedirection(result, 'WSPerformActionResult');
            if (redirectionTry.isSuccess) {
                var r = redirectionTry.success;
                r.fromDialogProperties = result['dialogProperties'];
                redirectionTry = new _Success.Success(r);
            }
            return _Future.Future.createCompletedFuture('performQueryAction', redirectionTry);
        });
    };
    DialogService.processSideEffects = function (dialogHandle, sessionContext, propertyName, propertyValue, pendingWrites) {
        var method = 'handlePropertyChange';
        var params = {
            'dialogHandle': _OType.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'propertyValue': _Prop.Prop.toWSProperty(propertyValue),
            'pendingWrites': pendingWrites.toWSEditorRecord()
        };
        var call = _Request.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture('processSideEffects', _DialogTriple.DialogTriple.fromWSDialogObject(result, 'WSHandlePropertyChangeResult', _OType.OType.factoryFn));
        });
    };
    DialogService.queryQueryModel = function (dialogHandle, direction, maxRows, fromObjectId, sessionContext) {
        var method = 'query';
        var params = {
            'dialogHandle': _OType.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'maxRows': maxRows,
            'direction': direction === _QueryContext.QueryDirection.BACKWARD ? 'BACKWARD' : 'FORWARD'
        };
        if (fromObjectId && fromObjectId.trim() !== '') {
            params['fromObjectId'] = fromObjectId.trim();
        }
        _Log.Log.info('Running query');
        var call = _Request.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            var call = _Request.Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
            return _Future.Future.createCompletedFuture('DialogService::queryQueryModel', _DialogTriple.DialogTriple.fromWSDialogObject(result, 'WSQueryResult', _OType.OType.factoryFn));
        });
    };
    DialogService.readEditorModel = function (dialogHandle, sessionContext) {
        var method = 'read';
        var params = { 'dialogHandle': _OType.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = _Request.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture('readEditorModel', _DialogTriple.DialogTriple.fromWSDialogObject(result, 'WSReadResult', _OType.OType.factoryFn));
        });
    };
    DialogService.writeEditorModel = function (dialogHandle, entityRec, sessionContext) {
        var method = 'write';
        var params = {
            'dialogHandle': _OType.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'editorRecord': entityRec.toWSEditorRecord()
        };
        var call = _Request.Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            var writeResultTry = _DialogTriple.DialogTriple.fromWSDialogObject(result, 'WSWriteResult', _OType.OType.factoryFn);
            if (writeResultTry.isSuccess && writeResultTry.success.isLeft) {
                var redirection = writeResultTry.success.left;
                redirection.fromDialogProperties = result['dialogProperties'] || {};
                writeResultTry = new _Success.Success(_Either.Either.left(redirection));
            }
            return _Future.Future.createCompletedFuture('writeEditorModel', writeResultTry);
        });
    };
    DialogService.EDITOR_SERVICE_NAME = 'EditorService';
    DialogService.EDITOR_SERVICE_PATH = 'soi-json-v02/' + DialogService.EDITOR_SERVICE_NAME;
    DialogService.QUERY_SERVICE_NAME = 'QueryService';
    DialogService.QUERY_SERVICE_PATH = 'soi-json-v02/' + DialogService.QUERY_SERVICE_NAME;
    return DialogService;
})();
DialogService = DialogService;

},{"../fp/Either":99,"../fp/Future":101,"../fp/Success":103,"../util/Log":107,"../ws/Request":110,"./DialogTriple":20,"./OType":52,"./PaneMode":56,"./Prop":57,"./QueryContext":60}],20:[function(require,module,exports){
"use strict";

var _Failure = require("../fp/Failure");

var _Success = require("../fp/Success");

var _NullRedirection = require("./NullRedirection");

var _Either = require("../fp/Either");

var _OType = require("./OType");

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; } /**
                                                                                                                              * Created by rburson on 3/9/15.
                                                                                                                              */

var DialogTriple = (function () {
    function DialogTriple() {}
    DialogTriple.extractList = function (jsonObject, Ltype, extractor) {
        var result;
        if (jsonObject) {
            var lt = jsonObject['WS_LTYPE'];
            if (Ltype === lt) {
                if (jsonObject['values']) {
                    var realValues = [];
                    var values = jsonObject['values'];
                    values.every(function (item) {
                        var extdValue = extractor(item);
                        if (extdValue.isFailure) {
                            result = new _Failure.Failure(extdValue.failure);
                            return false;
                        }
                        realValues.push(extdValue.success);
                        return true;
                    });
                    if (!result) {
                        result = new _Success.Success(realValues);
                    }
                } else {
                    result = new _Failure.Failure("DialogTriple::extractList: Values array not found");
                }
            } else {
                result = new _Failure.Failure("DialogTriple::extractList: Expected WS_LTYPE " + Ltype + " but found " + lt);
            }
        }
        return result;
    };
    DialogTriple.extractRedirection = function (jsonObject, Otype) {
        var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, false, function () {
            return new _Success.Success(new _NullRedirection.NullRedirection({}));
        });
        var answer;
        if (tripleTry.isSuccess) {
            var triple = tripleTry.success;
            answer = triple.isLeft ? new _Success.Success(triple.left) : new _Success.Success(triple.right);
        } else {
            answer = new _Failure.Failure(tripleTry.failure);
        }
        return answer;
    };
    DialogTriple.extractTriple = function (jsonObject, Otype, extractor) {
        return DialogTriple._extractTriple(jsonObject, Otype, false, extractor);
    };
    DialogTriple.extractValue = function (jsonObject, Otype, extractor) {
        return DialogTriple._extractValue(jsonObject, Otype, false, extractor);
    };
    DialogTriple.extractValueIgnoringRedirection = function (jsonObject, Otype, extractor) {
        return DialogTriple._extractValue(jsonObject, Otype, true, extractor);
    };
    DialogTriple.fromWSDialogObject = function (obj, Otype, factoryFn, ignoreRedirection) {
        if (ignoreRedirection === void 0) {
            ignoreRedirection = false;
        }
        if (!obj) {
            return new _Failure.Failure('DialogTriple::fromWSDialogObject: Cannot extract from null value');
        } else if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== 'object') {
            return new _Success.Success(obj);
        }
        try {
            if (!factoryFn) {
                /* Assume we're just going to coerce the exiting object */
                return DialogTriple.extractValue(obj, Otype, function () {
                    return new _Success.Success(obj);
                });
            } else {
                if (ignoreRedirection) {
                    return DialogTriple.extractValueIgnoringRedirection(obj, Otype, function () {
                        return _OType.OType.deserializeObject(obj, Otype, factoryFn);
                    });
                } else {
                    return DialogTriple.extractValue(obj, Otype, function () {
                        return _OType.OType.deserializeObject(obj, Otype, factoryFn);
                    });
                }
            }
        } catch (e) {
            return new _Failure.Failure('DialogTriple::fromWSDialogObject: ' + e.name + ": " + e.message);
        }
    };
    DialogTriple.fromListOfWSDialogObject = function (jsonObject, Ltype, factoryFn, ignoreRedirection) {
        if (ignoreRedirection === void 0) {
            ignoreRedirection = false;
        }
        return DialogTriple.extractList(jsonObject, Ltype, function (value) {
            /*note - we could add a check here to make sure the otype 'is a' ltype, to enforce the generic constraint
             i.e. list items should be lype assignment compatible*/
            if (!value) return new _Success.Success(null);
            var Otype = value['WS_OTYPE'] || Ltype;
            return DialogTriple.fromWSDialogObject(value, Otype, factoryFn, ignoreRedirection);
        });
    };
    DialogTriple.fromWSDialogObjectResult = function (jsonObject, resultOtype, targetOtype, objPropName, factoryFn) {
        return DialogTriple.extractValue(jsonObject, resultOtype, function () {
            return DialogTriple.fromWSDialogObject(jsonObject[objPropName], targetOtype, factoryFn);
        });
    };
    DialogTriple.fromWSDialogObjectsResult = function (jsonObject, resultOtype, targetLtype, objPropName, factoryFn) {
        return DialogTriple.extractValue(jsonObject, resultOtype, function () {
            return DialogTriple.fromListOfWSDialogObject(jsonObject[objPropName], targetLtype, factoryFn);
        });
    };
    DialogTriple._extractTriple = function (jsonObject, Otype, ignoreRedirection, extractor) {
        if (!jsonObject) {
            return new _Failure.Failure('DialogTriple::extractTriple: cannot extract object of WS_OTYPE ' + Otype + ' because json object is null');
        } else {
            if (Array.isArray(jsonObject)) {
                //verify we'll dealing with a nested List
                if (Otype.indexOf('List') !== 0) {
                    return new _Failure.Failure("DialogTriple::extractTriple: expected OType of List<> for Array obj");
                }
            } else {
                var ot = jsonObject['WS_OTYPE'];
                if (!ot || Otype !== ot) {
                    return new _Failure.Failure('DialogTriple:extractTriple: expected O_TYPE ' + Otype + ' but found ' + ot);
                } else {
                    if (jsonObject['exception']) {
                        var dialogException = jsonObject['exception'];
                        return new _Failure.Failure(dialogException);
                    } else if (jsonObject['redirection'] && !ignoreRedirection) {
                        var drt = DialogTriple.fromWSDialogObject(jsonObject['redirection'], 'WSRedirection', _OType.OType.factoryFn);
                        if (drt.isFailure) {
                            return new _Failure.Failure(drt.failure);
                        } else {
                            var either = _Either.Either.left(drt.success);
                            return new _Success.Success(either);
                        }
                    }
                }
            }
            var result;
            if (extractor) {
                var valueTry = extractor();
                if (valueTry.isFailure) {
                    result = new _Failure.Failure(valueTry.failure);
                } else {
                    result = new _Success.Success(_Either.Either.right(valueTry.success));
                }
            } else {
                result = new _Failure.Failure('DialogTriple::extractTriple: Triple is not an exception or redirection and no value extractor was provided');
            }
            return result;
        }
    };
    DialogTriple._extractValue = function (jsonObject, Otype, ignoreRedirection, extractor) {
        var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, ignoreRedirection, extractor);
        var result;
        if (tripleTry.isFailure) {
            result = new _Failure.Failure(tripleTry.failure);
        } else {
            var triple = tripleTry.success;
            if (triple.isLeft) {
                result = new _Failure.Failure('DialogTriple::extractValue: Unexpected redirection for O_TYPE: ' + Otype);
            } else {
                result = new _Success.Success(triple.right);
            }
        }
        return result;
    };
    return DialogTriple;
})();
DialogTriple = DialogTriple;

},{"../fp/Either":99,"../fp/Failure":100,"../fp/Success":103,"./NullRedirection":51,"./OType":52}],21:[function(require,module,exports){
"use strict";

var _PaneContext = require("./PaneContext");

var _EntityBuffer = require("./EntityBuffer");

var _NullEntityRec = require("./NullEntityRec");

var _Future = require("../fp/Future");

var _DialogService = require("./DialogService");

var _ContextAction = require("./ContextAction");

var _AppContext = require("./AppContext");

var _Either = require("../fp/Either");

var _ObjUtil = require("../util/ObjUtil");

var _NavRequest = require("./NavRequest");

var _EntityRec = require("./EntityRec");

/**
 * Created by rburson on 4/27/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var EditorState;
(function (EditorState) {
    EditorState[EditorState["READ"] = 0] = "READ";
    EditorState[EditorState["WRITE"] = 1] = "WRITE";
    EditorState[EditorState["DESTROYED"] = 2] = "DESTROYED";
})(EditorState || (EditorState = {}));
;
var EditorContext = (function (_super) {
    __extends(EditorContext, _super);
    function EditorContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(EditorContext.prototype, "buffer", {
        get: function get() {
            if (!this._buffer) {
                this._buffer = new _EntityBuffer.EntityBuffer(_NullEntityRec.NullEntityRec.singleton);
            }
            return this._buffer;
        },
        enumerable: true,
        configurable: true
    });
    EditorContext.prototype.changePaneMode = function (paneMode) {
        var _this = this;
        return _DialogService.DialogService.changePaneMode(this.paneDef.dialogHandle, paneMode, this.sessionContext).bind(function (changePaneModeResult) {
            _this.putSettings(changePaneModeResult.dialogProps);
            if (_this.isDestroyedSetting) {
                _this._editorState = EditorState.DESTROYED;
            } else {
                _this.entityRecDef = changePaneModeResult.entityRecDef;
                if (_this.isReadModeSetting) {
                    _this._editorState = EditorState.READ;
                } else {
                    _this._editorState = EditorState.WRITE;
                }
            }
            return _Future.Future.createSuccessfulFuture('EditorContext::changePaneMode', _this.entityRecDef);
        });
    };
    Object.defineProperty(EditorContext.prototype, "entityRec", {
        get: function get() {
            return this._buffer.toEntityRec();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorContext.prototype, "entityRecNow", {
        get: function get() {
            return this.entityRec;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorContext.prototype, "entityRecDef", {
        get: function get() {
            return this._entityRecDef;
        },
        set: function set(entityRecDef) {
            this._entityRecDef = entityRecDef;
        },
        enumerable: true,
        configurable: true
    });
    EditorContext.prototype.getAvailableValues = function (propName) {
        return _DialogService.DialogService.getAvailableValues(this.paneDef.dialogHandle, propName, this.buffer.afterEffects(), this.sessionContext).map(function (valuesResult) {
            return valuesResult.list;
        });
    };
    EditorContext.prototype.isBinary = function (cellValueDef) {
        var propDef = this.propDefAtName(cellValueDef.propertyName);
        return propDef && (propDef.isBinaryType || propDef.isURLType && cellValueDef.isInlineMediaStyle);
    };
    Object.defineProperty(EditorContext.prototype, "isDestroyed", {
        get: function get() {
            return this._editorState === EditorState.DESTROYED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorContext.prototype, "isReadMode", {
        get: function get() {
            return this._editorState === EditorState.READ;
        },
        enumerable: true,
        configurable: true
    });
    EditorContext.prototype.isReadModeFor = function (propName) {
        if (!this.isReadMode) {
            var propDef = this.propDefAtName(propName);
            return !propDef || !propDef.maintainable || !propDef.writeEnabled;
        }
        return true;
    };
    Object.defineProperty(EditorContext.prototype, "isWriteMode", {
        get: function get() {
            return this._editorState === EditorState.WRITE;
        },
        enumerable: true,
        configurable: true
    });
    EditorContext.prototype.performMenuAction = function (menuDef, pendingWrites) {
        var _this = this;
        return _DialogService.DialogService.performEditorAction(this.paneDef.dialogHandle, menuDef.actionId, pendingWrites, this.sessionContext).bind(function (redirection) {
            var ca = new _ContextAction.ContextAction(menuDef.actionId, _this.parentContext.dialogRedirection.objectId, _this.actionSource);
            return _NavRequest.NavRequestUtil.fromRedirection(redirection, ca, _this.sessionContext).map(function (navRequest) {
                _this._settings = _PaneContext.PaneContext.resolveSettingsFromNavRequest(_this._settings, navRequest);
                if (_this.isDestroyedSetting) {
                    _this._editorState = EditorState.DESTROYED;
                }
                if (_this.isRefreshSetting) {
                    _AppContext.AppContext.singleton.lastMaintenanceTime = new Date();
                }
                return navRequest;
            });
        });
    };
    EditorContext.prototype.processSideEffects = function (propertyName, value) {
        var _this = this;
        var sideEffectsFr = _DialogService.DialogService.processSideEffects(this.paneDef.dialogHandle, this.sessionContext, propertyName, value, this.buffer.afterEffects()).map(function (changeResult) {
            return changeResult.sideEffects ? changeResult.sideEffects.entityRec : new _NullEntityRec.NullEntityRec();
        });
        return sideEffectsFr.map(function (sideEffectsRec) {
            var originalProps = _this.buffer.before.props;
            var userEffects = _this.buffer.afterEffects().props;
            var sideEffects = sideEffectsRec.props;
            sideEffects = sideEffects.filter(function (prop) {
                return prop.name !== propertyName;
            });
            _this._buffer = _EntityBuffer.EntityBuffer.createEntityBuffer(_this.buffer.objectId, _EntityRec.EntityRecUtil.union(originalProps, sideEffects), _EntityRec.EntityRecUtil.union(originalProps, _EntityRec.EntityRecUtil.union(userEffects, sideEffects)));
            return null;
        });
    };
    EditorContext.prototype.read = function () {
        var _this = this;
        return _DialogService.DialogService.readEditorModel(this.paneDef.dialogHandle, this.sessionContext).map(function (readResult) {
            _this.entityRecDef = readResult.entityRecDef;
            return readResult.entityRec;
        }).map(function (entityRec) {
            _this.initBuffer(entityRec);
            _this.lastRefreshTime = new Date();
            return entityRec;
        });
    };
    EditorContext.prototype.requestedAccuracy = function () {
        var accuracyStr = this.paneDef.settings[EditorContext.GPS_ACCURACY];
        return accuracyStr ? Number(accuracyStr) : 500;
    };
    EditorContext.prototype.requestedTimeoutSeconds = function () {
        var timeoutStr = this.paneDef.settings[EditorContext.GPS_SECONDS];
        return timeoutStr ? Number(timeoutStr) : 30;
    };
    EditorContext.prototype.write = function () {
        var _this = this;
        var result = _DialogService.DialogService.writeEditorModel(this.paneDef.dialogRedirection.dialogHandle, this.buffer.afterEffects(), this.sessionContext).bind(function (either) {
            if (either.isLeft) {
                var ca = new _ContextAction.ContextAction('#write', _this.parentContext.dialogRedirection.objectId, _this.actionSource);
                var navRequestFr = _NavRequest.NavRequestUtil.fromRedirection(either.left, ca, _this.sessionContext).map(function (navRequest) {
                    return _Either.Either.left(navRequest);
                });
            } else {
                var writeResult = either.right;
                _this.putSettings(writeResult.dialogProps);
                _this.entityRecDef = writeResult.entityRecDef;
                return _Future.Future.createSuccessfulFuture('EditorContext::write', _Either.Either.right(writeResult.entityRec));
            }
        });
        return result.map(function (successfulWrite) {
            var now = new Date();
            _AppContext.AppContext.singleton.lastMaintenanceTime = now;
            _this.lastRefreshTime = now;
            if (successfulWrite.isLeft) {
                _this._settings = _PaneContext.PaneContext.resolveSettingsFromNavRequest(_this._settings, successfulWrite.left);
            } else {
                _this.initBuffer(successfulWrite.right);
            }
            if (_this.isDestroyedSetting) {
                _this._editorState = EditorState.DESTROYED;
            } else {
                if (_this.isReadModeSetting) {
                    _this._editorState = EditorState.READ;
                }
            }
            return successfulWrite;
        });
    };
    //Module level methods
    EditorContext.prototype.initialize = function () {
        this._entityRecDef = this.paneDef.entityRecDef;
        this._settings = _ObjUtil.ObjUtil.addAllProps(this.dialogRedirection.dialogProperties, {});
        this._editorState = this.isReadModeSetting ? EditorState.READ : EditorState.WRITE;
    };
    Object.defineProperty(EditorContext.prototype, "settings", {
        get: function get() {
            return this._settings;
        },
        enumerable: true,
        configurable: true
    });
    //Private methods
    EditorContext.prototype.initBuffer = function (entityRec) {
        this._buffer = entityRec ? new _EntityBuffer.EntityBuffer(entityRec) : new _EntityBuffer.EntityBuffer(_NullEntityRec.NullEntityRec.singleton);
    };
    Object.defineProperty(EditorContext.prototype, "isDestroyedSetting", {
        get: function get() {
            var str = this._settings['destroyed'];
            return str && str.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorContext.prototype, "isGlobalRefreshSetting", {
        get: function get() {
            var str = this._settings['globalRefresh'];
            return str && str.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorContext.prototype, "isLocalRefreshSetting", {
        get: function get() {
            var str = this._settings['localRefresh'];
            return str && str.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorContext.prototype, "isReadModeSetting", {
        get: function get() {
            var paneMode = this.paneModeSetting;
            return paneMode && paneMode.toLowerCase() === 'read';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorContext.prototype, "isRefreshSetting", {
        get: function get() {
            return this.isLocalRefreshSetting || this.isGlobalRefreshSetting;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorContext.prototype, "paneModeSetting", {
        get: function get() {
            return this._settings['paneMode'];
        },
        enumerable: true,
        configurable: true
    });
    EditorContext.prototype.putSetting = function (key, value) {
        this._settings[key] = value;
    };
    EditorContext.prototype.putSettings = function (settings) {
        _ObjUtil.ObjUtil.addAllProps(settings, this._settings);
    };
    EditorContext.GPS_ACCURACY = 'com.catavolt.core.domain.GeoFix.accuracy';
    EditorContext.GPS_SECONDS = 'com.catavolt.core.domain.GeoFix.seconds';
    return EditorContext;
})(_PaneContext.PaneContext);
EditorContext = EditorContext;

},{"../fp/Either":99,"../fp/Future":101,"../util/ObjUtil":108,"./AppContext":1,"./ContextAction":13,"./DialogService":19,"./EntityBuffer":22,"./EntityRec":23,"./NavRequest":48,"./NullEntityRec":49,"./PaneContext":54}],22:[function(require,module,exports){
"use strict";

var _EntityRec = require("./EntityRec");

var EntityBuffer = (function () {
    function EntityBuffer(_before, _after) {
        this._before = _before;
        this._after = _after;
        if (!_before) throw new Error('_before is null in EntityBuffer');
        if (!_after) this._after = _before;
    }
    EntityBuffer.createEntityBuffer = function (objectId, before, after) {
        return new EntityBuffer(_EntityRec.EntityRecUtil.newEntityRec(objectId, before), _EntityRec.EntityRecUtil.newEntityRec(objectId, after));
    };
    Object.defineProperty(EntityBuffer.prototype, "after", {
        get: function get() {
            return this._after;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "annos", {
        get: function get() {
            return this._after.annos;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.annosAtName = function (propName) {
        return this._after.annosAtName(propName);
    };
    EntityBuffer.prototype.afterEffects = function (afterAnother) {
        if (afterAnother) {
            return this._after.afterEffects(afterAnother);
        } else {
            return this._before.afterEffects(this._after);
        }
    };
    Object.defineProperty(EntityBuffer.prototype, "backgroundColor", {
        get: function get() {
            return this._after.backgroundColor;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.backgroundColorFor = function (propName) {
        return this._after.backgroundColorFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "before", {
        get: function get() {
            return this._before;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "foregroundColor", {
        get: function get() {
            return this._after.foregroundColor;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.foregroundColorFor = function (propName) {
        return this._after.foregroundColorFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "imageName", {
        get: function get() {
            return this._after.imageName;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.imageNameFor = function (propName) {
        return this._after.imageNameFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "imagePlacement", {
        get: function get() {
            return this._after.imagePlacement;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.imagePlacementFor = function (propName) {
        return this._after.imagePlacement;
    };
    Object.defineProperty(EntityBuffer.prototype, "isBoldText", {
        get: function get() {
            return this._after.isBoldText;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isBoldTextFor = function (propName) {
        return this._after.isBoldTextFor(propName);
    };
    EntityBuffer.prototype.isChanged = function (name) {
        var before = this._before.propAtName(name);
        var after = this._after.propAtName(name);
        return before && after ? !before.equals(after) : !(!before && !after);
    };
    Object.defineProperty(EntityBuffer.prototype, "isItalicText", {
        get: function get() {
            return this._after.isItalicText;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isItalicTextFor = function (propName) {
        return this._after.isItalicTextFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementCenter", {
        get: function get() {
            return this._after.isPlacementCenter;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementCenterFor = function (propName) {
        return this._after.isPlacementCenterFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementLeft", {
        get: function get() {
            return this._after.isPlacementLeft;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementLeftFor = function (propName) {
        return this._after.isPlacementLeftFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementRight", {
        get: function get() {
            return this._after.isPlacementRight;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementRightFor = function (propName) {
        return this._after.isPlacementRightFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementStretchUnder", {
        get: function get() {
            return this._after.isPlacementStretchUnder;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementStretchUnderFor = function (propName) {
        return this._after.isPlacementStretchUnderFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isPlacementUnder", {
        get: function get() {
            return this._after.isPlacementUnder;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isPlacementUnderFor = function (propName) {
        return this._after.isPlacementUnderFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "isUnderline", {
        get: function get() {
            return this._after.isUnderline;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.isUnderlineFor = function (propName) {
        return this._after.isUnderlineFor(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "objectId", {
        get: function get() {
            return this._after.objectId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "overrideText", {
        get: function get() {
            return this._after.overrideText;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.overrideTextFor = function (propName) {
        return this._after.overrideTextFor(propName);
    };
    EntityBuffer.prototype.propAtIndex = function (index) {
        return this.props[index];
    };
    EntityBuffer.prototype.propAtName = function (propName) {
        return this._after.propAtName(propName);
    };
    Object.defineProperty(EntityBuffer.prototype, "propCount", {
        get: function get() {
            return this._after.propCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "propNames", {
        get: function get() {
            return this._after.propNames;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "props", {
        get: function get() {
            return this._after.props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityBuffer.prototype, "propValues", {
        get: function get() {
            return this._after.propValues;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.setValue = function (name, value) {
        this.props.some(function (prop) {
            if (prop.name === name) {
                prop.value = value;
                return true;
            }
            return false;
        });
    };
    Object.defineProperty(EntityBuffer.prototype, "tipText", {
        get: function get() {
            return this._after.tipText;
        },
        enumerable: true,
        configurable: true
    });
    EntityBuffer.prototype.tipTextFor = function (propName) {
        return this._after.tipTextFor(propName);
    };
    EntityBuffer.prototype.toEntityRec = function () {
        return _EntityRec.EntityRecUtil.newEntityRec(this.objectId, this.props);
    };
    EntityBuffer.prototype.toWSEditorRecord = function () {
        return this.afterEffects().toWSEditorRecord();
    };
    EntityBuffer.prototype.toWS = function () {
        return this.afterEffects().toWS();
    };
    EntityBuffer.prototype.valueAtName = function (propName) {
        return this._after.valueAtName(propName);
    };
    return EntityBuffer;
})(); /**
       * Created by rburson on 4/27/15.
       */

EntityBuffer = EntityBuffer;

},{"./EntityRec":23}],23:[function(require,module,exports){
'use strict';

var _DataAnno = require('./DataAnno');

var _Prop = require('./Prop');

var _EntityRecImpl = require('./EntityRecImpl');

var _ArrayUtil = require('../util/ArrayUtil');

var _Success = require('../fp/Success');

var _Failure = require('../fp/Failure');

/**
 * Created by rburson on 3/30/15.
 */

var EntityRecUtil = (function () {
    function EntityRecUtil() {}
    EntityRecUtil.newEntityRec = function (objectId, props, annos) {
        return annos ? new _EntityRecImpl.EntityRecImpl(objectId, props, annos) : new _EntityRecImpl.EntityRecImpl(objectId, props);
    };
    EntityRecUtil.union = function (l1, l2) {
        var result = _ArrayUtil.ArrayUtil.copy(l1);
        l2.forEach(function (p2) {
            if (!l1.some(function (p1, i) {
                if (p1.name === p2.name) {
                    result[i] = p2;
                    return true;
                }
                return false;
            })) {
                result.push(p2);
            }
        });
        return result;
    };
    //module level functions
    EntityRecUtil.fromWSEditorRecord = function (otype, jsonObj) {
        var objectId = jsonObj['objectId'];
        var namesJson = jsonObj['names'];
        if (namesJson['WS_LTYPE'] !== 'String') {
            return new _Failure.Failure('fromWSEditorRecord: Expected WS_LTYPE of String but found ' + namesJson['WS_LTYPE']);
        }
        var namesRaw = namesJson['values'];
        var propsJson = jsonObj['properties'];
        if (propsJson['WS_LTYPE'] !== 'Object') {
            return new _Failure.Failure('fromWSEditorRecord: Expected WS_LTYPE of Object but found ' + propsJson['WS_LTYPE']);
        }
        var propsRaw = propsJson['values'];
        var propsTry = _Prop.Prop.fromWSNamesAndValues(namesRaw, propsRaw);
        if (propsTry.isFailure) return new _Failure.Failure(propsTry.failure);
        var props = propsTry.success;
        if (jsonObj['propertyAnnotations']) {
            var propAnnosObj = jsonObj['propertyAnnotations'];
            var annotatedPropsTry = _DataAnno.DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosObj);
            if (annotatedPropsTry.isFailure) return new _Failure.Failure(annotatedPropsTry.failure);
        }
        var recAnnos = null;
        if (jsonObj['recordAnnotation']) {
            var recAnnosTry = _DataAnno.DataAnno.fromWS('WSDataAnnotation', jsonObj['recordAnnotation']);
            if (recAnnosTry.isFailure) return new _Failure.Failure(recAnnosTry.failure);
            recAnnos = recAnnosTry.success;
        }
        return new _Success.Success(new _EntityRecImpl.EntityRecImpl(objectId, props, recAnnos));
    };
    return EntityRecUtil;
})();
EntityRecUtil = EntityRecUtil;

},{"../fp/Failure":100,"../fp/Success":103,"../util/ArrayUtil":105,"./DataAnno":14,"./EntityRecImpl":25,"./Prop":57}],24:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/31/15.
 */
var EntityRecDef = (function () {
    function EntityRecDef(_propDefs) {
        this._propDefs = _propDefs;
    }
    Object.defineProperty(EntityRecDef.prototype, "propCount", {
        get: function get() {
            return this.propDefs.length;
        },
        enumerable: true,
        configurable: true
    });
    EntityRecDef.prototype.propDefAtName = function (name) {
        var propDef = null;
        this.propDefs.some(function (p) {
            if (p.name === name) {
                propDef = p;
                return true;
            }
            return false;
        });
        return propDef;
    };
    Object.defineProperty(EntityRecDef.prototype, "propDefs", {
        // Note we need to support both 'propDefs' and 'propertyDefs' as both
        // field names seem to be used in the dialog model
        get: function get() {
            return this._propDefs;
        },
        set: function set(propDefs) {
            this._propDefs = propDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRecDef.prototype, "propertyDefs", {
        get: function get() {
            return this._propDefs;
        },
        set: function set(propDefs) {
            this._propDefs = propDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRecDef.prototype, "propNames", {
        get: function get() {
            return this.propDefs.map(function (p) {
                return p.name;
            });
        },
        enumerable: true,
        configurable: true
    });
    return EntityRecDef;
})();
EntityRecDef = EntityRecDef;

},{}],25:[function(require,module,exports){
"use strict";

var _Prop = require("./Prop");

var _DataAnno = require("./DataAnno");

/**
 * Created by rburson on 4/13/15.
 */

var EntityRecImpl = (function () {
    function EntityRecImpl(objectId, props, annos) {
        if (props === void 0) {
            props = [];
        }
        if (annos === void 0) {
            annos = [];
        }
        this.objectId = objectId;
        this.props = props;
        this.annos = annos;
    }
    EntityRecImpl.prototype.annosAtName = function (propName) {
        var p = this.propAtName(propName);
        return p ? p.annos : [];
    };
    EntityRecImpl.prototype.afterEffects = function (after) {
        var _this = this;
        var effects = [];
        after.props.forEach(function (afterProp) {
            var beforeProp = _this.propAtName(afterProp.name);
            if (!afterProp.equals(beforeProp)) {
                effects.push(afterProp);
            }
        });
        return new EntityRecImpl(after.objectId, effects);
    };
    Object.defineProperty(EntityRecImpl.prototype, "backgroundColor", {
        get: function get() {
            return _DataAnno.DataAnno.backgroundColor(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.backgroundColorFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.backgroundColor ? p.backgroundColor : this.backgroundColor;
    };
    Object.defineProperty(EntityRecImpl.prototype, "foregroundColor", {
        get: function get() {
            return _DataAnno.DataAnno.foregroundColor(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.foregroundColorFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.foregroundColor ? p.foregroundColor : this.foregroundColor;
    };
    Object.defineProperty(EntityRecImpl.prototype, "imageName", {
        get: function get() {
            return _DataAnno.DataAnno.imageName(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.imageNameFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.imageName ? p.imageName : this.imageName;
    };
    Object.defineProperty(EntityRecImpl.prototype, "imagePlacement", {
        get: function get() {
            return _DataAnno.DataAnno.imagePlacement(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.imagePlacementFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.imagePlacement ? p.imagePlacement : this.imagePlacement;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isBoldText", {
        get: function get() {
            return _DataAnno.DataAnno.isBoldText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isBoldTextFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isBoldText ? p.isBoldText : this.isBoldText;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isItalicText", {
        get: function get() {
            return _DataAnno.DataAnno.isItalicText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isItalicTextFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isItalicText ? p.isItalicText : this.isItalicText;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementCenter", {
        get: function get() {
            return _DataAnno.DataAnno.isPlacementCenter(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementCenterFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementCenter ? p.isPlacementCenter : this.isPlacementCenter;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementLeft", {
        get: function get() {
            return _DataAnno.DataAnno.isPlacementLeft(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementLeftFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementLeft ? p.isPlacementLeft : this.isPlacementLeft;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementRight", {
        get: function get() {
            return _DataAnno.DataAnno.isPlacementRight(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementRightFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementRight ? p.isPlacementRight : this.isPlacementRight;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementStretchUnder", {
        get: function get() {
            return _DataAnno.DataAnno.isPlacementStretchUnder(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementStretchUnderFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementStretchUnder ? p.isPlacementStretchUnder : this.isPlacementStretchUnder;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isPlacementUnder", {
        get: function get() {
            return _DataAnno.DataAnno.isPlacementUnder(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isPlacementUnderFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementUnder ? p.isPlacementUnder : this.isPlacementUnder;
    };
    Object.defineProperty(EntityRecImpl.prototype, "isUnderline", {
        get: function get() {
            return _DataAnno.DataAnno.isUnderlineText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.isUnderlineFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.isUnderline ? p.isUnderline : this.isUnderline;
    };
    Object.defineProperty(EntityRecImpl.prototype, "overrideText", {
        get: function get() {
            return _DataAnno.DataAnno.overrideText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.overrideTextFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.overrideText ? p.overrideText : this.overrideText;
    };
    EntityRecImpl.prototype.propAtIndex = function (index) {
        return this.props[index];
    };
    EntityRecImpl.prototype.propAtName = function (propName) {
        var prop = null;
        this.props.some(function (p) {
            if (p.name === propName) {
                prop = p;
                return true;
            }
            return false;
        });
        return prop;
    };
    Object.defineProperty(EntityRecImpl.prototype, "propCount", {
        get: function get() {
            return this.props.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRecImpl.prototype, "propNames", {
        get: function get() {
            return this.props.map(function (p) {
                return p.name;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRecImpl.prototype, "propValues", {
        get: function get() {
            return this.props.map(function (p) {
                return p.value;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntityRecImpl.prototype, "tipText", {
        get: function get() {
            return _DataAnno.DataAnno.tipText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    EntityRecImpl.prototype.tipTextFor = function (propName) {
        var p = this.propAtName(propName);
        return p && p.tipText ? p.tipText : this.tipText;
    };
    EntityRecImpl.prototype.toEntityRec = function () {
        return this;
    };
    EntityRecImpl.prototype.toWSEditorRecord = function () {
        var result = { 'WS_OTYPE': 'WSEditorRecord' };
        if (this.objectId) result['objectId'] = this.objectId;
        result['names'] = _Prop.Prop.toWSListOfString(this.propNames);
        result['properties'] = _Prop.Prop.toWSListOfProperties(this.propValues);
        return result;
    };
    EntityRecImpl.prototype.toWS = function () {
        var result = { 'WS_OTYPE': 'WSEntityRec' };
        if (this.objectId) result['objectId'] = this.objectId;
        result['props'] = _Prop.Prop.toListOfWSProp(this.props);
        if (this.annos) result['annos'] = _DataAnno.DataAnno.toListOfWSDataAnno(this.annos);
        return result;
    };
    EntityRecImpl.prototype.valueAtName = function (propName) {
        var value = null;
        this.props.some(function (p) {
            if (p.name === propName) {
                value = p.value;
                return true;
            }
            return false;
        });
        return value;
    };
    return EntityRecImpl;
})();
EntityRecImpl = EntityRecImpl;

},{"./DataAnno":14,"./Prop":57}],26:[function(require,module,exports){
"use strict";

var _CellValueDef = require("./CellValueDef");

/**
 * Created by rburson on 4/16/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var ForcedLineCellValueDef = (function (_super) {
    __extends(ForcedLineCellValueDef, _super);
    function ForcedLineCellValueDef() {
        _super.call(this, null);
    }
    return ForcedLineCellValueDef;
})(_CellValueDef.CellValueDef);
ForcedLineCellValueDef = ForcedLineCellValueDef;

},{"./CellValueDef":10}],27:[function(require,module,exports){
"use strict";

var _PaneContext = require("./PaneContext");

var _DialogService = require("./DialogService");

var _NullEntityRec = require("./NullEntityRec");

var _ContextAction = require("./ContextAction");

var _EditorContext = require("./EditorContext");

var _QueryContext = require("./QueryContext");

var _NullNavRequest = require("./NullNavRequest");

var _NavRequest = require("./NavRequest");

/**
 * Created by rburson on 3/30/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var FormContext = (function (_super) {
    __extends(FormContext, _super);
    function FormContext(_dialogRedirection, _actionSource, _formDef, _childrenContexts, _offlineCapable, _offlineData, _sessionContext) {
        var _this = this;
        _super.call(this, null);
        this._dialogRedirection = _dialogRedirection;
        this._actionSource = _actionSource;
        this._formDef = _formDef;
        this._childrenContexts = _childrenContexts;
        this._offlineCapable = _offlineCapable;
        this._offlineData = _offlineData;
        this._sessionContext = _sessionContext;
        this._destroyed = false;
        this._offlineProps = {};
        this._childrenContexts = _childrenContexts || [];
        this._childrenContexts.forEach(function (c) {
            c.parentContext = _this;
        });
    }
    Object.defineProperty(FormContext.prototype, "actionSource", {
        get: function get() {
            return this.parentContext ? this.parentContext.actionSource : this._actionSource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "childrenContexts", {
        get: function get() {
            return this._childrenContexts;
        },
        enumerable: true,
        configurable: true
    });
    FormContext.prototype.close = function () {
        return _DialogService.DialogService.closeEditorModel(this.dialogRedirection.dialogHandle, this.sessionContext);
    };
    Object.defineProperty(FormContext.prototype, "dialogRedirection", {
        get: function get() {
            return this._dialogRedirection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "entityRecDef", {
        get: function get() {
            return this.formDef.entityRecDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "formDef", {
        get: function get() {
            return this._formDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "headerContext", {
        get: function get() {
            throw new Error('FormContext::headerContext: Needs Impl');
        },
        enumerable: true,
        configurable: true
    });
    FormContext.prototype.performMenuAction = function (menuDef) {
        var _this = this;
        return _DialogService.DialogService.performEditorAction(this.paneDef.dialogHandle, menuDef.actionId, _NullEntityRec.NullEntityRec.singleton, this.sessionContext).bind(function (value) {
            var destroyedStr = value.fromDialogProperties['destroyed'];
            if (destroyedStr && destroyedStr.toLowerCase() === 'true') {
                _this._destroyed = true;
            }
            var ca = new _ContextAction.ContextAction(menuDef.actionId, _this.dialogRedirection.objectId, _this.actionSource);
            return _NavRequest.NavRequestUtil.fromRedirection(value, ca, _this.sessionContext);
        });
    };
    Object.defineProperty(FormContext.prototype, "isDestroyed", {
        get: function get() {
            return this._destroyed || this.isAnyChildDestroyed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "offlineCapable", {
        get: function get() {
            return this._offlineCapable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "menuDefs", {
        get: function get() {
            return this.formDef.menuDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "offlineProps", {
        get: function get() {
            return this._offlineProps;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "paneDef", {
        get: function get() {
            return this.formDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "sessionContext", {
        get: function get() {
            return this._sessionContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContext.prototype, "isAnyChildDestroyed", {
        /** --------------------- MODULE ------------------------------*/
        //*** let's pretend this has module level visibility (no such thing (yet!))
        get: function get() {
            return this.childrenContexts.some(function (paneContext) {
                if (paneContext instanceof _EditorContext.EditorContext || paneContext instanceof _QueryContext.QueryContext) {
                    return paneContext.isDestroyed;
                }
                return false;
            });
        },
        enumerable: true,
        configurable: true
    });
    FormContext.prototype.processNavRequestForDestroyed = function (navRequest) {
        var fromDialogProps = {};
        if (navRequest instanceof FormContext) {
            fromDialogProps = navRequest.offlineProps;
        } else if (navRequest instanceof _NullNavRequest.NullNavRequest) {
            fromDialogProps = navRequest.fromDialogProperties;
        }
        var destroyedStr = fromDialogProps['destroyed'];
        if (destroyedStr && destroyedStr.toLowerCase() === 'true') {
            this._destroyed = true;
        }
        var fromDialogDestroyed = fromDialogProps['fromDialogDestroyed'];
        if (fromDialogDestroyed) {
            this._destroyed = true;
        }
    };
    return FormContext;
})(_PaneContext.PaneContext);
FormContext = FormContext;

},{"./ContextAction":13,"./DialogService":19,"./EditorContext":21,"./NavRequest":48,"./NullEntityRec":49,"./NullNavRequest":50,"./PaneContext":54,"./QueryContext":60}],28:[function(require,module,exports){
"use strict";

var _Future = require("../fp/Future");

var _FormContext = require("./FormContext");

var _DialogService = require("./DialogService");

var _Try = require("../fp/Try");

var _XFormDef = require("./XFormDef");

var _Failure = require("../fp/Failure");

var _FormDef = require("./FormDef");

var _Success = require("../fp/Success");

var _ObjUtil = require("../util/ObjUtil");

var _GeoLocationContext = require("./GeoLocationContext");

var _GeoLocationDef = require("./GeoLocationDef");

var _GeoFixContext = require("./GeoFixContext");

var _GeoFixDef = require("./GeoFixDef");

var _BarcodeScanContext = require("./BarcodeScanContext");

var _BarcodeScanDef = require("./BarcodeScanDef");

var _ImagePickerContext = require("./ImagePickerContext");

var _ListDef = require("./ListDef");

var _ListContext = require("./ListContext");

var _DetailsDef = require("./DetailsDef");

var _DetailsContext = require("./DetailsContext");

var _MapDef = require("./MapDef");

var _MapContext = require("./MapContext");

var _GraphDef = require("./GraphDef");

var _GraphContext = require("./GraphContext");

var _CalendarDef = require("./CalendarDef");

var _CalendarContext = require("./CalendarContext");

var _ImagePickerDef = require("./ImagePickerDef");

var FormContextBuilder = (function () {
    function FormContextBuilder(_dialogRedirection, _actionSource, _sessionContext) {
        this._dialogRedirection = _dialogRedirection;
        this._actionSource = _actionSource;
        this._sessionContext = _sessionContext;
    }
    Object.defineProperty(FormContextBuilder.prototype, "actionSource", {
        get: function get() {
            return this._actionSource;
        },
        enumerable: true,
        configurable: true
    });
    FormContextBuilder.prototype.build = function () {
        var _this = this;
        if (!this.dialogRedirection.isEditor) {
            return _Future.Future.createFailedFuture('FormContextBuilder::build', 'Forms with a root query model are not supported');
        }
        var xOpenFr = _DialogService.DialogService.openEditorModelFromRedir(this._dialogRedirection, this.sessionContext);
        var openAllFr = xOpenFr.bind(function (formXOpen) {
            var formXOpenFr = _Future.Future.createSuccessfulFuture('FormContext/open/openForm', formXOpen);
            var formXFormDefFr = _this.fetchXFormDef(formXOpen);
            var formMenuDefsFr = _DialogService.DialogService.getEditorModelMenuDefs(formXOpen.formRedirection.dialogHandle, _this.sessionContext);
            var formChildrenFr = formXFormDefFr.bind(function (xFormDef) {
                var childrenXOpenFr = _this.openChildren(formXOpen);
                var childrenXPaneDefsFr = _this.fetchChildrenXPaneDefs(formXOpen, xFormDef);
                var childrenActiveColDefsFr = _this.fetchChildrenActiveColDefs(formXOpen);
                var childrenMenuDefsFr = _this.fetchChildrenMenuDefs(formXOpen);
                return _Future.Future.sequence([childrenXOpenFr, childrenXPaneDefsFr, childrenActiveColDefsFr, childrenMenuDefsFr]);
            });
            return _Future.Future.sequence([formXOpenFr, formXFormDefFr, formMenuDefsFr, formChildrenFr]);
        });
        return openAllFr.bind(function (value) {
            var formDefTry = _this.completeOpenPromise(value);
            var formContextTry = null;
            if (formDefTry.isFailure) {
                formContextTry = new _Failure.Failure(formDefTry.failure);
            } else {
                var formDef = formDefTry.success;
                var childContexts = _this.createChildrenContexts(formDef);
                var formContext = new _FormContext.FormContext(_this.dialogRedirection, _this._actionSource, formDef, childContexts, false, false, _this.sessionContext);
                formContextTry = new _Success.Success(formContext);
            }
            return _Future.Future.createCompletedFuture('FormContextBuilder::build', formContextTry);
        });
    };
    Object.defineProperty(FormContextBuilder.prototype, "dialogRedirection", {
        get: function get() {
            return this._dialogRedirection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormContextBuilder.prototype, "sessionContext", {
        get: function get() {
            return this._sessionContext;
        },
        enumerable: true,
        configurable: true
    });
    FormContextBuilder.prototype.completeOpenPromise = function (openAllResults) {
        var flattenedTry = _Try.Try.flatten(openAllResults);
        if (flattenedTry.isFailure) {
            return new _Failure.Failure('FormContextBuilder::build: ' + _ObjUtil.ObjUtil.formatRecAttr(flattenedTry.failure));
        }
        var flattened = flattenedTry.success;
        if (flattened.length != 4) return new _Failure.Failure('FormContextBuilder::build: Open form should have resulted in 4 elements');
        var formXOpen = flattened[0];
        var formXFormDef = flattened[1];
        var formMenuDefs = flattened[2];
        var formChildren = flattened[3];
        if (formChildren.length != 4) return new _Failure.Failure('FormContextBuilder::build: Open form should have resulted in 3 elements for children panes');
        var childrenXOpens = formChildren[0];
        var childrenXPaneDefs = formChildren[1];
        var childrenXActiveColDefs = formChildren[2];
        var childrenMenuDefs = formChildren[3];
        return _FormDef.FormDef.fromOpenFormResult(formXOpen, formXFormDef, formMenuDefs, childrenXOpens, childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs);
    };
    FormContextBuilder.prototype.createChildrenContexts = function (formDef) {
        var result = [];
        formDef.childrenDefs.forEach(function (paneDef, i) {
            if (paneDef instanceof _ListDef.ListDef) {
                result.push(new _ListContext.ListContext(i));
            } else if (paneDef instanceof _DetailsDef.DetailsDef) {
                result.push(new _DetailsContext.DetailsContext(i));
            } else if (paneDef instanceof _MapDef.MapDef) {
                result.push(new _MapContext.MapContext(i));
            } else if (paneDef instanceof _GraphDef.GraphDef) {
                result.push(new _GraphContext.GraphContext(i));
            } else if (paneDef instanceof _CalendarDef.CalendarDef) {
                result.push(new _CalendarContext.CalendarContext(i));
            } else if (paneDef instanceof _ImagePickerDef.ImagePickerDef) {
                result.push(new _ImagePickerContext.ImagePickerContext(i));
            } else if (paneDef instanceof _BarcodeScanDef.BarcodeScanDef) {
                result.push(new _BarcodeScanContext.BarcodeScanContext(i));
            } else if (paneDef instanceof _GeoFixDef.GeoFixDef) {
                result.push(new _GeoFixContext.GeoFixContext(i));
            } else if (paneDef instanceof _GeoLocationDef.GeoLocationDef) {
                result.push(new _GeoLocationContext.GeoLocationContext(i));
            }
        });
        return result;
    };
    FormContextBuilder.prototype.fetchChildrenActiveColDefs = function (formXOpen) {
        var _this = this;
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = xComps.map(function (xComp) {
            if (xComp.redirection.isQuery) {
                return _DialogService.DialogService.getActiveColumnDefs(xComp.redirection.dialogHandle, _this.sessionContext);
            } else {
                return _Future.Future.createSuccessfulFuture('FormContextBuilder::fetchChildrenActiveColDefs', null);
            }
        });
        return _Future.Future.sequence(seqOfFutures);
    };
    FormContextBuilder.prototype.fetchChildrenMenuDefs = function (formXOpen) {
        var _this = this;
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = xComps.map(function (xComp) {
            if (xComp.redirection.isEditor) {
                return _DialogService.DialogService.getEditorModelMenuDefs(xComp.redirection.dialogHandle, _this.sessionContext);
            } else {
                return _DialogService.DialogService.getQueryModelMenuDefs(xComp.redirection.dialogHandle, _this.sessionContext);
            }
        });
        return _Future.Future.sequence(seqOfFutures);
    };
    FormContextBuilder.prototype.fetchChildrenXPaneDefs = function (formXOpen, xFormDef) {
        var _this = this;
        var formHandle = formXOpen.formModel.form.redirection.dialogHandle;
        var xRefs = xFormDef.paneDefRefs;
        var seqOfFutures = xRefs.map(function (xRef) {
            return _DialogService.DialogService.getEditorModelPaneDef(formHandle, xRef.paneId, _this.sessionContext);
        });
        return _Future.Future.sequence(seqOfFutures);
    };
    FormContextBuilder.prototype.fetchXFormDef = function (xformOpenResult) {
        var dialogHandle = xformOpenResult.formRedirection.dialogHandle;
        var formPaneId = xformOpenResult.formPaneId;
        return _DialogService.DialogService.getEditorModelPaneDef(dialogHandle, formPaneId, this.sessionContext).bind(function (value) {
            if (value instanceof _XFormDef.XFormDef) {
                return _Future.Future.createSuccessfulFuture('fetchXFormDef/success', value);
            } else {
                return _Future.Future.createFailedFuture('fetchXFormDef/failure', 'Expected reponse to contain an XFormDef but got ' + _ObjUtil.ObjUtil.formatRecAttr(value));
            }
        });
    };
    FormContextBuilder.prototype.openChildren = function (formXOpen) {
        var _this = this;
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = [];
        xComps.forEach(function (nextXComp) {
            var nextFr = null;
            if (nextXComp.redirection.isEditor) {
                nextFr = _DialogService.DialogService.openEditorModelFromRedir(nextXComp.redirection, _this.sessionContext);
            } else {
                nextFr = _DialogService.DialogService.openQueryModelFromRedir(nextXComp.redirection, _this.sessionContext);
            }
            seqOfFutures.push(nextFr);
        });
        return _Future.Future.sequence(seqOfFutures);
    };
    return FormContextBuilder;
})(); /**
       * Created by rburson on 3/30/15.
       */

FormContextBuilder = FormContextBuilder;

},{"../fp/Failure":100,"../fp/Future":101,"../fp/Success":103,"../fp/Try":104,"../util/ObjUtil":108,"./BarcodeScanContext":4,"./BarcodeScanDef":5,"./CalendarContext":7,"./CalendarDef":8,"./DetailsContext":15,"./DetailsDef":16,"./DialogService":19,"./FormContext":27,"./FormDef":29,"./GeoFixContext":32,"./GeoFixDef":33,"./GeoLocationContext":35,"./GeoLocationDef":36,"./GraphContext":37,"./GraphDef":39,"./ImagePickerContext":40,"./ImagePickerDef":41,"./ListContext":43,"./ListDef":44,"./MapContext":45,"./MapDef":46,"./XFormDef":79}],29:[function(require,module,exports){
"use strict";

var _PaneDef = require("./PaneDef");

var _ObjUtil = require("../util/ObjUtil");

var _Failure = require("../fp/Failure");

var _Success = require("../fp/Success");

/**
 * Created by rburson on 3/30/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var FormDef = (function (_super) {
    __extends(FormDef, _super);
    function FormDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _formLayout, _formStyle, _borderStyle, _headerDef, _childrenDefs) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._formLayout = _formLayout;
        this._formStyle = _formStyle;
        this._borderStyle = _borderStyle;
        this._headerDef = _headerDef;
        this._childrenDefs = _childrenDefs;
    }
    FormDef.fromOpenFormResult = function (formXOpenResult, formXFormDef, formMenuDefs, childrenXOpens, childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs) {
        var settings = { 'open': true };
        _ObjUtil.ObjUtil.addAllProps(formXOpenResult.formRedirection.dialogProperties, settings);
        var headerDef = null;
        var childrenDefs = [];
        for (var i = 0; i < childrenXOpens.length; i++) {
            var childXOpen = childrenXOpens[i];
            var childXPaneDef = childrenXPaneDefs[i];
            var childXActiveColDefs = childrenXActiveColDefs[i];
            var childMenuDefs = childrenMenuDefs[i];
            var childXComp = formXOpenResult.formModel.children[i];
            var childXPaneDefRef = formXFormDef.paneDefRefs[i];
            var paneDefTry = _PaneDef.PaneDef.fromOpenPaneResult(childXOpen, childXComp, childXPaneDefRef, childXPaneDef, childXActiveColDefs, childMenuDefs);
            if (paneDefTry.isFailure) {
                return new _Failure.Failure(paneDefTry.failure);
            } else {
                childrenDefs.push(paneDefTry.success);
            }
        }
        return new _Success.Success(new FormDef(formXFormDef.paneId, formXFormDef.name, formXOpenResult.formModel.form.label, formXFormDef.title, formMenuDefs, formXOpenResult.entityRecDef, formXOpenResult.formRedirection, settings, formXFormDef.formLayout, formXFormDef.formStyle, formXFormDef.borderStyle, headerDef, childrenDefs));
    };
    Object.defineProperty(FormDef.prototype, "borderStyle", {
        get: function get() {
            return this._borderStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "childrenDefs", {
        get: function get() {
            return this._childrenDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "formLayout", {
        get: function get() {
            return this._formLayout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "formStyle", {
        get: function get() {
            return this._formStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "headerDef", {
        get: function get() {
            return this._headerDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isFlowingLayout", {
        get: function get() {
            return this.formLayout && this.formLayout === 'FLOWING';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isFlowingTopDownLayout", {
        get: function get() {
            return this.formLayout && this.formLayout === 'FLOWING_TOP_DOWN';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isFourBoxSquareLayout", {
        get: function get() {
            return this.formLayout && this.formLayout === 'FOUR_BOX_SQUARE';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isHorizontalLayout", {
        get: function get() {
            return this.formLayout && this.formLayout === 'H';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isOptionsFormLayout", {
        get: function get() {
            return this.formLayout && this.formLayout === 'OPTIONS_FORM';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isTabsLayout", {
        get: function get() {
            return this.formLayout && this.formLayout === 'TABS';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isThreeBoxOneLeftLayout", {
        get: function get() {
            return this.formLayout && this.formLayout === 'THREE_ONE_LEFT';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isThreeBoxOneOverLayout", {
        get: function get() {
            return this.formLayout && this.formLayout === 'THREE_ONE_OVER';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isThreeBoxOneRightLayout", {
        get: function get() {
            return this.formLayout && this.formLayout === 'THREE_ONE_RIGHT';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isThreeBoxOneUnderLayout", {
        get: function get() {
            return this.formLayout && this.formLayout === 'THREE_ONE_UNDER';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isTopDownLayout", {
        get: function get() {
            return this.formLayout && this.formLayout === 'TOP_DOWN';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormDef.prototype, "isTwoVerticalLayout", {
        get: function get() {
            return this.formLayout && this.formLayout === 'H(2,V)';
        },
        enumerable: true,
        configurable: true
    });
    return FormDef;
})(_PaneDef.PaneDef);
FormDef = FormDef;

},{"../fp/Failure":100,"../fp/Success":103,"../util/ObjUtil":108,"./PaneDef":55}],30:[function(require,module,exports){
"use strict";

var _Future = require("../fp/Future");

var _Request = require("../ws/Request");

/*
 @TODO - current the gateway response is mocked, due to cross-domain issues
 This should be removed (and the commented section uncommented for production!!!
 */
/**
 * Created by rburson on 3/12/15.
 */
var GatewayService = (function () {
  function GatewayService() {}
  GatewayService.getServiceEndpoint = function (tenantId, serviceName, gatewayHost) {
    //We have to fake this for now, due to cross domain issues
    /*
     var fakeResponse = {
     responseType:"soi-json",
     tenantId:"***REMOVED***z",
     serverAssignment:"https://dfw.catavolt.net/vs301",
     appVersion:"1.3.262",soiVersion:"v02"
     }
      var endPointFuture = Future.createSuccessfulFuture<ServiceEndpoint>('serviceEndpoint', <any>fakeResponse);
      */
    var f = _Request.Get.fromUrl('https://' + gatewayHost + '/' + tenantId + '/' + serviceName).perform();
    var endPointFuture = f.bind(function (jsonObject) {
      //'bounce cast' the jsonObject here to coerce into ServiceEndpoint
      return _Future.Future.createSuccessfulFuture("serviceEndpoint", jsonObject);
    });
    return endPointFuture;
  };
  return GatewayService;
})();
GatewayService = GatewayService;

},{"../fp/Future":101,"../ws/Request":110}],31:[function(require,module,exports){
"use strict";

var _StringUtil = require("../util/StringUtil");

var GeoFix = (function () {
    function GeoFix(_latitude, _longitude, _source, _accuracy) {
        this._latitude = _latitude;
        this._longitude = _longitude;
        this._source = _source;
        this._accuracy = _accuracy;
    }
    GeoFix.fromFormattedValue = function (value) {
        var pair = _StringUtil.StringUtil.splitSimpleKeyValuePair(value);
        return new GeoFix(Number(pair[0]), Number(pair[1]), null, null);
    };
    Object.defineProperty(GeoFix.prototype, "latitude", {
        get: function get() {
            return this._latitude;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoFix.prototype, "longitude", {
        get: function get() {
            return this._longitude;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoFix.prototype, "source", {
        get: function get() {
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoFix.prototype, "accuracy", {
        get: function get() {
            return this._accuracy;
        },
        enumerable: true,
        configurable: true
    });
    GeoFix.prototype.toString = function () {
        return this.latitude + ":" + this.longitude;
    };
    return GeoFix;
})(); /**
       * Created by rburson on 4/5/15.
       */

GeoFix = GeoFix;

},{"../util/StringUtil":109}],32:[function(require,module,exports){
"use strict";

var _EditorContext = require("./EditorContext");

/**
 * Created by rburson on 5/4/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var GeoFixContext = (function (_super) {
    __extends(GeoFixContext, _super);
    function GeoFixContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(GeoFixContext.prototype, "geoFixDef", {
        get: function get() {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return GeoFixContext;
})(_EditorContext.EditorContext);
GeoFixContext = GeoFixContext;

},{"./EditorContext":21}],33:[function(require,module,exports){
"use strict";

var _PaneDef = require("./PaneDef");

/**
 * Created by rburson on 4/22/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var GeoFixDef = (function (_super) {
    __extends(GeoFixDef, _super);
    function GeoFixDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }
    return GeoFixDef;
})(_PaneDef.PaneDef);
GeoFixDef = GeoFixDef;

},{"./PaneDef":55}],34:[function(require,module,exports){
"use strict";

var _StringUtil = require("../util/StringUtil");

var GeoLocation = (function () {
    function GeoLocation(_latitude, _longitude) {
        this._latitude = _latitude;
        this._longitude = _longitude;
    }
    GeoLocation.fromFormattedValue = function (value) {
        var pair = _StringUtil.StringUtil.splitSimpleKeyValuePair(value);
        return new GeoLocation(Number(pair[0]), Number(pair[1]));
    };
    Object.defineProperty(GeoLocation.prototype, "latitude", {
        get: function get() {
            return this._latitude;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoLocation.prototype, "longitude", {
        get: function get() {
            return this._longitude;
        },
        enumerable: true,
        configurable: true
    });
    GeoLocation.prototype.toString = function () {
        return this.latitude + ":" + this.longitude;
    };
    return GeoLocation;
})(); /**
       * Created by rburson on 4/5/15.
       */

GeoLocation = GeoLocation;

},{"../util/StringUtil":109}],35:[function(require,module,exports){
"use strict";

var _EditorContext = require("./EditorContext");

/**
 * Created by rburson on 5/4/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var GeoLocationContext = (function (_super) {
    __extends(GeoLocationContext, _super);
    function GeoLocationContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(GeoLocationContext.prototype, "geoLocationDef", {
        get: function get() {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return GeoLocationContext;
})(_EditorContext.EditorContext);
GeoLocationContext = GeoLocationContext;

},{"./EditorContext":21}],36:[function(require,module,exports){
"use strict";

var _PaneDef = require("./PaneDef");

/**
 * Created by rburson on 4/22/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var GeoLocationDef = (function (_super) {
    __extends(GeoLocationDef, _super);
    function GeoLocationDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }
    return GeoLocationDef;
})(_PaneDef.PaneDef);
GeoLocationDef = GeoLocationDef;

},{"./PaneDef":55}],37:[function(require,module,exports){
"use strict";

var _QueryContext = require("./QueryContext");

/**
 * Created by rburson on 5/4/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var GraphContext = (function (_super) {
    __extends(GraphContext, _super);
    function GraphContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(GraphContext.prototype, "graphDef", {
        get: function get() {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return GraphContext;
})(_QueryContext.QueryContext);
GraphContext = GraphContext;

},{"./QueryContext":60}],38:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 4/1/15.
 */
var GraphDataPointDef = (function () {
    function GraphDataPointDef(_name, _type, _plotType, _legendkey) {
        this._name = _name;
        this._type = _type;
        this._plotType = _plotType;
        this._legendkey = _legendkey;
    }
    return GraphDataPointDef;
})();
GraphDataPointDef = GraphDataPointDef;

},{}],39:[function(require,module,exports){
"use strict";

var _PaneDef = require("./PaneDef");

/**
 * Created by rburson on 4/22/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var GraphDef = (function (_super) {
    __extends(GraphDef, _super);
    function GraphDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _graphType, _identityDataPointDef, _groupingDataPointDef, _dataPointDefs, _filterDataPointDefs, _sampleModel) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._graphType = _graphType;
        this._identityDataPointDef = _identityDataPointDef;
        this._groupingDataPointDef = _groupingDataPointDef;
        this._dataPointDefs = _dataPointDefs;
        this._filterDataPointDefs = _filterDataPointDefs;
        this._sampleModel = _sampleModel;
    }
    Object.defineProperty(GraphDef.prototype, "dataPointDefs", {
        get: function get() {
            return this._dataPointDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphDef.prototype, "filterDataPointDefs", {
        get: function get() {
            return this._filterDataPointDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphDef.prototype, "identityDataPointDef", {
        get: function get() {
            return this._identityDataPointDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphDef.prototype, "groupingDataPointDef", {
        get: function get() {
            return this._groupingDataPointDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphDef.prototype, "sampleModel", {
        get: function get() {
            return this._sampleModel;
        },
        enumerable: true,
        configurable: true
    });
    return GraphDef;
})(_PaneDef.PaneDef);
GraphDef = GraphDef;

},{"./PaneDef":55}],40:[function(require,module,exports){
"use strict";

var _QueryContext = require("./QueryContext");

/**
 * Created by rburson on 5/4/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var ImagePickerContext = (function (_super) {
    __extends(ImagePickerContext, _super);
    function ImagePickerContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(ImagePickerContext.prototype, "imagePickerDef", {
        get: function get() {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return ImagePickerContext;
})(_QueryContext.QueryContext);
ImagePickerContext = ImagePickerContext;

},{"./QueryContext":60}],41:[function(require,module,exports){
"use strict";

var _PaneDef = require("./PaneDef");

/**
 * Created by rburson on 4/22/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var ImagePickerDef = (function (_super) {
    __extends(ImagePickerDef, _super);
    function ImagePickerDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _URLPropName, _defaultActionId) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._URLPropName = _URLPropName;
        this._defaultActionId = _defaultActionId;
    }
    Object.defineProperty(ImagePickerDef.prototype, "defaultActionId", {
        get: function get() {
            return this._defaultActionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImagePickerDef.prototype, "URLPropName", {
        get: function get() {
            return this._URLPropName;
        },
        enumerable: true,
        configurable: true
    });
    return ImagePickerDef;
})(_PaneDef.PaneDef);
ImagePickerDef = ImagePickerDef;

},{"./PaneDef":55}],42:[function(require,module,exports){
"use strict";

var _CellValueDef = require("./CellValueDef");

/**
 * Created by rburson on 4/16/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var LabelCellValueDef = (function (_super) {
    __extends(LabelCellValueDef, _super);
    function LabelCellValueDef(_value, style) {
        _super.call(this, style);
        this._value = _value;
    }
    Object.defineProperty(LabelCellValueDef.prototype, "value", {
        get: function get() {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return LabelCellValueDef;
})(_CellValueDef.CellValueDef);
LabelCellValueDef = LabelCellValueDef;

},{"./CellValueDef":10}],43:[function(require,module,exports){
"use strict";

var _QueryContext = require("./QueryContext");

/**
 * Created by rburson on 5/4/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var ListContext = (function (_super) {
    __extends(ListContext, _super);
    function ListContext(paneRef, offlineRecs, settings) {
        if (offlineRecs === void 0) {
            offlineRecs = [];
        }
        if (settings === void 0) {
            settings = {};
        }
        _super.call(this, paneRef, offlineRecs, settings);
    }
    Object.defineProperty(ListContext.prototype, "columnHeadings", {
        get: function get() {
            return this.listDef.activeColumnDefs.map(function (cd) {
                return cd.heading;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListContext.prototype, "listDef", {
        get: function get() {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    ListContext.prototype.rowValues = function (entityRec) {
        return this.listDef.activeColumnDefs.map(function (cd) {
            return entityRec.valueAtName(cd.name);
        });
    };
    Object.defineProperty(ListContext.prototype, "style", {
        get: function get() {
            return this.listDef.style;
        },
        enumerable: true,
        configurable: true
    });
    return ListContext;
})(_QueryContext.QueryContext);
ListContext = ListContext;

},{"./QueryContext":60}],44:[function(require,module,exports){
"use strict";

var _PaneDef = require("./PaneDef");

/**
 * Created by rburson on 4/22/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var ListDef = (function (_super) {
    __extends(ListDef, _super);
    function ListDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _style, _initialColumns, _activeColumnDefs, _columnsStyle, _defaultActionId, _graphicalMarkup) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._style = _style;
        this._initialColumns = _initialColumns;
        this._activeColumnDefs = _activeColumnDefs;
        this._columnsStyle = _columnsStyle;
        this._defaultActionId = _defaultActionId;
        this._graphicalMarkup = _graphicalMarkup;
    }
    Object.defineProperty(ListDef.prototype, "activeColumnDefs", {
        get: function get() {
            return this._activeColumnDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "columnsStyle", {
        get: function get() {
            return this._columnsStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "defaultActionId", {
        get: function get() {
            return this._defaultActionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "graphicalMarkup", {
        get: function get() {
            return this._graphicalMarkup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "initialColumns", {
        get: function get() {
            return this._initialColumns;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "isDefaultStyle", {
        get: function get() {
            return this.style && this.style === 'DEFAULT';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "isDetailsFormStyle", {
        get: function get() {
            return this.style && this.style === 'DETAILS_FORM';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "isFormStyle", {
        get: function get() {
            return this.style && this.style === 'FORM';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "isTabularStyle", {
        get: function get() {
            return this.style && this.style === 'TABULAR';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListDef.prototype, "style", {
        get: function get() {
            return this._style;
        },
        enumerable: true,
        configurable: true
    });
    return ListDef;
})(_PaneDef.PaneDef);
ListDef = ListDef;

},{"./PaneDef":55}],45:[function(require,module,exports){
"use strict";

var _QueryContext = require("./QueryContext");

/**
 * Created by rburson on 5/4/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var MapContext = (function (_super) {
    __extends(MapContext, _super);
    function MapContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(MapContext.prototype, "mapDef", {
        get: function get() {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return MapContext;
})(_QueryContext.QueryContext);
MapContext = MapContext;

},{"./QueryContext":60}],46:[function(require,module,exports){
"use strict";

var _PaneDef = require("./PaneDef");

/**
 * Created by rburson on 4/22/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var MapDef = (function (_super) {
    __extends(MapDef, _super);
    function MapDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _descriptionPropName, _streetPropName, _cityPropName, _statePropName, _postalCodePropName, _latitudePropName, _longitudePropName) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._descriptionPropName = _descriptionPropName;
        this._streetPropName = _streetPropName;
        this._cityPropName = _cityPropName;
        this._statePropName = _statePropName;
        this._postalCodePropName = _postalCodePropName;
        this._latitudePropName = _latitudePropName;
        this._longitudePropName = _longitudePropName;
    }
    Object.defineProperty(MapDef.prototype, "cityPropName", {
        get: function get() {
            return this._cityPropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapDef.prototype, "descriptionPropName", {
        get: function get() {
            return this._descriptionPropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapDef.prototype, "latitudePropName", {
        get: function get() {
            return this._latitudePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapDef.prototype, "longitudePropName", {
        get: function get() {
            return this._longitudePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapDef.prototype, "postalCodePropName", {
        get: function get() {
            return this._postalCodePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapDef.prototype, "statePropName", {
        get: function get() {
            return this._statePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapDef.prototype, "streetPropName", {
        get: function get() {
            return this._streetPropName;
        },
        enumerable: true,
        configurable: true
    });
    return MapDef;
})(_PaneDef.PaneDef);
MapDef = MapDef;

},{"./PaneDef":55}],47:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/30/15.
 */
var MenuDef = (function () {
    function MenuDef(_name, _type, _actionId, _mode, _label, _iconName, _directive, _menuDefs) {
        this._name = _name;
        this._type = _type;
        this._actionId = _actionId;
        this._mode = _mode;
        this._label = _label;
        this._iconName = _iconName;
        this._directive = _directive;
        this._menuDefs = _menuDefs;
    }
    Object.defineProperty(MenuDef.prototype, "actionId", {
        get: function get() {
            return this._actionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "directive", {
        get: function get() {
            return this._directive;
        },
        enumerable: true,
        configurable: true
    });
    MenuDef.prototype.findAtId = function (actionId) {
        if (this.actionId === actionId) return this;
        var result = null;
        this.menuDefs.some(function (md) {
            result = md.findAtId(actionId);
            return result != null;
        });
        return result;
    };
    Object.defineProperty(MenuDef.prototype, "iconName", {
        get: function get() {
            return this._iconName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "isPresaveDirective", {
        get: function get() {
            return this._directive && this._directive === 'PRESAVE';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "isRead", {
        get: function get() {
            return this._mode && this._mode.indexOf('R') > -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "isSeparator", {
        get: function get() {
            return this._type && this._type === 'separator';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "isWrite", {
        get: function get() {
            return this._mode && this._mode.indexOf('W') > -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "label", {
        get: function get() {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "menuDefs", {
        get: function get() {
            return this._menuDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "mode", {
        get: function get() {
            return this._mode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "name", {
        get: function get() {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuDef.prototype, "type", {
        get: function get() {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return MenuDef;
})();
MenuDef = MenuDef;

},{}],48:[function(require,module,exports){
"use strict";

var _ObjUtil = require("../util/ObjUtil");

var _Future = require("../fp/Future");

var _WebRedirection = require("./WebRedirection");

var _WorkbenchRedirection = require("./WorkbenchRedirection");

var _AppContext = require("./AppContext");

var _DialogRedirection = require("./DialogRedirection");

var _FormContextBuilder = require("./FormContextBuilder");

var _NullRedirection = require("./NullRedirection");

var _NullNavRequest = require("./NullNavRequest");

var NavRequestUtil = (function () {
    function NavRequestUtil() {}
    NavRequestUtil.fromRedirection = function (redirection, actionSource, sessionContext) {
        var result;
        if (redirection instanceof _WebRedirection.WebRedirection) {
            result = _Future.Future.createSuccessfulFuture('NavRequest::fromRedirection', redirection);
        } else if (redirection instanceof _WorkbenchRedirection.WorkbenchRedirection) {
            var wbr = redirection;
            result = _AppContext.AppContext.singleton.getWorkbench(sessionContext, wbr.workbenchId).map(function (wb) {
                return wb;
            });
        } else if (redirection instanceof _DialogRedirection.DialogRedirection) {
            var dr = redirection;
            var fcb = new _FormContextBuilder.FormContextBuilder(dr, actionSource, sessionContext);
            result = fcb.build();
        } else if (redirection instanceof _NullRedirection.NullRedirection) {
            var nullRedir = redirection;
            var nullNavRequest = new _NullNavRequest.NullNavRequest();
            _ObjUtil.ObjUtil.addAllProps(nullRedir.fromDialogProperties, nullNavRequest.fromDialogProperties);
            result = _Future.Future.createSuccessfulFuture('NavRequest:fromRedirection/nullRedirection', nullNavRequest);
        } else {
            result = _Future.Future.createFailedFuture('NavRequest::fromRedirection', 'Unrecognized type of Redirection ' + _ObjUtil.ObjUtil.formatRecAttr(redirection));
        }
        return result;
    };
    return NavRequestUtil;
})(); /**
       * Created by rburson on 3/17/15.
       */

NavRequestUtil = NavRequestUtil;

},{"../fp/Future":101,"../util/ObjUtil":108,"./AppContext":1,"./DialogRedirection":18,"./FormContextBuilder":28,"./NullNavRequest":50,"./NullRedirection":51,"./WebRedirection":70,"./WorkbenchRedirection":73}],49:[function(require,module,exports){
"use strict";

var _DataAnno = require("./DataAnno");

var _Prop = require("./Prop");

/**
 * Created by rburson on 4/24/15.
 */

var NullEntityRec = (function () {
    function NullEntityRec() {}
    Object.defineProperty(NullEntityRec.prototype, "annos", {
        get: function get() {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.annosAtName = function (propName) {
        return [];
    };
    NullEntityRec.prototype.afterEffects = function (after) {
        return after;
    };
    Object.defineProperty(NullEntityRec.prototype, "backgroundColor", {
        get: function get() {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.backgroundColorFor = function (propName) {
        return null;
    };
    Object.defineProperty(NullEntityRec.prototype, "foregroundColor", {
        get: function get() {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.foregroundColorFor = function (propName) {
        return null;
    };
    Object.defineProperty(NullEntityRec.prototype, "imageName", {
        get: function get() {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.imageNameFor = function (propName) {
        return null;
    };
    Object.defineProperty(NullEntityRec.prototype, "imagePlacement", {
        get: function get() {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.imagePlacementFor = function (propName) {
        return null;
    };
    Object.defineProperty(NullEntityRec.prototype, "isBoldText", {
        get: function get() {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isBoldTextFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isItalicText", {
        get: function get() {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isItalicTextFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isPlacementCenter", {
        get: function get() {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isPlacementCenterFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isPlacementLeft", {
        get: function get() {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isPlacementLeftFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isPlacementRight", {
        get: function get() {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isPlacementRightFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isPlacementStretchUnder", {
        get: function get() {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isPlacementStretchUnderFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isPlacementUnder", {
        get: function get() {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isPlacementUnderFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "isUnderline", {
        get: function get() {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.isUnderlineFor = function (propName) {
        return false;
    };
    Object.defineProperty(NullEntityRec.prototype, "objectId", {
        get: function get() {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullEntityRec.prototype, "overrideText", {
        get: function get() {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.overrideTextFor = function (propName) {
        return null;
    };
    NullEntityRec.prototype.propAtIndex = function (index) {
        return null;
    };
    NullEntityRec.prototype.propAtName = function (propName) {
        return null;
    };
    Object.defineProperty(NullEntityRec.prototype, "propCount", {
        get: function get() {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullEntityRec.prototype, "propNames", {
        get: function get() {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullEntityRec.prototype, "props", {
        get: function get() {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullEntityRec.prototype, "propValues", {
        get: function get() {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullEntityRec.prototype, "tipText", {
        get: function get() {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    NullEntityRec.prototype.tipTextFor = function (propName) {
        return null;
    };
    NullEntityRec.prototype.toEntityRec = function () {
        return this;
    };
    NullEntityRec.prototype.toWSEditorRecord = function () {
        var result = { 'WS_OTYPE': 'WSEditorRecord' };
        if (this.objectId) result['objectId'] = this.objectId;
        result['names'] = _Prop.Prop.toWSListOfString(this.propNames);
        result['properties'] = _Prop.Prop.toWSListOfProperties(this.propValues);
        return result;
    };
    NullEntityRec.prototype.toWS = function () {
        var result = { 'WS_OTYPE': 'WSEntityRec' };
        if (this.objectId) result['objectId'] = this.objectId;
        result['props'] = _Prop.Prop.toListOfWSProp(this.props);
        if (this.annos) result['annos'] = _DataAnno.DataAnno.toListOfWSDataAnno(this.annos);
        return result;
    };
    NullEntityRec.prototype.valueAtName = function (propName) {
        return null;
    };
    NullEntityRec.singleton = new NullEntityRec();
    return NullEntityRec;
})();
NullEntityRec = NullEntityRec;

},{"./DataAnno":14,"./Prop":57}],50:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/30/15.
 */
var NullNavRequest = (function () {
    function NullNavRequest() {
        this.fromDialogProperties = {};
    }
    return NullNavRequest;
})();
NullNavRequest = NullNavRequest;

},{}],51:[function(require,module,exports){
"use strict";

var _Redirection = require("./Redirection");

/**
 * Created by rburson on 3/17/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var NullRedirection = (function (_super) {
    __extends(NullRedirection, _super);
    function NullRedirection(fromDialogProperties) {
        _super.call(this);
        this.fromDialogProperties = fromDialogProperties;
    }
    return NullRedirection;
})(_Redirection.Redirection);
NullRedirection = NullRedirection;

},{"./Redirection":63}],52:[function(require,module,exports){
"use strict";

var _XCalendarDef = require("./XCalendarDef");

var _AppWinDef = require("./AppWinDef");

var _AttributeCellValueDef = require("./AttributeCellValueDef");

var _XBarcodeScanDef = require("./XBarcodeScanDef");

var _CellDef = require("./CellDef");

var _XChangePaneModeResult = require("./XChangePaneModeResult");

var _ColumnDef = require("./ColumnDef");

var _ContextAction = require("./ContextAction");

var _SessionContextImpl = require("./SessionContextImpl");

var _DialogHandle = require("./DialogHandle");

var _DataAnno = require("./DataAnno");

var _XDetailsDef = require("./XDetailsDef");

var _DialogRedirection = require("./DialogRedirection");

var _EntityRecDef = require("./EntityRecDef");

var _ForcedLineCellValueDef = require("./ForcedLineCellValueDef");

var _XFormDef = require("./XFormDef");

var _XFormModelComp = require("./XFormModelComp");

var _XGeoFixDef = require("./XGeoFixDef");

var _XGeoLocationDef = require("./XGeoLocationDef");

var _XGetActiveColumnDefsResult = require("./XGetActiveColumnDefsResult");

var _XGetSessionListPropertyResult = require("./XGetSessionListPropertyResult");

var _GraphDataPointDef = require("./GraphDataPointDef");

var _XGraphDef = require("./XGraphDef");

var _XPropertyChangeResult = require("./XPropertyChangeResult");

var _XImagePickerDef = require("./XImagePickerDef");

var _LabelCellValueDef = require("./LabelCellValueDef");

var _XListDef = require("./XListDef");

var _XMapDef = require("./XMapDef");

var _MenuDef = require("./MenuDef");

var _XOpenEditorModelResult = require("./XOpenEditorModelResult");

var _XOpenQueryModelResult = require("./XOpenQueryModelResult");

var _XPaneDefRef = require("./XPaneDefRef");

var _PropDef = require("./PropDef");

var _XReadResult = require("./XReadResult");

var _SortPropDef = require("./SortPropDef");

var _SubstitutionCellValueDef = require("./SubstitutionCellValueDef");

var _TabCellValueDef = require("./TabCellValueDef");

var _WebRedirection = require("./WebRedirection");

var _Workbench = require("./Workbench");

var _WorkbenchRedirection = require("./WorkbenchRedirection");

var _WorkbenchLaunchAction = require("./WorkbenchLaunchAction");

var _XWriteResult = require("./XWriteResult");

var _CellValueDef = require("./CellValueDef");

var _XFormModel = require("./XFormModel");

var _XGetAvailableValuesResult = require("./XGetAvailableValuesResult");

var _XPaneDef = require("./XPaneDef");

var _Prop = require("./Prop");

var _XQueryResult = require("./XQueryResult");

var _Redirection = require("./Redirection");

var _Log = require("../util/Log");

var _ObjUtil = require("../util/ObjUtil");

var _Failure = require("../fp/Failure");

var _DialogTriple = require("./DialogTriple");

var _Success = require("../fp/Success");

var _EntityRec = require("./EntityRec");

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; } /**
                                                                                                                              * Created by rburson on 3/23/15.
                                                                                                                              */

var OType = (function () {
    function OType() {}
    OType.typeInstance = function (name) {
        var type = OType.types[name];
        return type && new type();
    };
    OType.factoryFn = function (otype, jsonObj) {
        var typeFn = OType.typeFns[otype];
        if (typeFn) {
            return typeFn(otype, jsonObj);
        }
        return null;
    };
    OType.deserializeObject = function (obj, Otype, factoryFn) {
        _Log.Log.debug('Deserializing ' + Otype);
        if (Array.isArray(obj)) {
            //it's a nested array (no LTYPE!)
            return OType.handleNestedArray(Otype, obj);
        } else {
            var newObj = null;
            var objTry = factoryFn(Otype, obj); //this returns null if there is no custom function
            if (objTry) {
                if (objTry.isFailure) {
                    var error = 'OType::deserializeObject: factory failed to produce object for ' + Otype + " : " + _ObjUtil.ObjUtil.formatRecAttr(objTry.failure);
                    _Log.Log.error(error);
                    return new _Failure.Failure(error);
                }
                newObj = objTry.success;
            } else {
                newObj = OType.typeInstance(Otype);
                if (!newObj) {
                    _Log.Log.error('OType::deserializeObject: no type constructor found for ' + Otype);
                    return new _Failure.Failure('OType::deserializeObject: no type constructor found for ' + Otype);
                }
                for (var prop in obj) {
                    var value = obj[prop];
                    _Log.Log.debug("prop: " + prop + " is type " + (typeof value === "undefined" ? "undefined" : _typeof(value)));
                    if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object') {
                        if ('WS_OTYPE' in value) {
                            var otypeTry = _DialogTriple.DialogTriple.fromWSDialogObject(value, value['WS_OTYPE'], OType.factoryFn);
                            if (otypeTry.isFailure) return new _Failure.Failure(otypeTry.failure);
                            OType.assignPropIfDefined(prop, otypeTry.success, newObj, Otype);
                        } else if ('WS_LTYPE' in value) {
                            var ltypeTry = _DialogTriple.DialogTriple.fromListOfWSDialogObject(value, value['WS_LTYPE'], OType.factoryFn);
                            if (ltypeTry.isFailure) return new _Failure.Failure(ltypeTry.failure);
                            OType.assignPropIfDefined(prop, ltypeTry.success, newObj, Otype);
                        } else {
                            OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                        }
                    } else {
                        OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                    }
                }
            }
            return new _Success.Success(newObj);
        }
    };
    OType.serializeObject = function (obj, Otype, filterFn) {
        var newObj = { 'WS_OTYPE': Otype };
        return _ObjUtil.ObjUtil.copyNonNullFieldsOnly(obj, newObj, function (prop) {
            return prop.charAt(0) !== '_' && (!filterFn || filterFn(prop));
        });
    };
    OType.handleNestedArray = function (Otype, obj) {
        return OType.extractLType(Otype).bind(function (ltype) {
            var newArrayTry = OType.deserializeNestedArray(obj, ltype);
            if (newArrayTry.isFailure) return new _Failure.Failure(newArrayTry.failure);
            return new _Success.Success(newArrayTry.success);
        });
    };
    OType.deserializeNestedArray = function (array, ltype) {
        var newArray = [];
        for (var i = 0; i < array.length; i++) {
            var value = array[i];
            if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object') {
                var otypeTry = _DialogTriple.DialogTriple.fromWSDialogObject(value, ltype, OType.factoryFn);
                if (otypeTry.isFailure) {
                    return new _Failure.Failure(otypeTry.failure);
                }
                newArray.push(otypeTry.success);
            } else {
                newArray.push(value);
            }
        }
        return new _Success.Success(newArray);
    };
    OType.extractLType = function (Otype) {
        if (Otype.length > 5 && Otype.slice(0, 5) !== 'List<') {
            return new _Failure.Failure('Expected OType of List<some_type> but found ' + Otype);
        }
        var ltype = Otype.slice(5, -1);
        return new _Success.Success(ltype);
    };
    OType.assignPropIfDefined = function (prop, value, target, otype) {
        if (otype === void 0) {
            otype = 'object';
        }
        try {
            if ('_' + prop in target) {
                target['_' + prop] = value;
            } else {
                //it may be public
                if (prop in target) {
                    target[prop] = value;
                } else {
                    _Log.Log.debug("Didn't find target value for prop " + prop + " on target for " + otype);
                }
            }
        } catch (error) {
            _Log.Log.error('OType::assignPropIfDefined: Failed to set prop: ' + prop + ' on target: ' + error);
        }
    };
    OType.types = {
        'WSApplicationWindowDef': _AppWinDef.AppWinDef,
        'WSAttributeCellValueDef': _AttributeCellValueDef.AttributeCellValueDef,
        'WSBarcodeScanDef': _XBarcodeScanDef.XBarcodeScanDef,
        'WSCalendarDef': _XCalendarDef.XCalendarDef,
        'WSCellDef': _CellDef.CellDef,
        'WSChangePaneModeResult': _XChangePaneModeResult.XChangePaneModeResult,
        'WSColumnDef': _ColumnDef.ColumnDef,
        'WSContextAction': _ContextAction.ContextAction,
        'WSCreateSessionResult': _SessionContextImpl.SessionContextImpl,
        'WSDialogHandle': _DialogHandle.DialogHandle,
        'WSDataAnno': _DataAnno.DataAnno,
        'WSDetailsDef': _XDetailsDef.XDetailsDef,
        'WSDialogRedirection': _DialogRedirection.DialogRedirection,
        'WSEditorRecordDef': _EntityRecDef.EntityRecDef,
        'WSEntityRecDef': _EntityRecDef.EntityRecDef,
        'WSForcedLineCellValueDef': _ForcedLineCellValueDef.ForcedLineCellValueDef,
        'WSFormDef': _XFormDef.XFormDef,
        'WSFormModelComp': _XFormModelComp.XFormModelComp,
        'WSGeoFixDef': _XGeoFixDef.XGeoFixDef,
        'WSGeoLocationDef': _XGeoLocationDef.XGeoLocationDef,
        'WSGetActiveColumnDefsResult': _XGetActiveColumnDefsResult.XGetActiveColumnDefsResult,
        'WSGetSessionListPropertyResult': _XGetSessionListPropertyResult.XGetSessionListPropertyResult,
        'WSGraphDataPointDef': _GraphDataPointDef.GraphDataPointDef,
        'WSGraphDef': _XGraphDef.XGraphDef,
        'WSHandlePropertyChangeResult': _XPropertyChangeResult.XPropertyChangeResult,
        'WSImagePickerDef': _XImagePickerDef.XImagePickerDef,
        'WSLabelCellValueDef': _LabelCellValueDef.LabelCellValueDef,
        'WSListDef': _XListDef.XListDef,
        'WSMapDef': _XMapDef.XMapDef,
        'WSMenuDef': _MenuDef.MenuDef,
        'WSOpenEditorModelResult': _XOpenEditorModelResult.XOpenEditorModelResult,
        'WSOpenQueryModelResult': _XOpenQueryModelResult.XOpenQueryModelResult,
        'WSPaneDefRef': _XPaneDefRef.XPaneDefRef,
        'WSPropertyDef': _PropDef.PropDef,
        'WSQueryRecordDef': _EntityRecDef.EntityRecDef,
        'WSReadResult': _XReadResult.XReadResult,
        'WSSortPropertyDef': _SortPropDef.SortPropDef,
        'WSSubstitutionCellValueDef': _SubstitutionCellValueDef.SubstitutionCellValueDef,
        'WSTabCellValueDef': _TabCellValueDef.TabCellValueDef,
        'WSWebRedirection': _WebRedirection.WebRedirection,
        'WSWorkbench': _Workbench.Workbench,
        'WSWorkbenchRedirection': _WorkbenchRedirection.WorkbenchRedirection,
        'WSWorkbenchLaunchAction': _WorkbenchLaunchAction.WorkbenchLaunchAction,
        'XWriteResult': _XWriteResult.XWriteResult
    };
    OType.typeFns = {
        'WSCellValueDef': _CellValueDef.CellValueDef.fromWS,
        'WSDataAnnotation': _DataAnno.DataAnno.fromWS,
        'WSEditorRecord': _EntityRec.EntityRecUtil.fromWSEditorRecord,
        'WSFormModel': _XFormModel.XFormModel.fromWS,
        'WSGetAvailableValuesResult': _XGetAvailableValuesResult.XGetAvailableValuesResult.fromWS,
        'WSPaneDef': _XPaneDef.XPaneDef.fromWS,
        'WSOpenQueryModelResult': _XOpenQueryModelResult.XOpenQueryModelResult.fromWS,
        'WSProp': _Prop.Prop.fromWS,
        'WSQueryResult': _XQueryResult.XQueryResult.fromWS,
        'WSRedirection': _Redirection.Redirection.fromWS,
        'WSWriteResult': _XWriteResult.XWriteResult.fromWS
    };
    return OType;
})();
OType = OType;

},{"../fp/Failure":100,"../fp/Success":103,"../util/Log":107,"../util/ObjUtil":108,"./AppWinDef":2,"./AttributeCellValueDef":3,"./CellDef":9,"./CellValueDef":10,"./ColumnDef":12,"./ContextAction":13,"./DataAnno":14,"./DialogHandle":17,"./DialogRedirection":18,"./DialogTriple":20,"./EntityRec":23,"./EntityRecDef":24,"./ForcedLineCellValueDef":26,"./GraphDataPointDef":38,"./LabelCellValueDef":42,"./MenuDef":47,"./Prop":57,"./PropDef":58,"./Redirection":63,"./SessionContextImpl":64,"./SortPropDef":66,"./SubstitutionCellValueDef":67,"./TabCellValueDef":69,"./WebRedirection":70,"./Workbench":71,"./WorkbenchLaunchAction":72,"./WorkbenchRedirection":73,"./XBarcodeScanDef":75,"./XCalendarDef":76,"./XChangePaneModeResult":77,"./XDetailsDef":78,"./XFormDef":79,"./XFormModel":80,"./XFormModelComp":81,"./XGeoFixDef":82,"./XGeoLocationDef":83,"./XGetActiveColumnDefsResult":84,"./XGetAvailableValuesResult":85,"./XGetSessionListPropertyResult":86,"./XGraphDef":87,"./XImagePickerDef":88,"./XListDef":89,"./XMapDef":90,"./XOpenEditorModelResult":91,"./XOpenQueryModelResult":92,"./XPaneDef":93,"./XPaneDefRef":94,"./XPropertyChangeResult":95,"./XQueryResult":96,"./XReadResult":97,"./XWriteResult":98}],53:[function(require,module,exports){
"use strict";

var _StringUtil = require("../util/StringUtil");

var ObjectRef = (function () {
    function ObjectRef(_objectId, _description) {
        this._objectId = _objectId;
        this._description = _description;
    }
    ObjectRef.fromFormattedValue = function (value) {
        var pair = _StringUtil.StringUtil.splitSimpleKeyValuePair(value);
        return new ObjectRef(pair[0], pair[1]);
    };
    Object.defineProperty(ObjectRef.prototype, "description", {
        get: function get() {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectRef.prototype, "objectId", {
        get: function get() {
            return this._objectId;
        },
        enumerable: true,
        configurable: true
    });
    ObjectRef.prototype.toString = function () {
        return this.objectId + ":" + this.description;
    };
    return ObjectRef;
})(); /**
       * Created by rburson on 4/5/15.
       */

ObjectRef = ObjectRef;

},{"../util/StringUtil":109}],54:[function(require,module,exports){
"use strict";

var _FormContext = require("./FormContext");

var _ObjUtil = require("../util/ObjUtil");

var _NullNavRequest = require("./NullNavRequest");

var _PropFormatter = require("./PropFormatter");

var _AppContext = require("./AppContext");

var PaneContext = (function () {
    function PaneContext(paneRef) {
        this._lastRefreshTime = new Date(0);
        this._parentContext = null;
        this._paneRef = null;
        this._paneRef = paneRef;
        this._binaryCache = {};
    }
    PaneContext.resolveSettingsFromNavRequest = function (initialSettings, navRequest) {
        var result = _ObjUtil.ObjUtil.addAllProps(initialSettings, {});
        if (navRequest instanceof _FormContext.FormContext) {
            _ObjUtil.ObjUtil.addAllProps(navRequest.dialogRedirection.fromDialogProperties, result);
            _ObjUtil.ObjUtil.addAllProps(navRequest.offlineProps, result);
        } else if (navRequest instanceof _NullNavRequest.NullNavRequest) {
            _ObjUtil.ObjUtil.addAllProps(navRequest.fromDialogProperties, result);
        }
        var destroyed = result['fromDialogDestroyed'];
        if (destroyed) result['destroyed'] = true;
        return result;
    };
    Object.defineProperty(PaneContext.prototype, "actionSource", {
        get: function get() {
            return this.parentContext ? this.parentContext.actionSource : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "dialogAlias", {
        get: function get() {
            return this.dialogRedirection.dialogProperties['dialogAlias'];
        },
        enumerable: true,
        configurable: true
    });
    PaneContext.prototype.findMenuDefAt = function (actionId) {
        var result = null;
        this.menuDefs.some(function (md) {
            result = md.findAtId(actionId);
            return result != null;
        });
        return result;
    };
    PaneContext.prototype.formatForRead = function (propValue, propName) {
        return _PropFormatter.PropFormatter.formatForRead(propValue, this.propDefAtName(propName));
    };
    PaneContext.prototype.formatForWrite = function (propValue, propName) {
        return _PropFormatter.PropFormatter.formatForWrite(propValue, this.propDefAtName(propName));
    };
    Object.defineProperty(PaneContext.prototype, "formDef", {
        get: function get() {
            return this.parentContext.formDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "isRefreshNeeded", {
        get: function get() {
            return this._lastRefreshTime.getTime() < _AppContext.AppContext.singleton.lastMaintenanceTime.getTime();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "lastRefreshTime", {
        get: function get() {
            return this._lastRefreshTime;
        },
        set: function set(time) {
            this._lastRefreshTime = time;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "menuDefs", {
        get: function get() {
            return this.paneDef.menuDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "offlineCapable", {
        get: function get() {
            return this._parentContext && this._parentContext.offlineCapable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "paneDef", {
        get: function get() {
            if (this.paneRef == null) {
                return this.formDef.headerDef;
            } else {
                return this.formDef.childrenDefs[this.paneRef];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "paneRef", {
        get: function get() {
            return this._paneRef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "paneTitle", {
        get: function get() {
            return this.paneDef.findTitle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "parentContext", {
        get: function get() {
            return this._parentContext;
        },
        set: function set(parentContext) {
            this._parentContext = parentContext;
        },
        enumerable: true,
        configurable: true
    });
    PaneContext.prototype.parseValue = function (formattedValue, propName) {
        return _PropFormatter.PropFormatter.parse(formattedValue, this.propDefAtName(propName));
    };
    PaneContext.prototype.propDefAtName = function (propName) {
        return this.entityRecDef.propDefAtName(propName);
    };
    Object.defineProperty(PaneContext.prototype, "sessionContext", {
        get: function get() {
            return this.parentContext.sessionContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneContext.prototype, "dialogRedirection", {
        /** --------------------- MODULE ------------------------------*/
        //*** let's pretend this has module level visibility
        get: function get() {
            return this.paneDef.dialogRedirection;
        },
        enumerable: true,
        configurable: true
    });
    PaneContext.ANNO_NAME_KEY = "com.catavolt.annoName";
    PaneContext.PROP_NAME_KEY = "com.catavolt.propName";
    return PaneContext;
})(); /**
       * Created by rburson on 3/30/15.
       */

PaneContext = PaneContext;

},{"../util/ObjUtil":108,"./AppContext":1,"./FormContext":27,"./NullNavRequest":50,"./PropFormatter":59}],55:[function(require,module,exports){
"use strict";

var _ObjUtil = require("../util/ObjUtil");

var _XListDef = require("./XListDef");

var _ListDef = require("./ListDef");

var _XDetailsDef = require("./XDetailsDef");

var _DetailsDef = require("./DetailsDef");

var _XMapDef = require("./XMapDef");

var _MapDef = require("./MapDef");

var _XGraphDef = require("./XGraphDef");

var _GraphDef = require("./GraphDef");

var _XBarcodeScanDef = require("./XBarcodeScanDef");

var _BarcodeScanDef = require("./BarcodeScanDef");

var _Success = require("../fp/Success");

var _Failure = require("../fp/Failure");

var _ImagePickerDef = require("./ImagePickerDef");

var _XImagePickerDef = require("./XImagePickerDef");

var _CalendarDef = require("./CalendarDef");

var _XCalendarDef = require("./XCalendarDef");

var _GeoLocationDef = require("./GeoLocationDef");

var _XGeoLocationDef = require("./XGeoLocationDef");

var _GeoFixDef = require("./GeoFixDef");

var _XGeoFixDef = require("./XGeoFixDef");

var PaneDef = (function () {
    function PaneDef(_paneId, _name, _label, _title, _menuDefs, _entityRecDef, _dialogRedirection, _settings) {
        this._paneId = _paneId;
        this._name = _name;
        this._label = _label;
        this._title = _title;
        this._menuDefs = _menuDefs;
        this._entityRecDef = _entityRecDef;
        this._dialogRedirection = _dialogRedirection;
        this._settings = _settings;
    }
    PaneDef.fromOpenPaneResult = function (childXOpenResult, childXComp, childXPaneDefRef, childXPaneDef, childXActiveColDefs, childMenuDefs) {
        var settings = {};
        _ObjUtil.ObjUtil.addAllProps(childXComp.redirection.dialogProperties, settings);
        var newPaneDef;
        if (childXPaneDef instanceof _XListDef.XListDef) {
            var xListDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new _ListDef.ListDef(xListDef.paneId, xListDef.name, childXComp.label, xListDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xListDef.style, xListDef.initialColumns, childXActiveColDefs.columnDefs, xListDef.columnsStyle, xOpenQueryModelResult.defaultActionId, xListDef.graphicalMarkup);
        } else if (childXPaneDef instanceof _XDetailsDef.XDetailsDef) {
            var xDetailsDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new _DetailsDef.DetailsDef(xDetailsDef.paneId, xDetailsDef.name, childXComp.label, xDetailsDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings, xDetailsDef.cancelButtonText, xDetailsDef.commitButtonText, xDetailsDef.editable, xDetailsDef.focusPropertyName, xDetailsDef.graphicalMarkup, xDetailsDef.rows);
        } else if (childXPaneDef instanceof _XMapDef.XMapDef) {
            var xMapDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new _MapDef.MapDef(xMapDef.paneId, xMapDef.name, childXComp.label, xMapDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xMapDef.descriptionProperty, xMapDef.streetProperty, xMapDef.cityProperty, xMapDef.stateProperty, xMapDef.postalCodeProperty, xMapDef.latitudeProperty, xMapDef.longitudeProperty);
        } else if (childXPaneDef instanceof _XGraphDef.XGraphDef) {
            var xGraphDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new _GraphDef.GraphDef(xGraphDef.paneId, xGraphDef.name, childXComp.label, xGraphDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xGraphDef.graphType, xGraphDef.identityDataPoint, xGraphDef.groupingDataPoint, xGraphDef.dataPoints, xGraphDef.filterDataPoints, xGraphDef.sampleModel);
        } else if (childXPaneDef instanceof _XBarcodeScanDef.XBarcodeScanDef) {
            var xBarcodeScanDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new _BarcodeScanDef.BarcodeScanDef(xBarcodeScanDef.paneId, xBarcodeScanDef.name, childXComp.label, xBarcodeScanDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        } else if (childXPaneDef instanceof _XGeoFixDef.XGeoFixDef) {
            var xGeoFixDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new _GeoFixDef.GeoFixDef(xGeoFixDef.paneId, xGeoFixDef.name, childXComp.label, xGeoFixDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        } else if (childXPaneDef instanceof _XGeoLocationDef.XGeoLocationDef) {
            var xGeoLocationDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new _GeoLocationDef.GeoLocationDef(xGeoLocationDef.paneId, xGeoLocationDef.name, childXComp.label, xGeoLocationDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        } else if (childXPaneDef instanceof _XCalendarDef.XCalendarDef) {
            var xCalendarDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new _CalendarDef.CalendarDef(xCalendarDef.paneId, xCalendarDef.name, childXComp.label, xCalendarDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xCalendarDef.descriptionProperty, xCalendarDef.initialStyle, xCalendarDef.startDateProperty, xCalendarDef.startTimeProperty, xCalendarDef.endDateProperty, xCalendarDef.endTimeProperty, xCalendarDef.occurDateProperty, xCalendarDef.occurTimeProperty, xOpenQueryModelResult.defaultActionId);
        } else if (childXPaneDef instanceof _XImagePickerDef.XImagePickerDef) {
            var xImagePickerDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new _ImagePickerDef.ImagePickerDef(xImagePickerDef.paneId, xImagePickerDef.name, childXComp.label, xImagePickerDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xImagePickerDef.URLProperty, xImagePickerDef.defaultActionId);
        } else {
            return new _Failure.Failure('PaneDef::fromOpenPaneResult needs impl for: ' + _ObjUtil.ObjUtil.formatRecAttr(childXPaneDef));
        }
        return new _Success.Success(newPaneDef);
    };
    Object.defineProperty(PaneDef.prototype, "dialogHandle", {
        get: function get() {
            return this._dialogRedirection.dialogHandle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "dialogRedirection", {
        get: function get() {
            return this._dialogRedirection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "entityRecDef", {
        get: function get() {
            return this._entityRecDef;
        },
        enumerable: true,
        configurable: true
    });
    PaneDef.prototype.findTitle = function () {
        var result = this._title ? this._title.trim() : '';
        result = result === 'null' ? '' : result;
        if (result === '') {
            result = this._label ? this._label.trim() : '';
            result = result === 'null' ? '' : result;
        }
        return result;
    };
    Object.defineProperty(PaneDef.prototype, "label", {
        get: function get() {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "menuDefs", {
        get: function get() {
            return this._menuDefs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "name", {
        get: function get() {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "paneId", {
        get: function get() {
            return this._paneId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "settings", {
        get: function get() {
            return this._settings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaneDef.prototype, "title", {
        get: function get() {
            return this._title;
        },
        enumerable: true,
        configurable: true
    });
    return PaneDef;
})(); /**
       * Created by rburson on 3/30/15.
       */

PaneDef = PaneDef;

},{"../fp/Failure":100,"../fp/Success":103,"../util/ObjUtil":108,"./BarcodeScanDef":5,"./CalendarDef":8,"./DetailsDef":16,"./GeoFixDef":33,"./GeoLocationDef":36,"./GraphDef":39,"./ImagePickerDef":41,"./ListDef":44,"./MapDef":46,"./XBarcodeScanDef":75,"./XCalendarDef":76,"./XDetailsDef":78,"./XGeoFixDef":82,"./XGeoLocationDef":83,"./XGraphDef":87,"./XImagePickerDef":88,"./XListDef":89,"./XMapDef":90}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by rburson on 4/28/15.
 */
var PaneMode = exports.PaneMode = undefined;
(function (PaneMode) {
  PaneMode[PaneMode["READ"] = 0] = "READ";
  PaneMode[PaneMode["WRITE"] = 1] = "WRITE";
})(PaneMode || (exports.PaneMode = PaneMode = {}));

},{}],57:[function(require,module,exports){
"use strict";

var _DialogTriple = require("./DialogTriple");

var _OType = require("./OType");

var _Success = require("../fp/Success");

var _Failure = require("../fp/Failure");

var _GeoLocation = require("./GeoLocation");

var _DataAnno = require("./DataAnno");

var _BinaryRef = require("./BinaryRef");

var _ObjectRef = require("./ObjectRef");

var _CodeRef = require("./CodeRef");

var _GeoFix = require("./GeoFix");

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var Prop = (function () {
    function Prop(_name, _value, _annos) {
        if (_annos === void 0) {
            _annos = [];
        }
        this._name = _name;
        this._value = _value;
        this._annos = _annos;
    }
    Prop.fromListOfWSValue = function (values) {
        var props = [];
        values.forEach(function (v) {
            var propTry = Prop.fromWSValue(v);
            if (propTry.isFailure) return new _Failure.Failure(propTry.failure);
            props.push(propTry.success);
        });
        return new _Success.Success(props);
    };
    Prop.fromWSNameAndWSValue = function (name, value) {
        var propTry = Prop.fromWSValue(value);
        if (propTry.isFailure) {
            return new _Failure.Failure(propTry.failure);
        }
        return new _Success.Success(new Prop(name, propTry.success));
    };
    Prop.fromWSNamesAndValues = function (names, values) {
        if (names.length != values.length) {
            return new _Failure.Failure("Prop::fromWSNamesAndValues: names and values must be of same length");
        }
        var list = [];
        for (var i = 0; i < names.length; i++) {
            var propTry = Prop.fromWSNameAndWSValue(names[i], values[i]);
            if (propTry.isFailure) {
                return new _Failure.Failure(propTry.failure);
            }
            list.push(propTry.success);
        }
        return new _Success.Success(list);
    };
    Prop.fromWSValue = function (value) {
        var propValue = value;
        if (value && 'object' === (typeof value === "undefined" ? "undefined" : _typeof(value))) {
            var PType = value['WS_PTYPE'];
            var strVal = value['value'];
            if (PType) {
                if (PType === 'Decimal') {
                    propValue = Number(strVal);
                } else if (PType === 'Date') {
                    propValue = new Date(strVal);
                } else if (PType === 'DateTime') {
                    propValue = new Date(strVal);
                } else if (PType === 'Time') {
                    propValue = new Date(strVal);
                } else if (PType === 'BinaryRef') {
                    var binaryRefTry = _BinaryRef.BinaryRef.fromWSValue(strVal, value['properties']);
                    if (binaryRefTry.isFailure) return new _Failure.Failure(binaryRefTry.failure);
                    propValue = binaryRefTry.success;
                } else if (PType === 'ObjectRef') {
                    propValue = _ObjectRef.ObjectRef.fromFormattedValue(strVal);
                } else if (PType === 'CodeRef') {
                    propValue = _CodeRef.CodeRef.fromFormattedValue(strVal);
                } else if (PType === 'GeoFix') {
                    propValue = _GeoFix.GeoFix.fromFormattedValue(strVal);
                } else if (PType === 'GeoLocation') {
                    propValue = _GeoLocation.GeoLocation.fromFormattedValue(strVal);
                } else {
                    return new _Failure.Failure('Prop::fromWSValue: Property WS_PTYPE is not valid: ' + PType);
                }
            }
        }
        return new _Success.Success(propValue);
    };
    Prop.fromWS = function (otype, jsonObj) {
        var name = jsonObj['name'];
        var valueTry = Prop.fromWSValue(jsonObj['value']);
        if (valueTry.isFailure) return new _Failure.Failure(valueTry.failure);
        var annos = null;
        if (jsonObj['annos']) {
            var annosListTry = _DialogTriple.DialogTriple.fromListOfWSDialogObject(jsonObj['annos'], 'WSDataAnno', _OType.OType.factoryFn);
            if (annosListTry.isFailure) return new _Failure.Failure(annosListTry.failure);
            annos = annosListTry.success;
        }
        return new _Success.Success(new Prop(name, valueTry.success, annos));
    };
    Prop.toWSProperty = function (o) {
        if (typeof o === 'number') {
            return { 'WS_PTYPE': 'Decimal', 'value': String(o) };
        } else if ((typeof o === "undefined" ? "undefined" : _typeof(o)) === 'object') {
            if (o instanceof Date) {
                return { 'WS_PTYPE': 'DateTime', 'value': o.toUTCString() };
            } else if (o instanceof _CodeRef.CodeRef) {
                return { 'WS_PTYPE': 'CodeRef', 'value': o.toString() };
            } else if (o instanceof _ObjectRef.ObjectRef) {
                return { 'WS_PTYPE': 'ObjectRef', 'value': o.toString() };
            } else if (o instanceof _GeoFix.GeoFix) {
                return { 'WS_PTYPE': 'GeoFix', 'value': o.toString() };
            } else if (o instanceof _GeoLocation.GeoLocation) {
                return { 'WS_PTYPE': 'GeoLocation', 'value': o.toString() };
            }
        } else {
            return o;
        }
    };
    Prop.toWSListOfProperties = function (list) {
        var result = { 'WS_LTYPE': 'Object' };
        var values = [];
        list.forEach(function (o) {
            values.push(Prop.toWSProperty(o));
        });
        result['values'] = values;
        return result;
    };
    Prop.toWSListOfString = function (list) {
        return { 'WS_LTYPE': 'String', 'values': list };
    };
    Prop.toListOfWSProp = function (props) {
        var result = { 'WS_LTYPE': 'WSProp' };
        var values = [];
        props.forEach(function (prop) {
            values.push(prop.toWS());
        });
        result['values'] = values;
        return result;
    };
    Object.defineProperty(Prop.prototype, "annos", {
        get: function get() {
            return this._annos;
        },
        enumerable: true,
        configurable: true
    });
    Prop.prototype.equals = function (prop) {
        return this.name === prop.name && this.value === prop.value;
    };
    Object.defineProperty(Prop.prototype, "backgroundColor", {
        get: function get() {
            return _DataAnno.DataAnno.backgroundColor(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "foregroundColor", {
        get: function get() {
            return _DataAnno.DataAnno.foregroundColor(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "imageName", {
        get: function get() {
            return _DataAnno.DataAnno.imageName(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "imagePlacement", {
        get: function get() {
            return _DataAnno.DataAnno.imagePlacement(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isBoldText", {
        get: function get() {
            return _DataAnno.DataAnno.isBoldText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isItalicText", {
        get: function get() {
            return _DataAnno.DataAnno.isItalicText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isPlacementCenter", {
        get: function get() {
            return _DataAnno.DataAnno.isPlacementCenter(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isPlacementLeft", {
        get: function get() {
            return _DataAnno.DataAnno.isPlacementLeft(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isPlacementRight", {
        get: function get() {
            return _DataAnno.DataAnno.isPlacementRight(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isPlacementStretchUnder", {
        get: function get() {
            return _DataAnno.DataAnno.isPlacementStretchUnder(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isPlacementUnder", {
        get: function get() {
            return _DataAnno.DataAnno.isPlacementUnder(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "isUnderline", {
        get: function get() {
            return _DataAnno.DataAnno.isUnderlineText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "name", {
        get: function get() {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "overrideText", {
        get: function get() {
            return _DataAnno.DataAnno.overrideText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "tipText", {
        get: function get() {
            return _DataAnno.DataAnno.tipText(this.annos);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Prop.prototype, "value", {
        get: function get() {
            return this._value;
        },
        set: function set(value) {
            this._value = value;
        },
        enumerable: true,
        configurable: true
    });
    Prop.prototype.toWS = function () {
        var result = { 'WS_OTYPE': 'WSProp', 'name': this.name, 'value': Prop.toWSProperty(this.value) };
        if (this.annos) {
            result['annos'] = _DataAnno.DataAnno.toListOfWSDataAnno(this.annos);
        }
        return result;
    };
    return Prop;
})();
Prop = Prop;

},{"../fp/Failure":100,"../fp/Success":103,"./BinaryRef":6,"./CodeRef":11,"./DataAnno":14,"./DialogTriple":20,"./GeoFix":31,"./GeoLocation":34,"./OType":52,"./ObjectRef":53}],58:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 4/1/15.
 */
var PropDef = (function () {
    function PropDef(_name, _type, _elementType, _style, _propertyLength, _propertyScale, _presLength, _presScale, _dataDictionaryKey, _maintainable, _writeEnabled, _canCauseSideEffects) {
        this._name = _name;
        this._type = _type;
        this._elementType = _elementType;
        this._style = _style;
        this._propertyLength = _propertyLength;
        this._propertyScale = _propertyScale;
        this._presLength = _presLength;
        this._presScale = _presScale;
        this._dataDictionaryKey = _dataDictionaryKey;
        this._maintainable = _maintainable;
        this._writeEnabled = _writeEnabled;
        this._canCauseSideEffects = _canCauseSideEffects;
    }
    Object.defineProperty(PropDef.prototype, "canCauseSideEffects", {
        get: function get() {
            return this._canCauseSideEffects;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "dataDictionaryKey", {
        get: function get() {
            return this._dataDictionaryKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "elementType", {
        get: function get() {
            return this._elementType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isBarcodeType", {
        get: function get() {
            return this.type && this.type === 'STRING' && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_BARCODE';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isBinaryType", {
        get: function get() {
            return this.isLargeBinaryType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isBooleanType", {
        get: function get() {
            return this.type && this.type === 'BOOLEAN';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isCodeRefType", {
        get: function get() {
            return this.type && this.type === 'CODE_REF';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isDateType", {
        get: function get() {
            return this.type && this.type === 'DATE';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isDateTimeType", {
        get: function get() {
            return this.type && this.type === 'DATE_TIME';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isDecimalType", {
        get: function get() {
            return this.type && this.type === 'DECIMAL';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isDoubleType", {
        get: function get() {
            return this.type && this.type === 'DOUBLE';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isEmailType", {
        get: function get() {
            return this.type && this.type === 'DATA_EMAIL';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isGeoFixType", {
        get: function get() {
            return this.type && this.type === 'GEO_FIX';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isGeoLocationType", {
        get: function get() {
            return this.type && this.type === 'GEO_LOCATION';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isHTMLType", {
        get: function get() {
            return this.type && this.type === 'DATA_HTML';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isListType", {
        get: function get() {
            return this.type && this.type === 'LIST';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isInlineMediaStyle", {
        get: function get() {
            return this.style && (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isIntType", {
        get: function get() {
            return this.type && this.type === 'INT';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isLargeBinaryType", {
        get: function get() {
            return this.type && this.type === 'com.dgoi.core.domain.BinaryRef' && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_LARGEBINARY';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isLongType", {
        get: function get() {
            return this.type && this.type === 'LONG';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isMoneyType", {
        get: function get() {
            return this.isNumericType && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_MONEY';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isNumericType", {
        get: function get() {
            return this.isDecimalType || this.isDoubleType || this.isIntType || this.isLongType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isObjRefType", {
        get: function get() {
            return this.type && this.type === 'OBJ_REF';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isPasswordType", {
        get: function get() {
            return this.isStringType && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_PASSWORD';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isPercentType", {
        get: function get() {
            return this.isNumericType && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_PERCENT';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isStringType", {
        get: function get() {
            return this.type && this.type === 'STRING';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isTelephoneType", {
        get: function get() {
            return this.isStringType && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_TELEPHONE';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isTextBlock", {
        get: function get() {
            return this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_TEXT_BLOCK';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isTimeType", {
        get: function get() {
            return this.type && this.type === 'TIME';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isUnformattedNumericType", {
        get: function get() {
            return this.isNumericType && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_UNFORMATTED_NUMBER';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "isURLType", {
        get: function get() {
            return this.isStringType && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_URL';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "maintainable", {
        get: function get() {
            return this._maintainable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "name", {
        get: function get() {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "presLength", {
        get: function get() {
            return this._presLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "presScale", {
        get: function get() {
            return this._presScale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "propertyLength", {
        get: function get() {
            return this._propertyLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "propertyScale", {
        get: function get() {
            return this._propertyScale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "style", {
        get: function get() {
            return this._style;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "type", {
        get: function get() {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropDef.prototype, "writeEnabled", {
        get: function get() {
            return this._writeEnabled;
        },
        enumerable: true,
        configurable: true
    });
    PropDef.STYLE_INLINE_MEDIA = "inlineMedia";
    PropDef.STYLE_INLINE_MEDIA2 = "Image/Video";
    return PropDef;
})();
PropDef = PropDef;

},{}],59:[function(require,module,exports){
"use strict";

var _ObjectRef = require("./ObjectRef");

var _CodeRef = require("./CodeRef");

var _GeoFix = require("./GeoFix");

var _GeoLocation = require("./GeoLocation");

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; } /**
                                                                                                                              * Created by rburson on 4/27/15.
                                                                                                                              */

var PropFormatter = (function () {
    function PropFormatter() {}
    PropFormatter.formatForRead = function (prop, propDef) {
        return 'R:' + prop ? PropFormatter.toString(prop) : '';
    };
    PropFormatter.formatForWrite = function (prop, propDef) {
        return prop ? PropFormatter.toString(prop) : '';
    };
    PropFormatter.parse = function (value, propDef) {
        var propValue = value;
        if (propDef.isDecimalType) {
            propValue = Number(value);
        } else if (propDef.isLongType) {
            propValue = Number(value);
        } else if (propDef.isBooleanType) {
            propValue = value !== 'false';
        } else if (propDef.isDateType) {
            propValue = new Date(value);
        } else if (propDef.isDateTimeType) {
            propValue = new Date(value);
        } else if (propDef.isTimeType) {
            propValue = new Date(value);
        } else if (propDef.isObjRefType) {
            propValue = _ObjectRef.ObjectRef.fromFormattedValue(value);
        } else if (propDef.isCodeRefType) {
            propValue = _CodeRef.CodeRef.fromFormattedValue(value);
        } else if (propDef.isGeoFixType) {
            propValue = _GeoFix.GeoFix.fromFormattedValue(value);
        } else if (propDef.isGeoLocationType) {
            propValue = _GeoLocation.GeoLocation.fromFormattedValue(value);
        }
        return propValue;
    };
    PropFormatter.toString = function (o) {
        if (typeof o === 'number') {
            return String(o);
        } else if ((typeof o === "undefined" ? "undefined" : _typeof(o)) === 'object') {
            if (o instanceof Date) {
                return o.toUTCString();
            } else if (o instanceof _CodeRef.CodeRef) {
                return o.toString();
            } else if (o instanceof _ObjectRef.ObjectRef) {
                return o.toString();
            } else if (o instanceof _GeoFix.GeoFix) {
                return o.toString();
            } else if (o instanceof _GeoLocation.GeoLocation) {
                return o.toString();
            } else {
                return String(o);
            }
        } else {
            return String(o);
        }
    };
    return PropFormatter;
})();
PropFormatter = PropFormatter;

},{"./CodeRef":11,"./GeoFix":31,"./GeoLocation":34,"./ObjectRef":53}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QueryDirection = undefined;

var _PaneContext = require("./PaneContext");

var _Future = require("../fp/Future");

var _QueryResult = require("./QueryResult");

var _QueryScroller = require("./QueryScroller");

var _DialogService = require("./DialogService");

var _ContextAction = require("./ContextAction");

var _NavRequest = require("./NavRequest");

/**
 * Created by rburson on 4/27/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var QueryState;
(function (QueryState) {
    QueryState[QueryState["ACTIVE"] = 0] = "ACTIVE";
    QueryState[QueryState["DESTROYED"] = 1] = "DESTROYED";
})(QueryState || (QueryState = {}));
var QueryDirection = exports.QueryDirection = undefined;
(function (QueryDirection) {
    QueryDirection[QueryDirection["FORWARD"] = 0] = "FORWARD";
    QueryDirection[QueryDirection["BACKWARD"] = 1] = "BACKWARD";
})(QueryDirection || (exports.QueryDirection = QueryDirection = {}));
var QueryContext = (function (_super) {
    __extends(QueryContext, _super);
    function QueryContext(paneRef, _offlineRecs, _settings) {
        if (_offlineRecs === void 0) {
            _offlineRecs = [];
        }
        if (_settings === void 0) {
            _settings = {};
        }
        _super.call(this, paneRef);
        this._offlineRecs = _offlineRecs;
        this._settings = _settings;
    }
    Object.defineProperty(QueryContext.prototype, "entityRecDef", {
        get: function get() {
            return this.paneDef.entityRecDef;
        },
        enumerable: true,
        configurable: true
    });
    QueryContext.prototype.isBinary = function (columnDef) {
        var propDef = this.propDefAtName(columnDef.name);
        return propDef && (propDef.isBinaryType || propDef.isURLType && columnDef.isInlineMediaStyle);
    };
    Object.defineProperty(QueryContext.prototype, "isDestroyed", {
        get: function get() {
            return this._queryState === QueryState.DESTROYED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "lastQueryFr", {
        get: function get() {
            return this._lastQueryFr;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "offlineRecs", {
        get: function get() {
            return this._offlineRecs;
        },
        set: function set(offlineRecs) {
            this._offlineRecs = offlineRecs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "paneMode", {
        get: function get() {
            return this._settings['paneMode'];
        },
        enumerable: true,
        configurable: true
    });
    QueryContext.prototype.performMenuAction = function (menuDef, targets) {
        var _this = this;
        return _DialogService.DialogService.performQueryAction(this.paneDef.dialogHandle, menuDef.actionId, targets, this.sessionContext).bind(function (redirection) {
            var target = targets.length > 0 ? targets[0] : null;
            var ca = new _ContextAction.ContextAction(menuDef.actionId, target, _this.actionSource);
            return _NavRequest.NavRequestUtil.fromRedirection(redirection, ca, _this.sessionContext);
        }).map(function (navRequest) {
            _this._settings = _PaneContext.PaneContext.resolveSettingsFromNavRequest(_this._settings, navRequest);
            if (_this.isDestroyedSetting) {
                _this._queryState = QueryState.DESTROYED;
            }
            return navRequest;
        });
    };
    QueryContext.prototype.query = function (maxRows, direction, fromObjectId) {
        var _this = this;
        return _DialogService.DialogService.queryQueryModel(this.paneDef.dialogHandle, direction, maxRows, fromObjectId, this.sessionContext).bind(function (value) {
            var result = new _QueryResult.QueryResult(value.entityRecs, value.hasMore);
            if (_this.lastRefreshTime === new Date(0)) {
                _this.lastRefreshTime = new Date();
            }
            return _Future.Future.createSuccessfulFuture('QueryContext::query', result);
        });
    };
    QueryContext.prototype.refresh = function () {
        return this._scroller.refresh();
    };
    Object.defineProperty(QueryContext.prototype, "scroller", {
        get: function get() {
            if (!this._scroller) {
                this._scroller = this.newScroller();
            }
            return this._scroller;
        },
        enumerable: true,
        configurable: true
    });
    QueryContext.prototype.setScroller = function (pageSize, firstObjectId, markerOptions) {
        this._scroller = new _QueryScroller.QueryScroller(this, pageSize, firstObjectId, markerOptions);
        return this._scroller;
    };
    //module level methods
    QueryContext.prototype.newScroller = function () {
        return this.setScroller(50, null, [_QueryScroller.QueryMarkerOption.None]);
    };
    QueryContext.prototype.settings = function () {
        return this._settings;
    };
    Object.defineProperty(QueryContext.prototype, "isDestroyedSetting", {
        get: function get() {
            var str = this._settings['destroyed'];
            return str && str.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "isGlobalRefreshSetting", {
        get: function get() {
            var str = this._settings['globalRefresh'];
            return str && str.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "isLocalRefreshSetting", {
        get: function get() {
            var str = this._settings['localRefresh'];
            return str && str.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "isRefreshSetting", {
        get: function get() {
            return this.isLocalRefreshSetting || this.isGlobalRefreshSetting;
        },
        enumerable: true,
        configurable: true
    });
    return QueryContext;
})(_PaneContext.PaneContext);
QueryContext = QueryContext;

},{"../fp/Future":101,"./ContextAction":13,"./DialogService":19,"./NavRequest":48,"./PaneContext":54,"./QueryResult":61,"./QueryScroller":62}],61:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 4/30/15.
 */
var QueryResult = (function () {
    function QueryResult(entityRecs, hasMore) {
        this.entityRecs = entityRecs;
        this.hasMore = hasMore;
    }
    return QueryResult;
})();
QueryResult = QueryResult;

},{}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QueryMarkerOption = undefined;

var _NullEntityRec = require("./NullEntityRec");

var _Future = require("../fp/Future");

var _ArrayUtil = require("../util/ArrayUtil");

var _QueryContext = require("./QueryContext");

/**
 * Created by rburson on 4/30/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var HasMoreQueryMarker = (function (_super) {
    __extends(HasMoreQueryMarker, _super);
    function HasMoreQueryMarker() {
        _super.apply(this, arguments);
    }
    HasMoreQueryMarker.singleton = new HasMoreQueryMarker();
    return HasMoreQueryMarker;
})(_NullEntityRec.NullEntityRec);
HasMoreQueryMarker = HasMoreQueryMarker;
var IsEmptyQueryMarker = (function (_super) {
    __extends(IsEmptyQueryMarker, _super);
    function IsEmptyQueryMarker() {
        _super.apply(this, arguments);
    }
    IsEmptyQueryMarker.singleton = new IsEmptyQueryMarker();
    return IsEmptyQueryMarker;
})(_NullEntityRec.NullEntityRec);
IsEmptyQueryMarker = IsEmptyQueryMarker;
var QueryMarkerOption = exports.QueryMarkerOption = undefined;
(function (QueryMarkerOption) {
    QueryMarkerOption[QueryMarkerOption["None"] = 0] = "None";
    QueryMarkerOption[QueryMarkerOption["IsEmpty"] = 1] = "IsEmpty";
    QueryMarkerOption[QueryMarkerOption["HasMore"] = 2] = "HasMore";
})(QueryMarkerOption || (exports.QueryMarkerOption = QueryMarkerOption = {}));
var QueryScroller = (function () {
    function QueryScroller(_context, _pageSize, _firstObjectId, _markerOptions) {
        if (_markerOptions === void 0) {
            _markerOptions = [];
        }
        this._context = _context;
        this._pageSize = _pageSize;
        this._firstObjectId = _firstObjectId;
        this._markerOptions = _markerOptions;
        this.clear();
    }
    Object.defineProperty(QueryScroller.prototype, "buffer", {
        get: function get() {
            return this._buffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "bufferWithMarkers", {
        get: function get() {
            var result = _ArrayUtil.ArrayUtil.copy(this._buffer);
            if (this.isComplete) {
                if (this._markerOptions.indexOf(QueryMarkerOption.IsEmpty) > -1) {
                    if (this.isEmpty) {
                        result.push(IsEmptyQueryMarker.singleton);
                    }
                }
            } else if (this._markerOptions.indexOf(QueryMarkerOption.HasMore) > -1) {
                if (result.length === 0) {
                    result.push(HasMoreQueryMarker.singleton);
                } else {
                    if (this._hasMoreBackward) {
                        result.unshift(HasMoreQueryMarker.singleton);
                    }
                    if (this._hasMoreForward) {
                        result.push(HasMoreQueryMarker.singleton);
                    }
                }
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "context", {
        get: function get() {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "firstObjectId", {
        get: function get() {
            return this._firstObjectId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "hasMoreBackward", {
        get: function get() {
            return this._hasMoreBackward;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "hasMoreForward", {
        get: function get() {
            return this._hasMoreForward;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "isComplete", {
        get: function get() {
            return !this._hasMoreBackward && !this._hasMoreForward;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "isCompleteAndEmpty", {
        get: function get() {
            return this.isComplete && this._buffer.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "isEmpty", {
        get: function get() {
            return this._buffer.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    QueryScroller.prototype.pageBackward = function () {
        var _this = this;
        if (!this._hasMoreBackward) {
            return _Future.Future.createSuccessfulFuture('QueryScroller::pageBackward', []);
        }
        if (!this._prevPageFr || this._prevPageFr.isComplete) {
            var fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].objectId;
            this._prevPageFr = this._context.query(this._pageSize, _QueryContext.QueryDirection.BACKWARD, fromObjectId);
        } else {
            this._prevPageFr = this._prevPageFr.bind(function (queryResult) {
                var fromObjectId = _this._buffer.length === 0 ? null : _this._buffer[0].objectId;
                return _this._context.query(_this._pageSize, _QueryContext.QueryDirection.BACKWARD, fromObjectId);
            });
        }
        var beforeSize = this._buffer.length;
        return this._prevPageFr.map(function (queryResult) {
            var afterSize = beforeSize;
            _this._hasMoreBackward = queryResult.hasMore;
            if (queryResult.entityRecs.length > 0) {
                var newBuffer = [];
                for (var i = queryResult.entityRecs.length - 1; i > -1; i--) {
                    newBuffer.push(queryResult.entityRecs[i]);
                }
                _this._buffer.forEach(function (entityRec) {
                    newBuffer.push(entityRec);
                });
                _this._buffer = newBuffer;
                afterSize = _this._buffer.length;
            }
            return queryResult.entityRecs;
        });
    };
    QueryScroller.prototype.pageForward = function () {
        var _this = this;
        if (!this._hasMoreForward) {
            return _Future.Future.createSuccessfulFuture('QueryScroller::pageForward', []);
        }
        if (!this._nextPageFr || this._nextPageFr.isComplete) {
            var fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].objectId;
            this._nextPageFr = this._context.query(this._pageSize, _QueryContext.QueryDirection.FORWARD, fromObjectId);
        } else {
            this._nextPageFr = this._nextPageFr.bind(function (queryResult) {
                var fromObjectId = _this._buffer.length === 0 ? null : _this._buffer[_this._buffer.length - 1].objectId;
                return _this._context.query(_this._pageSize, _QueryContext.QueryDirection.FORWARD, fromObjectId);
            });
        }
        var beforeSize = this._buffer.length;
        return this._nextPageFr.map(function (queryResult) {
            var afterSize = beforeSize;
            _this._hasMoreForward = queryResult.hasMore;
            if (queryResult.entityRecs.length > 0) {
                var newBuffer = [];
                _this._buffer.forEach(function (entityRec) {
                    newBuffer.push(entityRec);
                });
                queryResult.entityRecs.forEach(function (entityRec) {
                    newBuffer.push(entityRec);
                });
                _this._buffer = newBuffer;
                afterSize = _this._buffer.length;
            }
            return queryResult.entityRecs;
        });
    };
    Object.defineProperty(QueryScroller.prototype, "pageSize", {
        get: function get() {
            return this._pageSize;
        },
        enumerable: true,
        configurable: true
    });
    QueryScroller.prototype.refresh = function () {
        var _this = this;
        this.clear();
        return this.pageForward().map(function (entityRecList) {
            _this.context.lastRefreshTime = new Date();
            return entityRecList;
        });
    };
    QueryScroller.prototype.trimFirst = function (n) {
        var newBuffer = [];
        for (var i = n; i < this._buffer.length; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreBackward = true;
        if (this._buffer.length === 0) this._hasMoreForward = true;
    };
    QueryScroller.prototype.trimLast = function (n) {
        var newBuffer = [];
        for (var i = 0; i < this._buffer.length - n; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreForward = true;
        if (this._buffer.length === 0) this._hasMoreBackward = true;
    };
    QueryScroller.prototype.clear = function () {
        this._hasMoreBackward = !!this._firstObjectId;
        this._hasMoreForward = true;
        this._buffer = [];
    };
    return QueryScroller;
})();
QueryScroller = QueryScroller;

},{"../fp/Future":101,"../util/ArrayUtil":105,"./NullEntityRec":49,"./QueryContext":60}],63:[function(require,module,exports){
'use strict';

var _OType = require('./OType');

var Redirection = (function () {
    function Redirection() {}
    Redirection.fromWS = function (otype, jsonObj) {
        if (jsonObj && jsonObj['webURL']) {
            return _OType.OType.deserializeObject(jsonObj, 'WSWebRedirection', _OType.OType.factoryFn);
        } else if (jsonObj && jsonObj['workbenchId']) {
            return _OType.OType.deserializeObject(jsonObj, 'WSWorkbenchRedirection', _OType.OType.factoryFn);
        } else {
            return _OType.OType.deserializeObject(jsonObj, 'WSDialogRedirection', _OType.OType.factoryFn);
        }
    };
    return Redirection;
})(); /**
       * Created by rburson on 3/10/15.
       */

Redirection = Redirection;

},{"./OType":52}],64:[function(require,module,exports){
"use strict";

var _DialogTriple = require("./DialogTriple");

var _OType = require("./OType");

/**
 * Created by rburson on 3/9/15.
 */

var SessionContextImpl = (function () {
    function SessionContextImpl(sessionHandle, userName, currentDivision, serverVersion, systemContext) {
        this.sessionHandle = sessionHandle;
        this.userName = userName;
        this.currentDivision = currentDivision;
        this.serverVersion = serverVersion;
        this.systemContext = systemContext;
        this._remoteSession = true;
    }
    SessionContextImpl.fromWSCreateSessionResult = function (jsonObject, systemContext) {
        var sessionContextTry = _DialogTriple.DialogTriple.fromWSDialogObject(jsonObject, 'WSCreateSessionResult', _OType.OType.factoryFn);
        return sessionContextTry.map(function (sessionContext) {
            sessionContext.systemContext = systemContext;
            return sessionContext;
        });
    };
    SessionContextImpl.createSessionContext = function (gatewayHost, tenantId, clientType, userId, password) {
        var sessionContext = new SessionContextImpl(null, userId, "", null, null);
        sessionContext._gatewayHost = gatewayHost;
        sessionContext._tenantId = tenantId;
        sessionContext._clientType = clientType;
        sessionContext._userId = userId;
        sessionContext._password = password;
        sessionContext._remoteSession = false;
        return sessionContext;
    };
    Object.defineProperty(SessionContextImpl.prototype, "clientType", {
        get: function get() {
            return this._clientType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "gatewayHost", {
        get: function get() {
            return this._gatewayHost;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "isLocalSession", {
        get: function get() {
            return !this._remoteSession;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "isRemoteSession", {
        get: function get() {
            return this._remoteSession;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "password", {
        get: function get() {
            return this._password;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "tenantId", {
        get: function get() {
            return this._tenantId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "userId", {
        get: function get() {
            return this._userId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "online", {
        set: function set(online) {
            this._remoteSession = online;
        },
        enumerable: true,
        configurable: true
    });
    return SessionContextImpl;
})();
SessionContextImpl = SessionContextImpl;

},{"./DialogTriple":20,"./OType":52}],65:[function(require,module,exports){
"use strict";

var _Future = require("../fp/Future");

var _Request = require("../ws/Request");

var _SessionContextImpl = require("./SessionContextImpl");

var _OType = require("./OType");

var _DialogTriple = require("./DialogTriple");

var SessionService = (function () {
    function SessionService() {}
    SessionService.createSession = function (tenantId, userId, password, clientType, systemContext) {
        var method = "createSessionDirectly";
        var params = {
            'tenantId': tenantId,
            'userId': userId,
            'password': password,
            'clientType': clientType
        };
        var call = _Request.Call.createCallWithoutSession(SessionService.SERVICE_PATH, method, params, systemContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture("createSession/extractSessionContextFromResponse", _SessionContextImpl.SessionContextImpl.fromWSCreateSessionResult(result, systemContext));
        });
    };
    SessionService.deleteSession = function (sessionContext) {
        var method = "deleteSession";
        var params = {
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = _Request.Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createSuccessfulFuture("deleteSession/extractVoidResultFromResponse", result);
        });
    };
    SessionService.getSessionListProperty = function (propertyName, sessionContext) {
        var method = "getSessionListProperty";
        var params = {
            'propertyName': propertyName,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = _Request.Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture("getSessionListProperty/extractResultFromResponse", _DialogTriple.DialogTriple.fromWSDialogObject(result, 'WSGetSessionListPropertyResult', _OType.OType.factoryFn));
        });
    };
    SessionService.setSessionListProperty = function (propertyName, listProperty, sessionContext) {
        var method = "setSessionListProperty";
        var params = {
            'propertyName': propertyName,
            'listProperty': listProperty,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = _Request.Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createSuccessfulFuture("setSessionListProperty/extractVoidResultFromResponse", result);
        });
    };
    SessionService.SERVICE_NAME = "SessionService";
    SessionService.SERVICE_PATH = "soi-json-v02/" + SessionService.SERVICE_NAME;
    return SessionService;
})(); /**
       * Created by rburson on 3/9/15.
       */

SessionService = SessionService;

},{"../fp/Future":101,"../ws/Request":110,"./DialogTriple":20,"./OType":52,"./SessionContextImpl":64}],66:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 4/1/15.
 */
var SortPropDef = (function () {
    function SortPropDef(_name, _direction) {
        this._name = _name;
        this._direction = _direction;
    }
    Object.defineProperty(SortPropDef.prototype, "direction", {
        get: function get() {
            return this._direction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortPropDef.prototype, "name", {
        get: function get() {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return SortPropDef;
})();
SortPropDef = SortPropDef;

},{}],67:[function(require,module,exports){
"use strict";

var _CellValueDef = require("./CellValueDef");

/**
 * Created by rburson on 4/16/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var SubstitutionCellValueDef = (function (_super) {
    __extends(SubstitutionCellValueDef, _super);
    function SubstitutionCellValueDef(_value, style) {
        _super.call(this, style);
        this._value = _value;
    }
    Object.defineProperty(SubstitutionCellValueDef.prototype, "value", {
        get: function get() {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return SubstitutionCellValueDef;
})(_CellValueDef.CellValueDef);
SubstitutionCellValueDef = SubstitutionCellValueDef;

},{"./CellValueDef":10}],68:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/9/15.
 */
var SystemContextImpl = (function () {
    function SystemContextImpl(_urlString) {
        this._urlString = _urlString;
    }
    Object.defineProperty(SystemContextImpl.prototype, "urlString", {
        get: function get() {
            return this._urlString;
        },
        enumerable: true,
        configurable: true
    });
    return SystemContextImpl;
})();
SystemContextImpl = SystemContextImpl;

},{}],69:[function(require,module,exports){
"use strict";

var _CellValueDef = require("./CellValueDef");

/**
 * Created by rburson on 4/16/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var TabCellValueDef = (function (_super) {
    __extends(TabCellValueDef, _super);
    function TabCellValueDef() {
        _super.call(this, null);
    }
    return TabCellValueDef;
})(_CellValueDef.CellValueDef);
TabCellValueDef = TabCellValueDef;

},{"./CellValueDef":10}],70:[function(require,module,exports){
"use strict";

var _Redirection = require("./Redirection");

/**
 * Created by rburson on 3/27/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var WebRedirection = (function (_super) {
    __extends(WebRedirection, _super);
    function WebRedirection(_webURL, _open, _dialogProperties, _fromDialogProperties) {
        _super.call(this);
        this._webURL = _webURL;
        this._open = _open;
        this._dialogProperties = _dialogProperties;
        this._fromDialogProperties = _fromDialogProperties;
    }
    Object.defineProperty(WebRedirection.prototype, "fromDialogProperties", {
        get: function get() {
            return this._fromDialogProperties;
        },
        set: function set(props) {
            this._fromDialogProperties = props;
        },
        enumerable: true,
        configurable: true
    });
    return WebRedirection;
})(_Redirection.Redirection);
WebRedirection = WebRedirection;

},{"./Redirection":63}],71:[function(require,module,exports){
"use strict";

var _ArrayUtil = require("../util/ArrayUtil");

var Workbench = (function () {
    function Workbench(_id, _name, _alias, _actions) {
        this._id = _id;
        this._name = _name;
        this._alias = _alias;
        this._actions = _actions;
    }
    Object.defineProperty(Workbench.prototype, "alias", {
        get: function get() {
            return this._alias;
        },
        enumerable: true,
        configurable: true
    });
    Workbench.prototype.getLaunchActionById = function (launchActionId) {
        var result = null;
        this.workbenchLaunchActions.some(function (launchAction) {
            if (launchAction.id = launchActionId) {
                result = launchAction;
                return true;
            }
        });
        return result;
    };
    Object.defineProperty(Workbench.prototype, "name", {
        get: function get() {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workbench.prototype, "workbenchId", {
        get: function get() {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workbench.prototype, "workbenchLaunchActions", {
        get: function get() {
            return _ArrayUtil.ArrayUtil.copy(this._actions);
        },
        enumerable: true,
        configurable: true
    });
    return Workbench;
})(); /**
       * Created by rburson on 3/17/15.
       */

Workbench = Workbench;

},{"../util/ArrayUtil":105}],72:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/17/15.
 */
var WorkbenchLaunchAction = (function () {
    function WorkbenchLaunchAction(id, workbenchId, name, alias, iconBase) {
        this.id = id;
        this.workbenchId = workbenchId;
        this.name = name;
        this.alias = alias;
        this.iconBase = iconBase;
    }
    Object.defineProperty(WorkbenchLaunchAction.prototype, "actionId", {
        get: function get() {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkbenchLaunchAction.prototype, "fromActionSource", {
        get: function get() {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkbenchLaunchAction.prototype, "virtualPathSuffix", {
        get: function get() {
            return [this.workbenchId, this.id];
        },
        enumerable: true,
        configurable: true
    });
    return WorkbenchLaunchAction;
})();
WorkbenchLaunchAction = WorkbenchLaunchAction;

},{}],73:[function(require,module,exports){
"use strict";

var _Redirection = require("./Redirection");

/**
 * Created by rburson on 3/27/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var WorkbenchRedirection = (function (_super) {
    __extends(WorkbenchRedirection, _super);
    function WorkbenchRedirection(_workbenchId, _dialogProperties, _fromDialogProperties) {
        _super.call(this);
        this._workbenchId = _workbenchId;
        this._dialogProperties = _dialogProperties;
        this._fromDialogProperties = _fromDialogProperties;
    }
    Object.defineProperty(WorkbenchRedirection.prototype, "workbenchId", {
        get: function get() {
            return this._workbenchId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkbenchRedirection.prototype, "dialogProperties", {
        get: function get() {
            return this._dialogProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkbenchRedirection.prototype, "fromDialogProperties", {
        get: function get() {
            return this._fromDialogProperties;
        },
        set: function set(props) {
            this._fromDialogProperties = props;
        },
        enumerable: true,
        configurable: true
    });
    return WorkbenchRedirection;
})(_Redirection.Redirection);
WorkbenchRedirection = WorkbenchRedirection;

},{"./Redirection":63}],74:[function(require,module,exports){
"use strict";

var _Future = require("../fp/Future");

var _Request = require("../ws/Request");

var _DialogTriple = require("./DialogTriple");

var _OType = require("./OType");

/**
 * Created by rburson on 3/17/15.
 */

var WorkbenchService = (function () {
    function WorkbenchService() {}
    WorkbenchService.getAppWinDef = function (sessionContext) {
        var method = "getApplicationWindowDef";
        var params = { 'sessionHandle': sessionContext.sessionHandle };
        var call = _Request.Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture("createSession/extractAppWinDefFromResult", _DialogTriple.DialogTriple.fromWSDialogObjectResult(result, 'WSApplicationWindowDefResult', 'WSApplicationWindowDef', 'applicationWindowDef', _OType.OType.factoryFn));
        });
    };
    WorkbenchService.getWorkbench = function (sessionContext, workbenchId) {
        var method = "getWorkbench";
        var params = {
            'sessionHandle': sessionContext.sessionHandle,
            'workbenchId': workbenchId
        };
        var call = _Request.Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture("getWorkbench/extractObject", _DialogTriple.DialogTriple.fromWSDialogObjectResult(result, 'WSWorkbenchResult', 'WSWorkbench', 'workbench', _OType.OType.factoryFn));
        });
    };
    WorkbenchService.performLaunchAction = function (actionId, workbenchId, sessionContext) {
        var method = "performLaunchAction";
        var params = {
            'actionId': actionId,
            'workbenchId': workbenchId,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = _Request.Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return _Future.Future.createCompletedFuture("performLaunchAction/extractRedirection", _DialogTriple.DialogTriple.fromWSDialogObject(result['redirection'], 'WSRedirection', _OType.OType.factoryFn));
        });
    };
    WorkbenchService.SERVICE_NAME = "WorkbenchService";
    WorkbenchService.SERVICE_PATH = "soi-json-v02/" + WorkbenchService.SERVICE_NAME;
    return WorkbenchService;
})();
WorkbenchService = WorkbenchService;

},{"../fp/Future":101,"../ws/Request":110,"./DialogTriple":20,"./OType":52}],75:[function(require,module,exports){
"use strict";

var _XPaneDef = require("./XPaneDef");

/**
 * Created by rburson on 3/31/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var XBarcodeScanDef = (function (_super) {
    __extends(XBarcodeScanDef, _super);
    function XBarcodeScanDef(paneId, name, title) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
    }
    return XBarcodeScanDef;
})(_XPaneDef.XPaneDef);
XBarcodeScanDef = XBarcodeScanDef;

},{"./XPaneDef":93}],76:[function(require,module,exports){
"use strict";

var _XPaneDef = require("./XPaneDef");

/**
 * Created by rburson on 3/31/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var XCalendarDef = (function (_super) {
    __extends(XCalendarDef, _super);
    function XCalendarDef(paneId, name, title, descriptionProperty, initialStyle, startDateProperty, startTimeProperty, endDateProperty, endTimeProperty, occurDateProperty, occurTimeProperty) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.descriptionProperty = descriptionProperty;
        this.initialStyle = initialStyle;
        this.startDateProperty = startDateProperty;
        this.startTimeProperty = startTimeProperty;
        this.endDateProperty = endDateProperty;
        this.endTimeProperty = endTimeProperty;
        this.occurDateProperty = occurDateProperty;
        this.occurTimeProperty = occurTimeProperty;
    }
    return XCalendarDef;
})(_XPaneDef.XPaneDef);
XCalendarDef = XCalendarDef;

},{"./XPaneDef":93}],77:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/31/15.
 */
var XChangePaneModeResult = (function () {
    function XChangePaneModeResult(editorRecordDef, dialogProperties) {
        this.editorRecordDef = editorRecordDef;
        this.dialogProperties = dialogProperties;
    }
    Object.defineProperty(XChangePaneModeResult.prototype, "entityRecDef", {
        get: function get() {
            return this.editorRecordDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XChangePaneModeResult.prototype, "dialogProps", {
        get: function get() {
            return this.dialogProperties;
        },
        enumerable: true,
        configurable: true
    });
    return XChangePaneModeResult;
})();
XChangePaneModeResult = XChangePaneModeResult;

},{}],78:[function(require,module,exports){
"use strict";

var _XPaneDef = require("./XPaneDef");

/**
 * Created by rburson on 3/30/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/*
 @TODO

 Note! Use this as a test example!
 It has an Array of Array with subitems that also have Array of Array!!
 */
var XDetailsDef = (function (_super) {
    __extends(XDetailsDef, _super);
    function XDetailsDef(paneId, name, title, cancelButtonText, commitButtonText, editable, focusPropertyName, overrideGML, rows) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.cancelButtonText = cancelButtonText;
        this.commitButtonText = commitButtonText;
        this.editable = editable;
        this.focusPropertyName = focusPropertyName;
        this.overrideGML = overrideGML;
        this.rows = rows;
    }
    Object.defineProperty(XDetailsDef.prototype, "graphicalMarkup", {
        get: function get() {
            return this.overrideGML;
        },
        enumerable: true,
        configurable: true
    });
    return XDetailsDef;
})(_XPaneDef.XPaneDef);
XDetailsDef = XDetailsDef;

},{"./XPaneDef":93}],79:[function(require,module,exports){
"use strict";

var _XPaneDef = require("./XPaneDef");

/**
 * Created by rburson on 3/30/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var XFormDef = (function (_super) {
    __extends(XFormDef, _super);
    function XFormDef(borderStyle, formLayout, formStyle, name, paneId, title, headerDefRef, paneDefRefs) {
        _super.call(this);
        this.borderStyle = borderStyle;
        this.formLayout = formLayout;
        this.formStyle = formStyle;
        this.name = name;
        this.paneId = paneId;
        this.title = title;
        this.headerDefRef = headerDefRef;
        this.paneDefRefs = paneDefRefs;
    }
    return XFormDef;
})(_XPaneDef.XPaneDef);
XFormDef = XFormDef;

},{"./XPaneDef":93}],80:[function(require,module,exports){
"use strict";

var _DialogTriple = require("./DialogTriple");

var _OType = require("./OType");

var _Failure = require("../fp/Failure");

var _Success = require("../fp/Success");

/**
 * Created by rburson on 3/31/15.
 */

var XFormModel = (function () {
    function XFormModel(form, header, children, placement, refreshTimer, sizeToWindow) {
        this.form = form;
        this.header = header;
        this.children = children;
        this.placement = placement;
        this.refreshTimer = refreshTimer;
        this.sizeToWindow = sizeToWindow;
    }
    /*
     This custom fromWS method is necessary because the XFormModelComps, must be
     built with the 'ignoreRedirection' flag set to true
     */
    XFormModel.fromWS = function (otype, jsonObj) {
        return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['form'], 'WSFormModelComp', _OType.OType.factoryFn, true).bind(function (form) {
            var header = null;
            if (jsonObj['header']) {
                var headerTry = _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['header'], 'WSFormModelComp', _OType.OType.factoryFn, true);
                if (headerTry.isFailure) return new _Failure.Failure(headerTry.isFailure);
                header = headerTry.success;
            }
            return _DialogTriple.DialogTriple.fromListOfWSDialogObject(jsonObj['children'], 'WSFormModelComp', _OType.OType.factoryFn, true).bind(function (children) {
                return new _Success.Success(new XFormModel(form, header, children, jsonObj['placement'], jsonObj['refreshTimer'], jsonObj['sizeToWindow']));
            });
        });
    };
    return XFormModel;
})();
XFormModel = XFormModel;

},{"../fp/Failure":100,"../fp/Success":103,"./DialogTriple":20,"./OType":52}],81:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/31/15.
 */
var XFormModelComp = (function () {
    function XFormModelComp(paneId, redirection, label, title) {
        this.paneId = paneId;
        this.redirection = redirection;
        this.label = label;
        this.title = title;
    }
    return XFormModelComp;
})();
XFormModelComp = XFormModelComp;

},{}],82:[function(require,module,exports){
"use strict";

var _XPaneDef = require("./XPaneDef");

/**
 * Created by rburson on 4/1/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var XGeoFixDef = (function (_super) {
    __extends(XGeoFixDef, _super);
    function XGeoFixDef(paneId, name, title) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
    }
    return XGeoFixDef;
})(_XPaneDef.XPaneDef);
XGeoFixDef = XGeoFixDef;

},{"./XPaneDef":93}],83:[function(require,module,exports){
"use strict";

var _XPaneDef = require("./XPaneDef");

/**
 * Created by rburson on 4/1/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var XGeoLocationDef = (function (_super) {
    __extends(XGeoLocationDef, _super);
    function XGeoLocationDef(paneId, name, title) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
    }
    return XGeoLocationDef;
})(_XPaneDef.XPaneDef);
XGeoLocationDef = XGeoLocationDef;

},{"./XPaneDef":93}],84:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 4/1/15.
 */
var XGetActiveColumnDefsResult = (function () {
    function XGetActiveColumnDefsResult(columnsStyle, columns) {
        this.columnsStyle = columnsStyle;
        this.columns = columns;
    }
    Object.defineProperty(XGetActiveColumnDefsResult.prototype, "columnDefs", {
        get: function get() {
            return this.columns;
        },
        enumerable: true,
        configurable: true
    });
    return XGetActiveColumnDefsResult;
})();
XGetActiveColumnDefsResult = XGetActiveColumnDefsResult;

},{}],85:[function(require,module,exports){
"use strict";

var _Success = require("../fp/Success");

var _Prop = require("./Prop");

/**
 * Created by rburson on 4/1/15.
 */

var XGetAvailableValuesResult = (function () {
    function XGetAvailableValuesResult(list) {
        this.list = list;
    }
    XGetAvailableValuesResult.fromWS = function (otype, jsonObj) {
        var listJson = jsonObj['list'];
        var valuesJson = listJson['values'];
        return _Prop.Prop.fromListOfWSValue(valuesJson).bind(function (values) {
            return new _Success.Success(new XGetAvailableValuesResult(values));
        });
    };
    return XGetAvailableValuesResult;
})();
XGetAvailableValuesResult = XGetAvailableValuesResult;

},{"../fp/Success":103,"./Prop":57}],86:[function(require,module,exports){
"use strict";

var _StringUtil = require("../util/StringUtil");

var XGetSessionListPropertyResult = (function () {
    function XGetSessionListPropertyResult(_list, _dialogProps) {
        this._list = _list;
        this._dialogProps = _dialogProps;
    }
    Object.defineProperty(XGetSessionListPropertyResult.prototype, "dialogProps", {
        get: function get() {
            return this._dialogProps;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XGetSessionListPropertyResult.prototype, "values", {
        get: function get() {
            return this._list;
        },
        enumerable: true,
        configurable: true
    });
    XGetSessionListPropertyResult.prototype.valuesAsDictionary = function () {
        var result = {};
        this.values.forEach(function (v) {
            var pair = _StringUtil.StringUtil.splitSimpleKeyValuePair(v);
            result[pair[0]] = pair[1];
        });
        return result;
    };
    return XGetSessionListPropertyResult;
})(); /**
       * Created by rburson on 3/17/15.
       */

XGetSessionListPropertyResult = XGetSessionListPropertyResult;

},{"../util/StringUtil":109}],87:[function(require,module,exports){
"use strict";

var _XPaneDef = require("./XPaneDef");

/**
 * Created by rburson on 4/1/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var XGraphDef = (function (_super) {
    __extends(XGraphDef, _super);
    function XGraphDef(paneId, name, title, graphType, identityDataPoint, groupingDataPoint, dataPoints, filterDataPoints, sampleModel) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.graphType = graphType;
        this.identityDataPoint = identityDataPoint;
        this.groupingDataPoint = groupingDataPoint;
        this.dataPoints = dataPoints;
        this.filterDataPoints = filterDataPoints;
        this.sampleModel = sampleModel;
    }
    return XGraphDef;
})(_XPaneDef.XPaneDef);
XGraphDef = XGraphDef;

},{"./XPaneDef":93}],88:[function(require,module,exports){
"use strict";

var _XPaneDef = require("./XPaneDef");

/**
 * Created by rburson on 4/1/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var XImagePickerDef = (function (_super) {
    __extends(XImagePickerDef, _super);
    function XImagePickerDef(paneId, name, title, URLProperty, defaultActionId) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.URLProperty = URLProperty;
        this.defaultActionId = defaultActionId;
    }
    return XImagePickerDef;
})(_XPaneDef.XPaneDef);
XImagePickerDef = XImagePickerDef;

},{"./XPaneDef":93}],89:[function(require,module,exports){
"use strict";

var _XPaneDef = require("./XPaneDef");

/**
 * Created by rburson on 4/1/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var XListDef = (function (_super) {
    __extends(XListDef, _super);
    function XListDef(paneId, name, title, style, initialColumns, columnsStyle, overrideGML) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.style = style;
        this.initialColumns = initialColumns;
        this.columnsStyle = columnsStyle;
        this.overrideGML = overrideGML;
    }
    Object.defineProperty(XListDef.prototype, "graphicalMarkup", {
        get: function get() {
            return this.overrideGML;
        },
        set: function set(graphicalMarkup) {
            this.overrideGML = graphicalMarkup;
        },
        enumerable: true,
        configurable: true
    });
    return XListDef;
})(_XPaneDef.XPaneDef);
XListDef = XListDef;

},{"./XPaneDef":93}],90:[function(require,module,exports){
"use strict";

var _XPaneDef = require("./XPaneDef");

/**
 * Created by rburson on 4/1/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var XMapDef = (function (_super) {
    __extends(XMapDef, _super);
    function XMapDef(paneId, name, title, descriptionProperty, streetProperty, cityProperty, stateProperty, postalCodeProperty, latitudeProperty, longitudeProperty) {
        _super.call(this);
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.descriptionProperty = descriptionProperty;
        this.streetProperty = streetProperty;
        this.cityProperty = cityProperty;
        this.stateProperty = stateProperty;
        this.postalCodeProperty = postalCodeProperty;
        this.latitudeProperty = latitudeProperty;
        this.longitudeProperty = longitudeProperty;
    }
    Object.defineProperty(XMapDef.prototype, "descrptionProperty", {
        //descriptionProperty is misspelled in json returned by server currently...
        set: function set(prop) {
            this.descriptionProperty = prop;
        },
        enumerable: true,
        configurable: true
    });
    return XMapDef;
})(_XPaneDef.XPaneDef);
XMapDef = XMapDef;

},{"./XPaneDef":93}],91:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 4/1/15.
 */
var XOpenEditorModelResult = (function () {
    function XOpenEditorModelResult(editorRecordDef, formModel) {
        this.editorRecordDef = editorRecordDef;
        this.formModel = formModel;
    }
    Object.defineProperty(XOpenEditorModelResult.prototype, "entityRecDef", {
        get: function get() {
            return this.editorRecordDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XOpenEditorModelResult.prototype, "formPaneId", {
        get: function get() {
            return this.formModel.form.paneId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XOpenEditorModelResult.prototype, "formRedirection", {
        get: function get() {
            return this.formModel.form.redirection;
        },
        enumerable: true,
        configurable: true
    });
    return XOpenEditorModelResult;
})();
XOpenEditorModelResult = XOpenEditorModelResult;

},{}],92:[function(require,module,exports){
"use strict";

var _DialogTriple = require("./DialogTriple");

var _OType = require("./OType");

var _EntityRecDef = require("./EntityRecDef");

var _Success = require("../fp/Success");

/**
 * Created by rburson on 4/1/15.
 */

var XOpenQueryModelResult = (function () {
    function XOpenQueryModelResult(entityRecDef, sortPropertyDef, defaultActionId) {
        this.entityRecDef = entityRecDef;
        this.sortPropertyDef = sortPropertyDef;
        this.defaultActionId = defaultActionId;
    }
    XOpenQueryModelResult.fromWS = function (otype, jsonObj) {
        var queryRecDefJson = jsonObj['queryRecordDef'];
        var defaultActionId = queryRecDefJson['defaultActionId'];
        return _DialogTriple.DialogTriple.fromListOfWSDialogObject(queryRecDefJson['propertyDefs'], 'WSPropertyDef', _OType.OType.factoryFn).bind(function (propDefs) {
            var entityRecDef = new _EntityRecDef.EntityRecDef(propDefs);
            return _DialogTriple.DialogTriple.fromListOfWSDialogObject(queryRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', _OType.OType.factoryFn).bind(function (sortPropDefs) {
                return new _Success.Success(new XOpenQueryModelResult(entityRecDef, sortPropDefs, defaultActionId));
            });
        });
    };
    return XOpenQueryModelResult;
})();
XOpenQueryModelResult = XOpenQueryModelResult;

},{"../fp/Success":103,"./DialogTriple":20,"./EntityRecDef":24,"./OType":52}],93:[function(require,module,exports){
"use strict";

var _ObjUtil = require("../util/ObjUtil");

var _Failure = require("../fp/Failure");

var _OType = require("./OType");

var _DialogTriple = require("./DialogTriple");

/**
 * Created by rburson on 3/30/15.
 */

var XPaneDef = (function () {
    function XPaneDef() {}
    XPaneDef.fromWS = function (otype, jsonObj) {
        if (jsonObj['listDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['listDef'], 'WSListDef', _OType.OType.factoryFn);
        } else if (jsonObj['detailsDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['detailsDef'], 'WSDetailsDef', _OType.OType.factoryFn);
        } else if (jsonObj['formDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['formDef'], 'WSFormDef', _OType.OType.factoryFn);
        } else if (jsonObj['mapDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['mapDef'], 'WSMapDef', _OType.OType.factoryFn);
        } else if (jsonObj['graphDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['graphDef'], 'WSGraphDef', _OType.OType.factoryFn);
        } else if (jsonObj['barcodeScanDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['barcodeScanDef'], 'WSBarcodeScanDef', _OType.OType.factoryFn);
        } else if (jsonObj['imagePickerDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['imagePickerDef'], 'WSImagePickerDef', _OType.OType.factoryFn);
        } else if (jsonObj['geoFixDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['geoFixDef'], 'WSGeoFixDef', _OType.OType.factoryFn);
        } else if (jsonObj['geoLocationDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['geoLocationDef'], 'WSGeoLocationDef', _OType.OType.factoryFn);
        } else if (jsonObj['calendarDef']) {
            return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['calendarDef'], 'WSCalendarDef', _OType.OType.factoryFn);
        } else {
            return new _Failure.Failure('XPaneDef::fromWS: Cannot determine concrete class for XPaneDef ' + _ObjUtil.ObjUtil.formatRecAttr(jsonObj));
        }
    };
    return XPaneDef;
})();
XPaneDef = XPaneDef;

},{"../fp/Failure":100,"../util/ObjUtil":108,"./DialogTriple":20,"./OType":52}],94:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/30/15.
 */
var XPaneDefRef = (function () {
    function XPaneDefRef(name, paneId, title, type) {
        this.name = name;
        this.paneId = paneId;
        this.title = title;
        this.type = type;
    }
    return XPaneDefRef;
})();
XPaneDefRef = XPaneDefRef;

},{}],95:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 4/1/15.
 */
var XPropertyChangeResult = (function () {
    function XPropertyChangeResult(availableValueChanges, propertyName, sideEffects, editorRecordDef) {
        this.availableValueChanges = availableValueChanges;
        this.propertyName = propertyName;
        this.sideEffects = sideEffects;
        this.editorRecordDef = editorRecordDef;
    }
    Object.defineProperty(XPropertyChangeResult.prototype, "sideEffectsDef", {
        get: function get() {
            return this.editorRecordDef;
        },
        enumerable: true,
        configurable: true
    });
    return XPropertyChangeResult;
})();
XPropertyChangeResult = XPropertyChangeResult;

},{}],96:[function(require,module,exports){
'use strict';

var _DialogTriple = require('./DialogTriple');

var _OType = require('./OType');

var _Success = require('../fp/Success');

var _Failure = require('../fp/Failure');

var _EntityRec = require('./EntityRec');

var _Prop = require('./Prop');

var _DataAnno = require('./DataAnno');

var XQueryResult = (function () {
    function XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs, defaultActionId, dialogProps) {
        this.entityRecs = entityRecs;
        this.entityRecDef = entityRecDef;
        this.hasMore = hasMore;
        this.sortPropDefs = sortPropDefs;
        this.defaultActionId = defaultActionId;
        this.dialogProps = dialogProps;
    }
    XQueryResult.fromWS = function (otype, jsonObj) {
        return _DialogTriple.DialogTriple.fromWSDialogObject(jsonObj['queryRecordDef'], 'WSQueryRecordDef', _OType.OType.factoryFn).bind(function (entityRecDef) {
            var entityRecDefJson = jsonObj['queryRecordDef'];
            var actionId = jsonObj['defaultActionId'];
            return _DialogTriple.DialogTriple.fromListOfWSDialogObject(entityRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', _OType.OType.factoryFn).bind(function (sortPropDefs) {
                var queryRecsJson = jsonObj['queryRecords'];
                if (queryRecsJson['WS_LTYPE'] !== 'WSQueryRecord') {
                    return new _Failure.Failure('XQueryResult::fromWS: Expected WS_LTYPE of WSQueryRecord but found ' + queryRecsJson['WS_LTYPE']);
                }
                var queryRecsValues = queryRecsJson['values'];
                var entityRecs = [];
                for (var i = 0; i < queryRecsValues.length; i++) {
                    var queryRecValue = queryRecsValues[i];
                    if (queryRecValue['WS_OTYPE'] !== 'WSQueryRecord') {
                        return new _Failure.Failure('XQueryResult::fromWS: Expected WS_OTYPE of WSQueryRecord but found ' + queryRecValue['WS_LTYPE']);
                    }
                    var objectId = queryRecValue['objectId'];
                    var recPropsObj = queryRecValue['properties'];
                    if (recPropsObj['WS_LTYPE'] !== 'Object') {
                        return new _Failure.Failure('XQueryResult::fromWS: Expected WS_LTYPE of Object but found ' + recPropsObj['WS_LTYPE']);
                    }
                    var recPropsObjValues = recPropsObj['values'];
                    var propsTry = _Prop.Prop.fromWSNamesAndValues(entityRecDef.propNames, recPropsObjValues);
                    if (propsTry.isFailure) return new _Failure.Failure(propsTry.failure);
                    var props = propsTry.success;
                    if (queryRecValue['propertyAnnotations']) {
                        var propAnnosJson = queryRecValue['propertyAnnotations'];
                        var annotatedPropsTry = _DataAnno.DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosJson);
                        if (annotatedPropsTry.isFailure) return new _Failure.Failure(annotatedPropsTry.failure);
                        props = annotatedPropsTry.success;
                    }
                    var recAnnos = null;
                    if (queryRecValue['recordAnnotation']) {
                        var recAnnosTry = _DialogTriple.DialogTriple.fromWSDialogObject(queryRecValue['recordAnnotation'], 'WSDataAnnotation', _OType.OType.factoryFn);
                        if (recAnnosTry.isFailure) return new _Failure.Failure(recAnnosTry.failure);
                        recAnnos = recAnnosTry.success;
                    }
                    var entityRec = _EntityRec.EntityRecUtil.newEntityRec(objectId, props, recAnnos);
                    entityRecs.push(entityRec);
                }
                var dialogProps = jsonObj['dialogProperties'];
                var hasMore = jsonObj['hasMore'];
                return new _Success.Success(new XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs, actionId, dialogProps));
            });
        });
    };
    return XQueryResult;
})(); /**
       * Created by rburson on 4/1/15.
       */

XQueryResult = XQueryResult;

},{"../fp/Failure":100,"../fp/Success":103,"./DataAnno":14,"./DialogTriple":20,"./EntityRec":23,"./OType":52,"./Prop":57}],97:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 4/1/15.
 */
var XReadResult = (function () {
    function XReadResult(_editorRecord, _editorRecordDef, _dialogProperties) {
        this._editorRecord = _editorRecord;
        this._editorRecordDef = _editorRecordDef;
        this._dialogProperties = _dialogProperties;
    }
    Object.defineProperty(XReadResult.prototype, "entityRec", {
        get: function get() {
            return this._editorRecord;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XReadResult.prototype, "entityRecDef", {
        get: function get() {
            return this._editorRecordDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XReadResult.prototype, "dialogProps", {
        get: function get() {
            return this._dialogProperties;
        },
        enumerable: true,
        configurable: true
    });
    return XReadResult;
})();
XReadResult = XReadResult;

},{}],98:[function(require,module,exports){
'use strict';

var _DialogTriple = require('./DialogTriple');

var _OType = require('./OType');

/**
 * Created by rburson on 4/1/15.
 */

var XWriteResult = (function () {
    function XWriteResult(_editorRecord, _editorRecordDef, _dialogProperties) {
        this._editorRecord = _editorRecord;
        this._editorRecordDef = _editorRecordDef;
        this._dialogProperties = _dialogProperties;
    }
    XWriteResult.fromWS = function (otype, jsonObj) {
        return _DialogTriple.DialogTriple.extractTriple(jsonObj, 'WSWriteResult', function () {
            return _OType.OType.deserializeObject(jsonObj, 'XWriteResult', _OType.OType.factoryFn);
        });
    };
    Object.defineProperty(XWriteResult.prototype, "dialogProps", {
        get: function get() {
            return this._dialogProperties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XWriteResult.prototype, "entityRec", {
        get: function get() {
            return this._editorRecord;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XWriteResult.prototype, "entityRecDef", {
        get: function get() {
            return this._editorRecordDef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XWriteResult.prototype, "isDestroyed", {
        get: function get() {
            var destoyedStr = this.dialogProps['destroyed'];
            return destoyedStr && destoyedStr.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    return XWriteResult;
})();
XWriteResult = XWriteResult;

},{"./DialogTriple":20,"./OType":52}],99:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/16/15.
 */
var Either = (function () {
    function Either() {}
    Either.left = function (left) {
        var either = new Either();
        either._left = left;
        return either;
    };
    Either.right = function (right) {
        var either = new Either();
        either._right = right;
        return either;
    };
    Object.defineProperty(Either.prototype, "isLeft", {
        get: function get() {
            return !!this._left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Either.prototype, "isRight", {
        get: function get() {
            return !!this._right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Either.prototype, "left", {
        get: function get() {
            return this._left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Either.prototype, "right", {
        get: function get() {
            return this._right;
        },
        enumerable: true,
        configurable: true
    });
    return Either;
})();
Either = Either;

},{}],100:[function(require,module,exports){
"use strict";

var _Try = require("./Try");

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var Failure = (function (_super) {
    __extends(Failure, _super);
    function Failure(_error) {
        _super.call(this);
        this._error = _error;
    }
    Object.defineProperty(Failure.prototype, "failure", {
        get: function get() {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Failure.prototype, "isFailure", {
        get: function get() {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return Failure;
})(_Try.Try);
Failure = Failure;

},{"./Try":104}],101:[function(require,module,exports){
'use strict';

var _Success = require('./Success');

var _Failure = require('./Failure');

var _Promise = require('./Promise');

var _ArrayUtil = require('../util/ArrayUtil');

var _Log = require('../util/Log');

var Future = (function () {
    /** --------------------- CONSTRUCTORS ------------------------------*/
    function Future(_label) {
        this._label = _label;
        this._completionListeners = new Array();
    }
    /** --------------------- PUBLIC STATIC ------------------------------*/
    Future.createCompletedFuture = function (label, result) {
        var f = new Future(label);
        return f.complete(result);
    };
    Future.createSuccessfulFuture = function (label, value) {
        return Future.createCompletedFuture(label, new _Success.Success(value));
    };
    Future.createFailedFuture = function (label, error) {
        return Future.createCompletedFuture(label, new _Failure.Failure(error));
    };
    Future.createFuture = function (label) {
        var f = new Future(label);
        return f;
    };
    Future.sequence = function (seqOfFutures) {
        var start = Future.createSuccessfulFuture('Future::sequence/start', []);
        return seqOfFutures.reduce(function (seqFr, nextFr) {
            return seqFr.bind(function (seq) {
                var pr = new _Promise.Promise('Future::sequence/nextFr');
                nextFr.onComplete(function (t) {
                    seq.push(t);
                    pr.complete(new _Success.Success(seq));
                });
                return pr.future;
            });
        }, start);
    };
    /** --------------------- PUBLIC ------------------------------*/
    Future.prototype.bind = function (f) {
        var p = new _Promise.Promise('Future.bind:' + this._label);
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
                    p.complete(new _Failure.Failure(error));
                }
            }
        });
        return p.future;
    };
    Object.defineProperty(Future.prototype, "failure", {
        get: function get() {
            return this._result ? this._result.failure : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Future.prototype, "isComplete", {
        get: function get() {
            return !!this._result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Future.prototype, "isCompleteWithFailure", {
        get: function get() {
            return !!this._result && this._result.isFailure;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Future.prototype, "isCompleteWithSuccess", {
        get: function get() {
            return !!this._result && this._result.isSuccess;
        },
        enumerable: true,
        configurable: true
    });
    Future.prototype.map = function (f) {
        var p = new _Promise.Promise('Future.map:' + this._label);
        this.onComplete(function (t1) {
            if (t1.isFailure) {
                p.failure(t1.failure);
            } else {
                var a = t1.success;
                try {
                    var b = f(a);
                    p.success(b);
                } catch (error) {
                    p.complete(new _Failure.Failure(error));
                }
            }
        });
        return p.future;
    };
    Future.prototype.onComplete = function (listener) {
        this._result ? listener(this._result) : this._completionListeners.push(listener);
    };
    Future.prototype.onFailure = function (listener) {
        this.onComplete(function (t) {
            t.isFailure && listener(t.failure);
        });
    };
    Future.prototype.onSuccess = function (listener) {
        this.onComplete(function (t) {
            t.isSuccess && listener(t.success);
        });
    };
    Object.defineProperty(Future.prototype, "result", {
        get: function get() {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Future.prototype, "success", {
        get: function get() {
            return this._result ? this.result.success : null;
        },
        enumerable: true,
        configurable: true
    });
    /** --------------------- MODULE ------------------------------*/
    //*** let's pretend this has module level visibility
    Future.prototype.complete = function (t) {
        var _this = this;
        var notifyList = new Array();
        //Log.debug("complete() called on Future " + this._label + ' there are ' + this._completionListeners.length + " listeners.");
        if (t) {
            if (!this._result) {
                this._result = t;
                /* capture the listener set to prevent missing a notification */
                notifyList = _ArrayUtil.ArrayUtil.copy(this._completionListeners);
            } else {
                _Log.Log.error("Future::complete() : Future " + this._label + " has already been completed");
            }
            notifyList.forEach(function (listener) {
                try {
                    listener(_this._result);
                } catch (error) {
                    _Log.Log.error("CompletionListener failed with " + error);
                }
            });
        } else {
            _Log.Log.error("Future::complete() : Can't complete Future with null result");
        }
        return this;
    };
    return Future;
})(); /**
       * Created by rburson on 3/5/15.
       */

Future = Future;

},{"../util/ArrayUtil":105,"../util/Log":107,"./Failure":100,"./Promise":102,"./Success":103}],102:[function(require,module,exports){
'use strict';

var _Future = require('./Future');

var _Success = require('./Success');

var _Failure = require('./Failure');

var Promise = (function () {
    function Promise(label) {
        this._future = _Future.Future.createFuture(label);
    }
    /** --------------------- PUBLIC ------------------------------*/
    Promise.prototype.isComplete = function () {
        return this._future.isComplete;
    };
    Promise.prototype.complete = function (t) {
        //Log.debug('Promise calling complete on Future...');
        this._future.complete(t);
        return this;
    };
    Promise.prototype.failure = function (error) {
        this.complete(new _Failure.Failure(error));
    };
    Object.defineProperty(Promise.prototype, "future", {
        get: function get() {
            return this._future;
        },
        enumerable: true,
        configurable: true
    });
    Promise.prototype.success = function (value) {
        this.complete(new _Success.Success(value));
    };
    return Promise;
})(); /**
       * Created by rburson on 3/6/15.
       */

Promise = Promise;

},{"./Failure":100,"./Future":101,"./Success":103}],103:[function(require,module,exports){
"use strict";

var _Try = require("./Try");

/**
 * Created by rburson on 3/5/15.
 */
var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var Success = (function (_super) {
    __extends(Success, _super);
    function Success(_value) {
        _super.call(this);
        this._value = _value;
    }
    Object.defineProperty(Success.prototype, "isSuccess", {
        get: function get() {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Success.prototype, "success", {
        get: function get() {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return Success;
})(_Try.Try);
Success = Success;

},{"./Try":104}],104:[function(require,module,exports){
'use strict';

var _Success = require('./Success');

var _Failure = require('./Failure');

/**
 * Created by rburson on 3/5/15.
 */

var Try = (function () {
    function Try() {}
    Try.flatten = function (tryList) {
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
            return new _Failure.Failure(failures);
        } else {
            return new _Success.Success(successes);
        }
    };
    Try.isListOfTry = function (list) {
        return list.every(function (value) {
            return value instanceof Try;
        });
    };
    Try.prototype.bind = function (f) {
        return this.isFailure ? new _Failure.Failure(this.failure) : f(this.success);
    };
    Object.defineProperty(Try.prototype, "failure", {
        get: function get() {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Try.prototype, "isFailure", {
        get: function get() {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Try.prototype, "isSuccess", {
        get: function get() {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Try.prototype.map = function (f) {
        return this.isFailure ? new _Failure.Failure(this.failure) : new _Success.Success(f(this.success));
    };
    Object.defineProperty(Try.prototype, "success", {
        get: function get() {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return Try;
})();
Try = Try;

},{"./Failure":100,"./Success":103}],105:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 3/6/15.
 */
var ArrayUtil = (function () {
    function ArrayUtil() {}
    ArrayUtil.copy = function (source) {
        return source.map(function (e) {
            return e;
        });
    };
    ArrayUtil.find = function (source, f) {
        var value = null;
        source.some(function (v) {
            if (f(v)) {
                value = v;
                return true;
            }
            return false;
        });
        return value;
    };
    return ArrayUtil;
})();
ArrayUtil = ArrayUtil;

},{}],106:[function(require,module,exports){
"use strict";

/**
 * Created by rburson on 4/4/15.
 */
/*
 This implementation supports our ECMA 5.1 browser set, including IE9
 If we no longer need to support IE9, a TypedArray implementaion would be more efficient...
 */
var Base64 = (function () {
    function Base64() {}
    Base64.encode = function (input) {
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
    };
    Base64.decode = function (input) {
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
    };
    Base64._utf8_encode = function (s) {
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
    };
    Base64._utf8_decode = function (utftext) {
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
    };
    Base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    return Base64;
})();
Base64 = Base64;

},{}],107:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LogLevel = undefined;

var _ObjUtil = require("./ObjUtil");

var LogLevel = exports.LogLevel = undefined; /**
                                              * Created by rburson on 3/6/15.
                                              */

(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
var Log = (function () {
    function Log() {}
    Log.logLevel = function (level) {
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
    };
    Log.log = function (logger, message, method, clz) {
        var m = typeof message !== 'string' ? Log.formatRecString(message) : message;
        if (clz || method) {
            logger(clz + "::" + method + " : " + m);
        } else {
            logger(m);
        }
    };
    Log.formatRecString = function (o) {
        return _ObjUtil.ObjUtil.formatRecAttr(o);
    };
    //set default log level here
    Log.init = Log.logLevel(LogLevel.INFO);
    return Log;
})();
Log = Log;

},{"./ObjUtil":108}],108:[function(require,module,exports){
"use strict";

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
 * Created by rburson on 3/20/15.
 */
var ObjUtil = (function () {
    function ObjUtil() {}
    ObjUtil.addAllProps = function (sourceObj, targetObj) {
        if (null == sourceObj || "object" != (typeof sourceObj === "undefined" ? "undefined" : _typeof(sourceObj))) return targetObj;
        if (null == targetObj || "object" != (typeof targetObj === "undefined" ? "undefined" : _typeof(targetObj))) return targetObj;
        for (var attr in sourceObj) {
            targetObj[attr] = sourceObj[attr];
        }
        return targetObj;
    };
    ObjUtil.cloneOwnProps = function (sourceObj) {
        if (null == sourceObj || "object" != (typeof sourceObj === "undefined" ? "undefined" : _typeof(sourceObj))) return sourceObj;
        var copy = sourceObj.constructor();
        for (var attr in sourceObj) {
            if (sourceObj.hasOwnProperty(attr)) {
                copy[attr] = ObjUtil.cloneOwnProps(sourceObj[attr]);
            }
        }
        return copy;
    };
    ObjUtil.copyNonNullFieldsOnly = function (obj, newObj, filterFn) {
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
    };
    ObjUtil.formatRecAttr = function (o) {
        //@TODO - add a filter here to build a cache and detect (and skip) circular references
        return JSON.stringify(o);
    };
    ObjUtil.newInstance = function (type) {
        return new type();
    };
    return ObjUtil;
})();
ObjUtil = ObjUtil;

},{}],109:[function(require,module,exports){
'use strict';

/**
 * Created by rburson on 4/3/15.
 */
var StringUtil = (function () {
    function StringUtil() {}
    StringUtil.splitSimpleKeyValuePair = function (pairString) {
        var pair = pairString.split(':');
        var code = pair[0];
        var desc = pair.length > 1 ? pair[1] : '';
        return [code, desc];
    };
    return StringUtil;
})();
StringUtil = StringUtil;

},{}],110:[function(require,module,exports){
'use strict';

var _Failure = require('../fp/Failure');

var _Future = require('../fp/Future');

var _Promise = require('../fp/Promise');

var _Log = require('../util/Log');

/**
 * Created by rburson on 3/9/15.
 */

var XMLHttpClient = (function () {
    function XMLHttpClient() {}
    XMLHttpClient.prototype.jsonGet = function (targetUrl, timeoutMillis) {
        return this.jsonCall(targetUrl, null, 'GET', timeoutMillis);
    };
    XMLHttpClient.prototype.jsonPost = function (targetUrl, jsonObj, timeoutMillis) {
        return this.jsonCall(targetUrl, jsonObj, 'POST', timeoutMillis);
    };
    XMLHttpClient.prototype.jsonCall = function (targetUrl, jsonObj, method, timeoutMillis) {
        if (method === void 0) {
            method = 'GET';
        }
        if (timeoutMillis === void 0) {
            timeoutMillis = 30000;
        }
        var body = jsonObj && JSON.stringify(jsonObj);
        //var promise = new Promise<StringDictionary>("XMLHttpClient::jsonCall");
        var promise = new _Promise.Promise("XMLHttpClient::" + targetUrl + ":" + body);
        if (method !== 'GET' && method !== 'POST') {
            promise.failure(method + " method not supported.");
            return promise.future;
        }
        var successCallback = function successCallback(request) {
            try {
                _Log.Log.debug("XMLHttpClient: Got successful response: " + request.responseText);
                var responseObj = JSON.parse(request.responseText);
                promise.success(responseObj);
            } catch (error) {
                promise.failure("XMLHttpClient::jsonCall: Failed to parse response: " + request.responseText);
            }
        };
        var errorCallback = function errorCallback(request) {
            _Log.Log.error('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
            promise.failure('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
        };
        var timeoutCallback = function timeoutCallback() {
            if (promise.isComplete()) {
                _Log.Log.error('XMLHttpClient::jsonCall: Timeoutreceived but Promise was already complete.');
            } else {
                _Log.Log.error('XMLHttpClient::jsonCall: Timeoutreceived.');
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
        _Log.Log.debug("XmlHttpClient: Calling: " + targetUrl);
        _Log.Log.debug("XmlHttpClient: body: " + body);
        xmlHttpRequest.open(method, targetUrl, true);
        if (method === 'POST') {
            xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlHttpRequest.send(body);
        } else {
            xmlHttpRequest.send();
        }
        return promise.future;
    };
    return XMLHttpClient;
})();
XMLHttpClient = XMLHttpClient;
var Call = (function () {
    function Call(service, method, params, systemContext, sessionContext) {
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
    Call.nextCallId = function () {
        return ++Call._lastCallId;
    };
    Call.createCall = function (service, method, params, sessionContext) {
        return new Call(service, method, params, sessionContext.systemContext, sessionContext);
    };
    Call.createCallWithoutSession = function (service, method, params, systemContext) {
        return new Call(service, method, params, systemContext, null);
    };
    Call.prototype.cancel = function () {
        _Log.Log.error("Needs implementation", "Call", "cancel");
    };
    Call.prototype.perform = function () {
        if (this._performed) {
            return _Future.Future.createFailedFuture("Call::perform", "Call:perform(): Call is already performed");
        }
        this._performed = true;
        if (!this._systemContext) {
            return _Future.Future.createFailedFuture("Call::perform", "Call:perform(): SystemContext cannot be null");
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
    };
    Call._lastCallId = 0;
    return Call;
})();
Call = Call;
var Get = (function () {
    function Get(url) {
        this._client = new XMLHttpClient();
        this._url = url;
        this._performed = false;
        this._promise = new _Promise.Promise("catavolt.ws.Get");
        this.timeoutMillis = 30000;
    }
    Get.fromUrl = function (url) {
        return new Get(url);
    };
    Get.prototype.cancel = function () {
        _Log.Log.error("Needs implementation", "Get", "cancel");
    };
    Get.prototype.perform = function () {
        if (this._performed) {
            return this.complete(new _Failure.Failure("Get:perform(): Get is already performed")).future;
        }
        this._performed = true;
        return this._client.jsonGet(this._url, this.timeoutMillis);
    };
    Get.prototype.complete = function (t) {
        if (!this._promise.isComplete()) {
            this._promise.complete(t);
        }
        return this._promise;
    };
    return Get;
})();
Get = Get;

},{"../fp/Failure":100,"../fp/Future":101,"../fp/Promise":102,"../util/Log":107}],111:[function(require,module,exports){
"use strict";

var _Future = require("../src/catavolt/fp/Future");

var _AppContext = require("../src/catavolt/dialog/AppContext");

var _Log = require("../src/catavolt/util/Log");

var _FormContext = require("../src/catavolt/dialog/FormContext");

var _ListContext = require("../src/catavolt/dialog/ListContext");

var _DetailsContext = require("../src/catavolt/dialog/DetailsContext");

var _ObjUtil = require("../src/catavolt/util/ObjUtil");

var _QueryScroller = require("../src/catavolt/dialog/QueryScroller");

var _MenuDef = require("../src/catavolt/dialog/MenuDef");

var _LabelCellValueDef = require("../src/catavolt/dialog/LabelCellValueDef");

var _ForcedLineCellValueDef = require("../src/catavolt/dialog/ForcedLineCellValueDef");

var _AttributeCellValueDef = require("../src/catavolt/dialog/AttributeCellValueDef");

///<reference path="jasmine.d.ts"/>

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
    return _AppContext.AppContext.singleton.login(SERVICE_PATH, tenantId, clientType, userId, password).bind(function (appWinDef) {
        _Log.Log.info('Login Succeeded');
        _Log.Log.info('AppWinDef: ' + _Log.Log.formatRecString(appWinDef));
        _Log.Log.info('SessionContext: ' + _Log.Log.formatRecString(_AppContext.AppContext.singleton.sessionContextTry.success));
        _Log.Log.info('TenantSettings: ' + _Log.Log.formatRecString(_AppContext.AppContext.singleton.tenantSettingsTry.success));
        return setupWorkbench().bind(function (result) {
            _Log.Log.info('Competed all workbenches.');
            return null;
        });
    });
}
function setupWorkbench() {
    var workbenches = _AppContext.AppContext.singleton.appWinDefTry.success.workbenches;
    var launchWorkbenchesFuture = _Future.Future.createSuccessfulFuture('startSetupWorkbench', null);
    workbenches.forEach(function (workbench) {
        _Log.Log.info("Examining Workbench: " + workbench.name);
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
                _Log.Log.info(">>>>> Launching Action: " + launchAction.name + " Icon: " + launchAction.iconBase);
                return performLaunchAction(launchAction).map(function (launchActionResult) {
                    _Log.Log.info('<<<<< Completed Launch Action ' + launchAction.name);
                    return launchActionResult;
                });
            });
        });
    });
    return launchWorkbenchesFuture.map(function (lastLaunchActionResult) {
        _Log.Log.info("");
        _Log.Log.info("Completed all launch Actions");
        _Log.Log.info("");
    });
}
function performLaunchAction(launchAction) {
    return _AppContext.AppContext.singleton.performLaunchAction(launchAction).bind(function (navRequest) {
        _Log.Log.info("Perform Launch Action " + launchAction.name + ' succeeded. Continuing with NavRequest...');
        return handleNavRequest(navRequest);
    });
}
function getLaunchActionByName(name, workbenches) {
    return null;
}
function handleNavRequest(navRequest) {
    if (navRequest instanceof _FormContext.FormContext) {
        return handleFormContext(navRequest);
    } else {
        _Log.Log.info('NavRequest in not a FormContext:  ' + navRequest.constructor['name']);
        return _Future.Future.createSuccessfulFuture('handleNavRequest', navRequest);
    }
}
function handleFormContext(formContext) {
    displayMenus(formContext);
    var handleContextsFuture = _Future.Future.createSuccessfulFuture('startHandleContexts', null);
    formContext.childrenContexts.forEach(function (context) {
        _Log.Log.info('');
        _Log.Log.info('Got a ' + context.constructor['name'] + ' for display');
        _Log.Log.info('');
        if (context instanceof _ListContext.ListContext) {
            handleContextsFuture = handleContextsFuture.bind(function (lastContextResult) {
                return handleListContext(context);
            });
        } else if (context instanceof _DetailsContext.DetailsContext) {
            handleContextsFuture = handleContextsFuture.bind(function (lastContextResult) {
                return handleDetailsContext(context);
            });
        } else {
            _Log.Log.info('');
            _Log.Log.info('Not yet handling display for ' + context.constructor['name']);
            _Log.Log.info('');
            handleContextsFuture = handleContextsFuture.map(function (lastContextResult) {
                return context;
            });
        }
    });
    return handleContextsFuture;
}
function displayMenus(paneContext) {
    _Log.Log.info('----------Menus>>>-------------------------------');
    _Log.Log.info(_ObjUtil.ObjUtil.formatRecAttr(paneContext.menuDefs));
    _Log.Log.info('----------<<<Menus-------------------------------');
    return _Future.Future.createSuccessfulFuture('displayMenus', paneContext);
}
function handleListContext(listContext) {
    _Log.Log.info('Handling a ListContext... ');
    listContext.setScroller(10, null, [_QueryScroller.QueryMarkerOption.None]);
    var listFuture = listContext.refresh().bind(function (entityRec) {
        _Log.Log.info('Finished refresh');
        displayMenus(listContext);
        var columnHeadings = listContext.listDef.activeColumnDefs.map(function (columnDef) {
            return columnDef.heading;
        });
        _Log.Log.info(columnHeadings.join('|'));
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
        _Log.Log.error("ListContext failed to render with " + failure);
    });
    return listFuture;
}
function scrollThroughAllResults(listContext) {
    if (listContext.scroller.hasMoreForward) {
        _Log.Log.info('The list has more items to display.  Scrolling forward....');
        return getNextPageOfResults(listContext).bind(function (prevPageEntityRecs) {
            return scrollThroughAllResults(listContext);
        });
    } else {
        _Log.Log.info('The list has no more items to display.');
        return _Future.Future.createSuccessfulFuture('scrollThroughAllResults', listContext);
    }
}
function scrollBackwardThroughAllResults(listContext) {
    if (listContext.scroller.hasMoreBackward) {
        _Log.Log.info('The list has previous items to display.  Scrolling backward....');
        return getPreviousPageOfResults(listContext).bind(function (prevPageEntityRecs) {
            return scrollBackwardThroughAllResults(listContext);
        });
    } else {
        _Log.Log.info('The list has no more previous items to display.');
        return _Future.Future.createSuccessfulFuture('scrollBackwardThroughAllResults', listContext);
    }
}
function getNextPageOfResults(listContext) {
    return listContext.scroller.pageForward().map(function (entityRecs) {
        _Log.Log.info('Displaying next page of ' + entityRecs.length + ' records.');
        entityRecs.forEach(function (entityRec) {
            displayListItem(entityRec, listContext);
        });
        return entityRecs;
    });
}
function getPreviousPageOfResults(listContext) {
    return listContext.scroller.pageBackward().map(function (entityRecs) {
        _Log.Log.info('Displaying previous page of ' + entityRecs.length + ' records.');
        entityRecs.forEach(function (entityRec) {
            displayListItem(entityRec, listContext);
        });
        return entityRecs;
    });
}
function displayListItem(entityRec, listContext) {
    var rowValues = listContext.rowValues(entityRec);
    _Log.Log.info(rowValues.join('|'));
}
function handleDefaultActionForListItem(index, listContext) {
    if (!listContext.listDef.defaultActionId) {
        return _Future.Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
    }
    var defaultActionMenuDef = new _MenuDef.MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW', listContext.listDef.defaultActionId, null, null, []);
    var entityRecs = listContext.scroller.buffer;
    if (entityRecs.length === 0) return _Future.Future.createSuccessfulFuture('handleDefaultActionForListItem', listContext);
    if (entityRecs.length > index) {
        var entityRec = entityRecs[index];
        _Log.Log.info('--------------------------------------------------------------');
        _Log.Log.info('Invoking default action on list item ' + entityRec.objectId);
        _Log.Log.info('--------------------------------------------------------------');
        var targets = [entityRec.objectId];
        return listContext.performMenuAction(defaultActionMenuDef, targets).bind(function (navRequest) {
            return handleNavRequest(navRequest);
        });
    } else {
        return _Future.Future.createFailedFuture('handleDefaultActionForListItem', 'Invalid index for listContext');
    }
}
function handleDetailsContext(detailsContext) {
    _Log.Log.info('Handling Details Context...');
    return detailsContext.read().bind(function (entityRec) {
        return layoutDetailsPane(detailsContext).map(function (renderedDetailRows) {
            renderedDetailRows.forEach(function (row) {
                _Log.Log.info('Detail Row: ' + row);
            });
            return renderedDetailRows;
        });
    });
}
function layoutDetailsPane(detailsContext) {
    var allDefsComplete = _Future.Future.createSuccessfulFuture('layoutDetailsPaneStart', '');
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
            _Log.Log.info('Detail row is invalid ' + _ObjUtil.ObjUtil.formatRecAttr(cellDefRow));
        }
    });
    return allDefsComplete.map(function (lastRowResult) {
        return renderedDetailRows;
    });
}
function isValidDetailsDefRow(row) {
    return row.length === 2 && row[0].values.length === 1 && row[1].values.length === 1 && (row[0].values[0] instanceof _LabelCellValueDef.LabelCellValueDef || row[1].values[0] instanceof _ForcedLineCellValueDef.ForcedLineCellValueDef) && (row[1].values[0] instanceof _AttributeCellValueDef.AttributeCellValueDef || row[1].values[0] instanceof _LabelCellValueDef.LabelCellValueDef || row[1].values[0] instanceof _ForcedLineCellValueDef.ForcedLineCellValueDef);
}
function isSectionTitleDef(row) {
    return row[0].values[0] instanceof _LabelCellValueDef.LabelCellValueDef && row[1].values[0] instanceof _LabelCellValueDef.LabelCellValueDef;
}
function createTitleRow(row) {
    return '<Label>' + row[0].values[0] + '</Label> : <Label>' + row[1].values[0] + '</Label>';
}
function createEditorRow(row, detailsContext) {
    var labelDef = row[0].values[0];
    var label;
    if (labelDef instanceof _LabelCellValueDef.LabelCellValueDef) {
        label = '<Label>' + labelDef.value + '</Label>';
    } else {
        label = '<Label>N/A</Label>';
    }
    var valueDef = row[1].values[0];
    if (valueDef instanceof _AttributeCellValueDef.AttributeCellValueDef && !detailsContext.isReadModeFor(valueDef.propertyName)) {
        return createEditorControl(valueDef, detailsContext).map(function (editorCellString) {
            return label + editorCellString;
        });
    } else if (valueDef instanceof _AttributeCellValueDef.AttributeCellValueDef) {
        var value = "";
        var prop = detailsContext.buffer.propAtName(valueDef.propertyName);
        if (prop && detailsContext.isBinary(valueDef)) {
            value = "<Binary name='" + valueDef.propertyName + "'/>";
        } else if (prop) {
            value = '<Label>' + detailsContext.formatForRead(prop.value, prop.name) + '</Label>';
        }
        return _Future.Future.createSuccessfulFuture('createEditorRow', label + ' : ' + value);
    } else if (valueDef instanceof _LabelCellValueDef.LabelCellValueDef) {
        return _Future.Future.createSuccessfulFuture('createEditorRow', label + ' : <Label>' + valueDef.value + '</Label>');
    } else {
        _Future.Future.createSuccessfulFuture('createEditorRow', label + " : ");
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
            return _Future.Future.createSuccessfulFuture('createEditorControl', "<Binary name='" + prop.name + "' mode='WRITE'/>");
        } else {
            var value = prop ? detailsContext.formatForWrite(prop.value, prop.name) : "";
            return _Future.Future.createSuccessfulFuture('createEditorControl', '<TextField>' + value + '</TextField>');
        }
    }
}

},{"../src/catavolt/dialog/AppContext":1,"../src/catavolt/dialog/AttributeCellValueDef":3,"../src/catavolt/dialog/DetailsContext":15,"../src/catavolt/dialog/ForcedLineCellValueDef":26,"../src/catavolt/dialog/FormContext":27,"../src/catavolt/dialog/LabelCellValueDef":42,"../src/catavolt/dialog/ListContext":43,"../src/catavolt/dialog/MenuDef":47,"../src/catavolt/dialog/QueryScroller":62,"../src/catavolt/fp/Future":101,"../src/catavolt/util/Log":107,"../src/catavolt/util/ObjUtil":108}]},{},[111]);
