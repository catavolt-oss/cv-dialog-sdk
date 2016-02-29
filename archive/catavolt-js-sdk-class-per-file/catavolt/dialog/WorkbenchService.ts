/**
 * Created by rburson on 3/17/15.
 */

import {SessionContext} from "../ws/SessionContext";
import {Future} from "../fp/Future";
import {AppWinDef} from "./AppWinDef";
import {StringDictionary} from "../util/Types";
import {Call} from "../ws/Request";
import {DialogTriple} from "./DialogTriple";
import {OType} from "./OType";
import {Workbench} from "./Workbench";
import {Redirection} from "./Redirection";

export class WorkbenchService {

    private static SERVICE_NAME = "WorkbenchService";
    private static SERVICE_PATH = "soi-json-v02/" + WorkbenchService.SERVICE_NAME;

    static getAppWinDef(sessionContext:SessionContext):Future<AppWinDef> {

        var method:string = "getApplicationWindowDef";
        var params:StringDictionary = {'sessionHandle': sessionContext.sessionHandle};
        var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(
            (result:StringDictionary)=> {
                return Future.createCompletedFuture("createSession/extractAppWinDefFromResult",
                    DialogTriple.fromWSDialogObjectResult<AppWinDef>(result, 'WSApplicationWindowDefResult',
                        'WSApplicationWindowDef', 'applicationWindowDef', OType.factoryFn)
                );
            }
        );
    }

    static getWorkbench(sessionContext:SessionContext, workbenchId:string):Future<Workbench> {

        var method = "getWorkbench";
        var params:StringDictionary = {
            'sessionHandle': sessionContext.sessionHandle,
            'workbenchId': workbenchId
        };
        var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind<Workbench>(
            (result:StringDictionary)=> {
                return Future.createCompletedFuture<Workbench>("getWorkbench/extractObject",
                    DialogTriple.fromWSDialogObjectResult<Workbench>(result, 'WSWorkbenchResult', 'WSWorkbench',
                        'workbench', OType.factoryFn));
            }
        );

    }

    static performLaunchAction(actionId:string,
                               workbenchId:string,
                               sessionContext:SessionContext):Future<Redirection> {

        var method = "performLaunchAction";
        var params:StringDictionary = {
            'actionId': actionId,
            'workbenchId': workbenchId,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(
            (result:StringDictionary)=> {
                return Future.createCompletedFuture("performLaunchAction/extractRedirection",
                    DialogTriple.fromWSDialogObject<Redirection>(result['redirection'], 'WSRedirection', OType.factoryFn)
                );
            }
        );
    }
}
