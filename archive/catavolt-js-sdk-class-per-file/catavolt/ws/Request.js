/**
 * Created by rburson on 3/9/15.
 */
import { Failure } from '../fp/Failure';
import { Future } from '../fp/Future';
import { Promise } from '../fp/Promise';
import { Log } from '../util/Log';
export class XMLHttpClient {
    jsonGet(targetUrl, timeoutMillis) {
        return this.jsonCall(targetUrl, null, 'GET', timeoutMillis);
    }
    jsonPost(targetUrl, jsonObj, timeoutMillis) {
        return this.jsonCall(targetUrl, jsonObj, 'POST', timeoutMillis);
    }
    jsonCall(targetUrl, jsonObj, method = 'GET', timeoutMillis = 30000) {
        var body = jsonObj && JSON.stringify(jsonObj);
        //var promise = new Promise<StringDictionary>("XMLHttpClient::jsonCall");
        var promise = new Promise("XMLHttpClient::" + targetUrl + ":" + body);
        if (method !== 'GET' && method !== 'POST') {
            promise.failure(method + " method not supported.");
            return promise.future;
        }
        var successCallback = (request) => {
            try {
                Log.debug("XMLHttpClient: Got successful response: " + request.responseText);
                var responseObj = JSON.parse(request.responseText);
                promise.success(responseObj);
            }
            catch (error) {
                promise.failure("XMLHttpClient::jsonCall: Failed to parse response: " + request.responseText);
            }
        };
        var errorCallback = (request) => {
            Log.error('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
            promise.failure('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
        };
        var timeoutCallback = () => {
            if (promise.isComplete()) {
                Log.error('XMLHttpClient::jsonCall: Timeoutreceived but Promise was already complete.');
            }
            else {
                Log.error('XMLHttpClient::jsonCall: Timeoutreceived.');
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
                    if (errorCallback) {
                        errorCallback(xmlHttpRequest);
                    }
                }
                else {
                    successCallback(xmlHttpRequest);
                }
            }
        };
        if (timeoutMillis) {
            //check for timeout support on the xmlHttpRequest itself
            if (typeof xmlHttpRequest.ontimeout !== "undefined") {
                xmlHttpRequest.timeout = timeoutMillis;
                xmlHttpRequest.ontimeout = timeoutCallback;
            }
            else {
                wRequestTimer = setTimeout(timeoutCallback, timeoutMillis);
            }
        }
        Log.debug("XmlHttpClient: Calling: " + targetUrl);
        Log.debug("XmlHttpClient: body: " + body);
        xmlHttpRequest.open(method, targetUrl, true);
        if (method === 'POST') {
            xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlHttpRequest.send(body);
        }
        else {
            xmlHttpRequest.send();
        }
        return promise.future;
    }
}
export class Call {
    constructor(service, method, params, systemContext, sessionContext) {
        this._client = new XMLHttpClient();
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
    static nextCallId() {
        return ++Call._lastCallId;
    }
    static createCall(service, method, params, sessionContext) {
        return new Call(service, method, params, sessionContext.systemContext, sessionContext);
    }
    static createCallWithoutSession(service, method, params, systemContext) {
        return new Call(service, method, params, systemContext, null);
    }
    cancel() {
        Log.error("Needs implementation", "Call", "cancel");
    }
    perform() {
        if (this._performed) {
            return Future.createFailedFuture("Call::perform", "Call:perform(): Call is already performed");
        }
        this._performed = true;
        if (!this._systemContext) {
            return Future.createFailedFuture("Call::perform", "Call:perform(): SystemContext cannot be null");
        }
        var jsonObj = {
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
        return this._client.jsonPost(servicePath, jsonObj, this.timeoutMillis);
    }
}
Call._lastCallId = 0;
export class Get {
    constructor(url) {
        this._client = new XMLHttpClient();
        this._url = url;
        this._performed = false;
        this._promise = new Promise("catavolt.ws.Get");
        this.timeoutMillis = 30000;
    }
    static fromUrl(url) {
        return new Get(url);
    }
    cancel() {
        Log.error("Needs implementation", "Get", "cancel");
    }
    perform() {
        if (this._performed) {
            return this.complete(new Failure("Get:perform(): Get is already performed")).future;
        }
        this._performed = true;
        return this._client.jsonGet(this._url, this.timeoutMillis);
    }
    complete(t) {
        if (!this._promise.isComplete()) {
            this._promise.complete(t);
        }
        return this._promise;
    }
}
