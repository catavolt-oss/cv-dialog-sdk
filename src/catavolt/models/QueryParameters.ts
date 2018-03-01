import { QueryDirection } from './types';

/**
 * ************* Property Formatting ********************
 */

export interface QueryParameters {
    fetchDirection: QueryDirection;
    fetchMaxRecords: number;
    fromRecordId?: string;
    type: string;
}
