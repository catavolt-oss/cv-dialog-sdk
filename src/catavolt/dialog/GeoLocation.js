/**
 * Created by rburson on 4/5/15.
 */
var StringUtil_1 = require("../util/StringUtil");
var GeoLocation = (function () {
    function GeoLocation(_latitude, _longitude) {
        this._latitude = _latitude;
        this._longitude = _longitude;
    }
    GeoLocation.fromFormattedValue = function (value) {
        var pair = StringUtil_1.StringUtil.splitSimpleKeyValuePair(value);
        return new GeoLocation(Number(pair[0]), Number(pair[1]));
    };
    Object.defineProperty(GeoLocation.prototype, "latitude", {
        get: function () {
            return this._latitude;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoLocation.prototype, "longitude", {
        get: function () {
            return this._longitude;
        },
        enumerable: true,
        configurable: true
    });
    GeoLocation.prototype.toString = function () {
        return this.latitude + ":" + this.longitude;
    };
    return GeoLocation;
})();
exports.GeoLocation = GeoLocation;
