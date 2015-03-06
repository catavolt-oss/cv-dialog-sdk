/**
 * Created by rburson on 3/5/15.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Failure = (function (_super) {
            __extends(Failure, _super);
            function Failure(error) {
                _super.call(this);
                this.error = error;
                console.log("test");
            }
            Failure.prototype.failure = function () {
                return this.error;
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
///<reference path="../references.ts"/>
var ArrayUtil = catavolt.util.ArrayUtil;
var Log = catavolt.util.Log;
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Future = (function () {
            /** --------------------- CONSTRUCTORS ------------------------------*/
            function Future(label) {
                this.label = label;
                this.completionListeners = new Array();
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
                return !!this.result;
            };
            Future.prototype.isCompleteWithFailure = function () {
                return !!this.result && this.result.isFailure();
            };
            Future.prototype.isCompleteWithSuccess = function () {
                return !!this.result && this.result.isSuccess();
            };
            /*  TODO - figure out how to scope this at the 'module' level */
            Future.prototype.complete = function (t) {
                var _this = this;
                var notifyList = new Array();
                if (t) {
                    if (!this.result) {
                        this.result = t;
                        /* capture the listener set to prevent missing a notification */
                        notifyList = ArrayUtil.deepCopy(this.completionListeners);
                    }
                    else {
                        Log.error("Future::complete() : Future is already completed");
                    }
                    notifyList.forEach(function (listener) {
                        listener(_this.result);
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
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Success = (function (_super) {
            __extends(Success, _super);
            function Success(value) {
                _super.call(this);
                this.value = value;
            }
            Success.prototype.isSuccess = function () {
                return true;
            };
            Success.prototype.success = function () {
                return this.value;
            };
            return Success;
        })(fp.Try);
        fp.Success = Success;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
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
 * Created by rburson on 3/6/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Promise = (function () {
            function Promise(label) {
                this.future = fp.Future.createFuture(label);
            }
            /** --------------------- PUBLIC ------------------------------*/
            Promise.prototype.isComplete = function () {
                return this.future.isComplete();
            };
            Promise.prototype.complete = function (t) {
                this.future.complete(t);
                return this;
            };
            Promise.prototype.failure = function (error) {
                this.complete(new fp.Failure(error));
            };
            Promise.prototype.getFuture = function () {
                return this.future;
            };
            Promise.prototype.success = function (value) {
                this.complete(new fp.Success(value));
            };
            return Promise;
        })();
        fp.Promise = Promise;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
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
            Log.info = function (message) {
                console.info();
            };
            Log.error = function (message) {
                console.error();
            };
            return Log;
        })();
        util.Log = Log;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
//fp
///<reference path="fp/Failure.ts"/>
///<reference path="fp/Future.ts"/>
///<reference path="fp/Success.ts"/>
///<reference path="fp/Try.ts"/>
///<reference path="fp/Promise.ts"/>
//util
///<reference path="util/ArrayUtil.ts"/>
///<reference path="util/Log.ts"/>
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