/**
 * Created by rburson on 3/6/15.
 */
var ObjUtil_1 = require('./ObjUtil');
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
        return ObjUtil_1.ObjUtil.formatRecAttr(o);
    };
    //set default log level here
    Log.init = Log.logLevel(LogLevel.INFO);
    return Log;
})();
exports.Log = Log;
