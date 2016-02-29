/**
 * Created by rburson on 3/9/15.
 */
import { Future } from "../fp/Future";
import { Call } from "../ws/Request";
import { SessionContextImpl } from "./SessionContextImpl";
import { OType } from "./OType";
import { DialogTriple } from "./DialogTriple";
export class SessionService {
    static createSession(tenantId, userId, password, clientType, systemContext) {
        var method = "createSessionDirectly";
        var params = {
            'tenantId': tenantId,
            'userId': userId,
            'password': password,
            'clientType': clientType
        };
        var call = Call.createCallWithoutSession(SessionService.SERVICE_PATH, method, params, systemContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture("createSession/extractSessionContextFromResponse", SessionContextImpl.fromWSCreateSessionResult(result, systemContext));
        });
    }
    static deleteSession(sessionContext) {
        var method = "deleteSession";
        var params = {
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createSuccessfulFuture("deleteSession/extractVoidResultFromResponse", result);
        });
    }
    static getSessionListProperty(propertyName, sessionContext) {
        var method = "getSessionListProperty";
        var params = {
            'propertyName': propertyName,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture("getSessionListProperty/extractResultFromResponse", DialogTriple.fromWSDialogObject(result, 'WSGetSessionListPropertyResult', OType.factoryFn));
        });
    }
    static setSessionListProperty(propertyName, listProperty, sessionContext) {
        var method = "setSessionListProperty";
        var params = {
            'propertyName': propertyName,
            'listProperty': listProperty,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createSuccessfulFuture("setSessionListProperty/extractVoidResultFromResponse", result);
        });
    }
}
SessionService.SERVICE_NAME = "SessionService";
SessionService.SERVICE_PATH = "soi-json-v02/" + SessionService.SERVICE_NAME;
