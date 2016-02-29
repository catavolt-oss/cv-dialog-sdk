/**
 * Created by rburson on 3/6/15.
 */
import { ObjUtil } from './ObjUtil';
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (LogLevel = {}));
export class Log {
    static logLevel(level) {
        if (level >= LogLevel.DEBUG) {
            Log.debug = (message, method, clz) => {
                Log.log((o) => {
                    console.info(o);
                }, 'DEBUG: ' + message, method, clz);
            };
        }
        else {
            Log.debug = (message, method, clz) => {
            };
        }
        if (level >= LogLevel.INFO) {
            Log.info = (message, method, clz) => {
                Log.log((o) => {
                    console.info(o);
                }, 'INFO: ' + message, method, clz);
            };
        }
        else {
            Log.info = (message, method, clz) => {
            };
        }
        if (level >= LogLevel.WARN) {
            Log.error = (message, clz, method) => {
                Log.log((o) => {
                    console.error(o);
                }, 'ERROR: ' + message, method, clz);
            };
        }
        else {
            Log.error = (message, clz, method) => {
            };
        }
        if (level >= LogLevel.ERROR) {
            Log.warn = (message, clz, method) => {
                Log.log((o) => {
                    console.info(o);
                }, 'WARN: ' + message, method, clz);
            };
        }
        else {
            Log.warn = (message, clz, method) => {
            };
        }
    }
    static log(logger, message, method, clz) {
        var m = typeof message !== 'string' ? Log.formatRecString(message) : message;
        if (clz || method) {
            logger(clz + "::" + method + " : " + m);
        }
        else {
            logger(m);
        }
    }
    static formatRecString(o) {
        return ObjUtil.formatRecAttr(o);
    }
}
//set default log level here
Log.init = Log.logLevel(LogLevel.INFO);
