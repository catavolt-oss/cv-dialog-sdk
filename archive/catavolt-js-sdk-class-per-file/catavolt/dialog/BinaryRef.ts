/**
 * Created by rburson on 4/4/15.
 */

import {StringDictionary} from "../util/Types";
import {Try} from "../fp/Try";
import {Base64} from "../util/Base64";
import {Success} from "../fp/Success";

    export class BinaryRef {

        constructor(private _settings:StringDictionary){}

        static fromWSValue(encodedValue:string, settings:StringDictionary):Try<BinaryRef> {

            if(encodedValue && encodedValue.length > 0) {
                return new Success(new InlineBinaryRef(Base64.decode(encodedValue), settings));
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

        toString():string {
            return this._inlineData;
        }

    }

    class ObjectBinaryRef extends BinaryRef {

        constructor(settings:StringDictionary) {
            super(settings);
        }

    }
