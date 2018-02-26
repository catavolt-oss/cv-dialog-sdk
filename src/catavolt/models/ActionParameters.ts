import {Record} from "./Record";

export interface ActionParameters {

    readonly pendingWrites?: Record;
    readonly targets?: string[];
    readonly type: string;

}
