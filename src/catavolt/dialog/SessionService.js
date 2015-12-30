/**
 * Created by rburson on 3/9/15.
 */
var Future_1 = require("../fp/Future");
var Request_1 = require("../ws/Request");
var SessionContextImpl_1 = require("./SessionContextImpl");
var OType_1 = require("./OType");
var DialogTriple_1 = require("./DialogTriple");
var SessionService = (function () {
    function SessionService() {
    }
    SessionService.createSession = function (tenantId, userId, password, clientType, systemContext) {
        var method = "createSessionDirectly";
        var params = {
            'tenantId': tenantId,
            'userId': userId,
            'password': password,
            'clientType': clientType
        };
        var call = Request_1.Call.createCallWithoutSession(SessionService.SERVICE_PATH, method, params, systemContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture("createSession/extractSessionContextFromResponse", SessionContextImpl_1.SessionContextImpl.fromWSCreateSessionResult(result, systemContext));
        });
    };
    SessionService.deleteSession = function (sessionContext) {
        var method = "deleteSession";
        var params = {
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Request_1.Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createSuccessfulFuture("deleteSession/extractVoidResultFromResponse", result);
        });
    };
    SessionService.getSessionListProperty = function (propertyName, sessionContext) {
        var method = "getSessionListProperty";
        var params = {
            'propertyName': propertyName,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Request_1.Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture("getSessionListProperty/extractResultFromResponse", DialogTriple_1.DialogTriple.fromWSDialogObject(result, 'WSGetSessionListPropertyResult', OType_1.OType.factoryFn));
        });
    };
    SessionService.setSessionListProperty = function (propertyName, listProperty, sessionContext) {
        var method = "setSessionListProperty";
        var params = {
            'propertyName': propertyName,
            'listProperty': listProperty,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Request_1.Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createSuccessfulFuture("setSessionListProperty/extractVoidResultFromResponse", result);
        });
    };
    SessionService.SERVICE_NAME = "SessionService";
    SessionService.SERVICE_PATH = "soi-json-v02/" + SessionService.SERVICE_NAME;
    return SessionService;
})();
exports.SessionService = SessionService;
