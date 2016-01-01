import {ArrayUtil} from "./util";
import {Log} from "./util";

/*
  IMPORTANT!
  Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
  Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
 */

/**
 * Created by rburson on 3/16/15.
 */

export class Try<A> {

    static flatten<A>(tryList:Array<Try<A>>):Try<Array<A>> {
        var successes = [];
        var failures = [];
        tryList.forEach((t:Try<A>)=> {
            if (t.isFailure) {
                failures.push(t.failure);
            } else {
                if (Array.isArray(t.success) && Try.isListOfTry(<any>t.success)) {
                    var flattened = Try.flatten(<any>t.success);
                    if (flattened.isFailure) {
                        failures.push(flattened.failure);
                    } else {
                        successes.push(flattened.success);
                    }
                } else {
                    successes.push(t.success);
                }
            }
        });
        if (failures.length > 0) {
            return new Failure<Array<A>>(failures);
        } else {
            return new Success(successes);
        }
    }

    private static isListOfTry(list:Array<any>):boolean {
        return list.every((value)=> {
            return (value instanceof Try);
        });
    }

    bind<B>(f:TryFn<A,B>):Try<B> {
        return this.isFailure ? new Failure<B>(this.failure) : f(this.success);
    }

    get failure() {
        return null;
    }

    get isFailure():boolean {
        return false;
    }

    get isSuccess():boolean {
        return false;
    }

    map<B>(f:MapFn<A,B>):Try<B> {
        return this.isFailure ? new Failure<B>(this.failure) : new Success<B>(f(this.success));
    }

    get success():A {
        return null;
    }
}


export class Failure<A> extends Try<A> {

    constructor(private _error) {
        super();
    }

    get failure() {
        return this._error;
    }

    get isFailure():boolean {
        return true;
    }

}

export class Success<A> extends Try<A> {

    constructor(private _value:A) {
        super();
    }

    get isSuccess():boolean {
        return true;
    }

    get success():A {
        return this._value;
    }

}

/**
 * Created by rburson on 3/5/15.
 */

export class Either<A,B> {

    private _left:A;
    private _right:B;

    static left<A,B>(left:A):Either<A,B> {
        var either = new Either<A,B>();
        either._left = left;
        return either;
    }

    static right<A,B>(right:B):Either<A,B> {
        var either = new Either<A,B>();
        either._right = right;
        return either;
    }

    get isLeft():boolean {
        return !!this._left;
    }

    get isRight():boolean {
        return !!this._right;
    }

    get left():A {
        return this._left;
    }

    get right():B {
        return this._right;
    }

}




export class Future<A> {

    /** --------------------- PUBLIC STATIC ------------------------------*/

    static createCompletedFuture<A>(label:string, result:Try<A>):Future<A> {
        var f:Future<A> = new Future<A>(label);
        return f.complete(result);
    }

    static createSuccessfulFuture<A>(label:string, value:A):Future<A> {
        return Future.createCompletedFuture(label, new Success<A>(value));
    }

    static createFailedFuture<A>(label:string, error):Future<A> {
        return Future.createCompletedFuture(label, new Failure<A>(error));
    }

    static createFuture<A>(label:string):Future<A> {
        var f:Future<A> = new Future<A>(label);
        return f;
    }

    static sequence<A>(seqOfFutures:Array<Future<A>>):Future<Array<Try<A>>> {
        var start:Future<Array<Try<A>>> = Future.createSuccessfulFuture<Array<Try<A>>>('Future::sequence/start', []);
        return seqOfFutures.reduce((seqFr:Future<Array<Try<A>>>, nextFr:Future<A>)=> {
            return seqFr.bind((seq:Array<Try<A>>)=> {
                var pr = new Promise<Array<Try<A>>>('Future::sequence/nextFr');
                nextFr.onComplete((t:Try<A>)=> {
                    seq.push(t);
                    pr.complete(new Success<Array<Try<A>>>(seq));
                });
                return pr.future;
            });
        }, start);
    }

    private _completionListeners:Array<(t:Try<A>)=>void> = new Array();
    private _result:Try<A>;

    /** --------------------- CONSTRUCTORS ------------------------------*/

    constructor(private _label) {
    }

    /** --------------------- PUBLIC ------------------------------*/

    bind<B>(f:FutureFn<A,B>):Future<B> {
        var p:Promise<B> = new Promise<B>('Future.bind:' + this._label);
        this.onComplete((t1:Try<A>)=> {
            if (t1.isFailure) {
                p.failure(t1.failure);
            } else {
                var a:A = t1.success;
                try {
                    var mb:Future<B> = f(a);
                    mb.onComplete((t2:Try<B>)=> {
                        p.complete(t2);
                    });
                } catch (error) {
                    p.complete(new Failure<B>(error));
                }
            }
        });
        return p.future;
    }

    get failure() {
        return this._result ? this._result.failure : null;
    }

    get isComplete():boolean {
        return !!this._result;
    }

    get isCompleteWithFailure():boolean {
        return !!this._result && this._result.isFailure;
    }

    get isCompleteWithSuccess():boolean {
        return !!this._result && this._result.isSuccess;
    }

    map<B>(f:MapFn<A,B>):Future<B> {

        var p:Promise<B> = new Promise<B>('Future.map:' + this._label);
        this.onComplete((t1:Try<A>)=> {
            if (t1.isFailure) {
                p.failure(t1.failure);
            } else {
                var a:A = t1.success;
                try {
                    var b:B = f(a);
                    p.success(b);
                } catch (error) {
                    p.complete(new Failure<B>(error));
                }
            }
        });
        return p.future;
    }

    onComplete(listener:CompletionListener<A>):void {
        this._result ? listener(this._result) : this._completionListeners.push(listener);
    }

    onFailure(listener:FailureListener):void {
        this.onComplete((t:Try<A>)=> {
            t.isFailure && listener(t.failure);
        });
    }

    onSuccess(listener:SuccessListener<A>):void {
        this.onComplete((t:Try<A>)=> {
            t.isSuccess && listener(t.success);
        });
    }

    get result():Try<A> {
        return this._result;
    }

    get success():A {
        return this._result ? this.result.success : null;
    }


    /** --------------------- MODULE ------------------------------*/
    //*** let's pretend this has module level visibility

    complete(t:Try<A>):Future<A> {
        var notifyList:Array<CompletionListener<A>> = new Array();
        //Log.debug("complete() called on Future " + this._label + ' there are ' + this._completionListeners.length + " listeners.");
        if (t) {
            if (!this._result) {
                this._result = t;
                /* capture the listener set to prevent missing a notification */
                notifyList = ArrayUtil.copy(this._completionListeners);
            } else {
                Log.error("Future::complete() : Future " + this._label + " has already been completed");
            }
            notifyList.forEach(
                (listener:CompletionListener<A>)=> {
                    try {
                        listener(this._result);
                    } catch (error) {
                        Log.error("CompletionListener failed with " + error);
                    }
                }
            );
        } else {
            Log.error("Future::complete() : Can't complete Future with null result");
        }
        return this;
    }

}
/**
 * Created by rburson on 3/6/15.
 */


export class Promise<A> {

    private _future:Future<A>;

    constructor(label:string) {
        this._future = Future.createFuture<A>(label);
    }

    /** --------------------- PUBLIC ------------------------------*/

    isComplete():boolean {
        return this._future.isComplete;
    }

    complete(t:Try<A>):Promise<A> {
        //Log.debug('Promise calling complete on Future...');
        this._future.complete(t);
        return this;
    }

    failure(error) {
        this.complete(new Failure<A>(error));
    }

    get future():Future<A> {
        return this._future;
    }

    success(value:A) {
        this.complete(new Success<A>(value));
    }


}


/**
 * Created by rburson on 3/9/15.
 */


export interface TryClosure<A> { (): Try<A>;
}
export interface TryFn<A,B> { (value:A): Try<B>;
}
export interface CompletionListener<A> { (t:Try<A>):void;
}
export interface FailureListener { (failure):void;
}
export interface FutureFn<A,B> { (value:A):Future<B>;
}
export interface MapFn<A,B> { (value:A):B;
}
export interface SuccessListener<A> { (success:A):void;
}

