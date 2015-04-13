/**
 * Created by rburson on 4/5/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class ObjectRef {

        static fromFormattedValue(value:string):ObjectRef {
           var pair = StringUtil.splitSimpleKeyValuePair(value);
            return new ObjectRef(pair[0], pair[1]);
        }

        constructor(private _objectId:string, private _description:string) {
        }

        get description():string {
            return this._description;
        }

        get objectId():string {
            return this._objectId;
        }

        toString():string {
            return this.objectId + ":" + this.description;
        }

    }
}