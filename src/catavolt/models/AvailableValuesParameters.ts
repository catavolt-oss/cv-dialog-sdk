import { Record } from './Record';

export interface AvailableValuesParameters {
    readonly pendingWrites?: Record;
    readonly type: string;
}
