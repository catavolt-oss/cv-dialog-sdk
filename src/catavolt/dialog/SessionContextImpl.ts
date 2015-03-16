/**
 * Created by rburson on 3/9/15.
 */

///<reference path="../fp/references.ts"/>
///<reference path="../ws/references.ts"/>

module catavolt.dialog {

    export class SessionContextImpl implements SessionContext{

        private _clientType: string;
        private _gatewayHost: string;
        private _password: string;
        private _remoteSession: boolean;
        private _tenantId: string;
        private _userId: string;

        currentDivision: string;
        serverVersion: string;
        sessionHandle: string;
        systemContext: SystemContext;
        userName: string;

        static fromWSCreateSessionResult(jsonObject: {[id: string]: any},
                                          systemContext: SystemContext): Try<SessionContext> {

            return DialogTriple.extractValue(jsonObject, "WSCreateSessionResult",
                ()=>{
                    return new Success(new SessionContextImpl(
                        jsonObject['sessionHandle'],
                        jsonObject['userName'],
                        jsonObject['currentDivision'],
                        jsonObject['serverVersion'],
                        systemContext));
                }
            );
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

        set online(online: boolean) {
            this._remoteSession = online;
        }

    }

}
