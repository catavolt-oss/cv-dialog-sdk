/**
 *
 */
import {RecordState} from "./RecordState";

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

    public size(): number {
        return this.internalValue().records.length;
    }

    public updateRecord(record: RecordState) {
        for (const r of this.internalValue().records) {
            if (r.id === record.internalValue().id) {
                for (const f of r) {
                    r[f] = JSON.parse(JSON.stringify(record[f]));
                }
            }
        }
    }

}
