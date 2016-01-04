/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var SessionService = (function () {
            function SessionService() {
            }
            SessionService.createSession = function (tenantId, userId, password, clientType, systemContext) {
                var method = "createSessionDirectly";
                var params = { 'tenantId': tenantId, 'userId': userId, 'password': password, 'clientType': clientType };
                var call = Call.createCallWithoutSession(SessionService.SERVICE_PATH, method, params, systemContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("createSession/extractSessionContextFromResponse", dialog.SessionContextImpl.fromWSCreateSessionResult(result, systemContext));
                });
            };
            SessionService.deleteSession = function (sessionContext) {
                var method = "deleteSession";
                var params = {
                    'sessionHandle': sessionContext.sessionHandle
                };
                var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createSuccessfulFuture("deleteSession/extractVoidResultFromResponse", result);
                });
            };
            SessionService.getSessionListProperty = function (propertyName, sessionContext) {
                var method = "getSessionListProperty";
                var params = {
                    'propertyName': propertyName,
                    'sessionHandle': sessionContext.sessionHandle
                };
                var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("getSessionListProperty/extractResultFromResponse", dialog.DialogTriple.fromWSDialogObject(result, 'WSGetSessionListPropertyResult', dialog.OType.factoryFn));
                });
            };
            SessionService.setSessionListProperty = function (propertyName, listProperty, sessionContext) {
                var method = "setSessionListProperty";
                var params = {
                    'propertyName': propertyName,
                    'listProperty': listProperty,
                    'sessionHandle': sessionContext.sessionHandle
                };
                var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createSuccessfulFuture("setSessionListProperty/extractVoidResultFromResponse", result);
                });
            };
            SessionService.SERVICE_NAME = "SessionService";
            SessionService.SERVICE_PATH = "soi-json-v02/" + SessionService.SERVICE_NAME;
            return SessionService;
        })();
        dialog.SessionService = SessionService;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
