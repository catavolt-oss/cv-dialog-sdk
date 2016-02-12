/**
 * Created by rburson on 3/9/15.
 */

import {SessionContext} from "../ws/SessionContext";
import {SystemContext} from "../ws/SystemContext";
import {Try} from "../fp/Try";
import {DialogTriple} from "./DialogTriple";
import {OType} from "./OType";

export class SessionContextImpl implements SessionContext {

    private _clientType:string;
    private _gatewayHost:string;
    private _password:string;
    private _remoteSession:boolean;
    private _tenantId:string;
    private _userId:string;

    currentDivision:string;
    serverVersion:string;
    sessionHandle:string;
    systemContext:SystemContext;
    userName:string;

    static fromWSCreateSessionResult(jsonObject:{[id: string]: any},
                                     systemContext:SystemContext):Try<SessionContext> {

        var sessionContextTry:Try<SessionContext> = DialogTriple.fromWSDialogObject<SessionContext>(jsonObject,
            'WSCreateSessionResult', OType.factoryFn);
        return sessionContextTry.map((sessionContext:SessionContext)=> {
            sessionContext.systemContext = systemContext;
            return sessionContext;
        });
    }

    static createSessionContext(gatewayHost:string,
                                tenantId:string,
                                clientType:string,
                                userId:string,
                                password:string):SessionContext {

        var sessionContext = new SessionContextImpl(null, userId, "", null, null);
        sessionContext._gatewayHost = gatewayHost;
        sessionContext._tenantId = tenantId;
        sessionContext._clientType = clientType;
        sessionContext._userId = userId;
        sessionContext._password = password;
        sessionContext._remoteSession = false;

        return sessionContext;
    }

    constructor(sessionHandle:string,
                userName:string,
                currentDivision:string,
                serverVersion:string,
                systemContext:SystemContext) {

        this.sessionHandle = sessionHandle;
        this.userName = userName;
        this.currentDivision = currentDivision;
        this.serverVersion = serverVersion;
        this.systemContext = systemContext;
        this._remoteSession = true;
    }

    get clientType() {
        return this._clientType;
    }

    get gatewayHost() {
        return this._gatewayHost;
    }

    get isLocalSession() {
        return !this._remoteSession;
    }

    get isRemoteSession() {
        return this._remoteSession;
    }

    get password() {
        return this._password;
    }

    get tenantId() {
        return this._tenantId;
    }

    get userId() {
        return this._userId;
    }

    set online(online:boolean) {
        this._remoteSession = online;
    }

}
