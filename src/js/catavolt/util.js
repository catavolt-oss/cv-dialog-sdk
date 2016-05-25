/**
 * Created by rburson on 3/6/15.
 */
"use strict";
var ArrayUtil = (function () {
    function ArrayUtil() {
    }
    ArrayUtil.copy = function (source) {
        return source.map(function (e) {
            return e;
        });
    };
    ArrayUtil.find = function (source, f) {
        var value = null;
        source.some(function (v) {
            if (f(v)) {
                value = v;
                return true;
            }
            return false;
        });
        return value;
    };
    return ArrayUtil;
}());
exports.ArrayUtil = ArrayUtil;
/**
 * *****************************************************
 */
/*
 This implementation supports our ECMA 5.1 browser set, including IE9
 If we no longer need to support IE9, a TypedArray implementaion would be more efficient...
 */
var Base64 = (function () {
    function Base64() {
    }
    Base64.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
        }
        return output;
    };
    Base64.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    };
    Base64._utf8_encode = function (s) {
        s = s.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < s.length; n++) {
            var c = s.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    Base64._utf8_decode = function (utftext) {
        var s = "";
        var i = 0;
        var c = 0, c1 = 0, c2 = 0, c3 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                s += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                s += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                s += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return s;
    };
    Base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    return Base64;
}());
exports.Base64 = Base64;
/**
 * *****************************************************
 */
var DataUrl = (function () {
    function DataUrl(dataUrl) {
        this._mimeType = DataUrl.getMimeType(dataUrl);
        this._data = DataUrl.getEncodedData(dataUrl);
    }
    DataUrl.createDataUrl = function (mimeType, encodedData) {
        return DataUrl.PROTO_TOKEN + mimeType + DataUrl.ENCODING_TOKEN + encodedData;
    };
    DataUrl.getMimeType = function (dataUrl) {
        var startIndex = dataUrl.indexOf(':');
        var endIndex = dataUrl.indexOf(';');
        if (startIndex > -1 && endIndex > startIndex) {
            return dataUrl.substring(startIndex + 1, endIndex);
        }
    };
    DataUrl.getEncodedData = function (dataUrl) {
        var startIndex = dataUrl.indexOf(',');
        if (startIndex > -1) {
            return dataUrl.substring(startIndex + 1);
        }
    };
    Object.defineProperty(DataUrl.prototype, "mimeType", {
        get: function () {
            return this._mimeType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataUrl.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    DataUrl.PROTO_TOKEN = 'data:';
    DataUrl.ENCODING_TOKEN = ';base64,';
    return DataUrl;
}());
exports.DataUrl = DataUrl;
/**
 * *****************************************************
 */
var TimeValue = (function () {
    function TimeValue(hours, minutes, seconds, millis) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.millis = millis;
    }
    TimeValue.fromString = function (timeString) {
        /* expecting hh:mm:ss.lll */
        var _a = timeString.split(':'), _b = _a[0], hours = _b === void 0 ? '0' : _b, _c = _a[1], minutes = _c === void 0 ? '0' : _c, _d = _a[2], secondsPart = _d === void 0 ? '0.0' : _d;
        var _e = secondsPart.split('.'), _f = _e[0], seconds = _f === void 0 ? '0' : _f, _g = _e[1], millis = _g === void 0 ? '0' : _g;
        return new TimeValue(Number(hours), Number(minutes), Number(seconds), Number(millis));
    };
    TimeValue.prototype.toString = function () {
        return this.pad(this.hours.toString()) + ":" + this.pad(this.minutes.toString()) + ":" + this.pad(this.seconds.toString()) + "." + this.pad(this.millis.toString(), "000");
    };
    TimeValue.prototype.pad = function (s, pad) {
        if (pad === void 0) { pad = "00"; }
        return (pad + s).substring(s.length);
    };
    return TimeValue;
}());
exports.TimeValue = TimeValue;
/**
 * *****************************************************
 */
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(exports.LogLevel || (exports.LogLevel = {}));
var LogLevel = exports.LogLevel;
var Log = (function () {
    function Log() {
    }
    Log.logLevel = function (level) {
        if (level >= LogLevel.DEBUG) {
            Log.debug = function (message, method, clz) {
                Log.log(function (o) {
                    console.info(o);
                }, 'DEBUG: ' + message, method, clz);
            };
        }
        else {
            Log.debug = function (message, method, clz) {
            };
        }
        if (level >= LogLevel.INFO) {
            Log.info = function (message, method, clz) {
                Log.log(function (o) {
                    console.info(o);
                }, 'INFO: ' + message, method, clz);
            };
        }
        else {
            Log.info = function (message, method, clz) {
            };
        }
        if (level >= LogLevel.WARN) {
            Log.error = function (message, clz, method) {
                Log.log(function (o) {
                    console.error(o);
                }, 'ERROR: ' + message, method, clz);
            };
        }
        else {
            Log.error = function (message, clz, method) {
            };
        }
        if (level >= LogLevel.ERROR) {
            Log.warn = function (message, clz, method) {
                Log.log(function (o) {
                    console.info(o);
                }, 'WARN: ' + message, method, clz);
            };
        }
        else {
            Log.warn = function (message, clz, method) {
            };
        }
    };
    Log.log = function (logger, message, method, clz) {
        var m = typeof message !== 'string' ? Log.formatRecString(message) : message;
        if (clz || method) {
            logger(clz + "::" + method + " : " + m);
        }
        else {
            logger(m);
        }
    };
    Log.formatRecString = function (o) {
        return ObjUtil.formatRecAttr(o);
    };
    //set default log level here
    Log.init = Log.logLevel(LogLevel.INFO);
    return Log;
}());
exports.Log = Log;
/**
 * *****************************************************
 */
var ObjUtil = (function () {
    function ObjUtil() {
    }
    ObjUtil.addAllProps = function (sourceObj, targetObj) {
        if (null == sourceObj || "object" != typeof sourceObj)
            return targetObj;
        if (null == targetObj || "object" != typeof targetObj)
            return targetObj;
        for (var attr in sourceObj) {
            targetObj[attr] = sourceObj[attr];
        }
        return targetObj;
    };
    ObjUtil.cloneOwnProps = function (sourceObj) {
        if (null == sourceObj || "object" != typeof sourceObj)
            return sourceObj;
        var copy = sourceObj.constructor();
        for (var attr in sourceObj) {
            if (sourceObj.hasOwnProperty(attr)) {
                copy[attr] = ObjUtil.cloneOwnProps(sourceObj[attr]);
            }
        }
        return copy;
    };
    ObjUtil.copyNonNullFieldsOnly = function (obj, newObj, filterFn) {
        for (var prop in obj) {
            if (!filterFn || filterFn(prop)) {
                var type = typeof obj[prop];
                if (type !== 'function') {
                    var val = obj[prop];
                    if (val) {
                        newObj[prop] = val;
                    }
                }
            }
        }
        return newObj;
    };
    ObjUtil.formatRecAttr = function (o) {
        //@TODO - add a filter here to build a cache and detect (and skip) circular references
        return JSON.stringify(o);
    };
    ObjUtil.newInstance = function (type) {
        return new type;
    };
    return ObjUtil;
}());
exports.ObjUtil = ObjUtil;
/**
 * *****************************************************
 */
var StringUtil = (function () {
    function StringUtil() {
    }
    StringUtil.splitSimpleKeyValuePair = function (pairString) {
        var index = pairString.indexOf(':');
        var code = '';
        var desc = '';
        if (index > -1) {
            code = pairString.substr(0, index);
            desc = pairString.length > index ? pairString.substr(index + 1) : '';
        }
        else {
            code = pairString;
        }
        return [code, desc];
    };
    StringUtil.hashCode = function (s) {
        var hash = 0, i, chr, len;
        if (s.length === 0)
            return hash;
        for (i = 0, len = s.length; i < len; i++) {
            chr = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
    return StringUtil;
}());
exports.StringUtil = StringUtil;
