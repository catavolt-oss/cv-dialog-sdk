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
            ArrayUtil.copy = function (source) {
                return source.map(function (e) {
                    return e;
                });
            };
            return ArrayUtil;
        })();
        util.ArrayUtil = ArrayUtil;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/20/15.
 */
var catavolt;
(function (catavolt) {
    var util;
    (function (util) {
        var ObjUtil = (function () {
            function ObjUtil() {
            }
            ObjUtil.cloneOwnProps = function (sourceObj) {
                if (null == sourceObj || "object" != typeof sourceObj)
                    return sourceObj;
                var copy = sourceObj.constructor();
                for (var attr in sourceObj) {
                    if (sourceObj.hasOwnProperty(attr)) {
                        copy[attr] = ObjUtil.cloneOwnProps(sourceObj[attr]);
                    }
                }
                return copy;
            };
            ObjUtil.addAllProps = function (sourceObj, targetObj) {
                if (null == sourceObj || "object" != typeof sourceObj)
                    return targetObj;
                if (null == targetObj || "object" != typeof targetObj)
                    return targetObj;
                for (var attr in sourceObj) {
                    targetObj[attr] = sourceObj[attr];
                }
                return targetObj;
            };
            ObjUtil.formatRecAttr = function (o) {
                return JSON.stringify(o);
            };
            return ObjUtil;
        })();
        util.ObjUtil = ObjUtil;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
///<reference path="references.ts"/>
var catavolt;
(function (catavolt) {
    var util;
    (function (util) {
        (function (LogLevel) {
            LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
            LogLevel[LogLevel["WARN"] = 1] = "WARN";
            LogLevel[LogLevel["INFO"] = 2] = "INFO";
            LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
        })(util.LogLevel || (util.LogLevel = {}));
        var LogLevel = util.LogLevel;
        var Log = (function () {
            function Log() {
            }
            Log.logLevel = function (level) {
                if (level >= 3 /* DEBUG */) {
                    Log.debug = function (message, method, clz) {
                        Log.log(function (o) {
                            console.info(o);
                        }, 'DEBUG: ' + message, method, clz);
                    };
                }
                else {
                    Log.debug = function (message, method, clz) {
                    };
                }
                if (level >= 2 /* INFO */) {
                    Log.info = function (message, method, clz) {
                        Log.log(function (o) {
                            console.info(o);
                        }, 'INFO: ' + message, method, clz);
                    };
                }
                else {
                    Log.info = function (message, method, clz) {
                    };
                }
                if (level >= 1 /* WARN */) {
                    Log.error = function (message, clz, method) {
                        Log.log(function (o) {
                            console.error(o);
                        }, 'ERROR: ' + message, method, clz);
                    };
                }
                else {
                    Log.error = function (message, clz, method) {
                    };
                }
                if (level >= 0 /* ERROR */) {
                    Log.warn = function (message, clz, method) {
                        Log.log(function (o) {
                            console.info(o);
                        }, 'WARN: ' + message, method, clz);
                    };
                }
                else {
                    Log.warn = function (message, clz, method) {
                    };
                }
            };
            Log.log = function (logger, message, method, clz) {
                var m = typeof message !== 'string' ? Log.formatRecString(message) : message;
                if (clz || method) {
                    logger(clz + "::" + method + " : " + m);
                }
                else {
                    logger(m);
                }
            };
            Log.formatRecString = function (o) {
                return util.ObjUtil.formatRecAttr(o);
            };
            Log.init = Log.logLevel(3 /* DEBUG */);
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
///<reference path="ObjUtil.ts"/>
///<reference path="Log.ts"/>
///<reference path="Types.ts"/>
///<reference path="UserException.ts"/>
var ArrayUtil = catavolt.util.ArrayUtil;
var Log = catavolt.util.Log;
var LogLevel = catavolt.util.LogLevel;
var ObjUtil = catavolt.util.ObjUtil;
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
            Try.prototype.bind = function (f) {
                return this.isFailure ? new fp.Failure(this.failure) : f(this.success);
            };
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
            Try.prototype.map = function (f) {
                return this.isFailure ? new fp.Failure(this.failure) : new fp.Success(f(this.success));
            };
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
                    else {
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
                //Log.debug("complete() called on Future " + this._label + ' there are ' + this._completionListeners.length + " listeners.");
                if (t) {
                    if (!this._result) {
                        this._result = t;
                        /* capture the listener set to prevent missing a notification */
                        notifyList = ArrayUtil.copy(this._completionListeners);
                    }
                    else {
                        Log.error("Future::complete() : Future " + this._label + " has already been completed");
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
                //Log.debug('Promise calling complete on Future...');
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
                        promise.success(responseObj);
                    }
                    catch (error) {
                        promise.failure("XMLHttpClient::jsonCall: Failed to parse response: " + request.responseText);
                    }
                };
                var errorCallback = function (request) {
                    Log.error('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
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
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGetSessionListPropertyResult = (function () {
            function XGetSessionListPropertyResult(_list, _dialogProps) {
                this._list = _list;
                this._dialogProps = _dialogProps;
            }
            Object.defineProperty(XGetSessionListPropertyResult.prototype, "dialogProps", {
                get: function () {
                    return this._dialogProps;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XGetSessionListPropertyResult.prototype, "values", {
                get: function () {
                    return this._list;
                },
                enumerable: true,
                configurable: true
            });
            XGetSessionListPropertyResult.prototype.valuesAsDictionary = function () {
                var result = {};
                this.values.forEach(function (v) {
                    var pair = v.split(':');
                    (pair.length > 1) && (result[pair[0]] = pair[1]);
                });
                return result;
            };
            return XGetSessionListPropertyResult;
        })();
        dialog.XGetSessionListPropertyResult = XGetSessionListPropertyResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/16/15.
 */
/**
 * Created by rburson on 3/16/15.
 */
///<reference path="../util/references.ts"/>
/**
 * Created by rburson on 3/10/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var Redirection = (function () {
            function Redirection() {
            }
            return Redirection;
        })();
        dialog.Redirection = Redirection;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/27/15.
 */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DialogHandle = (function () {
            function DialogHandle(handleValue, sessionHandle) {
                this.handleValue = handleValue;
                this.sessionHandle = sessionHandle;
            }
            return DialogHandle;
        })();
        dialog.DialogHandle = DialogHandle;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/26/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DialogRedirection = (function (_super) {
            __extends(DialogRedirection, _super);
            function DialogRedirection(_dialogHandle, _dialogType, _dialogMode, _paneMode, _objectId, _open, _domainClassName, _dialogModelClassName, _dialogProperties, _fromDialogProperties) {
                _super.call(this);
                this._dialogHandle = _dialogHandle;
                this._dialogType = _dialogType;
                this._dialogMode = _dialogMode;
                this._paneMode = _paneMode;
                this._objectId = _objectId;
                this._open = _open;
                this._domainClassName = _domainClassName;
                this._dialogModelClassName = _dialogModelClassName;
                this._dialogProperties = _dialogProperties;
                this._fromDialogProperties = _fromDialogProperties;
            }
            Object.defineProperty(DialogRedirection.prototype, "dialogHandle", {
                get: function () {
                    return this._dialogHandle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "dialogMode", {
                get: function () {
                    return this._dialogMode;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "dialogModelClassName", {
                get: function () {
                    return this._dialogModelClassName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "dialogProperties", {
                get: function () {
                    return this._dialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "dialogType", {
                get: function () {
                    return this._dialogType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "domainClassName", {
                get: function () {
                    return this._domainClassName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "fromDialogProperties", {
                get: function () {
                    return this._fromDialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "isEditor", {
                get: function () {
                    return this._dialogType === 'EDITOR';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "isQuery", {
                get: function () {
                    return this._dialogType === 'QUERY';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "objectId", {
                get: function () {
                    return this._objectId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "open", {
                get: function () {
                    return this._open;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "paneMode", {
                get: function () {
                    return this._paneMode;
                },
                enumerable: true,
                configurable: true
            });
            return DialogRedirection;
        })(dialog.Redirection);
        dialog.DialogRedirection = DialogRedirection;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var NullRedirection = (function (_super) {
            __extends(NullRedirection, _super);
            function NullRedirection(fromDialogProperties) {
                _super.call(this);
                this.fromDialogProperties = fromDialogProperties;
            }
            return NullRedirection;
        })(dialog.Redirection);
        dialog.NullRedirection = NullRedirection;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/27/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var WebRedirection = (function (_super) {
            __extends(WebRedirection, _super);
            function WebRedirection(_webURL, _open, _dialogProperties, _fromDialogProperties) {
                _super.call(this);
                this._webURL = _webURL;
                this._open = _open;
                this._dialogProperties = _dialogProperties;
                this._fromDialogProperties = _fromDialogProperties;
            }
            return WebRedirection;
        })(dialog.Redirection);
        dialog.WebRedirection = WebRedirection;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/27/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var WorkbenchRedirection = (function (_super) {
            __extends(WorkbenchRedirection, _super);
            function WorkbenchRedirection(_workbenchId, _dialogProperties, _fromDialogProperties) {
                _super.call(this);
                this._workbenchId = _workbenchId;
                this._dialogProperties = _dialogProperties;
                this._fromDialogProperties = _fromDialogProperties;
            }
            Object.defineProperty(WorkbenchRedirection.prototype, "workbenchId", {
                get: function () {
                    return this._workbenchId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkbenchRedirection.prototype, "dialogProperties", {
                get: function () {
                    return this._dialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkbenchRedirection.prototype, "fromDialogProperties", {
                get: function () {
                    return this._fromDialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            return WorkbenchRedirection;
        })(dialog.Redirection);
        dialog.WorkbenchRedirection = WorkbenchRedirection;
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
        var DialogTriple = (function () {
            function DialogTriple() {
            }
            DialogTriple.extractList = function (jsonObject, Ltype, extractor) {
                var result;
                if (jsonObject) {
                    var lt = jsonObject['WS_LTYPE'];
                    if (Ltype === lt) {
                        if (jsonObject['values']) {
                            var realValues = [];
                            var values = jsonObject['values'];
                            values.every(function (item) {
                                var extdValue = extractor(item);
                                if (extdValue.isFailure) {
                                    result = new Failure(extdValue.failure);
                                    return false;
                                }
                                realValues.push(extdValue.success);
                                return true;
                            });
                            if (!result) {
                                result = new Success(realValues);
                            }
                        }
                        else {
                            result = new Failure("DialogTriple::extractList: Values array not found");
                        }
                    }
                    else {
                        result = new Failure("DialogTriple::extractList: Expected WS_LTYPE " + Ltype + " but found " + lt);
                    }
                }
                return result;
            };
            DialogTriple.extractRedirection = function (jsonObject, Otype) {
                var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, false, function () {
                    return new Success(new dialog.NullRedirection({}));
                });
                var answer;
                if (tripleTry.isSuccess) {
                    var triple = tripleTry.success;
                    answer = triple.isLeft ? new Success(triple.left) : new Success(triple.right);
                }
                else {
                    answer = new Failure(tripleTry.failure);
                }
                return answer;
            };
            DialogTriple.extractTriple = function (jsonObject, Otype, extractor) {
                return DialogTriple._extractTriple(jsonObject, Otype, false, extractor);
            };
            DialogTriple.extractValue = function (jsonObject, Otype, extractor) {
                return DialogTriple._extractValue(jsonObject, Otype, false, extractor);
            };
            DialogTriple.extractValueIgnoringRedirection = function (jsonObject, Otype, extractor) {
                return DialogTriple._extractValue(jsonObject, Otype, true, extractor);
            };
            DialogTriple.fromWSDialogObject = function (obj, Otype, factoryFn) {
                if (!obj) {
                    return new Failure('DialogTriple::fromWSDialogObject: Cannot extract from null value');
                }
                else if (typeof obj !== 'object') {
                    return new Success(obj);
                }
                if (!factoryFn) {
                    /* Assume we're just going to coerce the exiting object */
                    return DialogTriple.extractValue(obj, Otype, function () {
                        return new Success(obj);
                    });
                }
                else {
                    return DialogTriple.extractValue(obj, Otype, function () {
                        return dialog.OType.deserializeObject(obj, Otype, factoryFn);
                    });
                }
            };
            DialogTriple.fromListOfWSDialogObject = function (jsonObject, Ltype, factoryFn) {
                return DialogTriple.extractList(jsonObject, Ltype, function (value) {
                    return DialogTriple.fromWSDialogObject(value, Ltype, factoryFn);
                });
            };
            DialogTriple.fromWSDialogObjectResult = function (jsonObject, resultOtype, targetOtype, objPropName, factoryFn) {
                return DialogTriple.extractValue(jsonObject, resultOtype, function () {
                    return DialogTriple.fromWSDialogObject(jsonObject[objPropName], targetOtype, factoryFn);
                });
            };
            DialogTriple.fromWSDialogObjectResultWithFunc = function (jsonObject, resultOtype, objPropName, fromWSObjectFunc) {
                return DialogTriple.extractValue(jsonObject, resultOtype, function () {
                    return fromWSObjectFunc(jsonObject[objPropName]);
                });
            };
            DialogTriple.fromListOfWSDialogObjectWithFunc = function (jsonObject, Ltype, fromWSObjectFunc) {
                return DialogTriple.extractList(jsonObject, Ltype, function (value) {
                    return fromWSObjectFunc(value);
                });
            };
            DialogTriple._extractTriple = function (jsonObject, Otype, ignoreRedirection, extractor) {
                var result;
                if (!jsonObject) {
                    return new Failure('DialogTriple::extractTriple: cannot extract object of WS_OTYPE ' + Otype + ' because json object is null');
                }
                else {
                    var ot = jsonObject['WS_OTYPE'];
                    if (!ot || Otype !== ot) {
                        result = new Failure('DialogTriple:extractTriple: expected O_TYPE ' + Otype + ' but found ' + ot);
                    }
                    else {
                        if (jsonObject['exception']) {
                            var dialogException = jsonObject['exception'];
                            result = new Failure(dialogException);
                        }
                        else if (jsonObject['redirection'] && !ignoreRedirection) {
                            var drt = DialogTriple.fromWSDialogObject(jsonObject['redirection'], 'WSRedirection', dialog.OType.factoryFn);
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
            DialogTriple._extractValue = function (jsonObject, Otype, ignoreRedirection, extractor) {
                var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, ignoreRedirection, extractor);
                var result;
                if (tripleTry.isFailure) {
                    result = new Failure(tripleTry.failure);
                }
                else {
                    var triple = tripleTry.success;
                    if (triple.isLeft) {
                        result = new Failure('DialogTriple::extractValue: Unexpected redirection for O_TYPE: ' + Otype);
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
 * Created by rburson on 3/27/15.
 */
///<reference path="references.ts"/>
/**
 * Created by rburson on 3/27/15.
 */
///<reference path="references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var ContextAction = (function () {
            function ContextAction(actionId, objectId, fromActionSource) {
                this.actionId = actionId;
                this.objectId = objectId;
                this.fromActionSource = fromActionSource;
            }
            Object.defineProperty(ContextAction.prototype, "virtualPathSuffix", {
                get: function () {
                    return [this.objectId, this.actionId];
                },
                enumerable: true,
                configurable: true
            });
            return ContextAction;
        })();
        dialog.ContextAction = ContextAction;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var NavRequest;
        (function (NavRequest) {
            var Util;
            (function (Util) {
                function fromRedirection(redirection, actionSource, sessionContext) {
                    var result;
                    if (redirection instanceof dialog.WebRedirection) {
                        result = Future.createFailedFuture('NavRequest::fromRedirection', 'WebRedirection not yet implemented');
                    }
                    else if (redirection instanceof dialog.WorkbenchRedirection) {
                        var wbr = redirection;
                        result = dialog.AppContext.singleton.getWorkbench(sessionContext, wbr.workbenchId).map(function (wb) {
                            return wb;
                        });
                    }
                    else if (redirection instanceof dialog.DialogRedirection) {
                        var dr = redirection;
                    }
                    else if (redirection instanceof dialog.NullRedirection) {
                        var nullRedir = redirection;
                        var nullNavRequest = new dialog.NullNavRequest();
                        ObjUtil.addAllProps(nullRedir.fromDialogProperties, nullNavRequest.fromDialogProperties);
                        result = Future.createSuccessfulFuture('NavRequest:fromRedirection/nullRedirection', nullNavRequest);
                    }
                    else {
                        result = Future.createFailedFuture('NavRequest::fromRedirection', 'Unrecognized type of Redirection ' + ObjUtil.formatRecAttr(redirection));
                    }
                    return result;
                }
                Util.fromRedirection = fromRedirection;
            })(Util = NavRequest.Util || (NavRequest.Util = {}));
        })(NavRequest = dialog.NavRequest || (dialog.NavRequest = {}));
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var NullNavRequest = (function () {
            function NullNavRequest() {
                this.fromDialogProperties = {};
            }
            return NullNavRequest;
        })();
        dialog.NullNavRequest = NullNavRequest;
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
                var sessionContextTry = dialog.DialogTriple.fromWSDialogObject(jsonObject, 'WSCreateSessionResult', dialog.OType.factoryFn);
                return sessionContextTry.map(function (sessionContext) {
                    sessionContext.systemContext = systemContext;
                    return sessionContext;
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
 * Created by rburson on 3/13/15.
 */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var AppWinDef = (function () {
            function AppWinDef(workbenches, appVendors, windowTitle, windowWidth, windowHeight) {
                this._workbenches = workbenches || [];
                this._applicationVendors = appVendors || [];
                this._windowTitle = windowTitle;
                this._windowWidth = windowWidth;
                this._windowHeight = windowHeight;
            }
            Object.defineProperty(AppWinDef.prototype, "appVendors", {
                get: function () {
                    return this._applicationVendors;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppWinDef.prototype, "windowHeight", {
                get: function () {
                    return this._windowHeight;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppWinDef.prototype, "windowTitle", {
                get: function () {
                    return this._windowTitle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppWinDef.prototype, "windowWidth", {
                get: function () {
                    return this._windowWidth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppWinDef.prototype, "workbenches", {
                get: function () {
                    return this._workbenches;
                },
                enumerable: true,
                configurable: true
            });
            return AppWinDef;
        })();
        dialog.AppWinDef = AppWinDef;
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
                    return Future.createCompletedFuture("getSessionListProperty/extractResultFromResponse", dialog.DialogTriple.fromWSDialogObject(result, 'WSGetSessionListPropertyResult', dialog.OType.factoryFn));
                });
            };
            SessionService.setSessionListProperty = function (propertyName, listProperty, sessionContext) {
                var method = "setSessionListProperty";
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
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var Workbench = (function () {
            function Workbench(_id, _name, _alias, _actions) {
                this._id = _id;
                this._name = _name;
                this._alias = _alias;
                this._actions = _actions;
            }
            Object.defineProperty(Workbench.prototype, "alias", {
                get: function () {
                    return this._alias;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workbench.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workbench.prototype, "workbenchId", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workbench.prototype, "workbenchLaunchActions", {
                get: function () {
                    return ArrayUtil.copy(this._actions);
                },
                enumerable: true,
                configurable: true
            });
            return Workbench;
        })();
        dialog.Workbench = Workbench;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var WorkbenchLaunchAction = (function () {
            function WorkbenchLaunchAction(id, workbenchId, name, alias, iconBase) {
                this.id = id;
                this.workbenchId = workbenchId;
                this.name = name;
                this.alias = alias;
                this.iconBase = iconBase;
            }
            Object.defineProperty(WorkbenchLaunchAction.prototype, "actionId", {
                get: function () {
                    return this.id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkbenchLaunchAction.prototype, "fromActionSource", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkbenchLaunchAction.prototype, "virtualPathSuffix", {
                get: function () {
                    return [this.workbenchId, this.id];
                },
                enumerable: true,
                configurable: true
            });
            return WorkbenchLaunchAction;
        })();
        dialog.WorkbenchLaunchAction = WorkbenchLaunchAction;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var WorkbenchService = (function () {
            function WorkbenchService() {
            }
            WorkbenchService.getAppWinDef = function (sessionContext) {
                var method = "getApplicationWindowDef";
                var params = { 'sessionHandle': sessionContext.sessionHandle };
                var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("createSession/extractAppWinDefFromResult", dialog.DialogTriple.fromWSDialogObjectResult(result, 'WSApplicationWindowDefResult', 'WSApplicationWindowDef', 'applicationWindowDef', dialog.OType.factoryFn));
                });
            };
            WorkbenchService.getWorkbench = function (sessionContext, workbenchId) {
                var method = "getWorkbench";
                var params = {
                    'sessionHandle': sessionContext.sessionHandle,
                    'workbenchId': workbenchId
                };
                var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("getWorkbench/extractObject", dialog.DialogTriple.fromWSDialogObjectResult(result, 'WSWorkbenchResult', 'WSWorkbench', 'workbench', dialog.OType.factoryFn));
                });
            };
            WorkbenchService.performLaunchAction = function (actionId, workbenchId, sessionContext) {
                var method = "performLaunchAction";
                var params = {
                    'actionId': actionId,
                    'workbenchId': workbenchId,
                    'sessionHandle': sessionContext.sessionHandle
                };
                var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("performLaunchAction/extractRedirection", dialog.DialogTriple.fromWSDialogObject(result['redirection'], 'WSRedirection', dialog.OType.factoryFn));
                });
            };
            WorkbenchService.SERVICE_NAME = "WorkbenchService";
            WorkbenchService.SERVICE_PATH = "soi-json-v02/" + WorkbenchService.SERVICE_NAME;
            return WorkbenchService;
        })();
        dialog.WorkbenchService = WorkbenchService;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/13/15.
 */
///<reference path="references.ts"/>
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
            Object.defineProperty(AppContext, "singleton", {
                get: function () {
                    if (!AppContext._singleton) {
                        AppContext._singleton = new AppContext();
                    }
                    return AppContext._singleton;
                },
                enumerable: true,
                configurable: true
            });
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
            Object.defineProperty(AppContext.prototype, "isLoggedIn", {
                get: function () {
                    return this._appContextState === 1 /* LOGGED_IN */;
                },
                enumerable: true,
                configurable: true
            });
            AppContext.prototype.getWorkbench = function (sessionContext, workbenchId) {
                if (this._appContextState === 0 /* LOGGED_OUT */) {
                    return Future.createFailedFuture("AppContext::getWorkbench", "User is logged out");
                }
                return dialog.WorkbenchService.getWorkbench(sessionContext, workbenchId);
            };
            AppContext.prototype.login = function (gatewayHost, tenantId, clientType, userId, password) {
                var _this = this;
                if (this._appContextState === 1 /* LOGGED_IN */) {
                    return Future.createFailedFuture("AppContext::login", "User is already logged in");
                }
                var answer;
                var appContextValuesFr = this.loginOnline(gatewayHost, tenantId, clientType, userId, password, this.deviceProps);
                return appContextValuesFr.bind(function (appContextValues) {
                    _this.setAppContextStateToLoggedIn(appContextValues);
                    return Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
                });
            };
            AppContext.prototype.performLaunchAction = function (launchAction) {
                if (this._appContextState === 0 /* LOGGED_OUT */) {
                    return Future.createFailedFuture("AppContext::performLaunchAction", "User is logged out");
                }
                return this.performLaunchActionOnline(launchAction, this.sessionContextTry.success);
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
                var devicePropName = "com.catavolt.session.property.DeviceProperties";
                return dialog.SessionService.setSessionListProperty(devicePropName, deviceProps, sessionContext).bind(function (setPropertyListResult) {
                    var listPropName = "com.catavolt.session.property.TenantProperties";
                    return dialog.SessionService.getSessionListProperty(listPropName, sessionContext).bind(function (listPropertyResult) {
                        return dialog.WorkbenchService.getAppWinDef(sessionContext).bind(function (appWinDef) {
                            return Future.createSuccessfulFuture("AppContextCore:loginFromSystemContext", new AppContextValues(sessionContext, appWinDef, listPropertyResult.valuesAsDictionary()));
                        });
                    });
                });
            };
            AppContext.prototype.loginOnline = function (gatewayHost, tenantId, clientType, userId, password, deviceProps) {
                var _this = this;
                var systemContextFr = this.newSystemContextFr(gatewayHost, tenantId);
                return systemContextFr.bind(function (sc) {
                    return _this.loginFromSystemContext(sc, tenantId, userId, password, deviceProps, clientType);
                });
            };
            AppContext.prototype.loginFromSystemContext = function (systemContext, tenantId, userId, password, deviceProps, clientType) {
                var _this = this;
                var sessionContextFuture = dialog.SessionService.createSession(tenantId, userId, password, clientType, systemContext);
                return sessionContextFuture.bind(function (sessionContext) {
                    return _this.finalizeContext(sessionContext, deviceProps);
                });
            };
            AppContext.prototype.newSystemContextFr = function (gatewayHost, tenantId) {
                var serviceEndpoint = dialog.GatewayService.getServiceEndpoint(tenantId, 'soi-json', gatewayHost);
                return serviceEndpoint.map(function (serviceEndpoint) {
                    return new dialog.SystemContextImpl(serviceEndpoint.serverAssignment);
                });
            };
            AppContext.prototype.performLaunchActionOnline = function (launchAction, sessionContext) {
                var redirFr = dialog.WorkbenchService.performLaunchAction(launchAction.id, launchAction.workbenchId, sessionContext);
                return redirFr.bind(function (r) {
                    return dialog.NavRequest.Util.fromRedirection(r, launchAction, sessionContext);
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
 * Created by rburson on 3/6/15.
 */
//dialog
///<reference path="XGetSessionListPropertyResult.ts"/>
///<reference path="VoidResult.ts"/>
///<reference path="DialogException.ts"/>
///<reference path="Redirection.ts"/>
///<reference path="DialogHandle.ts"/>
///<reference path="DialogRedirection.ts"/>
///<reference path="DialogRedirection.ts"/>
///<reference path="NullRedirection.ts"/>
///<reference path="WebRedirection.ts"/>
///<reference path="WorkbenchRedirection.ts"/>
///<reference path="DialogTriple.ts"/>
///<reference path="ActionSource.ts"/>
///<reference path="ContextAction.ts"/>
///<reference path="NavRequest.ts"/>
///<reference path="NullNavRequest.ts"/>
///<reference path="ServiceEndpoint.ts"/>
///<reference path="SessionContextImpl.ts"/>
///<reference path="SystemContextImpl.ts"/>
///<reference path="AppWinDef.ts"/>
///<reference path="SessionService.ts"/>
///<reference path="GatewayService.ts"/>
///<reference path="Workbench.ts"/>
///<reference path="WorkbenchLaunchAction.ts"/>
///<reference path="WorkbenchService.ts"/>
///<reference path="AppContext.ts"/>
///<reference path="OType.ts"/>
var AppContext = catavolt.dialog.AppContext;
var AppWinDef = catavolt.dialog.AppWinDef;
var ContextAction = catavolt.dialog.ContextAction;
var DialogHandle = catavolt.dialog.DialogHandle;
var DialogRedirection = catavolt.dialog.DialogRedirection;
var DialogTriple = catavolt.dialog.DialogTriple;
var NavRequest = catavolt.dialog.NavRequest;
var NullNavRequest = catavolt.dialog.NullNavRequest;
var NullRedirection = catavolt.dialog.NullRedirection;
var Redirection = catavolt.dialog.Redirection;
var GatewayService = catavolt.dialog.GatewayService;
var OType = catavolt.dialog.OType;
var SessionContextImpl = catavolt.dialog.SessionContextImpl;
var SessionService = catavolt.dialog.SessionService;
var SystemContextImpl = catavolt.dialog.SystemContextImpl;
var WebRedirection = catavolt.dialog.WebRedirection;
var Workbench = catavolt.dialog.Workbench;
var WorkbenchLaunchAction = catavolt.dialog.WorkbenchLaunchAction;
var WorkbenchRedirection = catavolt.dialog.WorkbenchRedirection;
var WorkbenchService = catavolt.dialog.WorkbenchService;
var XGetSessionListPropertyResult = catavolt.dialog.XGetSessionListPropertyResult;
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
/**
 * Created by rburson on 3/23/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var OType = (function () {
            function OType() {
            }
            OType.localTypeInstance = function (name) {
                var type = OType.localTypes[name];
                return type && new type;
            };
            OType.factoryFn = function (otype, jsonObj) {
                var typeFn = OType.typeFns[otype];
                if (typeFn) {
                    return typeFn(otype, jsonObj);
                }
                else {
                    var type = OType.types[otype];
                    return type && new type;
                }
            };
            OType.deserializeObject = function (obj, Otype, factoryFn) {
                return dialog.DialogTriple.extractValue(obj, Otype, function () {
                    var newObj = factoryFn(Otype, obj);
                    if (!newObj) {
                        return new Failure('OType::deserializeObject: factory failed to produce object for ' + Otype);
                    }
                    for (var prop in obj) {
                        var value = obj[prop];
                        //Log.info("prop: " + prop + " is type " + typeof value);
                        if (value && typeof value === 'object') {
                            if ('WS_OTYPE' in value) {
                                var otypeTry = dialog.DialogTriple.fromWSDialogObject(value, value['WS_OTYPE'], OType.factoryFn);
                                if (otypeTry.isFailure) {
                                    return new Failure(otypeTry.failure);
                                }
                                OType.assignPropIfDefined(prop, otypeTry.success, newObj, Otype);
                            }
                            else if ('WS_LTYPE' in value) {
                                var ltypeTry = dialog.DialogTriple.fromListOfWSDialogObject(value, value['WS_LTYPE'], OType.factoryFn);
                                if (ltypeTry.isFailure) {
                                    return new Failure(ltypeTry.failure);
                                }
                                OType.assignPropIfDefined(prop, ltypeTry.success, newObj, Otype);
                            }
                            else {
                                OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                            }
                        }
                        else {
                            OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                        }
                    }
                    return new Success(newObj);
                });
            };
            OType.assignPropIfDefined = function (prop, value, target, otype) {
                if (otype === void 0) { otype = 'object'; }
                try {
                    if ('_' + prop in target) {
                        target['_' + prop] = value;
                    }
                    else {
                        //it may be public
                        if (prop in target) {
                            target[prop] = value;
                        }
                        else {
                            Log.debug("Didn't find target value for prop " + prop + " on target for " + otype);
                        }
                    }
                }
                catch (error) {
                    Log.error('OType::assignPropIfDefined: Failed to set prop: ' + prop + ' on target: ' + error);
                }
            };
            OType.types = {
                'WSApplicationWindowDef': dialog.AppWinDef,
                "WSCreateSessionResult": dialog.SessionContextImpl,
                "WSContextAction": dialog.ContextAction,
                'WSDialogHandle': dialog.DialogHandle,
                'WSDialogRedirection': dialog.DialogRedirection,
                'WSGetSessionListPropertyResult': dialog.XGetSessionListPropertyResult,
                'WSWebRedirection': dialog.WebRedirection,
                'WSWorkbench': dialog.Workbench,
                'WSWorkbenchRedirection': dialog.WorkbenchRedirection,
                'WSWorkbenchLaunchAction': dialog.WorkbenchLaunchAction
            };
            OType.localTypes = {
                'DialogRedirection': dialog.DialogRedirection,
                'WebRedirection': dialog.WebRedirection,
                'WorkbenchRedirection': dialog.WorkbenchRedirection
            };
            OType.typeFns = {
                'WSRedirection': function (otype, jsonObj) {
                    if (jsonObj && jsonObj['webURL']) {
                        return OType.localTypeInstance('WebRedirection');
                    }
                    else if (jsonObj && jsonObj['workbenchId']) {
                        return OType.localTypeInstance('WorkbenchRedirection');
                    }
                    else {
                        return OType.localTypeInstance('DialogRedirection');
                    }
                }
            };
            return OType;
        })();
        dialog.OType = OType;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
//# sourceMappingURL=catavolt_sdk.js.map