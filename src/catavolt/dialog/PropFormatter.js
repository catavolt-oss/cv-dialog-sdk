/**
 * Created by rburson on 4/27/15.
 */
var ObjectRef_1 = require("./ObjectRef");
var CodeRef_1 = require("./CodeRef");
var GeoFix_1 = require("./GeoFix");
var GeoLocation_1 = require("./GeoLocation");
var PropFormatter = (function () {
    function PropFormatter() {
    }
    PropFormatter.formatForRead = function (prop, propDef) {
        return 'R:' + prop ? PropFormatter.toString(prop) : '';
    };
    PropFormatter.formatForWrite = function (prop, propDef) {
        return prop ? PropFormatter.toString(prop) : '';
    };
    PropFormatter.parse = function (value, propDef) {
        var propValue = value;
        if (propDef.isDecimalType) {
            propValue = Number(value);
        }
        else if (propDef.isLongType) {
            propValue = Number(value);
        }
        else if (propDef.isBooleanType) {
            propValue = value !== 'false';
        }
        else if (propDef.isDateType) {
            propValue = new Date(value);
        }
        else if (propDef.isDateTimeType) {
            propValue = new Date(value);
        }
        else if (propDef.isTimeType) {
            propValue = new Date(value);
        }
        else if (propDef.isObjRefType) {
            propValue = ObjectRef_1.ObjectRef.fromFormattedValue(value);
        }
        else if (propDef.isCodeRefType) {
            propValue = CodeRef_1.CodeRef.fromFormattedValue(value);
        }
        else if (propDef.isGeoFixType) {
            propValue = GeoFix_1.GeoFix.fromFormattedValue(value);
        }
        else if (propDef.isGeoLocationType) {
            propValue = GeoLocation_1.GeoLocation.fromFormattedValue(value);
        }
        return propValue;
    };
    PropFormatter.toString = function (o) {
        if (typeof o === 'number') {
            return String(o);
        }
        else if (typeof o === 'object') {
            if (o instanceof Date) {
                return o.toUTCString();
            }
            else if (o instanceof CodeRef_1.CodeRef) {
                return o.toString();
            }
            else if (o instanceof ObjectRef_1.ObjectRef) {
                return o.toString();
            }
            else if (o instanceof GeoFix_1.GeoFix) {
                return o.toString();
            }
            else if (o instanceof GeoLocation_1.GeoLocation) {
                return o.toString();
            }
            else {
                return String(o);
            }
        }
        else {
            return String(o);
        }
    };
    return PropFormatter;
})();
exports.PropFormatter = PropFormatter;
