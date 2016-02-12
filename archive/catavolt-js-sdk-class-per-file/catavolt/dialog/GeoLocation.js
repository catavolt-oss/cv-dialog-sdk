/**
 * Created by rburson on 4/5/15.
 */
import { StringUtil } from "../util/StringUtil";
export class GeoLocation {
    constructor(_latitude, _longitude) {
        this._latitude = _latitude;
        this._longitude = _longitude;
    }
    static fromFormattedValue(value) {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new GeoLocation(Number(pair[0]), Number(pair[1]));
    }
    get latitude() {
        return this._latitude;
    }
    get longitude() {
        return this._longitude;
    }
    toString() {
        return this.latitude + ":" + this.longitude;
    }
}
//# sourceMappingURL=GeoLocation.js.map