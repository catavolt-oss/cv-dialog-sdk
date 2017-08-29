"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var FetchClient = (function () {
    function FetchClient() {
    }
    FetchClient.prototype.post = function (url, jsonBody) {
        var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json;charset=UTF-8' };
        var body = jsonBody && JSON.stringify(jsonBody);
        return this.processRequest(url, body, 'POST', headers).then(function (response) {
            return response.json().then(function (json) { return new JsonClientResponse(json, response.status); });
        });
    };
    FetchClient.prototype.processRequest = function (url, body, method, headers) {
        return new Promise(function (resolve, reject) {
            var requestHeaders = new Headers(headers);
            requestHeaders.append('Accept', 'gzip');
            var init = { method: method, mode: 'cors', headers: headers, body: body };
            if (!['GET', 'POST', 'PUT', 'DELETE'].some(function (v) { return method === v; })) {
                reject(new Error("FetchClient::processRequest: Unsupported method: " + method));
            }
            else {
                fetch(url, init)
                    .then(function (response) {
                    util_1.Log.debug("FetchClient: succeeded with: " + response);
                    resolve(response);
                })
                    .catch(function (error) {
                    util_1.Log.debug("FetchClient: failed with " + error);
                    reject(error);
                });
            }
        });
    };
    return FetchClient;
}());
exports.FetchClient = FetchClient;
var ClientResponse = (function () {
    function ClientResponse(value, statusCode) {
        this.value = value;
        this.statusCode = statusCode;
    }
    return ClientResponse;
}());
exports.ClientResponse = ClientResponse;
var JsonClientResponse = (function (_super) {
    __extends(JsonClientResponse, _super);
    function JsonClientResponse(value, statusCode) {
        return _super.call(this, value, statusCode) || this;
    }
    return JsonClientResponse;
}(ClientResponse));
exports.JsonClientResponse = JsonClientResponse;
var TextClientResponse = (function (_super) {
    __extends(TextClientResponse, _super);
    function TextClientResponse(value, statusCode) {
        return _super.call(this, value, statusCode) || this;
    }
    return TextClientResponse;
}(ClientResponse));
var ClientFactory = (function () {
    function ClientFactory() {
    }
    ClientFactory.getClient = function () {
        return new FetchClient();
    };
    return ClientFactory;
}());
exports.ClientFactory = ClientFactory;
