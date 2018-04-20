/**
 *
 */
import {RecordState} from "./RecordState";
import {Log} from "../util";

export class RecordSetState {

    private _value: any;

    constructor(value: string | object) {
        if (typeof value === 'string') {
            this._value = JSON.parse(value as string);
        } else {
            this._value = value;
        }
        if (!this._value.records) {
            throw new Error('Invalid record set -- missing records field');
        }
        if (!Array.isArray(this._value.records)) {
            throw new Error('Invalid record set -- records field is not an array');
        }
    }

    // --- State Management Helpers --- //

    public static emptyRecordSet(): RecordSetState {
        return new RecordSetState({
            defaultActionId: null,
            records: [],
            hasMore: false,
            type: "hxgn.api.dialog.RecordSet"
        });
    }

    // --- State Import/Export --- //

    public copyAsJsonObject(): object {
        return JSON.parse(this.copyAsJsonString());
    }

    public copyAsJsonString(): string {
        return JSON.stringify(this.internalValue());
    }

    public internalValue() {
        return this._value;
    }

    // --- State Management --- //

    public addAllRecords(recordSetState: RecordSetState) {
        for (const r of recordSetState.internalValue().records) {
            this.addOrUpdateRecord(new RecordState(r));
        }
    }

    public addOrUpdateRecord(recordState: RecordState) {
        let found = false;
        const recordCopy = JSON.parse(JSON.stringify(recordState.internalValue()));
        for (const r of this.internalValue().records) {
            if (r.id === recordCopy.id) {
                for (const k of Object.keys(r)) {
                    r[k] = recordCopy[k];
                }
                found = true;
                break;
            }
        }
        if (!found) {
            this.internalValue().records.push(recordCopy);
        }
    }

    public findRecordAtId(id: string): RecordState {
        for (const r of this.records()) {
            if (r.recordId() === id) {
                return r;
            }
        }
        return null;
    }

    public *records(): IterableIterator<RecordState> {
        let index = 0;
        while (index < this.internalValue().records.length) {
            yield new RecordState(this.internalValue().records[index++]);
        }
    }

    public size(): number {
        return this.internalValue().records.length;
    }

}
