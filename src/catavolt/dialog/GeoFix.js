/**
 * Created by rburson on 4/5/15.
 */
var StringUtil_1 = require("../util/StringUtil");
var GeoFix = (function () {
    function GeoFix(_latitude, _longitude, _source, _accuracy) {
        this._latitude = _latitude;
        this._longitude = _longitude;
        this._source = _source;
        this._accuracy = _accuracy;
    }
    GeoFix.fromFormattedValue = function (value) {
        var pair = StringUtil_1.StringUtil.splitSimpleKeyValuePair(value);
        return new GeoFix(Number(pair[0]), Number(pair[1]), null, null);
    };
    Object.defineProperty(GeoFix.prototype, "latitude", {
        get: function () {
            return this._latitude;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoFix.prototype, "longitude", {
        get: function () {
            return this._longitude;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoFix.prototype, "source", {
        get: function () {
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeoFix.prototype, "accuracy", {
        get: function () {
            return this._accuracy;
        },
        enumerable: true,
        configurable: true
    });
    GeoFix.prototype.toString = function () {
        return this.latitude + ":" + this.longitude;
    };
    return GeoFix;
})();
exports.GeoFix = GeoFix;
