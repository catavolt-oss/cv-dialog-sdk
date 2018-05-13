import {DialogProxyTools} from "./DialogProxyTools";
import {JsonObjectVisitor} from "./JsonObjectVisitor";
import {PropertyVisitor} from "./PropertyVisitor";

/**
 *
 */
export class RecordVisitor implements JsonObjectVisitor {

    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
        if (!DialogProxyTools.isRecordModel(this._enclosedJsonObject)) {
            throw new Error("Object passed to RecordVisitor is not a Record");
        }
        if (!this._enclosedJsonObject.id) {
            throw new Error('Invalid record -- missing id field');
        }
        if (typeof this._enclosedJsonObject.id !== 'string') {
            throw new Error('Invalid record set -- id field is not a string');
        }
        if (!this._enclosedJsonObject.properties) {
            throw new Error('Invalid record -- missing properties field');
        }
        if (!Array.isArray(this._enclosedJsonObject.properties)) {
            throw new Error('Invalid record set -- properties field is not an array');
        }
        if (!this._enclosedJsonObject.annotations) {
            throw new Error('Invalid record -- missing annotations field');
        }
        if (!Array.isArray(this._enclosedJsonObject.annotations)) {
            throw new Error('Invalid record set -- annotations field is not an array');
        }
    }

    // --- State Management Helpers --- //

    public static visitPropertyValueAt(record: object, propertyName: string): any {
        return (new RecordVisitor(record)).visitPropertyValueAt(propertyName);
    }

    public static visitAndSetPropertyValueAt(record: object, propertyName: string, value: any) {
        (new RecordVisitor(record)).visitAndSetPropertyValueAt(propertyName, value);
    }

    // --- State Import/Export --- //

    public copyAsJsonObject(): object {
        return JSON.parse(this.copyAsJsonString());
    }

    public copyAsJsonString(): string {
        return JSON.stringify(this.enclosedJsonObject());
    }

    public enclosedJsonObject() {
        return this._enclosedJsonObject;
    }

    // --- State Management --- //

    public visitPropertyValueAt(propertyName: string): any {
        for (const p of this.enclosedJsonObject().properties) {
            if (p.name === propertyName) {
                return p.value;
            }
        }
        return undefined;
    }

    public visitAndSetPropertyValueAt(propertyName: string, value: any) {
        let found = false;
        for (const p of this.enclosedJsonObject().properties) {
            if (p.name === propertyName) {
                p.value = value;
                found = true;
                break;
            }
        }
        if (!found) {
            this.enclosedJsonObject().properties.push({
                "name": propertyName,
                "format": null,
                "annotations": [],
                "type": "hxgn.api.dialog.Property",
                "value": value
            });
        }
    }

    public * visitProperties(): IterableIterator<PropertyVisitor> {
        let index = 0;
        while (index < this.enclosedJsonObject().properties.length) {
            yield new PropertyVisitor(this.enclosedJsonObject().properties[index++]);
        }
    }

    public visitRecordId(): string {
        return this.enclosedJsonObject().id;
    }

}
