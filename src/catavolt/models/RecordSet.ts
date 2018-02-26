import { Record } from './Record';

export interface RecordSet {
    defaultActionId: string;
    hasMore: boolean;
    records: Record[];
}
