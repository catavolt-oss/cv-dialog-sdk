/**
 * Created by rburson on 4/4/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class BinaryRef {

        constructor(private _settings:StringDictionary){}

        static fromWSValue(encodedValue:string, settings:StringDictionary):Try<BinaryRef> {

            if(encodedValue && encodedValue.length > 0) {
                return new Success(new InlineBinaryRef(encodedValue, settings));
            } else {
                return new Success(new ObjectBinaryRef(settings));
            }

        }

        get settings():StringDictionary {
            return this._settings;
        }

    }

    export class InlineBinaryRef extends BinaryRef {

        constructor(private _inlineData:string, settings:StringDictionary) {
            super(settings);
        }

        /* Base64 encoded data */
        get inlineData():string {
            return this._inlineData;
        }

    }

    export class ObjectBinaryRef extends BinaryRef {

        constructor(settings:StringDictionary) {
            super(settings);
        }

    }
}