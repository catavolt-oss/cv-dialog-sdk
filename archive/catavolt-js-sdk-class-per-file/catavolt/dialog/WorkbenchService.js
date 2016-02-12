/**
 * Created by rburson on 3/17/15.
 */
import { Future } from "../fp/Future";
import { Call } from "../ws/Request";
import { DialogTriple } from "./DialogTriple";
import { OType } from "./OType";
export class WorkbenchService {
    static getAppWinDef(sessionContext) {
        var method = "getApplicationWindowDef";
        var params = { 'sessionHandle': sessionContext.sessionHandle };
        var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture("createSession/extractAppWinDefFromResult", DialogTriple.fromWSDialogObjectResult(result, 'WSApplicationWindowDefResult', 'WSApplicationWindowDef', 'applicationWindowDef', OType.factoryFn));
        });
    }
    static getWorkbench(sessionContext, workbenchId) {
        var method = "getWorkbench";
        var params = {
            'sessionHandle': sessionContext.sessionHandle,
            'workbenchId': workbenchId
        };
        var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture("getWorkbench/extractObject", DialogTriple.fromWSDialogObjectResult(result, 'WSWorkbenchResult', 'WSWorkbench', 'workbench', OType.factoryFn));
        });
    }
    static performLaunchAction(actionId, workbenchId, sessionContext) {
        var method = "performLaunchAction";
        var params = {
            'actionId': actionId,
            'workbenchId': workbenchId,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture("performLaunchAction/extractRedirection", DialogTriple.fromWSDialogObject(result['redirection'], 'WSRedirection', OType.factoryFn));
        });
    }
}
WorkbenchService.SERVICE_NAME = "WorkbenchService";
WorkbenchService.SERVICE_PATH = "soi-json-v02/" + WorkbenchService.SERVICE_NAME;
//# sourceMappingURL=WorkbenchService.js.map