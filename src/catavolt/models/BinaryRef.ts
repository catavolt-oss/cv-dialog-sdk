import {StringDictionary} from "../util/StringDictionary";

export abstract class BinaryRef {

    constructor(private _settings: StringDictionary) {
    }

    // @TODO
    /*
     static fromWSValue(encodedValue:string, settings:StringDictionary):Try<BinaryRef> {

     if (encodedValue && encodedValue.length > 0) {
     return new Success(new InlineBinaryRef(encodedValue, settings));
     } else {
     return new Success(new ObjectBinaryRef(settings));
     }

     }
     */
    get settings(): StringDictionary {
        return this._settings;
    }

}
