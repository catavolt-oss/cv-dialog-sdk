import {QueryDirection} from "./types";

/**
 * ************* Property Formatting ********************
 */

export interface QueryParameters {

    fetchDirection: QueryDirection;
    fetchMaxRecords: number;
    fromBusinessId?: string;
    type: string;

}
