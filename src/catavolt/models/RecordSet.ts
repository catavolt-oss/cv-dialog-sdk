import { Record } from './Record';

export interface RecordSet {
    hasMore: boolean;
    records: Record[];
}
