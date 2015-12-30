/**
 * Created by rburson on 3/13/15.
 */
var WorkbenchService_1 = require('./WorkbenchService');
var SystemContextImpl_1 = require('./SystemContextImpl');
var SessionService_1 = require('./SessionService');
var GatewayService_1 = require('./GatewayService');
var Future_1 = require('../fp/Future');
var Success_1 = require('../fp/Success');
var Failure_1 = require('../fp/Failure');
var Log_1 = require('../util/Log');
var ObjUtil_1 = require('../util/ObjUtil');
var NavRequest_1 = require("./NavRequest");
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
        get: function () {
            return AppContext.ONE_DAY_IN_MILLIS;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext, "singleton", {
        get: function () {
            if (!AppContext._singleton) {
                AppContext._singleton = new AppContext();
            }
            return AppContext._singleton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "appWinDefTry", {
        get: function () {
            return this._appWinDefTry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "deviceProps", {
        get: function () {
            return this._deviceProps;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "isLoggedIn", {
        get: function () {
            return this._appContextState === AppContextState.LOGGED_IN;
        },
        enumerable: true,
        configurable: true
    });
    AppContext.prototype.getWorkbench = function (sessionContext, workbenchId) {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future_1.Future.createFailedFuture("AppContext::getWorkbench", "User is logged out");
        }
        return WorkbenchService_1.WorkbenchService.getWorkbench(sessionContext, workbenchId);
    };
    AppContext.prototype.login = function (gatewayHost, tenantId, clientType, userId, password) {
        var _this = this;
        if (this._appContextState === AppContextState.LOGGED_IN) {
            return Future_1.Future.createFailedFuture("AppContext::login", "User is already logged in");
        }
        var answer;
        var appContextValuesFr = this.loginOnline(gatewayHost, tenantId, clientType, userId, password, this.deviceProps);
        return appContextValuesFr.bind(function (appContextValues) {
            _this.setAppContextStateToLoggedIn(appContextValues);
            return Future_1.Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
        });
    };
    AppContext.prototype.loginDirectly = function (url, tenantId, clientType, userId, password) {
        var _this = this;
        if (this._appContextState === AppContextState.LOGGED_IN) {
            return Future_1.Future.createFailedFuture("AppContext::loginDirectly", "User is already logged in");
        }
        return this.loginFromSystemContext(new SystemContextImpl_1.SystemContextImpl(url), tenantId, userId, password, this.deviceProps, clientType).bind(function (appContextValues) {
            _this.setAppContextStateToLoggedIn(appContextValues);
            return Future_1.Future.createSuccessfulFuture('AppContext::loginDirectly', appContextValues.appWinDef);
        });
    };
    AppContext.prototype.logout = function () {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future_1.Future.createFailedFuture("AppContext::loginDirectly", "User is already logged out");
        }
        var result = SessionService_1.SessionService.deleteSession(this.sessionContextTry.success);
        result.onComplete(function (deleteSessionTry) {
            if (deleteSessionTry.isFailure) {
                Log_1.Log.error('Error while logging out: ' + ObjUtil_1.ObjUtil.formatRecAttr(deleteSessionTry.failure));
            }
        });
        this.setAppContextStateToLoggedOut();
        return result;
    };
    AppContext.prototype.performLaunchAction = function (launchAction) {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future_1.Future.createFailedFuture("AppContext::performLaunchAction", "User is logged out");
        }
        return this.performLaunchActionOnline(launchAction, this.sessionContextTry.success);
    };
    AppContext.prototype.refreshContext = function (sessionContext, deviceProps) {
        var _this = this;
        if (deviceProps === void 0) { deviceProps = []; }
        var appContextValuesFr = this.finalizeContext(sessionContext, deviceProps);
        return appContextValuesFr.bind(function (appContextValues) {
            _this.setAppContextStateToLoggedIn(appContextValues);
            return Future_1.Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
        });
    };
    Object.defineProperty(AppContext.prototype, "sessionContextTry", {
        get: function () {
            return this._sessionContextTry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "tenantSettingsTry", {
        get: function () {
            return this._tenantSettingsTry;
        },
        enumerable: true,
        configurable: true
    });
    AppContext.prototype.finalizeContext = function (sessionContext, deviceProps) {
        var devicePropName = "com.catavolt.session.property.DeviceProperties";
        return SessionService_1.SessionService.setSessionListProperty(devicePropName, deviceProps, sessionContext).bind(function (setPropertyListResult) {
            var listPropName = "com.catavolt.session.property.TenantProperties";
            return SessionService_1.SessionService.getSessionListProperty(listPropName, sessionContext).bind(function (listPropertyResult) {
                return WorkbenchService_1.WorkbenchService.getAppWinDef(sessionContext).bind(function (appWinDef) {
                    return Future_1.Future.createSuccessfulFuture("AppContextCore:loginFromSystemContext", new AppContextValues(sessionContext, appWinDef, listPropertyResult.valuesAsDictionary()));
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
        var sessionContextFuture = SessionService_1.SessionService.createSession(tenantId, userId, password, clientType, systemContext);
        return sessionContextFuture.bind(function (sessionContext) {
            return _this.finalizeContext(sessionContext, deviceProps);
        });
    };
    AppContext.prototype.newSystemContextFr = function (gatewayHost, tenantId) {
        var serviceEndpoint = GatewayService_1.GatewayService.getServiceEndpoint(tenantId, 'soi-json', gatewayHost);
        return serviceEndpoint.map(function (serviceEndpoint) {
            return new SystemContextImpl_1.SystemContextImpl(serviceEndpoint.serverAssignment);
        });
    };
    AppContext.prototype.performLaunchActionOnline = function (launchAction, sessionContext) {
        var redirFr = WorkbenchService_1.WorkbenchService.performLaunchAction(launchAction.id, launchAction.workbenchId, sessionContext);
        return redirFr.bind(function (r) {
            return NavRequest_1.NavRequestUtil.fromRedirection(r, launchAction, sessionContext);
        });
    };
    AppContext.prototype.setAppContextStateToLoggedIn = function (appContextValues) {
        this._appWinDefTry = new Success_1.Success(appContextValues.appWinDef);
        this._tenantSettingsTry = new Success_1.Success(appContextValues.tenantSettings);
        this._sessionContextTry = new Success_1.Success(appContextValues.sessionContext);
        this._appContextState = AppContextState.LOGGED_IN;
    };
    AppContext.prototype.setAppContextStateToLoggedOut = function () {
        this._appWinDefTry = new Failure_1.Failure("Not logged in");
        this._tenantSettingsTry = new Failure_1.Failure('Not logged in"');
        this._sessionContextTry = new Failure_1.Failure('Not loggged in');
        this._appContextState = AppContextState.LOGGED_OUT;
    };
    AppContext.ONE_DAY_IN_MILLIS = 60 * 60 * 24 * 1000;
    return AppContext;
})();
exports.AppContext = AppContext;
