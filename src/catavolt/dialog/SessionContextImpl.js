/**
 * Created by rburson on 3/9/15.
 */
var DialogTriple_1 = require("./DialogTriple");
var OType_1 = require("./OType");
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
        var sessionContextTry = DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObject, 'WSCreateSessionResult', OType_1.OType.factoryFn);
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
        get: function () {
            return this._clientType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "gatewayHost", {
        get: function () {
            return this._gatewayHost;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "isLocalSession", {
        get: function () {
            return !this._remoteSession;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "isRemoteSession", {
        get: function () {
            return this._remoteSession;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "password", {
        get: function () {
            return this._password;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "tenantId", {
        get: function () {
            return this._tenantId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "userId", {
        get: function () {
            return this._userId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionContextImpl.prototype, "online", {
        set: function (online) {
            this._remoteSession = online;
        },
        enumerable: true,
        configurable: true
    });
    return SessionContextImpl;
})();
exports.SessionContextImpl = SessionContextImpl;
