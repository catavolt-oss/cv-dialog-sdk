/**
 * Created by rburson on 4/4/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class BinaryRef {

        static fromWSValue(encodedValue:string, settings:StringDictionary):Try<BinaryRef> {

            if(encodedValue && encodedValue.length > 0) {
                return new Success(new InlineBinaryRef(Base64.decode(encodedValue), settings));
            } else {
                return new Success(new ObjectBinaryRef(settings));
            }

        }

       settings():StringDictionary;

    }

    export class InlineBinaryRef extends BinaryRef {
        constructor(private _inlineData, private _settings:StringDictionary) {
            super();
        }
    }

    class ObjectBinaryRef extends BinaryRef {
        constructor(private _settings:StringDictionary) {
            super();
        }
    }
}