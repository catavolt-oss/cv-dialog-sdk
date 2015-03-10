/**
 * Created by rburson on 3/9/15.
 */

module catavolt.ws {

    export interface SessionContext {
        currentDivision: string;
        isRemoteSession: boolean;
        isLocalSession: boolean;
        serverVersion: string;
        sessionHandle: string;
        systemContext: SystemContext;
        userName: string;
    }

}
