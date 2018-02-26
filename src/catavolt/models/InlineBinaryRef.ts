import {StringDictionary} from "../util/StringDictionary";
import {BinaryRef} from "./BinaryRef";

export class InlineBinaryRef extends BinaryRef {

    constructor(private _inlineData: string, settings: StringDictionary) {
        super(settings);
    }

    /* Base64 encoded data */
    get inlineData(): string {
        return this._inlineData;
    }

    public toString(): string {
        return this._inlineData;
    }

}
