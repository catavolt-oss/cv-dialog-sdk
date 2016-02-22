/**
 * Created by rburson on 3/5/15.
 */
import { Success } from './Success';
import { Failure } from './Failure';
import { Promise } from './Promise';
import { ArrayUtil } from '../util/ArrayUtil';
import { Log } from '../util/Log';
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
                }
            });
        }
        else {
            Log.error("Future::complete() : Can't complete Future with null result");
        }
        return this;
    }
}
