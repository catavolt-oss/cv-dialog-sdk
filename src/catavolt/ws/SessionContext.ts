/**
 * Created by rburson on 3/9/15.
 */

///<reference path="references.ts"/>

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
