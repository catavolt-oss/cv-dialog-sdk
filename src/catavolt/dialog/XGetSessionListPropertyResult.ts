/**
 * Created by rburson on 3/17/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XGetSessionListPropertyResult {

        static fromWSGetSessionListPropertyResult(jsonObject:StringDictionary):Try<XGetSessionListPropertyResult> {

            return DialogTriple.extractValue(jsonObject, "WSGetSessionListPropertyResult",
                ()=>{
                    var valuesTry = DialogTriple.extractList(jsonObject['list'], "String",
                        (value)=>{
                            var valueTry:Try<string>;
                            if(typeof value === 'string') {
                                valueTry = new Success<string>(value);
                            } else {
                                valueTry = new Failure<string>("XGetSessionListPropertyResult: Expected a String but found " + value);
                            }
                            return valueTry;
                        }
                    );
                    if(valuesTry.isFailure){ return new Failure<XGetSessionListPropertyResult>(valuesTry.failure); }

                    var dialogProps:StringDictionary = jsonObject['dialogProperties'];

                    return new Success(new XGetSessionListPropertyResult(valuesTry.success, dialogProps));
                }
            );
        }

        constructor(private _values:Array<string>, private _dialogProps:StringDictionary){}

        get dialogProps():StringDictionary {
            return this._dialogProps;
        }

        get values():Array<string> {
            return this._values;
        }

        valuesAsDictionary():StringDictionary {
            var result:StringDictionary = {};
            this.values.forEach(
                (v)=>{
                    var pair = v.split(':');
                    (pair.length > 1) && (result[pair[0]] = pair[1]);
                }
            );
            return result;
        }
    }
}
