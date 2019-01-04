import { Record } from './Record';
import {RecordDef} from "./RecordDef";

export interface SideEffectsResponse {
    readonly propertyName: string;
    readonly record: Record;
    readonly recordDef: RecordDef;
    readonly type: string;
}
