/**
 * Created by rburson on 3/9/15.
 */

///<reference path="../fp/references.ts"/>

module catavolt.ws {


    //We'll abstract the client as we may later want to use a json-p client or websocket or other
    interface Client {
        jsonCall(targetUrl:string, jsonObj:StringDictionary, timeoutMillis:number):Future<StringDictionary>;
    }

    class XMLHttpClient {

        jsonCall(targetUrl:string, jsonObj:StringDictionary, timeoutMillis:number):Future<StringDictionary> {

            var promise = new Promise<StringDictionary>("XMLHttpClient::jsonCall");

            var successCallback = (request:XMLHttpRequest) => {
                try {
                    var responseObj = JSON.parse(request.responseText);
                } catch (error) {
                    promise.failure("XMLHttpClient::jsonCall: Failed to parse response: " + request.responseText);
                }
                promise.success(responseObj);
            };

            var errorCallback = (request:XMLHttpRequest) => {
                promise.failure('XMLHttpClient::jsonCall: call failed with' + request.status);
            };

            var timeoutCallback = () => {
                if (promise.isComplete()) {
                    Log.error('XMLHttpClient::jsonCall: Timeoutreceived but Promise was already complete.');
                } else {
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

            // If we're working with a newer implementation, we can just set the timeout property and register
            // the timeout callback.  If not, we have to set a timer that will execute the timeout callback.
            // We can cancel the timer if/when the server responds.
            if (timeoutMillis) {
                if (typeof xmlHttpRequest.ontimeout !== "undefined") {
                    xmlHttpRequest.timeout = timeoutMillis;
                    xmlHttpRequest.ontimeout = timeoutCallback;
                } else {
                    wRequestTimer = setTimeout(timeoutCallback, timeoutMillis);
                }
            }

            var body = JSON.stringify(jsonObj);

            xmlHttpRequest.open('POST', targetUrl, true);
            xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlHttpRequest.send(body);

            return promise.future;
        }
    }

    export interface Request {}

    export class Call implements Request{

        private static _lastCallId:number = 0;

        private _callId: number;
        private _callString: string;
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
            this._callString = null;
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

            var servicePath = this._systemContext.toURLString() + (this._service || "");

            this._client.jsonCall(servicePath, jsonObj, this.timeoutMillis);

            Log.info("Calling " + servicePath + " with " + this._callString, "Call", "perform");

        }

        private complete(t:Try<StringDictionary>):Promise<StringDictionary> {
            if(!this._promise.isComplete()) {
               this._promise.complete(t);
            }
            return this._promise;
        }


    }

}
