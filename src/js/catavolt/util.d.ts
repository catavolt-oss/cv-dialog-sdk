/**
 * Created by rburson on 3/6/15.
 */
export declare class ArrayUtil {
    static copy<T>(source: Array<T>): Array<T>;
    static find<T>(source: Array<T>, f: (T) => boolean): T;
}
/**
 * *****************************************************
 */
export declare class Base64 {
    private static _keyStr;
    static encode(input: any): string;
    static decode(input: any): string;
    private static _utf8_encode(s);
    static _utf8_decode(utftext: any): string;
}
/**
 * *****************************************************
 */
export declare class DataUrl {
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
export declare class TimeValue {
    hours: number;
    minutes: number;
    seconds: number;
    millis: number;
    static fromString(timeString: string): TimeValue;
    static fromDateValue(dateValue: Date): TimeValue;
    constructor(hours: number, minutes: number, seconds: number, millis: number);
    toString(): string;
    toDateValue(): Date;
    private pad(s, pad?);
}
/**
 * *****************************************************
 */
export declare enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
}
export declare class Log {
    static debug: (message, method?: string, clz?: string) => void;
    static error: (message, method?: string, clz?: string) => void;
    static info: (message, method?: string, clz?: string) => void;
    static warn: (message, method?: string, clz?: string) => void;
    static init: void;
    static logLevel(level: LogLevel): void;
    private static log(logger, message, method?, clz?);
    static formatRecString(o: any): string;
}
/**
 * *****************************************************
 */
export declare class ObjUtil {
    static addAllProps(sourceObj: any, targetObj: any): any;
    static cloneOwnProps(sourceObj: any): any;
    static copyNonNullFieldsOnly(obj: any, newObj: any, filterFn?: (prop) => boolean): any;
    static formatRecAttr(o: any): string;
    static newInstance(type: any): any;
}
/**
 * *****************************************************
 */
export declare class StringUtil {
    static splitSimpleKeyValuePair(pairString: string): Array<string>;
    static hashCode(s: string): number;
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
