"use strict";
var fp_1 = require("./fp");
var util_1 = require("./util");
var fp_2 = require("./fp");
var fp_3 = require("./fp");
var ClientFactory = (function () {
    function ClientFactory() {
    }
    ClientFactory.getClient = function () {
        return new XMLHttpClient();
    };
    return ClientFactory;
}());
exports.ClientFactory = ClientFactory;
var XMLHttpClient = (function () {
    function XMLHttpClient() {
    }
    XMLHttpClient.prototype.jsonGet = function (targetUrl, timeoutMillis) {
        var t = this.sendRequest(targetUrl, null, 'GET', timeoutMillis);
        return t.map(function (s) {
            try {
                return JSON.parse(s);
            }
            catch (error) {
                throw Error("XMLHttpClient::jsonCall: Failed to parse response: " + s);
            }
        });
    };
    XMLHttpClient.prototype.stringGet = function (targetUrl, timeoutMillis) {
        var f;
        return this.sendRequest(targetUrl, null, 'GET', timeoutMillis);
    };
    XMLHttpClient.prototype.jsonPost = function (targetUrl, jsonObj, timeoutMillis) {
        var body = jsonObj && JSON.stringify(jsonObj);
        var t = this.sendRequest(targetUrl, body, 'POST', timeoutMillis);
        return t.map(function (s) {
            try {
                return JSON.parse(s);
            }
            catch (error) {
                throw Error("XMLHttpClient::jsonCall: Failed to parse response: " + s);
            }
        });
    };
    /*
     this method is intended to support both react and react-native.
     http://doochik.com/2015/11/27/FormData-in-React-Native.html
     https://github.com/facebook/react-native/blob/56fef9b6225ffc1ba87f784660eebe842866c57d/Libraries/Network/FormData.js#L34:
     */
    XMLHttpClient.prototype.postMultipart = function (targetUrl, formData) {
        var promise = new fp_2.Promise("XMLHttpClient::postMultipart" + targetUrl);
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onreadystatechange = function () {
            if (xmlHttpRequest.readyState === 4) {
                if ((xmlHttpRequest.status !== 200) && (xmlHttpRequest.status !== 304)) {
                    util_1.Log.error('XMLHttpClient::postObject call failed with ' + xmlHttpRequest.status + ":" + xmlHttpRequest.statusText + ".  targetURL: " + targetUrl);
                    promise.failure('XMLHttpClient::jsonCall: call failed with ' + xmlHttpRequest.status + ":" + xmlHttpRequest.statusText + ".  targetURL: " + targetUrl);
                }
                else {
                    util_1.Log.debug("XMLHttpClient::postObject: Got successful response: " + xmlHttpRequest.responseText);
                    promise.success(null);
                }
            }
        };
        util_1.Log.debug("XmlHttpClient:postMultipart: " + targetUrl);
        util_1.Log.debug("XmlHttpClient:postMultipart: " + formData);
        xmlHttpRequest.open('POST', targetUrl, true);
        xmlHttpRequest.send(formData);
        return promise.future;
    };
    XMLHttpClient.prototype.sendRequest = function (targetUrl, body, method, timeoutMillis) {
        if (timeoutMillis === void 0) { timeoutMillis = 30000; }
        //var promise = new Promise<StringDictionary>("XMLHttpClient::jsonCall");
        var promise = new fp_2.Promise("XMLHttpClient::" + targetUrl + ":" + body);
        if (method !== 'GET' && method !== 'POST') {
            promise.failure(method + " method not supported.");
            return promise.future;
        }
        var successCallback = function (request) {
            util_1.Log.debug("XMLHttpClient: Got successful response: " + request.responseText);
            promise.success(request.responseText);
        };
        var errorCallback = function (request) {
            util_1.Log.error('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText
                + ".  targetURL: " + targetUrl + "  method: " + method + "  body: " + body);
            promise.failure('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
        };
        var timeoutCallback = function () {
            if (promise.isComplete()) {
                util_1.Log.error('XMLHttpClient::jsonCall: Timeout received but Promise was already complete.'
                    + ".  targetURL: " + targetUrl + "  method: " + method + "  body: " + body);
            }
            else {
                util_1.Log.error('XMLHttpClient::jsonCall: Timeout received.'
                    + ".  targetURL: " + targetUrl + "  method: " + method + "  body: " + body);
                promise.failure('XMLHttpClient::jsonCall: Call timed out');
            }
        };
        var wRequestTimer = null;
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onreadystatechange = function () {
            if (xmlHttpRequest.readyState === 4) {
                if (wRequestTimer) {
                    clearTimeout(wRequestTimer);
                }
                if ((xmlHttpRequest.status !== 200) && (xmlHttpRequest.status !== 304)) {
                    errorCallback(xmlHttpRequest);
                }
                else {
                    successCallback(xmlHttpRequest);
                }
            }
        };
        util_1.Log.debug("XmlHttpClient: Calling: " + targetUrl);
        util_1.Log.debug("XmlHttpClient: body: " + body);
        xmlHttpRequest.open(method, targetUrl, true);
        xmlHttpRequest.setRequestHeader("Accept", "gzip");
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
        if (method === 'POST') {
            xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlHttpRequest.send(body);
        }
        else {
            xmlHttpRequest.send();
        }
        return promise.future;
    };
    return XMLHttpClient;
}());
exports.XMLHttpClient = XMLHttpClient;
var Call = (function () {
    function Call(service, method, params, systemContext, sessionContext) {
        this._client = ClientFactory.getClient();
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
    Call.nextCallId = function () {
        return ++Call._lastCallId;
    };
    Call.createCall = function (service, method, params, sessionContext) {
        return new Call(service, method, params, sessionContext.systemContext, sessionContext);
    };
    Call.createCallWithoutSession = function (service, method, params, systemContext) {
        return new Call(service, method, params, systemContext, null);
    };
    Call.prototype.cancel = function () {
        util_1.Log.error("Needs implementation", "Call", "cancel");
    };
    Call.prototype.perform = function () {
        if (this._performed) {
            return fp_1.Future.createFailedFuture("Call::perform", "Call:perform(): Call is already performed");
        }
        this._performed = true;
        if (!this._systemContext) {
            return fp_1.Future.createFailedFuture("Call::perform", "Call:perform(): SystemContext cannot be null");
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
    };
    Call._lastCallId = 0;
    return Call;
}());
exports.Call = Call;
var Get = (function () {
    function Get(url) {
        this._client = ClientFactory.getClient();
        this._url = url;
        this._performed = false;
        this._promise = new fp_2.Promise("catavolt.ws.Get");
        this.timeoutMillis = 30000;
    }
    Get.fromUrl = function (url) {
        return new Get(url);
    };
    Get.prototype.cancel = function () {
        util_1.Log.error("Needs implementation", "Get", "cancel");
    };
    Get.prototype.perform = function () {
        if (this._performed) {
            return this.complete(new fp_3.Failure("Get:perform(): Get is already performed")).future;
        }
        this._performed = true;
        return this._client.jsonGet(this._url, this.timeoutMillis);
    };
    Get.prototype.complete = function (t) {
        if (!this._promise.isComplete()) {
            this._promise.complete(t);
        }
        return this._promise;
    };
    return Get;
}());
exports.Get = Get;
