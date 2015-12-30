/**
 * Created by rburson on 3/9/15.
 */

import {SystemContext} from './SystemContext';

export interface SessionContext {
    currentDivision: string;
    isRemoteSession: boolean;
    isLocalSession: boolean;
    serverVersion: string;
    sessionHandle: string;
    systemContext: SystemContext;
    userName: string;
}

