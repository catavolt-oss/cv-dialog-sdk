/**
 * Created by rburson on 8/29/17.
 */

import {ArrayUtil, Log} from "./util";

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

    map<B>(f:(value:A)=>B):Try<B> {
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

export interface TryClosure<A> { (): Try<A>;
}
export interface TryFn<A,B> { (value:A): Try<B>;
}

