/**
 * Created by rburson on 3/6/15.
 */

declare module "catavolt-util" {
    export class ArrayUtil {
        static copy<T>(source:Array<T>):Array<T>;

        static find<T>(source:Array<T>, f:(T) => boolean):T;
    }
    /**
     * *****************************************************
     */
    export class Base64 {
        private static _keyStr;

        static encode(input:any):string;

        static decode(input:any):string;

        private static _utf8_encode(s);

        static _utf8_decode(utftext:any):string;
    }
/**
 * *****************************************************
 */
    export class DataUrl {
        private _mimeType;
        private _data;
        private static PROTO_TOKEN;
        private static ENCODING_TOKEN;
        static createDataUrl(mimeType: string, encodedData: string): string;
        static getMimeType(dataUrl: string): string;
        static getEncodedData(dataUrl: string): string;
        constructor(dataUrl: string);
        mimeType: string;
        data: string;
    }
    /**
     * *****************************************************
     */
    export enum LogLevel {
        ERROR = 0,
        WARN = 1,
        INFO = 2,
        DEBUG = 3,
    }
    export class Log {
        static debug:(message, method?:string, clz?:string) => void;
        static error:(message, method?:string, clz?:string) => void;
        static info:(message, method?:string, clz?:string) => void;
        static warn:(message, method?:string, clz?:string) => void;
        static init:void;

        static logLevel(level:LogLevel):void;

        private static log(logger, message, method?, clz?);

        static formatRecString(o:any):string;
    }
    /**
     * *****************************************************
     */
    export class ObjUtil {
        static addAllProps(sourceObj:any, targetObj:any):any;

        static cloneOwnProps(sourceObj:any):any;

        static copyNonNullFieldsOnly(obj:any, newObj:any, filterFn?:(prop) => boolean):any;

        static formatRecAttr(o:any):string;

        static newInstance(type:any):any;
    }
    /**
     * *****************************************************
     */
    export class StringUtil {
        static splitSimpleKeyValuePair(pairString:string):Array<string>;
    }
    /**
     * *****************************************************
     */
    export interface StringDictionary {
        [index: string]: any;
    }
    export interface Dictionary<T> {
        [index: string]: T;
    }
    /**
     * *****************************************************
     */
    export interface UserException {
        iconName: string;
        message: string;
        name: string;
        stackTrace: string;
        title: string;
    }
}
