import { ReferringObject } from './ReferringObject';
import { RedirectionType } from './types';

export interface Redirection {
    readonly id: string;
    readonly referringObject: ReferringObject;
    readonly refreshNeeded:boolean;
    readonly sessionId: string;
    readonly tenantId: string;
    readonly type: RedirectionType;
}
