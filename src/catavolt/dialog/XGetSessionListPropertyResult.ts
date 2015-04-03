/**
 * Created by rburson on 3/17/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XGetSessionListPropertyResult {

        constructor(private _list:Array<string>, private _dialogProps:StringDictionary){}

        get dialogProps():StringDictionary {
            return this._dialogProps;
        }

        get values():Array<string> {
            return this._list;
        }

        valuesAsDictionary():StringDictionary {
            var result:StringDictionary = {};
            this.values.forEach(
                (v)=>{
                    var pair = StringUtil.splitSimpleKeyValuePair(v);
                    result[pair[0]] = pair[1];
                }
            );
            return result;
        }
    }
}
