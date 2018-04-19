import {SdaBriefcaseRecordState} from "./SdaBriefcaseRecordState";

/**
 *
 */
export class SdaDialogDelegateState {

    private _value: any;

    constructor(state: string | object) {
        if (typeof state === 'string') {
            this._value = JSON.parse(state as string);
        } else {
            this._value = state;
        }
    }

    // --- State Management Helpers --- //

    // --- State Import/Export --- //

    public internalValue() {
        return this._value;
    }

    public copyAsJsonObject(): object {
        return JSON.parse(this.copyAsJsonString());
    }

    public copyAsJsonString(): string {
        return JSON.stringify(this.internalValue());
    }

    // --- State Management --- //

    public briefcaseRecordState(): SdaBriefcaseRecordState {
        return new SdaBriefcaseRecordState(this.internalValue().briefcaseRecord);
    }

    public setBriefcaseRecordState(briefcaseRecordState: SdaBriefcaseRecordState) {
        this.internalValue().briefcaseRecord = briefcaseRecordState.internalValue();
    }

    public userId(): string {
        return this.internalValue().userId;
    }

    public setUserId(userId: string) {
        this.internalValue().userId = userId;
    }

}
