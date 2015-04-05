/**
 * Created by rburson on 4/5/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class GeoFix {

        static fromFormattedValue(value:string):GeoFix {
            var pair = StringUtil.splitSimpleKeyValuePair(value);
            return new GeoFix(Number(pair[0]), Number(pair[1]), null, null);
        }

        constructor(private _latitude:number,
                    private _longitude:number,
                    private _source:string,
                    private _accuracy:number) {
        }

        get latitude():number{
            return this._latitude;
        }

        get longitude():number {
           return this._longitude;
        }

        get source():string {
           return this._source;
        }

        get accuracy():number {
           return this._accuracy
        }

    }
}