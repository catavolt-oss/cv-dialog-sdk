/**
 * Created by rburson on 4/27/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
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
                    propValue = dialog.ObjectRef.fromFormattedValue(value);
                }
                else if (propDef.isCodeRefType) {
                    propValue = dialog.CodeRef.fromFormattedValue(value);
                }
                else if (propDef.isGeoFixType) {
                    propValue = dialog.GeoFix.fromFormattedValue(value);
                }
                else if (propDef.isGeoLocationType) {
                    propValue = catavolt.GeoLocation.fromFormattedValue(value);
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
                    else if (o instanceof dialog.CodeRef) {
                        return o.toString();
                    }
                    else if (o instanceof dialog.ObjectRef) {
                        return o.toString();
                    }
                    else if (o instanceof dialog.GeoFix) {
                        return o.toString();
                    }
                    else if (o instanceof catavolt.GeoLocation) {
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
        dialog.PropFormatter = PropFormatter;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
