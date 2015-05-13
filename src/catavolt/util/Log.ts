/**
 * Created by rburson on 3/6/15.
 */

///<reference path="references.ts"/>

module catavolt.util {

    export enum LogLevel { ERROR, WARN, INFO, DEBUG }

    export class Log {

        public static debug:(message, method?:string, clz?:string)=>void;
        public static error:(message, method?:string, clz?:string)=>void;
        public static info:(message, method?:string, clz?:string)=>void;
        public static warn:(message, method?:string, clz?:string)=>void;

        //set default log level here
        static init = Log.logLevel(LogLevel.DEBUG);

        static logLevel(level:LogLevel) {

            if(level >= LogLevel.DEBUG) {
                Log.debug = (message, method?:string, clz?:string)=> {
                    Log.log((o)=> { console.info(o); }, 'DEBUG: ' + message, method, clz);
                };
            } else {
                Log.debug = (message, method?:string, clz?:string)=> {};
            }
            if(level >= LogLevel.INFO){
                Log.info = (message, method?:string, clz?:string)=> {
                    Log.log((o)=> { console.info(o); }, 'INFO: ' + message, method, clz);
                };
            } else {
                Log.info = (message, method?:string, clz?:string)=> {};
            }
            if(level >= LogLevel.WARN) {
                Log.error = (message, clz?:string, method?:string)=> {
                    Log.log((o)=> { console.error(o); }, 'ERROR: ' + message, method, clz);
                };
            } else {
                Log.error = (message, clz?:string, method?:string)=> {};
            }
            if(level >= LogLevel.ERROR) {
                Log.warn = (message, clz?:string, method?:string)=> {
                    Log.log((o)=> { console.info(o); }, 'WARN: ' + message, method, clz);
                };
            } else {
                Log.warn = (message, clz?:string, method?:string)=> {};
            }
        }

        private static log(logger, message, method?:string, clz?:string) {

            var m:string = typeof message !== 'string' ? Log.formatRecString(message) : message;

            if (clz || method) {
                logger(clz + "::" + method + " : " + m);
            } else {
                logger(m);
            }
        }

        static formatRecString(o):string {
            return ObjUtil.formatRecAttr(o);
        }

    }
}

