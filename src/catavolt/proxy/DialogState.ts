/**
 *
 */
export class DialogState {

    private _value: any;

    constructor(value: string | object) {
        if (typeof value === 'string') {
            this._value = JSON.parse(value as string);
        } else {
            this._value = value;
        }
    }

    // --- State Management Helpers --- //

    public static id(dialog: object): string {
        return (new DialogState(dialog)).id();
    }

    // --- State Import/Export --- //

    public copyAsJsonObject(): object {
        return JSON.parse(this.copyJsonString());
    }

    public copyJsonString(): string {
        return JSON.stringify(this.internalValue());
    }

    public internalValue() {
        return this._value;
    }

    // --- State Management --- //

    public id(): string {
        return this.internalValue().id;
    }

}
