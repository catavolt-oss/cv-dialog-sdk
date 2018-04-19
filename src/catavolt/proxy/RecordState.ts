/**
 *
 */
export class RecordState {

    private _value: any;

    constructor(value: string | object) {
        if (typeof value === 'string') {
            this._value = JSON.parse(value as string);
        } else {
            this._value = value;
        }
    }

    // --- State Management Helpers --- //

    public static getPropertyValue(record: object, propertyName: string): any {
        return (new RecordState(record)).getPropertyValue(propertyName);
    }

    public static setPropertyValue(record: object, propertyName: string, value: any): boolean {
        return (new RecordState(record)).setPropertyValue(propertyName, value);
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

    public getPropertyValue(propertyName: string): any {
        for (const p of this.internalValue().properties) {
            if (p.name === propertyName) {
                return p.value;
            }
        }
        return undefined;
    }

    public setPropertyValue(propertyName: string, value: any): boolean {
        for (const p of this.internalValue().properties) {
            if (p.name === propertyName) {
                p.value = value;
                return true;
            }
        }
        return false;
    }

}
