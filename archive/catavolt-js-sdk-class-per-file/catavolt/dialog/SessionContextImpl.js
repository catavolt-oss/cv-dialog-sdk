/**
 * Created by rburson on 3/9/15.
 */
import { DialogTriple } from "./DialogTriple";
import { OType } from "./OType";
export class SessionContextImpl {
    constructor(sessionHandle, userName, currentDivision, serverVersion, systemContext) {
        this.sessionHandle = sessionHandle;
        this.userName = userName;
        this.currentDivision = currentDivision;
        this.serverVersion = serverVersion;
        this.systemContext = systemContext;
        this._remoteSession = true;
    }
    static fromWSCreateSessionResult(jsonObject, systemContext) {
        var sessionContextTry = DialogTriple.fromWSDialogObject(jsonObject, 'WSCreateSessionResult', OType.factoryFn);
        return sessionContextTry.map((sessionContext) => {
            sessionContext.systemContext = systemContext;
            return sessionContext;
        });
    }
    static createSessionContext(gatewayHost, tenantId, clientType, userId, password) {
        var sessionContext = new SessionContextImpl(null, userId, "", null, null);
        sessionContext._gatewayHost = gatewayHost;
        sessionContext._tenantId = tenantId;
        sessionContext._clientType = clientType;
        sessionContext._userId = userId;
        sessionContext._password = password;
        sessionContext._remoteSession = false;
        return sessionContext;
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
    set online(online) {
        this._remoteSession = online;
    }
}
