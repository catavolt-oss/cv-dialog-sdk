/**
 * Created by rburson on 3/9/15.
 */

///<reference path="../fp/references.ts"/>

module catavolt.ws {


    //We'll abstract the client as we may later want to use a json-p client or websocket or other
    export interface Client {
        jsonGet(targetUrl:string, timeoutMillis?:number):Future<StringDictionary>;
        jsonPost(targetUrl:string, jsonObj?:StringDictionary, timeoutMillis?:number):Future<StringDictionary>;
        jsonCall(targetUrl:string, jsonObj?:StringDictionary, method?:string, timeoutMillis?:number):Future<StringDictionary>;
    }

    export class XMLHttpClient implements Client{

        jsonGet(targetUrl:string, timeoutMillis?:number):Future<StringDictionary>{
            return this.jsonCall(targetUrl, null, 'GET', timeoutMillis);
        }

        jsonPost(targetUrl:string, jsonObj?:StringDictionary, timeoutMillis?:number):Future<StringDictionary> {
            return this.jsonCall(targetUrl, jsonObj, 'POST', timeoutMillis);
        }

        jsonCall(targetUrl:string, jsonObj?:StringDictionary, method = 'GET', timeoutMillis = 30000):Future<StringDictionary> {

            var promise = new Promise<StringDictionary>("XMLHttpClient::jsonCall");

            if (method !== 'GET' && method !== 'POST') {
                promise.failure(method + " method not supported.");
                return promise.future;
            }

            var successCallback = (request:XMLHttpRequest) => {
                try {
                    Log.info("Got successful response: " + request.responseText);
                    var responseObj = JSON.parse(request.responseText);
                } catch (error) {
                    promise.failure("XMLHttpClient::jsonCall: Failed to parse response: " + request.responseText);
                }
                promise.success(responseObj);
            };

            var errorCallback = (request:XMLHttpRequest) => {
                Log.error('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText + request.getAllResponseHeaders());
                promise.failure('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
            };

            var timeoutCallback = () => {
                if (promise.isComplete()) {
                    Log.error('XMLHttpClient::jsonCall: Timeoutreceived but Promise was already complete.');
                } else {
                    Log.error('XMLHttpClient::jsonCall: Timeoutreceived.');
                    promise.failure('XMLHttpClient::jsonCall: Call timed out');
                }
            };

            var wRequestTimer = null;
            var xmlHttpRequest = new XMLHttpRequest();

            xmlHttpRequest.onreadystatechange = () => {
                if (xmlHttpRequest.readyState === 4) {
                    if (wRequestTimer) { clearTimeout(wRequestTimer); }
                    if ((xmlHttpRequest.status !== 200) && (xmlHttpRequest.status !== 304)) {
                        if (errorCallback) {
                            errorCallback(xmlHttpRequest);
                        }
                    } else {
                        successCallback(xmlHttpRequest);
                    }
                }
            };

            if (timeoutMillis) {
                //check for timeout support on the xmlHttpRequest itself
                if (typeof xmlHttpRequest.ontimeout !== "undefined") {
                    xmlHttpRequest.timeout = timeoutMillis;
                    xmlHttpRequest.ontimeout = timeoutCallback;
                } else {
                    wRequestTimer = setTimeout(timeoutCallback, timeoutMillis);
                }
            }

            var body = jsonObj && JSON.stringify(jsonObj);

            Log.info("XmlHttpClient: Calling: " + targetUrl);
            Log.info("XmlHttpClient: body: " + body);

            xmlHttpRequest.open(method, targetUrl, true);
            if(method === 'POST'){
                xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xmlHttpRequest.send(body);
            } else {
                xmlHttpRequest.send();
            }

            return promise.future;
        }
    }

    export interface Request {}

    export class Call implements Request{

        private static _lastCallId:number = 0;

        private _callId: number;
        private _cancelled: boolean;
        private _loggingOption: boolean;
        private _method: string;
        private _params: StringDictionary;
        private _performed: boolean;
        private _promise: Promise<StringDictionary>;
        private _responseHeaders: Dictionary<string>;
        private _service: string;
        private _sessionContext: SessionContext;
        private _systemContext: SystemContext;
        private _client:Client = new XMLHttpClient();

        timeoutMillis: number;

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
            this._promise = new Promise<StringDictionary>("catavolt.ws.Call");
            this._callId = Call.nextCallId();
            this._responseHeaders = null;
            this.timeoutMillis = 30000;

        }

        cancel(){
            Log.error("Needs implementation", "Call", "cancel");
        }

        perform():Future<StringDictionary> {

            if(this._performed) {
                return this.complete(new Failure<StringDictionary>("Call:perform(): Call is already performed")).future;
            }
            this._performed = true;
            if(!this._systemContext) {
                return this.complete(new Failure<StringDictionary>("Call:perform(): SystemContext cannot be null")).future;
            }

            var jsonObj:StringDictionary = {
                id: this._callId,
                method: this._method,
                params: this._params
            };

            var servicePath = this._systemContext.urlString + (this._service || "");
            return this._client.jsonPost(servicePath, jsonObj, this.timeoutMillis);

        }

        private complete(t:Try<StringDictionary>):Promise<StringDictionary> {
            if(!this._promise.isComplete()) {
               this._promise.complete(t);
            }
            return this._promise;
        }


    }

    export class Get implements Request {

        private _performed:boolean;
        private _promise:Promise<StringDictionary>;
        private _url:string;
        private _client:Client = new XMLHttpClient();

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

        cancel(){
            Log.error("Needs implementation", "Get", "cancel");
        }

        perform():Future<StringDictionary> {

            if(this._performed) {
                return this.complete(new Failure<StringDictionary>("Get:perform(): Get is already performed")).future;
            }
            this._performed = true;

            Log.info("Calling " + this._url + "Get", "perform");
            return this._client.jsonGet(this._url, this.timeoutMillis);
        }

        private complete(t:Try<StringDictionary>):Promise<StringDictionary> {
            if(!this._promise.isComplete()) {
                this._promise.complete(t);
            }
            return this._promise;
        }
    }


}
