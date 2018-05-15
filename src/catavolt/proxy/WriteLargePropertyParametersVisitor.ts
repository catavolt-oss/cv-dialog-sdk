import {JsonObjectVisitor} from "./JsonObjectVisitor";

/**
 *
 */
export class WriteLargePropertyParametersVisitor implements JsonObjectVisitor {

    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (!value) {
            throw new Error('WriteLargePropertyParametersVisitor -- null value exception')
        }
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
    }

    // --- State Management Helpers --- //

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

    public visitAppend(): boolean {
        return this.enclosedJsonObject().append;
    }

}
