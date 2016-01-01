var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var util_1 = require("./util");
var util_2 = require("./util");
/*
  IMPORTANT!
  Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
  Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
 */
/**
 * Created by rburson on 3/16/15.
 */
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
            return new Failure(failures);
        }
        else {
            return new Success(successes);
        }
    };
    Try.isListOfTry = function (list) {
        return list.every(function (value) {
            return (value instanceof Try);
        });
    };
    Try.prototype.bind = function (f) {
        return this.isFailure ? new Failure(this.failure) : f(this.success);
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
        return this.isFailure ? new Failure(this.failure) : new Success(f(this.success));
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
exports.Try = Try;
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
})(Try);
exports.Failure = Failure;
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
})(Try);
exports.Success = Success;
/**
 * Created by rburson on 3/5/15.
 */
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
exports.Either = Either;
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
        return Future.createCompletedFuture(label, new Success(value));
    };
    Future.createFailedFuture = function (label, error) {
        return Future.createCompletedFuture(label, new Failure(error));
    };
    Future.createFuture = function (label) {
        var f = new Future(label);
        return f;
    };
    Future.sequence = function (seqOfFutures) {
        var start = Future.createSuccessfulFuture('Future::sequence/start', []);
        return seqOfFutures.reduce(function (seqFr, nextFr) {
            return seqFr.bind(function (seq) {
                var pr = new Promise('Future::sequence/nextFr');
                nextFr.onComplete(function (t) {
                    seq.push(t);
                    pr.complete(new Success(seq));
                });
                return pr.future;
            });
        }, start);
    };
    /** --------------------- PUBLIC ------------------------------*/
    Future.prototype.bind = function (f) {
        var p = new Promise('Future.bind:' + this._label);
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
                    p.complete(new Failure(error));
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
        var p = new Promise('Future.map:' + this._label);
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
                    p.complete(new Failure(error));
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
                notifyList = util_1.ArrayUtil.copy(this._completionListeners);
            }
            else {
                util_2.Log.error("Future::complete() : Future " + this._label + " has already been completed");
            }
            notifyList.forEach(function (listener) {
                try {
                    listener(_this._result);
                }
                catch (error) {
                    util_2.Log.error("CompletionListener failed with " + error);
                }
            });
        }
        else {
            util_2.Log.error("Future::complete() : Can't complete Future with null result");
        }
        return this;
    };
    return Future;
})();
exports.Future = Future;
/**
 * Created by rburson on 3/6/15.
 */
var Promise = (function () {
    function Promise(label) {
        this._future = Future.createFuture(label);
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
        this.complete(new Failure(error));
    };
    Object.defineProperty(Promise.prototype, "future", {
        get: function () {
            return this._future;
        },
        enumerable: true,
        configurable: true
    });
    Promise.prototype.success = function (value) {
        this.complete(new Success(value));
    };
    return Promise;
})();
exports.Promise = Promise;
