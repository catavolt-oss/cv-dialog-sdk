import {ObjUtil} from "./ObjUtil";

export enum LogLevel { ERROR, WARN, INFO, DEBUG }

export class Log {

    public static debug: (message, method?: string, clz?: string) => void;
    public static error: (message, method?: string, clz?: string) => void;
    public static info: (message, method?: string, clz?: string) => void;
    public static warn: (message, method?: string, clz?: string) => void;

    private static _logLevel: LogLevel;

    public static logLevel(level: LogLevel) {

        if (level >= LogLevel.DEBUG) {
            Log.debug = (message, method?: string, clz?: string) => {
                Log.log((o) => {
                    console.debug(o);
                }, 'DEBUG: ' + message, method, clz);
            };
        } else {
            Log.debug = (message, method?: string, clz?: string) => {
            };
        }
        if (level >= LogLevel.INFO) {
            Log.info = (message, method?: string, clz?: string) => {
                Log.log((o) => {
                    console.info(o);
                }, 'INFO: ' + message, method, clz);
            };
        } else {
            Log.info = (message, method?: string, clz?: string) => {
            };
        }
        if (level >= LogLevel.WARN) {
            Log.warn = (message, clz?: string, method?: string) => {
                Log.log((o) => {
                    console.warn(o);
                }, 'WARN: ' + message, method, clz);
            };
        } else {
            Log.warn = (message, clz?: string, method?: string) => {
            };
        }
        if (level >= LogLevel.ERROR) {
            Log.error = (message, clz?: string, method?: string) => {
                Log.log((o) => {
                    console.error(o);
                }, 'ERROR: ' + message, method, clz);
            };
        } else {
            Log.error = (message, clz?: string, method?: string) => {
            };
        }

        Log._logLevel = level;
    }

    public static isEnabled(level: LogLevel): boolean {
        return Log._logLevel >= level;
    }

    //set default log level here
    public static init = Log.logLevel(LogLevel.INFO);

    private static log(logger, message, method?: string, clz?: string) {

        const m: string = typeof message !== 'string' ? Log.formatRecString(message) : message;

        if (clz || method) {
            logger(clz + "::" + method + " : " + m);
        } else {
            logger(m);
        }
    }

    public static prettyPrint(o): string {
        return ObjUtil.formatRecAttr(o, true);
    }

    public static formatRecString(o): string {
        return ObjUtil.formatRecAttr(o);
    }

}
