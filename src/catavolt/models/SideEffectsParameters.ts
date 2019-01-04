import {Property} from "./Property";
import { Record } from './Record';

export interface SideEffectsParameters {
    readonly property: Property;
    readonly pendingWrites?: Record;
    readonly type: string;
}
