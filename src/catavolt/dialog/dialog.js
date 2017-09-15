"use strict";
/**
 * Created by rburson on 8/29/17.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var catavolt_1 = require("../../catavolt");
/**
 * Top-level entry point into the Catavolt API
 */
var AppContext = (function () {
    /**
     * Construct an AppContext
     * This should not be called directly, instead use the 'singleton' method
     * @private
     */
    function AppContext() {
        this.lastMaintenanceTime = new Date(0);
        if (AppContext._singleton) {
            throw new Error("Singleton instance already created");
        }
        this._devicePropsStatic = {};
        this._devicePropsDynamic = {};
        AppContext._singleton = this;
    }
    Object.defineProperty(AppContext, "defaultTTLInMillis", {
        /*  *******
            Statics
            ******* */
        get: function () {
            return AppContext.ONE_HOUR_IN_MILLIS;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext, "singleton", {
        /**
         * Get the singleton instance of the AppContext
         * @returns {AppContext}
         */
        get: function () {
            if (!AppContext._singleton) {
                AppContext._singleton = new AppContext();
            }
            return AppContext._singleton;
        },
        enumerable: true,
        configurable: true
    });
    /*  **********
        Public Ops
        ********** */
    /**
     * Add or replace a dynamic device property (func)
     * @param propName
     * @param propFn
     */
    AppContext.prototype.addDynamicDeviceProp = function (propName, propFn) {
        this._devicePropsDynamic[propName] = propFn;
    };
    /**
     * Add or replace a static device property
     *
     * @param propName
     * @param propValue
     */
    AppContext.prototype.addStaticDeviceProp = function (propName, propValue) {
        this._devicePropsStatic[propName] = propValue;
    };
    Object.defineProperty(AppContext.prototype, "deviceProps", {
        /**
         * Get the device props
         * @returns {{[p: string]: string}}
         */
        get: function () {
            var newProps = catavolt_1.ObjUtil.addAllProps(this._devicePropsStatic, {});
            for (var attr in this._devicePropsDynamic) {
                newProps[attr] = this._devicePropsDynamic[attr]();
            }
            return newProps;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "dialogApi", {
        get: function () {
            return this._dialogApi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "isLoggedIn", {
        /**
         * Check for the availability of the given featureSet
         * @see FeatureSet
         * @param featureSet
         * @returns {any}
         */
        /*
        isFeatureSetAvailable(featureSet:FeatureSet):boolean {
            try {
                const currentVersion = AppVersion.getAppVersion(this.sessionContextTry.success.systemContext.appVersion);
                const featureMinimumVersion = FeatureVersionMap[featureSet];
                return featureMinimumVersion.isLessThanOrEqualTo(currentVersion);
            } catch(error) {
                Log.error('Failed to compare appVersions for feature ' + featureSet);
                Log.error(error);
                return false;
            }
        }
        */
        /**
         * Checked logged in status
         * @returns {boolean}
         */
        get: function () {
            return !!this._session;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "session", {
        /**
         * Get the json representation of this client's locale.  The server pulls this value from the agent string
         * and returns it to the client.
         * @returns {string}
         */
        /*
        get browserLocaleJson():string {
            if(this.tenantSettingsTry.isSuccess) {
                // Added in server version 1.3.462
                return this.tenantSettingsTry.success['browserLocale'];
            } else {
                return null;
            }
        }*/
        /**
         * Get the number of millis that the client will remain active between calls
         * to the server.
         * @returns {number}
         */
        /*
        get clientTimeoutMillis():number {
            if(this.tenantSettingsTry.isSuccess) {
                const mins = this.tenantSettingsTry.success['clientTimeoutMinutes'];
                return mins ? (Number(mins) * 60 * 1000) : AppContext.defaultTTLInMillis;
            } else {
                return AppContext.defaultTTLInMillis;
            }
        }*/
        /**
         * Get the currency symbol override if defined from the server.
         * @returns {string}
         */
        /*
        get currencySymbol():string {
            const cs = this.tenantSettingsTry.isSuccess ? this.tenantSettingsTry.success['currencySymbol'] : null;
            return typeof cs === 'string' && cs.length == 0 ? null : cs;
        }
        */
        /**
         * Time remaining before this session is expired by the server
         * @returns {number}
         */
        /*@TODO
        get remainingSessionTime():number {
            return this.clientTimeoutMillis - ((new Date()).getTime() - Call.lastSuccessfulActivityTime.getTime());
        }*/
        get: function () {
            return this._session;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return whether or not the session has expired
     * @returns {boolean}
     */
    /*@TODO
    get sessionHasExpired():boolean {
        return this.remainingSessionTime < 0;
    }
    */
    /**
     * Open a {@link WorkbenchLaunchAction} expecting a Redirection
     * @param launchAction
     * @returns {Future<Redirection>}
     */
    /*
    @TODO
    getRedirForLaunchAction(workbenchActionDef:WorkbenchActionDef):Promise<Redirection> {
    }
    */
    /**
     * Get a Workbench by workbenchId
     * @param sessionContext
     * @param workbenchId
     * @returns {Future<Workbench>}
     */
    /*
    getWorkbench(workbenchId:string):Promise<Workbench> {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future.createFailedFuture<Workbench>("AppContext::getWorkbench", "User is logged out");
        }
        return WorkbenchService.getWorkbench(sessionContext, workbenchId);
    }*/
    /**
     * Log in and retrieve the Session
     *
     * @param tenantId
     * @param clientType
     * @param userId
     * @param password
     * @param serverUrl
     * @param serverVersion
     * @returns {any}
     */
    AppContext.prototype.login = function (tenantId, clientType, userId, password, serverUrl, serverVersion) {
        var _this = this;
        if (serverUrl === void 0) { serverUrl = AppContext.SERVER_URL; }
        if (serverVersion === void 0) { serverVersion = AppContext.SERVER_VERSION; }
        this._dialogApi = new DialogService(false, serverVersion, new catavolt_1.FetchClient(), serverUrl);
        if (this.isLoggedIn) {
            return Promise.reject(new Error('User is already logged in'));
        }
        var login = {
            userId: userId,
            password: password,
            clientType: clientType,
            deviceProperties: this.deviceProps
        };
        return this.dialogApi.createSession(tenantId, login).then(function (result) {
            if (result.hasOwnProperty('redirectionType')) {
                //it's a Redirection
                return result;
            }
            else {
                _this._session = result;
                return result;
            }
        });
    };
    /**
     * Logout and destroy the session
     * @returns {sessionId:string}
     */
    AppContext.prototype.logout = function () {
        var _this = this;
        if (!this.isLoggedIn) {
            return Promise.reject('User is already logged out');
        }
        return this.dialogApi.deleteSession(this.session.tenantId, this.session.id).then(function (result) {
            _this._session = null;
            return result;
        });
    };
    AppContext.ONE_HOUR_IN_MILLIS = 60 * 60 * 1000;
    //defaults
    AppContext.SERVER_URL = 'https://dialog.hxgn-api.net';
    AppContext.SERVER_VERSION = 'v0';
    return AppContext;
}());
exports.AppContext = AppContext;
var DialogService = (function () {
    function DialogService(offline, apiVersion, client, serverUrl) {
        if (offline === void 0) { offline = false; }
        if (apiVersion === void 0) { apiVersion = 'v0'; }
        if (serverUrl === void 0) { serverUrl = DialogService.SERVER; }
        this.apiVersion = apiVersion;
        this.client = client || catavolt_1.ClientFactory.getClient(offline ? catavolt_1.ClientMode.OFFLINE : catavolt_1.ClientMode.REMOTE);
        this.baseUrl = serverUrl + "/" + apiVersion;
    }
    DialogService.prototype.getTenants = function () {
        return this.get('tenants').then(function (jsonClientResponse) { return (new DialogServiceResponse(jsonClientResponse)).responseValue(); });
    };
    DialogService.prototype.getSessions = function (tenantId) {
        return this.get("tenants/" + tenantId + "/sessions").then(function (jsonClientResponse) { return (new DialogServiceResponse(jsonClientResponse)).responseValue(); });
    };
    DialogService.prototype.createSession = function (tenantId, login) {
        return this.post("tenants/" + tenantId + "/sessions", login).then(function (jsonClientResponse) { return (new DialogServiceResponse(jsonClientResponse)).responseValueOrRedirect(); });
    };
    DialogService.prototype.getSession = function (tenantId, sessionId) {
        return this.get("tenants/" + tenantId + "/sessions/" + sessionId).then(function (jsonClientResponse) { return (new DialogServiceResponse(jsonClientResponse)).responseValue(); });
    };
    DialogService.prototype.deleteSession = function (tenantId, sessionId) {
        return this.delete("tenants/" + tenantId + "/sessions/" + sessionId).then(function (jsonClientResponse) { return (new DialogServiceResponse(jsonClientResponse)).responseValue(); });
    };
    DialogService.prototype.getWorkbenches = function (tenantId, sessionId) {
        return this.get("tenants/" + tenantId + "/sessions/" + sessionId + "/workbenches").then(function (jsonClientResponse) { return (new DialogServiceResponse(jsonClientResponse)).responseValue(); });
    };
    DialogService.prototype.getWorkbench = function (tenantId, sessionId, workbenchId) {
        return this.get("tenants/{$tenantId}/sessions/{$sessionId}/workbenches/{$workbenchId}").then(function (jsonClientResponse) { return (new DialogServiceResponse(jsonClientResponse)).responseValue(); });
    };
    /* Private methods */
    DialogService.prototype.get = function (path) {
        return this.client.getJson(DialogService.SERVER + "/" + this.apiVersion, path);
    };
    DialogService.prototype.post = function (path, body) {
        return this.client.postJson(DialogService.SERVER + "/" + this.apiVersion, path, body);
    };
    DialogService.prototype.delete = function (path) {
        return this.client.deleteJson(DialogService.SERVER + "/" + this.apiVersion, path);
    };
    DialogService.prototype.put = function (path, body) {
        return this.client.putJson(DialogService.SERVER + "/" + this.apiVersion, path, body);
    };
    DialogService.SERVER = 'https://dialog.hxgn-api.net';
    return DialogService;
}());
exports.DialogService = DialogService;
var DialogServiceResponse = (function () {
    function DialogServiceResponse(clientResponse) {
        this.clientResponse = clientResponse;
    }
    DialogServiceResponse.prototype.responseValue = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.hasMessage) {
                reject(_this.clientResponse.value);
            }
            else {
                resolve(_this.clientResponse.value);
            }
        });
    };
    DialogServiceResponse.prototype.responseValueOrRedirect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.hasMessage) {
                reject(_this.clientResponse.value);
            }
            else if (_this.hasValue) {
                resolve(_this.clientResponse.value);
            }
            else {
                resolve(_this.clientResponse.value);
            }
        });
    };
    DialogServiceResponse.prototype.assertNoError = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.hasMessage) {
                reject(_this.clientResponse.value);
            }
            else {
                resolve(undefined);
            }
        });
    };
    Object.defineProperty(DialogServiceResponse.prototype, "hasValue", {
        get: function () {
            return this.clientResponse.statusCode >= 200 && this.clientResponse.statusCode < 300;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogServiceResponse.prototype, "hasRedirection", {
        get: function () {
            return this.clientResponse.statusCode >= 300 && this.clientResponse.statusCode < 400;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogServiceResponse.prototype, "hasMessage", {
        get: function () {
            return this.clientResponse.statusCode >= 400;
        },
        enumerable: true,
        configurable: true
    });
    return DialogServiceResponse;
}());
exports.DialogServiceResponse = DialogServiceResponse;
/* Begin Feature Versioning */
var AppVersion = (function () {
    function AppVersion(major, minor, patch) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }
    AppVersion.getAppVersion = function (versionString) {
        var _a = versionString.split('.'), major = _a[0], minor = _a[1], patch = _a[2];
        return new AppVersion(Number(major || 0), Number(minor || 0), Number(patch || 0));
    };
    /**
     * Is 'this' version less than or equal to the supplied version?
     * @param anotherVersion - the version to compare to 'this' version
     * @returns {boolean}
     */
    AppVersion.prototype.isLessThanOrEqualTo = function (anotherVersion) {
        if (anotherVersion.major > this.major) {
            return true;
        }
        else if (anotherVersion.major == this.major) {
            if (anotherVersion.minor > this.minor) {
                return true;
            }
            else if (anotherVersion.minor == this.minor) {
                return anotherVersion.patch >= this.patch;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    return AppVersion;
}());
/* Map features to minimum app versions */
var FeatureVersionMap = {
    "View_Support": AppVersion.getAppVersion("1.3.447"),
    "Unified_Search": AppVersion.getAppVersion("1.3.463")
};
