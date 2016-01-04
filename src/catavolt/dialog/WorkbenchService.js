/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var WorkbenchService = (function () {
            function WorkbenchService() {
            }
            WorkbenchService.getAppWinDef = function (sessionContext) {
                var method = "getApplicationWindowDef";
                var params = { 'sessionHandle': sessionContext.sessionHandle };
                var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("createSession/extractAppWinDefFromResult", dialog.DialogTriple.fromWSDialogObjectResult(result, 'WSApplicationWindowDefResult', 'WSApplicationWindowDef', 'applicationWindowDef', dialog.OType.factoryFn));
                });
            };
            WorkbenchService.getWorkbench = function (sessionContext, workbenchId) {
                var method = "getWorkbench";
                var params = {
                    'sessionHandle': sessionContext.sessionHandle,
                    'workbenchId': workbenchId
                };
                var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("getWorkbench/extractObject", dialog.DialogTriple.fromWSDialogObjectResult(result, 'WSWorkbenchResult', 'WSWorkbench', 'workbench', dialog.OType.factoryFn));
                });
            };
            WorkbenchService.performLaunchAction = function (actionId, workbenchId, sessionContext) {
                var method = "performLaunchAction";
                var params = {
                    'actionId': actionId,
                    'workbenchId': workbenchId,
                    'sessionHandle': sessionContext.sessionHandle
                };
                var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("performLaunchAction/extractRedirection", dialog.DialogTriple.fromWSDialogObject(result['redirection'], 'WSRedirection', dialog.OType.factoryFn));
                });
            };
            WorkbenchService.SERVICE_NAME = "WorkbenchService";
            WorkbenchService.SERVICE_PATH = "soi-json-v02/" + WorkbenchService.SERVICE_NAME;
            return WorkbenchService;
        })();
        dialog.WorkbenchService = WorkbenchService;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
