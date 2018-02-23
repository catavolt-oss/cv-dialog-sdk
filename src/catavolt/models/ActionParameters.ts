import {Record} from "./Record";

/** ************************** Subclasses *******************************************************/

export interface ActionParameters {

    readonly pendingWrites?: Record;
    readonly targets?: string[];
    readonly type: string;

}
