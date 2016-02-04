/**
 * Created by rburson on 3/9/15.
 */
///<reference path="util.d.ts"/>
///<reference path="fp.d.ts"/>
declare module "catavolt-ws" {

    import {StringDictionary} from "catavolt-util";
    import {Future} from "catavolt-fp";

    export interface Client {
        jsonGet(targetUrl:string, timeoutMillis?:number): Future<StringDictionary>;
        jsonPost(targetUrl:string, jsonObj?:StringDictionary, timeoutMillis?:number): Future<StringDictionary>;
        jsonCall(targetUrl:string, jsonObj?:StringDictionary, method?:string, timeoutMillis?:number): Future<StringDictionary>;
    }
    export class XMLHttpClient implements Client {
        jsonGet(targetUrl:string, timeoutMillis?:number):Future<StringDictionary>;

        jsonPost(targetUrl:string, jsonObj?:StringDictionary, timeoutMillis?:number):Future<StringDictionary>;

        jsonCall(targetUrl:string, jsonObj?:StringDictionary, method?:string, timeoutMillis?:number):Future<StringDictionary>;
    }
    export interface Request {
    }
    export class Call implements Request {
        private static _lastCallId;
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
        timeoutMillis:number;

        static nextCallId():number;

        static createCall(service:string, method:string, params:StringDictionary, sessionContext:SessionContext):Call;

        static createCallWithoutSession(service:string, method:string, params:StringDictionary, systemContext:SystemContext):Call;

        constructor(service:string, method:string, params:StringDictionary, systemContext:SystemContext, sessionContext:SessionContext);

        cancel():void;

        perform():Future<StringDictionary>;
    }
    export class Get implements Request {
        private _performed;
        private _promise;
        private _url;
        private _client;
        timeoutMillis:number;

        static fromUrl(url:string):Get;

        constructor(url:string);

        cancel():void;

        perform():Future<StringDictionary>;

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
        userName: string;
    }
    /**
     * Created by rburson on 3/9/15.
     */
    export interface SystemContext {
        urlString: string;
    }
}
