/**
 * Created by rburson on 4/5/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class CodeRef {

        static fromFormattedValue(value:string) {
            var pair = StringUtil.splitSimpleKeyValuePair(value);
            return new CodeRef(pair[0], pair[1]);
        }

        constructor(private _code:string, private _description:string) {
        }

        get code():string {
            return this._code;
        }

        get description():string {
            return this._description;
        }

        toString():string {
            return this.code + ":" + this.description;
        }

    }
}