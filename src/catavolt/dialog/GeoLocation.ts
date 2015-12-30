/**
 * Created by rburson on 4/5/15.
 */

import {StringUtil} from "../util/StringUtil";

export class GeoLocation {

    static fromFormattedValue(value:string):GeoLocation {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new GeoLocation(Number(pair[0]), Number(pair[1]));
    }

    constructor(private _latitude:number,
                private _longitude:number) {
    }

    get latitude():number {
        return this._latitude;
    }

    get longitude():number {
        return this._longitude;
    }

    toString():string {
        return this.latitude + ":" + this.longitude;
    }

}
