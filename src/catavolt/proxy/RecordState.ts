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
        if (!this._value.id) {
            throw new Error('Invalid record -- missing id field');
        }
        if (typeof this._value.id !== 'string') {
            throw new Error('Invalid record set -- id field is not a string');
        }
        if (!this._value.properties) {
            throw new Error('Invalid record -- missing properties field');
        }
        if (!Array.isArray(this._value.properties)) {
            throw new Error('Invalid record set -- properties field is not an array');
        }
        if (!this._value.annotations) {
            throw new Error('Invalid record -- missing annotations field');
        }
        if (!Array.isArray(this._value.annotations)) {
            throw new Error('Invalid record set -- annotations field is not an array');
        }
    }

    // --- State Management Helpers --- //

    public static getPropertyValue(record: object, propertyName: string): any {
        return (new RecordState(record)).getPropertyValue(propertyName);
    }

    public static setPropertyValue(record: object, propertyName: string, value: any) {
        (new RecordState(record)).setPropertyValue(propertyName, value);
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

    public recordId(): string {
        return this.internalValue().id;
    }

    public getPropertyValue(propertyName: string): any {
        for (const p of this.internalValue().properties) {
            if (p.name === propertyName) {
                return p.value;
            }
        }
        return undefined;
    }

    public setPropertyValue(propertyName: string, value: any) {
        let found = false;
        for (const p of this.internalValue().properties) {
            if (p.name === propertyName) {
                p.value = value;
                found = true;
                break;
            }
        }
        if (!found) {
            this.internalValue().properties.push({
                "name": propertyName,
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": value
            });
        }
    }

}
