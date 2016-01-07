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
                return source.map(function (e) { return e; });
            };
            ArrayUtil.find = function (source, f) {
                var value = null;
                source.some(function (v) {
                    if (f(v)) {
                        value = v;
                        return true;
                    }
                    return false;
                });
                return value;
            };
            return ArrayUtil;
        })();
        util.ArrayUtil = ArrayUtil;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/4/15.
 */
///<reference path="../references.ts"/>
/*
    This implementation supports our ECMA 5.1 browser set, including IE9
    If we no longer need to support IE9, a TypedArray implementaion would be more efficient...
 */
var catavolt;
(function (catavolt) {
    var util;
    (function (util) {
        var Base64 = (function () {
            function Base64() {
            }
            Base64.encode = function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;
                input = Base64._utf8_encode(input);
                while (i < input.length) {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;
                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    }
                    else if (isNaN(chr3)) {
                        enc4 = 64;
                    }
                    output = output +
                        Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                        Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
                }
                return output;
            };
            Base64.decode = function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                while (i < input.length) {
                    enc1 = Base64._keyStr.indexOf(input.charAt(i++));
                    enc2 = Base64._keyStr.indexOf(input.charAt(i++));
                    enc3 = Base64._keyStr.indexOf(input.charAt(i++));
                    enc4 = Base64._keyStr.indexOf(input.charAt(i++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    output = output + String.fromCharCode(chr1);
                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                }
                output = Base64._utf8_decode(output);
                return output;
            };
            Base64._utf8_encode = function (s) {
                s = s.replace(/\r\n/g, "\n");
                var utftext = "";
                for (var n = 0; n < s.length; n++) {
                    var c = s.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            };
            Base64._utf8_decode = function (utftext) {
                var s = "";
                var i = 0;
                var c = 0, c1 = 0, c2 = 0, c3 = 0;
                while (i < utftext.length) {
                    c = utftext.charCodeAt(i);
                    if (c < 128) {
                        s += String.fromCharCode(c);
                        i++;
                    }
                    else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        s += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    }
                    else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        s += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }
                }
                return s;
            };
            Base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            return Base64;
        })();
        util.Base64 = Base64;
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
            ObjUtil.copyNonNullFieldsOnly = function (obj, newObj, filterFn) {
                for (var prop in obj) {
                    if (!filterFn || filterFn(prop)) {
                        var type = typeof obj[prop];
                        if (type !== 'function') {
                            var val = obj[prop];
                            if (val) {
                                newObj[prop] = val;
                            }
                        }
                    }
                }
                return newObj;
            };
            ObjUtil.formatRecAttr = function (o) {
                //@TODO - add a filter here to build a cache and detect (and skip) circular references
                return JSON.stringify(o);
            };
            ObjUtil.newInstance = function (type) {
                return new type;
            };
            return ObjUtil;
        })();
        util.ObjUtil = ObjUtil;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/3/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var util;
    (function (util) {
        var StringUtil = (function () {
            function StringUtil() {
            }
            StringUtil.splitSimpleKeyValuePair = function (pairString) {
                var pair = pairString.split(':');
                var code = pair[0];
                var desc = pair.length > 1 ? pair[1] : '';
                return [code, desc];
            };
            return StringUtil;
        })();
        util.StringUtil = StringUtil;
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
                if (level >= LogLevel.DEBUG) {
                    Log.debug = function (message, method, clz) {
                        Log.log(function (o) { console.info(o); }, 'DEBUG: ' + message, method, clz);
                    };
                }
                else {
                    Log.debug = function (message, method, clz) { };
                }
                if (level >= LogLevel.INFO) {
                    Log.info = function (message, method, clz) {
                        Log.log(function (o) { console.info(o); }, 'INFO: ' + message, method, clz);
                    };
                }
                else {
                    Log.info = function (message, method, clz) { };
                }
                if (level >= LogLevel.WARN) {
                    Log.error = function (message, clz, method) {
                        Log.log(function (o) { console.error(o); }, 'ERROR: ' + message, method, clz);
                    };
                }
                else {
                    Log.error = function (message, clz, method) { };
                }
                if (level >= LogLevel.ERROR) {
                    Log.warn = function (message, clz, method) {
                        Log.log(function (o) { console.info(o); }, 'WARN: ' + message, method, clz);
                    };
                }
                else {
                    Log.warn = function (message, clz, method) { };
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
            //set default log level here
            Log.init = Log.logLevel(LogLevel.INFO);
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
///<reference path="Base64.ts"/>
///<reference path="ObjUtil.ts"/>
///<reference path="StringUtil.ts"/>
///<reference path="Log.ts"/>
///<reference path="Types.ts"/>
///<reference path="UserException.ts"/>
var ArrayUtil = catavolt.util.ArrayUtil;
var Base64 = catavolt.util.Base64;
var Log = catavolt.util.Log;
var LogLevel = catavolt.util.LogLevel;
var ObjUtil = catavolt.util.ObjUtil;
var StringUtil = catavolt.util.StringUtil;
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../fp/references.ts"/>
/**
 * Created by rburson on 3/5/15.
 */
///<reference path="references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Try = (function () {
            function Try() {
            }
            Try.flatten = function (tryList) {
                var successes = [];
                var failures = [];
                tryList.forEach(function (t) {
                    if (t.isFailure) {
                        failures.push(t.failure);
                    }
                    else {
                        if (Array.isArray(t.success) && Try.isListOfTry(t.success)) {
                            var flattened = Try.flatten(t.success);
                            if (flattened.isFailure) {
                                failures.push(flattened.failure);
                            }
                            else {
                                successes.push(flattened.success);
                            }
                        }
                        else {
                            successes.push(t.success);
                        }
                    }
                });
                if (failures.length > 0) {
                    return new fp.Failure(failures);
                }
                else {
                    return new fp.Success(successes);
                }
            };
            Try.isListOfTry = function (list) {
                return list.every(function (value) { return (value instanceof Try); });
            };
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
            Future.sequence = function (seqOfFutures) {
                var start = Future.createSuccessfulFuture('Future::sequence/start', []);
                return seqOfFutures.reduce(function (seqFr, nextFr) {
                    return seqFr.bind(function (seq) {
                        var pr = new fp.Promise('Future::sequence/nextFr');
                        nextFr.onComplete(function (t) {
                            seq.push(t);
                            pr.complete(new fp.Success(seq));
                        });
                        return pr.future;
                    });
                }, start);
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
                get: function () { return this._result ? this._result.failure : null; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Future.prototype, "isComplete", {
                get: function () { return !!this._result; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Future.prototype, "isCompleteWithFailure", {
                get: function () { return !!this._result && this._result.isFailure; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Future.prototype, "isCompleteWithSuccess", {
                get: function () { return !!this._result && this._result.isSuccess; },
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
                get: function () { return this._result; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Future.prototype, "success", {
                get: function () { return this._result ? this.result.success : null; },
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
                        try {
                            listener(_this._result);
                        }
                        catch (error) {
                            Log.error("CompletionListener failed with " + error);
                        }
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
            Promise.prototype.isComplete = function () { return this._future.isComplete; };
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
///<reference path="references.ts"/>
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
                var body = jsonObj && JSON.stringify(jsonObj);
                //var promise = new Promise<StringDictionary>("XMLHttpClient::jsonCall");
                var promise = new Promise("XMLHttpClient::" + targetUrl + ":" + body);
                if (method !== 'GET' && method !== 'POST') {
                    promise.failure(method + " method not supported.");
                    return promise.future;
                }
                var successCallback = function (request) {
                    try {
                        Log.debug("XMLHttpClient: Got successful response: " + request.responseText);
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
 * Created by rburson on 4/28/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        (function (PaneMode) {
            PaneMode[PaneMode["READ"] = 0] = "READ";
            PaneMode[PaneMode["WRITE"] = 1] = "WRITE";
        })(dialog.PaneMode || (dialog.PaneMode = {}));
        var PaneMode = dialog.PaneMode;
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
        var MenuDef = (function () {
            function MenuDef(_name, _type, _actionId, _mode, _label, _iconName, _directive, _menuDefs) {
                this._name = _name;
                this._type = _type;
                this._actionId = _actionId;
                this._mode = _mode;
                this._label = _label;
                this._iconName = _iconName;
                this._directive = _directive;
                this._menuDefs = _menuDefs;
            }
            Object.defineProperty(MenuDef.prototype, "actionId", {
                get: function () {
                    return this._actionId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "directive", {
                get: function () {
                    return this._directive;
                },
                enumerable: true,
                configurable: true
            });
            MenuDef.prototype.findAtId = function (actionId) {
                if (this.actionId === actionId)
                    return this;
                var result = null;
                this.menuDefs.some(function (md) {
                    result = md.findAtId(actionId);
                    return result != null;
                });
                return result;
            };
            Object.defineProperty(MenuDef.prototype, "iconName", {
                get: function () {
                    return this._iconName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "isPresaveDirective", {
                get: function () {
                    return this._directive && this._directive === 'PRESAVE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "isRead", {
                get: function () {
                    return this._mode && this._mode.indexOf('R') > -1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "isSeparator", {
                get: function () {
                    return this._type && this._type === 'separator';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "isWrite", {
                get: function () {
                    return this._mode && this._mode.indexOf('W') > -1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "label", {
                get: function () {
                    return this._label;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "menuDefs", {
                get: function () {
                    return this._menuDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "mode", {
                get: function () {
                    return this._mode;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            return MenuDef;
        })();
        dialog.MenuDef = MenuDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
/*
    @TODO
 */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var CellValueDef = (function () {
            function CellValueDef(_style) {
                this._style = _style;
            }
            /* Note compact deserialization will be handled normally by OType */
            CellValueDef.fromWS = function (otype, jsonObj) {
                if (jsonObj['attributeCellValueDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['attributeCellValueDef'], 'WSAttributeCellValueDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['forcedLineCellValueDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['forcedLineCellValueDef'], 'WSForcedLineCellValueDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['labelCellValueDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['labelCellValueDef'], 'WSLabelCellValueDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['substitutionCellValueDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['substitutionCellValueDef'], 'WSSubstitutionCellValueDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['tabCellValueDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['tabCellValueDef'], 'WSTabCellValueDef', dialog.OType.factoryFn);
                }
                else {
                    return new Failure('CellValueDef::fromWS: unknown CellValueDef type: ' + ObjUtil.formatRecAttr(jsonObj));
                }
            };
            Object.defineProperty(CellValueDef.prototype, "isInlineMediaStyle", {
                get: function () {
                    return this.style && (this.style === dialog.PropDef.STYLE_INLINE_MEDIA || this.style === dialog.PropDef.STYLE_INLINE_MEDIA2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellValueDef.prototype, "style", {
                get: function () {
                    return this._style;
                },
                enumerable: true,
                configurable: true
            });
            return CellValueDef;
        })();
        dialog.CellValueDef = CellValueDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/16/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var AttributeCellValueDef = (function (_super) {
            __extends(AttributeCellValueDef, _super);
            function AttributeCellValueDef(_propertyName, _presentationLength, _entryMethod, _autoFillCapable, _hint, _toolTip, _fieldActions, style) {
                _super.call(this, style);
                this._propertyName = _propertyName;
                this._presentationLength = _presentationLength;
                this._entryMethod = _entryMethod;
                this._autoFillCapable = _autoFillCapable;
                this._hint = _hint;
                this._toolTip = _toolTip;
                this._fieldActions = _fieldActions;
            }
            Object.defineProperty(AttributeCellValueDef.prototype, "autoFileCapable", {
                get: function () {
                    return this._autoFillCapable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AttributeCellValueDef.prototype, "entryMethod", {
                get: function () {
                    return this._entryMethod;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AttributeCellValueDef.prototype, "fieldActions", {
                get: function () {
                    return this._fieldActions;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AttributeCellValueDef.prototype, "hint", {
                get: function () {
                    return this._hint;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AttributeCellValueDef.prototype, "isComboBoxEntryMethod", {
                get: function () {
                    return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_COMBO_BOX';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AttributeCellValueDef.prototype, "isDropDownEntryMethod", {
                get: function () {
                    return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_DROP_DOWN';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AttributeCellValueDef.prototype, "isTextFieldEntryMethod", {
                get: function () {
                    return !this.entryMethod || this.entryMethod === 'ENTRY_METHOD_TEXT_FIELD';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AttributeCellValueDef.prototype, "presentationLength", {
                get: function () {
                    return this._presentationLength;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AttributeCellValueDef.prototype, "propertyName", {
                get: function () {
                    return this._propertyName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AttributeCellValueDef.prototype, "toolTip", {
                get: function () {
                    return this._toolTip;
                },
                enumerable: true,
                configurable: true
            });
            return AttributeCellValueDef;
        })(dialog.CellValueDef);
        dialog.AttributeCellValueDef = AttributeCellValueDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/16/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var ForcedLineCellValueDef = (function (_super) {
            __extends(ForcedLineCellValueDef, _super);
            function ForcedLineCellValueDef() {
                _super.call(this, null);
            }
            return ForcedLineCellValueDef;
        })(dialog.CellValueDef);
        dialog.ForcedLineCellValueDef = ForcedLineCellValueDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/16/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var LabelCellValueDef = (function (_super) {
            __extends(LabelCellValueDef, _super);
            function LabelCellValueDef(_value, style) {
                _super.call(this, style);
                this._value = _value;
            }
            Object.defineProperty(LabelCellValueDef.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return LabelCellValueDef;
        })(dialog.CellValueDef);
        dialog.LabelCellValueDef = LabelCellValueDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/16/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var TabCellValueDef = (function (_super) {
            __extends(TabCellValueDef, _super);
            function TabCellValueDef() {
                _super.call(this, null);
            }
            return TabCellValueDef;
        })(dialog.CellValueDef);
        dialog.TabCellValueDef = TabCellValueDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/16/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var SubstitutionCellValueDef = (function (_super) {
            __extends(SubstitutionCellValueDef, _super);
            function SubstitutionCellValueDef(_value, style) {
                _super.call(this, style);
                this._value = _value;
            }
            Object.defineProperty(SubstitutionCellValueDef.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return SubstitutionCellValueDef;
        })(dialog.CellValueDef);
        dialog.SubstitutionCellValueDef = SubstitutionCellValueDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
/*
    @TODO

    Test all of the deserialization methods
    They should all be handled, but the cover many of the edge cases (i.e. List<List<CellDef>>)
 */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var CellDef = (function () {
            function CellDef(_values) {
                this._values = _values;
            }
            Object.defineProperty(CellDef.prototype, "values", {
                get: function () {
                    return this._values;
                },
                enumerable: true,
                configurable: true
            });
            return CellDef;
        })();
        dialog.CellDef = CellDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
/*
    @TODO
*/
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var EntityRec;
        (function (EntityRec) {
            var Util;
            (function (Util) {
                function newEntityRec(objectId, props, annos) {
                    return annos ? new dialog.EntityRecImpl(objectId, props, annos) : new dialog.EntityRecImpl(objectId, props);
                }
                Util.newEntityRec = newEntityRec;
                function union(l1, l2) {
                    var result = ArrayUtil.copy(l1);
                    l2.forEach(function (p2) {
                        if (!l1.some(function (p1, i) {
                            if (p1.name === p2.name) {
                                result[i] = p2;
                                return true;
                            }
                            return false;
                        })) {
                            result.push(p2);
                        }
                    });
                    return result;
                }
                Util.union = union;
                //module level functions
                function fromWSEditorRecord(otype, jsonObj) {
                    var objectId = jsonObj['objectId'];
                    var namesJson = jsonObj['names'];
                    if (namesJson['WS_LTYPE'] !== 'String') {
                        return new Failure('fromWSEditorRecord: Expected WS_LTYPE of String but found ' + namesJson['WS_LTYPE']);
                    }
                    var namesRaw = namesJson['values'];
                    var propsJson = jsonObj['properties'];
                    if (propsJson['WS_LTYPE'] !== 'Object') {
                        return new Failure('fromWSEditorRecord: Expected WS_LTYPE of Object but found ' + propsJson['WS_LTYPE']);
                    }
                    var propsRaw = propsJson['values'];
                    var propsTry = dialog.Prop.fromWSNamesAndValues(namesRaw, propsRaw);
                    if (propsTry.isFailure)
                        return new Failure(propsTry.failure);
                    var props = propsTry.success;
                    if (jsonObj['propertyAnnotations']) {
                        var propAnnosObj = jsonObj['propertyAnnotations'];
                        var annotatedPropsTry = dialog.DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosObj);
                        if (annotatedPropsTry.isFailure)
                            return new Failure(annotatedPropsTry.failure);
                    }
                    var recAnnos = null;
                    if (jsonObj['recordAnnotation']) {
                        var recAnnosTry = dialog.DataAnno.fromWS('WSDataAnnotation', jsonObj['recordAnnotation']);
                        if (recAnnosTry.isFailure)
                            return new Failure(recAnnosTry.failure);
                        recAnnos = recAnnosTry.success;
                    }
                    return new Success(new dialog.EntityRecImpl(objectId, props, recAnnos));
                }
                Util.fromWSEditorRecord = fromWSEditorRecord;
            })(Util = EntityRec.Util || (EntityRec.Util = {}));
        })(EntityRec = dialog.EntityRec || (dialog.EntityRec = {}));
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var EntityRecDef = (function () {
            function EntityRecDef(_propDefs) {
                this._propDefs = _propDefs;
            }
            Object.defineProperty(EntityRecDef.prototype, "propCount", {
                get: function () {
                    return this.propDefs.length;
                },
                enumerable: true,
                configurable: true
            });
            EntityRecDef.prototype.propDefAtName = function (name) {
                var propDef = null;
                this.propDefs.some(function (p) {
                    if (p.name === name) {
                        propDef = p;
                        return true;
                    }
                    return false;
                });
                return propDef;
            };
            Object.defineProperty(EntityRecDef.prototype, "propDefs", {
                // Note we need to support both 'propDefs' and 'propertyDefs' as both
                // field names seem to be used in the dialog model
                get: function () {
                    return this._propDefs;
                },
                set: function (propDefs) {
                    this._propDefs = propDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityRecDef.prototype, "propertyDefs", {
                get: function () {
                    return this._propDefs;
                },
                set: function (propDefs) {
                    this._propDefs = propDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityRecDef.prototype, "propNames", {
                get: function () {
                    return this.propDefs.map(function (p) { return p.name; });
                },
                enumerable: true,
                configurable: true
            });
            return EntityRecDef;
        })();
        dialog.EntityRecDef = EntityRecDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/4/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var BinaryRef = (function () {
            function BinaryRef(_settings) {
                this._settings = _settings;
            }
            BinaryRef.fromWSValue = function (encodedValue, settings) {
                if (encodedValue && encodedValue.length > 0) {
                    return new Success(new InlineBinaryRef(Base64.decode(encodedValue), settings));
                }
                else {
                    return new Success(new ObjectBinaryRef(settings));
                }
            };
            Object.defineProperty(BinaryRef.prototype, "settings", {
                get: function () {
                    return this._settings;
                },
                enumerable: true,
                configurable: true
            });
            return BinaryRef;
        })();
        dialog.BinaryRef = BinaryRef;
        var InlineBinaryRef = (function (_super) {
            __extends(InlineBinaryRef, _super);
            function InlineBinaryRef(_inlineData, settings) {
                _super.call(this, settings);
                this._inlineData = _inlineData;
            }
            Object.defineProperty(InlineBinaryRef.prototype, "inlineData", {
                /* Base64 encoded data */
                get: function () {
                    return this._inlineData;
                },
                enumerable: true,
                configurable: true
            });
            return InlineBinaryRef;
        })(BinaryRef);
        dialog.InlineBinaryRef = InlineBinaryRef;
        var ObjectBinaryRef = (function (_super) {
            __extends(ObjectBinaryRef, _super);
            function ObjectBinaryRef(settings) {
                _super.call(this, settings);
            }
            return ObjectBinaryRef;
        })(BinaryRef);
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/5/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var CodeRef = (function () {
            function CodeRef(_code, _description) {
                this._code = _code;
                this._description = _description;
            }
            CodeRef.fromFormattedValue = function (value) {
                var pair = StringUtil.splitSimpleKeyValuePair(value);
                return new CodeRef(pair[0], pair[1]);
            };
            Object.defineProperty(CodeRef.prototype, "code", {
                get: function () {
                    return this._code;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CodeRef.prototype, "description", {
                get: function () {
                    return this._description;
                },
                enumerable: true,
                configurable: true
            });
            CodeRef.prototype.toString = function () {
                return this.code + ":" + this.description;
            };
            return CodeRef;
        })();
        dialog.CodeRef = CodeRef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/5/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var ObjectRef = (function () {
            function ObjectRef(_objectId, _description) {
                this._objectId = _objectId;
                this._description = _description;
            }
            ObjectRef.fromFormattedValue = function (value) {
                var pair = StringUtil.splitSimpleKeyValuePair(value);
                return new ObjectRef(pair[0], pair[1]);
            };
            Object.defineProperty(ObjectRef.prototype, "description", {
                get: function () {
                    return this._description;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ObjectRef.prototype, "objectId", {
                get: function () {
                    return this._objectId;
                },
                enumerable: true,
                configurable: true
            });
            ObjectRef.prototype.toString = function () {
                return this.objectId + ":" + this.description;
            };
            return ObjectRef;
        })();
        dialog.ObjectRef = ObjectRef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/5/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GeoFix = (function () {
            function GeoFix(_latitude, _longitude, _source, _accuracy) {
                this._latitude = _latitude;
                this._longitude = _longitude;
                this._source = _source;
                this._accuracy = _accuracy;
            }
            GeoFix.fromFormattedValue = function (value) {
                var pair = StringUtil.splitSimpleKeyValuePair(value);
                return new GeoFix(Number(pair[0]), Number(pair[1]), null, null);
            };
            Object.defineProperty(GeoFix.prototype, "latitude", {
                get: function () {
                    return this._latitude;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GeoFix.prototype, "longitude", {
                get: function () {
                    return this._longitude;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GeoFix.prototype, "source", {
                get: function () {
                    return this._source;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GeoFix.prototype, "accuracy", {
                get: function () {
                    return this._accuracy;
                },
                enumerable: true,
                configurable: true
            });
            GeoFix.prototype.toString = function () {
                return this.latitude + ":" + this.longitude;
            };
            return GeoFix;
        })();
        dialog.GeoFix = GeoFix;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/5/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var GeoLocation = (function () {
        function GeoLocation(_latitude, _longitude) {
            this._latitude = _latitude;
            this._longitude = _longitude;
        }
        GeoLocation.fromFormattedValue = function (value) {
            var pair = StringUtil.splitSimpleKeyValuePair(value);
            return new GeoLocation(Number(pair[0]), Number(pair[1]));
        };
        Object.defineProperty(GeoLocation.prototype, "latitude", {
            get: function () {
                return this._latitude;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeoLocation.prototype, "longitude", {
            get: function () {
                return this._longitude;
            },
            enumerable: true,
            configurable: true
        });
        GeoLocation.prototype.toString = function () {
            return this.latitude + ":" + this.longitude;
        };
        return GeoLocation;
    })();
    catavolt.GeoLocation = GeoLocation;
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/2/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DataAnno = (function () {
            function DataAnno(_name, _value) {
                this._name = _name;
                this._value = _value;
            }
            DataAnno.annotatePropsUsingWSDataAnnotation = function (props, jsonObj) {
                return dialog.DialogTriple.fromListOfWSDialogObject(jsonObj, 'WSDataAnnotation', dialog.OType.factoryFn).bind(function (propAnnos) {
                    var annotatedProps = [];
                    for (var i = 0; i < props.length; i++) {
                        var p = props[i];
                        var annos = propAnnos[i];
                        if (annos) {
                            annotatedProps.push(new dialog.Prop(p.name, p.value, annos));
                        }
                        else {
                            annotatedProps.push(p);
                        }
                    }
                    return new Success(annotatedProps);
                });
            };
            DataAnno.backgroundColor = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isBackgroundColor;
                });
                return result ? result.backgroundColor : null;
            };
            DataAnno.foregroundColor = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isForegroundColor;
                });
                return result ? result.foregroundColor : null;
            };
            DataAnno.fromWS = function (otype, jsonObj) {
                var stringObj = jsonObj['annotations'];
                if (stringObj['WS_LTYPE'] !== 'String') {
                    return new Failure('DataAnno:fromWS: expected WS_LTYPE of String but found ' + stringObj['WS_LTYPE']);
                }
                var annoStrings = stringObj['values'];
                var annos = [];
                for (var i = 0; i < annoStrings.length; i++) {
                    annos.push(DataAnno.parseString(annoStrings[i]));
                }
                return new Success(annos);
            };
            DataAnno.imageName = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isImageName;
                });
                return result ? result.value : null;
            };
            DataAnno.imagePlacement = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isImagePlacement;
                });
                return result ? result.value : null;
            };
            DataAnno.isBoldText = function (annos) {
                return annos.some(function (anno) { return anno.isBoldText; });
            };
            DataAnno.isItalicText = function (annos) {
                return annos.some(function (anno) { return anno.isItalicText; });
            };
            DataAnno.isPlacementCenter = function (annos) {
                return annos.some(function (anno) { return anno.isPlacementCenter; });
            };
            DataAnno.isPlacementLeft = function (annos) {
                return annos.some(function (anno) { return anno.isPlacementLeft; });
            };
            DataAnno.isPlacementRight = function (annos) {
                return annos.some(function (anno) { return anno.isPlacementRight; });
            };
            DataAnno.isPlacementStretchUnder = function (annos) {
                return annos.some(function (anno) { return anno.isPlacementStretchUnder; });
            };
            DataAnno.isPlacementUnder = function (annos) {
                return annos.some(function (anno) { return anno.isPlacementUnder; });
            };
            DataAnno.isUnderlineText = function (annos) {
                return annos.some(function (anno) { return anno.isUnderlineText; });
            };
            DataAnno.overrideText = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isOverrideText;
                });
                return result ? result.value : null;
            };
            DataAnno.tipText = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isTipText;
                });
                return result ? result.value : null;
            };
            DataAnno.toListOfWSDataAnno = function (annos) {
                var result = { 'WS_LTYPE': 'WSDataAnno' };
                var values = [];
                annos.forEach(function (anno) { values.push(anno.toWS()); });
                result['values'] = values;
                return result;
            };
            DataAnno.parseString = function (formatted) {
                var pair = StringUtil.splitSimpleKeyValuePair(formatted);
                return new DataAnno(pair[0], pair[1]);
            };
            Object.defineProperty(DataAnno.prototype, "backgroundColor", {
                get: function () {
                    return this.isBackgroundColor ? this.value : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "foregroundColor", {
                get: function () {
                    return this.isForegroundColor ? this.value : null;
                },
                enumerable: true,
                configurable: true
            });
            DataAnno.prototype.equals = function (dataAnno) {
                return this.name === dataAnno.name;
            };
            Object.defineProperty(DataAnno.prototype, "isBackgroundColor", {
                get: function () {
                    return this.name === DataAnno.BACKGROUND_COLOR;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isBoldText", {
                get: function () {
                    return this.name === DataAnno.BOLD_TEXT && this.value === DataAnno.TRUE_VALUE;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isForegroundColor", {
                get: function () {
                    return this.name === DataAnno.FOREGROUND_COLOR;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isImageName", {
                get: function () {
                    return this.name === DataAnno.IMAGE_NAME;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isImagePlacement", {
                get: function () {
                    return this.name === DataAnno.IMAGE_PLACEMENT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isItalicText", {
                get: function () {
                    return this.name === DataAnno.ITALIC_TEXT && this.value === DataAnno.TRUE_VALUE;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isOverrideText", {
                get: function () {
                    return this.name === DataAnno.OVERRIDE_TEXT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementCenter", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_CENTER;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementLeft", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_LEFT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementRight", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_RIGHT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementStretchUnder", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_STRETCH_UNDER;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementUnder", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_UNDER;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isTipText", {
                get: function () {
                    return this.name === DataAnno.TIP_TEXT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isUnderlineText", {
                get: function () {
                    return this.name === DataAnno.UNDERLINE && this.value === DataAnno.TRUE_VALUE;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            DataAnno.prototype.toWS = function () {
                return { 'WS_OTYPE': 'WSDataAnno', 'name': this.name, 'value': this.value };
            };
            DataAnno.BOLD_TEXT = "BOLD_TEXT";
            DataAnno.BACKGROUND_COLOR = "BGND_COLOR";
            DataAnno.FOREGROUND_COLOR = "FGND_COLOR";
            DataAnno.IMAGE_NAME = "IMAGE_NAME";
            DataAnno.IMAGE_PLACEMENT = "IMAGE_PLACEMENT";
            DataAnno.ITALIC_TEXT = "ITALIC_TEXT";
            DataAnno.OVERRIDE_TEXT = "OVRD_TEXT";
            DataAnno.TIP_TEXT = "TIP_TEXT";
            DataAnno.UNDERLINE = "UNDERLINE";
            DataAnno.TRUE_VALUE = "1";
            DataAnno.PLACEMENT_CENTER = "CENTER";
            DataAnno.PLACEMENT_LEFT = "LEFT";
            DataAnno.PLACEMENT_RIGHT = "RIGHT";
            DataAnno.PLACEMENT_UNDER = "UNDER";
            DataAnno.PLACEMENT_STRETCH_UNDER = "STRETCH_UNDER";
            return DataAnno;
        })();
        dialog.DataAnno = DataAnno;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/2/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var Prop = (function () {
            function Prop(_name, _value, _annos) {
                if (_annos === void 0) { _annos = []; }
                this._name = _name;
                this._value = _value;
                this._annos = _annos;
            }
            Prop.fromListOfWSValue = function (values) {
                var props = [];
                values.forEach(function (v) {
                    var propTry = Prop.fromWSValue(v);
                    if (propTry.isFailure)
                        return new Failure(propTry.failure);
                    props.push(propTry.success);
                });
                return new Success(props);
            };
            Prop.fromWSNameAndWSValue = function (name, value) {
                var propTry = Prop.fromWSValue(value);
                if (propTry.isFailure) {
                    return new Failure(propTry.failure);
                }
                return new Success(new Prop(name, propTry.success));
            };
            Prop.fromWSNamesAndValues = function (names, values) {
                if (names.length != values.length) {
                    return new Failure("Prop::fromWSNamesAndValues: names and values must be of same length");
                }
                var list = [];
                for (var i = 0; i < names.length; i++) {
                    var propTry = Prop.fromWSNameAndWSValue(names[i], values[i]);
                    if (propTry.isFailure) {
                        return new Failure(propTry.failure);
                    }
                    list.push(propTry.success);
                }
                return new Success(list);
            };
            Prop.fromWSValue = function (value) {
                var propValue = value;
                if (value && 'object' === typeof value) {
                    var PType = value['WS_PTYPE'];
                    var strVal = value['value'];
                    if (PType) {
                        if (PType === 'Decimal') {
                            propValue = Number(strVal);
                        }
                        else if (PType === 'Date') {
                            propValue = new Date(strVal);
                        }
                        else if (PType === 'DateTime') {
                            propValue = new Date(strVal);
                        }
                        else if (PType === 'Time') {
                            propValue = new Date(strVal);
                        }
                        else if (PType === 'BinaryRef') {
                            var binaryRefTry = dialog.BinaryRef.fromWSValue(strVal, value['properties']);
                            if (binaryRefTry.isFailure)
                                return new Failure(binaryRefTry.failure);
                            propValue = binaryRefTry.success;
                        }
                        else if (PType === 'ObjectRef') {
                            propValue = dialog.ObjectRef.fromFormattedValue(strVal);
                        }
                        else if (PType === 'CodeRef') {
                            propValue = dialog.CodeRef.fromFormattedValue(strVal);
                        }
                        else if (PType === 'GeoFix') {
                            propValue = dialog.GeoFix.fromFormattedValue(strVal);
                        }
                        else if (PType === 'GeoLocation') {
                            propValue = catavolt.GeoLocation.fromFormattedValue(strVal);
                        }
                        else {
                            return new Failure('Prop::fromWSValue: Property WS_PTYPE is not valid: ' + PType);
                        }
                    }
                }
                return new Success(propValue);
            };
            Prop.fromWS = function (otype, jsonObj) {
                var name = jsonObj['name'];
                var valueTry = Prop.fromWSValue(jsonObj['value']);
                if (valueTry.isFailure)
                    return new Failure(valueTry.failure);
                var annos = null;
                if (jsonObj['annos']) {
                    var annosListTry = dialog.DialogTriple.fromListOfWSDialogObject(jsonObj['annos'], 'WSDataAnno', dialog.OType.factoryFn);
                    if (annosListTry.isFailure)
                        return new Failure(annosListTry.failure);
                    annos = annosListTry.success;
                }
                return new Success(new Prop(name, valueTry.success, annos));
            };
            Prop.toWSProperty = function (o) {
                if (typeof o === 'number') {
                    return { 'WS_PTYPE': 'Decimal', 'value': String(o) };
                }
                else if (typeof o === 'object') {
                    if (o instanceof Date) {
                        return { 'WS_PTYPE': 'DateTime', 'value': o.toUTCString() };
                    }
                    else if (o instanceof dialog.CodeRef) {
                        return { 'WS_PTYPE': 'CodeRef', 'value': o.toString() };
                    }
                    else if (o instanceof dialog.ObjectRef) {
                        return { 'WS_PTYPE': 'ObjectRef', 'value': o.toString() };
                    }
                    else if (o instanceof dialog.GeoFix) {
                        return { 'WS_PTYPE': 'GeoFix', 'value': o.toString() };
                    }
                    else if (o instanceof catavolt.GeoLocation) {
                        return { 'WS_PTYPE': 'GeoLocation', 'value': o.toString() };
                    }
                }
                else {
                    return o;
                }
            };
            Prop.toWSListOfProperties = function (list) {
                var result = { 'WS_LTYPE': 'Object' };
                var values = [];
                list.forEach(function (o) { values.push(Prop.toWSProperty(o)); });
                result['values'] = values;
                return result;
            };
            Prop.toWSListOfString = function (list) {
                return { 'WS_LTYPE': 'String', 'values': list };
            };
            Prop.toListOfWSProp = function (props) {
                var result = { 'WS_LTYPE': 'WSProp' };
                var values = [];
                props.forEach(function (prop) { values.push(prop.toWS()); });
                result['values'] = values;
                return result;
            };
            Object.defineProperty(Prop.prototype, "annos", {
                get: function () {
                    return this._annos;
                },
                enumerable: true,
                configurable: true
            });
            Prop.prototype.equals = function (prop) {
                return this.name === prop.name && this.value === prop.value;
            };
            Object.defineProperty(Prop.prototype, "backgroundColor", {
                get: function () {
                    return dialog.DataAnno.backgroundColor(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "foregroundColor", {
                get: function () {
                    return dialog.DataAnno.foregroundColor(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "imageName", {
                get: function () {
                    return dialog.DataAnno.imageName(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "imagePlacement", {
                get: function () {
                    return dialog.DataAnno.imagePlacement(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isBoldText", {
                get: function () {
                    return dialog.DataAnno.isBoldText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isItalicText", {
                get: function () {
                    return dialog.DataAnno.isItalicText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isPlacementCenter", {
                get: function () {
                    return dialog.DataAnno.isPlacementCenter(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isPlacementLeft", {
                get: function () {
                    return dialog.DataAnno.isPlacementLeft(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isPlacementRight", {
                get: function () {
                    return dialog.DataAnno.isPlacementRight(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isPlacementStretchUnder", {
                get: function () {
                    return dialog.DataAnno.isPlacementStretchUnder(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isPlacementUnder", {
                get: function () {
                    return dialog.DataAnno.isPlacementUnder(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "isUnderline", {
                get: function () {
                    return dialog.DataAnno.isUnderlineText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "overrideText", {
                get: function () {
                    return dialog.DataAnno.overrideText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "tipText", {
                get: function () {
                    return dialog.DataAnno.tipText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            Prop.prototype.toWS = function () {
                var result = { 'WS_OTYPE': 'WSProp', 'name': this.name, 'value': Prop.toWSProperty(this.value) };
                if (this.annos) {
                    result['annos'] = dialog.DataAnno.toListOfWSDataAnno(this.annos);
                }
                return result;
            };
            return Prop;
        })();
        dialog.Prop = Prop;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var PropDef = (function () {
            function PropDef(_name, _type, _elementType, _style, _propertyLength, _propertyScale, _presLength, _presScale, _dataDictionaryKey, _maintainable, _writeEnabled, _canCauseSideEffects) {
                this._name = _name;
                this._type = _type;
                this._elementType = _elementType;
                this._style = _style;
                this._propertyLength = _propertyLength;
                this._propertyScale = _propertyScale;
                this._presLength = _presLength;
                this._presScale = _presScale;
                this._dataDictionaryKey = _dataDictionaryKey;
                this._maintainable = _maintainable;
                this._writeEnabled = _writeEnabled;
                this._canCauseSideEffects = _canCauseSideEffects;
            }
            Object.defineProperty(PropDef.prototype, "canCauseSideEffects", {
                get: function () {
                    return this._canCauseSideEffects;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "dataDictionaryKey", {
                get: function () {
                    return this._dataDictionaryKey;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "elementType", {
                get: function () {
                    return this._elementType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isBarcodeType", {
                get: function () {
                    return this.type &&
                        this.type === 'STRING' &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_BARCODE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isBinaryType", {
                get: function () {
                    return this.isLargeBinaryType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isBooleanType", {
                get: function () {
                    return this.type && this.type === 'BOOLEAN';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isCodeRefType", {
                get: function () {
                    return this.type && this.type === 'CODE_REF';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isDateType", {
                get: function () {
                    return this.type && this.type === 'DATE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isDateTimeType", {
                get: function () {
                    return this.type && this.type === 'DATE_TIME';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isDecimalType", {
                get: function () {
                    return this.type && this.type === 'DECIMAL';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isDoubleType", {
                get: function () {
                    return this.type && this.type === 'DOUBLE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isEmailType", {
                get: function () {
                    return this.type && this.type === 'DATA_EMAIL';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isGeoFixType", {
                get: function () {
                    return this.type && this.type === 'GEO_FIX';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isGeoLocationType", {
                get: function () {
                    return this.type && this.type === 'GEO_LOCATION';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isHTMLType", {
                get: function () {
                    return this.type && this.type === 'DATA_HTML';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isListType", {
                get: function () {
                    return this.type && this.type === 'LIST';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isInlineMediaStyle", {
                get: function () {
                    return this.style &&
                        (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isIntType", {
                get: function () {
                    return this.type && this.type === 'INT';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isLargeBinaryType", {
                get: function () {
                    return this.type &&
                        this.type === 'com.dgoi.core.domain.BinaryRef' &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_LARGEBINARY';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isLongType", {
                get: function () {
                    return this.type && this.type === 'LONG';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isMoneyType", {
                get: function () {
                    return this.isNumericType &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_MONEY';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isNumericType", {
                get: function () {
                    return this.isDecimalType || this.isDoubleType || this.isIntType || this.isLongType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isObjRefType", {
                get: function () {
                    return this.type && this.type === 'OBJ_REF';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isPasswordType", {
                get: function () {
                    return this.isStringType &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_PASSWORD';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isPercentType", {
                get: function () {
                    return this.isNumericType &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_PERCENT';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isStringType", {
                get: function () {
                    return this.type && this.type === 'STRING';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isTelephoneType", {
                get: function () {
                    return this.isStringType &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_TELEPHONE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isTextBlock", {
                get: function () {
                    return this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_TEXT_BLOCK';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isTimeType", {
                get: function () {
                    return this.type && this.type === 'TIME';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isUnformattedNumericType", {
                get: function () {
                    return this.isNumericType &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_UNFORMATTED_NUMBER';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isURLType", {
                get: function () {
                    return this.isStringType &&
                        this.dataDictionaryKey &&
                        this.dataDictionaryKey === 'DATA_URL';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "maintainable", {
                get: function () {
                    return this._maintainable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "presLength", {
                get: function () {
                    return this._presLength;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "presScale", {
                get: function () {
                    return this._presScale;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "propertyLength", {
                get: function () {
                    return this._propertyLength;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "propertyScale", {
                get: function () {
                    return this._propertyScale;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "style", {
                get: function () {
                    return this._style;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "writeEnabled", {
                get: function () {
                    return this._writeEnabled;
                },
                enumerable: true,
                configurable: true
            });
            PropDef.STYLE_INLINE_MEDIA = "inlineMedia";
            PropDef.STYLE_INLINE_MEDIA2 = "Image/Video";
            return PropDef;
        })();
        dialog.PropDef = PropDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var SortPropDef = (function () {
            function SortPropDef(_name, _direction) {
                this._name = _name;
                this._direction = _direction;
            }
            Object.defineProperty(SortPropDef.prototype, "direction", {
                get: function () {
                    return this._direction;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SortPropDef.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            return SortPropDef;
        })();
        dialog.SortPropDef = SortPropDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/27/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var PropFormatter = (function () {
            function PropFormatter() {
            }
            PropFormatter.formatForRead = function (prop, propDef) {
                return 'R:' + prop ? PropFormatter.toString(prop) : '';
            };
            PropFormatter.formatForWrite = function (prop, propDef) {
                return prop ? PropFormatter.toString(prop) : '';
            };
            PropFormatter.parse = function (value, propDef) {
                var propValue = value;
                if (propDef.isDecimalType) {
                    propValue = Number(value);
                }
                else if (propDef.isLongType) {
                    propValue = Number(value);
                }
                else if (propDef.isBooleanType) {
                    propValue = value !== 'false';
                }
                else if (propDef.isDateType) {
                    propValue = new Date(value);
                }
                else if (propDef.isDateTimeType) {
                    propValue = new Date(value);
                }
                else if (propDef.isTimeType) {
                    propValue = new Date(value);
                }
                else if (propDef.isObjRefType) {
                    propValue = dialog.ObjectRef.fromFormattedValue(value);
                }
                else if (propDef.isCodeRefType) {
                    propValue = dialog.CodeRef.fromFormattedValue(value);
                }
                else if (propDef.isGeoFixType) {
                    propValue = dialog.GeoFix.fromFormattedValue(value);
                }
                else if (propDef.isGeoLocationType) {
                    propValue = catavolt.GeoLocation.fromFormattedValue(value);
                }
                return propValue;
            };
            PropFormatter.toString = function (o) {
                if (typeof o === 'number') {
                    return String(o);
                }
                else if (typeof o === 'object') {
                    if (o instanceof Date) {
                        return o.toUTCString();
                    }
                    else if (o instanceof dialog.CodeRef) {
                        return o.toString();
                    }
                    else if (o instanceof dialog.ObjectRef) {
                        return o.toString();
                    }
                    else if (o instanceof dialog.GeoFix) {
                        return o.toString();
                    }
                    else if (o instanceof catavolt.GeoLocation) {
                        return o.toString();
                    }
                    else {
                        return String(o);
                    }
                }
                else {
                    return String(o);
                }
            };
            return PropFormatter;
        })();
        dialog.PropFormatter = PropFormatter;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GraphDataPointDef = (function () {
            function GraphDataPointDef(_name, _type, _plotType, _legendkey) {
                this._name = _name;
                this._type = _type;
                this._plotType = _plotType;
                this._legendkey = _legendkey;
            }
            return GraphDataPointDef;
        })();
        dialog.GraphDataPointDef = GraphDataPointDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/13/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var EntityRecImpl = (function () {
            function EntityRecImpl(objectId, props, annos) {
                if (props === void 0) { props = []; }
                if (annos === void 0) { annos = []; }
                this.objectId = objectId;
                this.props = props;
                this.annos = annos;
            }
            EntityRecImpl.prototype.annosAtName = function (propName) {
                var p = this.propAtName(propName);
                return p ? p.annos : [];
            };
            EntityRecImpl.prototype.afterEffects = function (after) {
                var _this = this;
                var effects = [];
                after.props.forEach(function (afterProp) {
                    var beforeProp = _this.propAtName(afterProp.name);
                    if (!afterProp.equals(beforeProp)) {
                        effects.push(afterProp);
                    }
                });
                return new EntityRecImpl(after.objectId, effects);
            };
            Object.defineProperty(EntityRecImpl.prototype, "backgroundColor", {
                get: function () {
                    return dialog.DataAnno.backgroundColor(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.backgroundColorFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.backgroundColor ? p.backgroundColor : this.backgroundColor;
            };
            Object.defineProperty(EntityRecImpl.prototype, "foregroundColor", {
                get: function () {
                    return dialog.DataAnno.foregroundColor(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.foregroundColorFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.foregroundColor ? p.foregroundColor : this.foregroundColor;
            };
            Object.defineProperty(EntityRecImpl.prototype, "imageName", {
                get: function () {
                    return dialog.DataAnno.imageName(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.imageNameFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.imageName ? p.imageName : this.imageName;
            };
            Object.defineProperty(EntityRecImpl.prototype, "imagePlacement", {
                get: function () {
                    return dialog.DataAnno.imagePlacement(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.imagePlacementFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.imagePlacement ? p.imagePlacement : this.imagePlacement;
            };
            Object.defineProperty(EntityRecImpl.prototype, "isBoldText", {
                get: function () {
                    return dialog.DataAnno.isBoldText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.isBoldTextFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.isBoldText ? p.isBoldText : this.isBoldText;
            };
            Object.defineProperty(EntityRecImpl.prototype, "isItalicText", {
                get: function () {
                    return dialog.DataAnno.isItalicText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.isItalicTextFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.isItalicText ? p.isItalicText : this.isItalicText;
            };
            Object.defineProperty(EntityRecImpl.prototype, "isPlacementCenter", {
                get: function () {
                    return dialog.DataAnno.isPlacementCenter(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.isPlacementCenterFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.isPlacementCenter ? p.isPlacementCenter : this.isPlacementCenter;
            };
            Object.defineProperty(EntityRecImpl.prototype, "isPlacementLeft", {
                get: function () {
                    return dialog.DataAnno.isPlacementLeft(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.isPlacementLeftFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.isPlacementLeft ? p.isPlacementLeft : this.isPlacementLeft;
            };
            Object.defineProperty(EntityRecImpl.prototype, "isPlacementRight", {
                get: function () {
                    return dialog.DataAnno.isPlacementRight(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.isPlacementRightFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.isPlacementRight ? p.isPlacementRight : this.isPlacementRight;
            };
            Object.defineProperty(EntityRecImpl.prototype, "isPlacementStretchUnder", {
                get: function () {
                    return dialog.DataAnno.isPlacementStretchUnder(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.isPlacementStretchUnderFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.isPlacementStretchUnder ? p.isPlacementStretchUnder : this.isPlacementStretchUnder;
            };
            Object.defineProperty(EntityRecImpl.prototype, "isPlacementUnder", {
                get: function () {
                    return dialog.DataAnno.isPlacementUnder(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.isPlacementUnderFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.isPlacementUnder ? p.isPlacementUnder : this.isPlacementUnder;
            };
            Object.defineProperty(EntityRecImpl.prototype, "isUnderline", {
                get: function () {
                    return dialog.DataAnno.isUnderlineText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.isUnderlineFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.isUnderline ? p.isUnderline : this.isUnderline;
            };
            Object.defineProperty(EntityRecImpl.prototype, "overrideText", {
                get: function () {
                    return dialog.DataAnno.overrideText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.overrideTextFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.overrideText ? p.overrideText : this.overrideText;
            };
            EntityRecImpl.prototype.propAtIndex = function (index) {
                return this.props[index];
            };
            EntityRecImpl.prototype.propAtName = function (propName) {
                var prop = null;
                this.props.some(function (p) {
                    if (p.name === propName) {
                        prop = p;
                        return true;
                    }
                    return false;
                });
                return prop;
            };
            Object.defineProperty(EntityRecImpl.prototype, "propCount", {
                get: function () {
                    return this.props.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityRecImpl.prototype, "propNames", {
                get: function () {
                    return this.props.map(function (p) { return p.name; });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityRecImpl.prototype, "propValues", {
                get: function () {
                    return this.props.map(function (p) { return p.value; });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityRecImpl.prototype, "tipText", {
                get: function () {
                    return dialog.DataAnno.tipText(this.annos);
                },
                enumerable: true,
                configurable: true
            });
            EntityRecImpl.prototype.tipTextFor = function (propName) {
                var p = this.propAtName(propName);
                return p && p.tipText ? p.tipText : this.tipText;
            };
            EntityRecImpl.prototype.toEntityRec = function () {
                return this;
            };
            EntityRecImpl.prototype.toWSEditorRecord = function () {
                var result = { 'WS_OTYPE': 'WSEditorRecord' };
                if (this.objectId)
                    result['objectId'] = this.objectId;
                result['names'] = dialog.Prop.toWSListOfString(this.propNames);
                result['properties'] = dialog.Prop.toWSListOfProperties(this.propValues);
                return result;
            };
            EntityRecImpl.prototype.toWS = function () {
                var result = { 'WS_OTYPE': 'WSEntityRec' };
                if (this.objectId)
                    result['objectId'] = this.objectId;
                result['props'] = dialog.Prop.toListOfWSProp(this.props);
                if (this.annos)
                    result['annos'] = dialog.DataAnno.toListOfWSDataAnno(this.annos);
                return result;
            };
            EntityRecImpl.prototype.valueAtName = function (propName) {
                var value = null;
                this.props.some(function (p) {
                    if (p.name === propName) {
                        value = p.value;
                        return true;
                    }
                    return false;
                });
                return value;
            };
            return EntityRecImpl;
        })();
        dialog.EntityRecImpl = EntityRecImpl;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/27/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var EntityBuffer = (function () {
            function EntityBuffer(_before, _after) {
                this._before = _before;
                this._after = _after;
                if (!_before)
                    throw new Error('_before is null in EntityBuffer');
                if (!_after)
                    this._after = _before;
            }
            EntityBuffer.createEntityBuffer = function (objectId, before, after) {
                return new EntityBuffer(dialog.EntityRec.Util.newEntityRec(objectId, before), dialog.EntityRec.Util.newEntityRec(objectId, after));
            };
            Object.defineProperty(EntityBuffer.prototype, "after", {
                get: function () {
                    return this._after;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityBuffer.prototype, "annos", {
                get: function () { return this._after.annos; },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.annosAtName = function (propName) {
                return this._after.annosAtName(propName);
            };
            EntityBuffer.prototype.afterEffects = function (afterAnother) {
                if (afterAnother) {
                    return this._after.afterEffects(afterAnother);
                }
                else {
                    return this._before.afterEffects(this._after);
                }
            };
            Object.defineProperty(EntityBuffer.prototype, "backgroundColor", {
                get: function () {
                    return this._after.backgroundColor;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.backgroundColorFor = function (propName) {
                return this._after.backgroundColorFor(propName);
            };
            Object.defineProperty(EntityBuffer.prototype, "before", {
                get: function () {
                    return this._before;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityBuffer.prototype, "foregroundColor", {
                get: function () {
                    return this._after.foregroundColor;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.foregroundColorFor = function (propName) {
                return this._after.foregroundColorFor(propName);
            };
            Object.defineProperty(EntityBuffer.prototype, "imageName", {
                get: function () {
                    return this._after.imageName;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.imageNameFor = function (propName) {
                return this._after.imageNameFor(propName);
            };
            Object.defineProperty(EntityBuffer.prototype, "imagePlacement", {
                get: function () {
                    return this._after.imagePlacement;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.imagePlacementFor = function (propName) {
                return this._after.imagePlacement;
            };
            Object.defineProperty(EntityBuffer.prototype, "isBoldText", {
                get: function () {
                    return this._after.isBoldText;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.isBoldTextFor = function (propName) {
                return this._after.isBoldTextFor(propName);
            };
            EntityBuffer.prototype.isChanged = function (name) {
                var before = this._before.propAtName(name);
                var after = this._after.propAtName(name);
                return (before && after) ? !before.equals(after) : !(!before && !after);
            };
            Object.defineProperty(EntityBuffer.prototype, "isItalicText", {
                get: function () {
                    return this._after.isItalicText;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.isItalicTextFor = function (propName) {
                return this._after.isItalicTextFor(propName);
            };
            Object.defineProperty(EntityBuffer.prototype, "isPlacementCenter", {
                get: function () {
                    return this._after.isPlacementCenter;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.isPlacementCenterFor = function (propName) {
                return this._after.isPlacementCenterFor(propName);
            };
            Object.defineProperty(EntityBuffer.prototype, "isPlacementLeft", {
                get: function () {
                    return this._after.isPlacementLeft;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.isPlacementLeftFor = function (propName) {
                return this._after.isPlacementLeftFor(propName);
            };
            Object.defineProperty(EntityBuffer.prototype, "isPlacementRight", {
                get: function () {
                    return this._after.isPlacementRight;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.isPlacementRightFor = function (propName) {
                return this._after.isPlacementRightFor(propName);
            };
            Object.defineProperty(EntityBuffer.prototype, "isPlacementStretchUnder", {
                get: function () {
                    return this._after.isPlacementStretchUnder;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.isPlacementStretchUnderFor = function (propName) {
                return this._after.isPlacementStretchUnderFor(propName);
            };
            Object.defineProperty(EntityBuffer.prototype, "isPlacementUnder", {
                get: function () {
                    return this._after.isPlacementUnder;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.isPlacementUnderFor = function (propName) {
                return this._after.isPlacementUnderFor(propName);
            };
            Object.defineProperty(EntityBuffer.prototype, "isUnderline", {
                get: function () {
                    return this._after.isUnderline;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.isUnderlineFor = function (propName) {
                return this._after.isUnderlineFor(propName);
            };
            Object.defineProperty(EntityBuffer.prototype, "objectId", {
                get: function () { return this._after.objectId; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityBuffer.prototype, "overrideText", {
                get: function () {
                    return this._after.overrideText;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.overrideTextFor = function (propName) {
                return this._after.overrideTextFor(propName);
            };
            EntityBuffer.prototype.propAtIndex = function (index) {
                return this.props[index];
            };
            EntityBuffer.prototype.propAtName = function (propName) {
                return this._after.propAtName(propName);
            };
            Object.defineProperty(EntityBuffer.prototype, "propCount", {
                get: function () {
                    return this._after.propCount;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityBuffer.prototype, "propNames", {
                get: function () {
                    return this._after.propNames;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityBuffer.prototype, "props", {
                get: function () { return this._after.props; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityBuffer.prototype, "propValues", {
                get: function () {
                    return this._after.propValues;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.setValue = function (name, value) {
                this.props.some(function (prop) {
                    if (prop.name === name) {
                        prop.value = value;
                        return true;
                    }
                    return false;
                });
            };
            Object.defineProperty(EntityBuffer.prototype, "tipText", {
                get: function () {
                    return this._after.tipText;
                },
                enumerable: true,
                configurable: true
            });
            EntityBuffer.prototype.tipTextFor = function (propName) {
                return this._after.tipTextFor(propName);
            };
            EntityBuffer.prototype.toEntityRec = function () {
                return dialog.EntityRec.Util.newEntityRec(this.objectId, this.props);
            };
            EntityBuffer.prototype.toWSEditorRecord = function () {
                return this.afterEffects().toWSEditorRecord();
            };
            EntityBuffer.prototype.toWS = function () {
                return this.afterEffects().toWS();
            };
            EntityBuffer.prototype.valueAtName = function (propName) {
                return this._after.valueAtName(propName);
            };
            return EntityBuffer;
        })();
        dialog.EntityBuffer = EntityBuffer;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/24/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var NullEntityRec = (function () {
            function NullEntityRec() {
            }
            Object.defineProperty(NullEntityRec.prototype, "annos", {
                get: function () { return []; },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.annosAtName = function (propName) {
                return [];
            };
            NullEntityRec.prototype.afterEffects = function (after) {
                return after;
            };
            Object.defineProperty(NullEntityRec.prototype, "backgroundColor", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.backgroundColorFor = function (propName) {
                return null;
            };
            Object.defineProperty(NullEntityRec.prototype, "foregroundColor", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.foregroundColorFor = function (propName) {
                return null;
            };
            Object.defineProperty(NullEntityRec.prototype, "imageName", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.imageNameFor = function (propName) {
                return null;
            };
            Object.defineProperty(NullEntityRec.prototype, "imagePlacement", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.imagePlacementFor = function (propName) {
                return null;
            };
            Object.defineProperty(NullEntityRec.prototype, "isBoldText", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isBoldTextFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isItalicText", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isItalicTextFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isPlacementCenter", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isPlacementCenterFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isPlacementLeft", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isPlacementLeftFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isPlacementRight", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isPlacementRightFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isPlacementStretchUnder", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isPlacementStretchUnderFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isPlacementUnder", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isPlacementUnderFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "isUnderline", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.isUnderlineFor = function (propName) {
                return false;
            };
            Object.defineProperty(NullEntityRec.prototype, "objectId", {
                get: function () { return null; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NullEntityRec.prototype, "overrideText", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.overrideTextFor = function (propName) {
                return null;
            };
            NullEntityRec.prototype.propAtIndex = function (index) {
                return null;
            };
            NullEntityRec.prototype.propAtName = function (propName) {
                return null;
            };
            Object.defineProperty(NullEntityRec.prototype, "propCount", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NullEntityRec.prototype, "propNames", {
                get: function () {
                    return [];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NullEntityRec.prototype, "props", {
                get: function () { return []; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NullEntityRec.prototype, "propValues", {
                get: function () {
                    return [];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NullEntityRec.prototype, "tipText", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            NullEntityRec.prototype.tipTextFor = function (propName) {
                return null;
            };
            NullEntityRec.prototype.toEntityRec = function () {
                return this;
            };
            NullEntityRec.prototype.toWSEditorRecord = function () {
                var result = { 'WS_OTYPE': 'WSEditorRecord' };
                if (this.objectId)
                    result['objectId'] = this.objectId;
                result['names'] = dialog.Prop.toWSListOfString(this.propNames);
                result['properties'] = dialog.Prop.toWSListOfProperties(this.propValues);
                return result;
            };
            NullEntityRec.prototype.toWS = function () {
                var result = { 'WS_OTYPE': 'WSEntityRec' };
                if (this.objectId)
                    result['objectId'] = this.objectId;
                result['props'] = dialog.Prop.toListOfWSProp(this.props);
                if (this.annos)
                    result['annos'] = dialog.DataAnno.toListOfWSDataAnno(this.annos);
                return result;
            };
            NullEntityRec.prototype.valueAtName = function (propName) {
                return null;
            };
            NullEntityRec.singleton = new NullEntityRec();
            return NullEntityRec;
        })();
        dialog.NullEntityRec = NullEntityRec;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var ColumnDef = (function () {
            function ColumnDef(_name, _heading, _propertyDef) {
                this._name = _name;
                this._heading = _heading;
                this._propertyDef = _propertyDef;
            }
            Object.defineProperty(ColumnDef.prototype, "heading", {
                get: function () {
                    return this._heading;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColumnDef.prototype, "isInlineMediaStyle", {
                get: function () {
                    return this._propertyDef.isInlineMediaStyle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColumnDef.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColumnDef.prototype, "propertyDef", {
                get: function () {
                    return this._propertyDef;
                },
                enumerable: true,
                configurable: true
            });
            return ColumnDef;
        })();
        dialog.ColumnDef = ColumnDef;
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
        /*
            @TODO
        */
        var XPaneDef = (function () {
            function XPaneDef() {
            }
            XPaneDef.fromWS = function (otype, jsonObj) {
                if (jsonObj['listDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['listDef'], 'WSListDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['detailsDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['detailsDef'], 'WSDetailsDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['formDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['formDef'], 'WSFormDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['mapDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['mapDef'], 'WSMapDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['graphDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['graphDef'], 'WSGraphDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['barcodeScanDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['barcodeScanDef'], 'WSBarcodeScanDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['imagePickerDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['imagePickerDef'], 'WSImagePickerDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['geoFixDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['geoFixDef'], 'WSGeoFixDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['geoLocationDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['geoLocationDef'], 'WSGeoLocationDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['calendarDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['calendarDef'], 'WSCalendarDef', dialog.OType.factoryFn);
                }
                else {
                    return new Failure('XPaneDef::fromWS: Cannot determine concrete class for XPaneDef ' + ObjUtil.formatRecAttr(jsonObj));
                }
            };
            return XPaneDef;
        })();
        dialog.XPaneDef = XPaneDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XBarcodeScanDef = (function (_super) {
            __extends(XBarcodeScanDef, _super);
            function XBarcodeScanDef(paneId, name, title) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
            }
            return XBarcodeScanDef;
        })(dialog.XPaneDef);
        dialog.XBarcodeScanDef = XBarcodeScanDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XCalendarDef = (function (_super) {
            __extends(XCalendarDef, _super);
            function XCalendarDef(paneId, name, title, descriptionProperty, initialStyle, startDateProperty, startTimeProperty, endDateProperty, endTimeProperty, occurDateProperty, occurTimeProperty) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.descriptionProperty = descriptionProperty;
                this.initialStyle = initialStyle;
                this.startDateProperty = startDateProperty;
                this.startTimeProperty = startTimeProperty;
                this.endDateProperty = endDateProperty;
                this.endTimeProperty = endTimeProperty;
                this.occurDateProperty = occurDateProperty;
                this.occurTimeProperty = occurTimeProperty;
            }
            return XCalendarDef;
        })(dialog.XPaneDef);
        dialog.XCalendarDef = XCalendarDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
/*
    @TODO

    Note! Use this as a test example!
    It has an Array of Array with subitems that also have Array of Array!!
*/
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XDetailsDef = (function (_super) {
            __extends(XDetailsDef, _super);
            function XDetailsDef(paneId, name, title, cancelButtonText, commitButtonText, editable, focusPropertyName, overrideGML, rows) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.cancelButtonText = cancelButtonText;
                this.commitButtonText = commitButtonText;
                this.editable = editable;
                this.focusPropertyName = focusPropertyName;
                this.overrideGML = overrideGML;
                this.rows = rows;
            }
            Object.defineProperty(XDetailsDef.prototype, "graphicalMarkup", {
                get: function () {
                    return this.overrideGML;
                },
                enumerable: true,
                configurable: true
            });
            return XDetailsDef;
        })(dialog.XPaneDef);
        dialog.XDetailsDef = XDetailsDef;
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
        var XFormDef = (function (_super) {
            __extends(XFormDef, _super);
            function XFormDef(borderStyle, formLayout, formStyle, name, paneId, title, headerDefRef, paneDefRefs) {
                _super.call(this);
                this.borderStyle = borderStyle;
                this.formLayout = formLayout;
                this.formStyle = formStyle;
                this.name = name;
                this.paneId = paneId;
                this.title = title;
                this.headerDefRef = headerDefRef;
                this.paneDefRefs = paneDefRefs;
            }
            return XFormDef;
        })(dialog.XPaneDef);
        dialog.XFormDef = XFormDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGeoFixDef = (function (_super) {
            __extends(XGeoFixDef, _super);
            function XGeoFixDef(paneId, name, title) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
            }
            return XGeoFixDef;
        })(dialog.XPaneDef);
        dialog.XGeoFixDef = XGeoFixDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGeoLocationDef = (function (_super) {
            __extends(XGeoLocationDef, _super);
            function XGeoLocationDef(paneId, name, title) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
            }
            return XGeoLocationDef;
        })(dialog.XPaneDef);
        dialog.XGeoLocationDef = XGeoLocationDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGraphDef = (function (_super) {
            __extends(XGraphDef, _super);
            function XGraphDef(paneId, name, title, graphType, identityDataPoint, groupingDataPoint, dataPoints, filterDataPoints, sampleModel) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.graphType = graphType;
                this.identityDataPoint = identityDataPoint;
                this.groupingDataPoint = groupingDataPoint;
                this.dataPoints = dataPoints;
                this.filterDataPoints = filterDataPoints;
                this.sampleModel = sampleModel;
            }
            return XGraphDef;
        })(dialog.XPaneDef);
        dialog.XGraphDef = XGraphDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XImagePickerDef = (function (_super) {
            __extends(XImagePickerDef, _super);
            function XImagePickerDef(paneId, name, title, URLProperty, defaultActionId) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.URLProperty = URLProperty;
                this.defaultActionId = defaultActionId;
            }
            return XImagePickerDef;
        })(dialog.XPaneDef);
        dialog.XImagePickerDef = XImagePickerDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XListDef = (function (_super) {
            __extends(XListDef, _super);
            function XListDef(paneId, name, title, style, initialColumns, columnsStyle, overrideGML) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.style = style;
                this.initialColumns = initialColumns;
                this.columnsStyle = columnsStyle;
                this.overrideGML = overrideGML;
            }
            Object.defineProperty(XListDef.prototype, "graphicalMarkup", {
                get: function () {
                    return this.overrideGML;
                },
                set: function (graphicalMarkup) {
                    this.overrideGML = graphicalMarkup;
                },
                enumerable: true,
                configurable: true
            });
            return XListDef;
        })(dialog.XPaneDef);
        dialog.XListDef = XListDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XMapDef = (function (_super) {
            __extends(XMapDef, _super);
            function XMapDef(paneId, name, title, descriptionProperty, streetProperty, cityProperty, stateProperty, postalCodeProperty, latitudeProperty, longitudeProperty) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.descriptionProperty = descriptionProperty;
                this.streetProperty = streetProperty;
                this.cityProperty = cityProperty;
                this.stateProperty = stateProperty;
                this.postalCodeProperty = postalCodeProperty;
                this.latitudeProperty = latitudeProperty;
                this.longitudeProperty = longitudeProperty;
            }
            Object.defineProperty(XMapDef.prototype, "descrptionProperty", {
                //descriptionProperty is misspelled in json returned by server currently...
                set: function (prop) {
                    this.descriptionProperty = prop;
                },
                enumerable: true,
                configurable: true
            });
            return XMapDef;
        })(dialog.XPaneDef);
        dialog.XMapDef = XMapDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XChangePaneModeResult = (function () {
            function XChangePaneModeResult(editorRecordDef, dialogProperties) {
                this.editorRecordDef = editorRecordDef;
                this.dialogProperties = dialogProperties;
            }
            Object.defineProperty(XChangePaneModeResult.prototype, "entityRecDef", {
                get: function () {
                    return this.editorRecordDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XChangePaneModeResult.prototype, "dialogProps", {
                get: function () {
                    return this.dialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            return XChangePaneModeResult;
        })();
        dialog.XChangePaneModeResult = XChangePaneModeResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XFormModel = (function () {
            function XFormModel(form, header, children, placement, refreshTimer, sizeToWindow) {
                this.form = form;
                this.header = header;
                this.children = children;
                this.placement = placement;
                this.refreshTimer = refreshTimer;
                this.sizeToWindow = sizeToWindow;
            }
            /*
                This custom fromWS method is necessary because the XFormModelComps, must be
                built with the 'ignoreRedirection' flag set to true
             */
            XFormModel.fromWS = function (otype, jsonObj) {
                return dialog.DialogTriple.fromWSDialogObject(jsonObj['form'], 'WSFormModelComp', dialog.OType.factoryFn, true).bind(function (form) {
                    var header = null;
                    if (jsonObj['header']) {
                        var headerTry = dialog.DialogTriple.fromWSDialogObject(jsonObj['header'], 'WSFormModelComp', dialog.OType.factoryFn, true);
                        if (headerTry.isFailure)
                            return new Failure(headerTry.isFailure);
                        header = headerTry.success;
                    }
                    return dialog.DialogTriple.fromListOfWSDialogObject(jsonObj['children'], 'WSFormModelComp', dialog.OType.factoryFn, true).bind(function (children) {
                        return new Success(new XFormModel(form, header, children, jsonObj['placement'], jsonObj['refreshTimer'], jsonObj['sizeToWindow']));
                    });
                });
            };
            return XFormModel;
        })();
        dialog.XFormModel = XFormModel;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XFormModelComp = (function () {
            function XFormModelComp(paneId, redirection, label, title) {
                this.paneId = paneId;
                this.redirection = redirection;
                this.label = label;
                this.title = title;
            }
            return XFormModelComp;
        })();
        dialog.XFormModelComp = XFormModelComp;
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
                    var pair = StringUtil.splitSimpleKeyValuePair(v);
                    result[pair[0]] = pair[1];
                });
                return result;
            };
            return XGetSessionListPropertyResult;
        })();
        dialog.XGetSessionListPropertyResult = XGetSessionListPropertyResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGetActiveColumnDefsResult = (function () {
            function XGetActiveColumnDefsResult(columnsStyle, columns) {
                this.columnsStyle = columnsStyle;
                this.columns = columns;
            }
            Object.defineProperty(XGetActiveColumnDefsResult.prototype, "columnDefs", {
                get: function () {
                    return this.columns;
                },
                enumerable: true,
                configurable: true
            });
            return XGetActiveColumnDefsResult;
        })();
        dialog.XGetActiveColumnDefsResult = XGetActiveColumnDefsResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGetAvailableValuesResult = (function () {
            function XGetAvailableValuesResult(list) {
                this.list = list;
            }
            XGetAvailableValuesResult.fromWS = function (otype, jsonObj) {
                var listJson = jsonObj['list'];
                var valuesJson = listJson['values'];
                return dialog.Prop.fromListOfWSValue(valuesJson).bind(function (values) {
                    return new Success(new XGetAvailableValuesResult(values));
                });
            };
            return XGetAvailableValuesResult;
        })();
        dialog.XGetAvailableValuesResult = XGetAvailableValuesResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XOpenEditorModelResult = (function () {
            function XOpenEditorModelResult(editorRecordDef, formModel) {
                this.editorRecordDef = editorRecordDef;
                this.formModel = formModel;
            }
            Object.defineProperty(XOpenEditorModelResult.prototype, "entityRecDef", {
                get: function () {
                    return this.editorRecordDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XOpenEditorModelResult.prototype, "formPaneId", {
                get: function () {
                    return this.formModel.form.paneId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XOpenEditorModelResult.prototype, "formRedirection", {
                get: function () {
                    return this.formModel.form.redirection;
                },
                enumerable: true,
                configurable: true
            });
            return XOpenEditorModelResult;
        })();
        dialog.XOpenEditorModelResult = XOpenEditorModelResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XOpenQueryModelResult = (function () {
            function XOpenQueryModelResult(entityRecDef, sortPropertyDef, defaultActionId) {
                this.entityRecDef = entityRecDef;
                this.sortPropertyDef = sortPropertyDef;
                this.defaultActionId = defaultActionId;
            }
            XOpenQueryModelResult.fromWS = function (otype, jsonObj) {
                var queryRecDefJson = jsonObj['queryRecordDef'];
                var defaultActionId = queryRecDefJson['defaultActionId'];
                return dialog.DialogTriple.fromListOfWSDialogObject(queryRecDefJson['propertyDefs'], 'WSPropertyDef', dialog.OType.factoryFn).bind(function (propDefs) {
                    var entityRecDef = new dialog.EntityRecDef(propDefs);
                    return dialog.DialogTriple.fromListOfWSDialogObject(queryRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', dialog.OType.factoryFn).bind(function (sortPropDefs) {
                        return new Success(new XOpenQueryModelResult(entityRecDef, sortPropDefs, defaultActionId));
                    });
                });
            };
            return XOpenQueryModelResult;
        })();
        dialog.XOpenQueryModelResult = XOpenQueryModelResult;
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
        var XPaneDefRef = (function () {
            function XPaneDefRef(name, paneId, title, type) {
                this.name = name;
                this.paneId = paneId;
                this.title = title;
                this.type = type;
            }
            return XPaneDefRef;
        })();
        dialog.XPaneDefRef = XPaneDefRef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XPropertyChangeResult = (function () {
            function XPropertyChangeResult(availableValueChanges, propertyName, sideEffects, editorRecordDef) {
                this.availableValueChanges = availableValueChanges;
                this.propertyName = propertyName;
                this.sideEffects = sideEffects;
                this.editorRecordDef = editorRecordDef;
            }
            Object.defineProperty(XPropertyChangeResult.prototype, "sideEffectsDef", {
                get: function () {
                    return this.editorRecordDef;
                },
                enumerable: true,
                configurable: true
            });
            return XPropertyChangeResult;
        })();
        dialog.XPropertyChangeResult = XPropertyChangeResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XQueryResult = (function () {
            function XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs, defaultActionId, dialogProps) {
                this.entityRecs = entityRecs;
                this.entityRecDef = entityRecDef;
                this.hasMore = hasMore;
                this.sortPropDefs = sortPropDefs;
                this.defaultActionId = defaultActionId;
                this.dialogProps = dialogProps;
            }
            XQueryResult.fromWS = function (otype, jsonObj) {
                return dialog.DialogTriple.fromWSDialogObject(jsonObj['queryRecordDef'], 'WSQueryRecordDef', dialog.OType.factoryFn).bind(function (entityRecDef) {
                    var entityRecDefJson = jsonObj['queryRecordDef'];
                    var actionId = jsonObj['defaultActionId'];
                    return dialog.DialogTriple.fromListOfWSDialogObject(entityRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', dialog.OType.factoryFn).bind(function (sortPropDefs) {
                        var queryRecsJson = jsonObj['queryRecords'];
                        if (queryRecsJson['WS_LTYPE'] !== 'WSQueryRecord') {
                            return new Failure('XQueryResult::fromWS: Expected WS_LTYPE of WSQueryRecord but found ' + queryRecsJson['WS_LTYPE']);
                        }
                        var queryRecsValues = queryRecsJson['values'];
                        var entityRecs = [];
                        for (var i = 0; i < queryRecsValues.length; i++) {
                            var queryRecValue = queryRecsValues[i];
                            if (queryRecValue['WS_OTYPE'] !== 'WSQueryRecord') {
                                return new Failure('XQueryResult::fromWS: Expected WS_OTYPE of WSQueryRecord but found ' + queryRecValue['WS_LTYPE']);
                            }
                            var objectId = queryRecValue['objectId'];
                            var recPropsObj = queryRecValue['properties'];
                            if (recPropsObj['WS_LTYPE'] !== 'Object') {
                                return new Failure('XQueryResult::fromWS: Expected WS_LTYPE of Object but found ' + recPropsObj['WS_LTYPE']);
                            }
                            var recPropsObjValues = recPropsObj['values'];
                            var propsTry = dialog.Prop.fromWSNamesAndValues(entityRecDef.propNames, recPropsObjValues);
                            if (propsTry.isFailure)
                                return new Failure(propsTry.failure);
                            var props = propsTry.success;
                            if (queryRecValue['propertyAnnotations']) {
                                var propAnnosJson = queryRecValue['propertyAnnotations'];
                                var annotatedPropsTry = dialog.DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosJson);
                                if (annotatedPropsTry.isFailure)
                                    return new Failure(annotatedPropsTry.failure);
                                props = annotatedPropsTry.success;
                            }
                            var recAnnos = null;
                            if (queryRecValue['recordAnnotation']) {
                                var recAnnosTry = dialog.DialogTriple.fromWSDialogObject(queryRecValue['recordAnnotation'], 'WSDataAnnotation', dialog.OType.factoryFn);
                                if (recAnnosTry.isFailure)
                                    return new Failure(recAnnosTry.failure);
                                recAnnos = recAnnosTry.success;
                            }
                            var entityRec = dialog.EntityRec.Util.newEntityRec(objectId, props, recAnnos);
                            entityRecs.push(entityRec);
                        }
                        var dialogProps = jsonObj['dialogProperties'];
                        var hasMore = jsonObj['hasMore'];
                        return new Success(new XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs, actionId, dialogProps));
                    });
                });
            };
            return XQueryResult;
        })();
        dialog.XQueryResult = XQueryResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XReadPropertyResult = (function () {
            function XReadPropertyResult() {
            }
            return XReadPropertyResult;
        })();
        dialog.XReadPropertyResult = XReadPropertyResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XReadResult = (function () {
            function XReadResult(_editorRecord, _editorRecordDef, _dialogProperties) {
                this._editorRecord = _editorRecord;
                this._editorRecordDef = _editorRecordDef;
                this._dialogProperties = _dialogProperties;
            }
            Object.defineProperty(XReadResult.prototype, "entityRec", {
                get: function () {
                    return this._editorRecord;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XReadResult.prototype, "entityRecDef", {
                get: function () {
                    return this._editorRecordDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XReadResult.prototype, "dialogProps", {
                get: function () {
                    return this._dialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            return XReadResult;
        })();
        dialog.XReadResult = XReadResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XWriteResult = (function () {
            function XWriteResult(_editorRecord, _editorRecordDef, _dialogProperties) {
                this._editorRecord = _editorRecord;
                this._editorRecordDef = _editorRecordDef;
                this._dialogProperties = _dialogProperties;
            }
            XWriteResult.fromWS = function (otype, jsonObj) {
                return dialog.DialogTriple.extractTriple(jsonObj, 'WSWriteResult', function () {
                    return dialog.OType.deserializeObject(jsonObj, 'XWriteResult', dialog.OType.factoryFn);
                });
            };
            Object.defineProperty(XWriteResult.prototype, "dialogProps", {
                get: function () {
                    return this._dialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XWriteResult.prototype, "entityRec", {
                get: function () {
                    return this._editorRecord;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XWriteResult.prototype, "entityRecDef", {
                get: function () {
                    return this._editorRecordDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XWriteResult.prototype, "isDestroyed", {
                get: function () {
                    var destoyedStr = this.dialogProps['destroyed'];
                    return destoyedStr && destoyedStr.toLowerCase() === 'true';
                },
                enumerable: true,
                configurable: true
            });
            return XWriteResult;
        })();
        dialog.XWriteResult = XWriteResult;
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
            Redirection.fromWS = function (otype, jsonObj) {
                if (jsonObj && jsonObj['webURL']) {
                    return dialog.OType.deserializeObject(jsonObj, 'WSWebRedirection', dialog.OType.factoryFn);
                }
                else if (jsonObj && jsonObj['workbenchId']) {
                    return dialog.OType.deserializeObject(jsonObj, 'WSWorkbenchRedirection', dialog.OType.factoryFn);
                }
                else {
                    return dialog.OType.deserializeObject(jsonObj, 'WSDialogRedirection', dialog.OType.factoryFn);
                }
            };
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
                set: function (props) {
                    this._fromDialogProperties = props;
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
            Object.defineProperty(WebRedirection.prototype, "fromDialogProperties", {
                get: function () {
                    return this._fromDialogProperties;
                },
                set: function (props) {
                    this._fromDialogProperties = props;
                },
                enumerable: true,
                configurable: true
            });
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
                set: function (props) {
                    this._fromDialogProperties = props;
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
                var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, false, function () { return new Success(new dialog.NullRedirection({})); });
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
            DialogTriple.fromWSDialogObject = function (obj, Otype, factoryFn, ignoreRedirection) {
                if (ignoreRedirection === void 0) { ignoreRedirection = false; }
                if (!obj) {
                    return new Failure('DialogTriple::fromWSDialogObject: Cannot extract from null value');
                }
                else if (typeof obj !== 'object') {
                    return new Success(obj);
                }
                try {
                    if (!factoryFn) {
                        /* Assume we're just going to coerce the exiting object */
                        return DialogTriple.extractValue(obj, Otype, function () {
                            return new Success(obj);
                        });
                    }
                    else {
                        if (ignoreRedirection) {
                            return DialogTriple.extractValueIgnoringRedirection(obj, Otype, function () {
                                return dialog.OType.deserializeObject(obj, Otype, factoryFn);
                            });
                        }
                        else {
                            return DialogTriple.extractValue(obj, Otype, function () {
                                return dialog.OType.deserializeObject(obj, Otype, factoryFn);
                            });
                        }
                    }
                }
                catch (e) {
                    return new Failure('DialogTriple::fromWSDialogObject: ' + e.name + ": " + e.message);
                }
            };
            DialogTriple.fromListOfWSDialogObject = function (jsonObject, Ltype, factoryFn, ignoreRedirection) {
                if (ignoreRedirection === void 0) { ignoreRedirection = false; }
                return DialogTriple.extractList(jsonObject, Ltype, function (value) {
                    /*note - we could add a check here to make sure the otype 'is a' ltype, to enforce the generic constraint
                    i.e. list items should be lype assignment compatible*/
                    if (!value)
                        return new Success(null);
                    var Otype = value['WS_OTYPE'] || Ltype;
                    return DialogTriple.fromWSDialogObject(value, Otype, factoryFn, ignoreRedirection);
                });
            };
            DialogTriple.fromWSDialogObjectResult = function (jsonObject, resultOtype, targetOtype, objPropName, factoryFn) {
                return DialogTriple.extractValue(jsonObject, resultOtype, function () {
                    return DialogTriple.fromWSDialogObject(jsonObject[objPropName], targetOtype, factoryFn);
                });
            };
            DialogTriple.fromWSDialogObjectsResult = function (jsonObject, resultOtype, targetLtype, objPropName, factoryFn) {
                return DialogTriple.extractValue(jsonObject, resultOtype, function () {
                    return DialogTriple.fromListOfWSDialogObject(jsonObject[objPropName], targetLtype, factoryFn);
                });
            };
            DialogTriple._extractTriple = function (jsonObject, Otype, ignoreRedirection, extractor) {
                if (!jsonObject) {
                    return new Failure('DialogTriple::extractTriple: cannot extract object of WS_OTYPE ' + Otype + ' because json object is null');
                }
                else {
                    if (Array.isArray(jsonObject)) {
                        //verify we'll dealing with a nested List
                        if (Otype.indexOf('List') !== 0) {
                            return new Failure("DialogTriple::extractTriple: expected OType of List<> for Array obj");
                        }
                    }
                    else {
                        var ot = jsonObject['WS_OTYPE'];
                        if (!ot || Otype !== ot) {
                            return new Failure('DialogTriple:extractTriple: expected O_TYPE ' + Otype + ' but found ' + ot);
                        }
                        else {
                            if (jsonObject['exception']) {
                                var dialogException = jsonObject['exception'];
                                return new Failure(dialogException);
                            }
                            else if (jsonObject['redirection'] && !ignoreRedirection) {
                                var drt = DialogTriple.fromWSDialogObject(jsonObject['redirection'], 'WSRedirection', dialog.OType.factoryFn);
                                if (drt.isFailure) {
                                    return new Failure(drt.failure);
                                }
                                else {
                                    return new Success(Either.left(drt.success));
                                }
                            }
                        }
                    }
                    var result;
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
                    return result;
                }
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
                        result = Future.createSuccessfulFuture('NavRequest::fromRedirection', redirection);
                    }
                    else if (redirection instanceof dialog.WorkbenchRedirection) {
                        var wbr = redirection;
                        result = dialog.AppContext.singleton.getWorkbench(sessionContext, wbr.workbenchId).map(function (wb) {
                            return wb;
                        });
                    }
                    else if (redirection instanceof dialog.DialogRedirection) {
                        var dr = redirection;
                        var fcb = new dialog.FormContextBuilder(dr, actionSource, sessionContext);
                        result = fcb.build();
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
                get: function () { return AppContext.ONE_DAY_IN_MILLIS; },
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
                    return this._appContextState === AppContextState.LOGGED_IN;
                },
                enumerable: true,
                configurable: true
            });
            AppContext.prototype.getWorkbench = function (sessionContext, workbenchId) {
                if (this._appContextState === AppContextState.LOGGED_OUT) {
                    return Future.createFailedFuture("AppContext::getWorkbench", "User is logged out");
                }
                return dialog.WorkbenchService.getWorkbench(sessionContext, workbenchId);
            };
            AppContext.prototype.login = function (gatewayHost, tenantId, clientType, userId, password) {
                var _this = this;
                if (this._appContextState === AppContextState.LOGGED_IN) {
                    return Future.createFailedFuture("AppContext::login", "User is already logged in");
                }
                var answer;
                var appContextValuesFr = this.loginOnline(gatewayHost, tenantId, clientType, userId, password, this.deviceProps);
                return appContextValuesFr.bind(function (appContextValues) {
                    _this.setAppContextStateToLoggedIn(appContextValues);
                    return Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
                });
            };
            AppContext.prototype.loginDirectly = function (url, tenantId, clientType, userId, password) {
                var _this = this;
                if (this._appContextState === AppContextState.LOGGED_IN) {
                    return Future.createFailedFuture("AppContext::loginDirectly", "User is already logged in");
                }
                return this.loginFromSystemContext(new dialog.SystemContextImpl(url), tenantId, userId, password, this.deviceProps, clientType).bind(function (appContextValues) {
                    _this.setAppContextStateToLoggedIn(appContextValues);
                    return Future.createSuccessfulFuture('AppContext::loginDirectly', appContextValues.appWinDef);
                });
            };
            AppContext.prototype.logout = function () {
                if (this._appContextState === AppContextState.LOGGED_OUT) {
                    return Future.createFailedFuture("AppContext::loginDirectly", "User is already logged out");
                }
                var result = dialog.SessionService.deleteSession(this.sessionContextTry.success);
                result.onComplete(function (deleteSessionTry) {
                    if (deleteSessionTry.isFailure) {
                        Log.error('Error while logging out: ' + ObjUtil.formatRecAttr(deleteSessionTry.failure));
                    }
                });
                this.setAppContextStateToLoggedOut();
                return result;
            };
            AppContext.prototype.performLaunchAction = function (launchAction) {
                if (this._appContextState === AppContextState.LOGGED_OUT) {
                    return Future.createFailedFuture("AppContext::performLaunchAction", "User is logged out");
                }
                return this.performLaunchActionOnline(launchAction, this.sessionContextTry.success);
            };
            AppContext.prototype.refreshContext = function (sessionContext, deviceProps) {
                var _this = this;
                if (deviceProps === void 0) { deviceProps = []; }
                var appContextValuesFr = this.finalizeContext(sessionContext, deviceProps);
                return appContextValuesFr.bind(function (appContextValues) {
                    _this.setAppContextStateToLoggedIn(appContextValues);
                    return Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
                });
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
                this._appContextState = AppContextState.LOGGED_IN;
            };
            AppContext.prototype.setAppContextStateToLoggedOut = function () {
                this._appWinDefTry = new Failure("Not logged in");
                this._tenantSettingsTry = new Failure('Not logged in"');
                this._sessionContextTry = new Failure('Not loggged in');
                this._appContextState = AppContextState.LOGGED_OUT;
            };
            AppContext.ONE_DAY_IN_MILLIS = 60 * 60 * 24 * 1000;
            return AppContext;
        })();
        dialog.AppContext = AppContext;
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
 * Created by rburson on 3/30/15.
 */
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
                get: function () { return this._alias; },
                enumerable: true,
                configurable: true
            });
            Workbench.prototype.getLaunchActionById = function (launchActionId) {
                var result = null;
                this.workbenchLaunchActions.some(function (launchAction) {
                    if (launchAction.id = launchActionId) {
                        result = launchAction;
                        return true;
                    }
                });
                return result;
            };
            Object.defineProperty(Workbench.prototype, "name", {
                get: function () { return this._name; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workbench.prototype, "workbenchId", {
                get: function () { return this._id; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workbench.prototype, "workbenchLaunchActions", {
                get: function () { return ArrayUtil.copy(this._actions); },
                enumerable: true,
                configurable: true
            });
            return Workbench;
        })();
        dialog.Workbench = Workbench;
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
            SessionService.deleteSession = function (sessionContext) {
                var method = "deleteSession";
                var params = {
                    'sessionHandle': sessionContext.sessionHandle
                };
                var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createSuccessfulFuture("deleteSession/extractVoidResultFromResponse", result);
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
///<reference path="../references.ts"/>
/*
 @TODO - current the gateway response is mocked, due to cross-domain issues
    This should be removed (and the commented section uncommented for production!!!
*/
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GatewayService = (function () {
            function GatewayService() {
            }
            GatewayService.getServiceEndpoint = function (tenantId, serviceName, gatewayHost) {
                //We have to fake this for now, due to cross domain issues
                /*
                            var fakeResponse = {
                                responseType:"soi-json",
                                tenantId:"***REMOVED***z",
                                serverAssignment:"https://dfw.catavolt.net/vs301",
                                appVersion:"1.3.262",soiVersion:"v02"
                            }
                
                            var endPointFuture = Future.createSuccessfulFuture<ServiceEndpoint>('serviceEndpoint', <any>fakeResponse);
                
                            */
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
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var PaneDef = (function () {
            function PaneDef(_paneId, _name, _label, _title, _menuDefs, _entityRecDef, _dialogRedirection, _settings) {
                this._paneId = _paneId;
                this._name = _name;
                this._label = _label;
                this._title = _title;
                this._menuDefs = _menuDefs;
                this._entityRecDef = _entityRecDef;
                this._dialogRedirection = _dialogRedirection;
                this._settings = _settings;
            }
            PaneDef.fromOpenPaneResult = function (childXOpenResult, childXComp, childXPaneDefRef, childXPaneDef, childXActiveColDefs, childMenuDefs) {
                var settings = {};
                ObjUtil.addAllProps(childXComp.redirection.dialogProperties, settings);
                var newPaneDef;
                if (childXPaneDef instanceof dialog.XListDef) {
                    var xListDef = childXPaneDef;
                    var xOpenQueryModelResult = childXOpenResult;
                    newPaneDef = new dialog.ListDef(xListDef.paneId, xListDef.name, childXComp.label, xListDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xListDef.style, xListDef.initialColumns, childXActiveColDefs.columnDefs, xListDef.columnsStyle, xOpenQueryModelResult.defaultActionId, xListDef.graphicalMarkup);
                }
                else if (childXPaneDef instanceof dialog.XDetailsDef) {
                    var xDetailsDef = childXPaneDef;
                    var xOpenEditorModelResult = childXOpenResult;
                    newPaneDef = new dialog.DetailsDef(xDetailsDef.paneId, xDetailsDef.name, childXComp.label, xDetailsDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings, xDetailsDef.cancelButtonText, xDetailsDef.commitButtonText, xDetailsDef.editable, xDetailsDef.focusPropertyName, xDetailsDef.graphicalMarkup, xDetailsDef.rows);
                }
                else if (childXPaneDef instanceof dialog.XMapDef) {
                    var xMapDef = childXPaneDef;
                    var xOpenQueryModelResult = childXOpenResult;
                    newPaneDef = new dialog.MapDef(xMapDef.paneId, xMapDef.name, childXComp.label, xMapDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xMapDef.descriptionProperty, xMapDef.streetProperty, xMapDef.cityProperty, xMapDef.stateProperty, xMapDef.postalCodeProperty, xMapDef.latitudeProperty, xMapDef.longitudeProperty);
                }
                else if (childXPaneDef instanceof dialog.XGraphDef) {
                    var xGraphDef = childXPaneDef;
                    var xOpenQueryModelResult = childXOpenResult;
                    newPaneDef = new dialog.GraphDef(xGraphDef.paneId, xGraphDef.name, childXComp.label, xGraphDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xGraphDef.graphType, xGraphDef.identityDataPoint, xGraphDef.groupingDataPoint, xGraphDef.dataPoints, xGraphDef.filterDataPoints, xGraphDef.sampleModel);
                }
                else if (childXPaneDef instanceof dialog.XBarcodeScanDef) {
                    var xBarcodeScanDef = childXPaneDef;
                    var xOpenEditorModelResult = childXOpenResult;
                    newPaneDef = new dialog.BarcodeScanDef(xBarcodeScanDef.paneId, xBarcodeScanDef.name, childXComp.label, xBarcodeScanDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
                }
                else if (childXPaneDef instanceof dialog.XGeoFixDef) {
                    var xGeoFixDef = childXPaneDef;
                    var xOpenEditorModelResult = childXOpenResult;
                    newPaneDef = new dialog.GeoFixDef(xGeoFixDef.paneId, xGeoFixDef.name, childXComp.label, xGeoFixDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
                }
                else if (childXPaneDef instanceof dialog.XGeoLocationDef) {
                    var xGeoLocationDef = childXPaneDef;
                    var xOpenEditorModelResult = childXOpenResult;
                    newPaneDef = new dialog.GeoLocationDef(xGeoLocationDef.paneId, xGeoLocationDef.name, childXComp.label, xGeoLocationDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
                }
                else if (childXPaneDef instanceof dialog.XCalendarDef) {
                    var xCalendarDef = childXPaneDef;
                    var xOpenQueryModelResult = childXOpenResult;
                    newPaneDef = new dialog.CalendarDef(xCalendarDef.paneId, xCalendarDef.name, childXComp.label, xCalendarDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xCalendarDef.descriptionProperty, xCalendarDef.initialStyle, xCalendarDef.startDateProperty, xCalendarDef.startTimeProperty, xCalendarDef.endDateProperty, xCalendarDef.endTimeProperty, xCalendarDef.occurDateProperty, xCalendarDef.occurTimeProperty, xOpenQueryModelResult.defaultActionId);
                }
                else if (childXPaneDef instanceof dialog.XImagePickerDef) {
                    var xImagePickerDef = childXPaneDef;
                    var xOpenQueryModelResult = childXOpenResult;
                    newPaneDef = new dialog.ImagePickerDef(xImagePickerDef.paneId, xImagePickerDef.name, childXComp.label, xImagePickerDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xImagePickerDef.URLProperty, xImagePickerDef.defaultActionId);
                }
                else {
                    return new Failure('PaneDef::fromOpenPaneResult needs impl for: ' + ObjUtil.formatRecAttr(childXPaneDef));
                }
                return new Success(newPaneDef);
            };
            Object.defineProperty(PaneDef.prototype, "dialogHandle", {
                get: function () {
                    return this._dialogRedirection.dialogHandle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneDef.prototype, "dialogRedirection", {
                get: function () {
                    return this._dialogRedirection;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneDef.prototype, "entityRecDef", {
                get: function () {
                    return this._entityRecDef;
                },
                enumerable: true,
                configurable: true
            });
            PaneDef.prototype.findTitle = function () {
                var result = this._title ? this._title.trim() : '';
                result = result === 'null' ? '' : result;
                if (result === '') {
                    result = this._label ? this._label.trim() : '';
                    result = result === 'null' ? '' : result;
                }
                return result;
            };
            Object.defineProperty(PaneDef.prototype, "label", {
                get: function () {
                    return this._label;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneDef.prototype, "menuDefs", {
                get: function () {
                    return this._menuDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneDef.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneDef.prototype, "paneId", {
                get: function () {
                    return this._paneId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneDef.prototype, "settings", {
                get: function () {
                    return this._settings;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneDef.prototype, "title", {
                get: function () {
                    return this._title;
                },
                enumerable: true,
                configurable: true
            });
            return PaneDef;
        })();
        dialog.PaneDef = PaneDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/21/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DetailsDef = (function (_super) {
            __extends(DetailsDef, _super);
            function DetailsDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _cancelButtonText, _commitButtonText, _editable, _focusPropName, _graphicalMarkup, _rows) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
                this._cancelButtonText = _cancelButtonText;
                this._commitButtonText = _commitButtonText;
                this._editable = _editable;
                this._focusPropName = _focusPropName;
                this._graphicalMarkup = _graphicalMarkup;
                this._rows = _rows;
            }
            Object.defineProperty(DetailsDef.prototype, "cancelButtonText", {
                get: function () {
                    return this._cancelButtonText;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailsDef.prototype, "commitButtonText", {
                get: function () {
                    return this._commitButtonText;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailsDef.prototype, "editable", {
                get: function () {
                    return this._editable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailsDef.prototype, "focusPropName", {
                get: function () {
                    return this._focusPropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailsDef.prototype, "graphicalMarkup", {
                get: function () {
                    return this._graphicalMarkup;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailsDef.prototype, "rows", {
                get: function () {
                    return this._rows;
                },
                enumerable: true,
                configurable: true
            });
            return DetailsDef;
        })(dialog.PaneDef);
        dialog.DetailsDef = DetailsDef;
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
        var FormDef = (function (_super) {
            __extends(FormDef, _super);
            function FormDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _formLayout, _formStyle, _borderStyle, _headerDef, _childrenDefs) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
                this._formLayout = _formLayout;
                this._formStyle = _formStyle;
                this._borderStyle = _borderStyle;
                this._headerDef = _headerDef;
                this._childrenDefs = _childrenDefs;
            }
            FormDef.fromOpenFormResult = function (formXOpenResult, formXFormDef, formMenuDefs, childrenXOpens, childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs) {
                var settings = { 'open': true };
                ObjUtil.addAllProps(formXOpenResult.formRedirection.dialogProperties, settings);
                var headerDef = null;
                var childrenDefs = [];
                for (var i = 0; i < childrenXOpens.length; i++) {
                    var childXOpen = childrenXOpens[i];
                    var childXPaneDef = childrenXPaneDefs[i];
                    var childXActiveColDefs = childrenXActiveColDefs[i];
                    var childMenuDefs = childrenMenuDefs[i];
                    var childXComp = formXOpenResult.formModel.children[i];
                    var childXPaneDefRef = formXFormDef.paneDefRefs[i];
                    var paneDefTry = dialog.PaneDef.fromOpenPaneResult(childXOpen, childXComp, childXPaneDefRef, childXPaneDef, childXActiveColDefs, childMenuDefs);
                    if (paneDefTry.isFailure) {
                        return new Failure(paneDefTry.failure);
                    }
                    else {
                        childrenDefs.push(paneDefTry.success);
                    }
                }
                return new Success(new FormDef(formXFormDef.paneId, formXFormDef.name, formXOpenResult.formModel.form.label, formXFormDef.title, formMenuDefs, formXOpenResult.entityRecDef, formXOpenResult.formRedirection, settings, formXFormDef.formLayout, formXFormDef.formStyle, formXFormDef.borderStyle, headerDef, childrenDefs));
            };
            Object.defineProperty(FormDef.prototype, "borderStyle", {
                get: function () {
                    return this._borderStyle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "childrenDefs", {
                get: function () {
                    return this._childrenDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "formLayout", {
                get: function () {
                    return this._formLayout;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "formStyle", {
                get: function () {
                    return this._formStyle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "headerDef", {
                get: function () {
                    return this._headerDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isFlowingLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'FLOWING';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isFlowingTopDownLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'FLOWING_TOP_DOWN';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isFourBoxSquareLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'FOUR_BOX_SQUARE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isHorizontalLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'H';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isOptionsFormLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'OPTIONS_FORM';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isTabsLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'TABS';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isThreeBoxOneLeftLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'THREE_ONE_LEFT';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isThreeBoxOneOverLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'THREE_ONE_OVER';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isThreeBoxOneRightLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'THREE_ONE_RIGHT';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isThreeBoxOneUnderLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'THREE_ONE_UNDER';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isTopDownLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'TOP_DOWN';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormDef.prototype, "isTwoVerticalLayout", {
                get: function () {
                    return this.formLayout && this.formLayout === 'H(2,V)';
                },
                enumerable: true,
                configurable: true
            });
            return FormDef;
        })(dialog.PaneDef);
        dialog.FormDef = FormDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/22/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var ListDef = (function (_super) {
            __extends(ListDef, _super);
            function ListDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _style, _initialColumns, _activeColumnDefs, _columnsStyle, _defaultActionId, _graphicalMarkup) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
                this._style = _style;
                this._initialColumns = _initialColumns;
                this._activeColumnDefs = _activeColumnDefs;
                this._columnsStyle = _columnsStyle;
                this._defaultActionId = _defaultActionId;
                this._graphicalMarkup = _graphicalMarkup;
            }
            Object.defineProperty(ListDef.prototype, "activeColumnDefs", {
                get: function () {
                    return this._activeColumnDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "columnsStyle", {
                get: function () {
                    return this._columnsStyle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "defaultActionId", {
                get: function () {
                    return this._defaultActionId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "graphicalMarkup", {
                get: function () {
                    return this._graphicalMarkup;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "initialColumns", {
                get: function () {
                    return this._initialColumns;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "isDefaultStyle", {
                get: function () {
                    return this.style && this.style === 'DEFAULT';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "isDetailsFormStyle", {
                get: function () {
                    return this.style && this.style === 'DETAILS_FORM';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "isFormStyle", {
                get: function () {
                    return this.style && this.style === 'FORM';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "isTabularStyle", {
                get: function () {
                    return this.style && this.style === 'TABULAR';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "style", {
                get: function () {
                    return this._style;
                },
                enumerable: true,
                configurable: true
            });
            return ListDef;
        })(dialog.PaneDef);
        dialog.ListDef = ListDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/22/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var MapDef = (function (_super) {
            __extends(MapDef, _super);
            function MapDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _descriptionPropName, _streetPropName, _cityPropName, _statePropName, _postalCodePropName, _latitudePropName, _longitudePropName) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
                this._descriptionPropName = _descriptionPropName;
                this._streetPropName = _streetPropName;
                this._cityPropName = _cityPropName;
                this._statePropName = _statePropName;
                this._postalCodePropName = _postalCodePropName;
                this._latitudePropName = _latitudePropName;
                this._longitudePropName = _longitudePropName;
            }
            Object.defineProperty(MapDef.prototype, "cityPropName", {
                get: function () {
                    return this._cityPropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MapDef.prototype, "descriptionPropName", {
                get: function () {
                    return this._descriptionPropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MapDef.prototype, "latitudePropName", {
                get: function () {
                    return this._latitudePropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MapDef.prototype, "longitudePropName", {
                get: function () {
                    return this._longitudePropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MapDef.prototype, "postalCodePropName", {
                get: function () {
                    return this._postalCodePropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MapDef.prototype, "statePropName", {
                get: function () {
                    return this._statePropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MapDef.prototype, "streetPropName", {
                get: function () {
                    return this._streetPropName;
                },
                enumerable: true,
                configurable: true
            });
            return MapDef;
        })(dialog.PaneDef);
        dialog.MapDef = MapDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/22/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GraphDef = (function (_super) {
            __extends(GraphDef, _super);
            function GraphDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _graphType, _identityDataPointDef, _groupingDataPointDef, _dataPointDefs, _filterDataPointDefs, _sampleModel) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
                this._graphType = _graphType;
                this._identityDataPointDef = _identityDataPointDef;
                this._groupingDataPointDef = _groupingDataPointDef;
                this._dataPointDefs = _dataPointDefs;
                this._filterDataPointDefs = _filterDataPointDefs;
                this._sampleModel = _sampleModel;
            }
            Object.defineProperty(GraphDef.prototype, "dataPointDefs", {
                get: function () {
                    return this._dataPointDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GraphDef.prototype, "filterDataPointDefs", {
                get: function () {
                    return this._filterDataPointDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GraphDef.prototype, "identityDataPointDef", {
                get: function () {
                    return this._identityDataPointDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GraphDef.prototype, "groupingDataPointDef", {
                get: function () {
                    return this._groupingDataPointDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GraphDef.prototype, "sampleModel", {
                get: function () {
                    return this._sampleModel;
                },
                enumerable: true,
                configurable: true
            });
            return GraphDef;
        })(dialog.PaneDef);
        dialog.GraphDef = GraphDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/22/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GeoFixDef = (function (_super) {
            __extends(GeoFixDef, _super);
            function GeoFixDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
            }
            return GeoFixDef;
        })(dialog.PaneDef);
        dialog.GeoFixDef = GeoFixDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/22/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GeoLocationDef = (function (_super) {
            __extends(GeoLocationDef, _super);
            function GeoLocationDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
            }
            return GeoLocationDef;
        })(dialog.PaneDef);
        dialog.GeoLocationDef = GeoLocationDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/22/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var BarcodeScanDef = (function (_super) {
            __extends(BarcodeScanDef, _super);
            function BarcodeScanDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
            }
            return BarcodeScanDef;
        })(dialog.PaneDef);
        dialog.BarcodeScanDef = BarcodeScanDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/22/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var CalendarDef = (function (_super) {
            __extends(CalendarDef, _super);
            function CalendarDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _descriptionPropName, _initialStyle, _startDatePropName, _startTimePropName, _endDatePropName, _endTimePropName, _occurDatePropName, _occurTimePropName, _defaultActionId) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
                this._descriptionPropName = _descriptionPropName;
                this._initialStyle = _initialStyle;
                this._startDatePropName = _startDatePropName;
                this._startTimePropName = _startTimePropName;
                this._endDatePropName = _endDatePropName;
                this._endTimePropName = _endTimePropName;
                this._occurDatePropName = _occurDatePropName;
                this._occurTimePropName = _occurTimePropName;
                this._defaultActionId = _defaultActionId;
            }
            Object.defineProperty(CalendarDef.prototype, "descriptionPropName", {
                get: function () {
                    return this._descriptionPropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CalendarDef.prototype, "initialStyle", {
                get: function () {
                    return this._initialStyle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CalendarDef.prototype, "startDatePropName", {
                get: function () {
                    return this._startDatePropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CalendarDef.prototype, "startTimePropName", {
                get: function () {
                    return this._startTimePropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CalendarDef.prototype, "endDatePropName", {
                get: function () {
                    return this._endDatePropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CalendarDef.prototype, "endTimePropName", {
                get: function () {
                    return this._endTimePropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CalendarDef.prototype, "occurDatePropName", {
                get: function () {
                    return this._occurDatePropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CalendarDef.prototype, "occurTimePropName", {
                get: function () {
                    return this._occurTimePropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CalendarDef.prototype, "defaultActionId", {
                get: function () {
                    return this._defaultActionId;
                },
                enumerable: true,
                configurable: true
            });
            return CalendarDef;
        })(dialog.PaneDef);
        dialog.CalendarDef = CalendarDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/22/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var ImagePickerDef = (function (_super) {
            __extends(ImagePickerDef, _super);
            function ImagePickerDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _URLPropName, _defaultActionId) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
                this._URLPropName = _URLPropName;
                this._defaultActionId = _defaultActionId;
            }
            Object.defineProperty(ImagePickerDef.prototype, "defaultActionId", {
                get: function () {
                    return this._defaultActionId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ImagePickerDef.prototype, "URLPropName", {
                get: function () {
                    return this._URLPropName;
                },
                enumerable: true,
                configurable: true
            });
            return ImagePickerDef;
        })(dialog.PaneDef);
        dialog.ImagePickerDef = ImagePickerDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/14/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DialogService = (function () {
            function DialogService() {
            }
            DialogService.changePaneMode = function (dialogHandle, paneMode, sessionContext) {
                var method = 'changePaneMode';
                var params = {
                    'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                    'paneMode': dialog.PaneMode[paneMode]
                };
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('changePaneMode', dialog.DialogTriple.fromWSDialogObject(result, 'WSChangePaneModeResult', dialog.OType.factoryFn));
                });
            };
            DialogService.closeEditorModel = function (dialogHandle, sessionContext) {
                var method = 'close';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createSuccessfulFuture('closeEditorModel', result);
                });
            };
            DialogService.getAvailableValues = function (dialogHandle, propertyName, pendingWrites, sessionContext) {
                var method = 'getAvailableValues';
                var params = {
                    'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                    'propertyName': propertyName
                };
                if (pendingWrites)
                    params['pendingWrites'] = pendingWrites.toWSEditorRecord();
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('getAvailableValues', dialog.DialogTriple.fromWSDialogObject(result, 'WSGetAvailableValuesResult', dialog.OType.factoryFn));
                });
            };
            DialogService.getActiveColumnDefs = function (dialogHandle, sessionContext) {
                var method = 'getActiveColumnDefs';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('getActiveColumnDefs', dialog.DialogTriple.fromWSDialogObject(result, 'WSGetActiveColumnDefsResult', dialog.OType.factoryFn));
                });
            };
            DialogService.getEditorModelMenuDefs = function (dialogHandle, sessionContext) {
                var method = 'getMenuDefs';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('getEditorModelMenuDefs', dialog.DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', dialog.OType.factoryFn));
                });
            };
            DialogService.getEditorModelPaneDef = function (dialogHandle, paneId, sessionContext) {
                var method = 'getPaneDef';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                params['paneId'] = paneId;
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('getEditorModelPaneDef', dialog.DialogTriple.fromWSDialogObjectResult(result, 'WSGetPaneDefResult', 'WSPaneDef', 'paneDef', dialog.OType.factoryFn));
                });
            };
            DialogService.getQueryModelMenuDefs = function (dialogHandle, sessionContext) {
                var method = 'getMenuDefs';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('getQueryModelMenuDefs', dialog.DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', dialog.OType.factoryFn));
                });
            };
            DialogService.openEditorModelFromRedir = function (redirection, sessionContext) {
                var method = 'open2';
                var params = { 'editorMode': redirection.dialogMode,
                    'dialogHandle': dialog.OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle') };
                if (redirection.objectId)
                    params['objectId'] = redirection.objectId;
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('openEditorModelFromRedir', dialog.DialogTriple.fromWSDialogObject(result, 'WSOpenEditorModelResult', dialog.OType.factoryFn));
                });
            };
            DialogService.openQueryModelFromRedir = function (redirection, sessionContext) {
                if (!redirection.isQuery)
                    return Future.createFailedFuture('DialogService::openQueryModelFromRedir', 'Redirection must be a query');
                var method = 'open';
                var params = { 'dialogHandle': dialog.OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle') };
                var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('openQueryModelFromRedir', dialog.DialogTriple.fromWSDialogObject(result, 'WSOpenQueryModelResult', dialog.OType.factoryFn));
                });
            };
            DialogService.performEditorAction = function (dialogHandle, actionId, pendingWrites, sessionContext) {
                var method = 'performAction';
                var params = { 'actionId': actionId, 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                if (pendingWrites)
                    params['pendingWrites'] = pendingWrites.toWSEditorRecord();
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    var redirectionTry = dialog.DialogTriple.extractRedirection(result, 'WSPerformActionResult');
                    if (redirectionTry.isSuccess) {
                        var r = redirectionTry.success;
                        r.fromDialogProperties = result['dialogProperties'];
                        redirectionTry = new Success(r);
                    }
                    return Future.createCompletedFuture('performEditorAction', redirectionTry);
                });
            };
            DialogService.performQueryAction = function (dialogHandle, actionId, targets, sessionContext) {
                var method = 'performAction';
                var params = {
                    'actionId': actionId,
                    'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle')
                };
                if (targets) {
                    params['targets'] = targets;
                }
                var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    var redirectionTry = dialog.DialogTriple.extractRedirection(result, 'WSPerformActionResult');
                    if (redirectionTry.isSuccess) {
                        var r = redirectionTry.success;
                        r.fromDialogProperties = result['dialogProperties'];
                        redirectionTry = new Success(r);
                    }
                    return Future.createCompletedFuture('performQueryAction', redirectionTry);
                });
            };
            DialogService.processSideEffects = function (dialogHandle, sessionContext, propertyName, propertyValue, pendingWrites) {
                var method = 'handlePropertyChange';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                    'propertyName': propertyName,
                    'propertyValue': dialog.Prop.toWSProperty(propertyValue),
                    'pendingWrites': pendingWrites.toWSEditorRecord()
                };
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('processSideEffects', dialog.DialogTriple.fromWSDialogObject(result, 'WSHandlePropertyChangeResult', dialog.OType.factoryFn));
                });
            };
            DialogService.queryQueryModel = function (dialogHandle, direction, maxRows, fromObjectId, sessionContext) {
                var method = 'query';
                var params = {
                    'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                    'maxRows': maxRows,
                    'direction': direction === dialog.QueryDirection.BACKWARD ? 'BACKWARD' : 'FORWARD'
                };
                if (fromObjectId && fromObjectId.trim() !== '') {
                    params['fromObjectId'] = fromObjectId.trim();
                }
                Log.info('Running query');
                var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
                    return Future.createCompletedFuture('DialogService::queryQueryModel', dialog.DialogTriple.fromWSDialogObject(result, 'WSQueryResult', dialog.OType.factoryFn));
                });
            };
            DialogService.readEditorModel = function (dialogHandle, sessionContext) {
                var method = 'read';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle') };
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture('readEditorModel', dialog.DialogTriple.fromWSDialogObject(result, 'WSReadResult', dialog.OType.factoryFn));
                });
            };
            DialogService.writeEditorModel = function (dialogHandle, entityRec, sessionContext) {
                var method = 'write';
                var params = { 'dialogHandle': dialog.OType.serializeObject(dialogHandle, 'WSDialogHandle'),
                    'editorRecord': entityRec.toWSEditorRecord()
                };
                var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    var writeResultTry = dialog.DialogTriple.fromWSDialogObject(result, 'WSWriteResult', dialog.OType.factoryFn);
                    if (writeResultTry.isSuccess && writeResultTry.success.isLeft) {
                        var redirection = writeResultTry.success.left;
                        redirection.fromDialogProperties = result['dialogProperties'] || {};
                        writeResultTry = new Success(Either.left(redirection));
                    }
                    return Future.createCompletedFuture('writeEditorModel', writeResultTry);
                });
            };
            DialogService.EDITOR_SERVICE_NAME = 'EditorService';
            DialogService.EDITOR_SERVICE_PATH = 'soi-json-v02/' + DialogService.EDITOR_SERVICE_NAME;
            DialogService.QUERY_SERVICE_NAME = 'QueryService';
            DialogService.QUERY_SERVICE_PATH = 'soi-json-v02/' + DialogService.QUERY_SERVICE_NAME;
            return DialogService;
        })();
        dialog.DialogService = DialogService;
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
        var PaneContext = (function () {
            function PaneContext(paneRef) {
                this._lastRefreshTime = new Date(0);
                this._parentContext = null;
                this._paneRef = null;
                this._paneRef = paneRef;
                this._binaryCache = {};
            }
            PaneContext.resolveSettingsFromNavRequest = function (initialSettings, navRequest) {
                var result = ObjUtil.addAllProps(initialSettings, {});
                if (navRequest instanceof dialog.FormContext) {
                    ObjUtil.addAllProps(navRequest.dialogRedirection.fromDialogProperties, result);
                    ObjUtil.addAllProps(navRequest.offlineProps, result);
                }
                else if (navRequest instanceof dialog.NullNavRequest) {
                    ObjUtil.addAllProps(navRequest.fromDialogProperties, result);
                }
                var destroyed = result['fromDialogDestroyed'];
                if (destroyed)
                    result['destroyed'] = true;
                return result;
            };
            Object.defineProperty(PaneContext.prototype, "actionSource", {
                get: function () {
                    return this.parentContext ? this.parentContext.actionSource : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "dialogAlias", {
                get: function () {
                    return this.dialogRedirection.dialogProperties['dialogAlias'];
                },
                enumerable: true,
                configurable: true
            });
            PaneContext.prototype.findMenuDefAt = function (actionId) {
                var result = null;
                this.menuDefs.some(function (md) {
                    result = md.findAtId(actionId);
                    return result != null;
                });
                return result;
            };
            PaneContext.prototype.formatForRead = function (propValue, propName) {
                return dialog.PropFormatter.formatForRead(propValue, this.propDefAtName(propName));
            };
            PaneContext.prototype.formatForWrite = function (propValue, propName) {
                return dialog.PropFormatter.formatForWrite(propValue, this.propDefAtName(propName));
            };
            Object.defineProperty(PaneContext.prototype, "formDef", {
                get: function () {
                    return this.parentContext.formDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "isRefreshNeeded", {
                get: function () {
                    return this._lastRefreshTime.getTime() < dialog.AppContext.singleton.lastMaintenanceTime.getTime();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "lastRefreshTime", {
                get: function () {
                    return this._lastRefreshTime;
                },
                set: function (time) {
                    this._lastRefreshTime = time;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "menuDefs", {
                get: function () {
                    return this.paneDef.menuDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "offlineCapable", {
                get: function () {
                    return this._parentContext && this._parentContext.offlineCapable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "paneDef", {
                get: function () {
                    if (this.paneRef == null) {
                        return this.formDef.headerDef;
                    }
                    else {
                        return this.formDef.childrenDefs[this.paneRef];
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "paneRef", {
                get: function () {
                    return this._paneRef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "paneTitle", {
                get: function () {
                    return this.paneDef.findTitle();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "parentContext", {
                get: function () {
                    return this._parentContext;
                },
                set: function (parentContext) {
                    this._parentContext = parentContext;
                },
                enumerable: true,
                configurable: true
            });
            PaneContext.prototype.parseValue = function (formattedValue, propName) {
                return dialog.PropFormatter.parse(formattedValue, this.propDefAtName(propName));
            };
            PaneContext.prototype.propDefAtName = function (propName) {
                return this.entityRecDef.propDefAtName(propName);
            };
            Object.defineProperty(PaneContext.prototype, "sessionContext", {
                get: function () {
                    return this.parentContext.sessionContext;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "dialogRedirection", {
                /** --------------------- MODULE ------------------------------*/
                //*** let's pretend this has module level visibility
                get: function () {
                    return this.paneDef.dialogRedirection;
                },
                enumerable: true,
                configurable: true
            });
            PaneContext.ANNO_NAME_KEY = "com.catavolt.annoName";
            PaneContext.PROP_NAME_KEY = "com.catavolt.propName";
            return PaneContext;
        })();
        dialog.PaneContext = PaneContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/27/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var EditorState;
        (function (EditorState) {
            EditorState[EditorState["READ"] = 0] = "READ";
            EditorState[EditorState["WRITE"] = 1] = "WRITE";
            EditorState[EditorState["DESTROYED"] = 2] = "DESTROYED";
        })(EditorState || (EditorState = {}));
        ;
        var EditorContext = (function (_super) {
            __extends(EditorContext, _super);
            function EditorContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(EditorContext.prototype, "buffer", {
                get: function () {
                    if (!this._buffer) {
                        this._buffer = new dialog.EntityBuffer(dialog.NullEntityRec.singleton);
                    }
                    return this._buffer;
                },
                enumerable: true,
                configurable: true
            });
            EditorContext.prototype.changePaneMode = function (paneMode) {
                var _this = this;
                return dialog.DialogService.changePaneMode(this.paneDef.dialogHandle, paneMode, this.sessionContext).bind(function (changePaneModeResult) {
                    _this.putSettings(changePaneModeResult.dialogProps);
                    if (_this.isDestroyedSetting) {
                        _this._editorState = EditorState.DESTROYED;
                    }
                    else {
                        _this.entityRecDef = changePaneModeResult.entityRecDef;
                        if (_this.isReadModeSetting) {
                            _this._editorState = EditorState.READ;
                        }
                        else {
                            _this._editorState = EditorState.WRITE;
                        }
                    }
                    return Future.createSuccessfulFuture('EditorContext::changePaneMode', _this.entityRecDef);
                });
            };
            Object.defineProperty(EditorContext.prototype, "entityRec", {
                get: function () {
                    return this._buffer.toEntityRec();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "entityRecNow", {
                get: function () {
                    return this.entityRec;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "entityRecDef", {
                get: function () {
                    return this._entityRecDef;
                },
                set: function (entityRecDef) {
                    this._entityRecDef = entityRecDef;
                },
                enumerable: true,
                configurable: true
            });
            EditorContext.prototype.getAvailableValues = function (propName) {
                return dialog.DialogService.getAvailableValues(this.paneDef.dialogHandle, propName, this.buffer.afterEffects(), this.sessionContext).map(function (valuesResult) {
                    return valuesResult.list;
                });
            };
            EditorContext.prototype.isBinary = function (cellValueDef) {
                var propDef = this.propDefAtName(cellValueDef.propertyName);
                return propDef && (propDef.isBinaryType || (propDef.isURLType && cellValueDef.isInlineMediaStyle));
            };
            Object.defineProperty(EditorContext.prototype, "isDestroyed", {
                get: function () {
                    return this._editorState === EditorState.DESTROYED;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "isReadMode", {
                get: function () {
                    return this._editorState === EditorState.READ;
                },
                enumerable: true,
                configurable: true
            });
            EditorContext.prototype.isReadModeFor = function (propName) {
                if (!this.isReadMode) {
                    var propDef = this.propDefAtName(propName);
                    return !propDef || !propDef.maintainable || !propDef.writeEnabled;
                }
                return true;
            };
            Object.defineProperty(EditorContext.prototype, "isWriteMode", {
                get: function () {
                    return this._editorState === EditorState.WRITE;
                },
                enumerable: true,
                configurable: true
            });
            EditorContext.prototype.performMenuAction = function (menuDef, pendingWrites) {
                var _this = this;
                return dialog.DialogService.performEditorAction(this.paneDef.dialogHandle, menuDef.actionId, pendingWrites, this.sessionContext).bind(function (redirection) {
                    var ca = new dialog.ContextAction(menuDef.actionId, _this.parentContext.dialogRedirection.objectId, _this.actionSource);
                    return dialog.NavRequest.Util.fromRedirection(redirection, ca, _this.sessionContext).map(function (navRequest) {
                        _this._settings = dialog.PaneContext.resolveSettingsFromNavRequest(_this._settings, navRequest);
                        if (_this.isDestroyedSetting) {
                            _this._editorState = EditorState.DESTROYED;
                        }
                        if (_this.isRefreshSetting) {
                            dialog.AppContext.singleton.lastMaintenanceTime = new Date();
                        }
                        return navRequest;
                    });
                });
            };
            EditorContext.prototype.processSideEffects = function (propertyName, value) {
                var _this = this;
                var sideEffectsFr = dialog.DialogService.processSideEffects(this.paneDef.dialogHandle, this.sessionContext, propertyName, value, this.buffer.afterEffects()).map(function (changeResult) {
                    return changeResult.sideEffects ? changeResult.sideEffects.entityRec : new dialog.NullEntityRec();
                });
                return sideEffectsFr.map(function (sideEffectsRec) {
                    var originalProps = _this.buffer.before.props;
                    var userEffects = _this.buffer.afterEffects().props;
                    var sideEffects = sideEffectsRec.props;
                    sideEffects = sideEffects.filter(function (prop) {
                        return prop.name !== propertyName;
                    });
                    _this._buffer = dialog.EntityBuffer.createEntityBuffer(_this.buffer.objectId, dialog.EntityRec.Util.union(originalProps, sideEffects), dialog.EntityRec.Util.union(originalProps, dialog.EntityRec.Util.union(userEffects, sideEffects)));
                    return null;
                });
            };
            EditorContext.prototype.read = function () {
                var _this = this;
                return dialog.DialogService.readEditorModel(this.paneDef.dialogHandle, this.sessionContext).map(function (readResult) {
                    _this.entityRecDef = readResult.entityRecDef;
                    return readResult.entityRec;
                }).map(function (entityRec) {
                    _this.initBuffer(entityRec);
                    _this.lastRefreshTime = new Date();
                    return entityRec;
                });
            };
            EditorContext.prototype.requestedAccuracy = function () {
                var accuracyStr = this.paneDef.settings[EditorContext.GPS_ACCURACY];
                return accuracyStr ? Number(accuracyStr) : 500;
            };
            EditorContext.prototype.requestedTimeoutSeconds = function () {
                var timeoutStr = this.paneDef.settings[EditorContext.GPS_SECONDS];
                return timeoutStr ? Number(timeoutStr) : 30;
            };
            EditorContext.prototype.write = function () {
                var _this = this;
                var result = dialog.DialogService.writeEditorModel(this.paneDef.dialogRedirection.dialogHandle, this.buffer.afterEffects(), this.sessionContext).bind(function (either) {
                    if (either.isLeft) {
                        var ca = new dialog.ContextAction('#write', _this.parentContext.dialogRedirection.objectId, _this.actionSource);
                        var navRequestFr = dialog.NavRequest.Util.fromRedirection(either.left, ca, _this.sessionContext).map(function (navRequest) {
                            return Either.left(navRequest);
                        });
                    }
                    else {
                        var writeResult = either.right;
                        _this.putSettings(writeResult.dialogProps);
                        _this.entityRecDef = writeResult.entityRecDef;
                        return Future.createSuccessfulFuture('EditorContext::write', Either.right(writeResult.entityRec));
                    }
                });
                return result.map(function (successfulWrite) {
                    var now = new Date();
                    dialog.AppContext.singleton.lastMaintenanceTime = now;
                    _this.lastRefreshTime = now;
                    if (successfulWrite.isLeft) {
                        _this._settings = dialog.PaneContext.resolveSettingsFromNavRequest(_this._settings, successfulWrite.left);
                    }
                    else {
                        _this.initBuffer(successfulWrite.right);
                    }
                    if (_this.isDestroyedSetting) {
                        _this._editorState = EditorState.DESTROYED;
                    }
                    else {
                        if (_this.isReadModeSetting) {
                            _this._editorState = EditorState.READ;
                        }
                    }
                    return successfulWrite;
                });
            };
            //Module level methods
            EditorContext.prototype.initialize = function () {
                this._entityRecDef = this.paneDef.entityRecDef;
                this._settings = ObjUtil.addAllProps(this.dialogRedirection.dialogProperties, {});
                this._editorState = this.isReadModeSetting ? EditorState.READ : EditorState.WRITE;
            };
            Object.defineProperty(EditorContext.prototype, "settings", {
                get: function () {
                    return this._settings;
                },
                enumerable: true,
                configurable: true
            });
            //Private methods
            EditorContext.prototype.initBuffer = function (entityRec) {
                this._buffer = entityRec ? new dialog.EntityBuffer(entityRec) : new dialog.EntityBuffer(dialog.NullEntityRec.singleton);
            };
            Object.defineProperty(EditorContext.prototype, "isDestroyedSetting", {
                get: function () {
                    var str = this._settings['destroyed'];
                    return str && str.toLowerCase() === 'true';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "isGlobalRefreshSetting", {
                get: function () {
                    var str = this._settings['globalRefresh'];
                    return str && str.toLowerCase() === 'true';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "isLocalRefreshSetting", {
                get: function () {
                    var str = this._settings['localRefresh'];
                    return str && str.toLowerCase() === 'true';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "isReadModeSetting", {
                get: function () {
                    var paneMode = this.paneModeSetting;
                    return paneMode && paneMode.toLowerCase() === 'read';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "isRefreshSetting", {
                get: function () {
                    return this.isLocalRefreshSetting || this.isGlobalRefreshSetting;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorContext.prototype, "paneModeSetting", {
                get: function () {
                    return this._settings['paneMode'];
                },
                enumerable: true,
                configurable: true
            });
            EditorContext.prototype.putSetting = function (key, value) {
                this._settings[key] = value;
            };
            EditorContext.prototype.putSettings = function (settings) {
                ObjUtil.addAllProps(settings, this._settings);
            };
            EditorContext.GPS_ACCURACY = 'com.catavolt.core.domain.GeoFix.accuracy';
            EditorContext.GPS_SECONDS = 'com.catavolt.core.domain.GeoFix.seconds';
            return EditorContext;
        })(dialog.PaneContext);
        dialog.EditorContext = EditorContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/30/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var QueryResult = (function () {
            function QueryResult(entityRecs, hasMore) {
                this.entityRecs = entityRecs;
                this.hasMore = hasMore;
            }
            return QueryResult;
        })();
        dialog.QueryResult = QueryResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/30/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var HasMoreQueryMarker = (function (_super) {
            __extends(HasMoreQueryMarker, _super);
            function HasMoreQueryMarker() {
                _super.apply(this, arguments);
            }
            HasMoreQueryMarker.singleton = new HasMoreQueryMarker();
            return HasMoreQueryMarker;
        })(dialog.NullEntityRec);
        dialog.HasMoreQueryMarker = HasMoreQueryMarker;
        var IsEmptyQueryMarker = (function (_super) {
            __extends(IsEmptyQueryMarker, _super);
            function IsEmptyQueryMarker() {
                _super.apply(this, arguments);
            }
            IsEmptyQueryMarker.singleton = new IsEmptyQueryMarker();
            return IsEmptyQueryMarker;
        })(dialog.NullEntityRec);
        dialog.IsEmptyQueryMarker = IsEmptyQueryMarker;
        (function (QueryMarkerOption) {
            QueryMarkerOption[QueryMarkerOption["None"] = 0] = "None";
            QueryMarkerOption[QueryMarkerOption["IsEmpty"] = 1] = "IsEmpty";
            QueryMarkerOption[QueryMarkerOption["HasMore"] = 2] = "HasMore";
        })(dialog.QueryMarkerOption || (dialog.QueryMarkerOption = {}));
        var QueryMarkerOption = dialog.QueryMarkerOption;
        var QueryScroller = (function () {
            function QueryScroller(_context, _pageSize, _firstObjectId, _markerOptions) {
                if (_markerOptions === void 0) { _markerOptions = []; }
                this._context = _context;
                this._pageSize = _pageSize;
                this._firstObjectId = _firstObjectId;
                this._markerOptions = _markerOptions;
                this.clear();
            }
            Object.defineProperty(QueryScroller.prototype, "buffer", {
                get: function () {
                    return this._buffer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryScroller.prototype, "bufferWithMarkers", {
                get: function () {
                    var result = ArrayUtil.copy(this._buffer);
                    if (this.isComplete) {
                        if (this._markerOptions.indexOf(QueryMarkerOption.IsEmpty) > -1) {
                            if (this.isEmpty) {
                                result.push(IsEmptyQueryMarker.singleton);
                            }
                        }
                    }
                    else if (this._markerOptions.indexOf(QueryMarkerOption.HasMore) > -1) {
                        if (result.length === 0) {
                            result.push(HasMoreQueryMarker.singleton);
                        }
                        else {
                            if (this._hasMoreBackward) {
                                result.unshift(HasMoreQueryMarker.singleton);
                            }
                            if (this._hasMoreForward) {
                                result.push(HasMoreQueryMarker.singleton);
                            }
                        }
                    }
                    return result;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryScroller.prototype, "context", {
                get: function () {
                    return this._context;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryScroller.prototype, "firstObjectId", {
                get: function () {
                    return this._firstObjectId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryScroller.prototype, "hasMoreBackward", {
                get: function () {
                    return this._hasMoreBackward;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryScroller.prototype, "hasMoreForward", {
                get: function () {
                    return this._hasMoreForward;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryScroller.prototype, "isComplete", {
                get: function () {
                    return !this._hasMoreBackward && !this._hasMoreForward;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryScroller.prototype, "isCompleteAndEmpty", {
                get: function () {
                    return this.isComplete && this._buffer.length === 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryScroller.prototype, "isEmpty", {
                get: function () {
                    return this._buffer.length === 0;
                },
                enumerable: true,
                configurable: true
            });
            QueryScroller.prototype.pageBackward = function () {
                var _this = this;
                if (!this._hasMoreBackward) {
                    return Future.createSuccessfulFuture('QueryScroller::pageBackward', []);
                }
                if (!this._prevPageFr || this._prevPageFr.isComplete) {
                    var fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].objectId;
                    this._prevPageFr = this._context.query(this._pageSize, dialog.QueryDirection.BACKWARD, fromObjectId);
                }
                else {
                    this._prevPageFr = this._prevPageFr.bind(function (queryResult) {
                        var fromObjectId = _this._buffer.length === 0 ? null : _this._buffer[0].objectId;
                        return _this._context.query(_this._pageSize, dialog.QueryDirection.BACKWARD, fromObjectId);
                    });
                }
                var beforeSize = this._buffer.length;
                return this._prevPageFr.map(function (queryResult) {
                    var afterSize = beforeSize;
                    _this._hasMoreBackward = queryResult.hasMore;
                    if (queryResult.entityRecs.length > 0) {
                        var newBuffer = [];
                        for (var i = queryResult.entityRecs.length - 1; i > -1; i--) {
                            newBuffer.push(queryResult.entityRecs[i]);
                        }
                        _this._buffer.forEach(function (entityRec) { newBuffer.push(entityRec); });
                        _this._buffer = newBuffer;
                        afterSize = _this._buffer.length;
                    }
                    return queryResult.entityRecs;
                });
            };
            QueryScroller.prototype.pageForward = function () {
                var _this = this;
                if (!this._hasMoreForward) {
                    return Future.createSuccessfulFuture('QueryScroller::pageForward', []);
                }
                if (!this._nextPageFr || this._nextPageFr.isComplete) {
                    var fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].objectId;
                    this._nextPageFr = this._context.query(this._pageSize, dialog.QueryDirection.FORWARD, fromObjectId);
                }
                else {
                    this._nextPageFr = this._nextPageFr.bind(function (queryResult) {
                        var fromObjectId = _this._buffer.length === 0 ? null : _this._buffer[_this._buffer.length - 1].objectId;
                        return _this._context.query(_this._pageSize, dialog.QueryDirection.FORWARD, fromObjectId);
                    });
                }
                var beforeSize = this._buffer.length;
                return this._nextPageFr.map(function (queryResult) {
                    var afterSize = beforeSize;
                    _this._hasMoreForward = queryResult.hasMore;
                    if (queryResult.entityRecs.length > 0) {
                        var newBuffer = [];
                        _this._buffer.forEach(function (entityRec) { newBuffer.push(entityRec); });
                        queryResult.entityRecs.forEach(function (entityRec) { newBuffer.push(entityRec); });
                        _this._buffer = newBuffer;
                        afterSize = _this._buffer.length;
                    }
                    return queryResult.entityRecs;
                });
            };
            Object.defineProperty(QueryScroller.prototype, "pageSize", {
                get: function () {
                    return this._pageSize;
                },
                enumerable: true,
                configurable: true
            });
            QueryScroller.prototype.refresh = function () {
                var _this = this;
                this.clear();
                return this.pageForward().map(function (entityRecList) {
                    _this.context.lastRefreshTime = new Date();
                    return entityRecList;
                });
            };
            QueryScroller.prototype.trimFirst = function (n) {
                var newBuffer = [];
                for (var i = n; i < this._buffer.length; i++) {
                    newBuffer.push(this._buffer[i]);
                }
                this._buffer = newBuffer;
                this._hasMoreBackward = true;
                if (this._buffer.length === 0)
                    this._hasMoreForward = true;
            };
            QueryScroller.prototype.trimLast = function (n) {
                var newBuffer = [];
                for (var i = 0; i < this._buffer.length - n; i++) {
                    newBuffer.push(this._buffer[i]);
                }
                this._buffer = newBuffer;
                this._hasMoreForward = true;
                if (this._buffer.length === 0)
                    this._hasMoreBackward = true;
            };
            QueryScroller.prototype.clear = function () {
                this._hasMoreBackward = !!this._firstObjectId;
                this._hasMoreForward = true;
                this._buffer = [];
            };
            return QueryScroller;
        })();
        dialog.QueryScroller = QueryScroller;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/27/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var QueryState;
        (function (QueryState) {
            QueryState[QueryState["ACTIVE"] = 0] = "ACTIVE";
            QueryState[QueryState["DESTROYED"] = 1] = "DESTROYED";
        })(QueryState || (QueryState = {}));
        (function (QueryDirection) {
            QueryDirection[QueryDirection["FORWARD"] = 0] = "FORWARD";
            QueryDirection[QueryDirection["BACKWARD"] = 1] = "BACKWARD";
        })(dialog.QueryDirection || (dialog.QueryDirection = {}));
        var QueryDirection = dialog.QueryDirection;
        var QueryContext = (function (_super) {
            __extends(QueryContext, _super);
            function QueryContext(paneRef, _offlineRecs, _settings) {
                if (_offlineRecs === void 0) { _offlineRecs = []; }
                if (_settings === void 0) { _settings = {}; }
                _super.call(this, paneRef);
                this._offlineRecs = _offlineRecs;
                this._settings = _settings;
            }
            Object.defineProperty(QueryContext.prototype, "entityRecDef", {
                get: function () {
                    return this.paneDef.entityRecDef;
                },
                enumerable: true,
                configurable: true
            });
            QueryContext.prototype.isBinary = function (columnDef) {
                var propDef = this.propDefAtName(columnDef.name);
                return propDef && (propDef.isBinaryType || (propDef.isURLType && columnDef.isInlineMediaStyle));
            };
            Object.defineProperty(QueryContext.prototype, "isDestroyed", {
                get: function () {
                    return this._queryState === QueryState.DESTROYED;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryContext.prototype, "lastQueryFr", {
                get: function () {
                    return this._lastQueryFr;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryContext.prototype, "offlineRecs", {
                get: function () {
                    return this._offlineRecs;
                },
                set: function (offlineRecs) {
                    this._offlineRecs = offlineRecs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryContext.prototype, "paneMode", {
                get: function () {
                    return this._settings['paneMode'];
                },
                enumerable: true,
                configurable: true
            });
            QueryContext.prototype.performMenuAction = function (menuDef, targets) {
                var _this = this;
                return dialog.DialogService.performQueryAction(this.paneDef.dialogHandle, menuDef.actionId, targets, this.sessionContext).bind(function (redirection) {
                    var target = targets.length > 0 ? targets[0] : null;
                    var ca = new dialog.ContextAction(menuDef.actionId, target, _this.actionSource);
                    return dialog.NavRequest.Util.fromRedirection(redirection, ca, _this.sessionContext);
                }).map(function (navRequest) {
                    _this._settings = dialog.PaneContext.resolveSettingsFromNavRequest(_this._settings, navRequest);
                    if (_this.isDestroyedSetting) {
                        _this._queryState = QueryState.DESTROYED;
                    }
                    return navRequest;
                });
            };
            QueryContext.prototype.query = function (maxRows, direction, fromObjectId) {
                var _this = this;
                return dialog.DialogService.queryQueryModel(this.paneDef.dialogHandle, direction, maxRows, fromObjectId, this.sessionContext).bind(function (value) {
                    var result = new dialog.QueryResult(value.entityRecs, value.hasMore);
                    if (_this.lastRefreshTime === new Date(0)) {
                        _this.lastRefreshTime = new Date();
                    }
                    return Future.createSuccessfulFuture('QueryContext::query', result);
                });
            };
            QueryContext.prototype.refresh = function () {
                return this._scroller.refresh();
            };
            Object.defineProperty(QueryContext.prototype, "scroller", {
                get: function () {
                    if (!this._scroller) {
                        this._scroller = this.newScroller();
                    }
                    return this._scroller;
                },
                enumerable: true,
                configurable: true
            });
            QueryContext.prototype.setScroller = function (pageSize, firstObjectId, markerOptions) {
                this._scroller = new dialog.QueryScroller(this, pageSize, firstObjectId, markerOptions);
                return this._scroller;
            };
            //module level methods
            QueryContext.prototype.newScroller = function () {
                return this.setScroller(50, null, [dialog.QueryMarkerOption.None]);
            };
            QueryContext.prototype.settings = function () {
                return this._settings;
            };
            Object.defineProperty(QueryContext.prototype, "isDestroyedSetting", {
                get: function () {
                    var str = this._settings['destroyed'];
                    return str && str.toLowerCase() === 'true';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryContext.prototype, "isGlobalRefreshSetting", {
                get: function () {
                    var str = this._settings['globalRefresh'];
                    return str && str.toLowerCase() === 'true';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryContext.prototype, "isLocalRefreshSetting", {
                get: function () {
                    var str = this._settings['localRefresh'];
                    return str && str.toLowerCase() === 'true';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QueryContext.prototype, "isRefreshSetting", {
                get: function () {
                    return this.isLocalRefreshSetting || this.isGlobalRefreshSetting;
                },
                enumerable: true,
                configurable: true
            });
            return QueryContext;
        })(dialog.PaneContext);
        dialog.QueryContext = QueryContext;
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
        var FormContext = (function (_super) {
            __extends(FormContext, _super);
            function FormContext(_dialogRedirection, _actionSource, _formDef, _childrenContexts, _offlineCapable, _offlineData, _sessionContext) {
                var _this = this;
                _super.call(this, null);
                this._dialogRedirection = _dialogRedirection;
                this._actionSource = _actionSource;
                this._formDef = _formDef;
                this._childrenContexts = _childrenContexts;
                this._offlineCapable = _offlineCapable;
                this._offlineData = _offlineData;
                this._sessionContext = _sessionContext;
                this._destroyed = false;
                this._offlineProps = {};
                this._childrenContexts = _childrenContexts || [];
                this._childrenContexts.forEach(function (c) { c.parentContext = _this; });
            }
            Object.defineProperty(FormContext.prototype, "actionSource", {
                get: function () {
                    return this.parentContext ? this.parentContext.actionSource : this._actionSource;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "childrenContexts", {
                get: function () {
                    return this._childrenContexts;
                },
                enumerable: true,
                configurable: true
            });
            FormContext.prototype.close = function () {
                return dialog.DialogService.closeEditorModel(this.dialogRedirection.dialogHandle, this.sessionContext);
            };
            Object.defineProperty(FormContext.prototype, "dialogRedirection", {
                get: function () {
                    return this._dialogRedirection;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "entityRecDef", {
                get: function () {
                    return this.formDef.entityRecDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "formDef", {
                get: function () {
                    return this._formDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "headerContext", {
                get: function () {
                    throw new Error('FormContext::headerContext: Needs Impl');
                },
                enumerable: true,
                configurable: true
            });
            FormContext.prototype.performMenuAction = function (menuDef) {
                var _this = this;
                return dialog.DialogService.performEditorAction(this.paneDef.dialogHandle, menuDef.actionId, dialog.NullEntityRec.singleton, this.sessionContext).bind(function (value) {
                    var destroyedStr = value.fromDialogProperties['destroyed'];
                    if (destroyedStr && destroyedStr.toLowerCase() === 'true') {
                        _this._destroyed = true;
                    }
                    var ca = new dialog.ContextAction(menuDef.actionId, _this.dialogRedirection.objectId, _this.actionSource);
                    return dialog.NavRequest.Util.fromRedirection(value, ca, _this.sessionContext);
                });
            };
            Object.defineProperty(FormContext.prototype, "isDestroyed", {
                get: function () {
                    return this._destroyed || this.isAnyChildDestroyed;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "offlineCapable", {
                get: function () {
                    return this._offlineCapable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "menuDefs", {
                get: function () {
                    return this.formDef.menuDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "offlineProps", {
                get: function () {
                    return this._offlineProps;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "paneDef", {
                get: function () {
                    return this.formDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "sessionContext", {
                get: function () {
                    return this._sessionContext;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContext.prototype, "isAnyChildDestroyed", {
                /** --------------------- MODULE ------------------------------*/
                //*** let's pretend this has module level visibility (no such thing (yet!))
                get: function () {
                    return this.childrenContexts.some(function (paneContext) {
                        if (paneContext instanceof dialog.EditorContext || paneContext instanceof dialog.QueryContext) {
                            return paneContext.isDestroyed;
                        }
                        return false;
                    });
                },
                enumerable: true,
                configurable: true
            });
            FormContext.prototype.processNavRequestForDestroyed = function (navRequest) {
                var fromDialogProps = {};
                if (navRequest instanceof FormContext) {
                    fromDialogProps = navRequest.offlineProps;
                }
                else if (navRequest instanceof dialog.NullNavRequest) {
                    fromDialogProps = navRequest.fromDialogProperties;
                }
                var destroyedStr = fromDialogProps['destroyed'];
                if (destroyedStr && destroyedStr.toLowerCase() === 'true') {
                    this._destroyed = true;
                }
                var fromDialogDestroyed = fromDialogProps['fromDialogDestroyed'];
                if (fromDialogDestroyed) {
                    this._destroyed = true;
                }
            };
            return FormContext;
        })(dialog.PaneContext);
        dialog.FormContext = FormContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 5/4/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var ListContext = (function (_super) {
            __extends(ListContext, _super);
            function ListContext(paneRef, offlineRecs, settings) {
                if (offlineRecs === void 0) { offlineRecs = []; }
                if (settings === void 0) { settings = {}; }
                _super.call(this, paneRef, offlineRecs, settings);
            }
            Object.defineProperty(ListContext.prototype, "columnHeadings", {
                get: function () {
                    return this.listDef.activeColumnDefs.map(function (cd) {
                        return cd.heading;
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListContext.prototype, "listDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            ListContext.prototype.rowValues = function (entityRec) {
                return this.listDef.activeColumnDefs.map(function (cd) {
                    return entityRec.valueAtName(cd.name);
                });
            };
            Object.defineProperty(ListContext.prototype, "style", {
                get: function () {
                    return this.listDef.style;
                },
                enumerable: true,
                configurable: true
            });
            return ListContext;
        })(dialog.QueryContext);
        dialog.ListContext = ListContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 5/4/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DetailsContext = (function (_super) {
            __extends(DetailsContext, _super);
            function DetailsContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(DetailsContext.prototype, "detailsDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailsContext.prototype, "printMarkupURL", {
                get: function () {
                    return this.paneDef.dialogRedirection.dialogProperties['formsURL'];
                },
                enumerable: true,
                configurable: true
            });
            return DetailsContext;
        })(dialog.EditorContext);
        dialog.DetailsContext = DetailsContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 5/4/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var MapContext = (function (_super) {
            __extends(MapContext, _super);
            function MapContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(MapContext.prototype, "mapDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            return MapContext;
        })(dialog.QueryContext);
        dialog.MapContext = MapContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 5/4/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GraphContext = (function (_super) {
            __extends(GraphContext, _super);
            function GraphContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(GraphContext.prototype, "graphDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            return GraphContext;
        })(dialog.QueryContext);
        dialog.GraphContext = GraphContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 5/4/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var CalendarContext = (function (_super) {
            __extends(CalendarContext, _super);
            function CalendarContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(CalendarContext.prototype, "calendarDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            return CalendarContext;
        })(dialog.QueryContext);
        dialog.CalendarContext = CalendarContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 5/4/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var ImagePickerContext = (function (_super) {
            __extends(ImagePickerContext, _super);
            function ImagePickerContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(ImagePickerContext.prototype, "imagePickerDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            return ImagePickerContext;
        })(dialog.QueryContext);
        dialog.ImagePickerContext = ImagePickerContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 5/4/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var BarcodeScanContext = (function (_super) {
            __extends(BarcodeScanContext, _super);
            function BarcodeScanContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(BarcodeScanContext.prototype, "barcodeScanDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            return BarcodeScanContext;
        })(dialog.EditorContext);
        dialog.BarcodeScanContext = BarcodeScanContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 5/4/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GeoFixContext = (function (_super) {
            __extends(GeoFixContext, _super);
            function GeoFixContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(GeoFixContext.prototype, "geoFixDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            return GeoFixContext;
        })(dialog.EditorContext);
        dialog.GeoFixContext = GeoFixContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 5/4/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GeoLocationContext = (function (_super) {
            __extends(GeoLocationContext, _super);
            function GeoLocationContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(GeoLocationContext.prototype, "geoLocationDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            return GeoLocationContext;
        })(dialog.EditorContext);
        dialog.GeoLocationContext = GeoLocationContext;
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
        var FormContextBuilder = (function () {
            function FormContextBuilder(_dialogRedirection, _actionSource, _sessionContext) {
                this._dialogRedirection = _dialogRedirection;
                this._actionSource = _actionSource;
                this._sessionContext = _sessionContext;
            }
            Object.defineProperty(FormContextBuilder.prototype, "actionSource", {
                get: function () {
                    return this._actionSource;
                },
                enumerable: true,
                configurable: true
            });
            FormContextBuilder.prototype.build = function () {
                var _this = this;
                if (!this.dialogRedirection.isEditor) {
                    return Future.createFailedFuture('FormContextBuilder::build', 'Forms with a root query model are not supported');
                }
                var xOpenFr = dialog.DialogService.openEditorModelFromRedir(this._dialogRedirection, this.sessionContext);
                var openAllFr = xOpenFr.bind(function (formXOpen) {
                    var formXOpenFr = Future.createSuccessfulFuture('FormContext/open/openForm', formXOpen);
                    var formXFormDefFr = _this.fetchXFormDef(formXOpen);
                    var formMenuDefsFr = dialog.DialogService.getEditorModelMenuDefs(formXOpen.formRedirection.dialogHandle, _this.sessionContext);
                    var formChildrenFr = formXFormDefFr.bind(function (xFormDef) {
                        var childrenXOpenFr = _this.openChildren(formXOpen);
                        var childrenXPaneDefsFr = _this.fetchChildrenXPaneDefs(formXOpen, xFormDef);
                        var childrenActiveColDefsFr = _this.fetchChildrenActiveColDefs(formXOpen);
                        var childrenMenuDefsFr = _this.fetchChildrenMenuDefs(formXOpen);
                        return Future.sequence([childrenXOpenFr, childrenXPaneDefsFr, childrenActiveColDefsFr, childrenMenuDefsFr]);
                    });
                    return Future.sequence([formXOpenFr, formXFormDefFr, formMenuDefsFr, formChildrenFr]);
                });
                return openAllFr.bind(function (value) {
                    var formDefTry = _this.completeOpenPromise(value);
                    var formContextTry = null;
                    if (formDefTry.isFailure) {
                        formContextTry = new Failure(formDefTry.failure);
                    }
                    else {
                        var formDef = formDefTry.success;
                        var childContexts = _this.createChildrenContexts(formDef);
                        var formContext = new dialog.FormContext(_this.dialogRedirection, _this._actionSource, formDef, childContexts, false, false, _this.sessionContext);
                        formContextTry = new Success(formContext);
                    }
                    return Future.createCompletedFuture('FormContextBuilder::build', formContextTry);
                });
            };
            Object.defineProperty(FormContextBuilder.prototype, "dialogRedirection", {
                get: function () {
                    return this._dialogRedirection;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormContextBuilder.prototype, "sessionContext", {
                get: function () {
                    return this._sessionContext;
                },
                enumerable: true,
                configurable: true
            });
            FormContextBuilder.prototype.completeOpenPromise = function (openAllResults) {
                var flattenedTry = Try.flatten(openAllResults);
                if (flattenedTry.isFailure) {
                    return new Failure('FormContextBuilder::build: ' + ObjUtil.formatRecAttr(flattenedTry.failure));
                }
                var flattened = flattenedTry.success;
                if (flattened.length != 4)
                    return new Failure('FormContextBuilder::build: Open form should have resulted in 4 elements');
                var formXOpen = flattened[0];
                var formXFormDef = flattened[1];
                var formMenuDefs = flattened[2];
                var formChildren = flattened[3];
                if (formChildren.length != 4)
                    return new Failure('FormContextBuilder::build: Open form should have resulted in 3 elements for children panes');
                var childrenXOpens = formChildren[0];
                var childrenXPaneDefs = formChildren[1];
                var childrenXActiveColDefs = formChildren[2];
                var childrenMenuDefs = formChildren[3];
                return dialog.FormDef.fromOpenFormResult(formXOpen, formXFormDef, formMenuDefs, childrenXOpens, childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs);
            };
            FormContextBuilder.prototype.createChildrenContexts = function (formDef) {
                var result = [];
                formDef.childrenDefs.forEach(function (paneDef, i) {
                    if (paneDef instanceof dialog.ListDef) {
                        result.push(new dialog.ListContext(i));
                    }
                    else if (paneDef instanceof dialog.DetailsDef) {
                        result.push(new dialog.DetailsContext(i));
                    }
                    else if (paneDef instanceof dialog.MapDef) {
                        result.push(new dialog.MapContext(i));
                    }
                    else if (paneDef instanceof dialog.GraphDef) {
                        result.push(new dialog.GraphContext(i));
                    }
                    else if (paneDef instanceof dialog.CalendarDef) {
                        result.push(new dialog.CalendarContext(i));
                    }
                    else if (paneDef instanceof dialog.ImagePickerDef) {
                        result.push(new dialog.ImagePickerContext(i));
                    }
                    else if (paneDef instanceof dialog.BarcodeScanDef) {
                        result.push(new dialog.BarcodeScanContext(i));
                    }
                    else if (paneDef instanceof dialog.GeoFixDef) {
                        result.push(new dialog.GeoFixContext(i));
                    }
                    else if (paneDef instanceof dialog.GeoLocationDef) {
                        result.push(new dialog.GeoLocationContext(i));
                    }
                });
                return result;
            };
            FormContextBuilder.prototype.fetchChildrenActiveColDefs = function (formXOpen) {
                var _this = this;
                var xComps = formXOpen.formModel.children;
                var seqOfFutures = xComps.map(function (xComp) {
                    if (xComp.redirection.isQuery) {
                        return dialog.DialogService.getActiveColumnDefs(xComp.redirection.dialogHandle, _this.sessionContext);
                    }
                    else {
                        return Future.createSuccessfulFuture('FormContextBuilder::fetchChildrenActiveColDefs', null);
                    }
                });
                return Future.sequence(seqOfFutures);
            };
            FormContextBuilder.prototype.fetchChildrenMenuDefs = function (formXOpen) {
                var _this = this;
                var xComps = formXOpen.formModel.children;
                var seqOfFutures = xComps.map(function (xComp) {
                    if (xComp.redirection.isEditor) {
                        return dialog.DialogService.getEditorModelMenuDefs(xComp.redirection.dialogHandle, _this.sessionContext);
                    }
                    else {
                        return dialog.DialogService.getQueryModelMenuDefs(xComp.redirection.dialogHandle, _this.sessionContext);
                    }
                });
                return Future.sequence(seqOfFutures);
            };
            FormContextBuilder.prototype.fetchChildrenXPaneDefs = function (formXOpen, xFormDef) {
                var _this = this;
                var formHandle = formXOpen.formModel.form.redirection.dialogHandle;
                var xRefs = xFormDef.paneDefRefs;
                var seqOfFutures = xRefs.map(function (xRef) {
                    return dialog.DialogService.getEditorModelPaneDef(formHandle, xRef.paneId, _this.sessionContext);
                });
                return Future.sequence(seqOfFutures);
            };
            FormContextBuilder.prototype.fetchXFormDef = function (xformOpenResult) {
                var dialogHandle = xformOpenResult.formRedirection.dialogHandle;
                var formPaneId = xformOpenResult.formPaneId;
                return dialog.DialogService.getEditorModelPaneDef(dialogHandle, formPaneId, this.sessionContext).bind(function (value) {
                    if (value instanceof dialog.XFormDef) {
                        return Future.createSuccessfulFuture('fetchXFormDef/success', value);
                    }
                    else {
                        return Future.createFailedFuture('fetchXFormDef/failure', 'Expected reponse to contain an XFormDef but got ' + ObjUtil.formatRecAttr(value));
                    }
                });
            };
            FormContextBuilder.prototype.openChildren = function (formXOpen) {
                var _this = this;
                var xComps = formXOpen.formModel.children;
                var seqOfFutures = [];
                xComps.forEach(function (nextXComp) {
                    var nextFr = null;
                    if (nextXComp.redirection.isEditor) {
                        nextFr = dialog.DialogService.openEditorModelFromRedir(nextXComp.redirection, _this.sessionContext);
                    }
                    else {
                        nextFr = dialog.DialogService.openQueryModelFromRedir(nextXComp.redirection, _this.sessionContext);
                    }
                    seqOfFutures.push(nextFr);
                });
                return Future.sequence(seqOfFutures);
            };
            return FormContextBuilder;
        })();
        dialog.FormContextBuilder = FormContextBuilder;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
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
            OType.typeInstance = function (name) {
                var type = OType.types[name];
                return type && new type;
            };
            OType.factoryFn = function (otype, jsonObj) {
                var typeFn = OType.typeFns[otype];
                if (typeFn) {
                    return typeFn(otype, jsonObj);
                }
                return null;
            };
            OType.deserializeObject = function (obj, Otype, factoryFn) {
                Log.debug('Deserializing ' + Otype);
                if (Array.isArray(obj)) {
                    //it's a nested array (no LTYPE!)
                    return OType.handleNestedArray(Otype, obj);
                }
                else {
                    var newObj = null;
                    var objTry = factoryFn(Otype, obj); //this returns null if there is no custom function
                    if (objTry) {
                        if (objTry.isFailure) {
                            var error = 'OType::deserializeObject: factory failed to produce object for ' + Otype + " : "
                                + ObjUtil.formatRecAttr(objTry.failure);
                            Log.error(error);
                            return new Failure(error);
                        }
                        newObj = objTry.success;
                    }
                    else {
                        newObj = OType.typeInstance(Otype);
                        if (!newObj) {
                            Log.error('OType::deserializeObject: no type constructor found for ' + Otype);
                            return new Failure('OType::deserializeObject: no type constructor found for ' + Otype);
                        }
                        for (var prop in obj) {
                            var value = obj[prop];
                            Log.debug("prop: " + prop + " is type " + typeof value);
                            if (value && typeof value === 'object') {
                                if ('WS_OTYPE' in value) {
                                    var otypeTry = dialog.DialogTriple.fromWSDialogObject(value, value['WS_OTYPE'], OType.factoryFn);
                                    if (otypeTry.isFailure)
                                        return new Failure(otypeTry.failure);
                                    OType.assignPropIfDefined(prop, otypeTry.success, newObj, Otype);
                                }
                                else if ('WS_LTYPE' in value) {
                                    var ltypeTry = dialog.DialogTriple.fromListOfWSDialogObject(value, value['WS_LTYPE'], OType.factoryFn);
                                    if (ltypeTry.isFailure)
                                        return new Failure(ltypeTry.failure);
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
                    }
                    return new Success(newObj);
                }
            };
            OType.serializeObject = function (obj, Otype, filterFn) {
                var newObj = { 'WS_OTYPE': Otype };
                return ObjUtil.copyNonNullFieldsOnly(obj, newObj, function (prop) {
                    return prop.charAt(0) !== '_' && (!filterFn || filterFn(prop));
                });
            };
            OType.handleNestedArray = function (Otype, obj) {
                return OType.extractLType(Otype).bind(function (ltype) {
                    var newArrayTry = OType.deserializeNestedArray(obj, ltype);
                    if (newArrayTry.isFailure)
                        return new Failure(newArrayTry.failure);
                    return new Success(newArrayTry.success);
                });
            };
            OType.deserializeNestedArray = function (array, ltype) {
                var newArray = [];
                for (var i = 0; i < array.length; i++) {
                    var value = array[i];
                    if (value && typeof value === 'object') {
                        var otypeTry = dialog.DialogTriple.fromWSDialogObject(value, ltype, OType.factoryFn);
                        if (otypeTry.isFailure) {
                            return new Failure(otypeTry.failure);
                        }
                        newArray.push(otypeTry.success);
                    }
                    else {
                        newArray.push(value);
                    }
                }
                return new Success(newArray);
            };
            OType.extractLType = function (Otype) {
                if (Otype.length > 5 && Otype.slice(0, 5) !== 'List<') {
                    return new Failure('Expected OType of List<some_type> but found ' + Otype);
                }
                var ltype = Otype.slice(5, -1);
                return new Success(ltype);
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
                'WSAttributeCellValueDef': dialog.AttributeCellValueDef,
                'WSBarcodeScanDef': dialog.XBarcodeScanDef,
                'WSCalendarDef': dialog.XCalendarDef,
                'WSCellDef': dialog.CellDef,
                'WSChangePaneModeResult': dialog.XChangePaneModeResult,
                'WSColumnDef': dialog.ColumnDef,
                'WSContextAction': dialog.ContextAction,
                'WSCreateSessionResult': dialog.SessionContextImpl,
                'WSDialogHandle': dialog.DialogHandle,
                'WSDataAnno': dialog.DataAnno,
                'WSDetailsDef': dialog.XDetailsDef,
                'WSDialogRedirection': dialog.DialogRedirection,
                'WSEditorRecordDef': dialog.EntityRecDef,
                'WSEntityRecDef': dialog.EntityRecDef,
                'WSForcedLineCellValueDef': dialog.ForcedLineCellValueDef,
                'WSFormDef': dialog.XFormDef,
                'WSFormModelComp': dialog.XFormModelComp,
                'WSGeoFixDef': dialog.XGeoFixDef,
                'WSGeoLocationDef': dialog.XGeoLocationDef,
                'WSGetActiveColumnDefsResult': dialog.XGetActiveColumnDefsResult,
                'WSGetSessionListPropertyResult': dialog.XGetSessionListPropertyResult,
                'WSGraphDataPointDef': dialog.GraphDataPointDef,
                'WSGraphDef': dialog.XGraphDef,
                'WSHandlePropertyChangeResult': dialog.XPropertyChangeResult,
                'WSImagePickerDef': dialog.XImagePickerDef,
                'WSLabelCellValueDef': dialog.LabelCellValueDef,
                'WSListDef': dialog.XListDef,
                'WSMapDef': dialog.XMapDef,
                'WSMenuDef': dialog.MenuDef,
                'WSOpenEditorModelResult': dialog.XOpenEditorModelResult,
                'WSOpenQueryModelResult': dialog.XOpenQueryModelResult,
                'WSPaneDefRef': dialog.XPaneDefRef,
                'WSPropertyDef': dialog.PropDef,
                'WSQueryRecordDef': dialog.EntityRecDef,
                'WSReadResult': dialog.XReadResult,
                'WSSortPropertyDef': dialog.SortPropDef,
                'WSSubstitutionCellValueDef': dialog.SubstitutionCellValueDef,
                'WSTabCellValueDef': dialog.TabCellValueDef,
                'WSWebRedirection': dialog.WebRedirection,
                'WSWorkbench': dialog.Workbench,
                'WSWorkbenchRedirection': dialog.WorkbenchRedirection,
                'WSWorkbenchLaunchAction': dialog.WorkbenchLaunchAction,
                'XWriteResult': dialog.XWriteResult
            };
            OType.typeFns = {
                'WSCellValueDef': dialog.CellValueDef.fromWS,
                'WSDataAnnotation': dialog.DataAnno.fromWS,
                'WSEditorRecord': dialog.EntityRec.Util.fromWSEditorRecord,
                'WSFormModel': dialog.XFormModel.fromWS,
                'WSGetAvailableValuesResult': dialog.XGetAvailableValuesResult.fromWS,
                'WSPaneDef': dialog.XPaneDef.fromWS,
                'WSOpenQueryModelResult': dialog.XOpenQueryModelResult.fromWS,
                'WSProp': dialog.Prop.fromWS,
                'WSQueryResult': dialog.XQueryResult.fromWS,
                'WSRedirection': dialog.Redirection.fromWS,
                'WSWriteResult': dialog.XWriteResult.fromWS
            };
            return OType;
        })();
        dialog.OType = OType;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
var AppContext = catavolt.dialog.AppContext;
var AppWinDef = catavolt.dialog.AppWinDef;
var AttributeCellValueDef = catavolt.dialog.AttributeCellValueDef;
var BarcodeScanContext = catavolt.dialog.BarcodeScanContext;
var BarcodeScanDef = catavolt.dialog.BarcodeScanDef;
var BinaryRef = catavolt.dialog.BinaryRef;
var CalendarContext = catavolt.dialog.CalendarContext;
var CalendarDef = catavolt.dialog.CalendarDef;
var CellDef = catavolt.dialog.CellDef;
var CellValueDef = catavolt.dialog.CellValueDef;
var CodeRef = catavolt.dialog.CodeRef;
var ColumnDef = catavolt.dialog.ColumnDef;
var ContextAction = catavolt.dialog.ContextAction;
var DataAnno = catavolt.dialog.DataAnno;
var DetailsContext = catavolt.dialog.DetailsContext;
var DialogRedirection = catavolt.dialog.DialogRedirection;
var DialogService = catavolt.dialog.DialogService;
var DetailsDef = catavolt.dialog.DetailsDef;
var EditorContext = catavolt.dialog.EditorContext;
var EntityRec = catavolt.dialog.EntityRec;
var EntityRecDef = catavolt.dialog.EntityRecDef;
var ForcedLineCellValueDef = catavolt.dialog.ForcedLineCellValueDef;
var FormContext = catavolt.dialog.FormContext;
var FormContextBuilder = catavolt.dialog.FormContextBuilder;
var FormDef = catavolt.dialog.FormDef;
var GeoFix = catavolt.dialog.GeoFix;
var GeoFixDef = catavolt.dialog.GeoFixDef;
var GeoFixContext = catavolt.dialog.GeoFixContext;
var GeoLocationContext = catavolt.dialog.GeoLocationContext;
var GeoLocationDef = catavolt.dialog.GeoLocationDef;
var GraphContext = catavolt.dialog.GraphContext;
var GraphDataPointDef = catavolt.dialog.GraphDataPointDef;
var GraphDef = catavolt.dialog.GraphDef;
var ImagePickerContext = catavolt.dialog.ImagePickerContext;
var ImagePickerDef = catavolt.dialog.ImagePickerDef;
var LabelCellValueDef = catavolt.dialog.LabelCellValueDef;
var ListContext = catavolt.dialog.ListContext;
var ListDef = catavolt.dialog.ListDef;
var MapContext = catavolt.dialog.MapContext;
var MapDef = catavolt.dialog.MapDef;
var MenuDef = catavolt.dialog.MenuDef;
var NavRequest = catavolt.dialog.NavRequest;
var NullRedirection = catavolt.dialog.NullRedirection;
var ObjectRef = catavolt.dialog.ObjectRef;
var PaneContext = catavolt.dialog.PaneContext;
var PaneDef = catavolt.dialog.PaneDef; ///<reference path="Redirection.ts"/>
var PaneMode = catavolt.dialog.PaneMode;
var Prop = catavolt.dialog.Prop;
var PropDef = catavolt.dialog.PropDef;
var PropFormatter = catavolt.dialog.PropFormatter;
var QueryResult = catavolt.dialog.QueryResult;
var QueryScroller = catavolt.dialog.QueryScroller;
var QueryContext = catavolt.dialog.QueryContext;
var Redirection = catavolt.dialog.Redirection;
var SortPropDef = catavolt.dialog.SortPropDef;
var SubstitutionCellValueDef = catavolt.dialog.SubstitutionCellValueDef;
var TabCellValueDef = catavolt.dialog.TabCellValueDef;
var WebRedirection = catavolt.dialog.WebRedirection;
var Workbench = catavolt.dialog.Workbench;
var WorkbenchLaunchAction = catavolt.dialog.WorkbenchLaunchAction;
var WorkbenchRedirection = catavolt.dialog.WorkbenchRedirection;
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
 * Created by rburson on 1/6/16.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a DetailsContext
 ***************************************************
 */
var CvDetails = React.createClass({
    getInitialState: function () {
        return { renderedDetailRows: [] };
    },
    componentWillMount: function () {
        var _this = this;
        this.props.detailsContext.read().onComplete(function (entityRecTry) {
            _this.layoutDetailsPane(_this.props.detailsContext);
        });
    },
    render: function () {
        var detailsContext = this.props.detailsContext;
        return (React.createElement("div", {"className": "panel panel-primary"}, React.createElement("div", {"className": "panel-heading"}, React.createElement("span", null, detailsContext.paneTitle || '>'), React.createElement("div", {"className": "pull-right"}, detailsContext.menuDefs.map(function (menuDef, index) { return React.createElement(CvMenu, {"key": index, "menuDef": menuDef}); }))), React.createElement("div", {"style": { maxHeight: '400px', overflow: 'auto' }}, React.createElement("table", {"className": "table table-striped"}, React.createElement("tbody", null, this.state.renderedDetailRows)))));
    },
    layoutDetailsPane: function (detailsContext) {
        var _this = this;
        var allDefsComplete = Future.createSuccessfulFuture('layoutDetailsPaneStart', {});
        var renderedDetailRows = [];
        detailsContext.detailsDef.rows.forEach(function (cellDefRow, index) {
            if (_this.isValidDetailsDefRow(cellDefRow)) {
                if (_this.isSectionTitleDef(cellDefRow)) {
                    allDefsComplete = allDefsComplete.map(function (lastRowResult) {
                        var titleRow = _this.createTitleRow(cellDefRow, index);
                        renderedDetailRows.push(titleRow);
                        return titleRow;
                    });
                }
                else {
                    allDefsComplete = allDefsComplete.bind(function (lastRowResult) {
                        return _this.createEditorRow(cellDefRow, detailsContext, index).map(function (editorRow) {
                            renderedDetailRows.push(editorRow);
                            return editorRow;
                        });
                    });
                }
            }
            else {
                Log.error('Detail row is invalid ' + ObjUtil.formatRecAttr(cellDefRow));
            }
        });
        allDefsComplete.onComplete(function (lastRowResultTry) {
            _this.setState({ renderedDetailRows: renderedDetailRows });
        });
    },
    isValidDetailsDefRow: function (row) {
        return row.length === 2 &&
            row[0].values.length === 1 &&
            row[1].values.length === 1 &&
            (row[0].values[0] instanceof LabelCellValueDef ||
                row[1].values[0] instanceof ForcedLineCellValueDef) &&
            (row[1].values[0] instanceof AttributeCellValueDef ||
                row[1].values[0] instanceof LabelCellValueDef ||
                row[1].values[0] instanceof ForcedLineCellValueDef);
    },
    isSectionTitleDef: function (row) {
        return row[0].values[0] instanceof LabelCellValueDef &&
            row[1].values[0] instanceof LabelCellValueDef;
    },
    createTitleRow: function (row, index) {
        Log.info('row: ' + JSON.stringify(row));
        return React.createElement("tr", {"key": index}, React.createElement("td", null, React.createElement("span", null, React.createElement("strong", null, row[0].values[0].value))), React.createElement("td", null, React.createElement("span", null, React.createElement("strong", null, row[1].values[0].value))));
    },
    /* Returns a Future */
    createEditorRow: function (row, detailsContext, index) {
        var labelDef = row[0].values[0];
        var label;
        if (labelDef instanceof LabelCellValueDef) {
            label = React.createElement("span", null, labelDef.value);
        }
        else {
            label = React.createElement("span", null, "N/A");
        }
        var valueDef = row[1].values[0];
        if (valueDef instanceof AttributeCellValueDef && !detailsContext.isReadModeFor(valueDef.propertyName)) {
            return this.createEditorControl(valueDef, detailsContext).map(function (editorCellString) {
                return React.createElement("tr", {"key": index}, [React.createElement("td", null, label), React.createElement("td", null, editorCellString)]);
            });
        }
        else if (valueDef instanceof AttributeCellValueDef) {
            var value = React.createElement("span", null);
            var prop = detailsContext.buffer.propAtName(valueDef.propertyName);
            if (prop && detailsContext.isBinary(valueDef)) {
                value = React.createElement("span", null);
            }
            else if (prop) {
                value = React.createElement("span", null, detailsContext.formatForRead(prop.value, prop.name));
            }
            return Future.createSuccessfulFuture('createEditorRow', React.createElement("tr", {"key": index}, [React.createElement("td", null, label), React.createElement("td", null, value)]));
        }
        else if (valueDef instanceof LabelCellValueDef) {
            var value = React.createElement("span", null, valueDef.value);
            return Future.createSuccessfulFuture('createEditorRow', React.createElement("tr", {"key": index}, [React.createElement("td", null, label), React.createElement("td", null, value)]));
        }
        else {
            return Future.createSuccessfulFuture('createEditorRow', React.createElement("tr", {"key": index}, [React.createElement("td", null, label), React.createElement("td", null)]));
        }
    },
    /* Returns a Future */
    createEditorControl: function (attributeDef, detailsContext) {
        if (attributeDef.isComboBoxEntryMethod) {
            return detailsContext.getAvailableValues(attributeDef.propertyName).map(function (values) {
                return React.createElement("span", null);
                //return '<ComboBox>' + values.join(", ") + '</ComboBox>';
            });
        }
        else if (attributeDef.isDropDownEntryMethod) {
            return detailsContext.getAvailableValues(attributeDef.propertyName).map(function (values) {
                return React.createElement("span", null);
                //return '<DropDown>' + values.join(", ") + '</DropDown>';
            });
        }
        else {
            var entityRec = detailsContext.buffer;
            var prop = entityRec.propAtName(attributeDef.propertyName);
            if (prop && detailsContext.isBinary(attributeDef)) {
                return Future.createSuccessfulFuture('createEditorControl', React.createElement("span", null));
            }
            else {
                var value = prop ? detailsContext.formatForWrite(prop.value, prop.name) : "";
                return Future.createSuccessfulFuture('createEditorControl', React.createElement("span", null, value));
            }
        }
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a FormContext
 ***************************************************
 */
var CvForm = React.createClass({
    getInitialState: function () {
        return { statusMessage: '' };
    },
    render: function () {
        var _this = this;
        var formContext = this.props.formContext;
        return React.createElement("span", null, formContext.childrenContexts.map(function (context) {
            Log.info('');
            Log.info('Got a ' + context.constructor['name'] + ' for display');
            Log.info('');
            if (context instanceof ListContext) {
                return React.createElement(CvList, {"listContext": context, "onNavRequest": _this.props.onNavRequest, "key": context.paneRef});
            }
            else if (context instanceof DetailsContext) {
                return React.createElement(CvDetails, {"detailsContext": context, "onNavRequest": _this.props.onNavRequest, "key": context.paneRef});
            }
            else {
                Log.info('');
                Log.info('Not yet handling display for ' + context.constructor['name']);
                Log.info('');
                return React.createElement(CvMessage, {"message": "Not yet handling display for " + context.constructor['name'], "key": context.paneRef});
            }
        }), React.createElement("div", {"className": "panel-footer"}, this.state.statusMessage));
        return React.createElement(CvMessage, {"message": "Could not render any contexts!"});
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * When you need to look fancy
 ***************************************************
 */
var CvHeroHeader = React.createClass({
    render: function () {
        return (React.createElement("div", {"className": "jumbotron logintron"}, React.createElement("div", {"className": "container-fluid"}, React.createElement("div", {"className": "center-block"}, React.createElement("img", {"className": "img-responsive center-block", "src": "img/Catavolt-Logo-retina.png", "style": { verticalAlign: 'middle' }})))));
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a 'Launcher'
 ***************************************************
 */
var CvLauncher = React.createClass({
    render: function () {
        return (React.createElement("div", {"className": "col-md-4 launch-div"}, React.createElement("img", {"className": "launch-icon img-responsive center-block", "src": this.props.launchAction.iconBase, "onClick": this.handleClick}), React.createElement("h5", {"className": "launch-text small text-center", "onClick": this.handleClick}, this.props.launchAction.name)));
    },
    handleClick: function () {
        var _this = this;
        this.props.catavolt.performLaunchAction(this.props.launchAction).onComplete(function (launchTry) {
            _this.props.onLaunch(launchTry);
        });
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a ListContext
 ***************************************************
 */
var QueryMarkerOption = catavolt.dialog.QueryMarkerOption;
var CvList = React.createClass({
    getInitialState: function () {
        return { entityRecs: [] };
    },
    componentWillMount: function () {
        var _this = this;
        var listContext = this.props.listContext;
        listContext.setScroller(50, null, [QueryMarkerOption.None]);
        listContext.scroller.refresh().onComplete(function (entityRecTry) {
            if (entityRecTry.isFailure) {
                Log.error("ListContext failed to render with " + ObjUtil.formatRecAttr(entityRecTry.failure));
            }
            else {
                Log.info(JSON.stringify(listContext.scroller.buffer));
                _this.setState({ entityRecs: ArrayUtil.copy(listContext.scroller.buffer) });
            }
        });
    },
    itemDoubleClicked: function (objectId) {
        var _this = this;
        var listContext = this.props.listContext;
        if (listContext.listDef.defaultActionId) {
            var defaultActionMenuDef = new MenuDef('DEFAULT_ACTION', null, listContext.listDef.defaultActionId, 'RW', listContext.listDef.defaultActionId, null, null, []);
            listContext.performMenuAction(defaultActionMenuDef, [objectId]).onComplete(function (navRequestTry) {
                _this.props.onNavRequest(navRequestTry);
            });
        }
    },
    render: function () {
        var _this = this;
        var listContext = this.props.listContext;
        return (React.createElement("div", {"className": "panel panel-primary"}, React.createElement("div", {"className": "panel-heading"}, React.createElement("span", null, listContext.paneTitle || '>'), React.createElement("div", {"className": "pull-right"}, listContext.menuDefs.map(function (menuDef, index) { return React.createElement(CvMenu, {"key": index, "menuDef": menuDef}); }))), React.createElement("div", {"style": { maxHeight: '400px', overflow: 'auto' }}, React.createElement("table", {"className": "table table-striped"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {"key": "nbsp"}, " "), listContext.columnHeadings.map(function (heading, index) { return React.createElement("th", {"key": index}, heading); }))), React.createElement("tbody", null, this.state.entityRecs.map(function (entityRec, index) {
            return (React.createElement("tr", {"key": index, "onDoubleClick": _this.itemDoubleClicked.bind(_this, entityRec.objectId)}, React.createElement("td", {"className": "text-center", "key": "checkbox"}, React.createElement("input", {"type": "checkbox"}), " "), listContext.rowValues(entityRec).map(function (val, index) { return React.createElement("td", {"key": index}, val ? val.toString() : ' '); })));
        }))))));
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a 'context menu' for a MenuDef
 ***************************************************
 */
var CvMenu = React.createClass({
    render: function () {
        var _this = this;
        var menuDef = this.props.menuDef;
        var findContextMenuDef = function (md) {
            if (md.name === 'CONTEXT_MENU')
                return md;
            if (md.menuDefs) {
                for (var i = 0; i < md.menuDefs.length; i++) {
                    var result = findContextMenuDef(md.menuDefs[i]);
                    if (result)
                        return result;
                }
            }
            return null;
        };
        var ctxMenuDef = findContextMenuDef(menuDef);
        return (React.createElement("div", {"className": "btn-group"}, React.createElement("button", {"type": "button", "className": "btn btn-xs btn-primary dropdown-toggle", "data-toggle": "dropdown"}, React.createElement("span", {"className": "caret"}, " ")), React.createElement("ul", {"className": "dropdown-menu", "role": "menu"}, ctxMenuDef.menuDefs.map(function (md, index) {
            return React.createElement("li", {"key": index}, React.createElement("a", {"onClick": _this.performMenuAction(md.actionId)}, md.label));
        }), React.createElement("li", {"className": "divider", "key": "divider"}, " "), React.createElement("li", {"key": "select_all"}, React.createElement("a", {"onClick": this.selectAll()}, "Select All")), React.createElement("li", {"key": "deselect_all"}, React.createElement("a", {"onClick": this.deselectAll()}, "Deselect All")))));
    },
    performMenuAction: function () {
    },
    selectAll: function () {
    },
    deselectAll: function () {
    },
});
/**
 * Created by rburson on 12/23/15.
 *
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a simple message
 ***************************************************
 */
var CvMessage = React.createClass({
    render: function () {
        Log.info(this.props.message);
        return React.createElement("span", null);
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a NavRequest
 ***************************************************
 */
var CvNavigation = React.createClass({
    render: function () {
        if (this.props.navRequestTry && this.props.navRequestTry.isSuccess) {
            if (this.props.navRequestTry.success instanceof FormContext) {
                return React.createElement(CvForm, {"catavolt": this.props.catavolt, "formContext": this.props.navRequestTry.success, "onNavRequest": this.props.onNavRequest});
            }
            else {
                return React.createElement(CvMessage, {"message": "Unsupported type of NavRequest " + this.props.navRequestTry});
            }
        }
        else {
            return React.createElement("span", null, " ");
        }
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a top-level application toolbar
 ***************************************************
 */
var CvToolbar = React.createClass({
    render: function () {
        return (React.createElement("nav", {"className": "navbar navbar-default navbar-static-top component-chrome"}, React.createElement("div", {"className": "container-fluid"}, React.createElement("div", {"className": "navbar-header"}, React.createElement("button", {"type": "button", "className": "navbar-toggle collapsed", "data-toggle": "collapse", "data-target": "#navbar", "aria-expanded": "false", "aria-controls": "navbar"}, React.createElement("span", {"className": "sr-only"}, "Toggle Navigation"), React.createElement("span", {"className": "icon-bar"}, " "), React.createElement("span", {"className": "icon-bar"}, " "), React.createElement("span", {"className": "icon-bar"}, " ")), React.createElement("a", {"className": "navbar-brand", "href": "#"}, "Catavolt")), React.createElement("div", {"id": "navbar", "className": "navbar-collapse collapse"}, React.createElement("ul", {"className": "nav navbar-nav navbar-right"}, React.createElement("li", {"className": "dropdown"}, React.createElement("a", {"href": "", "className": "dropdown-toggle", "data-toggle": "dropdown", "role": "button", "aria-expanded": "true"}, "Workbenches", React.createElement("span", {"className": "caret"}, " ")), React.createElement("ul", {"className": "dropdown-menu", "role": "menu"}, React.createElement("li", null, React.createElement("a", {"href": "#"}, "Default")))), React.createElement("li", null, React.createElement("a", {"href": "#"}, "Settings"))), React.createElement("form", {"className": "navbar-form navbar-right"}, React.createElement("input", {"type": "text", "className": "form-control", "placeholder": "Search For Help On..."}))))));
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * A component analogous to Catavolt AppWinDef
 ***************************************************
 */
var CvAppWindow = React.createClass({
    getInitialState: function () {
        return {
            workbenches: [],
            navRequestTry: null
        };
    },
    render: function () {
        var _this = this;
        var workbenches = this.props.catavolt.appWinDefTry.success.workbenches;
        return (React.createElement("span", null, React.createElement(CvToolbar, null), React.createElement("div", {"className": "container"}, (function () {
            if (_this.showWorkbench()) {
                return workbenches.map(function (workbench, index) {
                    return React.createElement(CvWorkbench, {"catavolt": _this.props.catavolt, "workbench": workbench, "onNavRequest": _this.onNavRequest});
                });
            }
        })(), React.createElement(CvNavigation, {"navRequestTry": this.state.navRequestTry, "onNavRequest": this.onNavRequest}))));
    },
    showWorkbench: function () {
        return this.props.persistentWorkbench || !this.state.navRequestTry;
    },
    onNavRequest: function (navRequestTry) {
        if (navRequestTry.isFailure) {
            alert('Handle Navigation Failure!');
            Log.error(navRequestTry.failure);
        }
        else {
            this.setState({ navRequestTry: navRequestTry });
        }
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a Workbench
 ***************************************************
 */
var CvWorkbench = React.createClass({
    render: function () {
        var launchActions = this.props.workbench.workbenchLaunchActions;
        var launchComps = [];
        for (var i = 0; i < launchActions.length; i++) {
            launchComps.push(React.createElement(CvLauncher, {"catavolt": this.props.catavolt, "launchAction": launchActions[i], "key": launchActions[i].actionId, "onLaunch": this.actionLaunched}));
        }
        return (React.createElement("div", {"className": "panel panel-primary"}, React.createElement("div", {"className": "panel-heading"}, " ", React.createElement("h3", {"className": "panel-title"}, this.props.workbench.name), " "), React.createElement("div", {"className": "panel-body"}, launchComps)));
    },
    actionLaunched: function (launchTry) {
        this.props.onNavRequest(launchTry);
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
/*
 ***************************************************
 * Render a LoginPane
 ***************************************************
 */
var CvLoginPane = React.createClass({
    getInitialState: function () {
        return {
            tenantId: 'catavolt-dev',
            gatewayUrl: 'www.catavolt.net',
            userId: 'rob',
            password: 'rob123',
            clientType: 'RICH_CLIENT'
        };
    },
    render: function () {
        return (React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "well"}, React.createElement("form", {"className": "form-horizontal login-form", "onSubmit": this.handleSubmit}, React.createElement("div", {"className": "form-group"}, React.createElement("label", {"htmlFor": "tenantId", "className": "col-sm-2 control-label"}, "Tenant Id:"), React.createElement("div", {"className": "col-sm-10"}, React.createElement("input", {"id": "tenantId", "type": "text", "className": "form-control", "value": this.state.tenantId, "onChange": this.handleChange.bind(this, 'tenantId'), "required": true}))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"htmlFor": "gatewayUrl", "className": "col-sm-2 control-label"}, "Gateway URL:"), React.createElement("div", {"className": "col-sm-10"}, React.createElement("div", {"className": "input-group"}, React.createElement("input", {"id": "gatewayUrl", "type": "text", "className": "form-control", "value": this.state.gatewayUrl, "onChange": this.handleChange.bind(this, 'gatewayUrl'), "aria-describedby": "http-addon", "required": true})))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"htmlFor": "userId", "className": "col-sm-2 control-label"}, "User Id:"), React.createElement("div", {"className": "col-sm-10"}, React.createElement("input", {"id": "userId", "type": "text", "className": "form-control", "value": this.state.userId, "onChange": this.handleChange.bind(this, 'userId'), "required": true}))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"htmlFor": "password", "className": "col-sm-2 control-label"}, " Password:"), React.createElement("div", {"className": "col-sm-10"}, React.createElement("input", {"id": "password", "type": "password", "className": "form-control", "value": this.state.password, "onChange": this.handleChange.bind(this, 'password'), "required": true}))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"htmlFor": "clientType", "className": "col-sm-2 control-label"}, "Client Type:"), React.createElement("div", {"className": "col-sm-10"}, React.createElement("label", {"className": "radio-inline"}, React.createElement("input", {"id": "clientType", "type": "radio", "onChange": this.handleRadioChange.bind(this, 'clientType', 'LIMITED_ACCESS'), "checked": this.state.clientType === 'LIMITED_ACCESS'}), "Limited"), React.createElement("label", {"className": "radio-inline"}, React.createElement("input", {"id": "clientType", "type": "radio", "onChange": this.handleRadioChange.bind(this, 'clientType', 'RICH_CLIENT'), "checked": this.state.clientType === 'RICH_CLIENT'}), "Rich"))), React.createElement("div", {"className": "form-group"}, React.createElement("div", {"className": "col-sm-10 col-sm-offset-2"}, React.createElement("button", {"type": "submit", "className": "btn btn-default btn-primary btn-block", "value": "Login"}, "Login ", React.createElement("span", {"className": "glyphicon glyphicon-log-in", "aria-hidden": "true"}))))))));
    },
    handleChange: function (field, e) {
        var nextState = {};
        nextState[field] = e.target.value;
        this.setState(nextState);
    },
    handleRadioChange: function (field, value, e) {
        var nextState = {};
        nextState[field] = value;
        this.setState(nextState);
    },
    handleSubmit: function (e) {
        var _this = this;
        e.preventDefault();
        this.props.catavolt.login(this.state.gatewayUrl, this.state.tenantId, this.state.clientType, this.state.userId, this.state.password)
            .onComplete(function (appWinDefTry) {
            Log.info(ObjUtil.formatRecAttr(appWinDefTry.success.workbenches[0]));
            _this.props.onLogin();
        });
    }
});
/**
 * Created by rburson on 12/23/15.
 */
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="CvReact.tsx"/>
/*
 ***************************************************
 *  Top-level container for a Catavolt Application
 ***************************************************
 */
var CatavoltPane = React.createClass({
    checkSession: function () {
        var _this = this;
        var sessionContext = this.getSession();
        if (sessionContext) {
            this.props.catavolt.refreshContext(sessionContext).onComplete(function (appWinDefTry) {
                if (appWinDefTry.isFailure) {
                    Log.error("Failed to refresh session: " + ObjUtil.formatRecAttr(appWinDefTry.failure));
                }
                else {
                    _this.setState({ loggedIn: true });
                }
            });
        }
    },
    componentWillMount: function () {
        /* @TODO - need to work on the AppContext to make the session restore possible */
        //this.checkSession();
    },
    getDefaultProps: function () {
        return {
            catavolt: AppContext.singleton,
            persistentWorkbench: false
        };
    },
    getInitialState: function () {
        return { loggedIn: false };
    },
    getSession: function () {
        var session = sessionStorage.getItem('session');
        return session ? JSON.parse(session) : null;
    },
    render: function () {
        if (React.Children.count(this.props.children) > 0) {
            return React.createElement("div", null);
        }
        else {
            return this.state.loggedIn ?
                (React.createElement(CvAppWindow, {"catavolt": this.props.catavolt, "onLogout": this.loggedOut, "persistentWorkbench": this.props.persistentWorkbench})) :
                (React.createElement("span", null, React.createElement(CvHeroHeader, null), React.createElement(CvLoginPane, {"catavolt": this.props.catavolt, "onLogin": this.loggedIn})));
        }
    },
    loggedIn: function (sessionContext) {
        this.setState({ loggedIn: true });
        this.storeSession(this.props.catavolt.sessionContextTry.success);
    },
    loggedOut: function () {
        this.removeSession();
        this.setState({ loggedIn: false });
    },
    removeSession: function () {
        sessionStorage.removeItem('session');
    },
    storeSession: function (sessionContext) {
        sessionStorage.setItem('session', JSON.stringify(sessionContext));
    }
});
/**
 * Created by rburson on 3/6/15.
 */
//components
///<reference path="CvReact.tsx"/>
///<reference path="CvDetails.tsx"/>
///<reference path="CvForm.tsx"/>
///<reference path="CvHeroHeader.tsx"/>
///<reference path="CvLauncher.tsx"/>
///<reference path="CvList.tsx"/>
///<reference path="CvMenu.tsx"/>
///<reference path="CvMessage.tsx"/>
///<reference path="CvNavigation.tsx"/>
///<reference path="CvToolbar.tsx"/>
///<reference path="CvAppWindow.tsx"/>
///<reference path="CvWorkbench.tsx"/>
///<reference path="CvLoginPane.tsx"/>
///<reference path="CatavoltPane.tsx"/>
///<reference path="../../typings/react/react-global.d.ts"/>
///<reference path="../catavolt/references.ts"/>
///<reference path="references.ts"/>
Log.logLevel(LogLevel.DEBUG);
ReactDOM.render(React.createElement(CatavoltPane, {"persistentWorkbench": true}, React.createElement("div", null, "something")), document.getElementById('cvApp'));