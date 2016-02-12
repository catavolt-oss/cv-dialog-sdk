/**
 * Created by rburson on 4/5/15.
 */
import { StringUtil } from "../util/StringUtil";
export class GeoFix {
    constructor(_latitude, _longitude, _source, _accuracy) {
        this._latitude = _latitude;
        this._longitude = _longitude;
        this._source = _source;
        this._accuracy = _accuracy;
    }
    static fromFormattedValue(value) {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new GeoFix(Number(pair[0]), Number(pair[1]), null, null);
    }
    get latitude() {
        return this._latitude;
    }
    get longitude() {
        return this._longitude;
    }
    get source() {
        return this._source;
    }
    get accuracy() {
        return this._accuracy;
    }
    toString() {
        return this.latitude + ":" + this.longitude;
    }
}
//# sourceMappingURL=GeoFix.js.map