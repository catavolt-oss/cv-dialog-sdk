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

    public recordAt(index: number): RecordState {
        const records = this.internalValue().records[index];
        if (index >= records.length) {
            return null;
        }
        return new RecordState(records[length]);
    }

}
