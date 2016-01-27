import { ArrayUtil } from "./util";
import { Log } from "./util";
/*
  IMPORTANT!
  Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
  Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
 */
/**
 * Created by rburson on 3/16/15.
 */
export class Try {
    static flatten(tryList) {
        var successes = [];
        var failures = [];
        tryList.forEach((t) => {
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
    }
    static isListOfTry(list) {
        return list.every((value) => {
            return (value instanceof Try);
        });
    }
    bind(f) {
        return this.isFailure ? new Failure(this.failure) : f(this.success);
    }
    get failure() {
        return null;
    }
    get isFailure() {
        return false;
    }
    get isSuccess() {
        return false;
    }
    map(f) {
        return this.isFailure ? new Failure(this.failure) : new Success(f(this.success));
    }
    get success() {
        return null;
    }
}
export class Failure extends Try {
    constructor(_error) {
        super();
        this._error = _error;
    }
    get failure() {
        return this._error;
    }
    get isFailure() {
        return true;
    }
}
export class Success extends Try {
    constructor(_value) {
        super();
        this._value = _value;
    }
    get isSuccess() {
        return true;
    }
    get success() {
        return this._value;
    }
}
/**
 * Created by rburson on 3/5/15.
 */
export class Either {
    static left(left) {
        var either = new Either();
        either._left = left;
        return either;
    }
    static right(right) {
        var either = new Either();
        either._right = right;
        return either;
    }
    get isLeft() {
        return !!this._left;
    }
    get isRight() {
        return !!this._right;
    }
    get left() {
        return this._left;
    }
    get right() {
        return this._right;
    }
}
export class Future {
    /** --------------------- CONSTRUCTORS ------------------------------*/
    constructor(_label) {
        this._label = _label;
        this._completionListeners = new Array();
    }
    /** --------------------- PUBLIC STATIC ------------------------------*/
    static createCompletedFuture(label, result) {
        var f = new Future(label);
        return f.complete(result);
    }
    static createSuccessfulFuture(label, value) {
        return Future.createCompletedFuture(label, new Success(value));
    }
    static createFailedFuture(label, error) {
        return Future.createCompletedFuture(label, new Failure(error));
    }
    static createFuture(label) {
        var f = new Future(label);
        return f;
    }
    static sequence(seqOfFutures) {
        var start = Future.createSuccessfulFuture('Future::sequence/start', []);
        return seqOfFutures.reduce((seqFr, nextFr) => {
            return seqFr.bind((seq) => {
                var pr = new Promise('Future::sequence/nextFr');
                nextFr.onComplete((t) => {
                    seq.push(t);
                    pr.complete(new Success(seq));
                });
                return pr.future;
            });
        }, start);
    }
    /** --------------------- PUBLIC ------------------------------*/
    bind(f) {
        var p = new Promise('Future.bind:' + this._label);
        this.onComplete((t1) => {
            if (t1.isFailure) {
                p.failure(t1.failure);
            }
            else {
                var a = t1.success;
                try {
                    var mb = f(a);
                    mb.onComplete((t2) => {
                        p.complete(t2);
                    });
                }
                catch (error) {
                    p.complete(new Failure(error));
                }
            }
        });
        return p.future;
    }
    get failure() {
        return this._result ? this._result.failure : null;
    }
    get isComplete() {
        return !!this._result;
    }
    get isCompleteWithFailure() {
        return !!this._result && this._result.isFailure;
    }
    get isCompleteWithSuccess() {
        return !!this._result && this._result.isSuccess;
    }
    map(f) {
        var p = new Promise('Future.map:' + this._label);
        this.onComplete((t1) => {
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
    }
    onComplete(listener) {
        this._result ? listener(this._result) : this._completionListeners.push(listener);
    }
    onFailure(listener) {
        this.onComplete((t) => {
            t.isFailure && listener(t.failure);
        });
    }
    onSuccess(listener) {
        this.onComplete((t) => {
            t.isSuccess && listener(t.success);
        });
    }
    get result() {
        return this._result;
    }
    get success() {
        return this._result ? this.result.success : null;
    }
    /** --------------------- MODULE ------------------------------*/
    //*** let's pretend this has module level visibility
    complete(t) {
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
            notifyList.forEach((listener) => {
                try {
                    listener(this._result);
                }
                catch (error) {
                    Log.error("CompletionListener failed with " + error);
                    if (error.stack)
                        Log.error(error.stack);
                }
            });
        }
        else {
            Log.error("Future::complete() : Can't complete Future with null result");
        }
        return this;
    }
}
/**
 * Created by rburson on 3/6/15.
 */
export class Promise {
    constructor(label) {
        this._future = Future.createFuture(label);
    }
    /** --------------------- PUBLIC ------------------------------*/
    isComplete() {
        return this._future.isComplete;
    }
    complete(t) {
        //Log.debug('Promise calling complete on Future...');
        this._future.complete(t);
        return this;
    }
    failure(error) {
        this.complete(new Failure(error));
    }
    get future() {
        return this._future;
    }
    success(value) {
        this.complete(new Success(value));
    }
}
