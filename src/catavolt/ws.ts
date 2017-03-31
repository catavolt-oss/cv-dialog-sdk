import {StringDictionary} from "./util";
import {Future} from "./fp";
import {Log} from "./util";
import {Promise} from "./fp";
import {Dictionary} from "./util";
import {Failure} from "./fp";
import {Try} from "./fp";

/**
 * Created by rburson on 3/9/15.
 */


/* We'll abstract the client as we may later want to use a json-p client or websocket or other */
export interface Client {
    jsonGet(targetUrl:string, timeoutMillis?:number):Future<StringDictionary>;
    jsonPost(targetUrl:string, jsonObj?:StringDictionary, timeoutMillis?:number):Future<StringDictionary>;
    stringGet(targetUrl:string, timeoutMillis?:number):Future<string>;
    postMultipart(targetUrl:string, formData:FormData):Future<void>;
}

export class ClientFactory {
    static getClient():Client {
        return new XMLHttpClient();
    }
}

export class XMLHttpClient implements Client {

    jsonGet(targetUrl:string, timeoutMillis?:number):Future<StringDictionary> {
        let t:Future<string>=this.sendRequest(targetUrl, null, 'GET', timeoutMillis);
        return t.map((s:string)=>{
            try {
                return JSON.parse(s);
            } catch (error) {
                throw Error("XMLHttpClient::jsonCall: Failed to parse response: " + s);
            }
        });
    }

    stringGet(targetUrl:string, timeoutMillis?:number):Future<string> {
        var f:FormData;
        return this.sendRequest(targetUrl, null, 'GET', timeoutMillis);
    }

    jsonPost(targetUrl:string, jsonObj?:StringDictionary, timeoutMillis?:number):Future<StringDictionary> {
        let body:string = jsonObj && JSON.stringify(jsonObj);
        let t:Future<string>=this.sendRequest(targetUrl, body, 'POST', timeoutMillis);
        return t.map((s:string)=>{
            try {
                return JSON.parse(s);
            } catch (error) {
                throw Error("XMLHttpClient::jsonCall: Failed to parse response: " + s);
            }
        });
    }

    /*
     this method is intended to support both react and react-native.
     http://doochik.com/2015/11/27/FormData-in-React-Native.html
     https://github.com/facebook/react-native/blob/56fef9b6225ffc1ba87f784660eebe842866c57d/Libraries/Network/FormData.js#L34:
     */
    postMultipart(targetUrl:string, formData:FormData):Future<void> {
        
        var promise = new Promise<void>("XMLHttpClient::postMultipart" + targetUrl);
        var xmlHttpRequest = new XMLHttpRequest();
        
        xmlHttpRequest.onreadystatechange = () => {
            if (xmlHttpRequest.readyState === 4) {
                if ((xmlHttpRequest.status !== 200) && (xmlHttpRequest.status !== 304)) {
                    Log.error('XMLHttpClient::postObject call failed with ' + xmlHttpRequest.status + ":" + xmlHttpRequest.statusText + ".  targetURL: " + targetUrl);
                    promise.failure('XMLHttpClient::jsonCall: call failed with ' + xmlHttpRequest.status + ":" + xmlHttpRequest.statusText + ".  targetURL: " + targetUrl);
                } else {
                    Log.debug("XMLHttpClient::postObject: Got successful response: " + xmlHttpRequest.responseText);
                    promise.success(null);
                }
            }
        };

        Log.debug("XmlHttpClient:postMultipart: " + targetUrl);
        Log.debug("XmlHttpClient:postMultipart: " + formData);
        xmlHttpRequest.open('POST', targetUrl, true);
        xmlHttpRequest.send(formData);
        return promise.future;

    }

    private sendRequest(targetUrl:string, body:string, method:string, timeoutMillis = 30000):Future<string> {

        //var promise = new Promise<StringDictionary>("XMLHttpClient::jsonCall");
        var promise = new Promise<string>("XMLHttpClient::" + targetUrl + ":" + body);

        if (method !== 'GET' && method !== 'POST') {
            promise.failure(method + " method not supported.");
            return promise.future;
        }

        var successCallback = (request:XMLHttpRequest) => {
                Log.debug("XMLHttpClient: Got successful response: " + request.responseText);
                promise.success(request.responseText);
        };

        var errorCallback = (request:XMLHttpRequest) => {
            Log.error('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText
                + ".  targetURL: " + targetUrl + "  method: " + method + "  body: " + body);
            promise.failure('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
        };

        var timeoutCallback = () => {
            if (promise.isComplete()) {
                Log.error('XMLHttpClient::jsonCall: Timeout received but Promise was already complete.'
                    + ".  targetURL: " + targetUrl + "  method: " + method + "  body: " + body);
            } else {
                Log.error('XMLHttpClient::jsonCall: Timeout received.'
                    + ".  targetURL: " + targetUrl + "  method: " + method + "  body: " + body);
                promise.failure('XMLHttpClient::jsonCall: Call timed out');
            }
        };

        var wRequestTimer = null;
        var xmlHttpRequest = new XMLHttpRequest();

        xmlHttpRequest.onreadystatechange = () => {
            if (xmlHttpRequest.readyState === 4) {
                if (wRequestTimer) {
                    clearTimeout(wRequestTimer);
                }
                if ((xmlHttpRequest.status !== 200) && (xmlHttpRequest.status !== 304)) {
                    errorCallback(xmlHttpRequest);
                } else {
                    successCallback(xmlHttpRequest);
                }
            }
        };

        Log.debug("XmlHttpClient: Calling: " + targetUrl);
        Log.debug("XmlHttpClient: body: " + body);

        xmlHttpRequest.open(method, targetUrl, true);
        xmlHttpRequest.setRequestHeader("Accept", "gzip");
        
        if (timeoutMillis) {
            //check for timeout support on the xmlHttpRequest itself
            if (typeof xmlHttpRequest.ontimeout !== "undefined") {
                xmlHttpRequest.timeout = timeoutMillis;
                xmlHttpRequest.ontimeout = timeoutCallback;
            } else {
                wRequestTimer = setTimeout(timeoutCallback, timeoutMillis);
            }
        }
        if (method === 'POST') {
            xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlHttpRequest.send(body);
        } else {
            xmlHttpRequest.send();
        }

        return promise.future;
    }
}



export interface Request {
}

export class Call implements Request {

    private static _lastCallId:number = 0;
    private static _lastSuccessfulActivityTime:Date = new Date();

    private _callId:number;
    private _cancelled:boolean;
    private _loggingOption:boolean;
    private _method:string;
    private _params:StringDictionary;
    private _performed:boolean;
    private _promise:Promise<StringDictionary>;
    private _responseHeaders:Dictionary<string>;
    private _service:string;
    private _sessionContext:SessionContext;
    private _systemContext:SystemContext;
    private _client:Client = ClientFactory.getClient();

    timeoutMillis:number;

    static nextCallId():number {
        return ++Call._lastCallId;
    }

    static createCall(service:string,
                      method:string,
                      params:StringDictionary,
                      sessionContext:SessionContext):Call {
        return new Call(service, method, params, sessionContext.systemContext, sessionContext);
    }

    static createCallWithoutSession(service:string,
                                    method:string,
                                    params:StringDictionary,
                                    systemContext:SystemContext):Call {
        return new Call(service, method, params, systemContext, null);
    }
    
    static get lastSuccessfulActivityTime():Date{
       return Call._lastSuccessfulActivityTime; 
    }

    constructor(service:string,
                method:string,
                params:StringDictionary,
                systemContext:SystemContext,
                sessionContext:SessionContext) {

        this._performed = false;
        this._cancelled = false;
        this._systemContext = systemContext;
        this._sessionContext = sessionContext;
        this._service = service;
        this._method = method;
        this._params = params;
        this._callId = Call.nextCallId();
        this._responseHeaders = null;
        this.timeoutMillis = 30000;

    }

    cancel() {
        Log.error("Needs implementation", "Call", "cancel");
    }

    perform():Future<StringDictionary> {

        if (this._performed) {
            return Future.createFailedFuture<StringDictionary>("Call::perform", "Call:perform(): Call is already performed");
        }
        this._performed = true;
        if (!this._systemContext) {
            return Future.createFailedFuture<StringDictionary>("Call::perform", "Call:perform(): SystemContext cannot be null");
        }

        var jsonObj:StringDictionary = {
            id: this._callId,
            method: this._method,
            params: this._params
        };

        var pathPrefix = "";
        if (this._systemContext && this._systemContext.urlString) {
            pathPrefix = this._systemContext.urlString;
            if (pathPrefix.charAt(pathPrefix.length - 1) !== '/') {
                pathPrefix += '/';
            }
        }
        var servicePath = pathPrefix + (this._service || "");
        return this._client.jsonPost(servicePath, jsonObj, this.timeoutMillis).map((result:StringDictionary)=>{
            Call._lastSuccessfulActivityTime = new Date();
            return result;
        });
    }

}

export class Get implements Request {

    private _performed:boolean;
    private _promise:Promise<StringDictionary>;
    private _url:string;
    private _client:Client = ClientFactory.getClient();

    timeoutMillis:number;

    static fromUrl(url:string):Get {
        return new Get(url);
    }

    constructor(url:string) {
        this._url = url;
        this._performed = false;
        this._promise = new Promise<StringDictionary>("catavolt.ws.Get");
        this.timeoutMillis = 30000;
    }

    cancel() {
        Log.error("Needs implementation", "Get", "cancel");
    }

    perform():Future<StringDictionary> {

        if (this._performed) {
            return this.complete(new Failure<StringDictionary>("Get:perform(): Get is already performed")).future;
        }
        this._performed = true;

        return this._client.jsonGet(this._url, this.timeoutMillis);
    }

    private complete(t:Try<StringDictionary>):Promise<StringDictionary> {
        if (!this._promise.isComplete()) {
            this._promise.complete(t);
        }
        return this._promise;
    }
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
    /*host: string;
     path: string;
     port: number;
     scheme: string;
     toURLString():string;*/
    
    urlString:string;
    appVersion:string;
}
