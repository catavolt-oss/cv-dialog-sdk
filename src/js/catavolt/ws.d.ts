import { StringDictionary } from "./util";
import { Future } from "./fp";
/**
 * Created by rburson on 3/9/15.
 */
export interface Client {
    jsonGet(targetUrl: string, timeoutMillis?: number): Future<StringDictionary>;
    jsonPost(targetUrl: string, jsonObj?: StringDictionary, timeoutMillis?: number): Future<StringDictionary>;
    stringGet(targetUrl: string, timeoutMillis?: number): Future<string>;
    postMultipart(targetUrl: string, formData: FormData): Future<void>;
}
export declare class ClientFactory {
    static getClient(): Client;
}
export declare class XMLHttpClient implements Client {
    jsonGet(targetUrl: string, timeoutMillis?: number): Future<StringDictionary>;
    stringGet(targetUrl: string, timeoutMillis?: number): Future<string>;
    jsonPost(targetUrl: string, jsonObj?: StringDictionary, timeoutMillis?: number): Future<StringDictionary>;
    postMultipart(targetUrl: string, formData: FormData): Future<void>;
    private sendRequest(targetUrl, body, method, timeoutMillis?);
}
export interface Request {
}
export declare class Call implements Request {
    private static _lastCallId;
    private static _lastSuccessfulActivityTime;
    private _callId;
    private _cancelled;
    private _loggingOption;
    private _method;
    private _params;
    private _performed;
    private _promise;
    private _responseHeaders;
    private _service;
    private _sessionContext;
    private _systemContext;
    private _client;
    timeoutMillis: number;
    static nextCallId(): number;
    static createCall(service: string, method: string, params: StringDictionary, sessionContext: SessionContext): Call;
    static createCallWithoutSession(service: string, method: string, params: StringDictionary, systemContext: SystemContext): Call;
    static lastSuccessfulActivityTime: Date;
    constructor(service: string, method: string, params: StringDictionary, systemContext: SystemContext, sessionContext: SessionContext);
    cancel(): void;
    perform(): Future<StringDictionary>;
}
export declare class Get implements Request {
    private _performed;
    private _promise;
    private _url;
    private _client;
    timeoutMillis: number;
    static fromUrl(url: string): Get;
    constructor(url: string);
    cancel(): void;
    perform(): Future<StringDictionary>;
    private complete(t);
}
/**
 * Created by rburson on 3/9/15.
 */
export interface SessionContext {
    currentDivision: string;
    isRemoteSession: boolean;
    isLocalSession: boolean;
    serverVersion: string;
    sessionHandle: string;
    systemContext: SystemContext;
    tenantId: string;
    userName: string;
}
/**
 * Created by rburson on 3/9/15.
 */
export interface SystemContext {
    urlString: string;
}
