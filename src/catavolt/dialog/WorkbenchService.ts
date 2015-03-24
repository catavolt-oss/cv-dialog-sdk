/**
 * Created by rburson on 3/17/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class WorkbenchService {

        private static SERVICE_NAME = "WorkbenchService";
        private static SERVICE_PATH = "soi-json-v02/" + WorkbenchService.SERVICE_NAME;

        static getAppWinDef(sessionContext:SessionContext): Future<AppWinDef> {

            var method:string = "getApplicationWindowDef";
            var params:StringDictionary = { 'sessionHandle':sessionContext.sessionHandle };
            var call =  Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind(
                (result:StringDictionary)=>{
                    return Future.createCompletedFuture("createSession/extractAppWinDefFromResult",
                        DialogTriple.fromWSDialogObjectResult<AppWinDef>(result, 'WSApplicationWindowDefResult',
                            'WSApplicationWindowDef', 'applicationWindowDef', OType.factoryFn)
                    );
                }
            );
        }
    }
}