/**
 * Created by rburson on 4/5/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var GeoLocation = (function () {
        function GeoLocation(_latitude, _longitude) {
            this._latitude = _latitude;
            this._longitude = _longitude;
        }
        GeoLocation.fromFormattedValue = function (value) {
            var pair = StringUtil.splitSimpleKeyValuePair(value);
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
    catavolt.GeoLocation = GeoLocation;
})(catavolt || (catavolt = {}));
