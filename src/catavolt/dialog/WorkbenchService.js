/**
 * Created by rburson on 3/17/15.
 */
var Future_1 = require("../fp/Future");
var Request_1 = require("../ws/Request");
var DialogTriple_1 = require("./DialogTriple");
var OType_1 = require("./OType");
var WorkbenchService = (function () {
    function WorkbenchService() {
    }
    WorkbenchService.getAppWinDef = function (sessionContext) {
        var method = "getApplicationWindowDef";
        var params = { 'sessionHandle': sessionContext.sessionHandle };
        var call = Request_1.Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture("createSession/extractAppWinDefFromResult", DialogTriple_1.DialogTriple.fromWSDialogObjectResult(result, 'WSApplicationWindowDefResult', 'WSApplicationWindowDef', 'applicationWindowDef', OType_1.OType.factoryFn));
        });
    };
    WorkbenchService.getWorkbench = function (sessionContext, workbenchId) {
        var method = "getWorkbench";
        var params = {
            'sessionHandle': sessionContext.sessionHandle,
            'workbenchId': workbenchId
        };
        var call = Request_1.Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture("getWorkbench/extractObject", DialogTriple_1.DialogTriple.fromWSDialogObjectResult(result, 'WSWorkbenchResult', 'WSWorkbench', 'workbench', OType_1.OType.factoryFn));
        });
    };
    WorkbenchService.performLaunchAction = function (actionId, workbenchId, sessionContext) {
        var method = "performLaunchAction";
        var params = {
            'actionId': actionId,
            'workbenchId': workbenchId,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Request_1.Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(function (result) {
            return Future_1.Future.createCompletedFuture("performLaunchAction/extractRedirection", DialogTriple_1.DialogTriple.fromWSDialogObject(result['redirection'], 'WSRedirection', OType_1.OType.factoryFn));
        });
    };
    WorkbenchService.SERVICE_NAME = "WorkbenchService";
    WorkbenchService.SERVICE_PATH = "soi-json-v02/" + WorkbenchService.SERVICE_NAME;
    return WorkbenchService;
})();
exports.WorkbenchService = WorkbenchService;
