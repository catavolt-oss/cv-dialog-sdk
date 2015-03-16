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
 * Created by rburson on 3/16/15.
 */
/**
 * Created by rburson on 3/6/15.
 */
//util
///<reference path="ArrayUtil.ts"/>
///<reference path="Log.ts"/>
///<reference path="Types.ts"/>
///<reference path="UserException.ts"/>
var ArrayUtil = catavolt.util.ArrayUtil;
var Log = catavolt.util.Log;
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../fp/references.ts"/>
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
            Object.defineProperty(Try.prototype, "failure", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Try.prototype, "isFailure", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Try.prototype, "isSuccess", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Try.prototype, "success", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
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
            }
            Object.defineProperty(Failure.prototype, "failure", {
                get: function () {
                    return this._error;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Failure.prototype, "isFailure", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
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
            Future.createSuccessfulFuture = function (label, value) {
                return Future.createCompletedFuture(label, new fp.Success(value));
            };
            Future.createFailedFuture = function (label, error) {
                return Future.createCompletedFuture(label, new fp.Failure(error));
            };
            Future.createFuture = function (label) {
                var f = new Future(label);
                return f;
            };
            /** --------------------- PUBLIC ------------------------------*/
            Future.prototype.bind = function (f) {
                var p = new fp.Promise('Future.bind:' + this._label);
                this.onComplete(function (t1) {
                    if (t1.isFailure) {
                        p.failure(t1.failure);
                    }
                    var a = t1.success;
                    try {
                        var mb = f(a);
                        mb.onComplete(function (t2) {
                            p.complete(t2);
                        });
                    }
                    catch (error) {
                        p.complete(new fp.Failure(error));
                    }
                });
                return p.future;
            };
            Object.defineProperty(Future.prototype, "failure", {
                get: function () {
                    return this._result ? this._result.failure : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Future.prototype, "isComplete", {
                get: function () {
                    return !!this._result;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Future.prototype, "isCompleteWithFailure", {
                get: function () {
                    return !!this._result && this._result.isFailure;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Future.prototype, "isCompleteWithSuccess", {
                get: function () {
                    return !!this._result && this._result.isSuccess;
                },
                enumerable: true,
                configurable: true
            });
            Future.prototype.map = function (f) {
                var p = new fp.Promise('Future.map:' + this._label);
                this.onComplete(function (t1) {
                    if (t1.isFailure) {
                        p.failure(t1.failure);
                    }
                    else {
                        var a = t1.success;
                        try {
                            var b = f(a);
                            p.success(b);
                        }
                        catch (error) {
                            p.complete(new fp.Failure(error));
                        }
                    }
                });
                return p.future;
            };
            Future.prototype.onComplete = function (listener) {
                this._result ? listener(this._result) : this._completionListeners.push(listener);
            };
            Future.prototype.onFailure = function (listener) {
                this.onComplete(function (t) {
                    t.isFailure && listener(t.failure);
                });
            };
            Future.prototype.onSuccess = function (listener) {
                this.onComplete(function (t) {
                    t.isSuccess && listener(t.success);
                });
            };
            Object.defineProperty(Future.prototype, "result", {
                get: function () {
                    return this._result;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Future.prototype, "success", {
                get: function () {
                    return this._result ? this.result.success : null;
                },
                enumerable: true,
                configurable: true
            });
            /** --------------------- MODULE ------------------------------*/
            //*** let's pretend this has module level visibility
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
            Object.defineProperty(Success.prototype, "isSuccess", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Success.prototype, "success", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
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
                return this._future.isComplete;
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
 * Created by rburson on 3/16/15.
 */
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Either = (function () {
            function Either() {
            }
            Either.left = function (left) {
                var either = new Either();
                either._left = left;
                return either;
            };
            Either.right = function (right) {
                var either = new Either();
                either._right = right;
                return either;
            };
            Object.defineProperty(Either.prototype, "isLeft", {
                get: function () {
                    return !!this._left;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Either.prototype, "isRight", {
                get: function () {
                    return !!this._right;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Either.prototype, "left", {
                get: function () {
                    return this._left;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Either.prototype, "right", {
                get: function () {
                    return this._right;
                },
                enumerable: true,
                configurable: true
            });
            return Either;
        })();
        fp.Either = Either;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
var Either = catavolt.fp.Either;
var Failure = catavolt.fp.Failure;
var Future = catavolt.fp.Future;
var Promise = catavolt.fp.Promise;
var Success = catavolt.fp.Success;
var Try = catavolt.fp.Try;
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
            XMLHttpClient.prototype.jsonGet = function (targetUrl, timeoutMillis) {
                return this.jsonCall(targetUrl, null, 'GET', timeoutMillis);
            };
            XMLHttpClient.prototype.jsonPost = function (targetUrl, jsonObj, timeoutMillis) {
                return this.jsonCall(targetUrl, jsonObj, 'POST', timeoutMillis);
            };
            XMLHttpClient.prototype.jsonCall = function (targetUrl, jsonObj, method, timeoutMillis) {
                if (method === void 0) { method = 'GET'; }
                if (timeoutMillis === void 0) { timeoutMillis = 30000; }
                var promise = new Promise("XMLHttpClient::jsonCall");
                if (method !== 'GET' && method !== 'POST') {
                    promise.failure(method + " method not supported.");
                    return promise.future;
                }
                var successCallback = function (request) {
                    try {
                        Log.info("Got successful response: " + request.responseText);
                        var responseObj = JSON.parse(request.responseText);
                    }
                    catch (error) {
                        promise.failure("XMLHttpClient::jsonCall: Failed to parse response: " + request.responseText);
                    }
                    promise.success(responseObj);
                };
                var errorCallback = function (request) {
                    Log.error('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText + request.getAllResponseHeaders());
                    promise.failure('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
                };
                var timeoutCallback = function () {
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
                var body = jsonObj && JSON.stringify(jsonObj);
                Log.info("XmlHttpClient: Calling: " + targetUrl);
                Log.info("XmlHttpClient: body: " + body);
                xmlHttpRequest.open(method, targetUrl, true);
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
        })();
        ws.XMLHttpClient = XMLHttpClient;
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
                var servicePath = this._systemContext.urlString + (this._service || "");
                return this._client.jsonPost(servicePath, jsonObj, this.timeoutMillis);
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
        var Get = (function () {
            function Get(url) {
                this._client = new XMLHttpClient();
                this._url = url;
                this._performed = false;
                this._promise = new Promise("catavolt.ws.Get");
                this.timeoutMillis = 30000;
            }
            Get.fromUrl = function (url) {
                return new Get(url);
            };
            Get.prototype.cancel = function () {
                Log.error("Needs implementation", "Get", "cancel");
            };
            Get.prototype.perform = function () {
                if (this._performed) {
                    return this.complete(new Failure("Get:perform(): Get is already performed")).future;
                }
                this._performed = true;
                Log.info("Calling " + this._url + "Get", "perform");
                return this._client.jsonGet(this._url, this.timeoutMillis);
            };
            Get.prototype.complete = function (t) {
                if (!this._promise.isComplete()) {
                    this._promise.complete(t);
                }
                return this._promise;
            };
            return Get;
        })();
        ws.Get = Get;
    })(ws = catavolt.ws || (catavolt.ws = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
var Call = catavolt.ws.Call;
var Get = catavolt.ws.Get;
/**
 * Created by rburson on 3/13/15.
 */
///<reference path="../fp/references.ts"/>
///<reference path="../util/references.ts"/>
///<reference path="../ws/references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var AppContextState;
        (function (AppContextState) {
            AppContextState[AppContextState["LOGGED_OUT"] = 0] = "LOGGED_OUT";
            AppContextState[AppContextState["LOGGED_IN"] = 1] = "LOGGED_IN";
        })(AppContextState || (AppContextState = {}));
        var AppContextValues = (function () {
            function AppContextValues(sessionContext, appWinDef, tenantSettings) {
                this.sessionContext = sessionContext;
                this.appWinDef = appWinDef;
                this.tenantSettings = tenantSettings;
            }
            return AppContextValues;
        })();
        var AppContext = (function () {
            function AppContext() {
                if (AppContext._singleton) {
                    throw new Error("Singleton instance already created");
                }
                this._deviceProps = [];
                this.setAppContextStateToLoggedOut();
                AppContext._singleton = this;
            }
            Object.defineProperty(AppContext, "defaultTTLInMillis", {
                get: function () {
                    return AppContext.ONE_DAY_IN_MILLIS;
                },
                enumerable: true,
                configurable: true
            });
            AppContext.singleton = function () {
                if (!AppContext._singleton) {
                    AppContext._singleton = new AppContext();
                }
                return AppContext._singleton;
            };
            Object.defineProperty(AppContext.prototype, "appWinDefTry", {
                get: function () {
                    return this._appWinDefTry;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppContext.prototype, "deviceProps", {
                get: function () {
                    return this._deviceProps;
                },
                enumerable: true,
                configurable: true
            });
            AppContext.prototype.login = function (gatewayHost, tenantId, clientType, userId, password) {
                if (this._appContextState === 1 /* LOGGED_IN */) {
                    return Future.createFailedFuture("AppContext::login", "User is already logged in");
                }
                var answer;
                var appContextValuesFr = loginOnline(gatewayHost, tenantId, clientType, userId, password, this.deviceProps);
            };
            Object.defineProperty(AppContext.prototype, "sessionContextTry", {
                get: function () {
                    return this._sessionContextTry;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppContext.prototype, "tenantSettingsTry", {
                get: function () {
                    return this._tenantSettingsTry;
                },
                enumerable: true,
                configurable: true
            });
            AppContext.prototype.finalizeContext = function (sessionContext, deviceProps) {
                dialog.SessionService.s;
            };
            AppContext.prototype.loginOnline = function (gatewayHost, tenantId, clientType, userId, password, deviceProps) {
                var _this = this;
                var systemContextFr = this.newSystemContextFr(gatewayHost, tenantId);
                return systemContextFr.bind(function (sc) {
                    _this.loginFromSystemContext(sc, tenantId, userId, password, deviceProps, clientType);
                });
            };
            AppContext.prototype.loginFromSystemContext = function (systemContext, tenantId, userId, password, deviceProps, clientType) {
                var _this = this;
                var sessionContextFuture = dialog.SessionService.createSession(tenantId, userId, password, clientType, systemContext);
                return sessionContextFuture.bind(function (sessionContext) {
                    return _this.finalizedContext(sessionContext, deviceProps);
                });
            };
            AppContext.prototype.newSystemContextFr = function (gatewayHost, tenantId) {
                var serviceEndpoint = dialog.GatewayService.getServiceEndpoint(tenantId, 'soi-json', gatewayHost);
                return serviceEndpoint.map(function (serviceEndpoint) {
                    return new dialog.SystemContextImpl(serviceEndpoint.serverAssignment);
                });
            };
            AppContext.prototype.setAppContextStateToLoggedIn = function (appContextValues) {
                this._appWinDefTry = new Success(appContextValues.appWinDef);
                this._tenantSettingsTry = new Success(appContextValues.tenantSettings);
                this._sessionContextTry = new Success(appContextValues.sessionContext);
                this._appContextState = 1 /* LOGGED_IN */;
            };
            AppContext.prototype.setAppContextStateToLoggedOut = function () {
                this._appWinDefTry = new Failure("Not logged in");
                this._tenantSettingsTry = new Failure('Not logged in"');
                this._sessionContextTry = new Failure('Not loggged in');
                this._appContextState = 0 /* LOGGED_OUT */;
            };
            AppContext.ONE_DAY_IN_MILLIS = 60 * 60 * 24 * 1000;
            return AppContext;
        })();
        dialog.AppContext = AppContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/13/15.
 */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var AppWinDef = (function () {
            function AppWinDef() {
            }
            return AppWinDef;
        })();
        dialog.AppWinDef = AppWinDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/16/15.
 */
///<reference path="../util/references.ts"/>
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
            DialogTriple.extractValue = function (jsonObject, Otype, extractor) {
                return DialogTriple._extractValue(jsonObject, Otype, false, extractor);
            };
            DialogTriple.extractTriple = function (jsonObject, OType, ignoreRedirection, extractor) {
                var result;
                if (!jsonObject) {
                    return new Failure('DialogTriple::extractTriple: cannot extract object of WS_OTYPE ' + OType + ' because json object is null');
                }
                else {
                    var ot = jsonObject['WS_OTYPE'];
                    if (!ot || OType !== ot) {
                        result = new Failure('DialogTriple:extractTriple: expected O_TYPE ' + OType + ' but found ' + ot);
                    }
                    else {
                        if (jsonObject['exception']) {
                            var dialogException = jsonObject['exception'];
                            result = new Failure(dialogException);
                        }
                        else if (jsonObject['redirection'] && !ignoreRedirection) {
                            var drt = dialog.Redirection.fromWSRedirection(jsonObject);
                            if (drt.isFailure) {
                                result = new Failure(drt.failure);
                            }
                            else {
                                result = new Success(Either.left(drt.success));
                            }
                        }
                        else {
                            if (extractor) {
                                var valueTry = extractor();
                                if (valueTry.isFailure) {
                                    result = new Failure(valueTry.failure);
                                }
                                else {
                                    result = new Success(Either.right(valueTry.success));
                                }
                            }
                            else {
                                result = new Failure('DialogTriple::extractTriple: Triple is not an exception or redirection and no value extractor was provided');
                            }
                        }
                    }
                }
                return result;
            };
            DialogTriple._extractValue = function (jsonObject, OType, ignoreRedirection, extractor) {
                var tripleTry = DialogTriple.extractTriple(jsonObject, OType, ignoreRedirection, extractor);
                var result;
                if (tripleTry.isFailure) {
                    result = new Failure(tripleTry.failure);
                }
                else {
                    var triple = tripleTry.success;
                    if (triple.isLeft) {
                        result = new Failure('DialogTriple::extractValue: Unexpected redirection for O_TYPE: ' + OType);
                    }
                    else {
                        result = new Success(triple.right);
                    }
                }
                return result;
            };
            return DialogTriple;
        })();
        dialog.DialogTriple = DialogTriple;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/12/15.
 */
///<reference path="../fp/references.ts"/>
///<reference path="../ws/references.ts"/>
///<reference path="../util/references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GatewayService = (function () {
            function GatewayService() {
            }
            GatewayService.getServiceEndpoint = function (tenantId, serviceName, gatewayHost) {
                var f = Get.fromUrl('https://' + gatewayHost + '/' + tenantId + '/' + serviceName).perform();
                var endPointFuture = f.bind(function (jsonObject) {
                    //'bounce cast' the jsonObject here to coerce into ServiceEndpoint
                    return Future.createSuccessfulFuture("serviceEndpoint", jsonObject);
                });
                return endPointFuture;
            };
            return GatewayService;
        })();
        dialog.GatewayService = GatewayService;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/10/15.
 */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var Redirection = (function () {
            function Redirection() {
            }
            //@TODO
            Redirection.fromWSRedirection = function (jsonObject) {
                return null;
            };
            return Redirection;
        })();
        dialog.Redirection = Redirection;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/12/15.
 */
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
            SessionContextImpl.fromWSCreateSessionResult = function (jsonObject, systemContext) {
                return dialog.DialogTriple.extractValue(jsonObject, "WSCreateSessionResult", function () {
                    return new Success(new SessionContextImpl(jsonObject['sessionHandle'], jsonObject['userName'], jsonObject['currentDivision'], jsonObject['serverVersion'], systemContext));
                });
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
            function SystemContextImpl(_urlString) {
                this._urlString = _urlString;
            }
            Object.defineProperty(SystemContextImpl.prototype, "urlString", {
                get: function () {
                    return this._urlString;
                },
                enumerable: true,
                configurable: true
            });
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
                var params = { 'tenantId': tenantId, 'userId': userId, 'password': password, 'clientType': clientType };
                var call = Call.createCallWithoutSession(SessionService.SERVICE_PATH, method, params, systemContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("createSession/extractSessionContextFromResponse", dialog.SessionContextImpl.fromWSCreateSessionResult(result, systemContext));
                });
            };
            SessionService.getSessionListProperty = function (propertyName, sessionContext) {
                var method = "getSessionListProperty";
                var params = {
                    'propertyName': propertyName,
                    'sessionHandle': sessionContext.sessionHandle
                };
                var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createSuccessfulFuture("getSessionListProperty/extractResultFromResponse", result);
                });
            };
            SessionService.setSessionListProperty = function (propertyName, listProperty, sessionContext) {
                var method = "createSessionListProperty";
                var params = {
                    'propertyName': propertyName,
                    'listProperty': listProperty,
                    'sessionHandle': sessionContext.sessionHandle
                };
                var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createSuccessfulFuture("setSessionListProperty/extractVoidResultFromResponse", result);
                });
            };
            SessionService.SERVICE_NAME = "SessionService";
            SessionService.SERVICE_PATH = "soi-json-v02/" + SessionService.SERVICE_NAME;
            return SessionService;
        })();
        dialog.SessionService = SessionService;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/16/15.
 */
/**
 * Created by rburson on 3/6/15.
 */
//dialog
///<reference path="AppContext.ts"/>
///<reference path="AppWinDef.ts"/>
///<reference path="DialogException.ts"/>
///<reference path="DialogTriple.ts"/>
///<reference path="GatewayService.ts"/>
///<reference path="Redirection.ts"/>
///<reference path="ServiceEndpoint.ts"/>
///<reference path="SessionContextImpl.ts"/>
///<reference path="SystemContextImpl.ts"/>
///<reference path="SessionService.ts"/>
///<reference path="VoidResult.ts"/>
var AppContext = catavolt.dialog.AppContext;
var AppWinDef = catavolt.dialog.AppWinDef;
var DialogTriple = catavolt.dialog.DialogTriple;
var Redirection = catavolt.dialog.Redirection;
var GatewayService = catavolt.dialog.GatewayService;
var SessionContextImpl = catavolt.dialog.SessionContextImpl;
var SessionService = catavolt.dialog.SessionService;
var SystemContextImpl = catavolt.dialog.SystemContextImpl;
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
/**
 * Created by rburson on 3/11/15.
 */
///<reference path="jasmine.d.ts"/>
///<reference path="../src/catavolt/references.ts"/>
var catavolt;
(function (catavolt) {
    var ws;
    (function (ws) {
        describe("Request::XMLHttpClient", function () {
            it("Should get endpoint successfully", function (done) {
                var SERVICE_PATH = "https://www.catavolt.net/***REMOVED***/soi-json";
                var client = new ws.XMLHttpClient();
                var f = client.jsonGet(SERVICE_PATH, 30000);
                f.onComplete(function (t) {
                    expect(t.isSuccess).toBe(true);
                    var endPoint = t.success;
                    expect(endPoint.responseType).toBe('soi-json');
                    done();
                });
            });
        });
    })(ws = catavolt.ws || (catavolt.ws = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
///<reference path="fp.Test.ts"/>
///<reference path="ws.Test.ts"/>
//# sourceMappingURL=catavolt_sdk.js.map