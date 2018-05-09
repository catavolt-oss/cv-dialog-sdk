import { JsonObjectVisitor } from './JsonObjectVisitor';

/**
 *
 */
export class ReadLargePropertyParametersVisitor implements JsonObjectVisitor {
    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
    }

    // --- State Management Helpers --- //

    public static visitSequence(jsonObject: object): number {
        return new ReadLargePropertyParametersVisitor(jsonObject).visitSequence();
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

    public visitSequence(): number {
        return this.enclosedJsonObject().sequence;
    }
}
