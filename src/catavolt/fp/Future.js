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
