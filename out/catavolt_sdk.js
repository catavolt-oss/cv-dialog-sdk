/**
 * Created by rburson on 3/6/15.
 */
var catavolt;
(function (catavolt) {
    var util;
    (function (util) {
        var ArrayUtil = (function () {
            function ArrayUtil() {
            }
            ArrayUtil.deepCopy = function (source) {
                var target = new Array();
                source.forEach(function (item) {
                    target.push(item);
                });
                return target;
            };
            return ArrayUtil;
        })();
        util.ArrayUtil = ArrayUtil;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
var catavolt;
(function (catavolt) {
    var util;
    (function (util) {
        var Log = (function () {
            function Log() {
            }
            Log.info = function (message, obj, method) {
                if (obj || method) {
                    console.log(obj + "::" + method + " : " + message);
                }
                else {
                    console.log(message);
                }
            };
            Log.error = function (message, obj, method) {
                if (obj || method) {
                    console.error(obj + "::" + method + " : " + message);
                }
                else {
                    console.error(message);
                }
            };
            return Log;
        })();
        util.Log = Log;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/9/15.
 */
/**
 * Created by rburson on 3/6/15.
 */
//util
///<reference path="ArrayUtil.ts"/>
///<reference path="Log.ts"/>
///<reference path="Types.ts"/>
var ArrayUtil = catavolt.util.ArrayUtil;
var Log = catavolt.util.Log;
/**
 * Created by rburson on 3/5/15.
 */
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Try = (function () {
            function Try() {
            }
            Try.prototype.failure = function () {
                return null;
            };
            Try.prototype.isFailure = function () {
                return false;
            };
            Try.prototype.isSuccess = function () {
                return false;
            };
            Try.prototype.success = function () {
                return null;
            };
            return Try;
        })();
        fp.Try = Try;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/5/15.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../fp/references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Failure = (function (_super) {
            __extends(Failure, _super);
            function Failure(_error) {
                _super.call(this);
                this._error = _error;
                console.log("test");
            }
            Failure.prototype.failure = function () {
                return this._error;
            };
            Failure.prototype.isFailure = function () {
                return true;
            };
            return Failure;
        })(fp.Try);
        fp.Failure = Failure;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/5/15.
 */
///<reference path="../util/references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Future = (function () {
            /** --------------------- CONSTRUCTORS ------------------------------*/
            function Future(_label) {
                this._label = _label;
                this._completionListeners = new Array();
            }
            /** --------------------- PUBLIC STATIC ------------------------------*/
            Future.createCompletedFuture = function (label, result) {
                var f = new Future(label);
                return f.complete(result);
            };
            Future.createFuture = function (label) {
                var f = new Future(label);
                return f;
            };
            /** --------------------- PUBLIC ------------------------------*/
            Future.prototype.isComplete = function () {
                return !!this._result;
            };
            Future.prototype.isCompleteWithFailure = function () {
                return !!this._result && this._result.isFailure();
            };
            Future.prototype.isCompleteWithSuccess = function () {
                return !!this._result && this._result.isSuccess();
            };
            /*  TODO - figure out how to scope this at the 'module' level */
            Future.prototype.complete = function (t) {
                var _this = this;
                var notifyList = new Array();
                if (t) {
                    if (!this._result) {
                        this._result = t;
                        /* capture the listener set to prevent missing a notification */
                        notifyList = ArrayUtil.deepCopy(this._completionListeners);
                    }
                    else {
                        Log.error("Future::complete() : Future is already completed");
                    }
                    notifyList.forEach(function (listener) {
                        listener(_this._result);
                    });
                }
                else {
                    Log.error("Future::complete() : Can't complete Future with null result");
                }
                return this;
            };
            return Future;
        })();
        fp.Future = Future;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/5/15.
 */
///<reference path="../fp/references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Success = (function (_super) {
            __extends(Success, _super);
            function Success(_value) {
                _super.call(this);
                this._value = _value;
            }
            Success.prototype.isSuccess = function () {
                return true;
            };
            Success.prototype.success = function () {
                return this._value;
            };
            return Success;
        })(fp.Try);
        fp.Success = Success;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
///<reference path="../fp/references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Promise = (function () {
            function Promise(label) {
                this._future = fp.Future.createFuture(label);
            }
            /** --------------------- PUBLIC ------------------------------*/
            Promise.prototype.isComplete = function () {
                return this._future.isComplete();
            };
            Promise.prototype.complete = function (t) {
                this._future.complete(t);
                return this;
            };
            Promise.prototype.failure = function (error) {
                this.complete(new fp.Failure(error));
            };
            Object.defineProperty(Promise.prototype, "future", {
                get: function () {
                    return this._future;
                },
                enumerable: true,
                configurable: true
            });
            Promise.prototype.success = function (value) {
                this.complete(new fp.Success(value));
            };
            return Promise;
        })();
        fp.Promise = Promise;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../fp/references.ts"/>
/**
 * Created by rburson on 3/6/15.
 */
//fp
///<reference path="Try.ts"/>
///<reference path="Failure.ts"/>
///<reference path="Future.ts"/>
///<reference path="Success.ts"/>
///<reference path="Promise.ts"/>
///<reference path="Types.ts"/>
var Try = catavolt.fp.Try;
var Failure = catavolt.fp.Failure;
var Success = catavolt.fp.Success;
var Future = catavolt.fp.Future;
var Promise = catavolt.fp.Promise;
/**
 * Created by rburson on 3/9/15.
 */
/**
 * Created by rburson on 3/9/15.
 */
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../fp/references.ts"/>
var catavolt;
(function (catavolt) {
    var ws;
    (function (ws) {
        var XMLHttpClient = (function () {
            function XMLHttpClient() {
            }
            XMLHttpClient.prototype.jsonCall = function (targetUrl, jsonObj, timeoutMillis) {
                var promise = new Promise("XMLHttpClient::jsonCall");
                var successCallback = function (request) {
                    try {
                        var responseObj = JSON.parse(request.responseText);
                    }
                    catch (error) {
                        promise.failure("XMLHttpClient::jsonCall: Failed to parse response: " + request.responseText);
                    }
                    promise.success(responseObj);
                };
                var errorCallback = function (request) {
                    promise.failure('XMLHttpClient::jsonCall: call failed with' + request.status);
                };
                var timeoutCallback = function () {
                    if (promise.isComplete()) {
                        Log.error('XMLHttpClient::jsonCall: Timeoutreceived but Promise was already complete.');
                    }
                    else {
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
                            if (errorCallback) {
                                errorCallback(xmlHttpRequest);
                            }
                        }
                        else {
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
                    }
                    else {
                        wRequestTimer = setTimeout(timeoutCallback, timeoutMillis);
                    }
                }
                var body = JSON.stringify(jsonObj);
                xmlHttpRequest.open('POST', targetUrl, true);
                xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xmlHttpRequest.send(body);
                return promise.future;
            };
            return XMLHttpClient;
        })();
        var Call = (function () {
            function Call(service, method, params, systemContext, sessionContext) {
                this._client = new XMLHttpClient();
                this._performed = false;
                this._cancelled = false;
                this._systemContext = systemContext;
                this._sessionContext = sessionContext;
                this._service = service;
                this._method = method;
                this._params = params;
                this._promise = new Promise("catavolt.ws.Call");
                this._callId = Call.nextCallId();
                this._responseHeaders = null;
                this._callString = null;
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
                Log.error("Needs implementation", "Call", "cancel");
            };
            Call.prototype.perform = function () {
                if (this._performed) {
                    return this.complete(new Failure("Call:perform(): Call is already performed")).future;
                }
                this._performed = true;
                if (!this._systemContext) {
                    return this.complete(new Failure("Call:perform(): SystemContext cannot be null")).future;
                }
                var jsonObj = {
                    id: this._callId,
                    method: this._method,
                    params: this._params
                };
                var servicePath = this._systemContext.toURLString() + (this._service || "");
                this._client.jsonCall(servicePath, jsonObj, this.timeoutMillis);
                Log.info("Calling " + servicePath + " with " + this._callString, "Call", "perform");
            };
            Call.prototype.complete = function (t) {
                if (!this._promise.isComplete()) {
                    this._promise.complete(t);
                }
                return this._promise;
            };
            Call._lastCallId = 0;
            return Call;
        })();
        ws.Call = Call;
    })(ws = catavolt.ws || (catavolt.ws = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
var Call = catavolt.ws.Call;
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../fp/references.ts"/>
///<reference path="../util/references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DialogTriple = (function () {
            function DialogTriple() {
            }
            //TODO
            DialogTriple.extractTriple = function (jsonObject, OType, ignoreRedirection, extractor) {
                return null;
            };
            //TODO
            DialogTriple.extractValue = function (jsonObject, OType, ignoreRedirection, extractor) {
                return null;
            };
            return DialogTriple;
        })();
        dialog.DialogTriple = DialogTriple;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../fp/references.ts"/>
///<reference path="../ws/references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var SessionContextImpl = (function () {
            function SessionContextImpl(sessionHandle, userName, currentDivision, serverVersion, systemContext) {
                this.sessionHandle = sessionHandle;
                this.userName = userName;
                this.currentDivision = currentDivision;
                this.serverVersion = serverVersion;
                this.systemContext = systemContext;
                this._remoteSession = true;
            }
            //TODO
            SessionContextImpl.fromWSCreateSessionResult = function (jsonObject, systemContext) {
                return null;
            };
            SessionContextImpl.createSessionContext = function (gatewayHost, tenantId, clientType, userId, password) {
                var sessionContext = new SessionContextImpl(null, userId, "", null, null);
                sessionContext._gatewayHost = gatewayHost;
                sessionContext._tenantId = tenantId;
                sessionContext._clientType = clientType;
                sessionContext._userId = userId;
                sessionContext._password = password;
                sessionContext._remoteSession = false;
                return sessionContext;
            };
            Object.defineProperty(SessionContextImpl.prototype, "clientType", {
                get: function () {
                    return this._clientType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "gatewayHost", {
                get: function () {
                    return this._gatewayHost;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "isLocalSession", {
                get: function () {
                    return !this._remoteSession;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "isRemoteSession", {
                get: function () {
                    return this._remoteSession;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "password", {
                get: function () {
                    return this._password;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "tenantId", {
                get: function () {
                    return this._tenantId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "userId", {
                get: function () {
                    return this._userId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "online", {
                set: function (online) {
                    this._remoteSession = online;
                },
                enumerable: true,
                configurable: true
            });
            return SessionContextImpl;
        })();
        dialog.SessionContextImpl = SessionContextImpl;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../ws/references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var SystemContextImpl = (function () {
            function SystemContextImpl(_scheme, _host, _port, _path) {
                this._scheme = _scheme;
                this._host = _host;
                this._port = _port;
                this._path = _path;
            }
            Object.defineProperty(SystemContextImpl.prototype, "scheme", {
                get: function () {
                    return this._scheme;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemContextImpl.prototype, "host", {
                get: function () {
                    return this._host;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemContextImpl.prototype, "port", {
                get: function () {
                    return this._port;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SystemContextImpl.prototype, "path", {
                get: function () {
                    return this._path;
                },
                enumerable: true,
                configurable: true
            });
            SystemContextImpl.prototype.toURLString = function () {
                var urlString = "";
                if (this._host) {
                    if (this._scheme) {
                        urlString += this._scheme + "://";
                    }
                    urlString += this._host;
                    if (this.port) {
                        urlString += ":" + this._port;
                    }
                    urlString += "/";
                }
                if (this._path) {
                    urlString += this._path + "/";
                }
                return urlString;
            };
            return SystemContextImpl;
        })();
        dialog.SystemContextImpl = SystemContextImpl;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var SessionService = (function () {
            function SessionService() {
            }
            SessionService.createSession = function (tenantId, userId, password, clientType, systemContext) {
                var method = "createSessionDirectly";
            };
            return SessionService;
        })();
        dialog.SessionService = SessionService;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
//dialog
///<reference path="DialogTriple.ts"/>
///<reference path="SessionContextImpl.ts"/>
///<reference path="SystemContextImpl.ts"/>
///<reference path="SessionService.ts"/>
var DialogTriple = catavolt.dialog.DialogTriple;
var SessionContextImpl = catavolt.dialog.SessionContextImpl;
var SystemContextImpl = catavolt.dialog.SystemContextImpl;
var SessionService = catavolt.dialog.SessionService;
/**
 * Created by rburson on 3/6/15.
 */
//util
///<reference path="util/references.ts"/>
//fp
///<reference path="fp/references.ts"/>
//ws
///<reference path="ws/references.ts"/>
//dialog
///<reference path="dialog/references.ts"/>
///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        describe("Future", function () {
            it("should be created successfully with Try", function () {
                var f = fp.Future.createCompletedFuture("test", new fp.Success("successfulValue"));
            });
        });
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
//# sourceMappingURL=catavolt_sdk.js.map