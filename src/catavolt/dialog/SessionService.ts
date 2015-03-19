/**
 * Created by rburson on 3/9/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class SessionService {

        private static SERVICE_NAME = "SessionService";
        private static SERVICE_PATH = "soi-json-v02/" + SessionService.SERVICE_NAME;

        static createSession(tenantId:string,
                             userId:string,
                             password:string,
                             clientType:string,
                             systemContext: SystemContext): Future<SessionContext> {

           var method = "createSessionDirectly";

            var params:StringDictionary = {'tenantId':tenantId, 'userId':userId, 'password':password, 'clientType':clientType};
            var call = Call.createCallWithoutSession(SessionService.SERVICE_PATH, method, params, systemContext);

            return call.perform().bind(
                (result:StringDictionary)=>{
                    return Future.createCompletedFuture("createSession/extractSessionContextFromResponse",
                        SessionContextImpl.fromWSCreateSessionResult(result, systemContext));
                 }
            );

        }

        static getSessionListProperty(propertyName:string, sessionContext:SessionContext): Future<XGetSessionListPropertyResult> {

            var method = "getSessionListProperty";
            var params:StringDictionary = {
                'propertyName':propertyName,
                'sessionHandle':sessionContext.sessionHandle
            };
            var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind(
                (result:StringDictionary)=>{
                    return Future.createCompletedFuture<XGetSessionListPropertyResult>("getSessionListProperty/extractResultFromResponse",
                        XGetSessionListPropertyResult.fromWSGetSessionListPropertyResult(result));
                }
            );
        }

        static setSessionListProperty(propertyName:string,
                                      listProperty:Array<string>,
                                      sessionContext:SessionContext): Future<VoidResult> {

            var method = "setSessionListProperty";
            var params:StringDictionary = {
                'propertyName':propertyName,
                'listProperty':listProperty,
                'sessionHandle':sessionContext.sessionHandle
            };
            var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
            return call.perform().bind(
                (result:StringDictionary)=>{
                    return Future.createSuccessfulFuture<VoidResult>("setSessionListProperty/extractVoidResultFromResponse", result);
                }
            );
        }
    }
}
